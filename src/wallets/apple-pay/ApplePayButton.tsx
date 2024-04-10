import React from 'react';
import { requireNativeComponent, UIManager } from 'react-native';
import { ApplePayButtonStyleProps, ApplePayButtonNativeProps } from '../../@types/style-types';

type ApplePayButtonProps = {
  buttonStyles?: ApplePayButtonStyleProps;
};

const ApplePayButtonComponent = UIManager.getViewManagerConfig('ApplePayButton') !== null
  ? requireNativeComponent<ApplePayButtonNativeProps>('ApplePayButton')
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  : () => {
    throw new Error('Unable to find ApplePayButton');
  };

const ApplePayButton =  ({ buttonStyles }: ApplePayButtonProps): JSX.Element => {
  return <ApplePayButtonComponent style={{ flex: 1 }} {...buttonStyles} testID="apple-pay-button" />;
};

export default ApplePayButton;
