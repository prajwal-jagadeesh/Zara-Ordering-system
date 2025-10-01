'use client';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { MenuItem, MenuCategory } from '@/lib/types';
import { MenuItemCard } from './menu-item-card';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';


interface MenuDisplayProps {
  menuItems: MenuItem[];
}

export default function MenuDisplay({ menuItems }: MenuDisplayProps) {
  const allCategories: MenuCategory[] = [
    'Appetizers', 'Soulful Soups', 'Pastas & Spaghetti', 
    'Artisan Breads', 'Signature Curries', 'Heritage Rice Bowls',
    'sip sesh', 'Sweets Endings', 'Coffee Clasics', 'Platters',
    'Yakisoba', 'Yakimeshi'
  ];
  
  const itemsByCategory = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<MenuCategory, MenuItem[]>);
  
  const availableCategories = allCategories.filter(category => itemsByCategory[category]);
  const [activeCategory, setActiveCategory] = useState<MenuCategory>(availableCategories[0] || 'Appetizers');
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const category = entry.target.id.replace(/-/g, ' ').replace(/&/g, 'and') as MenuCategory;
            setActiveCategory(category);
          }
        });
      },
      {
        rootMargin: '-120px 0px -75% 0px',
        threshold: 0,
      }
    );
  
    const refs = Object.values(categoryRefs.current);
    refs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
  
    return () => {
      refs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [categoryRefs, availableCategories]);
  

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
                        setActiveCategory(category);
                        const element = document.getElementById(categoryId);
                        if(element) {
                            const yOffset = -120; 
                            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                            window.scrollTo({top: y, behavior: 'smooth'});
                        }
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
                          <MenuItemCard key={item.id} item={item} />
                      ))}
                  </div>
              </div>
            )
        })}
      </div>
    </div>
  );
}