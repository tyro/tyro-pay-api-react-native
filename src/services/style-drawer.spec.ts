import {
  getBodyStyles,
  getDividerStyles,
  getFormStyles,
  getInputStyles,
  getWalletPaymentsStyles,
} from './style-drawer';
import { TyroPayStyleProps } from '../@types/definitions';

const emptyStyleProps = {} as unknown as TyroPayStyleProps;
const styleProps = {
  // Body Styles
  bodyBackgroundColor: 'bodyBackgroundColor',
  bodyMinWidth: 'bodyMinWidth',
  bodyMaxWidth: 'bodyMaxWidth',
  bodyWidth: 'bodyWidth',
  bodyPadding: 'bodyPadding',

  // Divider Styles
  walletPaymentsDividerText: 'this is a test',
  walletPaymentsDividerEnabled: true,

  // Wallet Payment Styles
  walletPaymentsButtonsWidth: '40%',
  walletPaymentsButtonsMargin: 5,

  // Inputs
  inputBackgroundColor: '#ffffff',
  inputBorderColor: '#eeeeee',
  inputBorderSize: '25',
  inputBorderRadius: '26',
  inputErrorFontColor: '#dddddd',
  inputErrorBorderColor: '#cccccc',
  inputErrorBorderSize: '27',
  inputFocusBackgroundColor: '#bbbbbb',
  inputFocusBorderColor: '#aaaaaa',
  inputFocusBorderSize: '28',
  inputFocusFontColor: '#999999',
  inputFontColor: '#888888',
  inputFontSize: '29',
  inputFontWeight: '30',
  inputPadding: '31',
  inputSpacing: '32',
  errorBackgroundColor: '#777777',
  errorFontColor: '#666666',
  errorFontSize: '33',
  errorFontWeight: '34',
  errorPadding: '35',

  // Labels
  labelPosition: 'block',
  labelFontColor: 'purple',
  labelFontSize: '36',
  labelFontWeight: '37',
  labelPadding: '38',

  // Font family
  fontFamily: 'arial',
} as TyroPayStyleProps;

