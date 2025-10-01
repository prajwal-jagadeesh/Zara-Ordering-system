'use client';

import React from 'react';
import { useCart } from '@/components/cart/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Bell, Check, X, ChefHat, Loader2, Utensils } from 'lucide-react';
import CaptainHeader from './_components/captain-header';
import type { Order, CartItem } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

const OrderItemRow = ({ item, onServe, showServeButton }: { item: CartItem, onServe?: () => void, showServeButton: boolean }) => (
    <div className="flex justify-between items-center">
        <div>
            <span>{item.name} x {item.quantity}</span>
        </div>
        {showServeButton && onServe && (
            <Button variant="outline" size="sm" onClick={onServe}>
                <Utensils className="mr-2 h-4 w-4" /> Serve
            </Button>
        )}
    </div>
);


const OrderCard = ({ order }: {order: Order}) => {
    const { confirmOrder, rejectOrder, serveItem } = useCart();

    const pendingItems = order.pendingItems || [];
    const confirmedItems = order.confirmedItems || [];

    const totalNewItems = pendingItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalConfirmedItems = confirmedItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalNewPrice = pendingItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalConfirmedPrice = confirmedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalPrice = totalNewPrice + totalConfirmedPrice;
    
    const handleServeItem = (itemId: number) => {
        serveItem(order.tableId, itemId);
    }

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">TABLE {order.tableId}</CardTitle>
                <Badge variant={order.status === 'pending' ? 'destructive' : 'default'}>
                    {order.status}
                </Badge>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 text-sm">
                    {pendingItems.length > 0 && (
                        <div>
                            <h3 className="font-semibold flex items-center gap-2 mb-2"><Bell className="text-destructive h-4 w-4" /> New Items</h3>
                            <div className="space-y-2">
                                {pendingItems.map(item => <OrderItemRow key={item.id} item={item} showServeButton={false} />)}
                            </div>
                        </div>
                    )}
                     {pendingItems.length > 0 && confirmedItems.length > 0 && <Separator />}

                    {confirmedItems.length > 0 && (
                        <div>
                            <h3 className="font-semibold flex items-center gap-2 mb-2"><ChefHat className="h-4 w-4" /> In the Kitchen</h3>
                             <div className="space-y-2">
                                {confirmedItems.map(item => <OrderItemRow key={item.id} item={item} onServe={() => handleServeItem(item.id)} showServeButton={true} />)}
                            </div>
                        </div>
                    )}
                    
                    <Separator />
                    <div className="flex justify-between font-bold">
                        <span>Total ({totalNewItems + totalConfirmedItems} items)</span>
                        <span>₹{totalPrice.toFixed(2)}</span>
                    </div>
                </div>
                 <p className="text-xs text-muted-foreground mt-2">
                    {formatDistanceToNow(new Date(order.orderTime), { addSuffix: true })}
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
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
             <div className="bg-background min-h-screen">
                <CaptainHeader />
                <div className="flex flex-1 justify-center items-center h-[calc(100vh-4rem)]">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </div>
        );
    }
    
    const activeOrders = orders.filter(o => {
        const hasPending = (o.pendingItems || []).length > 0;
        const hasConfirmed = (o.confirmedItems || []).length > 0;
        return hasPending || hasConfirmed;
    });

    const pendingOrders = activeOrders.filter(o => o.status === 'pending');
    const confirmedOrders = activeOrders.filter(o => o.status === 'confirmed' && (o.pendingItems || []).length === 0);

    return (
        <div className="bg-background min-h-screen">
            <CaptainHeader />
            <div className="container mx-auto py-4 px-2 sm:px-4 lg:px-6">
                
                {pendingOrders.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Bell className="text-destructive" /> Pending Orders</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {pendingOrders.map(order => <OrderCard key={`${order.tableId}-${order.orderTime}`} order={order} />)}
                        </div>
                    </div>
                )}
                
                {confirmedOrders.length > 0 && (
                     <div className="mb-8">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><ChefHat /> Confirmed Orders</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {confirmedOrders.map(order => <OrderCard key={`${order.tableId}-${order.orderTime}`} order={order} />)}
                        </div>
                    </div>
                )}

                {activeOrders.length === 0 && (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold">No active orders</h2>
                        <p className="text-muted-foreground">As soon as customers place an order, it will show up here.</p>
                    </div>
                )}

            </div>
        </div>
    )
}
