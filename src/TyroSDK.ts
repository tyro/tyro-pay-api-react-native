import { getPayRequest } from './clients/pay-request-client';
import { ClientPayRequestResponse, PayRequestStatus } from './@types/pay-request-types';
import { TyroPayOptions, TyroPayOptionsKeys } from './@types/definitions';
import { NativeModules } from 'react-native';
import { WalletPaymentInitResult, WalletPaymentResult } from './@types/wallet-payment-result';
import { ErrorCodes } from './@types/error-message-types';
import { PaySheetInitError } from './@types/sdk-errors/pay-sheet-init-error';

const { TyroPaySdkModule } = NativeModules;

class TyroSDK {
  private throwIfEnvironmentMismatch(payRequestLiveMode: boolean, liveMode: boolean): void {
    if (payRequestLiveMode !== liveMode) {
      throw new PaySheetInitError(ErrorCodes.ENVIRONMENT_MISMATCH);
    }
  }

  private throwIfAlreadySubmitted(payRequestStatus: PayRequestStatus): void {
    if (this.payRequestAlreadySubmitted(payRequestStatus)) {
      throw new PaySheetInitError(ErrorCodes.PAY_REQUEST_INVALID_STATUS);
    }
  }

  initAndVerifyPaySecret = async (paySecret: string, liveMode: boolean): Promise<ClientPayRequestResponse> => {
    if (!paySecret) {
      throw new PaySheetInitError(ErrorCodes.NO_PAY_SECRET);
    }
    const payRequest = await getPayRequest(paySecret);
    this.throwIfEnvironmentMismatch(payRequest.isLive, liveMode);
    this.throwIfAlreadySubmitted(payRequest.status);
    return payRequest;
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
    try {
      const paymentSupported = await TyroPaySdkModule.initWalletPay(walletConfig);
      return {
        paymentSupported,
      };
    } catch (error) {
      throw new PaySheetInitError(ErrorCodes.WALLET_INIT_FAILED);
    }
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
