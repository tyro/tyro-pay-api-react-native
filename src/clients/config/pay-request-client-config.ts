import { PayRequestStatus } from '../../@types/pay-request-types';

export const POLL_INTERVAL_MS = 500;
export const PAY_REQUEST_POLL_MAX_RETRIES = 60;
export const INITIAL_UPDATED_STATUSES = [
  PayRequestStatus.SUCCESS,
  PayRequestStatus.FAILED,
  PayRequestStatus.AWAITING_AUTHENTICATION,
];
