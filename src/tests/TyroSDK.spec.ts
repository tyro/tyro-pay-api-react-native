import tyroSdk from '../TyroSDK';
import { NativeModules } from 'react-native';
import {
  CaptureMethod,
  ClientPayRequestResponse,
  PayRequestStatus,
  ThreeDSecureStatus,
} from '../@types/pay-request-types';
import { PaySheetInitError } from '../@types/sdk-errors/pay-sheet-init-error';
import { ErrorCodes } from '../@types/error-message-types';
import { TyroPayOptions } from '../@types/definitions';
import { isAndroid, isiOS } from '../utils/helpers';

const mockFetch = async (status: number, payload: ClientPayRequestResponse): Promise<Response> => {
  return {
    status: status,
    json: () => Promise.resolve(payload),
  } as Response;
};

jest.mock('../utils/helpers', () => ({
  isAndroid: jest.fn(),
  isiOS: jest.fn(),
}));

global.fetch = jest.fn(() =>
  mockFetch(200, {
    origin: {
      orderId: 'some string',
      orderReference: 'some string',
      name: 'some name',
    },
    status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
    capture: {
      method: CaptureMethod.AUTOMATIC,
      total: {
        amount: 100,
        currency: 'AUD',
      },
    },
    total: {
      amount: 100,
      currency: 'AUD',
    },
    threeDSecure: {
      status: ThreeDSecureStatus.AWAITING_CHALLENGE,
      methodURL: 'url',
      challengeURL: 'url',
    },
    errorCode: 'no error code',
    errorMessage: 'no error message',
    gatewayCode: '123',
    isLive: false,
  } as ClientPayRequestResponse)
);

