import React, { useState, useEffect } from 'react';
import { ActivityIndicator, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface Props extends TouchableOpacityProps {
  isLoading: boolean;
  onPress: () => void;
}

const ButtonWithLoader = (props: Props): JSX.Element => {
  const [isLoading, setIsLoading] = useState(props.isLoading ?? false);

  useEffect(() => {
    if (props.isLoading) {
      setIsLoading(props.isLoading);
    }
  }, [props.isLoading]);
  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <>
      <TouchableOpacity
        disabled={props.disabled}
        style={props.style}
        activeOpacity={props.activeOpacity}
        onPress={props.onPress}
        accessibilityLabel={props.accessibilityLabel}
        testID={props.testID}
      >
        {props.children}
      </TouchableOpacity>
    </>
  );
};

export default ButtonWithLoader;
