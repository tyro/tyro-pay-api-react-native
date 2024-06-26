import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTyro, PaySheet } from '@tyro/tyro-pay-api-react-native';
import { createPayRequest } from './clients/pay-request-client';
import { RootStackProps } from './@types/navigation';
import ButtonWithLoader from './components/ButtonWithLoader';

type Props = RootStackProps<'CheckOut'>;

// Demo Component: initPaySheet and rendering the PaySheet
const CheckOut = ({ route }: Props): JSX.Element => {
  const { cart } = route.params;
  const [showPayResult, setShowPayResult] = useState(false);
  const [cartAmount, setCartAmount] = useState(0);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const {
    initPaySheet,
    tyroError,
    payRequest,
    hasPayRequestCompleted,
    submitPayForm,
    isSubmitting,
    isPayRequestReady,
  } = useTyro();

  useEffect(() => {
    const amount = cart.reduce((total, item) => {
      return total + item.price;
    }, 0);
    setCartAmount(amount);
    setIsCartLoaded(true);
  }, [cart]);

  useEffect(() => {
    if (isCartLoaded) {
      fetchPayRequest();
    }
  }, [isCartLoaded]);

  const fetchPayRequest = async (): Promise<void> => {
    const { paySecret } = await createPayRequest(cartAmount);
    try {
      await initPaySheet(paySecret);
    } catch (error) {
      console.log(error);
    }
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
    <ScrollView style={styles.outerContainer}>
      {isPayRequestReady && !showPayResult && (
        <View style={styles.contentContainer}>
          <PaySheet />
          <Text style={styles.amountNumber}>${(cartAmount / 100).toFixed(2)}</Text>
          <ButtonWithLoader
            onPress={submitPayForm}
            disabled={showPayResult}
            isLoading={isSubmitting}
            accessibilityLabel="Submit Payment"
            testID="pay-button"
            style={styles.button}
          >
            <Text style={styles.buttonText}>Pay</Text>
          </ButtonWithLoader>
        </View>
      )}
      {showPayResult ||
        (tyroError && (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            {tyroError && (
              <>
                <Text>ErrorType: {tyroError.errorType}</Text>
                <Text>ErrorCode: {tyroError.errorCode}</Text>
                <Text>GatewayCode: {tyroError.gatewayCode}</Text>
                <Text>ErrorMessage: {tyroError.errorMessage}</Text>
              </>
            )}
            {showPayResult && <Text style={styles.statusText}>{payRequest?.status}</Text>}
          </View>
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  checkoutButtonContainer: { marginBottom: 20 },
  outerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    padding: 10,
    flex: 1,
  },
  button: {
    borderRadius: 5,
    height: 40,
    width: '100%',
    maxHeight: 40,
    backgroundColor: 'blue',
    justifyContent: 'center',
  },
  buttonText: {
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    width: '100%',
  },
  amountNumber: {
    fontSize: 30,
    alignSelf: 'flex-end',
    padding: 10,
    marginTop: 20,
  },
  statusText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default CheckOut;
