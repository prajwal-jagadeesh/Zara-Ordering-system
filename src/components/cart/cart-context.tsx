'use client';

import type { CartItem, MenuItem } from '@/lib/types';
import React, { createContext, useContext, useState, useMemo } from 'react';

interface CartContextType {
  cartItems: CartItem[];
  orderedItems: CartItem[];
  tableNumber: string | null;
  setTableNumber: (table: string) => void;
  addToCart: (item: MenuItem, quantity?: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  removeFromCart: (itemId: number) => void;
  placeOrder: () => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartAnimating: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  getItemQuantity: (itemId: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderedItems, setOrderedItems] = useState<CartItem[]>([]);
  const [isCartAnimating, setIsCartAnimating] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState<string | null>(null);

  const addToCart = (item: MenuItem, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prevItems, { ...item, quantity }];
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
    // Here you would typically send the order to a backend
    console.log(`Placing order for table ${tableNumber}:`, cartItems);
    
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
  
  const getItemQuantity = (itemId: number) => {
    const cartItem = cartItems.find(i => i.id === itemId);
    const orderedItem = orderedItems.find(i => i.id === itemId);
    return (cartItem?.quantity || 0) + (orderedItem?.quantity || 0);
  };

  const allItems = useMemo(() => [...cartItems, ...orderedItems], [cartItems, orderedItems]);

  const totalItems = useMemo(() => {
    return allItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [allItems]);

  const totalPrice = useMemo(() => {
    return allItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [allItems]);

  const value = {
    cartItems,
    orderedItems,
    tableNumber,
    setTableNumber,
    addToCart,
    updateQuantity,
    removeFromCart,
    placeOrder,
    clearCart,
    totalItems,
    totalPrice,
    isCartAnimating,
    isCartOpen,
    setIsCartOpen,
    getItemQuantity,
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
