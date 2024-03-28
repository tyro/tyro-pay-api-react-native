import { TyroPayStylePropKeys, TyroPayStyleProps } from '../@types/definitions';

// These styles must be parsed as String/Number types only or there is an error with the react-native library
// Some can be either or both - its odd
const STRING_ONLY_PROPS = ['fontWeight'];
const NUMBER_ONLY_PROPS = [
  'padding',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'marginVertical',
  'marginHorizontal',
  'fontSize',
  'borderWidth',
  'borderRadius',
];

const getStylePropOrDefault = (
  styleProps: TyroPayStyleProps,
  styleSheetKey: string,
  stylePropKey: TyroPayStylePropKeys,
  defaultValue: number | string | undefined
): Record<string, string | number> => {
  let value = styleProps[stylePropKey];
  if (NUMBER_ONLY_PROPS.includes(styleSheetKey)) {
    value = parseFloat(value as unknown as string) as number;
    if (isNaN(value)) {
      value = undefined;
    }
  } else {
    value = value as string;
  }
  if (value === undefined && defaultValue !== undefined) {
    value = defaultValue;
  }
  if (value === undefined) {
    return {};
  }
  if (STRING_ONLY_PROPS.includes(styleSheetKey)) {
    value = `${value}` as string;
  } else {
    value = value as string;
    // Now things that are only numbers seem to work better as numeric, for widths/heights etc
    if (/^\d+$/.test(value)) {
      value = parseFloat(value);
    }
  }
  return {
    [styleSheetKey]: value,
  };
};

