import { ErrorMessageType, TyroErrorMessages } from '../@types/message-types';
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

  it('Should return a message when no form', () => {
    const error = errorMessage(TyroErrorMessages[ErrorMessageType.NO_FORM]);
    expect(error.errorType).toEqual(ErrorMessageType.NO_FORM);
    expect(error.errorCode).toEqual(undefined);
    expect(error.errorMessage).toEqual('No form');
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

  it('Should return a message when already processed', () => {
    const error = errorMessage(TyroErrorMessages[ErrorMessageType.ALREADY_PROCESSED]);
    expect(error.errorType).toEqual(ErrorMessageType.ALREADY_PROCESSED);
    expect(error.errorCode).toEqual(undefined);
    expect(error.errorMessage).toEqual('PayRequest already processed');
  });

  it('Should return a message when timeout', () => {
    const error = errorMessage(TyroErrorMessages[ErrorMessageType.TIMEOUT]);
    expect(error.errorType).toEqual(ErrorMessageType.TIMEOUT);
    expect(error.errorCode).toEqual(undefined);
    expect(error.errorMessage).toEqual('Timeout');
  });
  it('Should return a message when invalid action', () => {
    const error = errorMessage(TyroErrorMessages[ErrorMessageType.INVALID_ACTION]);
    expect(error.errorType).toEqual(ErrorMessageType.INVALID_ACTION);
    expect(error.errorCode).toEqual(undefined);
    expect(error.errorMessage).toEqual('Invalid action');
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

  it('Should return a message when environment mismatch', () => {
    const error = errorMessage(TyroErrorMessages[ErrorMessageType.ENVIRONMENT_MISMATCH]);
    expect(error.errorType).toEqual(ErrorMessageType.ENVIRONMENT_MISMATCH);
    expect(error.errorCode).toEqual(undefined);
    expect(error.errorMessage).toEqual(
      'There is an environment mismatch. Check TyroProvider was initialised with the correct value for liveMode'
    );
  });
});
