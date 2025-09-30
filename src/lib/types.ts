export type MenuCategory = 'Appetizers' | 'Soups' | 'Pastas & Spaghetti' | 'Breads' | 'Curries' | 'Rice' | 'Drinks' | 'Desserts' | 'Coffee';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  imageId: string;
  imageUrl: string;
  imageHint: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}
