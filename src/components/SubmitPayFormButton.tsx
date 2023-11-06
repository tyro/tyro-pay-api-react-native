import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { validateAllInputs, ValidationErrors } from '../utils/validators';
import { getPayButtonStyles } from '../services/style-drawer';
import { TyroPayOptionsKeys } from '../@types/definitions';
import { useSDK } from '../SDKSharedContext';

type SubmitPayFormButtonProps = {
  title: string;
  setValidationErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>;
  validationErrors: ValidationErrors;
};

export const SubmitPayFormButton = ({
  title,
  validationErrors,
  setValidationErrors,
}: SubmitPayFormButtonProps): JSX.Element => {
  const { options, isSubmitting, cardDetails, handleSubmit } = useSDK();

  const styles = StyleSheet.create({
    ...getPayButtonStyles(options[TyroPayOptionsKeys.styleProps]),
  });

  const handlePress = async (): Promise<void> => {
    const foundErrors = validateAllInputs(cardDetails);
    if (Object.keys(foundErrors).length) {
      setValidationErrors({ ...validationErrors, ...foundErrors });
      return;
    }
    await handleSubmit(cardDetails);
  };

  return (
    <View style={styles.container}>
      {isSubmitting ? (
        <ActivityIndicator />
      ) : (
        <TouchableOpacity
          style={[styles.container, styles.button]}
          activeOpacity={0.3}
          onPress={handlePress}
          accessibilityLabel="Submit the Pay Form"
          testID="pay-button"
        >
          <Text style={styles.buttonText}>{title.length ? title : 'Pay'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SubmitPayFormButton;
