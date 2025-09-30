'use client';

import type { MenuItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCart } from '@/components/cart/cart-context';
import { PlusCircle } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { addToCart } = useCart();

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{item.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <CardDescription>{item.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex items-center justify-between mt-auto pt-4">
        <p className="text-xl font-semibold text-foreground">
          ₹{item.price.toFixed(2)}
        </p>
        <Button onClick={() => addToCart(item)}>
          <PlusCircle className="mr-2 h-5 w-5" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
