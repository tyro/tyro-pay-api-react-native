import TyroProvider, { useTyro } from './TyroSharedContext';
import PaySheet from './PaySheet';
import { UIManager, requireNativeComponent } from 'react-native';

type SampleViewProps = {
  color: string;
};

const SampleView =
  UIManager.getViewManagerConfig('SampleView') !== null
    ? requireNativeComponent<SampleViewProps>('SampleView')
    : () => {
        throw new Error('Boom!!!');
      };

export { TyroProvider, PaySheet, useTyro, SampleView };
