'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    ShoppingCart,
    Trash2,
    Plus,
    Minus,
    ArrowLeft,
    Tag,
    CreditCard,
    ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/utils';
import { useStore } from '@/lib/useStore';

export default function CartPage() {
    const router = useRouter();
    const { toast } = useToast();

    // Use useStore for persisted state
    const items = useStore(useCartStore, (state) => state.items) ?? [];
    const clearCart = useCartStore((state) => state.clearCart);
    const removeItem = useCartStore((state) => state.removeItem);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const getTotalPrice = useCartStore((state) => state.getTotalPrice);
    const getTotalItems = useCartStore((state) => state.getTotalItems);

    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

    // Initial check to avoid flickering during local storage load
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const subtotal = getTotalPrice();
    const discount = appliedCoupon ? appliedCoupon.discount : 0;
    const deliveryFee = subtotal > 500 ? 0 : 40;
    const total = subtotal - discount + deliveryFee;

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            toast({
                title: 'Invalid Coupon',
                description: 'Please enter a coupon code.',
            });
            return;
        }

        setIsApplyingCoupon(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Demo coupons
        const coupons: Record<string, number> = {
            'FIRST50': 50,
            'SAVE20': subtotal * 0.2,
            'WELCOME100': 100,
        };

        if (coupons[couponCode.toUpperCase()]) {
            setAppliedCoupon({
                code: couponCode.toUpperCase(),
                discount: coupons[couponCode.toUpperCase()],
            });
            toast({
                title: 'Coupon Applied! 🎉',
                description: `You saved ₹${coupons[couponCode.toUpperCase()]}`,
            });
        } else {
            toast({
                title: 'Invalid Coupon',
                description: 'This coupon code is not valid.',
            });
        }

        setIsApplyingCoupon(false);
    };

    const handleCheckout = () => {
        if (items.length === 0) {
            toast({
                title: 'Cart is Empty',
                description: 'Add some items to your cart first.',
            });
            return;
        }

        toast({
            title: 'Proceeding to Checkout',
            description: 'Redirecting to payment...',
        });

        // Redirect to checkout
        setTimeout(() => {
            router.push('/checkout');
        }, 1000);
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingCart className="w-12 h-12 text-gray-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
                        <p className="text-gray-600 mb-8">Add some delicious items to get started!</p>
                        <Link href="/">
                            <Button size="lg">
                                <ShoppingBag className="w-5 h-5 mr-2" />
                                Start Shopping
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Continue Shopping
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
                            <p className="text-gray-600">{getTotalItems()} items in your cart</p>
                        </div>
                        <Button variant="outline" onClick={clearCart}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Clear Cart
                        </Button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence>
                            {items.map((item, index) => (
                                <motion.div
                                    key={item.productId}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="p-4 glass hover:shadow-lg transition-shadow">
                                        <div className="flex gap-4">
                                            {/* Product Image */}
                                            <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="96px"
                                                />
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg text-gray-800 mb-1">
                                                    {item.name}
                                                </h3>
                                                <p className="text-2xl font-bold text-green-600">
                                                    {formatCurrency(item.price)}
                                                </p>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex flex-col items-end justify-between">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeItem(item.productId)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>

                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                                                        className="h-8 w-8"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </Button>
                                                    <span className="w-12 text-center font-semibold">{item.quantity}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                        className="h-8 w-8"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </Button>
                                                </div>

                                                <p className="text-sm text-gray-600">
                                                    Total: {formatCurrency(item.price * item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="sticky top-8"
                        >
                            <Card className="p-6 glass">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

                                {/* Coupon Code */}
                                <div className="mb-6">
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                                        Have a coupon?
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                                placeholder="Enter code"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                                className="pl-10"
                                                disabled={!!appliedCoupon}
                                            />
                                        </div>
                                        <Button
                                            onClick={handleApplyCoupon}
                                            disabled={isApplyingCoupon || !!appliedCoupon}
                                            variant="outline"
                                        >
                                            {isApplyingCoupon ? 'Applying...' : 'Apply'}
                                        </Button>
                                    </div>
                                    {appliedCoupon && (
                                        <div className="mt-2 flex items-center justify-between">
                                            <Badge className="bg-green-100 text-green-800">
                                                {appliedCoupon.code} Applied
                                            </Badge>
                                            <button
                                                onClick={() => {
                                                    setAppliedCoupon(null);
                                                    setCouponCode('');
                                                }}
                                                className="text-sm text-red-600 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                    <p className="text-xs text-gray-500 mt-2">
                                        Try: FIRST50, SAVE20, WELCOME100
                                    </p>
                                </div>

                                {/* Price Breakdown */}
                                <div className="space-y-3 mb-6 pb-6 border-b">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>{formatCurrency(subtotal)}</span>
                                    </div>
                                    {appliedCoupon && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount</span>
                                            <span>-{formatCurrency(discount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-gray-600">
                                        <span>Delivery Fee</span>
                                        <span>{deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}</span>
                                    </div>
                                    {subtotal < 500 && (
                                        <p className="text-xs text-gray-500">
                                            Add ₹{500 - subtotal} more for free delivery
                                        </p>
                                    )}
                                </div>

                                {/* Total */}
                                <div className="flex justify-between text-xl font-bold text-gray-800 mb-6">
                                    <span>Total</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>

                                {/* Checkout Button */}
                                <Button
                                    onClick={handleCheckout}
                                    className="w-full"
                                    size="lg"
                                >
                                    <CreditCard className="w-5 h-5 mr-2" />
                                    Proceed to Checkout
                                </Button>

                                {/* Security Badge */}
                                <div className="mt-4 text-center">
                                    <p className="text-xs text-gray-500">
                                        🔒 Secure checkout with SSL encryption
                                    </p>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
