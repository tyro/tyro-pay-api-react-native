import { CardTypeNames } from './card-types';
import { TyroPayOptions } from './definitions';
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
    },
    googlePay: {
      enabled: false,
    },
    creditCardForm: {
      enabled: true,
    },
  },
} as TyroPayOptions;

export const defaultSupportedNetworks = Object.values(CardTypeNames);
