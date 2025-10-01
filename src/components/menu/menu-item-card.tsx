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
  const { cartItems, addToCart, updateQuantity, getItemQuantity } = useCart();
  
  const cartItem = cartItems.find(i => i.id === item.id);
  const totalQuantity = getItemQuantity(item.id);
  const quantityInCart = cartItem?.quantity || 0;

  const handleUpdateQuantity = (newQuantity: number) => {
    updateQuantity(item.id, newQuantity);
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
        {quantityInCart > 0 ? (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-card"
              onClick={() => handleUpdateQuantity(quantityInCart - 1)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-bold text-lg">{totalQuantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-card"
              onClick={() => handleUpdateQuantity(quantityInCart + 1)}
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
            {totalQuantity > 0 ? `ADD MORE` : 'ADD'}
            {totalQuantity > 0 && <span className="ml-2 bg-primary text-primary-foreground rounded-full h-5 w-5 text-xs flex items-center justify-center">{totalQuantity}</span>}
          </Button>
        )}
      </div>
    </div>
  );
}
