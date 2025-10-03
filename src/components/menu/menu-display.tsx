'use client';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { MenuItem, MenuCategory } from '@/lib/types';
import { MenuItemCard } from './menu-item-card';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useCart } from '@/components/cart/cart-context';


interface MenuDisplayProps {
  menuItems: MenuItem[];
  isOrderingDisabled: boolean;
}

export default function MenuDisplay({ menuItems, isOrderingDisabled }: MenuDisplayProps) {
  const { categories } = useCart();
  
  const itemsByCategory = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<MenuCategory, MenuItem[]>);
  
  const availableCategories = categories.filter(category => itemsByCategory[category]);
  const [activeCategory, setActiveCategory] = useState<MenuCategory>(availableCategories[0] || 'Appetizers');
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const handleScroll = () => {
      const yOffset = -130; // Account for sticky header
      const scrollPosition = window.scrollY - yOffset;
      
      let currentCategory: MenuCategory | null = null;
      
      for (const category of availableCategories) {
        const categoryId = category.replace(/ /g, '-').replace(/&/g, 'and');
        const element = categoryRefs.current[categoryId];
        if (element) {
          if (element.offsetTop <= scrollPosition) {
            currentCategory = category;
          } else {
            break;
          }
        }
      }
      
      if (currentCategory && currentCategory !== activeCategory) {
        setActiveCategory(currentCategory);
      } else if (!currentCategory && availableCategories.length > 0) {
        // If nothing is matched (i.e. at the very top), default to first category
        setActiveCategory(availableCategories[0]);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [availableCategories, activeCategory]);
  

  return (
    <div className="w-full">
        <div className="sticky top-[65px] bg-background z-10 py-4">
            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex space-x-4 pb-2">
                {availableCategories.map(category => {
                  const categoryId = category.replace(/ /g, '-').replace(/&/g, 'and');
                  return (
                    <Link
                      key={category}
                      href={`#${categoryId}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById(categoryId);
                        if(element) {
                            const yOffset = -120; 
                            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                            window.scrollTo({top: y, behavior: 'smooth'});
                        }
                        // Manually set for instant feedback
                        setActiveCategory(category);
                      }}
                      className={cn(
                          "flex flex-col items-center space-y-1 flex-shrink-0 px-4 py-2 rounded-full",
                          activeCategory === category ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}
                    >
                      <span className="text-sm font-medium whitespace-normal text-center">{category}</span>
                    </Link>
                  )
                })}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>

      <div className="mt-4">
        {availableCategories.map(category => {
            const categoryId = category.replace(/ /g, '-').replace(/&/g, 'and');
            return (
              <div 
                key={category} 
                id={categoryId}
                ref={el => categoryRefs.current[categoryId] = el}
                className="scroll-mt-32 pt-8">
                  <h2 className="font-bold text-2xl my-6">{category}</h2>
                  <div className="flex flex-col gap-6">
                      {itemsByCategory[category].map(item => (
                          <MenuItemCard key={item.id} item={item} isOrderingDisabled={isOrderingDisabled} />
                      ))}
                  </div>
              </div>
            )
        })}
      </div>
    </div>
  );
}
