'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/components/cart/cart-context';
import type { Order, CartItem } from '@/lib/types';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

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
      // The orders are loaded from localStorage by the CartProvider.
      // We need to wait until the orders array is populated.
      if (tableId && orders.length > 0) {
        const foundOrder = orders.find(o => o.tableId === tableId);
        setOrder(foundOrder || null);
        setIsLoading(false);
        // Automatically trigger print dialog once order is loaded
        if (foundOrder) {
            setTimeout(() => window.print(), 500); // Small delay to ensure rendering
        }
      } else if (!tableId) {
        // If there's no tableId in the URL, we can stop loading.
        setIsLoading(false);
      } else if (orders.length === 0) {
        // If there is a tableId but orders haven't loaded yet, we keep loading.
        // If orders have loaded and it's still 0, the next block will handle it.
        // We add a timeout to prevent getting stuck if local storage is empty.
        const timer = setTimeout(() => {
            if (orders.length === 0) {
                setIsLoading(false);
            }
        }, 2000); // Wait 2 seconds for orders to load.
        return () => clearTimeout(timer);
      }
    }
  }, [searchParams, orders, isClient]);

  if (!isClient || isLoading) {
     return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center font-mono">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>Loading Bill...</p>
            <p className="text-xs text-muted-foreground mt-2">Please wait, preparing your receipt.</p>
        </div>
     );
  }
  
  if (!order) {
     return (
        <div className="p-10 text-center font-mono font-bold text-destructive">
            Order not found for this table.
        </div>
     );
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
    <>
        <style jsx global>{`
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .receipt-container {
                    width: 72mm;
                    margin: 0;
                    padding: 0;
                    background-color: white !important;
                }
                .no-print {
                    display: none;
                }
            }
             @page {
                size: 80mm;
                margin: 0;
            }
        `}</style>
        <div className="bg-white text-black min-h-screen font-mono">
            <div className="receipt-container p-2 mx-auto w-[280px] sm:w-[300px]">
                <header className="text-center mb-2">
                    <h1 className="text-lg font-bold">Nikee's Zara</h1>
                    <p className="text-xs">Customer Receipt</p>
                </header>

                <hr className="border-dashed border-black my-2" />

                <div className="text-xs mb-2">
                    <p><span className="font-semibold">Table:</span> {order.tableId}</p>
                    <p><span className="font-semibold">Date:</span> {format(new Date(), 'PP')}</p>
                    <p><span className="font-semibold">Time:</span> {format(new Date(), 'p')}</p>
                </div>

                <hr className="border-dashed border-black my-2" />

                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b border-dashed border-black">
                        <th className="text-left font-semibold py-1">ITEM</th>
                        <th className="text-center font-semibold py-1">QTY</th>
                        <th className="text-right font-semibold py-1">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allItems.map(item => (
                        <tr key={item.id}>
                            <td className="py-0.5">{item.name}</td>
                            <td className="text-center py-0.5">{item.quantity}</td>
                            <td className="text-right py-0.5">₹{(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>

                <hr className="border-dashed border-black my-2" />

                <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>VAT (5%)</span>
                        <span>₹{vat.toFixed(2)}</span>
                    </div>
                    <hr className="border-dashed border-black my-1" />
                    <div className="flex justify-between font-bold text-sm">
                        <span>Grand Total</span>
                        <span>₹{grandTotal.toFixed(2)}</span>
                    </div>
                </div>
                
                <hr className="border-dashed border-black my-2" />

                <p className="text-center text-[10px] mt-4">
                Thank you for dining with us!
                </p>
                
                <p className="text-center text-[9px] mt-4 no-print">
                The print dialog should open automatically. If it does not, please refresh the page.
                </p>
            </div>
        </div>
    </>
  );
};

export default BillPage;
