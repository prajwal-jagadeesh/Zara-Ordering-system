'use client';

import Link from 'next/link';
import { Leaf, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/components/cart/cart-context';
import { CartSheet } from '@/components/cart/cart-sheet';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function Header() {
  const { totalItems, isCartAnimating } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl font-bold">Zara Menu</span>
          </Link>
          <div className="flex flex-1 items-center justify-end">
            <nav className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setIsCartOpen(true)}
                aria-label={`Open cart with ${totalItems} items`}
              >
                <div
                  className={cn(
                    'transition-transform duration-500',
                    isCartAnimating && 'animate-bounce'
                  )}
                >
                  <ShoppingCart className="h-5 w-5" />
                </div>

                {totalItems > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                    {totalItems}
                  </span>
                )}
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  );
}
