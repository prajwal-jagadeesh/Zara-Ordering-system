'use client';

import type { MenuItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/components/cart/cart-context';
import { Minus, Plus } from 'lucide-react';
import Image from 'next/image';

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { cartItems, addToCart, updateQuantity, orders, tableNumber } = useCart();
  
  const currentOrder = orders.find(o => o.tableId === tableNumber);
  const cartItem = cartItems.find(i => i.id === item.id);
  const pendingItem = currentOrder?.pendingItems.find(i => i.id === item.id);
  const confirmedItem = currentOrder?.confirmedItems.find(i => i.id === item.id);
  
  const quantityInCart = cartItem?.quantity || 0;
  const quantityPending = pendingItem?.quantity || 0;
  const quantityConfirmed = confirmedItem?.quantity || 0;

  const totalQuantity = quantityInCart + quantityPending + quantityConfirmed;

  const handleUpdateQuantity = (newQuantity: number) => {
    // Only allow changing items that are in the cart (not yet ordered)
    if (newQuantity >= (quantityPending + quantityConfirmed)) {
        const cartQuantity = newQuantity - (quantityPending + quantityConfirmed);
        updateQuantity(item.id, cartQuantity);
    }
  };
  
  const handleAddToCart = () => {
    addToCart(item);
  }

  return (
    <div className="flex items-start space-x-4">
      {item.imageUrl && (
        <Image
          src={item.imageUrl}
          alt={item.name}
          width={80}
          height={80}
          className="w-20 h-20 rounded-md object-cover"
          data-ai-hint={item.imageHint}
        />
      )}
      <div className="flex-grow">
        <h3 className="font-semibold text-lg">{item.name}</h3>
        <p className="text-sm text-muted-foreground">{item.description}</p>
        <p className="text-md font-medium mt-1">₹{item.price.toFixed(2)}</p>
      </div>
      <div className="flex-shrink-0">
        {totalQuantity > 0 ? (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-card"
              onClick={() => handleUpdateQuantity(totalQuantity - 1)}
              disabled={quantityInCart === 0}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-bold text-lg">{totalQuantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-card"
              onClick={() => handleUpdateQuantity(totalQuantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            className="rounded-md px-6"
            onClick={handleAddToCart}
          >
            ADD
          </Button>
        )}
      </div>
    </div>
  );
}
