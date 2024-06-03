import * as React from 'react';
import { useState, createContext, useEffect, useContext } from 'react';
import { TyroPayOptions, TyroPayOptionsKeys, TyroPayOptionsProps } from './@types/definitions';
import { ClientPayRequestResponse, PayRequestStatus, ThreeDSecureStatus } from './@types/pay-request-types';
import TyroSDK from './TyroSDK';
import { ErrorMessage, ErrorMessageType, TyroErrorMessages } from './@types/message-types';
import { errorMessage } from './utils/error-message';
import { SupportedNetworks } from './@types/network-types';
import { parseSupportedNetworks, sanitizeOptions } from './utils/sanitizers';
import SDKProvider from './SDKSharedContext';
import { ValidationErrors, validateAllInputs } from './utils/validators';
import { CardDetails } from './@types/card-types';
import {
  pollFor3DSecureAuthResult,
  pollFor3DSecureChallengeAndFinalResult,
  pollFor3DSecureMethodResult,
} from './clients/three-d-secure-client';
import { submitPayRequest, pollPayCompletion } from './clients/pay-request-client';
import { invoke3DSecureAuth } from './services/3dsecure-auth-service';
import { getCardType, UNKNOWN_CARD_TYPE } from './utils/card-formatting';

export type TyroPayContextProps = {
  initialised: boolean | null;
  payRequest: ClientPayRequestResponse | null;
  isPayRequestReady: boolean;
  isPayRequestLoading: boolean;
  isSubmitting: boolean;
  tyroError: ErrorMessage | null;
  initPaySheet: (paySecret: string) => Promise<void>;
  hasPayRequestCompleted: () => boolean;
  submitPayForm: () => Promise<void>;
};

export const TyroPayContext = createContext({} as TyroPayContextProps);

type TyroPayContext = {
  children: React.ReactNode;
  options: TyroPayOptionsProps;
};

const FINAL_STATUSES = [PayRequestStatus.SUCCESS, PayRequestStatus.FAILED, PayRequestStatus.VOIDED];

