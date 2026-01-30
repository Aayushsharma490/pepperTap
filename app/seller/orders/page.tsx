'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock,
    CheckCircle2,
    Package,
    Truck,
    Search,
    Filter,
    ChevronRight,
    MapPin,
    Phone,
    User,
    Calendar,
    ArrowRight,
    ClipboardList
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navbar } from '@/components/Navbar';
import { SellerSidebar } from '@/components/seller/SellerSidebar';
import { useAuthStore } from '@/store/authStore';
import { useStore } from '@/lib/useStore';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/utils';

export default function SellerOrdersPage() {
    const user = useStore(useAuthStore, (state) => state.user);
    const { toast } = useToast();
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [activeTab, setActiveTab] = useState('ALL');

    useEffect(() => {
        setIsMounted(true);
        if (user) fetchSellerOrders();
    }, [user]);

    const fetchSellerOrders = async () => {
        try {
            const res = await fetch(`/api/orders?sellerId=${user?.id}`);
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId: string, status: string) => {
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                toast({ title: 'Order Updated', description: `Order status changed to ${status}.` });
                fetchSellerOrders();
            }
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to update order status.', variant: 'destructive' });
        }
    };

    const filterOrders = (status: string) => {
        if (status === 'ALL') return orders;
        if (status === 'ACTIVE') return orders.filter(o => ['PENDING', 'ACCEPTED', 'PREPARING', 'READY'].includes(o.status));
        return orders.filter(o => o.status === status);
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
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order <span className="text-amber-500">Queue</span></h1>
                            <p className="text-gray-500 font-medium">Track and process your incoming orders.</p>
                        </div>
                        <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs font-bold text-gray-700">Accepting Orders</span>
                            </div>
                        </div>
                    </div>

                    <Tabs defaultValue="ALL" onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="bg-white p-1.5 rounded-2xl border-none shadow-sm h-auto inline-flex overflow-x-auto max-w-full">
                            <TabsTrigger value="ALL" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-gray-900 data-[state=active]:text-white font-bold text-sm">All Orders</TabsTrigger>
                            <TabsTrigger value="PENDING" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-amber-500 data-[state=active]:text-white font-bold text-sm">New</TabsTrigger>
                            <TabsTrigger value="ACTIVE" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white font-bold text-sm">Processing</TabsTrigger>
                            <TabsTrigger value="DELIVERED" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-green-600 data-[state=active]:text-white font-bold text-sm">Completed</TabsTrigger>
                        </TabsList>

                        <div className="space-y-4">
                            {isLoading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <Card key={i} className="h-40 bg-white animate-pulse rounded-3xl border-none shadow-sm" />
                                ))
                            ) : filterOrders(activeTab).length === 0 ? (
                                <div className="py-20 text-center bg-white rounded-3xl shadow-sm">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ClipboardList className="w-10 h-10 text-gray-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">No orders here</h3>
                                    <p className="text-gray-500 font-medium">Stay tuned for new requests!</p>
                                </div>
                            ) : (
                                filterOrders(activeTab).map((order, i) => (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Card className="p-6 border-none shadow-sm hover:shadow-md transition-all rounded-3xl bg-white group overflow-hidden relative">
                                            {/* Status Border */}
                                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${order.status === 'PENDING' ? 'bg-amber-400' :
                                                ['ACCEPTED', 'PREPARING'].includes(order.status) ? 'bg-blue-500' :
                                                    order.status === 'READY' ? 'bg-green-500' : 'bg-gray-200'
                                                }`} />

                                            <div className="flex flex-col xl:flex-row justify-between gap-8">
                                                <div className="flex-1 space-y-4">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <span className="text-lg font-black text-gray-900">#{order.orderNumber}</span>
                                                        <Badge className={`${order.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                                            order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                                                'bg-blue-100 text-blue-700'
                                                            } border-none font-black px-3 rounded-lg`}>
                                                            {order.status}
                                                        </Badge>
                                                        <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(order.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-3">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Customer Details</p>
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center font-bold text-gray-600">
                                                                    {order.customer.name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-black text-gray-900">{order.customer.name}</p>
                                                                    <p className="text-xs font-medium text-gray-500 flex items-center gap-1 mt-0.5">
                                                                        <MapPin className="w-3 h-3 text-primary" />
                                                                        {order.address.label}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-3">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Items Summary</p>
                                                            <div className="flex items-center gap-2">
                                                                {order.items.slice(0, 3).map((item: any) => (
                                                                    <div key={item.id} className="w-10 h-10 rounded-xl bg-gray-50 overflow-hidden border border-gray-100">
                                                                        <img src={JSON.parse(item.product.images)[0]} className="w-full h-full object-cover" />
                                                                    </div>
                                                                ))}
                                                                {order.items.length > 3 && (
                                                                    <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-[10px] font-black text-white">
                                                                        +{order.items.length - 3}
                                                                    </div>
                                                                )}
                                                                <p className="text-xs font-bold text-gray-600 ml-2">₹{order.totalAmount.toFixed(2)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-row xl:flex-col justify-end gap-3 items-center xl:items-end border-t xl:border-t-0 xl:border-l border-gray-100 pt-6 xl:pt-0 xl:pl-8">
                                                    <p className="hidden xl:block text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Actions</p>
                                                    <div className="flex gap-2">
                                                        {order.status === 'PENDING' && (
                                                            <Button
                                                                onClick={() => handleUpdateStatus(order.id, 'ACCEPTED')}
                                                                className="bg-amber-500 hover:bg-amber-600 h-12 px-8 rounded-2xl font-black text-white shadow-lg shadow-amber-100 transition-all"
                                                            >
                                                                Accept Task
                                                            </Button>
                                                        )}
                                                        {order.status === 'ACCEPTED' && (
                                                            <Button
                                                                onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                                                                className="bg-blue-600 hover:bg-blue-700 h-12 px-8 rounded-2xl font-black text-white shadow-lg shadow-blue-100 transition-all"
                                                            >
                                                                Start Preparing
                                                            </Button>
                                                        )}
                                                        {order.status === 'PREPARING' && (
                                                            <Button
                                                                onClick={() => handleUpdateStatus(order.id, 'READY')}
                                                                className="bg-green-600 hover:bg-green-700 h-12 px-8 rounded-2xl font-black text-white shadow-lg shadow-green-100 transition-all"
                                                            >
                                                                Mark as Ready
                                                            </Button>
                                                        )}
                                                        <Button variant="outline" className="h-12 w-12 rounded-2xl border-gray-100"><ArrowRight className="w-5 h-5" /></Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </Tabs>
                </main>
            </div>
        </div>
    );
}
