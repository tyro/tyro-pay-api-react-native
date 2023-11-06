import { invoke3DSecureAuth } from './3dsecure-auth-service';
import * as helpers from '../utils/helpers';

jest.mock('../utils/helpers', () => {
  return {
    __esModule: true,
    ...jest.requireActual('../utils/helpers'),
    isAndroid: jest.fn(),
  };
});
const mockedHelpers = helpers as jest.Mocked<typeof helpers>;

describe('invoke3DSecureAuth', () => {
  const url = 'https://api.tyro.com/connect/pay/client/3dsecure/auth';
  const androidBody =
    '{"javaEnabled":false,"javascriptEnabled":true,"language":"en-AU","userAgent":"Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1","colorDepth":"24","screenHeight":"1334","screenWidth":"750","timezone":"0"}';
  const iosBody =
    '{"javaEnabled":false,"javascriptEnabled":true,"language":"en-AU","userAgent":"Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1","colorDepth":"24","screenHeight":"1334","screenWidth":"750","timezone":"0"}';
  const authRequest = {
    body: '',
    headers: { Accept: '*/*', 'Content-Type': 'application/json', 'Pay-Secret': 'secret' },
    method: 'POST',
  };
  it('fetches with correct params on Android', async () => {
    mockedHelpers.isAndroid.mockReturnValue(true);
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ status: 'SUCCESS' }),
      })
    ) as jest.Mock;
    await invoke3DSecureAuth('secret');
    await expect(fetch).toBeCalledWith(url, { ...authRequest, body: androidBody });
  });

  it('fetches with correct params on iOS', async () => {
    mockedHelpers.isAndroid.mockReturnValue(false);
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ status: 'SUCCESS' }),
      })
    ) as jest.Mock;
    await invoke3DSecureAuth('secret');
    await expect(fetch).toBeCalledWith(url, { ...authRequest, body: iosBody });
  });
});
