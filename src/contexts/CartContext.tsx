import { createContext, type ReactNode, useState, useEffect, useMemo } from "react";
import type { Product, CartItem } from "../types";

interface CartContextData {
  cart: CartItem[];
  addItemCart: (newItem: Product) => void;
  removeItemCart: (id: number) => void;
  updateQuantity: (id: number, newAmount: number) => void;
  clearCart: () => void;
  total: number;
}

export const CartContext = createContext({} as CartContextData);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem("buyflow:cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("buyflow:cart", JSON.stringify(cart));
  }, [cart]);

  const total = useMemo(
    () => cart.reduce((acc, product) => acc + product.price * product.amount, 0),
    [cart]
  );

  function addItemCart(newItem: Product) {
    setCart((prevCart) => {
      const indexItem = prevCart.findIndex((item) => item.id === newItem.id);
      if (indexItem !== -1) {
        return prevCart.map((item) =>
          item.id === newItem.id ? { ...item, amount: item.amount + 1 } : item
        );
      } else {
        return [...prevCart, { ...newItem, amount: 1 }];
      }
    });
  }

  function removeItemCart(id: number) {
    setCart((prev) => prev.filter((product) => product.id !== id));
  }

  function updateQuantity(id: number, newAmount: number) {
    if (newAmount <= 0) {
      removeItemCart(id);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((product) =>
        product.id === id ? { ...product, amount: newAmount } : product
      )
    );
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider
      value={{ cart, addItemCart, removeItemCart, updateQuantity, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
}
