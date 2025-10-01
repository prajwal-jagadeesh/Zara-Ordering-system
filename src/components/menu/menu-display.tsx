'use client';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { MenuItem, MenuCategory } from '@/lib/types';
import { MenuItemCard } from './menu-item-card';
import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';


interface MenuDisplayProps {
  menuItems: MenuItem[];
}

const CategoryImage = ({ category, imageUrl }: { category: MenuCategory, imageUrl?: string }) => {
    if (!imageUrl) return <div className="w-20 h-20 bg-muted rounded-md" />;

    return (
         <Image src={imageUrl} alt={category} width={80} height={80} className="w-20 h-20 object-cover rounded-md" />
    )
}

const categoryImages: Partial<Record<MenuCategory, string>> = {
  'Appetizers': 'https://picsum.photos/seed/appetizers-cat/80/80',
  'Platters': 'https://picsum.photos/seed/platters-cat/80/80',
  'Entree Dishes': 'https://picsum.photos/seed/entree-cat/80/80',
};


export default function MenuDisplay({ menuItems }: MenuDisplayProps) {
  const allCategories: MenuCategory[] = [
    'Appetizers', 'Soulful Soups', 'Pastas & Spaghetti', 
    'Artisan Breads', 'Signature Curries', 'Heritage Rice Bowls',
    'sip sesh', 'Sweets Endings', 'Coffee Clasics', 'Platters',
    'Yakisoba', 'Yakimeshi'
  ];
  
  const itemsByCategory = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<MenuCategory, MenuItem[]>);
  
  const availableCategories = allCategories.filter(category => itemsByCategory[category]);
  const [activeCategory, setActiveCategory] = useState<MenuCategory>(availableCategories[0] || 'Appetizers');
  
  const handleCategoryClick = (category: MenuCategory) => {
    setActiveCategory(category);
    const element = document.getElementById(category.replace(/ /g, '-'));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full">
        <div className="sticky top-[65px] bg-background z-10 py-4">
            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex space-x-4 pb-2">
                {availableCategories.map(category => (
                    <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={cn(
                        "flex flex-col items-center space-y-2 flex-shrink-0 w-24",
                        activeCategory === category ? "border-b-2 border-primary" : ""
                    )}
                    >
                    <div className="w-20 h-20 rounded-md bg-muted overflow-hidden">
                       <CategoryImage category={category} imageUrl={categoryImages[category]} />
                    </div>
                    <span className="text-xs font-medium whitespace-normal text-center w-full">{category}</span>
                    </button>
                ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>

      <div className="mt-4">
        {availableCategories.map(category => (
            <div key={category} id={category.replace(/ /g, '-')}>
                <h2 className="font-bold text-2xl my-6">{category}</h2>
                <div className="flex flex-col gap-4">
                    {itemsByCategory[category].map(item => (
                        <MenuItemCard key={item.id} item={item} />
                    ))}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}
