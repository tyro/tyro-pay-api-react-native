import {
  StyleProcessor,
  StyleTypes,
  ApplePayButtonStyleProps,
  GooglePayButtonStyleProps,
  StyleProps,
} from '../@types/style-types';
import { cleanStyles } from './style-cleaner';

export const StyleProcessors: Record<string, StyleProcessor> = {
  bodyBackgroundColor: {
    type: StyleTypes.color,
  },
  bodyPadding: {
    type: StyleTypes.padding,
  },
  bodyWidth: {
    type: StyleTypes.size,
  },
  bodyMinWidth: {
    type: StyleTypes.size,
  },
  bodyMaxWidth: {
    type: StyleTypes.size,
  },
  fontFamily: {
    type: StyleTypes.fontFamily,
  },
  inputBackgroundColor: {
    type: StyleTypes.color,
  },
  inputBorderColor: {
    type: StyleTypes.color,
  },
  inputBorderSize: {
    type: StyleTypes.size,
  },
  inputBorderRadius: {
    type: StyleTypes.size,
  },
  inputErrorFontColor: {
    type: StyleTypes.color,
  },
  inputErrorBorderColor: {
    type: StyleTypes.color,
  },
  inputErrorBorderSize: {
    type: StyleTypes.size,
  },
  inputFocusBackgroundColor: {
    type: StyleTypes.color,
  },
  inputFocusBorderColor: {
    type: StyleTypes.color,
  },
  inputFocusBorderSize: {
    type: StyleTypes.size,
  },
  inputFocusFontColor: {
    type: StyleTypes.color,
  },
  inputFontColor: {
    type: StyleTypes.color,
  },
  inputFontSize: {
    type: StyleTypes.size,
  },
  inputFontWeight: {
    type: StyleTypes.weight,
  },
  inputPadding: {
    type: StyleTypes.padding,
  },
  inputSpacing: {
    type: StyleTypes.size,
  },
  labelPosition: {
    type: StyleTypes.labelPosition,
  },
  labelFontColor: {
    type: StyleTypes.color,
  },
  labelFontSize: {
    type: StyleTypes.size,
  },
  labelFontWeight: {
    type: StyleTypes.weight,
  },
  labelPadding: {
    type: StyleTypes.padding,
  },
  errorBackgroundColor: {
    type: StyleTypes.color,
  },
  errorFontColor: {
    type: StyleTypes.color,
  },
  errorFontSize: {
    type: StyleTypes.size,
  },
  errorFontWeight: {
    type: StyleTypes.weight,
  },
  errorPadding: {
    type: StyleTypes.padding,
  },
  showCardIcon: {
    type: StyleTypes.boolean,
  },
  showErrorSpacing: {
    type: StyleTypes.boolean,
  },
  showSupportedCards: {
    type: StyleTypes.boolean,
  },
  walletPaymentsDividerText: {
    type: StyleTypes.text,
  },
  walletPaymentsDividerEnabled: {
    type: StyleTypes.boolean,
  },
  walletPaymentsButtonsWidth: {
    type: StyleTypes.size,
  },
  walletPaymentsButtonsMargin: {
    type: StyleTypes.padding,
  },
};

export const getSanitizedStyles = (styleProps: Partial<StyleProps>): StyleProps =>
  cleanStyles(styleProps as Record<string, string[] | string | number | boolean | undefined>, StyleProcessors);

export const ApplePayStyleProcessors: Record<string, StyleProcessor> = {
  buttonBorderRadius: {
    type: StyleTypes.size,
  },
  buttonStyle: {
    type: StyleTypes.text,
  },
  buttonLabel: {
    type: StyleTypes.text,
  },
};

export const getSanitizedApplePayStyles = (styleProps: Partial<ApplePayButtonStyleProps>): StyleProps =>
  cleanStyles(styleProps, ApplePayStyleProcessors);

export const GooglePayStyleProcessors: Record<string, StyleProcessor> = {
  buttonColor: {
    type: StyleTypes.text,
  },
  buttonType: {
    type: StyleTypes.text,
  },
  buttonBorderRadius: {
    type: StyleTypes.size,
  },
};

export const getSanitizedGooglePayStyles = (styleProps: Partial<GooglePayButtonStyleProps>): StyleProps =>
  cleanStyles(styleProps, GooglePayStyleProcessors);
