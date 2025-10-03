
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
import { Minus, Plus, Loader2, ChefHat, Bell } from 'lucide-react';
import React from 'react';
import type { CartItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const CartItemRow = ({ item, isOrdered }: { item: CartItem, isOrdered: boolean }) => {
    const { updateQuantity } = useCart();
    
    return (
        <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center space-x-4 flex-1">
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
  const { cartItems, orders, tableNumber, placeOrder, isCartOpen, setIsCartOpen, clearCart } = useCart();
  const [isPlacingOrder, setIsPlacingOrder] = React.useState(false);
  const { toast } = useToast();

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;
    setIsPlacingOrder(true);
    setTimeout(() => {
      placeOrder();
      setIsPlacingOrder(false);
    }, 1000);
  }

  const currentOrder = orders.find(o => o.tableId === tableNumber);
  const pendingItems = currentOrder?.pendingItems || [];
  const confirmedItems = currentOrder?.confirmedItems || [];

  const totalCartPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalPendingPrice = pendingItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalConfirmedPrice = confirmedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const combinedPrice = totalCartPrice + totalPendingPrice + totalConfirmedPrice;


  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-lg bg-background text-foreground">
        <SheetHeader className="p-6 pb-2 flex-row justify-between items-center">
          <SheetTitle className="font-bold text-xl">YOUR ORDER</SheetTitle>
          <Button variant="link" onClick={clearCart} className="text-destructive">Clear New Items</Button>
        </SheetHeader>
        <Separator />
        {(cartItems.length > 0 || pendingItems.length > 0 || confirmedItems.length > 0) ? (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="flex flex-col gap-6 py-6">
                
                {cartItems.length > 0 && (
                    <>
                        <h3 className="text-base font-semibold">New Items</h3>
                        {cartItems.map(item => <CartItemRow key={item.id} item={item} isOrdered={false} />)}
                    </>
                )}
                
                {(cartItems.length > 0 && (pendingItems.length > 0 || confirmedItems.length > 0)) && <Separator className="my-2" />}

                {pendingItems.length > 0 && (
                  <>
                    <h3 className="text-base font-semibold flex items-center gap-2">
                        <Bell size={20} />
                        Waiting for confirmation
                    </h3>
                    {pendingItems.map(item => <CartItemRow key={item.id} item={item} isOrdered={true} />)}
                  </>
                )}

                {(pendingItems.length > 0 && confirmedItems.length > 0) && <Separator className="my-2" />}

                {confirmedItems.length > 0 && (
                  <>
                    <h3 className="text-base font-semibold flex items-center gap-2">
                        <ChefHat size={20} />
                        In the Kitchen
                    </h3>
                    {confirmedItems.map(item => <CartItemRow key={item.id} item={item} isOrdered={true} />)}
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
