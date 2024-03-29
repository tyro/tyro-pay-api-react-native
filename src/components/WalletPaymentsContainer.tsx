import GooglePayButton from '../wallets/google-pay/GooglePayButton';
import ApplePayButton from '../wallets/apple-pay/ApplePayButton';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { WalletPaymentResult } from '../@types/wallet-payment-result';
import TyroSDK from '../TyroSDK';
import { getWalletPaymentsStyles } from '../services/style-drawer';
import { TyroPayOptionsKeys } from '../@types/definitions';
import { useSDK } from '../SDKSharedContext';

export const WalletPaymentsContainer = (): JSX.Element => {
  const { options, paySecret, setPayRequestIsLoading, handleWalletPaymentStatusUpdate } = useSDK();

  const styles = StyleSheet.create({
    ...getWalletPaymentsStyles(options[TyroPayOptionsKeys.styleProps]),
  });

  const launchWalletPayment = async (paySecret: string): Promise<void> => {
    setPayRequestIsLoading(true);
    const walletPaymentResult: WalletPaymentResult = await TyroSDK.startWalletPay(paySecret);
    setPayRequestIsLoading(false);
    handleWalletPaymentStatusUpdate(paySecret, walletPaymentResult);
  };

  return (
    <TouchableOpacity
      style={{ ...styles.walletWrapper }}
      onPress={(): Promise<void> =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        launchWalletPayment(paySecret!)
      }
    >
      <View style={{ ...styles.walletPadder }}>
        <View style={{ ...styles.walletContainer }}>
          {options?.options?.googlePay?.enabled && (
            <GooglePayButton buttonStyles={options?.styleProps?.googlePayButton} />
          )}
          {options?.options?.applePay?.enabled && (
            <ApplePayButton
              title={'IOS Pay Button'}
              styles={{}}
              onSubmit={(): void => {
                // @Todo
                // Do nothing for now
              }}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default WalletPaymentsContainer;
