import { eventType } from '../utils/validators';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { ImageSources } from '../@types/images';
import { getInputStyles } from '../services/style-drawer';
import { TyroPayOptionsKeys, TyroPayStyleLabelPositions } from '../@types/definitions';
import { useSDK } from '../SDKSharedContext';

type InputFieldProps = {
  labelText: string;
  placeholderText: string;
  value: string;
  maxLength: number;
  setText;
  keyboardType;
  img;
  error: string;
  validator;
};

export const InputField = ({
  labelText,
  placeholderText,
  setText,
  value,
  maxLength,
  keyboardType,
  img,
  error,
  validator,
}: InputFieldProps): JSX.Element => {
  const { options } = useSDK();
  const [isFocus, setIsFocus] = useState(false);
  const styles = StyleSheet.create({
    ...getInputStyles(options[TyroPayOptionsKeys.styleProps], {
      isFocus,
      isError: !!error,
    }),
  });
  const hasPhysicalLabel = options?.styleProps?.labelPosition !== TyroPayStyleLabelPositions.FLOATING;
  const ImageElement = options?.styleProps?.showCardIcon !== false && img && ImageSources[img];
  return (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldWrapper}>
        {hasPhysicalLabel && <Text style={styles.labelContainer}>{labelText}</Text>}
        <View style={[img && styles.imageWrapper, styles.inputWrapper]}>
          <TextInput
            accessibilityState={{ selected: isFocus }}
            style={[styles.textInput]}
            placeholder={!hasPhysicalLabel ? placeholderText : undefined}
            value={value}
            onChangeText={setText}
            maxLength={maxLength}
            keyboardType={keyboardType}
            onFocus={(): void => setIsFocus(true)}
            onBlur={(): void => {
              setIsFocus(false);
              validator(eventType.BLUR);
            }}
          />
          {img && ImageElement && (
            <View style={styles.image}>
              <ImageElement />
            </View>
          )}
        </View>
        {options?.styleProps?.showErrorSpacing !== false && !error && (
          <Text testID={'error-spacer'} style={styles.errorSpacer}></Text>
        )}
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    </View>
  );
};

export default InputField;
