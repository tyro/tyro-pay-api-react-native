import { TyroSDKError } from './sdk-error';

export class PaySheetInitError extends TyroSDKError {
  constructor(errorCode: string) {
    super(errorCode);
  }
}
