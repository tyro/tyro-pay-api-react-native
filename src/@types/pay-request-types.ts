import { SupportedNetworks } from './network-types';

export interface PayRequestOrigin {
  orderId: string;
  orderReference?: string;
  name?: string;
}

export enum PayRequestStatus {
  AWAITING_PAYMENT_INPUT = 'AWAITING_PAYMENT_INPUT',
  AWAITING_AUTHENTICATION = 'AWAITING_AUTHENTICATION',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  VOIDED = 'VOIDED',
}

export interface AmountWithCurrency {
  amount: number;
  currency: string;
}

export enum CaptureMethod {
  AUTOMATIC = 'AUTOMATIC',
  MANUAL = 'MANUAL',
}

export interface ClientPayRequestResponse {
  origin: PayRequestOrigin;
  status: PayRequestStatus;
  capture?: {
    method: CaptureMethod;
    total?: AmountWithCurrency;
  };
  total: AmountWithCurrency;
  threeDSecure?: ThreeDSecure;
  errorCode?: string;
  errorMessage?: string;
  gatewayCode?: string;
  supportedNetworks: SupportedNetworks[] | null;
  isLive: boolean;
}

export type PayRequestResponse = {
  id: string;
  paySecret: string;
};

export interface ClientCardSubmitResponse {
  status: HttpStatusCode;
  data?: {
    error?: string;
    errorCode?: string;
  };
}

export enum ThreeDSecureStatus {
  AWAITING_3DS_METHOD = 'AWAITING_3DS_METHOD',
  AWAITING_AUTH = 'AWAITING_AUTH',
  AWAITING_CHALLENGE = 'AWAITING_CHALLENGE',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export interface ThreeDSecure {
  status: ThreeDSecureStatus;
  methodURL?: string;
  challengeURL?: string;
}

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  BAD_REQUEST = 400,
  FORBIDDEN = 403,
  INTERNAL_SERVER_ERROR = 500,
  CONFLICT = 409,
}
