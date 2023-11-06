export interface ThreeDSecureAuthRequest {
  colorDepth: string;
  javaEnabled: boolean;
  javascriptEnabled: boolean;
  language: string;
  screenHeight: string;
  screenWidth: string;
  timezone: string;
  userAgent: string;
}

export type ThreeDSCheckType = {
  isTrue: boolean;
  url: string;
};
