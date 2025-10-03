'use client';

import React from 'react';
import { Settings } from 'lucide-react';
import Link from 'next/link';

export default function PosHeader() {

  return (
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-2 sm:px-4">
          <Link href="/pos" className="p-2 flex items-center gap-2">
            <Settings className="h-6 w-6" />
            <h1 className="font-bold text-lg hidden sm:block">POS Management</h1>
          </Link>
          
          <div className="text-center">
            <h1 className="font-bold text-lg">Nikee's Zara</h1>
          </div>
          
          <div className="p-2 text-right min-w-[120px]">
          </div>
        </div>
      </header>
  );
}
