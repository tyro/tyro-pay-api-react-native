import React from 'react';
import { requireNativeComponent } from 'react-native';
import { ApplePayButtonStyleProps, ApplePayButtonNativeProps } from '../../@types/style-types';
const ApplePayButtonComponent = requireNativeComponent<ApplePayButtonNativeProps>('ApplePayButton');

type ApplePayButtonProps = {
  buttonStyles: ApplePayButtonStyleProps;
};

const ApplePayButton = ({ buttonStyles }: ApplePayButtonProps): JSX.Element => {
  return <ApplePayButtonComponent style={{ flex: 1 }} {...buttonStyles} testID="apple-pay-button" />;
};

export default ApplePayButton;
