'use client';

import React from 'react';
import { menuData } from '@/lib/menu-data';
import type { MenuItem } from '@/lib/types';
import MenuDisplay from '@/components/menu/menu-display';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { useCart } from '@/components/cart/cart-context';
import Header from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { useSearchParams, useRouter } from 'next/navigation';

async function getMenuItems(): Promise<MenuItem[]> {
    const imageMap = new Map<string, ImagePlaceholder>();
    PlaceHolderImages.forEach(p => imageMap.set(p.id, p));

    return menuData.map(item => {
        const imageId = item.name.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');
        const placeholder = imageMap.get(imageId);
        return {
            ...item,
            imageUrl: placeholder?.imageUrl,
            imageHint: placeholder?.imageHint,
            imageId: imageId,
        };
    });
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = React.useState<MenuItem[]>([]);
  const { totalItems, totalPrice, setIsCartOpen, setTableNumber } = useCart();
  const searchParams = useSearchParams();
  const router = useRouter();

  React.useEffect(() => {
    const table = searchParams.get('table');
    if (table) {
      setTableNumber(table);
    } else {
      router.push('/');
    }
  }, [searchParams, setTableNumber, router]);
  
  React.useEffect(() => {
    getMenuItems().then(setMenuItems);
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <Header />
      <div className="container mx-auto py-4 px-2 sm:px-4 lg:px-6 relative">
        <MenuDisplay menuItems={menuItems} />
      </div>
      
      {totalItems > 0 && (
        <div className="sticky bottom-0 left-0 right-0 bg-background border-t p-3 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
            <div className="container mx-auto flex justify-between items-center">
                <div>
                    <p className="font-bold">{totalItems} Item/s in Cart</p>
                    <p className="text-sm">₹{totalPrice.toFixed(2)}</p>
                </div>
                <Button onClick={() => setIsCartOpen(true)} className="bg-black text-white rounded-md">
                    View Cart &raquo;
                </Button>
            </div>
        </div>
      )}

    </div>
  );
}
