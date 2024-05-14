import { View, Text, Button, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTyro, PaySheet } from '@tyro/tyro-pay-api-react-native';
import { createPayRequest } from './clients/mock-client';

// Demo Component: initPaySheet and rendering the PaySheet
const CheckOut = (): JSX.Element => {
  const [loadPaySheet, setLoadPaySheet] = useState(false);
  const [showPayResult, setShowPayResult] = useState(false);
  const { initPaySheet, tyroError, payRequest, hasPayRequestCompleted, submitPayForm, isSubmitting } = useTyro();

  const fetchPayRequest = async (): Promise<void> => {
    const { paySecret } = await createPayRequest();
    try {
      await initPaySheet(paySecret);
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
      <View style={styles.checkoutButtonContainer}>
        <Button title="Checkout" onPress={presentPaySheet} />
      </View>
      {loadPaySheet && (
        <View>
          <PaySheet />
          {isSubmitting ? (
            <ActivityIndicator />
          ) : (
            <TouchableOpacity
              style={[styles.container, styles.button]}
              activeOpacity={0.3}
              onPress={submitPayForm}
              accessibilityLabel="Submit the Pay Form"
              testID="pay-button"
            >
              <Text style={styles.buttonText}>Pay</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
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
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  button: {
    borderRadius: 5,
    height: 40,
    width: '100%',
    backgroundColor: 'blue',
  },
  buttonText: {
    color: 'white',
  },
});

export default CheckOut;
