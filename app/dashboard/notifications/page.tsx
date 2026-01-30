'use client';

import { motion } from 'framer-motion';
import { Bell, ShoppingBag, CreditCard, Info, ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';

interface Notification {
    id: string;
    title: string;
    description: string;
    type: 'order' | 'payment' | 'info';
    time: string;
    isRead: boolean;
}

const notifications: Notification[] = [
    {
        id: '1',
        title: 'Order Delivered!',
        description: 'Your order #PT8829 has been delivered by Rahul S.',
        type: 'order',
        time: '2 mins ago',
        isRead: false,
    },
    {
        id: '2',
        title: 'Refund Processed',
        description: '₹120.00 has been credited back to your Peppertap wallet.',
        type: 'payment',
        time: '3 hours ago',
        isRead: true,
    },
    {
        id: '3',
        title: 'Welcome to Peppertap!',
        description: 'Start shopping and support your local kirana shops today.',
        type: 'info',
        time: '1 day ago',
        isRead: true,
    },
];

export default function NotificationsPage() {
    return (
        <div className="min-h-screen bg-gray-50/50">
            <Navbar />

            <main className="container mx-auto px-4 py-8 max-w-2xl">
                <Button asChild variant="ghost" className="inline-flex items-center text-sm text-gray-600 hover:text-green-600 mb-6 group transition-colors p-0 h-auto">
                    <Link href="/dashboard">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                </Button>

                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600">
                        Clear All
                    </Button>
                </div>

                <div className="space-y-4">
                    {notifications.map((notif, index) => (
                        <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className={`p-4 glass border-l-4 transition-all hover:bg-white/80 ${notif.isRead ? 'border-l-gray-300' : 'border-l-green-500 shadow-md'}`}>
                                <div className="flex gap-4">
                                    <div className={`p-2 rounded-xl h-fit ${notif.type === 'order' ? 'bg-green-100 text-green-600' :
                                        notif.type === 'payment' ? 'bg-blue-100 text-blue-600' :
                                            'bg-purple-100 text-purple-600'
                                        }`}>
                                        {notif.type === 'order' ? <ShoppingBag className="w-5 h-5" /> :
                                            notif.type === 'payment' ? <CreditCard className="w-5 h-5" /> :
                                                <Info className="w-5 h-5" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className={`text-sm font-bold ${notif.isRead ? 'text-gray-700' : 'text-gray-900'}`}>{notif.title}</h3>
                                            <span className="text-[10px] text-gray-400 font-medium">{notif.time}</span>
                                        </div>
                                        <p className="text-xs text-gray-600 leading-relaxed">
                                            {notif.description}
                                        </p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-300 hover:text-red-500">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
}
