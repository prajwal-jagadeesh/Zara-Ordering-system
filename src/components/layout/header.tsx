'use client';

import Link from 'next/link';
import { ArrowLeft, User } from 'lucide-react';
import { useCart } from '@/components/cart/cart-context';
import { CartSheet } from '@/components/cart/cart-sheet';

export default function Header() {
  const { totalItems, setIsCartOpen, tableNumber } = useCart();

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-2 sm:px-4">
          <Link href="/" className="p-2">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div className="text-center">
            <h1 className="font-bold text-lg">Nikee's Zara</h1>
            {tableNumber && <p className="text-xs text-muted-foreground">TABLE {tableNumber}</p>}
          </div>
          <button className="p-2" onClick={() => setIsCartOpen(true)}>
            <User className="h-6 w-6" />
          </button>
        </div>
      </header>
      <CartSheet />
    </>
  );
}
