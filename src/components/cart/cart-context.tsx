'use client';

import type { CartItem, MenuItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import React, { createContext, useContext, useState, useMemo } from 'react';

interface CartContextType {
  cartItems: CartItem[];
  orderedItems: CartItem[];
  addToCart: (item: MenuItem) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  removeFromCart: (itemId: number) => void;
  placeOrder: () => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartAnimating: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderedItems, setOrderedItems] = useState<CartItem[]>([]);
  const [isCartAnimating, setIsCartAnimating] = useState(false);
  const { toast } = useToast();

  const addToCart = (item: MenuItem) => {
    // Check if item is already in ordered list
    const inOrdered = orderedItems.find(i => i.id === item.id);
    if(inOrdered) {
        toast({
            variant: 'destructive',
            title: "Item Already Ordered",
            description: "You can't add more of an item that's already been sent to the kitchen.",
        });
        return;
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
    
    setIsCartAnimating(true);
    setTimeout(() => setIsCartAnimating(false), 500);
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(i => (i.id === itemId ? { ...i, quantity } : i))
      );
    }
  };

  const removeFromCart = (itemId: number) => {
    setCartItems(prevItems => prevItems.filter(i => i.id !== itemId));
  };
  
  const placeOrder = () => {
    setOrderedItems(prevOrdered => {
        const newOrdered = [...prevOrdered];
        cartItems.forEach(cartItem => {
            const existingItem = newOrdered.find(orderedItem => orderedItem.id === cartItem.id);
            if (existingItem) {
                existingItem.quantity += cartItem.quantity;
            } else {
                newOrdered.push(cartItem);
            }
        });
        return newOrdered;
    });
    setCartItems([]);
  };

  const clearCart = () => {
    setCartItems([]);
    setOrderedItems([]);
  };

  const totalItems = useMemo(() => {
    const cartTotal = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const orderedTotal = orderedItems.reduce((sum, item) => sum + item.quantity, 0);
    return cartTotal + orderedTotal;
  }, [cartItems, orderedItems]);

  const totalPrice = useMemo(() => {
    const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderedTotal = orderedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return cartTotal + orderedTotal;
  }, [cartItems, orderedItems]);

  const value = {
    cartItems,
    orderedItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    placeOrder,
    clearCart,
    totalItems,
    totalPrice,
    isCartAnimating,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
