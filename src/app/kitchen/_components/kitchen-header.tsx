'use client';

import React, { useEffect, useState } from 'react';
import { Soup } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function KitchenHeader() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(format(new Date(), 'p'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
      <header className="sticky top-0 z-40 w-full border-b bg-gray-100">
        <div className="container flex h-16 items-center justify-between px-2 sm:px-4">
          <Link href="/kitchen" className="p-2 flex items-center gap-2">
            <Soup className="h-6 w-6" />
            <h1 className="font-bold text-lg hidden sm:block">Kitchen View</h1>
          </Link>
          
          <div className="text-center">
            <h1 className="font-bold text-lg">{time}</h1>
          </div>
          
          <div className="p-2 text-right min-w-[120px]">
             <h1 className="font-bold text-lg">Nikee's Zara</h1>
          </div>
        </div>
      </header>
  );
}
