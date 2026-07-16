import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import CreditCardForm from './components/CreditCardForm';
import Divider from './components/Divider';
import { useTyro } from './TyroSharedContext';
import WalletPaymentsContainer from './components/WalletPaymentsContainer';
import { TyroPayOptionsKeys } from './@types/definitions';
import { ThreeDSWebview } from './components/ThreeDSWebView';
import { getBodyStyles } from './services/style-drawer';
import { useSDK } from './SDKSharedContext';

const PaySheet = (): JSX.Element => {
  const { isPayRequestLoading, isPayRequestReady } = useTyro();
  const { options } = useSDK();

  const hasWalletPayments =
    options?.options?.applePay?.enabled === true || options?.options?.googlePay?.enabled === true;

  const styles = StyleSheet.create({
    ...getBodyStyles(options[TyroPayOptionsKeys.styleProps]),
  });

  return (
    <View style={styles.bodyWrapper}>
      <View style={styles.bodyContainer}>
        {isPayRequestReady && !isPayRequestLoading && (
          <>
            {hasWalletPayments && (
              <>
                <WalletPaymentsContainer />
                {options?.styleProps?.walletPaymentsDividerEnabled !== false && (
                  <Divider text={options?.styleProps?.walletPaymentsDividerText ?? 'Or pay with card'} />
                )}
              </>
            )}
            {options?.options?.creditCardForm?.enabled !== false && <CreditCardForm />}
          </>
        )}
        {isPayRequestLoading && <ActivityIndicator />}
        {!isPayRequestReady && !isPayRequestLoading && <></>}
        <ThreeDSWebview />
      </View>
    </View>
  );
};

export default PaySheet;
