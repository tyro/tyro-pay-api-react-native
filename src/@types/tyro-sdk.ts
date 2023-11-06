import { CardTypeNames } from './card-types';

export enum SupportedCardNetworks {
  VISA = CardTypeNames.VISA,
  MASTERCARD = CardTypeNames.MASTERCARD,
  AMEX = CardTypeNames.AMEX,
  JCB = CardTypeNames.JCB,
}

export type SupportedNetworks = SupportedCardNetworks | `${SupportedCardNetworks}`;

interface AppleInitParams {
  merchantIdentifier: string;
}

interface GoogleInitParams {
  merchantName: string;
}

interface BaseWalletParams {
  enabled: boolean;
  supportedNetworks: SupportedNetworks[];
}

interface AppleWalletInitParams extends AppleInitParams, BaseWalletParams {}

interface GoogleWalletInitParams extends GoogleInitParams, BaseWalletParams {}

interface OptionParams {
  applePay: AppleWalletInitParams;
  googlePay: GoogleWalletInitParams;
  creditCardForm: boolean;
}

export interface InitTyroParams {
  liveMode: boolean;
  options: OptionParams;
}
