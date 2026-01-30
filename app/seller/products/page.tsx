'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    Eye,
    Image as ImageIcon,
    Loader2,
    X,
    CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Navbar } from '@/components/Navbar';
import { SellerSidebar } from '@/components/seller/SellerSidebar';
import { useAuthStore } from '@/store/authStore';
import { useStore } from '@/lib/useStore';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/utils';

export default function ProductManagerPage() {
    const user = useStore(useAuthStore, (state) => state.user);
    const { toast } = useToast();
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Form state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'GROCERY',
        stock: '',
        image: ''
    });

    useEffect(() => {
        setIsMounted(true);
        if (user) fetchSellerProducts();
    }, [user]);

    const fetchSellerProducts = async () => {
        try {
            const res = await fetch(`/api/products?sellerId=${user?.id}`);
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    images: [formData.image || '/placeholder.jpg'],
                    sellerId: user?.id
                })
            });

            if (res.ok) {
                toast({ title: 'Product Added! 🚀', description: `${formData.name} is now live.` });
                setIsDialogOpen(false);
                setFormData({ name: '', description: '', price: '', category: 'GROCERY', stock: '', image: '' });
                fetchSellerProducts();
            }
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to save product.', variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    };

    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
                <SellerSidebar />

                <main className="flex-1 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-3xl shadow-sm">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Product <span className="text-amber-500">Manager</span></h1>
                            <p className="text-gray-500 font-medium">Add and manage your store inventory.</p>
                        </div>

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="gradient-primary h-12 px-8 rounded-2xl font-black shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                                    <Plus className="w-5 h-5" />
                                    Add New Product
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] rounded-3xl border-none">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black">Create Product</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSaveProduct} className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-gray-400">Product Name</label>
                                        <Input
                                            placeholder="e.g. Organic Tomatoes"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-gray-400">Category</label>
                                            <Select
                                                value={formData.category}
                                                onValueChange={(val) => setFormData({ ...formData, category: val })}
                                            >
                                                <SelectTrigger className="h-12 rounded-xl">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="GROCERY">Grocery</SelectItem>
                                                    <SelectItem value="VEGETABLES">Vegetables</SelectItem>
                                                    <SelectItem value="RESTAURANT">Food</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-gray-400">Price (₹)</label>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                required
                                                className="h-12 rounded-xl"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-gray-400">Inventory Level</label>
                                        <Input
                                            type="number"
                                            placeholder="Available stock"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                            required
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-gray-400">Image URL</label>
                                        <Input
                                            placeholder="Paste image URL here"
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-gray-400">Description</label>
                                        <Textarea
                                            placeholder="Write about your product..."
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="rounded-xl min-h-[100px]"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={isSaving}
                                        className="w-full h-12 rounded-2xl gradient-primary font-black mt-4"
                                    >
                                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm & Launch'}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Filters & Search */}
                    <div className="flex gap-4 items-center bg-white p-4 rounded-3xl shadow-sm">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input placeholder="Search your catalog..." className="pl-12 h-12 rounded-2xl border-none bg-gray-50 font-medium" />
                        </div>
                        <Button variant="outline" className="h-12 rounded-2xl font-bold border-none bg-gray-50 flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            Filters
                        </Button>
                    </div>

                    {/* Product List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {isLoading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <Card key={i} className="h-64 bg-white animate-pulse rounded-3xl border-none shadow-sm" />
                                ))
                            ) : products.length === 0 ? (
                                <div className="col-span-full py-20 text-center">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Package className="w-10 h-10 text-gray-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">No products yet</h3>
                                    <p className="text-gray-500 font-medium mb-6">Start growing your store today.</p>
                                    <Button onClick={() => setIsDialogOpen(true)} variant="outline" className="rounded-2xl h-12 px-8 font-black">Add First Product</Button>
                                </div>
                            ) : (
                                products.map((product) => (
                                    <motion.div
                                        key={product.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                    >
                                        <Card className="overflow-hidden border-none shadow-sm hover:shadow-xl transition-all rounded-3xl bg-white group h-full flex flex-col">
                                            <div className="relative aspect-video bg-gray-50 overflow-hidden">
                                                <img
                                                    src={JSON.parse(product.images)[0] || '/placeholder.jpg'}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    alt={product.name}
                                                />
                                                <div className="absolute top-2 right-2 flex gap-1">
                                                    <Badge className="bg-white/80 backdrop-blur-md text-gray-900 border-none font-black shadow-sm">
                                                        {product.category}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="p-5 flex-1 flex flex-col">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-black text-gray-900 line-clamp-1">{product.name}</h3>
                                                    <div className="flex gap-1">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-amber-50"><Edit2 className="w-4 h-4" /></Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-500 font-medium line-clamp-2 mb-4">{product.description}</p>

                                                <div className="mt-auto pt-4 border-t flex items-center justify-between">
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</p>
                                                        <p className="text-lg font-black text-gray-900">{formatCurrency(product.price)}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Stock</p>
                                                        <Badge variant={product.stock < 10 ? 'destructive' : 'outline'} className="font-black border-none rounded-lg bg-gray-50 text-gray-600">
                                                            {product.stock} units
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    );
}
