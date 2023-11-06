import { CardDetails } from '../@types/card-types';
import { validateAllInputs } from './validators';

describe('Validators', () => {
  describe('validateAllInputs', () => {
    const correctCardDetails = {
      nameOnCard: 'test name',
      number: '4111111111111111',
      expiry: {
        year: '50',
        month: '12',
      },
      securityCode: '123',
    } as CardDetails;
    describe('missing all card details', () => {
      it('should return empty object if no validation errors', () => {
        const result = validateAllInputs({ ...correctCardDetails });
        expect(result).toEqual({});
      });
    });
    describe('name errors', () => {
      it('should return card name errors when no name', () => {
        const result = validateAllInputs({ ...correctCardDetails, nameOnCard: '' });
        expect(result).toEqual({ card_name: 'Please enter a card name' });
      });
    });
    describe('card number errors', () => {
      it('should return card number errors when no card number', () => {
        const result = validateAllInputs({ ...correctCardDetails, number: '' });
        expect(result).toEqual({ card_number: 'Please enter a card number' });
      });
      it('should return error when card number < 16', () => {
        const result = validateAllInputs({ ...correctCardDetails, number: '41' });
        expect(result).toEqual({ card_number: 'Your card number is invalid' });
      });
      it('should return error when card number is invalid', () => {
        const result = validateAllInputs({ ...correctCardDetails, number: '1234567891234567' });
        expect(result).toEqual({ card_number: 'Your card number is invalid' });
      });
    });
    describe('card expiry errors', () => {
      it('should return error for no card expiry when nothing entered', () => {
        const result = validateAllInputs({ ...correctCardDetails, expiry: { year: '', month: '' } });
        expect(result).toEqual({ card_expiry: 'Please enter a card expiry' });
      });
      it('should return error for invalid card expiry', () => {
        const result = validateAllInputs({ ...correctCardDetails, expiry: { year: 'as', month: '99' } });
        expect(result).toEqual({ card_expiry: 'Invalid card expiry' });
      });
      it('should return error if card expired', () => {
        const result = validateAllInputs({ ...correctCardDetails, expiry: { year: '23', month: '01' } });
        expect(result).toEqual({ card_expiry: 'Your card is expired' });
      });
    });
    describe('security code errors', () => {
      it('should return error message when no security code', () => {
        const result = validateAllInputs({ ...correctCardDetails, securityCode: '' });
        expect(result).toEqual({ card_cvv: 'Please enter a security code' });
      });
      it('should return a invalid security code error if the number is < 3', () => {
        const result = validateAllInputs({ ...correctCardDetails, securityCode: '1' });
        expect(result).toEqual({ card_cvv: 'Invalid security code' });
      });
      it('should return a invalid security code error if the number is > 4', () => {
        const result = validateAllInputs({ ...correctCardDetails, securityCode: '12345' });
        expect(result).toEqual({ card_cvv: 'Invalid security code' });
      });
    });
  });
});
