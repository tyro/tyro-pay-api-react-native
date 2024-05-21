import {
  GooglePayButtonColor,
  GooglePayButtonText,
  StyleLabelPositions,
  StyleProps,
  ApplePayButtonStyleProps,
  GooglePayButtonStyleProps,
  ApplePayButtonStyleText,
  ApplePayButtonTypeText,
} from './style-types';

export enum ThemeNames {
  DEFAULT = 'default',
  DARK = 'dark',
  SHARP = 'sharp',
  MINIMAL = 'minimal',
}

export const ThemeStyles: Record<ThemeNames, Partial<StyleProps>> = {
  [ThemeNames.DEFAULT]: {
    labelPosition: StyleLabelPositions.FLOATING,
    inputFontSize: '16px', // This is so iOS doesnt zoom in when focusing on input fields
    showSupportedCards: true,
  },
  [ThemeNames.DARK]: {
    labelPosition: StyleLabelPositions.FLOATING,
    bodyBackgroundColor: '#1A1F36',
    inputBackgroundColor: '#30313D',
    inputBorderColor: '#424253',
    inputFontColor: '#FEFEFE',
    inputFocusBorderColor: '#878799',
    inputErrorFontColor: '#FE87A1',
    inputErrorBorderColor: '#FE87A1',
    labelFontColor: '#D3D3D4',
    errorFontColor: '#FE87A1',
    showSupportedCards: true,
    applePayButton: {
      buttonStyle: ApplePayButtonStyleText.WHITE,
    },
    googlePayButton: {
      buttonColor: GooglePayButtonColor.WHITE,
    },
  },
  [ThemeNames.SHARP]: {
    labelPosition: StyleLabelPositions.BLOCK,
    inputBorderRadius: '0px',
    inputSpacing: '0px',
    showSupportedCards: true,
  },
  [ThemeNames.MINIMAL]: {
    labelPosition: StyleLabelPositions.FLOATING,
    inputBorderRadius: '10px',
    inputBorderSize: '0px',
    inputBackgroundColor: '#F6F8FA',
    showCardIcon: false,
    showErrorSpacing: false,
    showSupportedCards: false,
  },
};

export const applePayButtonDefaultStyles: ApplePayButtonStyleProps = {
  buttonStyle: ApplePayButtonStyleText.BLACK,
  buttonLabel: ApplePayButtonTypeText.PLAIN,
};

export const googlePayButtonDefaultStyles: GooglePayButtonStyleProps = {
  buttonColor: GooglePayButtonColor.DEFAULT,
  buttonType: GooglePayButtonText.PLAIN,
  buttonBorderRadius: 4,
};
