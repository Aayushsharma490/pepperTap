'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, ShoppingCart, Plus } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/utils';

interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    category: string;
    images: string;
    stock: number;
    rating: number;
    reviewCount: number;
}

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [imageError, setImageError] = useState(false);
    const addItem = useCartStore((state) => state.addItem);
    const cartItems = useCartStore((state) => state.items);

    // Get current quantity from cart
    const currentItem = cartItems.find(i => i.productId === product.id);
    const quantity = currentItem?.quantity || 0;

    const { toast } = useToast();

    const handleAddToCart = async () => {
        setIsAdding(true);

        // Simulate API call for premium feel
        await new Promise((resolve) => setTimeout(resolve, 200));

        const images = JSON.parse(product.images);
        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: images[0] || '/placeholder.jpg',
        });

        setIsAdding(false);
    };

    const handleToggleWishlist = () => {
        setIsWishlisted(!isWishlisted);
    };

    const images = JSON.parse(product.images);
    const imageUrl = images[0] || '/placeholder.jpg';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -8 }}
            className="h-full"
        >
            <Card className="overflow-hidden glass-card hover:shadow-2xl transition-all duration-500 h-full flex flex-col border-none bg-white/40 backdrop-blur-md">
                <div className="relative aspect-square bg-muted/30 overflow-hidden group">
                    <AnimatePresence>
                        {quantity > 0 && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0, y: 10 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0, opacity: 0, y: 10 }}
                                className="absolute top-3 right-12 z-20"
                            >
                                <Badge className="bg-primary text-white font-black px-2 shadow-lg scale-110">
                                    {quantity} In Cart
                                </Badge>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!imageError ? (
                        <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-6xl bg-gradient-to-br from-gray-50 to-white">
                            {product.category === 'GROCERY' && '🛒'}
                            {product.category === 'VEGETABLES' && '🥬'}
                            {product.category === 'RESTAURANT' && '🍔'}
                        </div>
                    )}

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white backdrop-blur-md rounded-xl shadow-sm z-20"
                        onClick={handleToggleWishlist}
                    >
                        <Heart
                            className={`h-5 w-5 transition-all duration-300 ${isWishlisted ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-400'
                                }`}
                        />
                    </Button>

                    {product.stock < 10 && product.stock > 0 && (
                        <Badge className="absolute bottom-2 left-2 bg-yellow-400 text-yellow-900 border-none font-bold">
                            Only {product.stock} left
                        </Badge>
                    )}

                    {product.stock === 0 && (
                        <Badge className="absolute bottom-2 left-2" variant="destructive">
                            Out of Stock
                        </Badge>
                    )}
                </div>

                <CardContent className="flex-1 p-5">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-900 leading-tight flex-1 line-clamp-1">
                            {product.name}
                        </h3>
                    </div>
                    <p className="text-xs text-gray-500 mb-4 line-clamp-2 font-medium">
                        {product.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                        <motion.div
                            key={product.price + quantity}
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            className="flex flex-col"
                        >
                            <span className="text-2xl font-black text-gray-900">
                                {formatCurrency(product.price)}
                            </span>
                            <div className="flex items-center gap-1 opacity-60">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-[10px] font-bold">{product.rating}</span>
                            </div>
                        </motion.div>

                        <AnimatePresence mode="wait">
                            {quantity > 0 ? (
                                <motion.div
                                    key="in-cart-indicator"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    className="flex items-center bg-primary/10 px-3 py-1 rounded-full border border-primary/20"
                                >
                                    <span className="text-[10px] font-black text-primary uppercase tracking-tighter">In Cart</span>
                                </motion.div>
                            ) : null}
                        </AnimatePresence>
                    </div>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                    <Button
                        className={`w-full h-12 rounded-2xl font-bold transition-all duration-300 shadow-lg ${quantity > 0
                            ? 'bg-primary hover:bg-primary/90'
                            : 'gradient-primary hover:shadow-primary/20'
                            }`}
                        onClick={handleAddToCart}
                        disabled={product.stock === 0 || isAdding}
                    >
                        {isAdding ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                                <Plus className="h-5 w-5" />
                            </motion.div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Plus className={`h-5 w-5 transition-transform duration-500 ${quantity > 0 ? 'rotate-90' : ''}`} />
                                <span>{quantity > 0 ? 'Add More' : 'Add to Cart'}</span>
                            </div>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
