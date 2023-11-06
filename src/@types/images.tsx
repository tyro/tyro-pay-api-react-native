import { CardImageNames, CardTypeNames } from './card-types';

import CardUnknown from '../images/card-unknown';
import CardCVV from '../images/card-cvv';
import CardError from '../images/card-error';
import CardVisa from '../images/visa';
import CardMastercard from '../images/mastercard';
import CardAmex from '../images/amex';
import CardDiners from '../images/diners';
import CardJCB from '../images/jcb';
import CardMaestro from '../images/maestro';

export const ImageSources = {
  [CardImageNames.UNKNOWN]: CardUnknown,
  [CardImageNames.CVV]: CardCVV,
  [CardImageNames.ERROR]: CardError,
  [CardTypeNames.VISA]: CardVisa,
  [CardTypeNames.MASTERCARD]: CardMastercard,
  [CardTypeNames.AMEX]: CardAmex,
  [CardTypeNames.DINERS]: CardDiners,
  [CardTypeNames.JCB]: CardJCB,
  [CardTypeNames.MAESTRO]: CardMaestro,
};
