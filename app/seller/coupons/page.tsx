'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Tag,
    Plus,
    Ticket,
    Calendar,
    Users,
    Percent,
    TrendingUp,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { SellerSidebar } from '@/components/seller/SellerSidebar';
import { useAuthStore } from '@/store/authStore';
import { useStore } from '@/lib/useStore';
import { useToast } from '@/components/ui/use-toast';

export default function SellerCouponsPage() {
    const user = useStore(useAuthStore, (state) => state.user);
    const { toast } = useToast();
    const [isMounted, setIsMounted] = useState(false);

    const [coupons, setCoupons] = useState([
        { id: '1', code: 'WELCOME50', type: 'PERCENT', value: 50, usage: 124, limit: 500, expiry: '2024-12-31', status: 'ACTIVE' },
        { id: '2', code: 'FESTIVE100', type: 'FLAT', value: 100, usage: 45, limit: 100, expiry: '2023-11-15', status: 'EXPIRED' },
    ]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

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
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Coupons & <span className="text-amber-500">Deals</span></h1>
                            <p className="text-gray-500 font-medium">Create and track promotions to boost your sales.</p>
                        </div>
                        <Button className="gradient-primary h-12 px-8 rounded-2xl font-black shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            New Campaign
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {coupons.map((coupon, i) => (
                            <motion.div
                                key={coupon.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className="p-8 border-none shadow-sm rounded-[2.5rem] bg-white group hover:shadow-xl transition-all overflow-hidden relative">
                                    {/* Ticket Notch Effect */}
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#fafafa] -translate-x-1/2" />
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#fafafa] translate-x-1/2" />

                                    <div className="flex flex-col md:flex-row justify-between gap-8 h-full">
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                                                    {coupon.type === 'PERCENT' ? <Percent className="w-5 h-5" /> : <Ticket className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-black tracking-widest text-gray-900">{coupon.code}</h3>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                        {coupon.value}{coupon.type === 'PERCENT' ? '%' : ' FLAT'} OFF
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dashed border-gray-100">
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-gray-300" />
                                                    <p className="text-sm font-black text-gray-700">{coupon.usage} / {coupon.limit}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-gray-300" />
                                                    <p className="text-sm font-black text-gray-700">{coupon.expiry}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-row md:flex-col justify-between items-center md:items-end md:pl-8 md:border-l md:border-dashed md:border-gray-100">
                                            <Badge className={`${coupon.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                                } border-none font-black px-4 py-1.5 rounded-xl uppercase tracking-widest text-[10px]`}>
                                                {coupon.status}
                                            </Badge>

                                            <div className="flex flex-col items-end">
                                                <p className="text-xs font-black text-gray-300 uppercase mb-1">Impact</p>
                                                <div className="flex items-center text-emerald-600 gap-1">
                                                    <TrendingUp className="w-4 h-4" />
                                                    <span className="text-lg font-black">+₹{(coupon.usage * 45).toLocaleString()}</span>
                                                </div>
                                            </div>

                                            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-gray-50 text-gray-400 group-hover:text-amber-500 transition-colors">
                                                <ArrowRight className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Stats Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: 'Active Codes', value: '12', icon: CheckCircle2, bg: 'bg-emerald-50', color: 'text-emerald-500' },
                            { label: 'Total Claims', value: '450', icon: Users, bg: 'bg-blue-50', color: 'text-blue-500' },
                            { label: 'Revenue Boost', value: '₹24.5k', icon: TrendingUp, bg: 'bg-amber-50', color: 'text-amber-500' },
                        ].map((stat, i) => (
                            <Card key={i} className="p-6 border-none shadow-sm rounded-3xl bg-white flex items-center gap-6">
                                <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-[1.2rem] flex items-center justify-center`}>
                                    <stat.icon className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                    <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
