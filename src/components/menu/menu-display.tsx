'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { MenuItem, MenuCategory } from '@/lib/types';
import { MenuItemCard } from './menu-item-card';

interface MenuDisplayProps {
  menuItems: MenuItem[];
}

export default function MenuDisplay({ menuItems }: MenuDisplayProps) {
  const categories: MenuCategory[] = ['Appetizers', 'Soulful Soups', 'Pastas & Spaghetti', 'Artisan Breads', 'Signature Curries', 'Heritage Rice Bowls', 'sip sesh', 'Sweets Endings', 'Coffee Clasics'];
  const firstRowCategories = categories.slice(0, 5);
  const secondRowCategories = categories.slice(5);

  return (
    <Tabs defaultValue="Appetizers" className="w-full">
      <div className="flex flex-col items-center">
        <TabsList className="h-auto mb-2">
          {firstRowCategories.map(category => (
            <TabsTrigger key={category} value={category} className="text-base h-10">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsList className="h-auto">
          {secondRowCategories.map(category => (
            <TabsTrigger key={category} value={category} className="text-base h-10">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
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
