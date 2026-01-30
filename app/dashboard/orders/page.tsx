'use client';

import { motion } from 'framer-motion';
import { Package, Search, ChevronRight, ArrowLeft, Filter, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';

interface Order {
    id: string;
    orderNumber: string;
    date: string;
    amount: number;
    status: 'DELIVERED' | 'PREPARING' | 'PENDING' | 'CANCELLED';
    itemsCount: number;
}

const orders: Order[] = [
    {
        id: '1',
        orderNumber: 'PT8829',
        date: 'Jan 30, 2026',
        amount: 850,
        status: 'DELIVERED',
        itemsCount: 4,
    },
    {
        id: '2',
        orderNumber: 'PT8812',
        date: 'Jan 28, 2026',
        amount: 320,
        status: 'DELIVERED',
        itemsCount: 2,
    },
    {
        id: '3',
        orderNumber: 'PT8799',
        date: 'Jan 25, 2026',
        amount: 1200,
        status: 'CANCELLED',
        itemsCount: 8,
    },
];

const getStatusColor = (status: Order['status']) => {
    switch (status) {
        case 'DELIVERED': return 'bg-green-100 text-green-700';
        case 'PREPARING': return 'bg-blue-100 text-blue-700';
        case 'PENDING': return 'bg-yellow-100 text-yellow-700';
        case 'CANCELLED': return 'bg-red-100 text-red-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};

export default function OrdersPage() {
    return (
        <div className="min-h-screen bg-gray-50/50">
            <Navbar />

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <Button asChild variant="ghost" className="inline-flex items-center text-sm text-gray-600 hover:text-green-600 mb-6 group transition-colors p-0 h-auto">
                    <Link href="/dashboard">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                </Button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Order History</h1>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input placeholder="Search orders..." className="pl-10 h-10 w-full md:w-64 glass" />
                        </div>
                        <Button variant="outline" className="h-10 glass">
                            <Filter className="w-4 h-4 mr-2" />
                            Filter
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    {orders.map((order, index) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="p-6 glass hover:shadow-lg transition-all group overflow-hidden relative">
                                <div className="flex flex-wrap items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500 group-hover:bg-green-100 group-hover:text-green-600 transition-colors">
                                            <Package className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">Order #{order.orderNumber}</p>
                                            <p className="text-xs text-gray-500">{order.date}</p>
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-wrap gap-8 md:justify-center">
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Items</p>
                                            <p className="text-sm font-bold text-gray-700">{order.itemsCount} Products</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Amount</p>
                                            <p className="text-sm font-bold text-gray-700">₹{order.amount}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Status</p>
                                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" className="text-xs font-bold text-green-600 hover:bg-green-50">
                                            Reorder
                                        </Button>
                                        <Link href={`/dashboard/orders/${order.id}`}>
                                            <Button variant="outline" size="sm" className="glass h-9">
                                                Details
                                                <ChevronRight className="w-4 h-4 ml-1" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}

                    {orders.length === 0 && (
                        <Card className="p-20 text-center glass border-dashed">
                            <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                            <h2 className="text-xl font-bold text-gray-800 mb-2">No orders found</h2>
                            <p className="text-gray-500 mb-8">You haven't placed any orders yet.</p>
                            <Link href="/">
                                <Button className="gradient-primary">Start Shopping</Button>
                            </Link>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
}
