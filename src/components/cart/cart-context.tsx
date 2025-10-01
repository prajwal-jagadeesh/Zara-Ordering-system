'use client';

import type { CartItem, MenuItem, Order } from '@/lib/types';
import React, { createContext, useContext, useState, useMemo } from 'react';

interface CartContextType {
  cartItems: CartItem[];
  orders: Order[];
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
  confirmOrder: (tableId: string) => void;
  rejectOrder: (tableId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
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
    if (!tableNumber || cartItems.length === 0) return;

    setOrders(prevOrders => {
        const existingOrderIndex = prevOrders.findIndex(o => o.tableId === tableNumber && o.status === 'pending');
        if (existingOrderIndex > -1) {
            const updatedOrders = [...prevOrders];
            const existingOrder = updatedOrders[existingOrderIndex];
            
            const newItems = cartItems.map(cartItem => {
                const existingItem = existingOrder.items.find(item => item.id === cartItem.id);
                if (existingItem) {
                    return { ...existingItem, quantity: existingItem.quantity + cartItem.quantity };
                }
                return cartItem;
            });
            
            const itemIdsInCart = cartItems.map(ci => ci.id);
            const itemsNotInCart = existingOrder.items.filter(item => !itemIdsInCart.includes(item.id));
            
            existingOrder.items = [...itemsNotInCart, ...newItems];
            return updatedOrders;

        } else {
             const newOrder: Order = {
                tableId: tableNumber,
                items: cartItems,
                status: 'pending',
                orderTime: new Date(),
            };
            return [...prevOrders, newOrder];
        }
    });
    
    setCartItems([]);
  };

  const clearCart = () => {
    if(!tableNumber) return;
    setOrders(prevOrders => prevOrders.filter(o => o.tableId !== tableNumber));
    setCartItems([]);
  };
  
  const getItemQuantity = (itemId: number) => {
    if(!tableNumber) return 0;
    
    const order = orders.find(o => o.tableId === tableNumber);
    const cartItem = cartItems.find(i => i.id === itemId);

    let orderedQuantity = 0;
    if (order) {
        const orderItem = order.items.find(i => i.id === itemId);
        orderedQuantity = orderItem?.quantity || 0;
    }
    
    return (cartItem?.quantity || 0) + orderedQuantity;
  };

  const currentOrder = useMemo(() => orders.find(o => o.tableId === tableNumber), [orders, tableNumber]);

  const totalItems = useMemo(() => {
    const cartTotal = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const orderTotal = currentOrder?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
    return cartTotal + orderTotal;
  }, [cartItems, currentOrder]);

  const totalPrice = useMemo(() => {
    const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderTotal = currentOrder?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
    return cartTotal + orderTotal;
  }, [cartItems, currentOrder]);

  const confirmOrder = (tableId: string) => {
    setOrders(prev => prev.map(o => o.tableId === tableId ? { ...o, status: 'confirmed' } : o));
  };
  
  const rejectOrder = (tableId: string) => {
    setOrders(prev => prev.filter(o => o.tableId !== tableId));
  };

  const value = {
    cartItems,
    orders,
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
    confirmOrder,
    rejectOrder
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
