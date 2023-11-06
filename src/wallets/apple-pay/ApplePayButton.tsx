import React, { PropsWithChildren } from 'react';
import { Button } from 'react-native';
import { ApplePayButtonStyleProps } from '../../@types/style-types';

type ApplePayButtonProps = PropsWithChildren<{
  title: string;
  styles: ApplePayButtonStyleProps;
  onSubmit: () => void;
}>;

const ApplePayButton = ({ title }: ApplePayButtonProps): JSX.Element => {
  // @todo, implement
  /*
  import { requireNativeComponent } from "react-native";
  const ApplePayButtonView = requireNativeComponent('ApplePayButtonView');
  return <ApplePayButtonView style={buttonStyle} buttonTitle={buttonTitle} onSubmit={onSubmit} />;
  */
  return <Button title={title ?? 'ApplePay Button'} />;
};

export default ApplePayButton;
