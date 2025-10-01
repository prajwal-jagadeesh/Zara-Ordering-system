'use client';

import React from 'react';
import { useCart } from '@/components/cart/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Bell, Check, X, ChefHat, Loader2, Utensils, CheckCircle2, CreditCard, CookingPot, FileText } from 'lucide-react';
import CaptainHeader from './_components/captain-header';
import type { Order, CartItem } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

const OrderItemRow = ({ 
    item, 
    onServe, 
    canBeServed, 
    isServed 
}: { 
    item: CartItem; 
    onServe?: () => void; 
    canBeServed: boolean; 
    isServed: boolean; 
}) => (
    <div className="flex justify-between items-center">
        <div>
            <span>{item.name} x {item.quantity}</span>
        </div>
        {onServe && !isServed && (
            <Button variant="outline" size="sm" onClick={onServe} disabled={!canBeServed}>
                <Utensils className="mr-2 h-4 w-4" /> Serve
            </Button>
        )}
        {isServed && (
            <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span>Served</span>
            </div>
        )}
    </div>
);


const OrderCard = ({ order }: {order: Order}) => {
    const { confirmOrder, rejectOrder, serveItem, closeOrder } = useCart();

    const pendingItems = order.pendingItems || [];
    const confirmedItems = order.confirmedItems || [];
    const readyItems = order.readyItems || [];
    const servedItems = order.servedItems || [];

    const totalNewItems = pendingItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalConfirmedItems = confirmedItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalReadyItems = readyItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalServedItems = servedItems.reduce((acc, item) => acc + item.quantity, 0);
    
    const totalNewPrice = pendingItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalConfirmedPrice = confirmedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalReadyPrice = readyItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalServedPrice = servedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalPrice = totalNewPrice + totalConfirmedPrice + totalReadyPrice + totalServedPrice;
    
    const handleServeItem = (itemId: number) => {
        serveItem(order.tableId, itemId);
    }
    
    const isFullyServed = pendingItems.length === 0 && confirmedItems.length === 0 && readyItems.length === 0 && servedItems.length > 0;
    const hasPendingItems = pendingItems.length > 0;

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">TABLE {order.tableId}</CardTitle>
                <Badge variant={order.status === 'pending' ? 'destructive' : isFullyServed ? 'default' : 'outline'}>
                    {isFullyServed ? 'Completed' : order.status}
                </Badge>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 text-sm">
                    {pendingItems.length > 0 && (
                        <div>
                            <h3 className="font-semibold flex items-center gap-2 mb-2"><Bell className="text-destructive h-4 w-4" /> New Items</h3>
                            <div className="space-y-2">
                                {pendingItems.map(item => <OrderItemRow key={item.id} item={item} canBeServed={false} isServed={false} />)}
                            </div>
                        </div>
                    )}
                     {(pendingItems.length > 0 && (confirmedItems.length > 0 || readyItems.length > 0 || servedItems.length > 0)) && <Separator />}

                    {confirmedItems.length > 0 && (
                        <div>
                            <h3 className="font-semibold flex items-center gap-2 mb-2"><ChefHat className="h-4 w-4" /> In the Kitchen</h3>
                             <div className="space-y-2">
                                {confirmedItems.map(item => <OrderItemRow key={item.id} item={item} onServe={() => handleServeItem(item.id)} canBeServed={false} isServed={false} />)}
                            </div>
                        </div>
                    )}
                    
                    {((confirmedItems.length > 0) && (readyItems.length > 0 || servedItems.length > 0)) && <Separator />}

                    {readyItems.length > 0 && (
                        <div>
                            <h3 className="font-semibold flex items-center gap-2 mb-2"><CookingPot className="h-4 w-4 text-blue-600" /> Ready for Pickup</h3>
                             <div className="space-y-2">
                                {readyItems.map(item => <OrderItemRow key={item.id} item={item} onServe={() => handleServeItem(item.id)} canBeServed={true} isServed={false} />)}
                            </div>
                        </div>
                    )}

                    {((readyItems.length > 0) && servedItems.length > 0) && <Separator />}

                    {servedItems.length > 0 && (
                        <div>
                            <h3 className="font-semibold flex items-center gap-2 mb-2"><CheckCircle2 className="h-4 w-4 text-green-600" /> Served</h3>
                            <div className="space-y-2">
                                {servedItems.map(item => <OrderItemRow key={item.id} item={item} canBeServed={false} isServed={true} />)}
                            </div>
                        </div>
                    )}
                    
                    <Separator />
                    <div className="flex justify-between font-bold">
                        <span>Total ({totalNewItems + totalConfirmedItems + totalReadyItems + totalServedItems} items)</span>
                        <span>₹{totalPrice.toFixed(2)}</span>
                    </div>
                </div>
                 <p className="text-xs text-muted-foreground mt-2">
                    Ordered {formatDistanceToNow(new Date(order.orderTime), { addSuffix: true })}
                </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                 {hasPendingItems && (
                    <>
                        <Button variant="outline" size="sm" onClick={() => rejectOrder(order.tableId)}>
                            <X className="mr-2 h-4 w-4" /> Reject
                        </Button>
                        <Button size="sm" onClick={() => confirmOrder(order.tableId)}>
                            <Check className="mr-2 h-4 w-4" /> Confirm
                        </Button>
                    </>
                )}
                {isFullyServed && !hasPendingItems && (
                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                        <Link href={`/bill?tableId=${order.tableId}`} passHref legacyBehavior>
                           <a target="_blank" className='w-full'>
                             <Button size="sm" variant="outline" className="w-full">
                                <FileText className="mr-2 h-4 w-4" /> Generate Bill
                            </Button>
                           </a>
                        </Link>
                        <Button size="sm" onClick={() => closeOrder(order.tableId)} className="w-full">
                            <CreditCard className="mr-2 h-4 w-4" /> Payment Received
                        </Button>
                    </div>
                )}
            </CardFooter>
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
        const totalItems = (o.pendingItems || []).length + (o.confirmedItems || []).length + (o.readyItems || []).length + (o.servedItems || []).length;
        return totalItems > 0;
    });

    const pendingOrders = activeOrders.filter(o => o.status === 'pending' || (o.pendingItems || []).length > 0);
    
    const inProgressOrders = activeOrders.filter(o => 
        (o.status === 'confirmed' || o.status === 'pending') &&
        (o.pendingItems || []).length === 0 &&
        ((o.confirmedItems || []).length > 0 || (o.readyItems || []).length > 0)
    );
    
    const completedOrders = activeOrders.filter(o => 
        o.status === 'confirmed' && 
        (o.pendingItems || []).length === 0 && 
        (o.confirmedItems || []).length === 0 &&
        (o.readyItems || []).length === 0 &&
        (o.servedItems || []).length > 0
    );


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
                
                {inProgressOrders.length > 0 && (
                     <div className="mb-8">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><ChefHat /> In Progress</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {inProgressOrders.map(order => <OrderCard key={`${order.tableId}-${order.orderTime}`} order={order} />)}
                        </div>
                    </div>
                )}

                {completedOrders.length > 0 && (
                     <div className="mb-8">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><CheckCircle2 className="text-green-600" /> Ready for Payment</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {completedOrders.map(order => <OrderCard key={`${order.tableId}-${order.orderTime}`} order={order} />)}
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
