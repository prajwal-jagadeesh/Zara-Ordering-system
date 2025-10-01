export type MenuCategory = 'Platters' | 'Appetizers' | 'Entree Dishes' | 'Yakisoba' | 'Yakimeshi' | 'Soulful Soups' | 'Pastas & Spaghetti' | 'Artisan Breads' | 'Signature Curries' | 'Heritage Rice Bowls' | 'sip sesh' | 'Sweets Endings' | 'Coffee Clasics';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  imageUrl?: string;
  imageHint?: string;
  imageId?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  tableId: string;
  items: CartItem[];
  status: 'pending' | 'confirmed';
  orderTime: Date;
}
