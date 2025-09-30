import type { MenuItem } from './types';

export const menuData: Omit<MenuItem, 'imageUrl' | 'imageHint' | 'imageId'>[] = [
    // Appetizers
    { id: 101, name: 'Butterfly Paneer CrispS', description: 'Golden-fried paneer, delicately wrapped in a ribbon of potato, offering a delightful crunch. Served with a ketchup dip.', price: 180, category: 'Appetizers' },
    { id: 102, name: 'Dragon Fire Baby Corn', description: 'Crispy baby corn pieces wok-tossed in a fiery soy-chilli garlic sauce, loaded with spring onions and sprinkled with toasted sesame seeds.', price: 170, category: 'Appetizers' },
    { id: 103, name: 'Pepper BabyCorn Crunch', description: 'Baby corn coated in cracked black pepper, garlic, and fragrant curry leaves for a savory bite.', price: 150, category: 'Appetizers' },
    { id: 104, name: 'Vietnamese Garden Rolls', description: 'Fresh rice paper rolls with carrot, bell peppers, and lettuce. Served with a sweet-chilli peanut dip.', price: 180, category: 'Appetizers' },
    { id: 105, name: 'Garlic Chilli Potato Bites', description: 'Crispy potato fingers wok-tossed in a rich garlic–soy glaze with a fiery chilly kick.', price: 150, category: 'Appetizers' },
    { id: 106, name: 'Honey Blaze Potatoes', description: 'Double-fried potatoes coated in a sweet and spicy honey–chilli glaze with sesame seeds.', price: 170, category: 'Appetizers' },
    { id: 107, name: 'Street-Style Veg Tacos', description: 'Crisp taco shells bursting with spiced Vegetables, crisp lettuce, fresh salsa, and creamy mayo.', price: 180, category: 'Appetizers' },
    { id: 108, name: 'Steamed Veg Dim Sums', description: 'Delicate dumplings filled with babycorn, cheese, and onions. Served with a soy–chilli dip.', price: 180, category: 'Appetizers' },
    { id: 109, name: 'Peri Peri Fries', description: 'Golden fries tossed with a bold peri peri spice mix and served with a side of mayo.', price: 110, category: 'Appetizers' },
    { id: 110, name: 'Classic Fries', description: 'Crispy, salted fries served with ketchup.', price: 90, category: 'Appetizers' },
    { id: 111, name: 'Pani Puri Shots 2.0', description: 'A modern twist on a classic. Mini crispy puris filled with spiced potato, served with vibrant mint–coriander and tangy tamarind waters in dramatic test tubes for a fun, hands-on twist on the street classic.', price: 80, category: 'Appetizers' },

    // Soulful Soups
    { id: 201, name: 'Rustic Manchow', description: 'A hearty Indo-Chinese broth with garlic, ginger, and soy, topped with crunchy fried noodles.', price: 100, category: 'Soulful Soups' },
    { id: 202, name: 'Hot & Sour Harmony', description: 'A perfectly balanced, tangy broth with soy, vinegar, pepper, and finely diced vegetables.', price: 90, category: 'Soulful Soups' },
    { id: 203, name: 'Crystal Clear Herb Soup', description: 'A light, fragrant ginger–garlic broth with fresh coriander and spring onions.', price: 80, category: 'Soulful Soups' },

    // Pastas & Spaghetti
    { id: 301, name: 'Creamy Alfredo Elegance', description: 'Penne pasta tossed in a rich white sauce with garlic, oregano, and Cheese.', price: 140, category: 'Pastas & Spaghetti' },
    { id: 302, name: 'Aglio e Olio Spaghetti', description: 'A timeless Italian classic with fresh garlic, and chilli flakes.', price: 180, category: 'Pastas & Spaghetti' },
    { id: 303, name: 'Classic Red Sauce Spaghetti', description: 'Our laid-back, saucy spaghetti slathered in a rich, tangy tomato-red sauce with hints of garlic and herbs.', price: 200, category: 'Pastas & Spaghetti' },

    // Artisan Breads
    { id: 401, name: 'Classic Tandoori Roti', description: 'Whole wheat tandoor flatbread.', price: 30, category: 'Artisan Breads' },
    { id: 402, name: 'Butter Roti', description: 'Tandoori roti brushed with rich butter.', price: 40, category: 'Artisan Breads' },
    { id: 403, name: 'Kulcha Traditionale', description: 'Soft, fluffy tandoor-baked kulcha.', price: 40, category: 'Artisan Breads' },
    { id: 404, name: 'Butter Velvet Kulcha', description: 'Warm kulcha with a generous coat of butter.', price: 50, category: 'Artisan Breads' },

    // Signature Curries
    { id: 501, name: 'Dal Makhani Luxe', description: 'A rich and creamy black lentil dal, slow-simmered with butter, cream, and aromatic spices for a luxurious finish.', price: 150, category: 'Signature Curries' },
    { id: 502, name: 'Tandoori Tadka Dal', description: 'Yellow moong dal with a smoky tempering of cumin and garlic in ghee.', price: 130, category: 'Signature Curries' },
    { id: 503, name: 'Homestyle Plain Dal', description: 'A simple, comforting yellow dal simmered with turmeric and fresh coriander seasoning.', price: 110, category: 'Signature Curries' },
    { id: 504, name: 'Kolhapuri Zest Curry', description: 'A fiery Maharashtrian curry with roasted coconut, red chillies, and bold masala.', price: 180, category: 'Signature Curries' },
    { id: 505, name: 'Kadai Veg Masala', description: 'Veggies tossed with bell peppers, onions, and aromatic kadai spices.', price: 180, category: 'Signature Curries' },
    { id: 506, name: 'Paneer Butter Masala', description: 'Our house specialty! Paneer simmered in a velvety tomato–cashew gravy, finished with kasuri methi for a truly royal experience.', price: 200, category: 'Signature Curries' },
    { id: 507, name: 'Seasonal Veg Mélange', description: 'Garden-fresh vegetables in a perfectly spiced onion–tomato gravy.', price: 180, category: 'Signature Curries' },

    // Heritage Rice Bowls
    { id: 601, name: 'Royal Veg Biryani', description: 'Aromatic vegetable biryani with saffron and whole garam masala.', price: 170, category: 'Heritage Rice Bowls' },
    { id: 602, name: 'Golden Ghee Rice', description: 'Basmati rice cooked with fragrant ghee, cloves, and cardamom.', price: 140, category: 'Heritage Rice Bowls' },
    { id: 603, name: 'Jeera Essence Rice', description: 'Steamed rice with a light tempering of cumin and ghee.', price: 130, category: 'Heritage Rice Bowls' },
    { id: 604, name: 'Curd Rice Bliss', description: 'A classic South Indian comfort with a tempering of curry leaves and ginger.', price: 80, category: 'Heritage Rice Bowls' },

    // sip sesh
    { id: 701, name: 'Smoked Troasian Elixir', description: 'A tropical fruit mocktail with Strawberry Syrup, lime and herbs, finished with a hint of smoky flavor.', price: 200, category: 'sip sesh' },
    { id: 702, name: 'End of Summer Cooler', description: 'A refreshing blend of citrus, blueberry syrup and fresh mint.', price: 160, category: 'sip sesh' },
    { id: 703, name: 'Spicy Guava Kick', description: 'Fresh guava juice with a zesty chilli–salt rim and a touch of pepper.', price: 120, category: 'sip sesh' },
    { id: 704, name: 'Vietnamese Iced Coffee', description: 'Slow-drip iced coffee with sweetened condensed milk.', price: 100, category: 'sip sesh' },
    { id: 705, name: 'Classic Cold Coffee', description: 'A smooth, frothy frappe with a dusting of cocoa.', price: 150, category: 'sip sesh' },
    { id: 706, name: 'Hazelnut Boba Bliss', description: 'Hazelnut coffee with chewy tapioca pearls.', price: 160, category: 'sip sesh' },
    { id: 707, name: 'Raw Mango Mojito', description: 'Tangy raw mango with fresh mint, soda, and lime.', price: 180, category: 'sip sesh' },
    { id: 708, name: 'Water (1 L)', description: 'Stay hydrated with pure, fresh Bisleri Himalayan spring water.', price: 20, category: 'sip sesh' },

    // Sweets Endings
    { id: 801, name: 'Mimi Doce', description: 'Our signature fusion dessert inspired by Mysore Pak—rich, melt-in-the-mouth traditional South Indian fudge', price: 130, category: 'Sweets Endings' },
    { id: 802, name: 'Affogato', description: 'Bold espresso poured over creamy vanilla ice cream—an unbeatable sweet caffeine fix.', price: 150, category: 'Sweets Endings' },

    // Coffee Clasics
    { id: 901, name: 'Regular Coffee', description: 'Light, fresh filter coffee—simple and satisfying.', price: 25, category: 'Coffee Clasics' },
    { id: 902, name: 'Large Coffee', description: 'A fuller cup for those who want extra comfort.', price: 40, category: 'Coffee Clasics' },
];
