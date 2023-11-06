import * as React from 'react';
import { useState, createContext, useEffect, createRef, useContext } from 'react';
import { TyroPayOptions, TyroPayOptionsProps } from './@types/definitions';
import { View } from 'react-native';
import { ClientPayRequestResponse, PayRequestStatus } from './@types/pay-request-types';
import TyroSDK from './TyroSDK';
import { ErrorMessage, ErrorMessageType, TyroErrorMessages } from './@types/message-types';
import { errorMessage } from './utils/error-message';
import { SupportedNetworks } from './@types/tyro-sdk';
import { parseSupportedNetworks, sanitizeOptions } from './utils/sanitizers';
import SDKProvider from './SDKSharedContext';

export type TyroPayContextProps = {
  initialised: boolean | null;
  payRequest: ClientPayRequestResponse | null;
  isPayRequestReady: boolean;
  isPayRequestLoading: boolean;
  tyroError: ErrorMessage | null;
  initPaySheet: (paySecret: string) => Promise<void>;
  hasPayRequestCompleted: () => boolean;
};

export const TyroPayContext = createContext({} as TyroPayContextProps);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tyroReactNativeContextRef = createRef<any>();

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
      if (initWalletPayResult.googlePaySupported === false) {
        setOptions((options) => ({
          ...options,
          options: { ...options.options, googlePay: { ...options.options.googlePay, enabled: false } },
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

  const providerValues = {
    initialised,
    payRequest,
    isPayRequestReady,
    isPayRequestLoading,
    tyroError: tyroError,
    initPaySheet,
    hasPayRequestCompleted,
  };

  const sdkProviderValues = {
    options: cleanedOptions,
    paySecret,
    supportedNetworks,
    setPayRequestIsLoading,
    setTyroErrorMessage,
    setPayRequest,
  };

  return (
    <TyroPayContext.Provider value={providerValues}>
      <View ref={tyroReactNativeContextRef}>
        <SDKProvider tyroProvider={sdkProviderValues}>{children}</SDKProvider>
      </View>
    </TyroPayContext.Provider>
  );
};

export const useTyro = (): TyroPayContextProps => useContext(TyroPayContext);

export default TyroProvider;
