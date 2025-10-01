'use client';

import type { CartItem, MenuItem, Order } from '@/lib/types';
import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

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

// Helper to get data from localStorage
const getFromStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    const item = window.localStorage.getItem(key);
    try {
      if (!item) return [];
      const parsed = JSON.parse(item);
      // Make sure orderTime is a Date object
      return parsed.map((order: any) => ({
        ...order,
        orderTime: new Date(order.orderTime),
      }))
    } catch (e) {
      console.error(e);
      return [];
    }
  }
  return [];
};

// Helper to set data in localStorage
const setInStorage = (key: string, value: any) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
};


export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(() => getFromStorage('orders'));
  const [isCartAnimating, setIsCartAnimating] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState<string | null>(null);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'orders') {
        setOrders(getFromStorage('orders'));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    setInStorage('orders', orders);
  }, [orders]);


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
        const existingOrderIndex = prevOrders.findIndex(o => o.tableId === tableNumber);
        if (existingOrderIndex > -1) {
            const updatedOrders = [...prevOrders];
            const existingOrder = updatedOrders[existingOrderIndex];
            
            const updatedItems = [...existingOrder.items];

            cartItems.forEach(cartItem => {
                const existingItemIndex = updatedItems.findIndex(item => item.id === cartItem.id);
                if (existingItemIndex > -1) {
                    updatedItems[existingItemIndex] = {
                        ...updatedItems[existingItemIndex],
                        quantity: updatedItems[existingItemIndex].quantity + cartItem.quantity
                    };
                } else {
                    updatedItems.push(cartItem);
                }
            });
            
            updatedOrders[existingOrderIndex] = {
                ...existingOrder,
                items: updatedItems,
                status: 'pending' // Reset to pending when new items are added
            };

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
    
    const cartQuantity = cartItems.find(i => i.id === itemId)?.quantity || 0;
    return cartQuantity;
  };

  const currentOrder = useMemo(() => orders.find(o => o.tableId === tableNumber), [orders, tableNumber]);

  const totalItems = useMemo(() => {
    const cartTotal = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    return cartTotal;
  }, [cartItems]);

  const totalPrice = useMemo(() => {
    const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return cartTotal;
  }, [cartItems]);

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
