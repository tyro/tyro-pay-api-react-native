import { TYRO_BASE_URL } from './constants';

export type PayRequestResponse = {
  id: string;
  paySecret: string;
};

type PayRequestRequestPayload = {
  amountInCents: number;
  locationId: string;
};

const getDemoPayRequest = async (payload: PayRequestRequestPayload): Promise<PayRequestResponse> => {
  const data = await fetch(`${TYRO_BASE_URL}/pay/demo/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });

  const jsonResponse = await data.json();

  return {
    id: jsonResponse.id,
    paySecret: jsonResponse.paySecret,
  };
};

export const createPayRequest = async (amountInCents: number): Promise<PayRequestResponse> => {
  const payload = {
    amountInCents,
    locationId: 'tc-demolocation-2000',
  };

  const payRequest = await getDemoPayRequest(payload);

  return payRequest;
};
