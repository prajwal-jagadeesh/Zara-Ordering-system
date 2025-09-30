import { menuData } from '@/lib/menu-data';
import type { MenuItem } from '@/lib/types';
import MenuDisplay from '@/components/menu/menu-display';

async function getMenuItems(): Promise<MenuItem[]> {
  return menuData.map(item => {
    return {
      ...item,
    };
  });
}

export default async function MenuPage() {
  const menuItems = await getMenuItems();

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Our Menu</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Discover a world of flavors, crafted with the freshest ingredients.
        </p>
      </div>
      <MenuDisplay menuItems={menuItems} />
    </div>
  );
}
