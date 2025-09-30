'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
  SheetClose,
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button';
import { useCart } from './cart-context';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, Loader2, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import React from 'react';

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { cartItems, updateQuantity, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [isPlacingOrder, setIsPlacingOrder] = React.useState(false);

  const handlePlaceOrder = () => {
    setIsPlacingOrder(true);
    // Simulate API call for placing order
    setTimeout(() => {
      setIsPlacingOrder(false);
      onOpenChange(false); // Close the sheet
      clearCart();
      toast({
        title: "Order Placed! 🎉",
        description: "Your order has been sent to the kitchen. It will be ready shortly.",
      });
    }, 2000);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle className="font-headline text-2xl">Your Order</SheetTitle>
          <SheetDescription>Review your items before placing the order.</SheetDescription>
        </SheetHeader>
        <Separator className="my-2"/>
        {cartItems.length > 0 ? (
          <>
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-4 px-6 py-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-start justify-between space-x-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">₹{item.price.toFixed(2)}</p>
                        <div className="flex items-center gap-2 pt-2">
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-6 text-center">{item.quantity}</span>
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                       <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => updateQuantity(item.id, 0)}>
                          <Trash2 className="h-4 w-4" />
                       </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="bg-background mt-auto p-6 border-t">
              <div className="w-full space-y-4">
                <div className="flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                 <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="lg" className="w-full h-12 text-lg" disabled={isPlacingOrder}>
                       {isPlacingOrder ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        "Place Order"
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Your Order</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will send your order directly to the kitchen. Are you sure you want to proceed?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handlePlaceOrder}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center space-y-4 text-center">
            <div className="rounded-full border-4 border-dashed border-muted-foreground/30 p-8">
               <ShoppingCart className="h-16 w-16 text-muted-foreground/50"/>
            </div>
            <h3 className="font-headline text-2xl font-semibold">Your cart is empty</h3>
            <p className="text-muted-foreground">Add some delicious items from the menu to get started.</p>
            <SheetClose asChild>
                <Button>Start Ordering</Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
