import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { CartItem } from '../@types/shop';

interface ShopItemProps {
  item: CartItem;
  inCart: boolean;
  onAddItem: (item: CartItem) => void;
  onRemoveItem: (item: CartItem) => void;
}

const ShopItem = (props: ShopItemProps): JSX.Element => {
  const { item, inCart, onAddItem, onRemoveItem } = props;

  const [buttonText, setButtonText] = useState('Add to cart');
  const [buttonColor, setButtonColor] = useState('blue');

  useEffect(() => {
    const buttonText = inCart ? '-' : '+';
    setButtonText(buttonText);

    const buttonColor = inCart ? '#ae0000' : '#06f';
    setButtonColor(buttonColor);
  }, [inCart]);

  const onPress = (): void => {
    inCart ? onRemoveItem(item) : onAddItem(item);
  };

  return (
    <View style={styles.shopItem}>
      <Image source={{ uri: item.imgSrc, width: 100, height: 100 }} />
      <View testID="itemTextInfo" style={styles.shopItemTextContainer}>
        <Text style={{ fontSize: 20 }}>{item.name}</Text>
        <Text style={{ paddingBottom: 20 }}>{item.description}</Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>${(item.price / 100).toFixed(2)}</Text>
      </View>
      <TouchableOpacity onPress={onPress} style={{ ...styles.shopItemButton, backgroundColor: buttonColor }}>
        <Text style={styles.shopItemButtonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  shopItem: {
    display: 'flex',
    flexDirection: 'row',
    padding: 20,
    marginBottom: 10,
    minWidth: 120,
  },
  shopItemImage: {
    width: 100,
    height: 100,
    backgroundColor: 'white',
    borderColor: '#e2ebf7',
    borderWidth: 2,
  },
  shopItemTextContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingTop: 0,
  },
  shopItemButton: {
    width: 50,
    borderRadius: 100,
    elevation: 3,
    height: 50,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  shopItemButtonText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
});

export default ShopItem;
