import { CardTypeNames } from './card-types';
import { TyroPayOptions } from './definitions';
import { SupportedNetworks } from './network-types';
import { applePayButtonDefaultStyles, googlePayButtonDefaultStyles, ThemeNames, ThemeStyles } from './theme-styles';

export const defaultOptions = {
  liveMode: false,
  theme: ThemeNames.DEFAULT,
  styleProps: {
    ...ThemeStyles.default,
    googlePayButton: googlePayButtonDefaultStyles,
    applePayButton: applePayButtonDefaultStyles,
  },
  options: {
    applePay: {
      enabled: false,
      supportedNetworks: ['mastercard', 'visa', 'amex', 'jcb', 'maestro'],
    },
    googlePay: {
      enabled: false,
    },
    creditCardForm: {
      enabled: true,
    },
  },
} as TyroPayOptions;

export const defaultSupportedNetworks = Object.values(CardTypeNames) as SupportedNetworks[];
