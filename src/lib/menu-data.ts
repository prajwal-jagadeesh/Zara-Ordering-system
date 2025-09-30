import type { MenuItem } from './types';

export const menuData: Omit<MenuItem, 'imageUrl' | 'imageHint'>[] = [
  // Appetizers
  { id: 1, name: 'Butterfly Paneer Crisps', description: 'Golden-fried paneer, delicately wrapped in a ribbon of potato, offering a delightful crunch. Served with a ketchup dip.', price: 180, category: 'Appetizers', imageId: 'paneer-crisps' },
  { id: 2, name: 'Dragon Fire Baby Corn', description: 'Crispy baby corn pieces wok-tossed in a fiery soy-chilli garlic sauce, loaded with spring onions and sprinkled with toasted sesame seeds.', price: 170, category: 'Appetizers', imageId: 'baby-corn' },
  { id: 3, name: 'Pepper BabyCorn Crunch', description: 'Baby corn coated in cracked black pepper, garlic, and fragrant curry leaves for a savory bite.', price: 150, category: 'Appetizers', imageId: 'pepper-baby-corn' },
  { id: 4, name: 'Vietnamese Garden Rolls', description: 'Fresh rice paper rolls with carrot, bell peppers, and lettuce. Served with a sweet-chilli peanut dip.', price: 180, category: 'Appetizers', imageId: 'garden-rolls' },
  { id: 5, name: 'Garlic Chilli Potato Bites', description: 'Crispy potato fingers wok-tossed in a rich garlic–soy glaze with a fiery chilly kick.', price: 150, category: 'Appetizers', imageId: 'potato-bites' },
  { id: 6, name: 'Honey Blaze Potatoes', description: 'Double-fried potatoes coated in a sweet and spicy honey–chilli glaze with sesame seeds.', price: 170, category: 'Appetizers', imageId: 'honey-potatoes' },
  { id: 7, name: 'Street-Style Veg Tacos', description: 'Crisp taco shells bursting with spiced Vegetables, crisp lettuce, fresh salsa, and creamy mayo.', price: 180, category: 'Appetizers', imageId: 'veg-tacos' },
  { id: 8, name: 'Steamed Veg Dim Sums', description: 'Delicate dumplings filled with babycorn, cheese, and onions. Served with a soy–chilli dip.', price: 180, category: 'Appetizers', imageId: 'dim-sum' },
  { id: 9, name: 'Peri Peri Fries', description: 'Golden fries tossed with a bold peri peri spice mix and served with a side of mayo.', price: 110, category: 'Appetizers', imageId: 'peri-peri-fries' },
  { id: 10, name: 'Classic Fries', description: 'Crispy, salted fries served with ketchup.', price: 90, category: 'Appetizers', imageId: 'classic-fries' },
  { id: 11, name: 'Pani Puri Shots 2.0', description: 'Mini crispy puris filled with spiced potato, served with vibrant mint–coriander and tangy tamarind waters in test tubes.', price: 80, category: 'Appetizers', imageId: 'pani-puri' },
  
  // Soups
  { id: 12, name: 'Rustic Manchow', description: 'A hearty Indo-Chinese broth with garlic, ginger, and soy, topped with crunchy fried noodles.', price: 100, category: 'Soups', imageId: 'manchow-soup' },
  { id: 13, name: 'Hot & Sour Harmony', description: 'A perfectly balanced, tangy broth with soy, vinegar, pepper, and finely diced vegetables.', price: 90, category: 'Soups', imageId: 'hot-sour-soup' },
  { id: 14, name: 'Crystal Clear Herb Soup', description: 'A light, fragrant ginger–garlic broth with fresh coriander and spring onions.', price: 80, category: 'Soups', imageId: 'herb-soup' },
  
  // Pastas & Spaghetti
  { id: 15, name: 'Creamy Alfredo Elegance', description: 'Penne pasta tossed in a rich white sauce with garlic, oregano, and Cheese.', price: 140, category: 'Pastas & Spaghetti', imageId: 'alfredo-pasta' },
  { id: 16, name: 'Aglio e Olio Spaghetti', description: 'A timeless Italian classic with fresh garlic, and chilli flakes.', price: 180, category: 'Pastas & Spaghetti', imageId: 'aglio-e-olio' },
  { id: 17, name: 'Classic Red Sauce Spaghetti', description: 'Our laid-back, saucy spaghetti slathered in a rich, tangy tomato-red sauce with hints of garlic and herbs.', price: 200, category: 'Pastas & Spaghetti', imageId: 'red-sauce-spaghetti' },
  
  // Breads
  { id: 18, name: 'Classic Tandoori Roti', description: 'Whole wheat tandoor flatbread.', price: 30, category: 'Breads', imageId: 'tandoori-roti' },
  { id: 19, name: 'Butter Roti', description: 'Tandoori roti brushed with rich butter.', price: 40, category: 'Breads', imageId: 'butter-roti' },
  { id: 20, name: 'Kulcha Traditionale', description: 'Soft, fluffy tandoor-baked kulcha.', price: 40, category: 'Breads', imageId: 'kulcha' },
  { id: 21, name: 'Butter Velvet Kulcha', description: 'Warm kulcha with a generous coat of butter.', price: 50, category: 'Breads', imageId: 'butter-kulcha' },
  
  // Curries
  { id: 22, name: 'Dal Makhani Luxe', description: 'A rich and creamy black lentil dal, slow-simmered with butter, cream, and aromatic spices for a luxurious finish.', price: 150, category: 'Curries', imageId: 'dal-makhani' },
  { id: 23, name: 'Tandoori Tadka Dal', description: 'Yellow moong dal with a smoky tempering of cumin and garlic in ghee.', price: 130, category: 'Curries', imageId: 'tadka-dal' },
  { id: 24, name: 'Homestyle Plain Dal', description: 'A simple, comforting yellow dal simmered with turmeric and fresh coriander seasoning.', price: 110, category: 'Curries', imageId: 'plain-dal' },
  { id: 25, name: 'Kolhapuri Zest Curry', description: 'A fiery Maharashtrian curry with roasted coconut, red chillies, and bold masala.', price: 180, category: 'Curries', imageId: 'kolhapuri-curry' },
  { id: 26, name: 'Kadai Veg Masala', description: 'Veggies tossed with bell peppers, onions, and aromatic kadai spices.', price: 180, category: 'Curries', imageId: 'kadai-veg' },
  { id: 27, name: 'Paneer Butter Masala', description: 'Paneer simmered in a velvety tomato–cashew gravy, finished with kasuri methi for a truly royal experience.', price: 200, category: 'Curries', imageId: 'paneer-butter-masala' },
  { id: 28, name: 'Seasonal Veg Mélange', description: 'Garden-fresh vegetables in a perfectly spiced onion–tomato gravy.', price: 180, category: 'Curries', imageId: 'seasonal-veg' },

  // Rice
  { id: 29, name: 'Royal Veg Biryani', description: 'Aromatic vegetable biryani with saffron and whole garam masala.', price: 170, category: 'Rice', imageId: 'veg-biryani' },
  { id: 30, name: 'Golden Ghee Rice', description: 'Basmati rice cooked with fragrant ghee, cloves, and cardamom.', price: 140, category: 'Rice', imageId: 'ghee-rice' },
  { id: 31, name: 'Jeera Essence Rice', description: 'Steamed rice with a light tempering of cumin and ghee.', price: 130, category: 'Rice', imageId: 'jeera-rice' },
  { id: 32, name: 'Curd Rice Bliss', description: 'A classic South Indian comfort with a tempering of curry leaves and ginger.', price: 80, category: 'Rice', imageId: 'curd-rice' },

  // Drinks
  { id: 33, name: 'Smoked Troasian Elixir', description: 'A tropical fruit mocktail with Strawberry Syrup, lime and herbs, finished with a hint of smoky flavor.', price: 200, category: 'Drinks', imageId: 'smoked-elixir' },
  { id: 34, name: 'End of Summer Cooler', description: 'A refreshing blend of citrus, blueberry syrup and fresh mint.', price: 160, category: 'Drinks', imageId: 'summer-cooler' },
  { id: 35, name: 'Spicy Guava Kick', description: 'Fresh guava juice with a zesty chilli–salt rim and a touch of pepper.', price: 120, category: 'Drinks', imageId: 'guava-kick' },
  { id: 36, name: 'Vietnamese Iced Coffee', description: 'Slow-drip iced coffee with sweetened condensed milk.', price: 100, category: 'Drinks', imageId: 'vietnamese-coffee' },
  { id: 37, name: 'Classic Cold Coffee', description: 'A smooth, frothy frappe with a dusting of cocoa.', price: 150, category: 'Drinks', imageId: 'cold-coffee' },
  { id: 38, name: 'Hazelnut Boba Bliss', description: 'Hazelnut coffee with chewy tapioca pearls.', price: 160, category: 'Drinks', imageId: 'hazelnut-boba' },
  { id: 39, name: 'Raw Mango Mojito', description: 'Tangy raw mango with fresh mint, soda, and lime.', price: 180, category: 'Drinks', imageId: 'mango-mojito' },
  { id: 40, name: 'Water (1 L)', description: 'Stay hydrated with pure, fresh Bisleri Himalayan spring water.', price: 20, category: 'Drinks', imageId: 'water-bottle' },

  // Desserts
  { id: 41, name: 'Mimi Doce', description: 'Our signature fusion dessert inspired by Mysore Pak—rich, melt-in-the-mouth traditional South Indian fudge.', price: 130, category: 'Desserts', imageId: 'mimi-doce' },
  { id: 42, name: 'Affogato', description: 'Bold espresso poured over creamy vanilla ice cream—an unbeatable sweet caffeine fix.', price: 150, category: 'Desserts', imageId: 'affogato' },
  
  // Coffee
  { id: 43, name: 'Regular Coffee', description: 'Light, fresh filter coffee—simple and satisfying.', price: 25, category: 'Coffee', imageId: 'regular-coffee' },
  { id: 44, name: 'Large Coffee', description: 'A fuller cup for those who want extra comfort.', price: 40, category: 'Coffee', imageId: 'large-coffee' }
];
