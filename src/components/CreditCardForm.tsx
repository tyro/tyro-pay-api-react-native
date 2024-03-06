import React, { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';
import {
  buildCardExpiry,
  formatCardCVC,
  formatCardExpiry,
  formatCardNumber,
  getCardType,
  UNKNOWN_CARD_TYPE,
} from '../utils/card-formatting';
import { eventType, validateInput, ValidationErrors } from '../utils/validators';
import InputField from './InputField';
import { CardImageNames, CardTypeNames } from '../@types/card-types';
import { getFormStyles } from '../services/style-drawer';
import { TyroPayOptionsKeys } from '../@types/definitions';
import { useSDK } from '../SDKSharedContext';
import { useTyro } from '../TyroSharedContext';
import { PayRequestStatus } from '../@types/pay-request-types';

type CreditCardFormProps = {
  validationErrors: ValidationErrors;
  setValidationErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>;
};

const completedStatuses = [PayRequestStatus.FAILED, PayRequestStatus.SUCCESS, PayRequestStatus.VOIDED];

export const CreditCardForm = ({ validationErrors, setValidationErrors }: CreditCardFormProps): JSX.Element => {
  const { options, supportedNetworks, setCardDetails } = useSDK();
  const { payRequest } = useTyro();
  const [cardType, setCardType] = useState<string>(UNKNOWN_CARD_TYPE.type);
  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [securityCode, setSecurityCode] = useState('');

  useEffect(() => {
    setCardDetails({
      nameOnCard: name,
      number: number.replaceAll(' ', ''),
      expiry: buildCardExpiry(expiry),
      securityCode,
    });
  }, [name, number, expiry, securityCode]);

  useEffect(() => {
    if (payRequest?.status && completedStatuses.includes(payRequest?.status)) {
      setCardType(UNKNOWN_CARD_TYPE.type);
      setNumber('');
      setName('');
      setExpiry('');
      setSecurityCode('');
    }
  }, [payRequest]);

  useEffect(() => {
    const cardTypeName = String(getCardType(number, supportedNetworks as unknown as CardTypeNames[])?.type);
    if (options?.styleProps?.showSupportedCards === false) {
      setCardType(UNKNOWN_CARD_TYPE.type);
      return;
    }
    setCardType(cardTypeName);
  }, [number, supportedNetworks]);

  const styles = StyleSheet.create({
    ...getFormStyles(options[TyroPayOptionsKeys.styleProps]),
  });

  const onChangeNumber = (text: string): void => {
    const formatted = formatCardNumber(text);
    validateInput(eventType.CHANGE, 'card_number', text, cardType, validationErrors, setValidationErrors);
    setNumber(formatted);
  };

  const onChangeName = (text: string): void => {
    validateInput(eventType.CHANGE, 'card_name', text, cardType, validationErrors, setValidationErrors);
    setName(text);
  };

  const onChangeExpiry = (text: string): void => {
    const formatted = formatCardExpiry(text);
    validateInput(eventType.CHANGE, 'card_expiry', formatted, cardType, validationErrors, setValidationErrors);
    setExpiry(formatted);
  };

  const onChangeCVV = (text: string): void => {
    const formatted = formatCardCVC(text);
    validateInput(eventType.CHANGE, 'card_cvv', text, cardType, validationErrors, setValidationErrors);
    setSecurityCode(formatted);
  };

  const fieldRefs = {
    refName: useRef<TextInput>(null),
    refExpiry: useRef<TextInput>(null),
    refCvv: useRef<TextInput>(null),
  };

  const focusNextField = (nextField: string): void => {
    fieldRefs[nextField].current.focus();
  };

  return (
    <View>
      <InputField
        labelText="Card number"
        placeholderText="Card number"
        setText={onChangeNumber}
        value={number}
        maxLength={19}
        keyboardType="numeric"
        img={
          validationErrors.card_number
            ? CardImageNames.ERROR
            : cardType !== UNKNOWN_CARD_TYPE.type
            ? cardType
            : CardImageNames.UNKNOWN
        }
        error={validationErrors.card_number}
        validator={(event: eventType): void => {
          validateInput(event, 'card_number', number, cardType, validationErrors, setValidationErrors);
        }}
        returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'}
        onSubmitEditing={(): void => focusNextField('refName')}
        blurOnSubmit={false}
      />
      <InputField
        labelText="Name on card"
        placeholderText="Name on card"
        setText={onChangeName}
        value={name}
        maxLength={50}
        keyboardType="default"
        img={null}
        error={validationErrors.card_name}
        validator={(event: eventType): void => {
          validateInput(event, 'card_name', name, cardType, validationErrors, setValidationErrors);
        }}
        returnKeyType="next"
        ref={fieldRefs['refName']}
        onSubmitEditing={(): void => focusNextField('refExpiry')}
        blurOnSubmit={false}
      />
      <View style={styles.fieldSplit}>
        <InputField
          labelText="Expiry date (MM/YY)"
          placeholderText="MM/YY"
          setText={onChangeExpiry}
          value={expiry}
          maxLength={5}
          keyboardType="numeric"
          img={null}
          error={validationErrors.card_expiry}
          validator={(event: eventType): void => {
            validateInput(event, 'card_expiry', expiry, cardType, validationErrors, setValidationErrors);
          }}
          returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'}
          ref={fieldRefs['refExpiry']}
          onSubmitEditing={(): void => focusNextField('refCvv')}
          blurOnSubmit={false}
        />
        <View style={styles.fieldSplitSpacer} />
        <InputField
          labelText="Security code"
          placeholderText="CVV"
          setText={onChangeCVV}
          value={securityCode}
          maxLength={cardType === CardTypeNames.AMEX ? 4 : 3}
          keyboardType="numeric"
          img={validationErrors.card_cvv ? CardImageNames.ERROR : CardImageNames.CVV}
          error={validationErrors.card_cvv}
          validator={(event: eventType): void => {
            validateInput(event, 'card_cvv', securityCode, cardType, validationErrors, setValidationErrors);
          }}
          returnKeyType="done"
          ref={fieldRefs['refCvv']}
        />
      </View>
    </View>
  );
};

export default CreditCardForm;
