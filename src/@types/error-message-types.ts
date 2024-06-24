export enum ErrorMessageType {
  CLIENT_INITIALISATION_ERROR = 'CLIENT_INITIALISATION_ERROR',
  PAY_REQUEST_ERROR = 'PAY_REQUEST_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  CARD_ERROR = 'CARD_ERROR',
}

export enum ErrorCodes {
  // client init errors
  ENVIRONMENT_MISMATCH = 'ENVIRONMENT_MISMATCH',
  WALLET_INIT_FAILED = 'WALLET_INIT_FAILED',
  NOT_INITIALISED = 'NOT_INITIALISED',
  MISSING_MERCHANT_CONFIG = 'MISSING_MERCHANT_CONFIG',
  NO_PAY_SECRET = 'NO_PAY_SECRET',

  //  payrequest errors
  PAY_REQUEST_INVALID_STATUS = 'PAY_REQUEST_INVALID_STATUS',

  // card errors
  INVALID_CARD_TYPE = 'INVALID_CARD_TYPE',
  INVALID_CARD_DETAILS = 'INVALID_CARD_DETAILS',

  // server errors
  TIMEOUT = 'TIMEOUT',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  FAILED_TO_SUBMIT = 'FAILED_TO_SUBMIT',
}

export type TyroErrorMessage = { type: ErrorMessageType; message: string };

export const TyroErrorMessages: Record<ErrorMessageType, TyroErrorMessage> = {
  [ErrorMessageType.CLIENT_INITIALISATION_ERROR]: {
    type: ErrorMessageType.CLIENT_INITIALISATION_ERROR,
    message: 'There was an error initialising the client',
  },
  [ErrorMessageType.PAY_REQUEST_ERROR]: {
    type: ErrorMessageType.PAY_REQUEST_ERROR,
    message: 'There was an error with the pay request, either validation error or payment failed.',
  },
  [ErrorMessageType.SERVER_ERROR]: {
    type: ErrorMessageType.SERVER_ERROR,
    message: 'There was a server error',
  },
  [ErrorMessageType.CARD_ERROR]: {
    type: ErrorMessageType.CARD_ERROR,
    message: 'There was a card error.',
  },
};

export interface ErrorMessage {
  errorType: string;
  errorCode?: string;
  errorMessage: string;
  gatewayCode?: string;
}
