'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/components/cart/cart-context';
import type { Order, CartItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Printer } from 'lucide-react';
import { format } from 'date-fns';

const BillPage = () => {
  const searchParams = useSearchParams();
  const { orders } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (isClient) {
      const tableId = searchParams.get('tableId');
      // Only proceed if we have a tableId and orders have been loaded from storage.
      if (tableId && orders.length > 0) {
        const foundOrder = orders.find(o => o.tableId === tableId);
        setOrder(foundOrder || null);
        setIsLoading(false);
      } else if (!tableId) {
        // If there's no tableId, we can stop loading.
        setIsLoading(false);
      }
      // If orders.length is 0, we keep isLoading as true, waiting for the cart context to update.
    }
  }, [searchParams, orders, isClient]);

  const handlePrint = () => {
    window.print();
  };
  
  if (!isClient || isLoading) {
     return <div className="p-10 text-center">Loading Bill...</div>;
  }
  
  if (!order) {
     return <div className="p-10 text-center font-bold text-red-500">Order not found for this table.</div>;
  }

  const allItems = [
      ...(order.pendingItems || []),
      ...(order.confirmedItems || []),
      ...(order.readyItems || []),
      ...(order.servedItems || [])
  ];

  const subtotal = allItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const vat = subtotal * 0.05;
  const grandTotal = subtotal + vat;


  return (
    <div className="bg-white text-black min-h-screen">
      <div className="max-w-md mx-auto p-4 sm:p-8 border-dashed border-2 border-gray-400 my-8 print:border-none print:my-0">
        <header className="text-center mb-6">
          <h1 className="text-2xl font-bold font-serif tracking-wider">Nikee's Zara</h1>
          <p className="text-sm">Customer Receipt</p>
        </header>

        <Separator className="my-4 bg-gray-400 border-dashed" />

        <div className="flex justify-between text-sm mb-4">
            <div>
                <p><span className="font-semibold">Table:</span> {order.tableId}</p>
            </div>
            <div>
                <p><span className="font-semibold">Date:</span> {format(new Date(), 'PP')}</p>
                <p><span className="font-semibold">Time:</span> {format(new Date(), 'p')}</p>
            </div>
        </div>

        <Separator className="my-4 bg-gray-400 border-dashed" />

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dashed border-gray-400">
              <th className="text-left font-semibold py-2">ITEM</th>
              <th className="text-center font-semibold py-2">QTY</th>
              <th className="text-right font-semibold py-2">PRICE</th>
              <th className="text-right font-semibold py-2">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {allItems.map(item => (
              <tr key={item.id}>
                <td className="py-1">{item.name}</td>
                <td className="text-center py-1">{item.quantity}</td>
                <td className="text-right py-1">₹{item.price.toFixed(2)}</td>
                <td className="text-right py-1">₹{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Separator className="my-4 bg-gray-400 border-dashed" />

        <div className="space-y-2 text-sm">
            <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
                <span>VAT (5%)</span>
                <span>₹{vat.toFixed(2)}</span>
            </div>
             <div className="flex justify-between font-bold text-lg border-t border-dashed border-gray-400 pt-2 mt-2">
                <span>Grand Total</span>
                <span>₹{grandTotal.toFixed(2)}</span>
            </div>
        </div>
        
        <Separator className="my-4 bg-gray-400 border-dashed" />

        <p className="text-center text-xs mt-6">
          Thank you for dining with us!
        </p>
      </div>

      <div className="max-w-md mx-auto text-center mb-8 print:hidden">
        <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Print Bill
        </Button>
      </div>
    </div>
  );
};

export default BillPage;
