import { ClientPayRequestResponse } from '../../@types/pay-request-types';

export const mockFetch = async (status: number, payload: ClientPayRequestResponse | null): Promise<Response> => {
  return {
    status: status,
    json: () => Promise.resolve(payload),
  } as Response;
};

global.fetch = jest.fn(() =>
  mockFetch(200, { status: 'AWAITING_PAYMENT_INPUT', isLive: false } as ClientPayRequestResponse)
);
