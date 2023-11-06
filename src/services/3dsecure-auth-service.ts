import { send3DSecureAuthRequest } from '../clients/three-d-secure-client';
import { ThreeDSecureAuthRequest } from '../@types/3d-secure';
import { Dimensions, Platform } from 'react-native';
import { getUserAgent } from '../utils/helpers';
export const { height, width } = Dimensions.get('window');

export const invoke3DSecureAuth = async (paySecret: string): Promise<void> => {
  const authRequest: ThreeDSecureAuthRequest = {
    javaEnabled: false,
    javascriptEnabled: true,
    language: 'en-AU',
    userAgent: getUserAgent(Platform.OS),
    colorDepth: '24',
    screenHeight: Math.trunc(height).toString(),
    screenWidth: Math.trunc(width).toString(),
    timezone: new Date().getTimezoneOffset().toString(),
  };
  await send3DSecureAuthRequest(paySecret, authRequest);
};
