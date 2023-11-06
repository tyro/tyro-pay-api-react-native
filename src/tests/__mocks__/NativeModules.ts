import { NativeModules } from 'react-native';
NativeModules.TyroPaySdkModule = {
  startWalletPay: jest.fn(),
  initWalletPay: jest.fn(),
};
