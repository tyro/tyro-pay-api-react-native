import { CardTypeNames } from './card-types';

export type SupportedNetworks = `${CardTypeNames}`;

export type SupportedNetworksGooglePay = `${Extract<
  CardTypeNames,
  CardTypeNames.AMEX | CardTypeNames.JCB | CardTypeNames.MASTERCARD | CardTypeNames.VISA
>}`;

export type SupportedNetworksApplePay = `${Extract<
  CardTypeNames,
  CardTypeNames.AMEX | CardTypeNames.JCB | CardTypeNames.MASTERCARD | CardTypeNames.VISA | CardTypeNames.MAESTRO
>}`;
