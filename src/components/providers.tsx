'use client';

import { CartProvider } from '@/components/cart/cart-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}
