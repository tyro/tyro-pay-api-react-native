import { ApplePayButtonStyleProps, GooglePayButtonStyleProps } from './style-types';
import { ThemeNames } from './theme-styles';
import { SupportedNetworks } from './tyro-sdk';

export enum TyroPayStyleLabelPositions {
  BLOCK = 'block',
  FLOATING = 'floating',
  // Note: For now this is not a supported property in the react-native component
  // INLINE = 'inline',
}

export enum TyroPayOptionsKeys {
  liveMode = 'liveMode',
  theme = 'theme',
  styleProps = 'styleProps',
  options = 'options',
}

export type TyroPayOptions = {
  [TyroPayOptionsKeys.liveMode]: boolean;
  [TyroPayOptionsKeys.theme]: `${ThemeNames}`;
  [TyroPayOptionsKeys.styleProps]: TyroPayStyleProps;
  [TyroPayOptionsKeys.options]: TyroPayOptionsOptionsProps;
};

export type TyroPayOptionsProps = {
  [TyroPayOptionsKeys.liveMode]: boolean;
  [TyroPayOptionsKeys.theme]?: `${ThemeNames}`;
  [TyroPayOptionsKeys.styleProps]?: TyroPayStyleProps;
  [TyroPayOptionsKeys.options]?: TyroPayOptionsOptionsProps;
};

export enum TyroPayApplePayOptionKeys {
  enabled = 'enabled',
  merchantIdentifier = 'merchantIdentifier',
  supportedNetworks = 'supportedNetworks',
}

export type TyroPayApplePayOptions = {
  [TyroPayApplePayOptionKeys.enabled]?: boolean;
  [TyroPayApplePayOptionKeys.merchantIdentifier]?: string;
  [TyroPayApplePayOptionKeys.supportedNetworks]?: SupportedNetworks[];
};

export enum TyroPayGooglePayOptionKeys {
  enabled = 'enabled',
  merchantName = 'merchantName',
  supportedNetworks = 'supportedNetworks',
}

export type TyroPayGooglePayOptions = {
  [TyroPayGooglePayOptionKeys.enabled]?: boolean;
  [TyroPayGooglePayOptionKeys.merchantName]?: string;
  [TyroPayGooglePayOptionKeys.supportedNetworks]?: SupportedNetworks[];
};

export enum TyroPayCreditCardFormOptionKeys {
  enabled = 'enabled',
  supportedNetworks = 'supportedNetworks',
}

export type TyroPayCreditCardFormOptions = {
  [TyroPayCreditCardFormOptionKeys.enabled]?: boolean;
  [TyroPayCreditCardFormOptionKeys.supportedNetworks]?: SupportedNetworks[];
};

export enum TyroPayOptionsOptionsKeys {
  applePay = 'applePay',
  googlePay = 'googlePay',
  creditCardForm = 'creditCardForm',
}

export type TyroPayOptionsOptionsProps = {
  [TyroPayOptionsOptionsKeys.applePay]?: TyroPayApplePayOptions;
  [TyroPayOptionsOptionsKeys.googlePay]?: TyroPayGooglePayOptions;
  [TyroPayOptionsOptionsKeys.creditCardForm]?: TyroPayCreditCardFormOptions;
};

export enum TyroPayStylePropKeys {
  bodyBackgroundColor = 'bodyBackgroundColor',
  bodyPadding = 'bodyPadding',
  bodyWidth = 'bodyWidth',
  bodyMinWidth = 'bodyMinWidth',
  bodyMaxWidth = 'bodyMaxWidth',
  fontFamily = 'fontFamily',
  inputBackgroundColor = 'inputBackgroundColor',
  inputBorderColor = 'inputBorderColor',
  inputBorderSize = 'inputBorderSize',
  inputBorderRadius = 'inputBorderRadius',
  inputErrorFontColor = 'inputErrorFontColor',
  inputErrorBorderColor = 'inputErrorBorderColor',
  inputErrorBorderSize = 'inputErrorBorderSize',
  inputFocusBackgroundColor = 'inputFocusBackgroundColor',
  inputFocusBorderColor = 'inputFocusBorderColor',
  inputFocusBorderSize = 'inputFocusBorderSize',
  inputFocusFontColor = 'inputFocusFontColor',
  inputFontColor = 'inputFontColor',
  inputFontSize = 'inputFontSize',
  inputFontWeight = 'inputFontWeight',
  inputPadding = 'inputPadding',
  inputSpacing = 'inputSpacing',
  labelPosition = 'labelPosition',
  labelFontColor = 'labelFontColor',
  labelFontSize = 'labelFontSize',
  labelFontWeight = 'labelFontWeight',
  labelPadding = 'labelPadding',
  errorBackgroundColor = 'errorBackgroundColor',
  errorFontColor = 'errorFontColor',
  errorFontSize = 'errorFontSize',
  errorFontWeight = 'errorFontWeight',
  errorPadding = 'errorPadding',
  showCardIcon = 'showCardIcon',
  showErrorSpacing = 'showErrorSpacing',
  showSupportedCards = 'showSupportedCards',
  walletPaymentsDividerText = 'walletPaymentsDividerText',
  walletPaymentsDividerEnabled = 'walletPaymentsDividerEnabled',
  walletPaymentsButtonsWidth = 'walletPaymentsButtonsWidth',
  walletPaymentsButtonsMargin = 'walletPaymentsButtonsMargin',
  walletPaymentsButtonsGap = 'walletPaymentsButtonsGap',
  applePayButton = 'applePayButton',
  googlePayButton = 'googlePayButton',
}

