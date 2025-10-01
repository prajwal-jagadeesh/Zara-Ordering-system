'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '@/components/cart/cart-context';
import type { Order, CartItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import KitchenHeader from './_components/kitchen-header';


const KitchenOrderCard = ({ order }: { order: Order }) => {
    const { markOrderReady } = useCart();
    const confirmedItems = order.confirmedItems || [];

    const handleMarkAsReady = () => {
        markOrderReady(order.tableId);
    };

    return (
        <div className="flex flex-col border rounded-lg bg-white shadow-md">
            <div className="bg-green-500 text-white p-2 rounded-t-lg flex justify-between items-center">
                <h3 className="font-bold">TABLE {order.tableId}</h3>
            </div>
            <div className="p-4 flex-grow space-y-2">
                {confirmedItems.map((item: CartItem) => (
                    <div key={item.id} className="flex justify-between items-start">
                        <span className="font-semibold">{item.name}</span>
                        <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            x{item.quantity}
                        </span>
                    </div>
                ))}
            </div>
            <div className="bg-green-500 text-white p-2 rounded-b-lg mt-auto">
                 <div className='flex justify-between text-xs mb-2'>
                    <span>ORDER ACCEPTED AT</span>
                    <span>{new Date(order.orderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                 </div>
                <Button 
                    className="w-full bg-white text-green-500 hover:bg-gray-100"
                    onClick={handleMarkAsReady}>
                    MARK AS READY
                </Button>
            </div>
        </div>
    );
};


export default function KitchenPage() {
    const { orders } = useCart();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
             <div className="bg-gray-50 min-h-screen">
                <KitchenHeader />
                <div className="flex flex-1 justify-center items-center h-[calc(100vh-4rem)]">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </div>
        );
    }
    
    const kitchenOrders = orders.filter(o => o.status === 'confirmed' && (o.confirmedItems || []).length > 0);

    return (
        <div className="bg-gray-50 min-h-screen">
            <KitchenHeader />
            <main className="p-4">
                {kitchenOrders.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {kitchenOrders.map(order => (
                            <KitchenOrderCard key={order.tableId} order={order} />
                        ))}
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-700">No Orders for the Kitchen</h2>
                            <p className="text-gray-500 mt-2">As soon as the captain confirms an order, it will show up here.</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
