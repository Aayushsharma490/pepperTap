'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    ShoppingBag,
    Wallet,
    AlertCircle,
    CheckCircle2,
    Clock,
    Settings,
    Trash2,
    Inbox,
    Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { SellerSidebar } from '@/components/seller/SellerSidebar';
import { useAuthStore } from '@/store/authStore';
import { useStore } from '@/lib/useStore';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SellerNotificationsPage() {
    const user = useStore(useAuthStore, (state) => state.user);
    const { toast } = useToast();
    const [isMounted, setIsMounted] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: '1', title: 'New Order Received!', message: 'Order #ORD-2023-4521 for ₹850.00 is waiting for your approval.', type: 'ORDER', time: '2 mins ago', read: false },
        { id: '2', title: 'Payout Successful', message: 'Your withdrawal of ₹12,450.00 has been credited to your bank account.', type: 'PAYMENT', time: '1 hour ago', read: true },
        { id: '3', title: 'Low Stock Alert!', message: 'Your product "Fresh Coriander" has only 5 units left in stock.', type: 'SYSTEM', time: '3 hours ago', read: false },
        { id: '4', title: 'Customer Review', message: 'Rahul gave your store a 5-star rating! "Super fast delivery and fresh quality."', type: 'SYSTEM', time: 'Yesterday', read: true },
    ]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        toast({ title: 'Success', description: 'All notifications marked as read.' });
    };

    if (!isMounted) return null;

    const getIcon = (type: string) => {
        switch (type) {
            case 'ORDER': return <ShoppingBag className="w-6 h-6 text-blue-500" />;
            case 'PAYMENT': return <Wallet className="w-6 h-6 text-emerald-500" />;
            case 'SYSTEM': return <AlertCircle className="w-6 h-6 text-amber-500" />;
            default: return <Bell className="w-6 h-6 text-gray-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
                <SellerSidebar />

                <main className="flex-1 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-3xl shadow-sm">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Notification <span className="text-amber-500">Center</span></h1>
                            <p className="text-gray-500 font-medium">Stay updated with your store activity.</p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="ghost" className="h-12 px-6 rounded-2xl font-black text-gray-400 hover:text-gray-900" onClick={markAllRead}>
                                Mark All Read
                            </Button>
                            <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-gray-100 flex items-center justify-center">
                                <Settings className="w-5 h-5 text-gray-400" />
                            </Button>
                        </div>
                    </div>

                    <Tabs defaultValue="all" className="space-y-6">
                        <TabsList className="bg-white p-1.5 rounded-2xl border-none shadow-sm h-auto inline-flex overflow-x-auto max-w-full">
                            <TabsTrigger value="all" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-gray-900 data-[state=active]:text-white font-bold text-sm">All</TabsTrigger>
                            <TabsTrigger value="orders" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white font-bold text-sm">Orders</TabsTrigger>
                            <TabsTrigger value="payments" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-bold text-sm">Payments</TabsTrigger>
                        </TabsList>

                        <div className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                {notifications.length === 0 ? (
                                    <div className="py-20 text-center bg-white rounded-3xl shadow-sm border-none">
                                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Inbox className="w-10 h-10 text-gray-300" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">All caught up!</h3>
                                        <p className="text-gray-500 font-medium">No new notifications at the moment.</p>
                                    </div>
                                ) : (
                                    notifications.map((n, i) => (
                                        <motion.div
                                            key={n.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <Card className={`p-6 border-none shadow-sm rounded-3xl transition-all hover:shadow-md bg-white flex items-start gap-6 relative group ${!n.read ? 'border-l-4 border-l-amber-500 shadow-amber-50/50' : ''}`}>
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${n.type === 'ORDER' ? 'bg-blue-50' :
                                                        n.type === 'PAYMENT' ? 'bg-emerald-50' : 'bg-amber-50'
                                                    }`}>
                                                    {getIcon(n.type)}
                                                </div>
                                                <div className="flex-1 pr-12">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className={`font-black tracking-tight ${!n.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                                            {n.title}
                                                        </h3>
                                                        {!n.read && <div className="w-2 h-2 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50" />}
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-500 leading-relaxed mb-3">
                                                        {n.message}
                                                    </p>
                                                    <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                                                        <Clock className="w-3 h-3" />
                                                        {n.time}
                                                    </div>
                                                </div>
                                                <div className="absolute right-6 top-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl" onClick={() => setNotifications(prev => prev.filter(item => item.id !== n.id))}>
                                                        <Trash2 className="w-5 h-5" />
                                                    </Button>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </Tabs>
                </main>
            </div>
        </div>
    );
}
