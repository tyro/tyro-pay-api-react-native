import { View, Text, Button, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTyro, PaySheet } from '@tyro/tyro-pay-api-react-native';
import { createPayRequest } from './clients/mock-client';

// Demo Component: initPaySheet and rendering the PaySheet
const CheckOut = (): JSX.Element => {
  const [loadPaySheet, setLoadPaySheet] = useState(false);
  const [showPayResult, setShowPayResult] = useState(false);
  const { initPaySheet, tyroError, payRequest, hasPayRequestCompleted, isWalletPaymentReady } = useTyro();

  const fetchPayRequest = async (): Promise<void> => {
    const { paySecret } = await createPayRequest();
    try {
      const paymentItems = [{
        label: "Burger",
        type: "custom",
        amount: "1.00",
      }];
      
      await initPaySheet(paySecret, paymentItems);
    } catch (error) {
      console.log(error);
    }
  };

  const presentPaySheet = async (): Promise<void> => {
    setLoadPaySheet(true);
    await fetchPayRequest();
  };

  useEffect(() => {
    if (!payRequest) return;

    if (hasPayRequestCompleted()) {
      setShowPayResult(true);
    } else {
      setShowPayResult(false);
    }
  }, [payRequest]);

  return (
    <View>
      {!isWalletPaymentReady && <View style={styles.checkoutButtonContainer}><Button title="Checkout" onPress={presentPaySheet} /></View>}      
      {loadPaySheet && <PaySheet />}
      {tyroError?.errorType && <Text>ErrorType: {tyroError.errorType}</Text>}
      {tyroError?.errorCode && <Text>ErrorCode: {tyroError.errorCode}</Text>}
      {tyroError?.gatewayCode && <Text>GatewayCode: {tyroError.gatewayCode}</Text>}
      {tyroError?.errorMessage && <Text>ErrorMessage: {tyroError.errorMessage}</Text>}
      {showPayResult && tyroError === null && <Text>{'Pay Request Status: ' + payRequest?.status}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  checkoutButtonContainer: { marginBottom: 20 },
});

export default CheckOut;
