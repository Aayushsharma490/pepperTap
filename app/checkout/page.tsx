'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    CreditCard,
    Wallet,
    Smartphone,
    Plus,
    ShieldCheck,
    CheckCircle2,
    Truck,
    MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Navbar } from '@/components/Navbar';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useStore } from '@/lib/useStore';
import { useToast } from '@/components/ui/use-toast';

const Confetti = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {[...Array(50)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        opacity: 1,
                        scale: 0,
                        x: "50vw",
                        y: "100vh"
                    }}
                    animate={{
                        opacity: [1, 1, 0],
                        scale: [0, 1, 0.5],
                        x: `${Math.random() * 100}vw`,
                        y: `${Math.random() * 50}vh`,
                        rotate: Math.random() * 360
                    }}
                    transition={{
                        duration: Math.random() * 2 + 1,
                        ease: "easeOut",
                        delay: Math.random() * 0.5
                    }}
                    className="absolute w-3 h-3 rounded-sm"
                    style={{
                        backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'][Math.floor(Math.random() * 5)]
                    }}
                />
            ))}
        </div>
    );
};

export default function CheckoutPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { items, clearCart, getTotalPrice } = useCartStore();
    const user = useStore(useAuthStore, (state) => state.user);

    const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Success
    const [isLoading, setIsLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');

    const [address, setAddress] = useState({
        street: '123 Tech Park',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560001'
    });

    const total = getTotalPrice() + (getTotalPrice() > 500 ? 0 : 40);

    const handlePlaceOrder = async () => {
        setIsLoading(true);
        try {
            // Mock API order creation
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerId: user?.id,
                    items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
                    addressId: 'dummy-address-id', // Using dummy for now
                    paymentMethod: paymentMethod.toUpperCase()
                })
            });

            if (response.ok) {
                // Notify Logistics System
                const { logisticsEmitter } = require('@/lib/realtime');
                logisticsEmitter.emit({
                    type: 'ORDER_PLACED',
                    orderId: 'ORD-' + Math.floor(Math.random() * 9000 + 1000)
                });

                setStep(3);
                clearCart();
                toast({
                    title: "Order Placed! 🚀",
                    description: "Your order is being prepared.",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to place order.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!items.length && step !== 3) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                    <Button onClick={() => router.push('/')}>Go Shopping</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Navbar />

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Stepper */}
                <div className="flex items-center justify-center mb-12">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${step >= i ? 'bg-primary text-white scale-110 shadow-lg shadow-green-200' : 'bg-white border text-gray-400'
                                }`}>
                                {step > i ? <CheckCircle2 className="w-6 h-6" /> : i}
                            </div>
                            {i < 3 && <div className={`w-20 h-1 transition-all duration-500 ${step > i ? 'bg-primary' : 'bg-gray-200'}`} />}
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-bold flex items-center">
                                <MapPin className="mr-2 text-primary" /> Delivery Address
                            </h2>
                            <Card className="p-6 glass">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Street Address</label>
                                        <Input value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">City</label>
                                        <Input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Pincode</label>
                                        <Input value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">State</label>
                                        <Input value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                                    </div>
                                </div>
                                <Button className="w-full mt-8 h-12 text-lg font-bold" onClick={() => setStep(2)}>
                                    Continue to Payment
                                </Button>
                            </Card>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-bold flex items-center">
                                <CreditCard className="mr-2 text-primary" /> Payment Method
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
                                    { id: 'wallet', name: 'Wallet Credits', icon: Wallet },
                                    { id: 'upi', name: 'UPI Payment', icon: Smartphone },
                                ].map((method) => (
                                    <Card
                                        key={method.id}
                                        className={`p-6 cursor-pointer border-2 transition-all hover:shadow-xl ${paymentMethod === method.id ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'hover:border-gray-300'
                                            }`}
                                        onClick={() => setPaymentMethod(method.id)}
                                    >
                                        <method.icon className={`w-8 h-8 mb-4 ${paymentMethod === method.id ? 'text-primary' : 'text-gray-400'}`} />
                                        <p className="font-bold">{method.name}</p>
                                    </Card>
                                ))}
                            </div>

                            <Card className="p-6 glass">
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between font-medium">
                                        <span>Order Total</span>
                                        <span>₹{total}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                                        <ShieldCheck className="w-4 h-4 mr-2" />
                                        Secure encrypted payment
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                                    <Button className="flex-[2] h-12 font-bold" onClick={handlePlaceOrder} disabled={isLoading}>
                                        {isLoading ? 'Processing...' : `Pay ₹${total}`}
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20 relative"
                        >
                            <Confetti />
                            <div className="relative inline-block">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", damping: 10, stiffness: 100 }}
                                    className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center text-white mb-8 mx-auto shadow-2xl shadow-green-200"
                                >
                                    <CheckCircle2 className="w-20 h-20" />
                                </motion.div>
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute inset-0 bg-green-500 rounded-full -z-10"
                                />
                            </div>

                            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Order Confirmed!</h2>
                            <p className="text-xl text-gray-600 mb-12 max-w-md mx-auto">
                                Great news! Your order has been placed successfully and is being shared with the seller.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button size="lg" className="h-14 px-8 font-bold" onClick={() => router.push('/dashboard')}>
                                    <Truck className="w-5 h-5 mr-2" /> Track My Order
                                </Button>
                                <Button size="lg" variant="outline" className="h-14 px-8" onClick={() => router.push('/')}>
                                    Continue Shopping
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
