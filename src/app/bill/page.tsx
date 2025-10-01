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
      } else if (orders.length === 0) {
        // Still waiting for orders to load from context
        setIsLoading(true);
      }
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
            <div className="receipt-container p-2 mx-auto sm:w-[300px]">
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
            </div>

            <div className="max-w-md mx-auto text-center my-4 no-print">
                <Button onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" /> Print Bill
                </Button>
            </div>
        </div>
    </>
  );
};

export default BillPage;
