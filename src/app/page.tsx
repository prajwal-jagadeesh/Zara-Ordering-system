'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Utensils } from 'lucide-react';
import Image from 'next/image';

export default function Home() {

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50">
      <header className="p-4 flex justify-center">
        <h1 className="text-2xl font-bold font-serif tracking-wider">Nikee's Zara</h1>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center text-center p-4">
        
        <div className="mb-8">
          <p className="text-lg text-zinc-600 dark:text-zinc-400">Welcome to</p>
          <h2 className="text-5xl font-serif font-bold">TABLE 14</h2>
        </div>

        <div className="relative w-64 h-64 mb-8">
            <Image
              src="/placeholder.svg"
              alt="QR Code graphic"
              width={256}
              height={256}
              className="w-full h-full object-contain"
              data-ai-generated="true"
            />
        </div>

        <p className="max-w-xs mx-auto text-zinc-600 dark:text-zinc-400 mb-8">
          Scan, Order, and Enjoy. <br/> Your meal is just a few taps away.
        </p>
        
        <Button asChild size="lg" className="w-full max-w-sm h-14 bg-accent text-accent-foreground hover:bg-accent/90 text-lg font-bold rounded-full">
          <Link href="/menu">
            <Utensils className="mr-2 h-5 w-5" />
            Browse Menu
          </Link>
        </Button>
      </main>

      <footer className="w-full py-6 text-center">
          <p className="text-sm text-zinc-500">&copy; 2024 Nikee's Zara</p>
      </footer>
    </div>
  );
}
