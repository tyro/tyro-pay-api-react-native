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
  const { options, paySecret, handleWalletPaymentStatusUpdate } = useSDK();

  const styles = StyleSheet.create({
    ...getWalletPaymentsStyles(options[TyroPayOptionsKeys.styleProps]),
  });

  const launchWalletPayment = async (paySecret: string): Promise<void> => {
    const walletPaymentResult: WalletPaymentResult = await TyroSDK.startWalletPay(paySecret);
    handleWalletPaymentStatusUpdate(paySecret, walletPaymentResult);
  };

  return (
    <View style={{ ...styles.walletWrapper }}>
      <View style={{ ...styles.walletPadder }}>
        <TouchableOpacity
          style={{ ...styles.walletContainer }}
          onPress={(): void => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            launchWalletPayment(paySecret!);
          }}
        >
          {options?.options?.googlePay?.enabled && (
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            <GooglePayButton buttonStyles={options.styleProps.googlePayButton!} />
          )}

          {options?.options?.applePay?.enabled && (
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            <ApplePayButton buttonStyles={options.styleProps.applePayButton!} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WalletPaymentsContainer;
