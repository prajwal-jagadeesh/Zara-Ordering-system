'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ScanLine } from 'lucide-react';
import Image from 'next/image';

export default function Home() {

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50">
      <header className="p-4 flex justify-center">
        <h1 className="text-2xl font-bold font-serif tracking-wider">Nikee's Zara</h1>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center text-center p-4">
        
        <div className="mb-8">
          <ScanLine className="h-24 w-24 mx-auto text-zinc-400" />
        </div>

        <h2 className="text-3xl font-serif font-bold mb-4">Scan to Order</h2>
        <p className="max-w-xs mx-auto text-zinc-600 dark:text-zinc-400 mb-8">
          Please scan the QR code on your table to view the menu and place your order.
        </p>
        
      </main>

      <footer className="w-full py-6 text-center">
          <p className="text-sm text-zinc-500">&copy; 2024 Nikee's Zara</p>
      </footer>
    </div>
  );
}
