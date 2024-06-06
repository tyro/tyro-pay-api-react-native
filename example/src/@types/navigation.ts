import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ShoppingCart } from './shop';

export type RootStackParamList = {
  Store: undefined;
  CheckOut: { cart: ShoppingCart };
};

export type RootStackProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;
