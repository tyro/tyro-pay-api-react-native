import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { CartItem } from './@types/shop';
import { RootStackProps } from './@types/navigation';
import ShopItem from './components/ShopItem';

const items: CartItem[] = [
  {
    id: 0,
    name: 'T-Shirt',
    description: "It's just a plain t-shirt",
    price: 2000,
    imgSrc: 'https://portal.connect.tyro.com/assets/react-native-example/t-shirt.jpg',
  },
  {
    id: 1,
    name: 'Pants',
    description: 'Very nice pants',
    price: 5000,
    imgSrc: 'https://portal.connect.tyro.com/assets/react-native-example/very-nice-pants.jpg',
  },
];

type Props = RootStackProps<'Store'>;

const Store = ({ navigation }: Props): JSX.Element => {
  const [itemsInCart, setItemsInCart] = useState<CartItem[]>([]);

  const addItemToCart = (itemToAdd: CartItem): void => {
    if (itemIsInCart(itemToAdd)) {
      return;
    }

    setItemsInCart([...itemsInCart, itemToAdd]);
  };

  const removeItemFromCart = (itemToRemove: CartItem): void => {
    const itemIndex = itemsInCart.findIndex((item) => item.id === itemToRemove.id);
    if (itemIndex < 0) {
      return;
    }

    const newArray = [...itemsInCart];
    newArray.splice(itemIndex, 1);

    setItemsInCart(newArray);
  };

  const itemIsInCart = (item: CartItem): boolean => {
    return itemsInCart.some((cartItem) => cartItem.id === item.id);
  };

  const onPressCheckoutButton = (): void => {
    navigation.navigate('CheckOut', { cart: itemsInCart });
  };

  return (
    <View id="storeView" style={{ flex: 1, justifyContent: 'space-between' }}>
      <View>
        {items.map((item) => (
          <ShopItem
            key={item.id}
            item={item}
            onAddItem={addItemToCart}
            onRemoveItem={removeItemFromCart}
            inCart={itemIsInCart(item)}
          />
        ))}
      </View>
      <CheckoutButton disabled={!itemsInCart.length} onCheckout={onPressCheckoutButton} />
    </View>
  );
};

const CheckoutButton = (props: CheckoutButtonProps): JSX.Element => {
  return <Button disabled={props.disabled} title="Checkout" onPress={props.onCheckout} testID="checkout" />;
};

interface CheckoutButtonProps {
  disabled: boolean;
  onCheckout: () => void;
}

export default Store;
