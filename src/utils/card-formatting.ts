import { CardExpiry, CardType, CardTypeNames } from '../@types/card-types';

export const format464Spacing = (cardNumber: string): string =>
  [cardNumber.substring(0, 4), cardNumber.substring(4, 10), cardNumber.substring(10, 14)].join(' ').trim();

export const format465Spacing = (cardNumber: string): string =>
  [cardNumber.substring(0, 4), cardNumber.substring(4, 10), cardNumber.substring(10, 15)].join(' ').trim();

export const format466Spacing = (cardNumber: string): string =>
  [cardNumber.substring(0, 4), cardNumber.substring(4, 10), cardNumber.substring(10, 16)].join(' ').trim();

export const format4444Spacing = (cardNumber: string): string =>
  [
    cardNumber.substring(0, 4),
    cardNumber.substring(4, 8),
    cardNumber.substring(8, 12),
    cardNumber.substring(12, 16),
    cardNumber.substring(16, 20),
  ]
    .join(' ')
    .trim();

export const cardTypes = [
  {
    type: CardTypeNames.VISA,
    pattern: /^4/,
    format: format4444Spacing,
    minlength: 13,
    maxlength: 16,
    field_maxlength: 19,
    cvc_minlength: 3,
    cvc_maxlength: 3,
  },
  {
    type: CardTypeNames.MASTERCARD,
    pattern: /^((5[12345])|(2[2-7]))/,
    format: format4444Spacing,
    minlength: 16,
    maxlength: 16,
    field_maxlength: 19,
    cvc_minlength: 3,
    cvc_maxlength: 3,
  },
  {
    type: CardTypeNames.AMEX,
    pattern: /^3[47]/,
    format: format465Spacing,
    minlength: 15,
    maxlength: 15,
    field_maxlength: 17,
    cvc_minlength: 4,
    cvc_maxlength: 4,
  },
  {
    type: CardTypeNames.JCB,
    pattern: /^35[2-8]/,
    format: format466Spacing,
    minlength: 15,
    maxlength: 16,
    field_maxlength: 18,
    cvc_minlength: 3,
    cvc_maxlength: 3,
  },
  {
    type: CardTypeNames.MAESTRO,
    pattern: /^(5018|5020|5038|5893|6304|6759|676[123])/,
    format: format4444Spacing,
    minlength: 16,
    maxlength: 16,
    field_maxlength: 19,
    cvc_minlength: 3,
    cvc_maxlength: 3,
  },

  {
    type: CardTypeNames.DINERS,
    pattern: /^3(?:0[0-5]|[68][0-9])/,
    format: format464Spacing,
    minlength: 14,
    maxlength: 14,
    field_maxlength: 16,
    cvc_minlength: 3,
    cvc_maxlength: 3,
  },
] as CardType[];

export const UNKNOWN_CARD_TYPE = {
  type: 'card-unknown',
  pattern: /^[0-9]{14,19}$/,
  format: format4444Spacing,
  minlength: 14,
  maxlength: 16,
  field_maxlength: 19,
  cvc_minlength: 3,
  cvc_maxlength: 4,
} as unknown as CardType;

export const getCardType = (cardNo: string, allowCardTypes: CardTypeNames[] = []): CardType => {
  cardNo = cardNo.replace(/[^0-9]/g, '');
  if (!cardNo.length) {
    return UNKNOWN_CARD_TYPE;
  }
  for (const i in cardTypes) {
    if (allowCardTypes?.length && !allowCardTypes.includes(cardTypes[i].type)) {
      continue;
    }
    if (cardNo.match(cardTypes[i].pattern)) {
      return cardTypes[i];
    }
  }
  return UNKNOWN_CARD_TYPE;
};

export const formatCardNumber = (cardNumber: string): string => {
  cardNumber = cardNumber.replace(/[^0-9]+/g, '');
  if (!cardNumber.length) {
    return '';
  }
  const cardType = getCardType(cardNumber);
  cardNumber = cardNumber.substring(0, cardType.maxlength);
  return cardType.format(cardNumber);
};

export const formatCardCVC = (cvcNumber: string): string => {
  return cvcNumber.replace(/[^0-9]+/g, '');
};

export const formatCardExpiry = (cardExpiry: string): string => {
  return cardExpiry
    .replace(
      /[^0-9/]/g,
      '' // To allow only numbers & slash
    )
    .replace(
      /^([0-9]{1}[0-9]{1})([0-9]{1,2}).*/g,
      '$1/$2' // To handle 113 > 11/3
    )
    .replace(
      /\/([ 0-9]+)\//g,
      '/$1' // Removes duplicate slashes with a number
    )
    .replace(
      /\/*\//g,
      '/' // Removes duplicate slashes
    )
    .replace(
      /([0-9]{2})[0-9]/,
      '$1' // Remove triple digits (can only occur on a single month digit
    );
};

export const buildCardExpiry = (cardExpiry: string): CardExpiry => {
  const parts = cardExpiry.split('/');
  return { month: parts[0] || '', year: parts[1] || '' };
};

const SECOND_DAY_OF_EXPIRY_MONTH = 2;
export const isExpired = (year: string, month: string): boolean => {
  // the card technically expires one day after the end of that expiry month (the first day of the upcoming month after the expiy month)
  // Instead of comparing with the first day after the end of the expiry month, here we compare the second day
  // because we don't know what time zone a payment gateway is based on, comparing the second day gives more leniency
  const expiryYearInFour = new Date().getFullYear().toString().slice(0, 2) + year;
  const expiryDate = new Date(parseInt(expiryYearInFour), parseInt(month), SECOND_DAY_OF_EXPIRY_MONTH);
  return expiryDate < new Date();
};
