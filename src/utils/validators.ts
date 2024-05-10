import { CardDetails, CardTypeNames } from '../@types/card-types';
import { formatCardExpiry, getCardType, isExpired } from './card-formatting';
import { luhnCheck } from './luhn';

export enum CardValidationStatus {
  // card number
  NO_CARD_NUMBER = 'Please enter a card number',
  INVALID_CARD_NUMBER = 'Your card number is invalid',
  // card name
  NO_CARD_NAME = 'Please enter a card name',
  // card expiration
  NO_CARD_EXPIRY = 'Please enter a card expiry',
  INVALID_CARD_EXPIRY = 'Invalid card expiry',
  CARD_EXPIRED = 'Your card is expired',
  // card cvv
  NO_CARD_CVV = 'Please enter a security code',
  INVALID_CARD_CVV = 'Invalid security code',
  // no errors
  NO_ERRORS = '',
}

export interface ValidationErrors {
  card_number: string;
  card_name: string;
  card_expiry: string;
  card_cvv: string;
}

export enum eventType {
  BLUR = 'blur',
  CHANGE = 'change',
  SUBMIT = 'submit',
}

const cardNumberValidate = (event: eventType, error: string, value: string): string => {
  const number = value.replace(/[^0-9]/g, '');
  if (error || event === eventType.BLUR || event === eventType.SUBMIT) {
    if (!number) {
      return CardValidationStatus.NO_CARD_NUMBER;
    }
    if (number.length < 16) {
      return CardValidationStatus.INVALID_CARD_NUMBER;
    }
    if (!luhnCheck(number)) {
      return CardValidationStatus.INVALID_CARD_NUMBER;
    }
  }
  return CardValidationStatus.NO_ERRORS;
};

const cardNameValidate = (event: eventType, error: string, value: string): string => {
  if (error || event === eventType.BLUR || event === eventType.SUBMIT) {
    if (!value) {
      return CardValidationStatus.NO_CARD_NAME;
    }
  }
  return CardValidationStatus.NO_ERRORS;
};

const cardExpirationValidate = (event: eventType, error: string, value: string): string => {
  if (error || event === eventType.BLUR || event === eventType.SUBMIT) {
    if (!value) {
      return CardValidationStatus.NO_CARD_EXPIRY;
    }
    if (!value.match(/^(0[1-9]|1[0-2]|[1-9])\/?([0-9]{2})$/)) {
      return CardValidationStatus.INVALID_CARD_EXPIRY;
    }
    const [cardMonth, cardYear] = value.split('/');
    // This intentionally allows 1 month of leeway for timezone issues on the last day of a month
    if (isExpired(cardYear, cardMonth)) {
      return CardValidationStatus.CARD_EXPIRED;
    }
  }
  return CardValidationStatus.NO_ERRORS;
};

const cardCvvValidate = (event: eventType, error: string, value: string, cardType: string): string => {
  if (error || event === eventType.BLUR || event === eventType.SUBMIT) {
    if (!value) {
      return CardValidationStatus.NO_CARD_CVV;
    }
    if ((cardType === CardTypeNames.AMEX && !value.match(/^[0-9]{4}$/)) || !value.match(/^[0-9]{3}$/)) {
      return CardValidationStatus.INVALID_CARD_CVV;
    }
  }
  return CardValidationStatus.NO_ERRORS;
};

const validationTriggers = {
  card_number: cardNumberValidate,
  card_name: cardNameValidate,
  card_expiry: cardExpirationValidate,
  card_cvv: cardCvvValidate,
};

export const validateInput = (
  event: eventType,
  key: string,
  value: string,
  cardType: string,
  errors: ValidationErrors,
  setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>
): void => {
  const validator = validationTriggers[key];
  setErrors({ ...errors, [key]: validator(event, errors[key], value, cardType) });
};

export const validateAllInputs = (cardDetails: CardDetails): ValidationErrors => {
  return [
    ['card_number', cardNumberValidate(eventType.SUBMIT, '', cardDetails.number)],
    ['card_name', cardNameValidate(eventType.SUBMIT, '', cardDetails.nameOnCard)],
    [
      'card_expiry',
      cardExpirationValidate(
        eventType.SUBMIT,
        '',
        formatCardExpiry(cardDetails.expiry.month + cardDetails.expiry.year)
      ),
    ],
    [
      'card_cvv',
      cardCvvValidate(eventType.SUBMIT, '', cardDetails.securityCode, getCardType(cardDetails.number)?.type),
    ],
  ]
    .filter((error) => error[1]?.length !== 0)
    .reduce((acc, validator) => {
      const [key, error] = validator;
      acc[key] = error;
      return acc;
    }, {}) as ValidationErrors;
};