export type TyroPayStyleProps = {
  [TyroPayStylePropKeys.bodyBackgroundColor]?: string;
  [TyroPayStylePropKeys.bodyPadding]?: string | number;
  [TyroPayStylePropKeys.bodyWidth]?: string | number;
  [TyroPayStylePropKeys.bodyMinWidth]?: string | number;
  [TyroPayStylePropKeys.bodyMaxWidth]?: string | number;
  [TyroPayStylePropKeys.fontFamily]?: string;
  [TyroPayStylePropKeys.inputBackgroundColor]?: string;
  [TyroPayStylePropKeys.inputBorderColor]?: string;
  [TyroPayStylePropKeys.inputBorderSize]?: string | number;
  [TyroPayStylePropKeys.inputBorderRadius]?: string | number;
  [TyroPayStylePropKeys.inputErrorFontColor]?: string;
  [TyroPayStylePropKeys.inputErrorBorderColor]?: string;
  [TyroPayStylePropKeys.inputErrorBorderSize]?: string | number;
  [TyroPayStylePropKeys.inputFocusBackgroundColor]?: string;
  [TyroPayStylePropKeys.inputFocusBorderColor]?: string;
  [TyroPayStylePropKeys.inputFocusBorderSize]?: string | number;
  [TyroPayStylePropKeys.inputFocusFontColor]?: string;
  [TyroPayStylePropKeys.inputFontColor]?: string;
  [TyroPayStylePropKeys.inputFontSize]?: string | number;
  [TyroPayStylePropKeys.inputFontWeight]?: string | number;
  [TyroPayStylePropKeys.inputPadding]?: string | number;
  [TyroPayStylePropKeys.inputSpacing]?: string | number;
  [TyroPayStylePropKeys.labelPosition]?: `${TyroPayStyleLabelPositions}`;
  [TyroPayStylePropKeys.labelFontColor]?: string;
  [TyroPayStylePropKeys.labelFontSize]?: string | number;
  [TyroPayStylePropKeys.labelFontWeight]?: string | number;
  [TyroPayStylePropKeys.labelPadding]?: string | number;
  [TyroPayStylePropKeys.errorBackgroundColor]?: string;
  [TyroPayStylePropKeys.errorFontColor]?: string | number;
  [TyroPayStylePropKeys.errorFontSize]?: string | number;
  [TyroPayStylePropKeys.errorFontWeight]?: string | number;
  [TyroPayStylePropKeys.errorPadding]?: string | number;
  [TyroPayStylePropKeys.showCardIcon]?: boolean;
  [TyroPayStylePropKeys.showErrorSpacing]?: boolean;
  [TyroPayStylePropKeys.showSupportedCards]?: boolean;
  [TyroPayStylePropKeys.walletPaymentsDividerEnabled]?: boolean;
  [TyroPayStylePropKeys.walletPaymentsDividerText]?: string;
  [TyroPayStylePropKeys.walletPaymentsButtonsWidth]?: string | number;
  [TyroPayStylePropKeys.walletPaymentsButtonsMargin]?: string | number;
  [TyroPayStylePropKeys.applePayButton]?: ApplePayButtonStyleProps;
  [TyroPayStylePropKeys.googlePayButton]?: GooglePayButtonStyleProps;
};
