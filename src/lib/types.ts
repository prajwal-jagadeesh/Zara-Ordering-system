export type MenuCategory = 'Appetizers' | 'Entrees' | 'Desserts';

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
