import { eventType } from '../utils/validators';
import React, { useState, forwardRef } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { ImageSources } from '../@types/images';
import { getInputStyles } from '../services/style-drawer';
import { TyroPayOptionsKeys, TyroPayStyleLabelPositions } from '../@types/definitions';
import { useSDK } from '../SDKSharedContext';
import { CardImageNames } from '../@types/card-types';
import CardPreview from './CardPreview';
import { defaultSupportedNetworks } from '../@types/default';

type InputFieldProps = {
  labelText: string;
  placeholderText: string;
  setText;
  img;
  error: string;
  validator;
} & React.ComponentPropsWithRef<typeof TextInput>;

export const InputField = forwardRef<TextInput, InputFieldProps>(function InputField(
  { labelText, placeholderText, setText, img, error, validator, ...TextInputProps },
  ref
): JSX.Element {
  const { options, supportedNetworks } = useSDK();
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
            placeholderTextColor={styles.placeholder.color}
            onChangeText={setText}
            onFocus={(): void => setIsFocus(true)}
            onBlur={(): void => {
              setIsFocus(false);
              validator(eventType.BLUR);
            }}
            ref={ref}
            {...TextInputProps}
          />
          {img && ImageElement && (
            <View style={styles.image}>
              <ImageElement />
            </View>
          )}
          {img === CardImageNames.PREVIEW && (
            <View style={styles.image}>
              <CardPreview supportedNetworks={supportedNetworks ?? defaultSupportedNetworks} />
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
});

export default InputField;
