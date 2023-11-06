import { PayRequestResponse } from '../@types/pay-request-types';
import { TYRO_BASE_URL } from './constants';

const randomPaySecret = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let randomString = '%2';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    randomString += chars.charAt(randomIndex);
  }
  return randomString;
};

export const getDemoPaySecret = async (): Promise<string> => {
  const data = await fetch(`${TYRO_BASE_URL}/pay/demo/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({}),
  });
  const jsonResponse = await data.json();
  return jsonResponse.paySecret;
};

export const createPayRequest = async (): Promise<PayRequestResponse> => {
  return {
    id: 'mockId',
    paySecret: await getDemoPaySecret(),
  };
};

export const genNewPayRequest = async (): Promise<PayRequestResponse> => {
  return {
    id: 'mockId',
    paySecret: randomPaySecret(20),
  };
};
