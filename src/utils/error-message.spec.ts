import { ErrorMessageType, TyroErrorMessages } from '../@types/error-message-types';
import { errorMessage } from './error-message';
describe('errorMessage()', () => {
  it('Should return a message when not initialised', () => {
    const error = errorMessage(TyroErrorMessages[ErrorMessageType.PAYSHEET_INIT_FAILED]);
    expect(error.errorType).toEqual(ErrorMessageType.PAYSHEET_INIT_FAILED);
    expect(error.errorCode).toEqual(undefined);
    expect(error.errorMessage).toEqual('PaySheet failed to initialise');
  });

  it('Should return a message when invalid paySecret', () => {
    const error = errorMessage(TyroErrorMessages[ErrorMessageType.INVALID_PAY_SECRET]);
    expect(error.errorType).toEqual(ErrorMessageType.INVALID_PAY_SECRET);
    expect(error.errorCode).toEqual(undefined);
    expect(error.errorMessage).toEqual('The pay secret provided is invalid');
  });

  it('Should return a message when not initialised', () => {
    const error = errorMessage(TyroErrorMessages[ErrorMessageType.NOT_INITIALISED]);
    expect(error.errorType).toEqual(ErrorMessageType.NOT_INITIALISED);
    expect(error.errorCode).toEqual(undefined);
    expect(error.errorMessage).toEqual('TyroProvider not initialised');
  });

  it('Should return a message when payment failed and no errorCode passed in', () => {
    const error = errorMessage(TyroErrorMessages[ErrorMessageType.PAYMENT_FAILED]);
    expect(error.errorType).toEqual(ErrorMessageType.PAYMENT_FAILED);
    expect(error.errorCode).toEqual(undefined);
    expect(error.errorMessage).toEqual('Payment failed');
  });

  it('Should return a message/errorCode when payment failed and errorCode passed in', () => {
    const error = errorMessage(TyroErrorMessages[ErrorMessageType.PAYMENT_FAILED], 'DECLINED');
    expect(error.errorType).toEqual(ErrorMessageType.PAYMENT_FAILED);
    expect(error.errorCode).toEqual('DECLINED');
    expect(error.errorMessage).toEqual('Payment failed');
  });

  it('Should return a message when missing merchant details', () => {
    const error = errorMessage(TyroErrorMessages[ErrorMessageType.MISSING_MERCHANT_CONFIG]);
    expect(error.errorType).toEqual(ErrorMessageType.MISSING_MERCHANT_CONFIG);
    expect(error.errorCode).toEqual(undefined);
    expect(error.errorMessage).toEqual(
      'TyroProvider Failed to init due to missing Google and/or Apple Pay merchant details'
    );
  });
  it('Should return a message when invalid card details', () => {
    const error = errorMessage(TyroErrorMessages[ErrorMessageType.INVALID_CARD_DETAILS]);
    expect(error.errorType).toEqual(ErrorMessageType.INVALID_CARD_DETAILS);
    expect(error.errorCode).toEqual(undefined);
    expect(error.errorMessage).toEqual('Invalid card details');
  });

  it('Should return a message when server error', () => {
    const error = errorMessage(TyroErrorMessages[ErrorMessageType.SERVER_ERROR]);
    expect(error.errorType).toEqual(ErrorMessageType.SERVER_ERROR);
    expect(error.errorCode).toEqual(undefined);
    expect(error.errorMessage).toEqual('Server error');
  });

  it('Should return a message when timeout', () => {
    const error = errorMessage(TyroErrorMessages[ErrorMessageType.TIMEOUT]);
    expect(error.errorType).toEqual(ErrorMessageType.TIMEOUT);
    expect(error.errorCode).toEqual(undefined);
    expect(error.errorMessage).toEqual('Timeout');
  });

  it('Should return a message when no pay secret', () => {
    const error = errorMessage(TyroErrorMessages[ErrorMessageType.NO_PAY_SECRET]);
    expect(error.errorType).toEqual(ErrorMessageType.NO_PAY_SECRET);
    expect(error.errorCode).toEqual(undefined);
    expect(error.errorMessage).toEqual('No pay secret provided');
  });

  it('Should return a message when unknown error', () => {
    const error = errorMessage(TyroErrorMessages[ErrorMessageType.UNKNOWN_ERROR]);
    expect(error.errorType).toEqual(ErrorMessageType.UNKNOWN_ERROR);
    expect(error.errorCode).toEqual(undefined);
    expect(error.errorMessage).toEqual('Unknown error occurred');
  });
});
