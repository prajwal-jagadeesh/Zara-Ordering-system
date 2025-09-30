'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { MenuItem, MenuCategory } from '@/lib/types';
import { MenuItemCard } from './menu-item-card';

interface MenuDisplayProps {
  menuItems: MenuItem[];
}

export default function MenuDisplay({ menuItems }: MenuDisplayProps) {
  const categories: MenuCategory[] = ['Appetizers', 'Soups', 'Pastas & Spaghetti', 'Breads', 'Curries', 'Rice', 'Drinks', 'Desserts', 'Coffee'];

  return (
    <Tabs defaultValue="Appetizers" className="w-full">
      <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 lg:grid-cols-9 max-w-6xl mx-auto h-auto min-h-12">
        {categories.map(category => (
          <TabsTrigger key={category} value={category} className="text-base h-10">
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
      {categories.map(category => (
        <TabsContent key={category} value={category}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {menuItems
              .filter(item => item.category === category)
              .map(item => (
                <MenuItemCard key={item.id} item={item} />
              ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
