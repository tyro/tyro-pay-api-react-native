import {
  pollFor3DSecureMethodResult,
  pollFor3DSecureAuthResult,
  pollFor3DSecureChallengeAndFinalResult,
} from './three-d-secure-client';

const paySecret = 'some-secret';

describe('three-d-secure-client', () => {
  const headers = {
    headers: { 'Pay-Secret': 'some-secret' },
  };
  const url = 'https://api.tyro.com/connect/pay/client/requests';
  describe('pollFor3DSecureMethodResult', () => {
    it('polls for AWAITING_AUTH result', async () => {
      const payStatus = { status: 'AWAITING_AUTHENTICATION', threeDSecure: { status: 'AWAITING_AUTH' } };
      global.fetch = jest.fn(() =>
        Promise.resolve({
          status: 200,
          json: () => Promise.resolve(payStatus),
        })
      ) as jest.Mock;
      const result = await pollFor3DSecureMethodResult(paySecret);
      expect(result?.status).toEqual(payStatus.status);
      expect(fetch).toBeCalledWith(url, headers);
    });

    it('returns null if there is an error polling', async () => {
      global.fetch = jest.fn(() => {
        throw new Error();
      }) as jest.Mock;
      const result = await pollFor3DSecureMethodResult(paySecret);
      expect(result).toEqual(null);
      expect(fetch).toBeCalledWith(url, headers);
    });

    it('returns null if the paySecret is incorrect', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          status: 403,
        })
      ) as jest.Mock;
      const result = await pollFor3DSecureMethodResult(paySecret);
      expect(result).toEqual(null);
      expect(fetch).toBeCalledWith(url, headers);
    });
  });

  describe('pollFor3DSecureAuthResult', () => {
    it('polls for AWAITING_CHALLENGE result', async () => {
      const payStatus = { status: 'AWAITING_AUTHENTICATION', threeDSecure: { status: 'AWAITING_CHALLENGE' } };
      global.fetch = jest.fn(() =>
        Promise.resolve({
          status: 200,
          json: () => Promise.resolve(payStatus),
        })
      ) as jest.Mock;
      const result = await pollFor3DSecureAuthResult(paySecret);
      expect(result?.status).toEqual('AWAITING_AUTHENTICATION');
      expect(fetch).toBeCalledWith(url, headers);
    });

    it('returns null if there is an error polling', async () => {
      global.fetch = jest.fn(() => {
        throw new Error();
      }) as jest.Mock;
      const result = await pollFor3DSecureAuthResult(paySecret);
      expect(result).toEqual(null);
      expect(fetch).toBeCalledWith(url, headers);
    });

    it('returns null if the paySecret is incorrect', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          status: 403,
        })
      ) as jest.Mock;
      const result = await pollFor3DSecureAuthResult(paySecret);
      expect(result).toEqual(null);
      expect(fetch).toBeCalledWith(url, headers);
    });
  });

  describe('pollFor3DSecureChallengeAndFinalResult', () => {
    it('polls for SUCCESS result', async () => {
      const payStatus = { status: 'SUCCESS' };
      global.fetch = jest.fn(() =>
        Promise.resolve({
          status: 200,
          json: () => Promise.resolve(payStatus),
        })
      ) as jest.Mock;
      const result = await pollFor3DSecureChallengeAndFinalResult(paySecret);
      expect(result?.status).toEqual(payStatus.status);
      expect(fetch).toBeCalledWith(url, headers);
    });

    it('polls for FAILED result', async () => {
      const payStatus = { status: 'FAILED' };
      global.fetch = jest.fn(() =>
        Promise.resolve({
          status: 200,
          json: () => Promise.resolve(payStatus),
        })
      ) as jest.Mock;
      const result = await pollFor3DSecureChallengeAndFinalResult(paySecret);
      expect(result?.status).toEqual(payStatus.status);
      expect(fetch).toBeCalledWith(url, headers);
    });

    it('returns null if there is an error polling', async () => {
      global.fetch = jest.fn(() => {
        throw new Error();
      }) as jest.Mock;
      const result = await pollFor3DSecureChallengeAndFinalResult(paySecret);
      expect(result).toEqual(null);
      expect(fetch).toBeCalledWith(url, headers);
    });

    it('returns null if the paySecret is incorrect', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          status: 403,
        })
      ) as jest.Mock;
      const result = await pollFor3DSecureChallengeAndFinalResult(paySecret);
      expect(result).toEqual(null);
      expect(fetch).toBeCalledWith(url, headers);
    });
  });
});