const TyroProvider = ({ children, options }: TyroPayContext): JSX.Element => {
  const useOptions = sanitizeOptions(options);

  // Store options
  const [cleanedOptions, setOptions] = useState<TyroPayOptions>(useOptions);
  const [initialised, setInitialised] = useState<boolean | null>(null);
  const [payRequest, setPayRequest] = useState<ClientPayRequestResponse | null>(null);
  const [isPayRequestReady, setPayRequestReady] = useState<boolean>(false);
  const [isPayRequestLoading, setPayRequestIsLoading] = useState<boolean>(false);
  const [tyroError, setTyroErrorMessage] = useState<ErrorMessage | null>(null);
  const [paySecret, setPaySecret] = useState<string | null>(null);
  const [supportedNetworks, setSupportedNetworks] = useState<SupportedNetworks[] | null>(
    useOptions?.options?.creditCardForm?.supportedNetworks ?? null
  );
  const [threeDSCheck, setThreeDSCheck] = useState({ isTrue: false, url: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({} as ValidationErrors);

  const [cardDetails, setCardDetails] = useState<CardDetails>({
    nameOnCard: '',
    number: '',
    expiry: { month: '', year: '' },
    securityCode: '',
  });

  useEffect(() => {
    const initTyroSDK = async (options: TyroPayOptions): Promise<void> => {
      await TyroSDK.init(options);
    };
    if (!initialised) {
      initTyroSDK(cleanedOptions)
        .then(() => {
          setInitialised(true);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    setTyroErrorMessage(null);
  }, [paySecret]);

  useEffect(() => {
    if (payRequest) {
      const parsedNetworks = parseSupportedNetworks(
        payRequest.supportedNetworks,
        options?.options?.creditCardForm?.supportedNetworks
      );
      setSupportedNetworks(parsedNetworks);
    } else {
      setSupportedNetworks(null);
    }
  }, [payRequest, options]);

  const readyPaySheet = (payRequest: ClientPayRequestResponse): void => {
    setPayRequest(payRequest);
    setPayRequestReady(true);
    setPayRequestIsLoading(false);
  };

  async function initPaySheet(paySecret: string): Promise<void> {
    if (!verifyInitialisation()) {
      setTyroErrorMessage(errorMessage(TyroErrorMessages[ErrorMessageType.NOT_INITIALISED]));
      return;
    }
    try {
      setPayRequestIsLoading(true);
      const payRequest = await TyroSDK.initPaySheet(paySecret, cleanedOptions.liveMode);
      const initWalletPayResult = await TyroSDK.initWalletPay(cleanedOptions);
      if (!initWalletPayResult.paymentSupported) {
        setOptions((options) => ({
          ...options,
          options: {
            ...options.options,
            googlePay: { ...options.options.googlePay, enabled: false },
            applePay: { ...options.options.applePay, enabled: false },
          },
        }));
      }
      setPaySecret(paySecret);
      readyPaySheet(payRequest);
    } catch (error) {
      setPayRequestIsLoading(false);
      setPayRequestReady(false);
      setTyroErrorMessage(errorMessage(TyroErrorMessages[ErrorMessageType.PAYSHEET_INIT_FAILED]));
    }
  }

  const verifyInitialisation = (): boolean => {
    if (!initialised || !options) {
      return false;
    }
    return true;
  };

  const hasPayRequestCompleted = (): boolean => {
    return !!payRequest && FINAL_STATUSES.includes(payRequest.status);
  };

  const updatePaySheet = (payRequest: ClientPayRequestResponse): void => {
    setCardDetails({
      nameOnCard: '',
      number: '',
      expiry: { month: '', year: '' },
      securityCode: '',
    });
    setPayRequest(payRequest);
  };

  const handleCompletedPayRequest = (payRequest: ClientPayRequestResponse): void => {
    if (payRequest.status === PayRequestStatus.SUCCESS) {
      updatePaySheet(payRequest);
      setPayRequest(payRequest);
      setTyroErrorMessage(null);
      return;
    }
    updatePaySheet(payRequest);
    setPayRequest(payRequest);
    setTyroErrorMessage(errorMessage(TyroErrorMessages[ErrorMessageType.PAYMENT_FAILED], payRequest.errorCode));
    return;
  };

  const handleThreeDSChallenge = async (paySecret: string): Promise<void> => {
    const payRequest = await pollFor3DSecureChallengeAndFinalResult(paySecret);
    if (payRequest) {
      if (payRequest.threeDSecure?.status === ThreeDSecureStatus.FAILED) {
        updatePaySheet(payRequest);
        setTyroErrorMessage(errorMessage(TyroErrorMessages[ErrorMessageType.PAYMENT_FAILED], payRequest.errorCode));
        return;
      }
      handleCompletedPayRequest(payRequest);
      return;
    }
    setTyroErrorMessage(errorMessage(TyroErrorMessages[ErrorMessageType.TIMEOUT]));
  };

  const handleFrictionless = (payRequest: ClientPayRequestResponse): void => {
    handleCompletedPayRequest(payRequest);
  };

  const do3DSAuth = async (paySecret: string): Promise<void> => {
    let payRequest = await pollFor3DSecureMethodResult(paySecret);
    if (payRequest) {
      await invoke3DSecureAuth(paySecret);
      payRequest = await pollFor3DSecureAuthResult(paySecret);
      if (payRequest) {
        if (
          payRequest.threeDSecure?.challengeURL &&
          payRequest.threeDSecure?.status === ThreeDSecureStatus.AWAITING_CHALLENGE
        ) {
          // handle 3ds challenge
          setThreeDSCheck({ isTrue: true, url: payRequest.threeDSecure.challengeURL });
          await handleThreeDSChallenge(paySecret);
          setThreeDSCheck({ isTrue: false, url: '' });
          return;
        } else {
          // handle frictionless flow
          handleFrictionless(payRequest);
          return;
        }
      }
      setTyroErrorMessage(errorMessage(TyroErrorMessages[ErrorMessageType.TIMEOUT]));
    } else {
      setTyroErrorMessage(errorMessage(TyroErrorMessages[ErrorMessageType.SERVER_ERROR]));
    }
  };

  const handlePaymentStatusUpdate = async (
    payRequest: ClientPayRequestResponse | null,
    paySecret: string
  ): Promise<void> => {
    if (!payRequest) {
      setTyroErrorMessage(errorMessage(TyroErrorMessages[ErrorMessageType.SERVER_ERROR]));
      return;
    }
    switch (payRequest.status) {
      case PayRequestStatus.PROCESSING:
        setTyroErrorMessage(errorMessage(TyroErrorMessages[ErrorMessageType.TIMEOUT]));
        break;
      case PayRequestStatus.AWAITING_AUTHENTICATION:
        await do3DSAuth(paySecret);
        break;
      case PayRequestStatus.SUCCESS:
        updatePaySheet(payRequest);
        setPayRequest(payRequest);
        setTyroErrorMessage(null);
        break;
      case PayRequestStatus.FAILED:
      case PayRequestStatus.VOIDED:
        updatePaySheet(payRequest);
        setPayRequest(payRequest);
        setTyroErrorMessage(errorMessage(TyroErrorMessages[ErrorMessageType.PAYMENT_FAILED], payRequest.errorCode));
        break;
      default:
        updatePaySheet(payRequest);
        setTyroErrorMessage(errorMessage(TyroErrorMessages[ErrorMessageType.UNKNOWN_ERROR]));
        break;
    }
  };

  const submitPayForm = async (): Promise<void> => {
    if (isSubmitting) {
      return;
    }
    if (!paySecret) {
      setTyroErrorMessage(errorMessage(TyroErrorMessages[ErrorMessageType.NO_PAY_SECRET]));
      return;
    }
    const foundErrors = validateAllInputs(cardDetails);
    if (Object.keys(foundErrors).length) {
      setTyroErrorMessage(errorMessage(TyroErrorMessages[ErrorMessageType.INVALID_CARD_DETAILS]));
      setValidationErrors({ ...validationErrors, ...foundErrors });
      return;
    }
    if (supportedNetworks?.length) {
      const cardType = getCardType(cardDetails.number);
      if (
        cardType.type !== UNKNOWN_CARD_TYPE.type &&
        !supportedNetworks.includes(cardType.type as unknown as SupportedNetworks)
      ) {
        setTyroErrorMessage(errorMessage(TyroErrorMessages[ErrorMessageType.INVALID_CARD_TYPE]));
        return;
      }
    }
    try {
      setTyroErrorMessage(null);
      setIsSubmitting(true);
      await submitPayRequest(paySecret, cardDetails, options[TyroPayOptionsKeys.liveMode]);
    } catch (error) {
      setTyroErrorMessage(errorMessage(TyroErrorMessages[ErrorMessageType.PAYMENT_FAILED]));
      setIsSubmitting(false);
      return;
    }
    const payRequest = await pollPayCompletion(paySecret);
    await handlePaymentStatusUpdate(payRequest, paySecret);
    setIsSubmitting(false);
  };

  const providerValues = {
    initialised,
    payRequest,
    isPayRequestReady,
    isPayRequestLoading,
    isSubmitting,
    tyroError: tyroError,
    initPaySheet,
    hasPayRequestCompleted,
    submitPayForm,
  };

  const sdkProviderValues = {
    options: cleanedOptions,
    paySecret,
    supportedNetworks,
    cardDetails,
    validationErrors,
    threeDSCheck,
    setValidationErrors,
    setPayRequestIsLoading,
    setTyroErrorMessage,
    setPayRequest,
    setCardDetails,
  };

  return (
    <TyroPayContext.Provider value={providerValues}>
      <SDKProvider tyroProvider={sdkProviderValues}>{children}</SDKProvider>
    </TyroPayContext.Provider>
  );
};

export const useTyro = (): TyroPayContextProps => useContext(TyroPayContext);

export default TyroProvider;
