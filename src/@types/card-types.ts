export enum CardTypeNames {
  VISA = 'visa',
  MASTERCARD = 'mastercard',
  AMEX = 'amex',
  JCB = 'jcb',
  MAESTRO = 'maestro',
  DINERS = 'diners',
}

export enum CardImageNames {
  UNKNOWN = 'card-unknown',
  PREVIEW = 'card-preview',
  CVV = 'card-cvv',
  ERROR = 'card-error',
}

export interface CardDetails {
  nameOnCard: string;
  number: string;
  expiry: CardExpiry;
  securityCode: string;
}

export interface CardExpiry {
  month: string;
  year: string;
}

export interface CardType {
  type: CardTypeNames;
  pattern: RegExp;
  format: (cardNo: string) => string;
  minlength: number;
  maxlength: number;
  field_maxlength: number;
  cvc_minlength: number;
  cvc_maxlength: number;
}
