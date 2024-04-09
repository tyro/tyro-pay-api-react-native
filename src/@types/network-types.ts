import { CardTypeNames } from './card-types';

export type SupportedNetworks = `${CardTypeNames}`;

export const SupportedCardsGooglePay = [
  CardTypeNames.AMEX,
  CardTypeNames.JCB,
  CardTypeNames.MASTERCARD,
  CardTypeNames.VISA,
] as const;

export const SupportedCardsApplePay = [
  CardTypeNames.AMEX,
  CardTypeNames.JCB,
  CardTypeNames.MASTERCARD,
  CardTypeNames.VISA,
  CardTypeNames.MAESTRO,
] as const;

export type SupportedNetworksGooglePay = `${(typeof SupportedCardsGooglePay)[number]}`;
export type SupportedNetworksApplePay = `${(typeof SupportedCardsApplePay)[number]}`;
