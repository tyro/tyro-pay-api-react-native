import tyroSdk from '../TyroSDK';
import {
  CaptureMethod,
  ClientPayRequestResponse,
  PayRequestStatus,
  ThreeDSecureStatus,
} from '../@types/pay-request-types';

const mockFetch = async (status: number, payload: ClientPayRequestResponse): Promise<Response> => {
  return {
    status: status,
    json: () => Promise.resolve(payload),
  } as Response;
};

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
  beforeAll(() => {
    jest.clearAllMocks();
  });

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
    await expect(tyroSdk.initPaySheet('secret', true)).rejects.toThrowError(new Error('ENVIRONMENT_MISMATCH'));
  });

  it('throws an error if the pay request was already submitted successfully', async () => {
    global.fetch = jest.fn(() => mockFetch(200, { status: 'SUCCESS', isLive: false } as ClientPayRequestResponse));
    await expect(tyroSdk.initPaySheet('secret', false)).rejects.toThrowError(
      new Error('Pay Request already submitted')
    );
  });

  it('throws an error if the pay secret is invalid', async () => {
    global.fetch = jest.fn(() =>
      mockFetch(403, { status: 'AWAITING_PAYMENT_INPUT', isLive: false } as ClientPayRequestResponse)
    );
    await expect(tyroSdk.initPaySheet('secret', false)).rejects.toThrowError(new Error('Invalid Pay Secret.'));
  });

  it('throws an error if the something went wrong with fetching pay request', async () => {
    global.fetch = jest.fn(() =>
      mockFetch(500, { status: 'AWAITING_PAYMENT_INPUT', isLive: false } as ClientPayRequestResponse)
    );
    await expect(tyroSdk.initPaySheet('secret', false)).rejects.toThrowError(new Error('Something went wrong.'));
  });

  it('throws an error if the pay secret is an empty string', async () => {
    await expect(tyroSdk.initPaySheet('', false)).rejects.toThrowError(new Error('NO_PAY_SECRET'));
  });
});
