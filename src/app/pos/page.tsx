'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/components/cart/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { PlusCircle, Trash2, Edit, MoreVertical, Utensils, Loader2, Table as TableIcon, List, LayoutDashboard } from 'lucide-react';
import PosHeader from './_components/pos-header';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { MenuItem } from '@/lib/types';
import { MenuItemForm } from './_components/menu-item-form';
import { DeleteConfirmationDialog } from './_components/delete-confirmation-dialog';
import { cn } from '@/lib/utils';


const MenuItemRow = ({ item, onEdit, onDelete }: { item: MenuItem, onEdit: () => void, onDelete: () => void }) => {
    const { toggleMenuItemAvailability } = useCart();
    return (
        <TableRow>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell>₹{item.price.toFixed(2)}</TableCell>
            <TableCell>
                <Badge variant={item.isAvailable === false ? 'outline' : 'default'}>
                    {item.isAvailable === false ? 'Unavailable' : 'Available'}
                </Badge>
            </TableCell>
            <TableCell>
                <Switch
                    checked={item.isAvailable !== false}
                    onCheckedChange={() => toggleMenuItemAvailability(item.id)}
                    aria-label={`Toggle availability for ${item.name}`}
                />
            </TableCell>
            <TableCell className="text-right">
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={onEdit}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onDelete} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
};

const MenuManagementTab = () => {
    const { menuItems, categories: allCategories, removeMenuItem } = useCart();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

    const handleOpenForm = (item: MenuItem | null) => {
        setSelectedItem(item);
        setIsFormOpen(true);
    };

    const handleOpenDeleteAlert = (item: MenuItem) => {
        setSelectedItem(item);
        setIsDeleteAlertOpen(true);
    };
    
    const handleConfirmDelete = () => {
        if(selectedItem) {
            removeMenuItem(selectedItem.id);
        }
        setIsDeleteAlertOpen(false);
        setSelectedItem(null);
    }
    
    const categoriesInUse = allCategories.filter(category => menuItems.some(item => item.category === category));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Menu Items</h2>
                <Button onClick={() => handleOpenForm(null)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Item
                </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Toggle Availability</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                     <TableBody>
                        {categoriesInUse.length > 0 ? (
                            categoriesInUse.map(category => (
                                <React.Fragment key={category}>
                                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                                        <TableCell colSpan={5} className="font-bold text-primary">
                                            {category}
                                        </TableCell>
                                    </TableRow>
                                    {menuItems.filter(item => item.category === category).map(item => (
                                        <MenuItemRow 
                                            key={item.id} 
                                            item={item} 
                                            onEdit={() => handleOpenForm(item)}
                                            onDelete={() => handleOpenDeleteAlert(item)}
                                        />
                                    ))}
                                </React.Fragment>
                            ))
                        ) : (
                             <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    No menu items found. Add one to get started.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            
            <MenuItemForm 
                isOpen={isFormOpen} 
                setIsOpen={setIsFormOpen}
                item={selectedItem}
            />
            
            <DeleteConfirmationDialog
                isOpen={isDeleteAlertOpen}
                setIsOpen={setIsDeleteAlertOpen}
                onConfirm={handleConfirmDelete}
                itemName={selectedItem?.name || ''}
            />

        </div>
    );
};

const TableManagementTab = () => {
    const { tables, addTable, removeTable, orders } = useCart();
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Tables</h2>
                <Button onClick={addTable}><PlusCircle className="mr-2 h-4 w-4" /> Add Table</Button>
            </div>
             <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d1d5db' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {tables.map(table => {
                        const order = orders.find(o => o.tableId === table.id);
                        const isOccupied = !!order;
                        const totalItems = isOccupied ? [
                            ...(order.pendingItems || []),
                            ...(order.confirmedItems || []),
                            ...(order.readyItems || []),
                            ...(order.servedItems || [])
                        ].reduce((acc, item) => acc + item.quantity, 0) : 0;
                        const totalPrice = isOccupied ? [
                            ...(order.pendingItems || []),
                            ...(order.confirmedItems || []),
                            ...(order.readyItems || []),
                            ...(order.servedItems || [])
                        ].reduce((acc, item) => acc + item.price * item.quantity, 0) : 0;

                        return (
                             <Card key={table.id} className={cn("overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105", isOccupied ? "bg-accent/10 border-accent shadow-accent/20" : "bg-card")}>
                                <CardHeader className="flex flex-row items-start justify-between p-4">
                                    <div className="flex flex-col items-start">
                                        <p className="text-xs text-muted-foreground">TABLE</p>
                                        <CardTitle className="text-4xl font-bold">{table.id}</CardTitle>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => removeTable(table.id)} disabled={isOccupied} className="text-destructive">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                <span>Remove</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    {isOccupied ? (
                                        <div className='text-center'>
                                            <p className="font-bold text-accent">OCCUPIED</p>
                                            <p className="text-2xl font-bold">₹{totalPrice.toFixed(2)}</p>
                                            <p className="text-sm text-muted-foreground">{totalItems} item{totalItems !== 1 && 's'}</p>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                             <p className="font-bold text-primary">AVAILABLE</p>
                                             <Utensils className="h-10 w-10 text-muted-foreground mx-auto mt-2" />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};


export default function PosPage() {
    const [isClient, setIsClient] = useState(false);
    const [activeView, setActiveView] = useState<'tables' | 'menu'>('tables');

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div className="bg-background min-h-screen">
            <PosHeader />
            <div className="flex">
                <aside className="w-64 border-r p-4 space-y-2 hidden md:block">
                     <h2 className="text-lg font-semibold tracking-tight px-2">Management</h2>
                     <Button 
                        variant={activeView === 'tables' ? 'secondary' : 'ghost'} 
                        className="w-full justify-start"
                        onClick={() => setActiveView('tables')}
                    >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Table Management
                    </Button>
                    <Button 
                        variant={activeView === 'menu' ? 'secondary' : 'ghost'} 
                        className="w-full justify-start"
                        onClick={() => setActiveView('menu')}
                    >
                        <List className="mr-2 h-4 w-4" />
                        Menu Management
                    </Button>
                </aside>
                <main className="flex-1 p-8">
                     {isClient ? (
                        <>
                          {activeView === 'tables' && <TableManagementTab />}
                          {activeView === 'menu' && <MenuManagementTab />}
                        </>
                    ) : (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

// Dummy badge component for compilation
const Badge = ({ variant, children }: {variant?: string | null, children: React.ReactNode}) => {
    const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold";
    const variants: {[key: string]: string} = {
        default: "border-transparent bg-primary text-primary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground"
    }
    return <div className={cn(baseClasses, variants[variant || 'default'])}>{children}</div>
}
