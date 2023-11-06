import { ErrorMessageType } from './message-types';

export enum WalletPaymentStatus {
  SUCCESS = 'SUCCESS',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
}

export type WalletPaymentResult = {
  status: WalletPaymentStatus;
  error?: {
    errorMessage: string;
    errorType: ErrorMessageType;
    errorCode?: string;
    gatewayCode?: string;
  };
};

export type WalletPaymentInitResult = {
  googlePaySupported?: boolean;
};
