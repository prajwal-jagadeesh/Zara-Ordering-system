'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCart } from './cart-context';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, Loader2, ChefHat } from 'lucide-react';
import React from 'react';
import Image from 'next/image';
import type { CartItem } from '@/lib/types';

const CartItemRow = ({ item, isOrdered }: { item: CartItem, isOrdered: boolean }) => {
    const { updateQuantity, removeFromCart, tableNumber, orders } = useCart();
    
    const currentOrder = orders.find(o => o.tableId === tableNumber);
    const isConfirmed = currentOrder?.status === 'confirmed';

    return (
        <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center space-x-4 flex-1">
                {item.imageUrl && (
                <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="rounded-md object-cover w-16 h-16"
                />
                )}
                <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm font-bold">₹{item.price.toFixed(2)}</p>
                </div>
            </div>
            
            {isOrdered ? (
                <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">x {item.quantity}</span>
                </div>
            ) : (
                 <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="h-7 w-7 bg-card" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <Button variant="outline" size="icon" className="h-7 w-7 bg-card" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    )
}

export function CartSheet() {
  const { cartItems, orders, tableNumber, totalPrice, placeOrder, isCartOpen, setIsCartOpen, clearCart } = useCart();
  const [isPlacingOrder, setIsPlacingOrder] = React.useState(false);

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;
    setIsPlacingOrder(true);
    setTimeout(() => {
      placeOrder();
      setIsPlacingOrder(false);
    }, 1000);
  }

  const currentOrder = orders.find(o => o.tableId === tableNumber);
  const orderedItems = currentOrder?.items || [];
  const isConfirmed = currentOrder?.status === 'confirmed';

  const allItems = [
      ...orderedItems, 
      ...cartItems.filter(ci => !orderedItems.some(oi => oi.id === ci.id))
    ].map(item => {
        const cartItem = cartItems.find(ci => ci.id === item.id);
        const orderedItem = orderedItems.find(oi => oi.id === item.id);
        return {
            ...item,
            quantity: (cartItem?.quantity || 0) + (orderedItem?.quantity || 0)
        }
    }).filter((item, index, self) => index === self.findIndex(t => t.id === item.id));

    const totalOrderPrice = orderedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalCartPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const combinedPrice = totalOrderPrice + totalCartPrice;


  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-lg bg-background text-foreground">
        <SheetHeader className="p-6 pb-2 flex-row justify-between items-center">
          <SheetTitle className="font-bold text-xl">YOUR ORDER</SheetTitle>
          <Button variant="link" onClick={clearCart} className="text-destructive">Clear All</Button>
        </SheetHeader>
        <Separator />
        {(orderedItems.length > 0 || cartItems.length > 0) ? (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="flex flex-col gap-6 py-6">
                
                {cartItems.length > 0 && (
                    <>
                        <h3 className="text-base font-semibold">New Items</h3>
                        {cartItems.map(item => <CartItemRow key={item.id} item={item} isOrdered={false} />)}
                    </>
                )}
                
                {orderedItems.length > 0 && cartItems.length > 0 && <Separator className="my-2" />}

                {orderedItems.length > 0 && (
                  <>
                    <h3 className="text-base font-semibold flex items-center gap-2">
                        <ChefHat size={20} />
                        {isConfirmed ? "Order is Confirmed" : "Waiting for confirmation"}
                    </h3>
                    {orderedItems.map(item => <CartItemRow key={item.id} item={item} isOrdered={true} />)}
                  </>
                )}
              </div>
            </ScrollArea>
            <SheetFooter className="bg-background mt-auto p-6 border-t">
              <div className="w-full space-y-4">
                 <p className='text-xs text-muted-foreground text-center'>note all prices are inclusive of 5% VAT</p>
                <div className="flex justify-between font-bold text-lg">
                  <span>TOTAL</span>
                  <span>₹{combinedPrice.toFixed(2)}</span>
                </div>
                <Button size="lg" className="w-full h-12 text-lg" disabled={isPlacingOrder || cartItems.length === 0} onClick={handlePlaceOrder}>
                  {isPlacingOrder ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Add to Order'}
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center space-y-4 text-center px-6">
            <h3 className="font-bold text-2xl">Your cart is empty</h3>
            <p className="text-muted-foreground">Add some delicious items from the menu to get started.</p>
            <SheetClose asChild>
                <Button variant="secondary">Start Ordering</Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
