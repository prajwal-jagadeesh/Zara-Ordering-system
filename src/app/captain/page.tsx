'use client';

import React from 'react';
import { useCart } from '@/components/cart/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Bell, Check, X, ChefHat } from 'lucide-react';
import CaptainHeader from './_components/captain-header';
import type { Order } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

const OrderCard = ({ order }: {order: Order}) => {
    const { confirmOrder, rejectOrder } = useCart();
    const totalItems = order.items.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">TABLE {order.tableId}</CardTitle>
                <Badge variant={order.status === 'pending' ? 'destructive' : 'default'}>
                    {order.status}
                </Badge>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 text-sm">
                    {order.items.map(item => (
                        <div key={item.id} className="flex justify-between">
                            <span>{item.name} x {item.quantity}</span>
                            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between font-bold">
                        <span>Total ({totalItems} items)</span>
                        <span>₹{totalPrice.toFixed(2)}</span>
                    </div>
                </div>
                 <p className="text-xs text-muted-foreground mt-2">
                    {formatDistanceToNow(order.orderTime, { addSuffix: true })}
                </p>
            </CardContent>
            {order.status === 'pending' && (
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => rejectOrder(order.tableId)}>
                        <X className="mr-2 h-4 w-4" /> Reject
                    </Button>
                    <Button size="sm" onClick={() => confirmOrder(order.tableId)}>
                        <Check className="mr-2 h-4 w-4" /> Confirm
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}


export default function CaptainPage() {
    const { orders } = useCart();
    const pendingOrders = orders.filter(o => o.status === 'pending');
    const confirmedOrders = orders.filter(o => o.status === 'confirmed');

    return (
        <div className="bg-background min-h-screen">
            <CaptainHeader />
            <div className="container mx-auto py-4 px-2 sm:px-4 lg:px-6">
                
                {pendingOrders.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Bell className="text-destructive" /> Pending Orders</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {pendingOrders.map(order => <OrderCard key={order.tableId} order={order} />)}
                        </div>
                    </div>
                )}
                
                {confirmedOrders.length > 0 && (
                     <div className="mb-8">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><ChefHat /> Confirmed Orders</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {confirmedOrders.map(order => <OrderCard key={order.tableId} order={order} />)}
                        </div>
                    </div>
                )}

                {orders.length === 0 && (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold">No orders yet</h2>
                        <p className="text-muted-foreground">As soon as customers place an order, it will show up here.</p>
                    </div>
                )}

            </div>
        </div>
    )
}
