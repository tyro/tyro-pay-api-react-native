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
      enabled: true,
    },
    googlePay: {
      enabled: true,
    },
    creditCardForm: {
      enabled: true,
    },
  },
} as TyroPayOptions;
