'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/components/cart/cart-context"
import type { MenuItem, MenuCategory } from "@/lib/types"
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  price: z.coerce.number().min(0, { message: "Price must be a positive number." }),
  category: z.string().min(1, { message: "Please select a category." }),
  description: z.string().optional(),
})

type MenuItemFormValues = z.infer<typeof formSchema>;

interface MenuItemFormProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    item: MenuItem | null;
}

export function MenuItemForm({ isOpen, setIsOpen, item }: MenuItemFormProps) {
    const { addMenuItem, updateMenuItem, categories } = useCart();
    
    const form = useForm<MenuItemFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            price: 0,
            category: "",
            description: ""
        }
    });

    useEffect(() => {
        if (item) {
            form.reset({
                name: item.name,
                price: item.price,
                category: item.category,
                description: item.description,
            });
        } else {
            form.reset({
                name: "",
                price: 0,
                category: "",
                description: ""
            });
        }
    }, [item, form, isOpen]);


    function onSubmit(values: MenuItemFormValues) {
        if (item) {
            updateMenuItem({ 
                ...item, 
                ...values,
                category: values.category as MenuCategory,
            });
        } else {
            addMenuItem({ 
                ...values, 
                category: values.category as MenuCategory,
            });
        }
        setIsOpen(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{item ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="E.g., Veg Biryani" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="E.g., 150" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="A short description of the item." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
