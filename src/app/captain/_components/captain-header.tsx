'use client';

import React from 'react';
import { ChefHat } from 'lucide-react';
import { useCart } from '@/components/cart/cart-context';
import Link from 'next/link';

export default function CaptainHeader() {
  const { orders } = useCart();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const pendingCount = orders.filter(o => o.status === 'pending').length;

  return (
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-2 sm:px-4">
          <Link href="/captain" className="p-2 flex items-center gap-2">
            <ChefHat className="h-6 w-6" />
            <h1 className="font-bold text-lg hidden sm:block">Captain View</h1>
          </Link>
          
          <div className="text-center">
            <h1 className="font-bold text-lg">Nikee's Zara</h1>
          </div>
          
          <div className="p-2 text-right min-w-[120px]">
            {isClient ? (
              <p className="text-sm font-bold">{pendingCount} New Order{pendingCount !== 1 && 's'}</p>
            ) : (
                <p className="text-sm font-bold animate-pulse">Loading...</p>
            )}
          </div>
        </div>
      </header>
  );
}
