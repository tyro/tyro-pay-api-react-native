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

export const defaultSupportedNetworks = Object.values(CardTypeNames);

interface AppleWalletInitParams {
  enabled: boolean;
  merchantIdentifier: string;
  supportedNetworks: SupportedNetworksApplePay[];
}

interface GoogleWalletInitParams {
  enabled: boolean;
  merchantName: string;
  supportedNetworks: SupportedNetworksGooglePay[];
}
interface CreditCardFormInitParams {
  enabled: boolean;
  supportedNetworks: SupportedNetworks[];
}

interface OptionParams {
  applePay: AppleWalletInitParams;
  googlePay: GoogleWalletInitParams;
  creditCardForm: CreditCardFormInitParams;
}

export interface InitTyroParams {
  liveMode: boolean;
  options: OptionParams;
}
