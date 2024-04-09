import { requireNativeComponent, UIManager } from 'react-native';
import { ApplePayButtonStyleProps } from '../../@types/style-types';

type ApplePayButtonProps = {
  styles: ApplePayButtonStyleProps;
};

const ApplePayButton = UIManager.getViewManagerConfig('ApplePayButton') !== null
  ? requireNativeComponent<ApplePayButtonProps>('ApplePayButton')
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  : () => {
    throw new Error('Unable to find ApplePayButton');
  };

export default ApplePayButton;
