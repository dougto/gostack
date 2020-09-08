/* eslint-disable no-param-reassign */
import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface ProductWithoutQuantity {
  id: string;
  title: string;
  image_url: string;
  price: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: ProductWithoutQuantity): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const data = await AsyncStorage.getItem('@gomarketplace-product');

      if (data) {
        setProducts([...JSON.parse(data)]);
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      const productExists = !!products.filter(prod => prod.id === product.id)
        .length;

      if (productExists) {
        const newProducts = products.map(prod => {
          if (product.id === prod.id) {
            const newQuantity = prod.quantity + 1;

            return { ...prod, quantity: newQuantity };
          }
          return prod;
        });

        setProducts([...newProducts]);

        await AsyncStorage.setItem(
          '@gomarketplace-product',
          JSON.stringify(newProducts),
        );
      } else if (products.length === 0) {
        product.quantity = 1;

        setProducts([product]);

        await AsyncStorage.setItem(
          '@gomarketplace-product',
          JSON.stringify([product]),
        );
      } else {
        product.quantity = 1;

        const newProducts = [...products, product];

        setProducts([...newProducts]);

        await AsyncStorage.setItem(
          '@gomarketplace-product',
          JSON.stringify(newProducts),
        );
      }
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const newProducts = products.map(product => {
        if (id === product.id) {
          const newQuantity = product.quantity + 1;

          return { ...product, quantity: newQuantity };
        }
        return product;
      });

      setProducts([...newProducts]);

      await AsyncStorage.setItem(
        '@gomarketplace-product',
        JSON.stringify(newProducts),
      );
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const newProducts = products.map(product => {
        if (id === product.id && product.quantity > 0) {
          const newQuantity = product.quantity - 1;

          return { ...product, quantity: newQuantity };
        }
        if (product.quantity === 0) {
          return null;
        }
        return product;
      });

      if (newProducts) {
        setProducts([...newProducts]);
      } else {
        setProducts([]);
      }

      await AsyncStorage.setItem(
        '@gomarketplace-product',
        JSON.stringify(newProducts),
      );
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
