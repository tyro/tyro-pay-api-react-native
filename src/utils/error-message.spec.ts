import { ErrorMessageType, TyroErrorMessages } from '../@types/error-message-types';
import { errorMessage } from './error-message';
describe('errorMessage()', () => {
  it('Should return a message when not initialised', () => {
    const error = errorMessage(TyroErrorMessages[ErrorMessageType.CLIENT_INITIALISATION_ERROR]);
    expect(error.errorType).toEqual(ErrorMessageType.CLIENT_INITIALISATION_ERROR);
    expect(error.errorCode).toEqual(undefined);
    expect(error.errorMessage).toEqual(`${TyroErrorMessages.CLIENT_INITIALISATION_ERROR.message}`);
  });

  it('Should return a message when invalid paySecret', () => {
    const error = errorMessage(TyroErrorMessages[ErrorMessageType.PAY_REQUEST_ERROR]);
    expect(error.errorType).toEqual(ErrorMessageType.PAY_REQUEST_ERROR);
    expect(error.errorCode).toEqual(undefined);
    expect(error.errorMessage).toEqual(`${TyroErrorMessages.PAY_REQUEST_ERROR.message}`);
  });

  it('Should return a message when not initialised', () => {
    const error = errorMessage(TyroErrorMessages[ErrorMessageType.SERVER_ERROR]);
    expect(error.errorType).toEqual(ErrorMessageType.SERVER_ERROR);
    expect(error.errorCode).toEqual(undefined);
    expect(error.errorMessage).toEqual(`${TyroErrorMessages.SERVER_ERROR.message}`);
  });

  it('Should return a message when payment failed and no errorCode passed in', () => {
    const error = errorMessage(TyroErrorMessages[ErrorMessageType.CARD_ERROR]);
    expect(error.errorType).toEqual(ErrorMessageType.CARD_ERROR);
    expect(error.errorCode).toEqual(undefined);
    expect(error.errorMessage).toEqual(`${TyroErrorMessages.CARD_ERROR.message}`);
  });
});
