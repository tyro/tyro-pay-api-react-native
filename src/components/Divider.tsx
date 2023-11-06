import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getDividerStyles } from '../services/style-drawer';
import { TyroPayOptionsKeys } from '../@types/definitions';
import { useSDK } from '../SDKSharedContext';

type DividerProps = {
  text: string;
};

export const Divider = ({ text }: DividerProps): JSX.Element => {
  const { options } = useSDK();
  const styles = StyleSheet.create({
    ...getDividerStyles(options[TyroPayOptionsKeys.styleProps]),
  });
  return (
    <View style={styles.dividerWrapper}>
      <View style={styles.line} />
      <View>
        <Text style={styles.text}>{text}</Text>
      </View>
      <View style={styles.line} />
    </View>
  );
};

export default Divider;
