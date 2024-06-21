export class TyroSDKError extends Error {
  errorCode: string;
  constructor(errorCode: string) {
    super();
    this.errorCode = errorCode;
  }
}
