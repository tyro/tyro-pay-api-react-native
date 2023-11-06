import {
  format4444Spacing,
  format464Spacing,
  format465Spacing,
  formatCardExpiry,
  formatCardNumber,
  isExpired,
} from './card-formatting';

describe('card formatting and inputs', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('should format 4444 spacing', () => {
    const testCardNumberData = [
      ['Partial', '411112', '4111 12'],
      ['Partial Two', '4111123412', '4111 1234 12'],
      ['Full', '4111123412341234', '4111 1234 1234 1234'],
    ];
    test.each(testCardNumberData)('%s', (name: string, input: string, output: string) => {
      expect(format4444Spacing(input)).toEqual(output);
    });
  });

  describe('should format 464 spacing', () => {
    const testCardNumberData = [
      ['Partial', '411112', '4111 12'],
      ['Partial Two', '411112341234', '4111 123412 34'],
      ['Full', '411112341234123', '4111 123412 3412'],
    ];
    test.each(testCardNumberData)('%s', (name: string, input: string, output: string) => {
      expect(format464Spacing(input)).toEqual(output);
    });
  });

  describe('should format 465 spacing', () => {
    const testCardNumberData = [
      ['Partial', '411112', '4111 12'],
      ['Partial Two', '411112341234', '4111 123412 34'],
      ['Full', '4111123412341234', '4111 123412 34123'],
    ];
    test.each(testCardNumberData)('%s', (name: string, input: string, output: string) => {
      expect(format465Spacing(input)).toEqual(output);
    });
  });

  describe('should format the card expiry correctly onInput', () => {
    const testCardExpiryData = [
      ['Full', '1122', '11/22'],
      ['Partial', '1/22', '1/22'], // Should not change this on input
      ['Spacing', '01 /22', '01/22'],
      ['Do nothing', '01/22', '01/22'],
      ['No triples', '1/333', '1/33'],
      ['No letter slash', 'A/', '/'],
      ['No leading double slash', '//', '/'],
      ['No after double slash', '01 //', '01/'],
      ['No spaced double slash', '01 / / ', '01/'],
      ['Never two slashes', '01 / 3 / ', '01/3'],
    ];
    test.each(testCardExpiryData)('%s', (name: string, input: string, output: string) => {
      expect(formatCardExpiry(input)).toEqual(output);
    });
  });

  describe('should format the card number correctly', () => {
    const testCardNumberData = [
      ['Partial', '411112', '4111 12'],
      ['Partial Two', '4111123412', '4111 1234 12'],
      ['Visa', '4111123412341234', '4111 1234 1234 1234'],
      ['MC', '5123123412341234', '5123 1234 1234 1234'],
      ['Amex', '347678901234564', '3476 789012 34564'],
      ['JCB', '3530111333300000', '3530 111333 300000'],
      ['Diner', '30569309025904', '3056 930902 5904'],
      ['Unknown', '9999999999999999', '9999 9999 9999 9999'],
      ['Not a card', 'ABCDEF', ''],
    ];
    test.each(testCardNumberData)('card type %s', (name: string, input: string, output: string) => {
      expect(formatCardNumber(input)).toEqual(output);
    });
  });

  describe('should pass expiry of next year', () => {
    expect(isExpired((new Date().getFullYear() + 1).toString().substring(2), '01')).toEqual(false);
  });

  describe('should pass expiry of current month', () => {
    expect(isExpired(new Date().getFullYear().toString().substring(2), (new Date().getMonth() + 1).toString())).toEqual(
      false
    );
  });

  describe('should fail expiry of prior year', () => {
    expect(isExpired('12', '10')).toEqual(true);
  });
});