describe('Style Drawer Service', () => {
  describe('bodyStyles', () => {
    it('it defaults', () => {
      const result = getBodyStyles(emptyStyleProps);
      expect(result).toEqual({
        bodyContainer: {
          minWidth: 200,
          padding: 0,
          width: '100%',
        },

        bodyWrapper: {
          flex: 1,
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          backgroundColor: 'white',
          justifyContent: 'center',
        },
      });
    });
    it('it maps', () => {
      const result = getBodyStyles(styleProps);
      expect(result).toEqual({
        bodyContainer: {
          maxWidth: 'bodyMaxWidth',
          minWidth: 'bodyMinWidth',
          padding: 0,
          width: 'bodyWidth',
        },

        bodyWrapper: {
          flex: 1,
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          backgroundColor: 'bodyBackgroundColor',
          fontFamily: 'arial',
          justifyContent: 'center',
        },
      });
    });
  });
  describe('getFormStyles', () => {
    it('it defaults', () => {
      const result = getFormStyles(emptyStyleProps);
      expect(result).toEqual({
        fieldSplit: {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        fieldSplitSpacer: {
          padding: 5,
        },
      });
    });
    it('it maps', () => {
      const result = getFormStyles(styleProps);
      expect(result).toEqual({
        fieldSplit: {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        fieldSplitSpacer: {
          padding: 5,
        },
      });
    });
  });
  describe('getInputStyles', () => {
    it('it defaults noError, noFocus', () => {
      const result = getInputStyles(emptyStyleProps, { isError: false, isFocus: false });
      expect(result).toEqual({
        error: {
          color: 'red',
          fontSize: 15,
          marginVertical: 10,
        },
        errorSpacer: {
          marginVertical: 10,
        },
        fieldContainer: {
          display: 'flex',
          flexDirection: 'row',
          flexGrow: 1,
          justifyContent: 'space-between',
        },
        fieldWrapper: {
          flex: 1,
        },
        image: {
          marginRight: 10,
        },
        imageWrapper: {
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        inputWrapper: {
          backgroundColor: '#f9f9f9',
          borderColor: '#d9d9d9',
          borderRadius: 5,
          borderWidth: 1,
          width: 'auto',
          minHeight: 38,
        },
        labelContainer: {
          color: '#303030',
          fontSize: 15,
          fontWeight: '600',
          padding: 10,
          width: '100%',
        },
        textInput: {
          color: '#303030',
          flex: 1,
          fontSize: 15,
          height: '100%',
          padding: 10,
          width: '100%',
        },
        placeholder: {
          color: '#686868',
        },
      });
    });
    it('it maps noError, noFocus', () => {
      const result = getInputStyles(styleProps, { isError: false, isFocus: false });
      expect(result).toEqual({
        error: {
          backgroundColor: '#777777',
          color: '#666666',
          fontFamily: 'arial',
          fontSize: 33,
          fontWeight: '34',
          marginVertical: 32,
          padding: 35,
        },
        errorSpacer: {
          marginVertical: 32,
        },
        fieldContainer: {
          display: 'flex',
          flexDirection: 'row',
          flexGrow: 1,
          justifyContent: 'space-between',
        },
        fieldWrapper: {
          flex: 1,
        },
        image: {
          marginRight: 31,
        },
        imageWrapper: {
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        inputWrapper: {
          backgroundColor: '#ffffff',
          borderColor: '#eeeeee',
          borderRadius: 26,
          borderWidth: 25,
          width: 'auto',
          minHeight: 38,
        },
        labelContainer: {
          color: 'purple',
          fontFamily: 'arial',
          fontSize: 36,
          fontWeight: '37',
          padding: 38,
          width: '100%',
        },
        textInput: {
          color: '#888888',
          flex: 1,
          fontFamily: 'arial',
          fontSize: 29,
          fontWeight: '30',
          height: '100%',
          padding: 31,
          width: '100%',
        },
        placeholder: {
          color: 'purple',
        },
      });
    });
    it('it defaults isError, noFocus', () => {
      const result = getInputStyles(emptyStyleProps, { isError: true, isFocus: false });
      expect(result).toEqual({
        error: {
          color: 'red',
          fontSize: 15,
          marginVertical: 10,
        },
        errorSpacer: {
          marginVertical: 10,
        },
        fieldContainer: {
          display: 'flex',
          flexDirection: 'row',
          flexGrow: 1,
          justifyContent: 'space-between',
        },
        fieldWrapper: {
          flex: 1,
        },
        image: {
          marginRight: 10,
        },
        imageWrapper: {
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        inputWrapper: {
          backgroundColor: '#f9f9f9',
          borderColor: 'red',
          borderRadius: 5,
          borderWidth: 1,
          width: 'auto',
          minHeight: 38,
        },
        labelContainer: {
          color: '#303030',
          fontSize: 15,
          fontWeight: '600',
          padding: 10,
          width: '100%',
        },
        textInput: {
          color: '#303030',
          flex: 1,
          fontSize: 15,
          height: '100%',
          padding: 10,
          width: '100%',
        },
        placeholder: {
          color: '#686868',
        },
      });
    });
    it('it maps isError, noFocus', () => {
      const result = getInputStyles(styleProps, { isError: true, isFocus: false });
      expect(result).toEqual({
        error: {
          backgroundColor: '#777777',
          color: '#666666',
          fontFamily: 'arial',
          fontSize: 33,
          fontWeight: '34',
          marginVertical: 32,
          padding: 35,
        },
        errorSpacer: {
          marginVertical: 32,
        },
        fieldContainer: {
          display: 'flex',
          flexDirection: 'row',
          flexGrow: 1,
          justifyContent: 'space-between',
        },
        fieldWrapper: {
          flex: 1,
        },
        image: {
          marginRight: 31,
        },
        imageWrapper: {
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        inputWrapper: {
          backgroundColor: '#ffffff',
          borderColor: '#cccccc',
          borderRadius: 26,
          borderWidth: 27,
          width: 'auto',
          minHeight: 38,
        },
        labelContainer: {
          color: 'purple',
          fontFamily: 'arial',
          fontSize: 36,
          fontWeight: '37',
          padding: 38,
          width: '100%',
        },
        textInput: {
          color: '#dddddd',
          flex: 1,
          fontFamily: 'arial',
          fontSize: 29,
          fontWeight: '30',
          height: '100%',
          padding: 31,
          width: '100%',
        },
        placeholder: {
          color: 'purple',
        },
      });
    });
    it('it defaults isError, isFocus', () => {
      const result = getInputStyles(emptyStyleProps, { isError: true, isFocus: true });
      expect(result).toEqual({
        error: {
          color: 'red',
          fontSize: 15,
          marginVertical: 10,
        },
        errorSpacer: {
          marginVertical: 10,
        },
        fieldContainer: {
          display: 'flex',
          flexDirection: 'row',
          flexGrow: 1,
          justifyContent: 'space-between',
        },
        fieldWrapper: {
          flex: 1,
        },
        image: {
          marginRight: 10,
        },
        imageWrapper: {
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        inputWrapper: {
          backgroundColor: '#f9f9f9',
          borderColor: 'blue',
          borderRadius: 5,
          borderWidth: 1,
          width: 'auto',
          minHeight: 38,
        },
        labelContainer: {
          color: '#303030',
          fontSize: 15,
          fontWeight: '600',
          padding: 10,
          width: '100%',
        },
        textInput: {
          color: '#303030',
          flex: 1,
          fontSize: 15,
          height: '100%',
          padding: 10,
          width: '100%',
        },
        placeholder: {
          color: '#686868',
        },
      });
    });
    it('it maps isError, isFocus', () => {
      const result = getInputStyles(styleProps, { isError: true, isFocus: true });
      expect(result).toEqual({
        error: {
          backgroundColor: '#777777',
          color: '#666666',
          fontFamily: 'arial',
          fontSize: 33,
          fontWeight: '34',
          marginVertical: 32,
          padding: 35,
        },
        errorSpacer: {
          marginVertical: 32,
        },
        fieldContainer: {
          display: 'flex',
          flexDirection: 'row',
          flexGrow: 1,
          justifyContent: 'space-between',
        },
        fieldWrapper: {
          flex: 1,
        },
        image: {
          marginRight: 31,
        },
        imageWrapper: {
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        inputWrapper: {
          backgroundColor: '#bbbbbb',
          borderColor: '#aaaaaa',
          borderRadius: 26,
          borderWidth: 28,
          width: 'auto',
          minHeight: 38,
        },
        labelContainer: {
          color: 'purple',
          fontFamily: 'arial',
          fontSize: 36,
          fontWeight: '37',
          padding: 38,
          width: '100%',
        },
        textInput: {
          color: '#999999',
          flex: 1,
          fontFamily: 'arial',
          fontSize: 29,
          fontWeight: '30',
          height: '100%',
          padding: 31,
          width: '100%',
        },
        placeholder: {
          color: 'purple',
        },
      });
    });
    it('it defaults noError, isFocus', () => {
      const result = getInputStyles(emptyStyleProps, { isError: false, isFocus: true });
      expect(result).toEqual({
        error: {
          color: 'red',
          fontSize: 15,
          marginVertical: 10,
        },
        errorSpacer: {
          marginVertical: 10,
        },
        fieldContainer: {
          display: 'flex',
          flexDirection: 'row',
          flexGrow: 1,
          justifyContent: 'space-between',
        },
        fieldWrapper: {
          flex: 1,
        },
        image: {
          marginRight: 10,
        },
        imageWrapper: {
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        inputWrapper: {
          backgroundColor: '#f9f9f9',
          borderColor: 'blue',
          borderRadius: 5,
          borderWidth: 1,
          width: 'auto',
          minHeight: 38,
        },
        labelContainer: {
          color: '#303030',
          fontSize: 15,
          fontWeight: '600',
          padding: 10,
          width: '100%',
        },
        textInput: {
          color: '#303030',
          flex: 1,
          fontSize: 15,
          height: '100%',
          padding: 10,
          width: '100%',
        },
        placeholder: {
          color: '#686868',
        },
      });
    });
    it('it maps noError, isFocus', () => {
      const result = getInputStyles(styleProps, { isError: false, isFocus: true });
      expect(result).toEqual({
        error: {
          backgroundColor: '#777777',
          color: '#666666',
          fontFamily: 'arial',
          fontSize: 33,
          fontWeight: '34',
          marginVertical: 32,
          padding: 35,
        },
        errorSpacer: {
          marginVertical: 32,
        },
        fieldContainer: {
          display: 'flex',
          flexDirection: 'row',
          flexGrow: 1,
          justifyContent: 'space-between',
        },
        fieldWrapper: {
          flex: 1,
        },
        image: {
          marginRight: 31,
        },
        imageWrapper: {
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        inputWrapper: {
          backgroundColor: '#bbbbbb',
          borderColor: '#aaaaaa',
          borderRadius: 26,
          borderWidth: 28,
          width: 'auto',
          minHeight: 38,
        },
        labelContainer: {
          color: 'purple',
          fontFamily: 'arial',
          fontSize: 36,
          fontWeight: '37',
          padding: 38,
          width: '100%',
        },
        textInput: {
          color: '#999999',
          flex: 1,
          fontFamily: 'arial',
          fontSize: 29,
          fontWeight: '30',
          height: '100%',
          padding: 31,
          width: '100%',
        },
        placeholder: {
          color: 'purple',
        },
      });
    });
    it('it maps padding with showErrorSpacing=false', () => {
      const result = getInputStyles(
        {
          ...styleProps,
          showErrorSpacing: false,
        },
        { isError: false, isFocus: true }
      );
      expect(result).toEqual({
        error: {
          backgroundColor: '#777777',
          color: '#666666',
          fontFamily: 'arial',
          fontSize: 33,
          fontWeight: '34',
          marginVertical: 32,
          padding: 35,
        },
        errorSpacer: {
          marginVertical: 32,
        },
        fieldContainer: {
          display: 'flex',
          flexDirection: 'row',
          flexGrow: 1,
          justifyContent: 'space-between',
        },
        fieldWrapper: {
          flex: 1,
          marginBottom: 32,
        },
        image: {
          marginRight: 31,
        },
        imageWrapper: {
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        inputWrapper: {
          backgroundColor: '#bbbbbb',
          borderColor: '#aaaaaa',
          borderRadius: 26,
          borderWidth: 28,
          width: 'auto',
          minHeight: 38,
        },
        labelContainer: {
          color: 'purple',
          fontFamily: 'arial',
          fontSize: 36,
          fontWeight: '37',
          padding: 38,
          width: '100%',
        },
        textInput: {
          color: '#999999',
          flex: 1,
          fontFamily: 'arial',
          fontSize: 29,
          fontWeight: '30',
          height: '100%',
          padding: 31,
          width: '100%',
        },
        placeholder: {
          color: 'purple',
        },
      });
    });
  });
  describe('getWalletPaymentsStyles', () => {
    it('it defaults', () => {
      const result = getWalletPaymentsStyles(emptyStyleProps);
      expect(result).toEqual({
        walletContainer: {
          height: 48,
          minWidth: 90,
          width: '100%',
        },
        walletPadder: {
          width: '100%',
          padding: 0,
        },
        walletWrapper: {
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10,
        },
      });
    });
    it('it maps', () => {
      const result = getWalletPaymentsStyles(styleProps);
      expect(result).toEqual({
        walletContainer: {
          height: 48,
          minWidth: 90,
          width: '40%',
        },
        walletPadder: {
          width: '100%',
          padding: 5,
        },
        walletWrapper: {
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 32,
        },
      });
    });
  });
  describe('getDividerStyles', () => {
    it('it defaults', () => {
      const result = getDividerStyles(emptyStyleProps);
      expect(result).toEqual({
        dividerWrapper: { alignItems: 'center', flexDirection: 'row', margin: 10, marginBottom: 20 },
        line: { backgroundColor: '#d9d9d9', flex: 1, height: 1 },
        text: {
          color: '#303030',
          fontSize: 15,
          paddingLeft: 5,
          paddingRight: 5,
          textAlign: 'center',
        },
      });
    });
    it('it maps', () => {
      const result = getDividerStyles(styleProps);
      expect(result).toEqual({
        dividerWrapper: { alignItems: 'center', flexDirection: 'row', margin: 10, marginBottom: 20 },
        line: { backgroundColor: '#eeeeee', flex: 1, height: 1 },
        text: {
          color: 'purple',
          fontFamily: 'arial',
          fontSize: 15,
          paddingLeft: 5,
          paddingRight: 5,
          textAlign: 'center',
        },
      });
    });
  });
  describe('specifically test the oddities of types in borders/fonts/padding', () => {
    it('when strings converts appropriately', () => {
      const result = getInputStyles(
        {
          inputBorderSize: '10',
          inputBorderRadius: '20',
          inputFontSize: '30',
          inputPadding: '40',
          inputFontWeight: '50',
        },
        { isError: false, isFocus: false }
      );
      expect(result).toEqual({
        error: {
          color: 'red',
          fontSize: 15,
          marginVertical: 10,
        },
        errorSpacer: {
          marginVertical: 10,
        },
        fieldContainer: {
          display: 'flex',
          flexDirection: 'row',
          flexGrow: 1,
          justifyContent: 'space-between',
        },
        fieldWrapper: {
          flex: 1,
        },
        image: {
          marginRight: 40,
        },
        imageWrapper: {
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        inputWrapper: {
          backgroundColor: '#f9f9f9',
          borderColor: '#d9d9d9',
          borderRadius: 20,
          borderWidth: 10,
          width: 'auto',
          minHeight: 38,
        },
        labelContainer: {
          color: '#303030',
          fontSize: 15,
          fontWeight: '600',
          padding: 10,
          width: '100%',
        },
        textInput: {
          color: '#303030',
          flex: 1,
          fontSize: 30,
          fontWeight: '50',
          height: '100%',
          padding: 40,
          width: '100%',
        },
        placeholder: {
          color: '#686868',
        },
      });
    });
    it('when numbers converts appropriately', () => {
      const result = getInputStyles(
        {
          inputBorderSize: 10,
          inputBorderRadius: 20,
          inputFontSize: 30,
          inputPadding: 40,
          inputFontWeight: 50,
        },
        { isError: false, isFocus: false }
      );
      expect(result).toEqual({
        error: {
          color: 'red',
          fontSize: 15,
          marginVertical: 10,
        },
        errorSpacer: {
          marginVertical: 10,
        },
        fieldContainer: {
          display: 'flex',
          flexDirection: 'row',
          flexGrow: 1,
          justifyContent: 'space-between',
        },
        fieldWrapper: {
          flex: 1,
        },
        image: {
          marginRight: 40,
        },
        imageWrapper: {
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        inputWrapper: {
          backgroundColor: '#f9f9f9',
          borderColor: '#d9d9d9',
          borderRadius: 20,
          borderWidth: 10,
          width: 'auto',
          minHeight: 38,
        },
        labelContainer: {
          color: '#303030',
          fontSize: 15,
          fontWeight: '600',
          padding: 10,
          width: '100%',
        },
        textInput: {
          color: '#303030',
          flex: 1,
          fontSize: 30,
          fontWeight: '50',
          height: '100%',
          padding: 40,
          width: '100%',
        },
        placeholder: {
          color: '#686868',
        },
      });
    });
  });
});
