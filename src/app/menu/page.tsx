'use client';

import React, { useState, useEffect } from 'react';
import type { MenuItem } from '@/lib/types';
import MenuDisplay from '@/components/menu/menu-display';
import { useCart } from '@/components/cart/cart-context';
import Header from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { useSearchParams, useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MapPin, Loader2 } from 'lucide-react';

// Haversine formula to calculate distance between two lat/lng points
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // in metres
}

const MAX_DISTANCE_METERS = 100; // Max distance in meters to allow ordering

export default function MenuPage() {
  const { cartItems, orders, tableNumber, setIsCartOpen, setTableNumber, menuItems, restaurantLocation } = useCart();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [locationStatus, setLocationStatus] = useState<'checking' | 'allowed' | 'denied' | 'outside' | 'no_settings'>('checking');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    const table = searchParams.get('table');
    if (table) {
      setTableNumber(table);
    } else if (isClient) {
      router.push('/');
    }
  }, [searchParams, setTableNumber, router, isClient]);

  useEffect(() => {
    if (!isClient) return;

    if (!restaurantLocation) {
        setLocationStatus('no_settings');
        return;
    }

    if (!navigator.geolocation) {
      setLocationStatus('denied');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const distance = getDistance(
          position.coords.latitude,
          position.coords.longitude,
          restaurantLocation.latitude,
          restaurantLocation.longitude
        );
        
        if (distance <= MAX_DISTANCE_METERS) {
          setLocationStatus('allowed');
        } else {
          setLocationStatus('outside');
        }
      },
      () => {
        setLocationStatus('denied');
      },
      { enableHighAccuracy: true }
    );
  }, [isClient, restaurantLocation]);
  
  const availableMenuItems = menuItems.filter(item => item.isAvailable !== false);
  const currentOrder = orders.find(o => o.tableId === tableNumber);
  
  const totalItemsInCart = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalItemsInOrder = (currentOrder ? [
      ...(currentOrder.pendingItems || []),
      ...(currentOrder.confirmedItems || []),
      ...(currentOrder.readyItems || []),
      ...(currentOrder.servedItems || [])
    ] : []).reduce((acc, item) => acc + item.quantity, 0);

  const combinedTotalItems = totalItemsInCart + totalItemsInOrder;
  
  const totalCartPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalOrderPrice = (currentOrder ? [
      ...(currentOrder.pendingItems || []),
      ...(currentOrder.confirmedItems || []),
      ...(currentOrder.readyItems || []),
      ...(currentOrder.servedItems || [])
    ] : []).reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  const combinedPrice = totalCartPrice + totalOrderPrice;

  const isOrderingDisabled = locationStatus !== 'allowed';

  if (!isClient) {
     return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
     )
  }

  return (
    <div className="bg-background min-h-screen">
      <Header />
      <div className="container mx-auto py-4 px-2 sm:px-4 lg:px-6 relative">
        
        {locationStatus === 'checking' && (
          <div className="flex flex-col items-center justify-center text-center p-10 my-10 border rounded-lg bg-muted/50">
            <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
            <p className="font-semibold">Verifying your location...</p>
            <p className="text-sm text-muted-foreground">Please wait while we confirm you are at the restaurant.</p>
          </div>
        )}
        
        {locationStatus !== 'checking' && (
          <>
            {isOrderingDisabled && (
              <Alert variant="destructive" className="mb-4">
                <MapPin className="h-4 w-4" />
                <AlertTitle>Ordering Disabled</AlertTitle>
                <AlertDescription>
                  {locationStatus === 'denied' && "Please enable location services in your browser settings to place an order."}
                  {locationStatus === 'outside' && "You must be at the restaurant to place an order."}
                  {locationStatus === 'no_settings' && "Ordering is temporarily disabled. Please contact staff."}
                </AlertDescription>
              </Alert>
            )}
            <MenuDisplay menuItems={availableMenuItems} isOrderingDisabled={isOrderingDisabled} />
          </>
        )}

      </div>
      
      {combinedTotalItems > 0 && (
        <div className="sticky bottom-0 left-0 right-0 bg-background border-t p-3 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
            <div className="container mx-auto flex justify-between items-center">
                <div>
                    <p className="font-bold">{combinedTotalItems} Item/s in Order</p>
                    <p className="text-sm">₹{combinedPrice.toFixed(2)}</p>
                </div>
                <Button onClick={() => setIsCartOpen(true)} className="bg-black text-white rounded-md">
                    View Order &raquo;
                </Button>
            </div>
        </div>
      )}

    </div>
  );
}
