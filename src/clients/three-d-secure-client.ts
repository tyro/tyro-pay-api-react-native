/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ThreeDSecureAuthRequest } from '../@types/3d-secure';
import { ClientPayRequestResponse, PayRequestStatus, ThreeDSecureStatus } from '../@types/pay-request-types';
import { POLL_INTERVAL_MS, PAY_REQUEST_POLL_MAX_RETRIES } from './config/pay-request-client-config';
import {
  THREE_D_SECURE_METHOD_MAX_RETRIES,
  CHALLENGE_POLL_INTERVAL_MS,
  CHALLENGE_MAX_RETRIES,
} from './config/three-d-secure-client-config';
import { TYRO_BASE_URL } from './constants';
import { pollForResult } from './pay-request-client';

export const COMPLETION_STATUSES = [PayRequestStatus.SUCCESS, PayRequestStatus.FAILED];

export const pollFor3DSecureMethodResult = async (paySecret: string): Promise<ClientPayRequestResponse | null> => {
  // poll for 10 seconds
  const updatedPayRequest = await pollForResult(
    paySecret,
    (payRequestStatus) => payRequestStatus.threeDSecure!.status === ThreeDSecureStatus.AWAITING_AUTH,
    POLL_INTERVAL_MS,
    THREE_D_SECURE_METHOD_MAX_RETRIES
  );
  return updatedPayRequest;
};

export const pollFor3DSecureAuthResult = async (paySecret: string): Promise<ClientPayRequestResponse | null> => {
  const updatedPayRequest = await pollForResult(
    paySecret,
    (payRequestStatus) =>
      COMPLETION_STATUSES.includes(payRequestStatus.status) ||
      payRequestStatus.threeDSecure!.status === ThreeDSecureStatus.AWAITING_CHALLENGE,
    POLL_INTERVAL_MS,
    PAY_REQUEST_POLL_MAX_RETRIES
  );
  return updatedPayRequest;
};

export const pollFor3DSecureChallengeAndFinalResult = async (
  paySecret: string
): Promise<ClientPayRequestResponse | null> => {
  // poll for 10 mins
  const updatedPayRequest = await pollForResult(
    paySecret,
    (payRequestStatus) =>
      COMPLETION_STATUSES.includes(payRequestStatus.status) ||
      payRequestStatus.threeDSecure?.status === ThreeDSecureStatus.FAILED,
    CHALLENGE_POLL_INTERVAL_MS,
    CHALLENGE_MAX_RETRIES
  );
  return updatedPayRequest;
};

export const send3DSecureAuthRequest = async (
  paySecret: string,
  authRequest: ThreeDSecureAuthRequest
): Promise<Response> => {
  return fetch(`${TYRO_BASE_URL}/pay/client/3dsecure/auth`, {
    method: 'POST',
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
      'Pay-Secret': paySecret,
    },
    body: JSON.stringify(authRequest),
  });
};
