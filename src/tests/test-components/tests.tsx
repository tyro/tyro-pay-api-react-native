import React, { useEffect } from 'react';
import PaySheet from '../../PaySheet';
import { useTyro } from '../../TyroSharedContext';
import { genNewPayRequest } from '../../clients/mock-client';
import { useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useSDK } from '../../SDKSharedContext';
import CreditCardForm from '../../components/CreditCardForm';

export const useYear = parseInt(new Date().getFullYear().toString().slice(-2)) + 2;
export const ProviderTestComponent = (): JSX.Element => {
  const { options } = useSDK();

  return (
    <View>
      <Text>liveMode: {options.liveMode.toString()}</Text>
      {options.options.applePay?.enabled && <Text>applePay</Text>}
      {options.options.googlePay?.enabled && <Text>googlePay</Text>}
      {options.options.creditCardForm?.enabled && <Text>creditCard</Text>}
      <Text>{options.theme}</Text>
    </View>
  );
};

type InitTestComponentProps = {
  passPaySecret: boolean;
};

export const InitTestComponent = ({ passPaySecret }: InitTestComponentProps): JSX.Element => {
  const [loadPaySheet, setLoadPaySheet] = useState(false);
  const [showPayResult, setShowPayResult] = useState(false);
  const { initPaySheet, tyroError, payRequest, isSubmitting, hasPayRequestCompleted, submitPayForm } = useTyro();

  const fetchPayRequest = async (): Promise<void> => {
    let paySecret;
    if (passPaySecret) {
      paySecret = { paySecret } = await genNewPayRequest();
    }
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
    setShowPayResult(hasPayRequestCompleted());
  }, [payRequest]);

  return (
    <View>
      <Button testID="test-button" title="Checkout" onPress={presentPaySheet} />
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
      {showPayResult && <Text>{'Pay Request Status: ' + payRequest?.status}</Text>}
    </View>
  );
};

type testPayButtonProps = {
  title: string;
};

export const TestPayButton = ({ title }: testPayButtonProps): JSX.Element => {
  const { tyroError, isSubmitting, submitPayForm } = useTyro();
  return (
    <View>
      <CreditCardForm />
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
          <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
      )}
      <Text>{tyroError ? tyroError.errorType + ': ' + tyroError.errorMessage : 'no error'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
