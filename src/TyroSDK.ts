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
    const liveMode = options[TyroPayOptionsKeys.liveMode];
    let walletConfig = {};
    if (walletPaymentConfigs?.googlePay?.enabled) {
      walletConfig = {
        googlePay: { ...walletPaymentConfigs.googlePay, liveMode },
      };
    } else if (walletPaymentConfigs?.applePay?.enabled) {        
      walletConfig = {
        ...options.options.applePay,
        liveMode,
      };
    }
    const paymentSupported = await TyroPaySdkModule.initWalletPay(walletConfig);
    return {
      paymentSupported,
    };
  };

  initPaySheet = async (paySecret: string, liveMode: boolean): Promise<ClientPayRequestResponse> => {
    return this.initAndVerifyPaySecret(paySecret, liveMode);
  };

  startWalletPay = async (paySecret: string): Promise<WalletPaymentResult> => {
    return TyroPaySdkModule.startWalletPay(paySecret);
  };

  private payRequestAlreadySubmitted = (status: PayRequestStatus): boolean => {
    return status === PayRequestStatus.SUCCESS;
  };
}

export default new TyroSDK();
