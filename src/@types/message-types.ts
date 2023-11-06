export enum SuccessMessageType {
  SECRET_INITIALISED = 'SECRET_INITIALISED',
  SUBMIT_SUCCESS = 'SUBMIT_SUCCESS',
  INVOKE_3DSECURE_METHOD = 'INVOKE_3DSECURE_METHOD',
  INVOKE_3DSECURE_CHALLENGE = 'INVOKE_3DSECURE_CHALLENGE',
  CLOSE_3DSECURE_CHALLENGE = 'CLOSE_3DSECURE_CHALLENGE',
}

export enum ErrorMessageType {
  PAYSHEET_INIT_FAILED = 'PAYSHEET_INIT_FAILED',
  INVALID_PAY_SECRET = 'INVALID_PAY_SECRET',
  NOT_INITIALISED = 'NOT_INITIALISED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  NO_FORM = 'NO_FORM',
  INVALID_CARD_TYPE = 'INVALID_CARD_TYPE',
  INVALID_CARD_DETAILS = 'INVALID_CARD_DETAILS',
  SERVER_ERROR = 'SERVER_ERROR',
  ALREADY_PROCESSED = 'ALREADY_PROCESSED',
  TIMEOUT = 'TIMEOUT',
  INVALID_ACTION = 'INVALID_ACTION',
  NO_PAY_SECRET = 'NO_PAY_SECRET',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  ENVIRONMENT_MISMATCH = 'ENVIRONMENT_MISMATCH',
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
  [ErrorMessageType.NO_FORM]: {
    type: ErrorMessageType.NO_FORM,
    message: 'No form',
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
  [ErrorMessageType.ALREADY_PROCESSED]: {
    type: ErrorMessageType.ALREADY_PROCESSED,
    message: 'PayRequest already processed',
  },
  [ErrorMessageType.TIMEOUT]: {
    type: ErrorMessageType.TIMEOUT,
    message: 'Timeout',
  },
  [ErrorMessageType.INVALID_ACTION]: {
    type: ErrorMessageType.INVALID_ACTION,
    message: 'Invalid action',
  },
  [ErrorMessageType.NO_PAY_SECRET]: {
    type: ErrorMessageType.NO_PAY_SECRET,
    message: 'No pay secret provided',
  },
  [ErrorMessageType.UNKNOWN_ERROR]: {
    type: ErrorMessageType.UNKNOWN_ERROR,
    message: 'Unknown error occurred',
  },
  [ErrorMessageType.ENVIRONMENT_MISMATCH]: {
    type: ErrorMessageType.ENVIRONMENT_MISMATCH,
    message: 'There is an environment mismatch. Check TyroProvider was initialised with the correct value for liveMode',
  },
};

export interface SuccessMessage {
  success: SuccessMessageType;
}

export interface Invoke3DSecureMethodMessage extends SuccessMessage {
  threeDSMethodUrl: string;
}

export interface Invoke3DSecureChallengeMessage extends SuccessMessage {
  challengeUrl: string;
}

export interface ErrorMessage {
  errorType: string;
  errorCode?: string;
  errorMessage: string;
  gatewayCode?: string;
}

export type MessageResponse = SuccessMessage | ErrorMessage;
