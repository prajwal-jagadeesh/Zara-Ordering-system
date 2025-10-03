'use client';

import React from 'react';
import { useCart } from '@/components/cart/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, Edit } from 'lucide-react';
import PosHeader from './_components/pos-header';

const MenuItemCard = ({ item }: { item: any }) => {
    const { toggleMenuItemAvailability } = useCart();
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base flex justify-between items-center">
                    {item.name}
                    <Badge variant={item.isAvailable === false ? 'destructive' : 'default'}>
                        {item.isAvailable === false ? 'Unavailable' : 'Available'}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                <p className="font-bold mt-2">₹{item.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
                 <div className="flex items-center space-x-2">
                    <Switch
                        id={`availability-${item.id}`}
                        checked={item.isAvailable !== false}
                        onCheckedChange={() => toggleMenuItemAvailability(item.id)}
                    />
                    <Label htmlFor={`availability-${item.id}`}>{item.isAvailable === false ? 'Make Available' : 'Make Unavailable'}</Label>
                 </div>
                 <div className="flex gap-2">
                    <Button variant="ghost" size="icon" disabled>
                        <Edit className="h-4 w-4" />
                    </Button>
                     <Button variant="ghost" size="icon" disabled>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                 </div>
            </CardFooter>
        </Card>
    );
};

const MenuManagementTab = () => {
    const { menuItems, categories } = useCart();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Menu Items</h2>
                <Button disabled><PlusCircle className="mr-2 h-4 w-4" /> Add New Item</Button>
            </div>
            {categories.map(category => (
                <div key={category}>
                    <h3 className="text-xl font-semibold mb-4">{category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {menuItems.filter(item => item.category === category).map(item => (
                            <MenuItemCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

const TableManagementTab = () => {
    const { tables, addTable, removeTable } = useCart();
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Tables</h2>
                <Button onClick={addTable}><PlusCircle className="mr-2 h-4 w-4" /> Add Table</Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {tables.map(table => (
                    <Card key={table.id} className="flex flex-col items-center justify-center p-4">
                        <CardTitle>Table {table.id}</CardTitle>
                        <Button variant="destructive" size="sm" className="mt-4" onClick={() => removeTable(table.id)}>Remove</Button>
                    </Card>
                ))}
            </div>
        </div>
    );
};


export default function PosPage() {

    return (
        <div className="bg-background min-h-screen">
            <PosHeader />
            <div className="container mx-auto py-8">
                <Tabs defaultValue="menu">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="menu">Menu Management</TabsTrigger>
                        <TabsTrigger value="tables">Table Management</TabsTrigger>
                    </TabsList>
                    <TabsContent value="menu" className="mt-6">
                        <MenuManagementTab />
                    </TabsContent>
                    <TabsContent value="tables" className="mt-6">
                        <TableManagementTab />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

// Dummy badge component for compilation
const Badge = ({ variant, children }: {variant: string, children: React.ReactNode}) => {
    const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold";
    const variants: {[key: string]: string} = {
        default: "border-transparent bg-primary text-primary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
    }
    return <div className={`${baseClasses} ${variants[variant]}`}>{children}</div>
}
