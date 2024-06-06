export type CartItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  imgSrc: string;
};

export type ShoppingCart = CartItem[];
