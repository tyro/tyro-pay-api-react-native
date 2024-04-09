import React, { useEffect } from 'react';
import PaySheet from '../../PaySheet';
import { useTyro } from '../../TyroSharedContext';
import { genNewPayRequest } from '../../clients/mock-client';
import { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { useSDK } from '../../SDKSharedContext';
import SubmitPayFormButton from '../../components/SubmitPayFormButton';
import { ValidationErrors } from '../../utils/validators';
import CreditCardForm from '../../components/CreditCardForm';
import { TyroPaymentItem } from '../../@types/definitions';

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

export const InitTestComponent = (): JSX.Element => {
  const [loadPaySheet, setLoadPaySheet] = useState(false);
  const [showPayResult, setShowPayResult] = useState(false);
  const { initPaySheet, tyroError, payRequest, hasPayRequestCompleted } = useTyro();

  const fetchPayRequest = async (): Promise<void> => {
    const { paySecret } = await genNewPayRequest();
    try {
      const paymentItems: TyroPaymentItem[] = [{
        label: "Burger",
        type: "custom",
        value: 1.00,
      }]
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
      <Button testID="test-button" title="Checkout" onPress={presentPaySheet} />
      {loadPaySheet && <PaySheet />}
      {tyroError?.errorType && <Text>ErrorType: {tyroError.errorType}</Text>}
      {tyroError?.errorCode && <Text>ErrorCode: {tyroError.errorCode}</Text>}
      {tyroError?.gatewayCode && <Text>GatewayCode: {tyroError.gatewayCode}</Text>}
      {tyroError?.errorMessage && <Text>ErrorMessage: {tyroError.errorMessage}</Text>}
      {showPayResult && <Text>{'Pay Request Status: ' + payRequest?.status}</Text>}
    </View>
  );
};

type TestButtonProps = {
  title: string;
};

export const TestPayButton = ({ title }: TestButtonProps): JSX.Element => {
  const { tyroError } = useTyro();
  const [validationErrors, setValidationErrors] = useState({} as ValidationErrors);
  return (
    <View>
      <CreditCardForm validationErrors={validationErrors} setValidationErrors={setValidationErrors} />
      <SubmitPayFormButton
        title={title}
        validationErrors={{} as ValidationErrors}
        setValidationErrors={(): void => {
          return;
        }}
      />
      <Text>{tyroError ? tyroError.errorType + ': ' + tyroError.errorMessage : 'no error'}</Text>
    </View>
  );
};
