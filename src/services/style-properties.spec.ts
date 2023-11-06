import { StyleTypes } from '../@types/style-types';
import { cleanStyles } from './style-cleaner';
import { StyleProcessors } from './style-properties';

const typeValidSample = {
  labelPosition: ['block', 'inline', 'floating'],
  fontFamily: ['roboto', 'arial', 'serif'],
  cardType: ['visa', 'mastercard', 'amex', 'maestro', 'jcb', 'diners'],
  color: ['#FFF', '#FFF000', '#Ff04fA'],
  size: ['1', '20', '10%', '30.5%', '100%', 'auto'],
  padding: ['1', '20', '10%', '10% 5%'],
  weight: ['600', '800', '1000'],
  text: ['this', 'is a sentence'],
  boolean: [true, false, 'true', 'false'],
};

const typeInvalidSample = {
  labelPosition: 'anything',
  fontFamily: 'anything',
  cardType: 'anything',
  color: ['#F', '#FFFFFFF', 'anything'],
  size: ['1px', '0px', '100px', '10em', '1.2em', '2pt', '-1px', 'Apx', 'px', '10x', '10p', '10x', '.1', 'anything'],
  padding: [
    'px',
    'em',
    '15em',
    'inherit',
    'badstuff',
    'script',
    'Apx',
    'anything',
    '1px',
    '.2',
    '0px',
    '100px',
    '1px 1px',
    '1px 1px 1px',
    '1px 1px 1px 1px',
    '0px 1px 0px 1px',
    '1PX',
    'auto',
    '-2pt -2pt',
  ],
  weight: ['99', '1300', 'anything'],
  text: [],
  boolean: 'anything',
};

const typeScriptSample = [
  '<script>',
  '<script></script>',
  '<script',
  'document.getElementById()',
  'window.alert()',
  'alert()',
  'window.alert()',
  'console.log()',
  [],
  [[]],
  {},
  [{}],
];

const stylePropertyType = {
  bodyBackgroundColor: 'color',
  bodyPadding: 'padding',
  bodyWidth: 'size',
  bodyMinWidth: 'size',
  bodyMaxWidth: 'size',
  fontFamily: 'fontFamily',
  inputBackgroundColor: 'color',
  inputBorderColor: 'color',
  inputBorderSize: 'size',
  inputBorderRadius: 'size',
  inputErrorFontColor: 'color',
  inputErrorBorderColor: 'color',
  inputErrorBorderSize: 'size',
  inputFocusBackgroundColor: 'color',
  inputFocusBorderColor: 'color',
  inputFocusBorderSize: 'size',
  inputFocusFontColor: 'color',
  inputFontColor: 'color',
  inputFontSize: 'size',
  inputFontWeight: 'weight',
  inputPadding: 'padding',
  inputSpacing: 'size',
  labelPosition: 'labelPosition',
  labelFontColor: 'color',
  labelFontSize: 'size',
  labelFontWeight: 'weight',
  labelPadding: 'padding',
  errorBackgroundColor: 'color',
  errorFontColor: 'color',
  errorFontSize: 'size',
  errorFontWeight: 'weight',
  errorPadding: 'padding',
  showCardIcon: 'boolean',
  showErrorSpacing: 'boolean',
  showSupportedCards: 'boolean',
  walletPaymentsDividerText: 'text',
  walletPaymentsDividerEnabled: 'boolean',
  walletPaymentsButtonsWidth: 'size',
  walletPaymentsButtonsMargin: 'padding',
};

describe('Style Properties Service', () => {
  describe('check each property is tested', function () {
    it('all style properties', () => {
      expect(Object.keys(stylePropertyType)).toEqual(Object.keys(StyleProcessors));
    });

    it('style properties type', () => {
      expect(Object.values(stylePropertyType).map((type) => StyleTypes[type].pattern)).toEqual(
        Object.values(StyleProcessors).map(({ type }) => type.pattern)
      );
    });
  });

  describe('test each property', function () {
    describe.each(Object.entries(StyleProcessors))('should support all valids %s', (key) => {
      const testType = stylePropertyType[key];
      const testableValue = typeValidSample?.[testType];
      const testGroup = Array.isArray(testableValue) ? testableValue : [testableValue];
      expect(testGroup).toBeDefined();

      it.each(testGroup)('attempt %s', (testValue) => {
        expect(testType).toBeDefined();
        expect(testValue).toBeDefined();
        if (StyleProcessors[key].isArray) {
          testValue = [testValue];
        }
        const result = cleanStyles(
          {
            [key]: testValue,
          },
          StyleProcessors
        );
        expect(result[key]).toBeDefined();

        if (testType !== 'boolean') {
          expect(result[key]).not.toEqual('');
        } else {
          // Test the inverse of a boolean
          const inverseResult = cleanStyles(
            {
              [key]: !['true'].includes(testValue.toString().toLowerCase()),
            },
            StyleProcessors
          );
          expect(inverseResult[key]).toBeDefined();
          expect(inverseResult[key]).not.toEqual(result[key]);
        }
      });
    });

    describe.each(Object.entries(StyleProcessors))('should not support any invalids or scripts %s', (key) => {
      const testType = stylePropertyType[key];
      const testableValue = typeInvalidSample?.[testType];
      const testGroup = (Array.isArray(testableValue) ? testableValue : [testableValue]).concat(typeScriptSample);
      expect(testGroup).toBeDefined();

      it.each(testGroup)('attempt %s', (testValue) => {
        expect(testType).toBeDefined();
        expect(testValue).toBeDefined();
        if (StyleProcessors[key].isArray) {
          testValue = [testValue];
        }
        const result = cleanStyles(
          {
            [key]: testValue,
          },
          StyleProcessors
        );
        expect(result[key]).toBeUndefined();
      });
    });
  });
});
