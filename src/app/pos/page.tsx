'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/components/cart/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from '@/components/ui/switch';
import { PlusCircle, Trash2, Edit, MoreVertical, Users, CreditCard, UtensilsCrossed, Table as TableIcon, Loader2 } from 'lucide-react';
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
                <Badge variant={item.isAvailable === false ? 'destructive' : 'default'}>
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
                <Button variant="ghost" size="icon" onClick={onEdit}>
                    <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onDelete}>
                    <Trash2 className="h-4 w-4" />
                </Button>
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

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Availability</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categoriesInUse.map(category => (
                            <React.Fragment key={category}>
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableCell colSpan={5} className="font-bold text-lg py-3">
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
                        ))}
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
             <div className="bg-slate-50 p-4 rounded-lg" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d1d5db' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`}}>
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
                            <Card key={table.id} className={cn("flex flex-col rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105", isOccupied ? "bg-white" : "bg-white/80 backdrop-blur-sm")}>
                                <CardHeader className={cn("flex flex-row items-center justify-between p-3", isOccupied ? "bg-accent text-accent-foreground" : "bg-slate-200")}>
                                    <CardTitle className="text-base font-bold">TABLE {table.id}</CardTitle>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-6 w-6 p-0 hover:bg-black/10">
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
                                <CardContent className="p-4 flex-grow flex flex-col justify-between items-center text-center">
                                    {isOccupied ? (
                                        <>
                                            <div>
                                                <p className="text-xs font-semibold text-accent uppercase">Occupied</p>
                                                <p className="text-2xl font-bold text-slate-800">₹{totalPrice.toFixed(2)}</p>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-600 mt-2">
                                                <Users className="h-4 w-4"/> 
                                                <span>{totalItems} item{totalItems !== 1 && 's'}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <TableIcon className="h-10 w-10 text-slate-400"/>
                                            <p className="font-bold text-slate-500">Available</p>
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

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div className="bg-background min-h-screen">
            <PosHeader />
            <div className="container mx-auto py-8">
                {isClient ? (
                    <Tabs defaultValue="tables">
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
                ) : (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                )}
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
