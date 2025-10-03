
'use client';

import React from 'react';
import type { CartItem, MenuItem, Order, MenuCategory } from '@/lib/types';
import { menuData as staticMenuData } from '@/lib/menu-data';

interface CartContextType {
  cartItems: CartItem[];
  orders: Order[];
  menuItems: MenuItem[];
  tables: {id: string}[];
  categories: MenuCategory[];
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
  markItemReady: (tableId: string, itemId: number) => void;
  toggleMenuItemAvailability: (itemId: number) => void;
  addTable: () => void;
  removeTable: (tableId: string) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (item: MenuItem) => void;
  removeMenuItem: (itemId: number) => void;
}

const CartContext = React.createContext<CartContextType | undefined>(undefined);

// Helper to get data from localStorage
const getFromStorage = (key: string, defaultValue: any) => {
  if (typeof window !== 'undefined') {
    const item = window.localStorage.getItem(key);
    try {
      if (!item) return defaultValue;
      return JSON.parse(item);
    } catch (e) {
      console.error(`Error parsing ${key} from storage`, e);
      return defaultValue;
    }
  }
  return defaultValue;
};

// Helper to set data in localStorage
const setInStorage = (key: string, value: any) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
};

const initialMenuItems = staticMenuData.map(item => ({ ...item, isAvailable: true }));
const defaultTables = Array.from({ length: 15 }, (_, i) => ({ id: (i + 1).toString() }));

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [orders, setOrders] = React.useState<Order[]>(() => getFromStorage('orders', []).map((o:any) => ({...o, orderTime: new Date(o.orderTime)})) );
  const [menuItems, setMenuItems] = React.useState<MenuItem[]>(() => getFromStorage('menuItems', initialMenuItems));
  const [tables, setTables] = React.useState<{id: string}[]>(() => getFromStorage('tables', defaultTables));
  const [isCartAnimating, setIsCartAnimating] = React.useState(false);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [tableNumber, setTableNumber] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'orders' && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          const newOrders = parsed.map((order: any) => ({ ...order, orderTime: new Date(order.orderTime) }));
          setOrders(newOrders);
        } catch (e) { console.error("Error parsing orders from storage", e); }
      }
      if (event.key === 'menuItems' && event.newValue) {
        try {
          setMenuItems(JSON.parse(event.newValue));
        } catch (e) { console.error("Error parsing menuItems from storage", e); }
      }
      if (event.key === 'tables' && event.newValue) {
        try {
          setTables(JSON.parse(event.newValue));
        } catch (e) { console.error("Error parsing tables from storage", e); }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  React.useEffect(() => { setInStorage('orders', orders); }, [orders]);
  React.useEffect(() => { setInStorage('menuItems', menuItems); }, [menuItems]);
  React.useEffect(() => { setInStorage('tables', tables); }, [tables]);


  const addToCart = (item: MenuItem, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i => i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i);
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
      setCartItems(prevItems => prevItems.map(i => (i.id === itemId ? { ...i, quantity } : i)));
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
                    newPendingItems[existingItemIndex].quantity += cartItem.quantity;
                } else {
                    newPendingItems.push(cartItem);
                }
            });
            
            updatedOrders[existingOrderIndex] = {
                ...existingOrder,
                pendingItems: newPendingItems,
                status: existingOrder.status === 'confirmed' ? 'confirmed' : 'pending',
                orderTime: new Date(),
            };
            return updatedOrders;
        } else {
             const newOrder: Order = {
                tableId: tableNumber,
                pendingItems: cartItems,
                confirmedItems: [],
                readyItems: [],
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
    const cartItem = cartItems.find(i => i.id === itemId);
    let quantity = cartItem?.quantity || 0;

    if(tableNumber) {
        const order = orders.find(o => o.tableId === tableNumber);
        if (order) {
            const allItems = [
                ...(order.pendingItems || []),
                ...(order.confirmedItems || []),
                ...(order.readyItems || []),
                ...(order.servedItems || [])
            ];
            const orderedItem = allItems.find(i => i.id === itemId);
            if (orderedItem) {
                quantity += orderedItem.quantity;
            }
        }
    }
    return quantity;
  };


  const totalItems = React.useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);
  const totalPrice = React.useMemo(() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [cartItems]);

  const confirmOrder = (tableId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.tableId === tableId) {
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

        return { ...o, status: 'confirmed', pendingItems: [], confirmedItems: newConfirmedItems };
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
        return prev.map(o => o.tableId === tableId ? { ...o, status: 'confirmed', pendingItems: [] } : o );
    });
  };

  const serveItem = (tableId: string, itemId: number) => {
    setOrders(prev => prev.map(o => {
      if (o.tableId === tableId) {
        const itemToServe = (o.readyItems || []).find(i => i.id === itemId);
        if (!itemToServe) return o;
        const newReadyItems = (o.readyItems || []).filter(i => i.id !== itemId);
        const newServedItems = JSON.parse(JSON.stringify(o.servedItems || []));
        const existingServedItemIndex = newServedItems.findIndex((i: CartItem) => i.id === itemId);
        if (existingServedItemIndex > -1) {
          newServedItems[existingServedItemIndex].quantity += itemToServe.quantity;
        } else {
          newServedItems.push(itemToServe);
        }
        return { ...o, readyItems: newReadyItems, servedItems: newServedItems };
      }
      return o;
    }));
  };
  
  const closeOrder = (tableId: string) => {
    setOrders(prev => prev.filter(o => o.tableId !== tableId));
  };
  
  const markItemReady = (tableId: string, itemId: number) => {
    setOrders(prev => prev.map(o => {
      if (o.tableId === tableId) {
        const itemToMark = (o.confirmedItems || []).find(item => item.id === itemId);
        if (!itemToMark) return o;

        const newConfirmedItems = (o.confirmedItems || []).filter(item => item.id !== itemId);
        const newReadyItems = JSON.parse(JSON.stringify(o.readyItems || []));

        const existingReadyIndex = newReadyItems.findIndex((si: CartItem) => si.id === itemToMark.id);
        if (existingReadyIndex > -1) {
            newReadyItems[existingReadyIndex].quantity += itemToMark.quantity;
        } else {
            newReadyItems.push(itemToMark);
        }
        return { ...o, confirmedItems: newConfirmedItems, readyItems: newReadyItems };
      }
      return o;
    }));
  };

  const toggleMenuItemAvailability = (itemId: number) => {
    setMenuItems(prev => prev.map(item => item.id === itemId ? { ...item, isAvailable: item.isAvailable === false ? true : false } : item));
  };
  
  const addTable = () => {
    setTables(prev => {
        const maxId = prev.reduce((max, table) => Math.max(max, parseInt(table.id)), 0);
        return [...prev, { id: (maxId + 1).toString() }];
    });
  };

  const removeTable = (tableId: string) => {
    setTables(prev => prev.filter(table => table.id !== tableId));
  };
  
  const addMenuItem = (itemData: Omit<MenuItem, 'id'>) => {
    setMenuItems(prev => {
        const newId = Math.max(...prev.map(i => i.id), 0) + 1;
        const newItem: MenuItem = {
            id: newId,
            ...itemData,
            isAvailable: true,
        }
        return [...prev, newItem];
    });
  };

  const updateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems(prev => prev.map(item => item.id === updatedItem.id ? { ...item, ...updatedItem } : item));
  };

  const removeMenuItem = (itemId: number) => {
    setMenuItems(prev => prev.filter(item => item.id !== itemId));
  };

  const categories = React.useMemo(() => {
    const allCategories: MenuCategory[] = [
      'Appetizers', 'Soulful Soups', 'Pastas & Spaghetti', 
      'Artisan Breads', 'Signature Curries', 'Heritage Rice Bowls',
      'sip sesh', 'Sweets Endings', 'Coffee Clasics', 'Platters',
      'Yakisoba', 'Yakimeshi'
    ];
    // Keep all categories available for the POS form
    return allCategories;
  }, []);


  const value = {
    cartItems,
    orders,
    menuItems,
    tables,
    categories,
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
    markItemReady,
    toggleMenuItemAvailability,
    addTable,
    removeTable,
    addMenuItem,
    updateMenuItem,
    removeMenuItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = React.useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

    