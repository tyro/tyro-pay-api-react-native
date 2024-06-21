export enum ErrorMessageType {
  PAYSHEET_INIT_FAILED = 'PAYSHEET_INIT_FAILED',
  INVALID_PAY_SECRET = 'INVALID_PAY_SECRET',
  NOT_INITIALISED = 'NOT_INITIALISED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  MISSING_MERCHANT_CONFIG = 'MISSING_MERCHANT_CONFIG',
  INVALID_CARD_TYPE = 'INVALID_CARD_TYPE',
  INVALID_CARD_DETAILS = 'INVALID_CARD_DETAILS',
  SERVER_ERROR = 'SERVER_ERROR',
  TIMEOUT = 'TIMEOUT',
  NO_PAY_SECRET = 'NO_PAY_SECRET',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  FAILED_TO_SUBMIT = 'FAILED_TO_SUBMIT',
}

export enum ErrorCodes {
  PAY_REQUEST_INVALID_STATUS = 'PAY_REQUEST_INVALID_STATUS',
  ENVIRONMENT_MISMATCH = 'ENVIRONMENT_MISMATCH',
  PAY_REQUEST_SECRET_REQUIRED = 'PAY_REQUEST_SECRET_REQUIRED',
  WALLET_INIT_FAILED = 'WALLET_INIT_FAILED',
}

export type TyroErrorMessage = { type: ErrorMessageType; message: string };

export const TyroErrorMessages: Record<ErrorMessageType, TyroErrorMessage> = {
  [ErrorMessageType.PAYSHEET_INIT_FAILED]: {
    type: ErrorMessageType.PAYSHEET_INIT_FAILED,
    message: 'PaySheet failed to initialise',
  },
  [ErrorMessageType.INVALID_PAY_SECRET]: {
    type: ErrorMessageType.INVALID_PAY_SECRET,
    message: 'The pay secret provided is invalid',
  },
  [ErrorMessageType.NOT_INITIALISED]: {
    type: ErrorMessageType.NOT_INITIALISED,
    message: 'TyroProvider not initialised',
  },
  [ErrorMessageType.PAYMENT_FAILED]: {
    type: ErrorMessageType.PAYMENT_FAILED,
    message: 'Payment failed',
  },
  [ErrorMessageType.MISSING_MERCHANT_CONFIG]: {
    type: ErrorMessageType.MISSING_MERCHANT_CONFIG,
    message: 'TyroProvider Failed to init due to missing Google and/or Apple Pay merchant details',
  },
  [ErrorMessageType.INVALID_CARD_TYPE]: {
    type: ErrorMessageType.INVALID_CARD_TYPE,
    message: 'Card type not supported.',
  },
  [ErrorMessageType.INVALID_CARD_DETAILS]: {
    type: ErrorMessageType.INVALID_CARD_DETAILS,
    message: 'Invalid card details',
  },
  [ErrorMessageType.SERVER_ERROR]: {
    type: ErrorMessageType.SERVER_ERROR,
    message: 'Server error',
  },
  [ErrorMessageType.TIMEOUT]: {
    type: ErrorMessageType.TIMEOUT,
    message: 'Timeout',
  },
  [ErrorMessageType.NO_PAY_SECRET]: {
    type: ErrorMessageType.NO_PAY_SECRET,
    message: 'No pay secret provided',
  },
  [ErrorMessageType.UNKNOWN_ERROR]: {
    type: ErrorMessageType.UNKNOWN_ERROR,
    message: 'Unknown error occurred',
  },
  [ErrorMessageType.FAILED_TO_SUBMIT]: {
    type: ErrorMessageType.FAILED_TO_SUBMIT,
    message: 'Failed to submit the payment',
  },
};

export interface ErrorMessage {
  errorType: string;
  errorCode?: string;
  errorMessage: string;
  gatewayCode?: string;
}