describe('TyroSDK', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initPaySheet', () => {
    it('inits and verifies the pay secret and returns the PayRequestSimplifiedStatus', async () => {
      await expect(tyroSdk.initPaySheet('secret', false)).resolves.toEqual({
        errorMessage: 'no error message',
        errorCode: 'no error code',
        origin: {
          orderId: 'some string',
          orderReference: 'some string',
          name: 'some name',
        },
        status: 'AWAITING_PAYMENT_INPUT',
        threeDSecure: {
          challengeURL: 'url',
          methodURL: 'url',
          status: 'AWAITING_CHALLENGE',
        },
        total: {
          amount: 100,
          currency: 'AUD',
        },
        gatewayCode: '123',
        isLive: false,
        capture: {
          method: CaptureMethod.AUTOMATIC,
          total: {
            amount: 100,
            currency: 'AUD',
          },
        },
      });
    });

    it('throws an error if there was an environment mismatch', async () => {
      await expect(tyroSdk.initPaySheet('secret', true)).rejects.toThrowError(
        new PaySheetInitError(ErrorCodes.ENVIRONMENT_MISMATCH)
      );
    });

    it('throws an error if the pay request was already submitted successfully', async () => {
      global.fetch = jest.fn(() => mockFetch(200, { status: 'SUCCESS', isLive: false } as ClientPayRequestResponse));
      await expect(tyroSdk.initPaySheet('secret', false)).rejects.toThrowError(
        new PaySheetInitError(ErrorCodes.PAY_REQUEST_INVALID_STATUS)
      );
    });

    it('throws an error if the pay secret is invalid', async () => {
      global.fetch = jest.fn(() =>
        mockFetch(403, { status: 'AWAITING_PAYMENT_INPUT', isLive: false } as ClientPayRequestResponse)
      );
      try {
        await tyroSdk.initPaySheet('secret', false);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty('status', '403');
        expect(error.message).toBe('Http Status Error');
      }
    });

    it('throws an error if the something went wrong with fetching pay request', async () => {
      global.fetch = jest.fn(() =>
        mockFetch(500, { status: 'AWAITING_PAYMENT_INPUT', isLive: false } as ClientPayRequestResponse)
      );
      try {
        await tyroSdk.initPaySheet('secret', false);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty('status', '500');
        expect(error.message).toBe('Http Status Error');
      }
    });

    it('throws an error if the pay secret is an empty string', async () => {
      await expect(tyroSdk.initPaySheet('', false)).rejects.toThrowError(
        new PaySheetInitError(ErrorCodes.NO_PAY_SECRET)
      );
    });
  });

  describe('initWalletPay', () => {
    it('initializes wallet pay for Google Pay and Apple Pay on Android', async () => {
      NativeModules.TyroPaySdkModule.initWalletPay.mockResolvedValue(true);
      (isAndroid as jest.Mock).mockReturnValue(true);
      (isiOS as jest.Mock).mockReturnValue(false);
      const options = {
        options: {
          googlePay: { enabled: true, liveMode: false },
          applePay: { enabled: true, liveMode: false },
        },
        liveMode: false,
      } as unknown as TyroPayOptions;
      const result = await tyroSdk.initWalletPay(options);
      expect(result).toEqual({ paymentSupported: true });
      expect(NativeModules.TyroPaySdkModule.initWalletPay).toHaveBeenCalledWith({
        applePay: {
          enabled: true,
          liveMode: false,
        },
        googlePay: {
          enabled: true,
          liveMode: false,
        },
      });
    });
    it('initializes wallet pay for Google Pay and Apple Pay on iOS', async () => {
      NativeModules.TyroPaySdkModule.initWalletPay.mockResolvedValue(true);
      (isAndroid as jest.Mock).mockReturnValue(false);
      (isiOS as jest.Mock).mockReturnValue(true);
      const options = {
        options: {
          googlePay: { enabled: true, liveMode: false },
          applePay: { enabled: true, liveMode: false },
        },
        liveMode: false,
      } as unknown as TyroPayOptions;
      const result = await tyroSdk.initWalletPay(options);
      expect(result).toEqual({ paymentSupported: true });
      expect(NativeModules.TyroPaySdkModule.initWalletPay).toHaveBeenCalledWith({
        applePay: {
          enabled: true,
          liveMode: false,
        },
        googlePay: {
          enabled: true,
          liveMode: false,
        },
      });
    });
    it('does not call native module to init wallet if android and google pay disabled', async () => {
      NativeModules.TyroPaySdkModule.initWalletPay.mockResolvedValue(true);
      (isAndroid as jest.Mock).mockReturnValue(true);
      (isiOS as jest.Mock).mockReturnValue(false);
      const options = {
        options: {
          googlePay: { enabled: false, liveMode: false },
          applePay: { enabled: true, liveMode: false },
        },
        liveMode: false,
      } as unknown as TyroPayOptions;
      const result = await tyroSdk.initWalletPay(options);
      expect(result).toEqual({ paymentSupported: false });
      expect(NativeModules.TyroPaySdkModule.initWalletPay).not.toHaveBeenCalled();
    });
    it('does not call native module to init wallet if ios and apple pay disabled', async () => {
      NativeModules.TyroPaySdkModule.initWalletPay.mockResolvedValue(true);
      (isAndroid as jest.Mock).mockReturnValue(false);
      (isiOS as jest.Mock).mockReturnValue(true);
      const options = {
        options: {
          googlePay: { enabled: true, liveMode: false },
          applePay: { enabled: false, liveMode: false },
        },
        liveMode: false,
      } as unknown as TyroPayOptions;
      const result = await tyroSdk.initWalletPay(options);
      expect(result).toEqual({ paymentSupported: false });
      expect(NativeModules.TyroPaySdkModule.initWalletPay).not.toHaveBeenCalled();
    });
    it('throws init error when native module throws an error', async () => {
      NativeModules.TyroPaySdkModule.initWalletPay.mockRejectedValueOnce(new Error('boom'));
      (isAndroid as jest.Mock).mockReturnValue(true);
      (isiOS as jest.Mock).mockReturnValue(false);
      const options = {
        options: {
          googlePay: { enabled: true, liveMode: false },
          applePay: { enabled: false, liveMode: false },
        },
        liveMode: false,
      } as unknown as TyroPayOptions;
      await expect(tyroSdk.initWalletPay(options)).rejects.toThrowError(
        new PaySheetInitError(ErrorCodes.WALLET_INIT_FAILED)
      );
      expect(NativeModules.TyroPaySdkModule.initWalletPay).toHaveBeenCalled();
    });
  });
});
