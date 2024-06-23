import { CardDetails } from '../@types/card-types';
import { ClientPayRequestResponse } from '../@types/pay-request-types';
import {
  getPayRequest,
  pollForInitialStatusUpdate,
  pollForResult,
  pollPayCompletion,
  submitPayRequest,
} from './pay-request-client';
const paySecret = 'pay-secret';

describe('pay-request-client', () => {
  const headers = {
    headers: { 'Pay-Secret': 'pay-secret' },
  };
  const url = 'https://api.tyro.com/connect/pay/client/requests';
  describe('getPayRequest()', () => {
    it('should return response when fetch pay request api returns SUCCESS', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          status: 200,
          json: () => Promise.resolve({ status: 'SUCCESS' }),
        })
      ) as jest.Mock;

      const getPayRequestResponse = await getPayRequest(paySecret);
      expect(getPayRequestResponse).toEqual({ status: 'SUCCESS' });
      expect(fetch).toBeCalledWith(url, headers);
    });

    it('should throw error when fetch pay request api returns non 200', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          status: 403,
        })
      ) as jest.Mock;
      try {
        await getPayRequest(paySecret);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty('status', '403');
        expect(error.message).toBe('Http Status Error');
      }
      expect(fetch).toBeCalledWith(url, headers);
    });
  });

  describe('submitPayRequest()', () => {
    const fetchHeaders = {
      'Pay-Secret': 'pay-secret',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const fetchBody = '{"cardDetails":{},"paymentType":"CARD"}';
    const fetchPayload = {
      headers: fetchHeaders,
      body: fetchBody,
      method: 'PATCH',
    };
    const fetchUrlSandbox = 'https://pay.inbound.sandbox.connect.tyro.com/connect/pay/client/requests';
    const fetchUrlPrd = 'https://pay.inbound.connect.tyro.com/connect/pay/client/requests';
    it('Submits successfully for liveMode === false', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          status: 202,
        })
      ) as jest.Mock;

      await expect(() => submitPayRequest(paySecret, {} as CardDetails, false)).not.toThrowError();
      expect(fetch).toHaveBeenCalledWith(fetchUrlSandbox, fetchPayload);
    });

    it('Submits successfully for liveMode === true', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          status: 202,
        })
      ) as jest.Mock;

      await expect(() => submitPayRequest(paySecret, {} as CardDetails, true)).not.toThrowError();
      expect(fetch).toHaveBeenCalledWith(fetchUrlPrd, fetchPayload);
    });

    it('throws an error if the status is not 202', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          status: 400,
        })
      ) as jest.Mock;

      await expect(submitPayRequest(paySecret, {} as CardDetails, false)).rejects.toThrow();
      expect(fetch).toHaveBeenCalledWith(fetchUrlSandbox, fetchPayload);
    });
  });

  describe('pollForResult', () => {
    it('gets the result', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          status: 200,
          json: () => Promise.resolve({ status: 'SUCCESS' }),
        })
      ) as jest.Mock;
      const status = { status: 'SUCCESS' } as ClientPayRequestResponse;
      const result = await pollForResult(paySecret, (status) => status.status === 'SUCCESS', 500, 60);
      expect(result).toEqual(status);
      expect(fetch).toHaveBeenCalledWith(url, headers);
    });

    it('returns the status after polling attempts exhausted', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          status: 200,
          json: () => Promise.resolve({ status: 'FAILED' }),
        })
      ) as jest.Mock;
      const result = await pollForResult(paySecret, (result) => result.status === 'SUCCESS', 20, 2);
      expect(result?.status).toEqual('FAILED');
      expect(fetch).toHaveBeenCalledWith(url, headers);
    });

    it('returns null if the paySecret is incorrect', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          status: 403,
        })
      ) as jest.Mock;
      const result = await pollForResult(paySecret, (result) => result.status === 'SUCCESS', 20, 2);
      expect(result).toEqual(null);
      expect(fetch).toHaveBeenCalledWith(url, headers);
    });

    it('returns null if an error occurred while polling for status', async () => {
      global.fetch = jest.fn(() => {
        throw new Error();
      }) as jest.Mock;
      const result = await pollForResult(paySecret, (result) => result.status === 'SUCCESS', 20, 2);
      expect(result).toEqual(null);
      expect(fetch).toHaveBeenCalledWith(url, headers);
    });
  });

  describe('pollForInitialStatusUpdate', () => {
    it('gets the initial SUCCESS status result', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          status: 200,
          json: () => Promise.resolve({ status: 'SUCCESS' }),
        })
      ) as jest.Mock;
      const result = await pollForInitialStatusUpdate(paySecret);
      expect(result?.status).toEqual('SUCCESS');
      expect(fetch).toHaveBeenCalledWith(url, headers);
    });

    it('gets the initial FAILED status result', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          status: 200,
          json: () => Promise.resolve({ status: 'FAILED' }),
        })
      ) as jest.Mock;
      const result = await pollForInitialStatusUpdate(paySecret);
      expect(result?.status).toEqual('FAILED');
      expect(fetch).toHaveBeenCalledWith(url, headers);
    });

    it('gets the initial AWAITING_AUTHENTICATION status result', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          status: 200,
          json: () => Promise.resolve({ status: 'AWAITING_AUTHENTICATION' }),
        })
      ) as jest.Mock;
      const result = await pollForInitialStatusUpdate(paySecret);
      expect(result?.status).toEqual('AWAITING_AUTHENTICATION');
      expect(fetch).toHaveBeenCalledWith(url, headers);
    });

    it('returns null if there was an error polling', async () => {
      global.fetch = jest.fn(() => {
        throw new Error();
      }) as jest.Mock;
      const result = await pollForInitialStatusUpdate(paySecret);
      expect(result).toEqual(null);
      expect(fetch).toHaveBeenCalledWith(url, headers);
    });

    it('returns null if the paySecret is incorrect', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          status: 403,
        })
      ) as jest.Mock;
      const result = await pollForInitialStatusUpdate(paySecret);
      expect(result).toEqual(null);
      expect(fetch).toHaveBeenCalledWith(url, headers);
    });
  });

  describe('pollPayCompletion', () => {
    it('gets the status', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          status: 200,
          json: () => Promise.resolve({ status: 'SUCCESS' }),
        })
      ) as jest.Mock;
      const result = await pollPayCompletion(paySecret);
      expect(result?.status).toEqual('SUCCESS');
      expect(fetch).toHaveBeenCalledWith(url, headers);
    });

    it('returns null if there was an error polling', async () => {
      global.fetch = jest.fn(() => {
        throw new Error();
      }) as jest.Mock;
      const result = await pollPayCompletion(paySecret);
      expect(result).toEqual(null);
      expect(fetch).toHaveBeenCalledWith(url, headers);
    });

    it('returns null if the paySecret is incorrect', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          status: 403,
        })
      ) as jest.Mock;
      const result = await pollPayCompletion(paySecret);
      expect(result).toEqual(null);
      expect(fetch).toHaveBeenCalledWith(url, headers);
    });
  });
});
