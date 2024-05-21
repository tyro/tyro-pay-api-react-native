import React, { PropsWithChildren } from 'react';
import { requireNativeComponent } from 'react-native';
import { GooglePayButtonNativeProps, GooglePayButtonStyleProps } from '../../@types/style-types';
const GooglePayButtonComponent = requireNativeComponent<GooglePayButtonNativeProps>('GooglePayButton');

type GooglePayButtonProps = PropsWithChildren<{
  buttonStyles: GooglePayButtonStyleProps;
}>;

const GooglePayButton = ({ buttonStyles }: GooglePayButtonProps): JSX.Element => {
  buttonStyles.buttonBorderRadius = parseFloat(String(buttonStyles.buttonBorderRadius));
  return <GooglePayButtonComponent style={{ flex: 1 }} {...buttonStyles} testID="google-pay-button" />;
};

export default GooglePayButton;
