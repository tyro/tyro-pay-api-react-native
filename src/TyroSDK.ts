import { getPayRequest } from './clients/pay-request-client';
import { ClientPayRequestResponse, PayRequestStatus } from './@types/pay-request-types';
import { TyroPayOptions, TyroPayOptionsKeys } from './@types/definitions';
import { isAndroid } from './utils/helpers';
import { Platform } from 'react-native';
import { NativeModules } from 'react-native';
import { WalletPaymentInitResult, WalletPaymentResult } from './@types/wallet-payment-result';

const { TyroPaySdkModule } = NativeModules;

class TyroSDK {
  private payRequest: ClientPayRequestResponse | undefined;
  private payStatus: PayRequestStatus | undefined;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  init = async (options: TyroPayOptions): Promise<void> => {
    // eslint-disable-next-line no-empty
    if (isAndroid(Platform.OS)) {
      // eslint-disable-next-line no-empty
    } else {
    }

    // TO DO: initialise native ios with config
  };

  initAndVerifyPaySecret = async (paySecret: string, liveMode: boolean): Promise<ClientPayRequestResponse> => {
    if (!paySecret) {
      throw new TypeError('NO_PAY_SECRET');
    }
    this.payRequest = await getPayRequest(paySecret);
    this.payStatus = this.payRequest.status;
    if (this.payRequest.isLive !== liveMode) {
      throw new Error('ENVIRONMENT_MISMATCH');
    }
    if (this.payRequestAlreadySubmitted(this.payStatus)) {
      throw new Error('Pay Request already submitted');
    }
    return this.payRequest;
  };

  initWalletPay = async (options: TyroPayOptions): Promise<WalletPaymentInitResult> => {
    const walletPaymentConfigs = options?.[TyroPayOptionsKeys.options];
    if (walletPaymentConfigs?.googlePay?.enabled) {
      const liveMode = options[TyroPayOptionsKeys.liveMode];
      const googlePaySupported: boolean = await TyroPaySdkModule.initWalletPay({
        googlePay: { ...walletPaymentConfigs.googlePay, liveMode },
      });
      return {
        googlePaySupported,
      };
    }
    return {};
  };

  initPaySheet = async (paySecret: string, liveMode: boolean): Promise<ClientPayRequestResponse> => {
    const payRequest = await this.initAndVerifyPaySecret(paySecret, liveMode);
    return payRequest;
  };

  startWalletPay = async (paySecret: string): Promise<WalletPaymentResult> => {
    const walletPaymentResult: WalletPaymentResult = await TyroPaySdkModule.startWalletPay(paySecret);
    return walletPaymentResult;
  };

  private payRequestAlreadySubmitted = (status: PayRequestStatus): boolean => {
    return status === PayRequestStatus.SUCCESS;
  };
}

export default new TyroSDK();
