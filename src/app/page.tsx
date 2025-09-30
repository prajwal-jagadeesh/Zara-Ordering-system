'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import Image from 'next/image';

export default function Home() {

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-black">
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm mx-auto text-center">
          <div className="bg-black text-white p-8 mb-8 inline-block">
            <h1 className="text-5xl font-serif font-bold tracking-wider">YŪGŌ</h1>
            <p className="text-xl tracking-[0.4em]">SUSHI</p>
          </div>

          <div className="relative h-48 mb-8">
            <Image
              src="https://static.wixstatic.com/media/d4ea53_58433db7f6e243708ccd8cfa60a15a74~mv2.png/v1/fill/w_490,h_558,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/smartphone-showing-a-scan-menu-of-restuarant.png"
              alt="Artistic background of a woman with feathers"
              width={490}
              height={558}
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>

          <div className="space-y-3">
            <Button asChild size="lg" className="w-full h-12 bg-black text-white hover:bg-gray-800 text-base">
              <Link href="/menu">I want a Pickup</Link>
            </Button>
            <Button asChild size="lg" className="w-full h-12 bg-black text-white hover:bg-gray-800 text-base">
              <Link href="/menu">I want a Delivery</Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="w-full py-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-6">
            <Link href="#" className="text-black hover:text-gray-600">
              <Facebook className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-black hover:text-gray-600">
              <Twitter className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-black hover:text-gray-600">
              <Instagram className="h-6 w-6" />
            </Link>
          </div>
          <p className="text-sm text-gray-500">&copy; 2024 Yūgō</p>
        </div>
      </footer>
    </div>
  );
}
