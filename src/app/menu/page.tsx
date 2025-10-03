'use client';

import React from 'react';
import type { MenuItem } from '@/lib/types';
import MenuDisplay from '@/components/menu/menu-display';
import { useCart } from '@/components/cart/cart-context';
import Header from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { useSearchParams, useRouter } from 'next/navigation';

export default function MenuPage() {
  const { cartItems, orders, tableNumber, setIsCartOpen, setTableNumber, menuItems } = useCart();
  const searchParams = useSearchParams();
  const router = useRouter();

  React.useEffect(() => {
    const table = searchParams.get('table');
    if (table) {
      setTableNumber(table);
    } else {
      // For now, if no table, redirect. In future, maybe prompt for table number.
      router.push('/');
    }
  }, [searchParams, setTableNumber, router]);
  
  const availableMenuItems = menuItems.filter(item => item.isAvailable !== false);
  
  const currentOrder = orders.find(o => o.tableId === tableNumber);
  
  const totalItemsInCart = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalItemsInOrder = (currentOrder ? [
      ...(currentOrder.pendingItems || []),
      ...(currentOrder.confirmedItems || []),
      ...(currentOrder.readyItems || []),
      ...(currentOrder.servedItems || [])
    ] : []).reduce((acc, item) => acc + item.quantity, 0);

  const combinedTotalItems = totalItemsInCart + totalItemsInOrder;
  
  const totalCartPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalOrderPrice = (currentOrder ? [
      ...(currentOrder.pendingItems || []),
      ...(currentOrder.confirmedItems || []),
      ...(currentOrder.readyItems || []),
      ...(currentOrder.servedItems || [])
    ] : []).reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  const combinedPrice = totalCartPrice + totalOrderPrice;

  return (
    <div className="bg-background min-h-screen">
      <Header />
      <div className="container mx-auto py-4 px-2 sm:px-4 lg:px-6 relative">
        <MenuDisplay menuItems={availableMenuItems} />
      </div>
      
      {combinedTotalItems > 0 && (
        <div className="sticky bottom-0 left-0 right-0 bg-background border-t p-3 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
            <div className="container mx-auto flex justify-between items-center">
                <div>
                    <p className="font-bold">{combinedTotalItems} Item/s in Order</p>
                    <p className="text-sm">₹{combinedPrice.toFixed(2)}</p>
                </div>
                <Button onClick={() => setIsCartOpen(true)} className="bg-black text-white rounded-md">
                    View Order &raquo;
                </Button>
            </div>
        </div>
      )}

    </div>
  );
}
