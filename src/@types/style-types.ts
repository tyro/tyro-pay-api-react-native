import { CardTypeNames as CardTypeNames } from './card-types';
import type { StyleProp, ViewStyle } from 'react-native';

export interface StyleProps
  extends Record<
    string,
    string | boolean | CardTypeNames[] | ApplePayButtonStyleProps | GooglePayButtonStyleProps | undefined
  > {
  bodyBackgroundColor?: string;
  bodyPadding?: string;
  bodyWidth?: string;
  bodyMinWidth?: string;
  bodyMaxWidth?: string;
  /*
  // @todo, implement this later
  fontFamily?: string;
  */
  inputBackgroundColor?: string;
  inputBorderColor?: string;
  inputBorderSize?: string;
  inputBorderRadius?: string;
  inputErrorFontColor?: string;
  inputErrorBorderColor?: string;
  inputErrorBorderSize?: string;
  inputFocusBackgroundColor?: string;
  inputFocusBorderColor?: string;
  inputFocusBorderSize?: string;
  inputFocusFontColor?: string;
  inputFontColor?: string;
  inputFontSize?: string;
  inputFontWeight?: string;
  inputPadding?: string;
  inputSpacing?: string;
  labelPosition?: string;
  labelFontColor?: string;
  labelFontSize?: string;
  labelFontWeight?: string;
  labelPadding?: string;
  errorBackgroundColor?: string;
  errorFontColor?: string;
  errorFontSize?: string;
  errorFontWeight?: string;
  errorPadding?: string;
  showCardIcon?: boolean;
  showErrorSpacing?: boolean;
  showSupportedCards?: boolean;
  walletPaymentsDividerText?: string;
  walletPaymentsDividerEnabled?: boolean;
  walletPaymentsButtonsWidth?: string;
  walletPaymentsButtonsMargin?: string;
  applePayButton?: ApplePayButtonStyleProps;
  googlePayButton?: GooglePayButtonStyleProps;
}

export interface ApplePayButtonStyleProps extends Record<string, string | undefined> {
  buttonBorderRadius?: string;
  buttonStyle?: ApplePayButtonStyle;
  buttonType?: ApplePayButtonType;
}

export enum ApplePayButtonType {
  PLAIN = 'plain',
  ADD_MONEY = 'add-money',
  BOOK = 'book',
  BUY = 'buy',
  CHECK_OUT = 'check-out',
  CONTINUE = 'continue',
  CONTRIBUTE = 'contribute',
  DONATE = 'donate',
  ORDER = 'order',
  PAY = 'pay',
  RELOAD = 'reload',
  RENT = 'rent',
  SET_UP = 'set-up',
  SUBSCRIBE = 'subscribe',
  SUPPORT = 'support',
  TIP = 'tip',
  TOP_UP = 'top-up',
}

export enum ApplePayButtonStyle {
  BLACK = 'black',
  WHITE_OUTLINE = 'white-outline',
  WHITE = 'white',
}

export interface GooglePayButtonStyleProps
  extends Record<string, undefined | number | GooglePayButtonColorType | GooglePayButtonType> {
  buttonColor?: GooglePayButtonColorType;
  buttonType?: GooglePayButtonType;
  buttonBorderRadius?: number;
}
export interface GooglePayButtonNativeProps {
  style?: StyleProp<ViewStyle>;
  buttonColor?: GooglePayButtonColorType;
  buttonType?: GooglePayButtonType;
  buttonBorderRadius?: number;
  testID: string;
}

export enum GooglePayButtonText {
  BOOK = 'book',
  BUY = 'buy',
  CHECKOUT = 'checkout',
  DONATE = 'donate',
  ORDER = 'order',
  PAY = 'pay',
  PLAIN = 'plain',
  SUBSCRIBE = 'subscribe',
}

export type GooglePayButtonType = GooglePayButtonText | `${GooglePayButtonText}`;

export enum GooglePayButtonColor {
  WHITE = 'white',
  BLACK = 'black',
  DEFAULT = 'default',
}

export type GooglePayButtonColorType = GooglePayButtonColor | `${GooglePayButtonColor}`;

export enum StyleLabelPositions {
  BLOCK = 'block',
  FLOATING = 'floating',
  INLINE = 'inline',
}

export enum StyleFontFamilys {
  ARIAL = 'arial',
  SERIF = 'serif',
  ROBOTO = 'roboto',
}

export type StyleProcessValue = string | string[] | boolean;

export const StyleTypes = {
  labelPosition: {
    pattern: '^' + Object.values(StyleLabelPositions).join('|') + '$',
  },
  fontFamily: {
    pattern: '^' + Object.values(StyleFontFamilys).join('|') + '$',
  },
  cardType: {
    pattern: '^' + Object.values(CardTypeNames).join('|') + '$',
  },
  color: {
    pattern: '^#(?:[0-9a-fA-F]{3}){1,2}$',
  },
  text: {
    pattern: /^[a-z0-9_?&@!\- ]*$/gi,
  },
  size: {
    pattern: /^(?:(?:[1-9]\d*|0)(?:\.\d+)?%?|auto)$/gim,
  },
  weight: {
    pattern: '^[1-9]00$|^(1000)$',
  },
  padding: {
    pattern: /^([ ]*((?:(?:[1-9]\d*|0)(?:\.\d+)?%?)[ ]*)){1,4}$/g,
  },
  boolean: {
    pattern: '^true|false|0|1$',
    process: (value: StyleProcessValue): boolean => {
      return value === 'true' || value === '1';
    },
  },
};

export type StyleProcessorType = {
  pattern: string | RegExp;
  process?: (value: StyleProcessValue) => string | boolean;
};

export type StyleProcessor = {
  type: StyleProcessorType;
  isArray?: boolean;
  process?: (value: StyleProcessValue, styleProps: StyleProps) => string;
  selector?: string;
  style?: string;
  default?: string | boolean;
};