export const getBodyStyles = (styleProps: TyroPayStyleProps): Record<string, any> => ({
  bodyWrapper: {
    ...getStylePropOrDefault(styleProps, 'fontFamily', TyroPayStylePropKeys.fontFamily, 'roboto'),
    ...getStylePropOrDefault(styleProps, 'backgroundColor', TyroPayStylePropKeys.bodyBackgroundColor, 'white'),
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyContainer: {
    ...getStylePropOrDefault(styleProps, 'padding', TyroPayStylePropKeys.bodyPadding, 0),
    ...getStylePropOrDefault(styleProps, 'width', TyroPayStylePropKeys.bodyWidth, '100%'),
    ...getStylePropOrDefault(styleProps, 'minWidth', TyroPayStylePropKeys.bodyMinWidth, 200),
    ...getStylePropOrDefault(styleProps, 'maxWidth', TyroPayStylePropKeys.bodyMaxWidth, undefined),
  },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getFormStyles = (styleProps: TyroPayStyleProps): Record<string, any> => ({
  fieldSplit: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fieldSplitSpacer: {
    padding: 5,
  },
});

interface InputStyleState {
  isFocus?: boolean;
  isError?: boolean;
}

const DEFAULT_INPUT_SPACING = 10;

export const getInputStyles = (
  styleProps: TyroPayStyleProps,
  { isError, isFocus }: InputStyleState
): Record<string, any> => ({
  fieldContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  fieldWrapper: {
    flex: 1,
    ...(styleProps.showErrorSpacing === false
      ? getStylePropOrDefault(styleProps, 'marginBottom', TyroPayStylePropKeys.inputSpacing, DEFAULT_INPUT_SPACING)
      : {}),
  },
  inputWrapper: {
    // State-conditional background color
    ...getStylePropOrDefault(styleProps, 'backgroundColor', TyroPayStylePropKeys.inputBackgroundColor, '#f9f9f9'),
    ...(isFocus &&
      getStylePropOrDefault(styleProps, 'backgroundColor', TyroPayStylePropKeys.inputFocusBackgroundColor, undefined)),
    // State-conditional border size
    ...(isFocus
      ? getStylePropOrDefault(styleProps, 'borderWidth', TyroPayStylePropKeys.inputFocusBorderSize, 1)
      : isError
      ? getStylePropOrDefault(styleProps, 'borderWidth', TyroPayStylePropKeys.inputErrorBorderSize, 1)
      : getStylePropOrDefault(styleProps, 'borderWidth', TyroPayStylePropKeys.inputBorderSize, 1)),
    // State-conditional border color
    ...(isFocus
      ? getStylePropOrDefault(styleProps, 'borderColor', TyroPayStylePropKeys.inputFocusBorderColor, 'blue')
      : isError
      ? getStylePropOrDefault(styleProps, 'borderColor', TyroPayStylePropKeys.inputErrorBorderColor, 'red')
      : getStylePropOrDefault(styleProps, 'borderColor', TyroPayStylePropKeys.inputBorderColor, '#d9d9d9')),
    // End conditionals
    ...getStylePropOrDefault(styleProps, 'borderRadius', TyroPayStylePropKeys.inputBorderRadius, 5),
    width: 'auto',
  },
  textInput: {
    ...getStylePropOrDefault(styleProps, 'fontFamily', TyroPayStylePropKeys.fontFamily, 'roboto'),
    ...getStylePropOrDefault(styleProps, 'fontSize', TyroPayStylePropKeys.inputFontSize, 15),
    ...getStylePropOrDefault(styleProps, 'fontWeight', TyroPayStylePropKeys.inputFontWeight, undefined),
    // State-conditional input font color
    ...getStylePropOrDefault(styleProps, 'color', TyroPayStylePropKeys.inputFontColor, '#303030'),
    ...(isError && getStylePropOrDefault(styleProps, 'color', TyroPayStylePropKeys.inputErrorFontColor, undefined)),
    ...(isFocus && getStylePropOrDefault(styleProps, 'color', TyroPayStylePropKeys.inputFocusFontColor, undefined)),
    ...getStylePropOrDefault(styleProps, 'padding', TyroPayStylePropKeys.inputPadding, DEFAULT_INPUT_SPACING),
    width: '100%',
    height: '100%',
    flex: 1,
  },
  placeholder: {
    ...getStylePropOrDefault(styleProps, 'color', TyroPayStylePropKeys.labelFontColor, '#686868'),
  },
  imageWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    // Use inputPadding so the image is respectively spaced also
    ...getStylePropOrDefault(styleProps, 'marginRight', TyroPayStylePropKeys.inputPadding, DEFAULT_INPUT_SPACING),
  },

  errorSpacer: {
    // Use inputSpacing for this property
    ...getStylePropOrDefault(styleProps, 'marginVertical', TyroPayStylePropKeys.inputSpacing, DEFAULT_INPUT_SPACING),
  },
  error: {
    ...getStylePropOrDefault(styleProps, 'fontFamily', TyroPayStylePropKeys.fontFamily, 'roboto'),
    ...getStylePropOrDefault(styleProps, 'fontSize', TyroPayStylePropKeys.errorFontSize, 15),
    ...getStylePropOrDefault(styleProps, 'fontWeight', TyroPayStylePropKeys.errorFontWeight, undefined),
    ...getStylePropOrDefault(styleProps, 'color', TyroPayStylePropKeys.errorFontColor, 'red'),
    ...getStylePropOrDefault(styleProps, 'backgroundColor', TyroPayStylePropKeys.errorBackgroundColor, undefined),
    ...getStylePropOrDefault(styleProps, 'padding', TyroPayStylePropKeys.errorPadding, undefined),
    // Use inputSpacing for this property
    ...getStylePropOrDefault(styleProps, 'marginVertical', TyroPayStylePropKeys.inputSpacing, DEFAULT_INPUT_SPACING),
  },

  labelContainer: {
    ...getStylePropOrDefault(styleProps, 'color', TyroPayStylePropKeys.labelFontColor, '#303030'),
    ...getStylePropOrDefault(styleProps, 'fontFamily', TyroPayStylePropKeys.fontFamily, 'roboto'),
    ...getStylePropOrDefault(styleProps, 'fontSize', TyroPayStylePropKeys.labelFontSize, 15),
    ...getStylePropOrDefault(styleProps, 'fontWeight', TyroPayStylePropKeys.labelFontWeight, '600'),
    ...getStylePropOrDefault(styleProps, 'padding', TyroPayStylePropKeys.labelPadding, 10),
    width: '100%',
  },
});

export const getDividerStyles = (styleProps: TyroPayStyleProps): Record<string, any> => ({
  dividerWrapper: { flexDirection: 'row', alignItems: 'center', margin: 10, marginBottom: 20 },
  text: {
    ...getStylePropOrDefault(styleProps, 'fontFamily', TyroPayStylePropKeys.fontFamily, 'roboto'),
    fontSize: 15,
    paddingLeft: 5,
    paddingRight: 5,
    textAlign: 'center',
    ...getStylePropOrDefault(styleProps, 'color', TyroPayStylePropKeys.labelFontColor, '#303030'),
  },
  line: {
    flex: 1,
    height: 1,
    ...getStylePropOrDefault(styleProps, 'backgroundColor', TyroPayStylePropKeys.inputBorderColor, '#d9d9d9'),
  },
});

export const getWalletPaymentsStyles = (styleProps: TyroPayStyleProps): Record<string, any> => ({
  walletWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    // Use inputSpacing for this property
    ...getStylePropOrDefault(styleProps, 'marginBottom', TyroPayStylePropKeys.inputSpacing, DEFAULT_INPUT_SPACING),
  },
  walletPadder: {
    ...getStylePropOrDefault(styleProps, 'padding', TyroPayStylePropKeys.walletPaymentsButtonsMargin, 0),
    width: '100%',
  },
  walletContainer: {
    ...getStylePropOrDefault(styleProps, 'width', TyroPayStylePropKeys.walletPaymentsButtonsWidth, '100%'),
    height: 48,
    minWidth: 90,
  },
});

export const getPayButtonStyles = (styleProps: TyroPayStyleProps): Record<string, any> => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  button: {
    borderRadius: 5,
    height: 40,
    width: '100%',
    backgroundColor: 'blue',
  },
  buttonText: {
    ...getStylePropOrDefault(styleProps, 'fontFamily', TyroPayStylePropKeys.fontFamily, 'roboto'),
    color: 'white',
  },
});
