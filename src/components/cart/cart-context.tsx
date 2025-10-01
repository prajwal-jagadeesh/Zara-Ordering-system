
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
  serveItem: (tableId: string, itemId: number) => void;
  closeOrder: (tableId: string) => void;
  markOrderReady: (tableId: string) => void;
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
      if (event.key === 'orders' && event.newValue) {
         try {
            const parsed = JSON.parse(event.newValue);
            const newOrders = parsed.map((order: any) => ({
                ...order,
                orderTime: new Date(order.orderTime),
            }));
            setOrders(newOrders);
        } catch (e) {
            console.error("Error parsing orders from storage", e);
        }
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
            
            const newPendingItems = [...(existingOrder.pendingItems || [])];

            cartItems.forEach(cartItem => {
                const existingItemIndex = newPendingItems.findIndex(item => item.id === cartItem.id);
                if (existingItemIndex > -1) {
                    newPendingItems[existingItemIndex] = {
                        ...newPendingItems[existingItemIndex],
                        quantity: newPendingItems[existingItemIndex].quantity + cartItem.quantity
                    };
                } else {
                    newPendingItems.push(cartItem);
                }
            });
            
            updatedOrders[existingOrderIndex] = {
                ...existingOrder,
                pendingItems: newPendingItems,
                status: 'pending', // Always set to pending when new items are added
                orderTime: new Date(), // Update order time
            };

            return updatedOrders;

        } else {
             const newOrder: Order = {
                tableId: tableNumber,
                pendingItems: cartItems,
                confirmedItems: [],
                servedItems: [],
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
    
    const pendingItem = (order?.pendingItems || []).find(i => i.id === itemId);
    const confirmedItem = (order?.confirmedItems || []).find(i => i.id === itemId);
    const cartItem = cartItems.find(i => i.id === itemId);

    return (pendingItem?.quantity || 0) + (confirmedItem?.quantity || 0) + (cartItem?.quantity || 0);
  };


  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const confirmOrder = (tableId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.tableId === tableId) {
        // Deep copy to prevent mutation issues
        const newConfirmedItems = JSON.parse(JSON.stringify(o.confirmedItems || []));
        const itemsToConfirm = o.pendingItems || [];

        itemsToConfirm.forEach(pendingItem => {
          const existingIndex = newConfirmedItems.findIndex((ci: CartItem) => ci.id === pendingItem.id);
          if (existingIndex > -1) {
            newConfirmedItems[existingIndex].quantity += pendingItem.quantity;
          } else {
            newConfirmedItems.push(pendingItem);
          }
        });

        return {
          ...o,
          status: 'confirmed',
          pendingItems: [],
          confirmedItems: newConfirmedItems,
        };
      }
      return o;
    }));
  };
  
  const rejectOrder = (tableId: string) => {
    setOrders(prev => {
        const order = prev.find(o => o.tableId === tableId);
        if (order && (order.confirmedItems || []).length === 0 && (order.servedItems || []).length === 0) {
            return prev.filter(o => o.tableId !== tableId);
        }
        return prev.map(o => 
            o.tableId === tableId 
            ? { ...o, status: 'confirmed', pendingItems: [] }
            : o
        );
    });
  };

  const serveItem = (tableId: string, itemId: number) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.tableId === tableId) {
          const itemToServe = (o.confirmedItems || []).find(i => i.id === itemId);
          if (!itemToServe) return o;

          const newConfirmedItems = (o.confirmedItems || []).filter(
            i => i.id !== itemId
          );
          
          // Deep copy to prevent mutation issues
          const newServedItems = JSON.parse(JSON.stringify(o.servedItems || []));
          const existingServedItemIndex = newServedItems.findIndex(
            (i: CartItem) => i.id === itemId
          );

          if (existingServedItemIndex > -1) {
            newServedItems[existingServedItemIndex].quantity += itemToServe.quantity;
          } else {
            newServedItems.push(itemToServe);
          }

          return {
            ...o,
            confirmedItems: newConfirmedItems,
            servedItems: newServedItems,
          };
        }
        return o;
      })
    );
  };
  
  const closeOrder = (tableId: string) => {
    setOrders(prev => prev.filter(o => o.tableId !== tableId));
  };
  
  const markOrderReady = (tableId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.tableId === tableId) {
        const readyItems = o.confirmedItems || [];
        if (readyItems.length === 0) return o;

        const newServedItems = JSON.parse(JSON.stringify(o.servedItems || []));
        
        readyItems.forEach(readyItem => {
          const existingIndex = newServedItems.findIndex((si: CartItem) => si.id === readyItem.id);
          if (existingIndex > -1) {
            newServedItems[existingIndex].quantity += readyItem.quantity;
          } else {
            newServedItems.push(readyItem);
          }
        });
        
        return {
          ...o,
          confirmedItems: [],
          servedItems: newServedItems,
        };
      }
      return o;
    }))
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
    getItemQuantity: getItemQuantity,
    confirmOrder,
    rejectOrder,
    serveItem,
    closeOrder,
    markOrderReady,
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
