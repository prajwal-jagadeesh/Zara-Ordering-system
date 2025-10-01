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
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const quantity = getItemQuantity(item.id);

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
        {quantity > 0 ? (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-card"
              onClick={() => updateQuantity(item.id, quantity - 1)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-bold text-lg">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-card"
              onClick={() => updateQuantity(item.id, quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            className="rounded-md px-6"
            onClick={() => addToCart(item)}
          >
            ADD
          </Button>
        )}
      </div>
    </div>
  );
}
