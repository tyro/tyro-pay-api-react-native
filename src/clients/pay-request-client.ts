import { ClientPayRequestResponse } from '../@types/pay-request-types';
import { CardDetails } from '../@types/card-types';
import { HTTP_ACCEPTED, HTTP_OK } from '../@types/http-status-codes';
import { PaymentType } from '../@types/payment-types';
import {
  INITIAL_UPDATED_STATUSES,
  PAY_REQUEST_POLL_MAX_RETRIES,
  POLL_INTERVAL_MS,
} from './config/pay-request-client-config';
import { LIVE_INBOUND_BASE_URL, SANDBOX_INBOUND_BASE_URL, TYRO_BASE_URL } from './constants';
import { HttpStatusError } from '../@types/http-error-types';

const setHeader = (paySecret: string): RequestInit => {
  return { headers: { 'Pay-Secret': paySecret } };
};

const httpStatusError = (data: Response): HttpStatusError => {
  const error = new Error('Http Status Error') as HttpStatusError;
  error.status = String(data.status);
  return error;
};

export const getPayRequest = async (paySecret: string): Promise<ClientPayRequestResponse> => {
  const data = await fetch(`${TYRO_BASE_URL}/pay/client/requests`, setHeader(paySecret) as RequestInit);
  if (data.status === HTTP_OK) {
    return data.json();
  }
  throw httpStatusError(data);
};

export const submitPayRequest = async (
  paySecret: string,
  cardDetails: CardDetails,
  liveMode: boolean
): Promise<void> => {
  const url = liveMode ? LIVE_INBOUND_BASE_URL : SANDBOX_INBOUND_BASE_URL;
  const response = await fetch(`${url}/connect/pay/client/requests`, {
    method: 'PATCH',
    headers: { 'Pay-Secret': paySecret, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ cardDetails, paymentType: PaymentType.CARD }),
  });
  if (response.status !== HTTP_ACCEPTED) {
    throw httpStatusError(response);
  }
};

export const pollForResult = async (
  paySecret: string,
  conditionFn: (statusResult: ClientPayRequestResponse) => boolean,
  pollIntervalMillis: number,
  pollMaxRetries: number
): Promise<ClientPayRequestResponse | null> => {
  let attemptNumber = 0;
  let statusResult: ClientPayRequestResponse | null = null;
  while (attemptNumber < pollMaxRetries) {
    try {
      statusResult = await getPayRequest(paySecret);
    } catch (e) {
      return null;
    }

    const conditionResult = conditionFn(statusResult);
    if (!conditionResult) {
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      await new Promise((r) => setTimeout(r, pollIntervalMillis));
      attemptNumber += 1;
    } else {
      return statusResult;
    }
  }
  return statusResult;
};

export const pollForInitialStatusUpdate = async (paySecret: string): Promise<ClientPayRequestResponse | null> => {
  return pollForResult(
    paySecret,
    (payRequestStatus) => INITIAL_UPDATED_STATUSES.includes(payRequestStatus.status),
    POLL_INTERVAL_MS,
    PAY_REQUEST_POLL_MAX_RETRIES
  );
};

export const pollPayCompletion = async (paySecret: string): Promise<ClientPayRequestResponse | null> => {
  const statusResponse: ClientPayRequestResponse | null = await pollForInitialStatusUpdate(paySecret);
  return statusResponse;
};
