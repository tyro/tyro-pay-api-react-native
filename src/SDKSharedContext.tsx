import * as React from 'react';
import { createContext, createRef, useContext, useState } from 'react';
import { View } from 'react-native';
import { TyroPayOptions, TyroPayOptionsKeys } from './@types/definitions';
import { ErrorMessage, ErrorMessageType, TyroErrorMessages } from './@types/message-types';
import { ClientPayRequestResponse, PayRequestStatus, ThreeDSecureStatus } from './@types/pay-request-types';
import { SupportedNetworks } from './@types/tyro-sdk';
import { getCardType, UNKNOWN_CARD_TYPE } from './utils/card-formatting';
import { CardDetails } from './@types/card-types';
import { errorMessage } from './utils/error-message';
import { getPayRequest, pollPayCompletion, submitPayRequest } from './clients/pay-request-client';
import {
  pollFor3DSecureAuthResult,
  pollFor3DSecureChallengeAndFinalResult,
  pollFor3DSecureMethodResult,
} from './clients/three-d-secure-client';
import { invoke3DSecureAuth } from './services/3dsecure-auth-service';
import { ThreeDSCheckType } from './@types/3d-secure';
import { WalletPaymentResult, WalletPaymentStatus } from './@types/wallet-payment-result';

type SDKContextProps = {
  options: TyroPayOptions;
  paySecret: string | null;
  supportedNetworks: SupportedNetworks[] | null;
  setPayRequestIsLoading: (loading: boolean) => void;
  setTyroErrorMessage: (errorMessage: ErrorMessage | null) => void;
  setPayRequest: (payRequest: ClientPayRequestResponse | null) => void;
};

type SDKUseContextProps = SDKContextProps & {
  threeDSCheck: ThreeDSCheckType;
  cardDetails: CardDetails;
  isSubmitting: boolean;
  setCardDetails: (cardDetails: CardDetails) => void;
  handleSubmit: (cardDetails: CardDetails) => Promise<void>;
  handleWalletPaymentStatusUpdate: (paySecret: string, walletPaymentResult: WalletPaymentResult) => Promise<void>;
};

const SDKContext = createContext({} as SDKUseContextProps);

type SDKContext = {
  children: React.ReactNode;
  tyroProvider: SDKContextProps;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sdkReactNativeContextRef = createRef<any>();

const SDKProvider = ({ children, tyroProvider }: SDKContext): JSX.Element => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [threeDSCheck, setThreeDSCheck] = useState({ isTrue: false, url: '' });
  const { options, paySecret, supportedNetworks, setPayRequestIsLoading, setTyroErrorMessage, setPayRequest } =
    tyroProvider;
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    nameOnCard: '',
    number: '',
    expiry: { month: '', year: '' },
    securityCode: '',
  });
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

  const handleSubmit = async (cardDetails: CardDetails): Promise<void> => {
    if (!paySecret) {
      setTyroErrorMessage(errorMessage(TyroErrorMessages[ErrorMessageType.NO_PAY_SECRET]));
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

  const handleWalletPaymentStatusUpdate = async (
    paySecret: string,
    walletPaymentResult: WalletPaymentResult
  ): Promise<void> => {
    const { status, error } = walletPaymentResult;
    if (error) {
      const { errorMessage: message, errorType: type, errorCode, gatewayCode } = error;
      setTyroErrorMessage(errorMessage({ type, message }, errorCode, gatewayCode));
    } else if (status === WalletPaymentStatus.SUCCESS) {
      setTyroErrorMessage(null);
    }
    const payRequest = await getPayRequest(paySecret);
    setPayRequest(payRequest);
  };

  const providerValues = {
    options,
    paySecret,
    supportedNetworks,
    threeDSCheck,
    cardDetails,
    isSubmitting,
    setPayRequestIsLoading,
    setTyroErrorMessage,
    setPayRequest,
    setCardDetails,
    handleSubmit,
    handleWalletPaymentStatusUpdate,
  };

  return (
    <SDKContext.Provider value={providerValues}>
      <View ref={sdkReactNativeContextRef}>{children}</View>
    </SDKContext.Provider>
  );
};

export const useSDK = (): SDKUseContextProps => useContext(SDKContext);

export default SDKProvider;
