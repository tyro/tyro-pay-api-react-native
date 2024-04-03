import { CardTypeNames } from '../@types/card-types';
import { SupportedNetworks, SupportedNetworksApplePay, SupportedNetworksGooglePay } from '../@types/network-types';
import {
  parseSupportedNetworks,
  parseSupportedNetworksApplePay,
  parseSupportedNetworksGooglePay,
  sanitizeOptions,
} from './sanitizers';
import { ThemeNames } from '../@types/theme-styles';
import { TyroPayOptionsProps } from '../@types/definitions';

const defaultedOptionsExpectation = {
  liveMode: true,
  theme: 'default',
  styleProps: {
    inputFontSize: '16px',
    labelPosition: 'floating',
    showSupportedCards: true,
    applePayButton: {
      buttonStyle: 'black',
      buttonType: 'plain',
      buttonBorderRadius: '4',
    },
    googlePayButton: {
      buttonColor: 'default',
      buttonType: 'plain',
      buttonBorderRadius: 4,
    },
  },
  options: {
    applePay: {
      enabled: expect.any(Boolean),
    },
    googlePay: {
      enabled: expect.any(Boolean),
    },
    creditCardForm: {
      enabled: true,
    },
  },
};

describe('sanitizers', () => {
  describe('sanitizeOptions', () => {
    it('basic set only', () => {
      const result = sanitizeOptions({
        liveMode: true,
      });
      expect(result).toEqual(defaultedOptionsExpectation);
    });
    it('a different theme only, confirm defaulting was applied before custom theme', () => {
      const result = sanitizeOptions({
        liveMode: true,
        theme: 'dark' as ThemeNames,
      });
      expect(result).toEqual({
        ...defaultedOptionsExpectation,
        theme: 'dark',
        styleProps: {
          ...defaultedOptionsExpectation.styleProps,
          bodyBackgroundColor: '#1A1F36',
          errorFontColor: '#FE87A1',
          inputBackgroundColor: '#30313D',
          inputBorderColor: '#424253',
          inputErrorBorderColor: '#FE87A1',
          inputErrorFontColor: '#FE87A1',
          inputFocusBorderColor: '#878799',
          inputFontColor: '#FEFEFE',
          labelFontColor: '#D3D3D4',
        },
      });
    });
    it('not an unsupported theme', () => {
      const result = sanitizeOptions({
        liveMode: true,
        theme: 'monkey' as ThemeNames,
      });
      expect(result).toEqual(defaultedOptionsExpectation);
    });
    it('overriding styleProp values', () => {
      const result = sanitizeOptions({
        liveMode: true,
        styleProps: {
          bodyBackgroundColor: '#cecece',
          bodyPadding: '5',
          bodyWidth: '50%',
          applePayButton: {
            buttonBorderRadius: '12',
          },
          googlePayButton: {
            buttonBorderRadius: '14' as unknown as number,
          },
        },
      });
      expect(result.styleProps).toEqual({
        ...defaultedOptionsExpectation.styleProps,
        bodyBackgroundColor: '#cecece',
        bodyPadding: '5',
        bodyWidth: '50%',
        applePayButton: {
          ...defaultedOptionsExpectation.styleProps.applePayButton,
          buttonBorderRadius: '12',
        },
        googlePayButton: {
          ...defaultedOptionsExpectation.styleProps.googlePayButton,
          buttonBorderRadius: '14',
        },
      });
    });
    it('not any unsupported styleProp values', () => {
      const result = sanitizeOptions({
        liveMode: true,
        styleProps: {
          bodyBackgroundColor: 'monkey',
          bodyPadding: 'monkey',
          bodyWidth: 'monkey',
          iamastupid: 'monkey',
          applePayButton: {
            iamastupid: 'monkey',
            buttonBorderRadius: 'monkey',
          },
        },
      } as TyroPayOptionsProps);
      expect(result).toEqual(defaultedOptionsExpectation);
    });
  });
  describe('parseSupportedNetworks', () => {
    const visaAndMastercardSN = [CardTypeNames.VISA, CardTypeNames.MASTERCARD] as unknown as SupportedNetworks[];
    const visaOnlySN = [CardTypeNames.VISA] as unknown as SupportedNetworks[];
    const emptySN = [] as unknown as SupportedNetworks[];
    it('nothing set', () => {
      const parsedSupportedNetworks = parseSupportedNetworks(null, undefined);
      expect(parsedSupportedNetworks).toEqual(null);
    });
    it('empty payRequest and empty options', () => {
      const parsedSupportedNetworks = parseSupportedNetworks(emptySN, []);
      expect(parsedSupportedNetworks).toEqual([]);
    });
    it('payRequest set, with no options set', () => {
      const parsedSupportedNetworks = parseSupportedNetworks(visaAndMastercardSN, undefined);
      expect(parsedSupportedNetworks).toEqual([CardTypeNames.VISA, CardTypeNames.MASTERCARD]);
    });
    it('options set, with no payRequest set', () => {
      const parsedSupportedNetworks = parseSupportedNetworks(null, visaAndMastercardSN);
      expect(parsedSupportedNetworks).toEqual([CardTypeNames.VISA, CardTypeNames.MASTERCARD]);
    });
    it('payRequest and options set', () => {
      const parsedSupportedNetworks = parseSupportedNetworks(visaAndMastercardSN, visaOnlySN);
      expect(parsedSupportedNetworks).toEqual([CardTypeNames.VISA]);
    });
    it('payRequest and options set, but not allow options to override payRequest', () => {
      const parsedSupportedNetworks = parseSupportedNetworks(visaOnlySN, visaAndMastercardSN);
      expect(parsedSupportedNetworks).toEqual([CardTypeNames.VISA]);
    });
  });
  describe('parseSupportedNetworksApplePay', () => {
    const validSN = [CardTypeNames.VISA, CardTypeNames.MASTERCARD] as SupportedNetworksApplePay[];
    const invalidSN = [
      CardTypeNames.VISA,
      CardTypeNames.MASTERCARD,
      CardTypeNames.MAESTRO,
      CardTypeNames.DINERS,
      'random',
    ] as unknown as SupportedNetworksApplePay[];

    it('should return original when input is valid', () => {
      const parsed = parseSupportedNetworksApplePay(validSN);
      expect(parsed).toEqual([CardTypeNames.MASTERCARD, CardTypeNames.VISA]);
    });
    it('should clean the array when input contains valid value', () => {
      const parsed = parseSupportedNetworksApplePay(invalidSN);
      expect(parsed).toEqual([CardTypeNames.MASTERCARD, CardTypeNames.VISA, CardTypeNames.MAESTRO]);
    });
  });

  describe('parseSupportedNetworksGooglePay', () => {
    const validSN = [CardTypeNames.VISA, CardTypeNames.MASTERCARD] as SupportedNetworksGooglePay[];
    const invalidSN = [
      CardTypeNames.VISA,
      CardTypeNames.MASTERCARD,
      CardTypeNames.MAESTRO,
      CardTypeNames.DINERS,
      'random',
    ] as unknown as SupportedNetworksGooglePay[];

    it('should return original when input is valid', () => {
      const parsed = parseSupportedNetworksGooglePay(validSN);
      expect(parsed).toEqual([CardTypeNames.MASTERCARD, CardTypeNames.VISA]);
    });
    it('should clean the array when input contains valid value', () => {
      const parsed = parseSupportedNetworksGooglePay(invalidSN);
      expect(parsed).toEqual([CardTypeNames.MASTERCARD, CardTypeNames.VISA]);
    });
  });
});
