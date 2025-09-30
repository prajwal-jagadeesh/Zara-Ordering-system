export type MenuCategory = 'Appetizers' | 'Soulful Soups' | 'Pastas & Spaghetti' | 'Artisan Breads' | 'Signature Curries' | 'Heritage Rice Bowls' | 'sip sesh' | 'Sweets Endings' | 'Coffee Clasics';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
}

export interface CartItem extends MenuItem {
  quantity: number;
}
