import * as React from 'react';
import { createContext, createRef, useContext } from 'react';
import { View } from 'react-native';
import { TyroPayOptions } from './@types/definitions';
import { ErrorMessage } from './@types/message-types';
import { ClientPayRequestResponse } from './@types/pay-request-types';
import { SupportedNetworks } from './@types/network-types';
import { CardDetails } from './@types/card-types';
import { errorMessage } from './utils/error-message';
import { getPayRequest } from './clients/pay-request-client';
import { ThreeDSCheckType } from './@types/3d-secure';
import { WalletPaymentResult, WalletPaymentStatus } from './@types/wallet-payment-result';
import { ValidationErrors } from './utils/validators';

type SDKContextProps = {
  options: TyroPayOptions;
  paySecret: string | null;
  supportedNetworks: SupportedNetworks[] | null;
  cardDetails: CardDetails;
  validationErrors: ValidationErrors;
  threeDSCheck: ThreeDSCheckType;
  setValidationErrors: (ValidationErrors: ValidationErrors) => void;
  setPayRequestIsLoading: (loading: boolean) => void;
  setTyroErrorMessage: (errorMessage: ErrorMessage | null) => void;
  setPayRequest: (payRequest: ClientPayRequestResponse | null) => void;
  setCardDetails: (cardDetails: CardDetails) => void;
};

type SDKUseContextProps = SDKContextProps & {
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
  const {
    options,
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
  } = tyroProvider;

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
    validationErrors,
    setPayRequestIsLoading,
    setTyroErrorMessage,
    setPayRequest,
    setCardDetails,
    setValidationErrors,
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
