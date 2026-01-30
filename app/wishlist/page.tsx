'use client';

import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { useCartStore } from '@/store/cartStore';
import { useStore } from '@/lib/useStore';
import Link from 'next/link';

// In a real app, this would come from a wishlistStore
const mockWishlist = [
    {
        id: '1',
        name: 'Organic Bananas',
        price: 60,
        image: '/images/vegetables/caluriflower.png', // Using available asset for now
        category: 'VEGETABLES'
    },
    {
        id: '2',
        name: 'Amul Butter',
        price: 55,
        image: '/images/grocery/parleg.png', // Using available asset
        category: 'GROCERY'
    },
    {
        id: '3',
        name: 'Good Day Biscuits',
        price: 30,
        image: '/images/grocery/goodday.png',
        category: 'GROCERY'
    }
];

export default function WishlistPage() {
    const addItem = useCartStore((state) => state.addItem);

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
            <Navbar />

            <main className="container mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <Link href="/" className="inline-flex items-center text-sm font-bold text-pink-600 hover:text-pink-700 mb-8 group transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Shopping
                    </Link>

                    <h1 className="text-5xl font-black text-gray-900 mb-12 flex items-center tracking-tight">
                        <div className="relative mr-4">
                            <Heart className="w-12 h-12 text-pink-500 fill-pink-500 relative z-10" />
                            <div className="absolute inset-0 bg-pink-500/20 blur-xl rounded-full" />
                        </div>
                        My <span className="text-gradient">Wishlist</span>
                    </h1>
                </motion.div>

                {mockWishlist.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <Card className="p-16 text-center glass border-none max-w-2xl mx-auto rounded-[3rem] shadow-2xl">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-float">
                                <Heart className="w-12 h-12 text-gray-200" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-800 mb-4">Your wishlist is empty</h2>
                            <p className="text-lg text-gray-500 mb-10">Save items you like to buy them later.</p>
                            <Link href="/">
                                <Button className="gradient-premium px-10 h-14 text-xl rounded-2xl font-bold shadow-xl shadow-purple-200">
                                    Explore Products
                                </Button>
                            </Link>
                        </Card>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {mockWishlist.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, type: "spring", damping: 15 }}
                            >
                                <Card className="overflow-hidden glass group hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.14)] transition-all duration-500 border-none rounded-[2rem]">
                                    <div className="relative aspect-square overflow-hidden bg-white p-6">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-4 right-4 bg-white/80 backdrop-blur-md text-red-500 hover:bg-red-500 hover:text-white rounded-xl shadow-lg transition-all active:scale-90"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </Button>
                                    </div>
                                    <div className="p-8">
                                        <div className="mb-2">
                                            <Badge className="bg-green-100/50 text-green-700 border-none text-[10px] font-black tracking-widest px-3 py-1">
                                                {product.category}
                                            </Badge>
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-primary transition-colors leading-tight">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center justify-between mt-6">
                                            <p className="text-3xl font-black text-gray-900">
                                                ₹{product.price}
                                            </p>
                                            <Button
                                                size="icon"
                                                className="w-12 h-12 rounded-2xl gradient-primary shadow-lg shadow-green-100 hover:scale-110 active:scale-90 transition-all"
                                                onClick={() => {
                                                    addItem({
                                                        productId: product.id,
                                                        name: product.name,
                                                        price: product.price,
                                                        image: product.image
                                                    });
                                                }}
                                            >
                                                <ShoppingCart className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
