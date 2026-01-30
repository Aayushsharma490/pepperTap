'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Wallet,
    TrendingUp,
    ArrowUpRight,
    ArrowDownLeft,
    Download,
    Calendar,
    DollarSign,
    CreditCard,
    ArrowRight,
    PieChart,
    BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { SellerSidebar } from '@/components/seller/SellerSidebar';
import { useAuthStore } from '@/store/authStore';
import { useStore } from '@/lib/useStore';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/utils';

export default function SellerEarningsPage() {
    const user = useStore(useAuthStore, (state) => state.user);
    const { toast } = useToast();
    const [isMounted, setIsMounted] = useState(false);

    const [stats, setStats] = useState({
        balance: 12450.80,
        totalWithdrawn: 45000.00,
        pendingPayout: 1850.50,
        thisMonth: 8900.20
    });

    const [payouts, setPayouts] = useState([
        { id: '1', date: 'Oct 24, 2023', amount: 5000, status: 'SUCCESS', method: 'Bank Transfer' },
        { id: '2', date: 'Oct 15, 2023', amount: 7500, status: 'SUCCESS', method: 'UPI' },
        { id: '3', date: 'Oct 02, 2023', amount: 3200, status: 'SUCCESS', method: 'Bank Transfer' },
        { id: '4', date: 'Sep 24, 2023', amount: 5000, status: 'SUCCESS', method: 'Bank Transfer' },
    ]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleWithdraw = () => {
        toast({
            title: 'Withdrawal Initiated! 💸',
            description: `₹${stats.balance.toLocaleString()} will be sent to your bank account within 24 hours.`
        });
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
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Earnings <span className="text-amber-500">Analytics</span></h1>
                            <p className="text-gray-500 font-medium">Manage your payouts and financial performance.</p>
                        </div>
                        <Button className="gradient-primary h-12 px-8 rounded-2xl font-black shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                            <Download className="w-5 h-5" />
                            Report
                        </Button>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Wallet */}
                        <Card className="lg:col-span-2 p-8 border-none shadow-xl gradient-premium text-white rounded-3xl overflow-hidden relative group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                <Wallet className="w-48 h-48" />
                            </div>

                            <div className="relative z-10">
                                <p className="text-sm font-black uppercase tracking-widest opacity-80 mb-2">Available for Withdrawal</p>
                                <h2 className="text-5xl font-black mb-10">{formatCurrency(stats.balance)}</h2>

                                <div className="flex flex-wrap gap-4">
                                    <Button
                                        onClick={handleWithdraw}
                                        className="bg-white text-gray-900 hover:bg-gray-50 h-12 px-10 rounded-2xl font-black shadow-lg shadow-black/20"
                                    >
                                        Withdraw Funds
                                    </Button>
                                    <Button className="bg-white/20 hover:bg-white/30 border-none text-white h-12 px-6 rounded-2xl font-black backdrop-blur-md">
                                        Payout Settings
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/10 relative z-10">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Earnings</p>
                                    <p className="text-xl font-black">{formatCurrency(stats.totalWithdrawn + stats.balance)}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Success Payouts</p>
                                    <p className="text-xl font-black">24 Transactions</p>
                                </div>
                            </div>
                        </Card>

                        {/* Monthly Insight */}
                        <Card className="p-8 border-none shadow-sm bg-white rounded-3xl flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">This Month</p>
                                <h3 className="text-3xl font-black text-gray-900">{formatCurrency(stats.thisMonth)}</h3>
                                <div className="flex items-center gap-1.5 mt-2 text-emerald-600">
                                    <div className="w-5 h-5 bg-emerald-50 rounded-lg flex items-center justify-center">
                                        <TrendingUp className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-sm font-bold">+18% vs last month</span>
                                </div>
                            </div>

                            <div className="space-y-4 pt-8">
                                <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <PieChart className="w-4 h-4 text-gray-400" />
                                        <span className="text-xs font-black text-gray-600">Growth Score</span>
                                    </div>
                                    <span className="text-sm font-black text-amber-500">8.4/10</span>
                                </div>
                                <Button variant="ghost" className="w-full text-xs font-black text-gray-400 hover:text-gray-900 hover:bg-gray-50 h-10 rounded-xl">Breakdown Analysis</Button>
                            </div>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Payout History */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold px-2 flex items-center gap-2">
                                Payout History
                                <Badge className="bg-gray-100 text-gray-600 border-none px-2 rounded-lg">Recent</Badge>
                            </h3>
                            <div className="space-y-3">
                                {payouts.map((payout, i) => (
                                    <motion.div
                                        key={payout.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Card className="p-5 border-none shadow-sm bg-white rounded-3xl flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-emerald-600">
                                                    <ArrowUpRight className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-900">{payout.method}</p>
                                                    <p className="text-xs font-medium text-gray-400">{payout.date}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black text-gray-900">-{formatCurrency(payout.amount)}</p>
                                                <Badge className="bg-emerald-50 text-emerald-700 border-none font-black text-[10px] rounded-lg mt-1 px-2">COMPLETED</Badge>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                            <Button variant="ghost" className="w-full h-12 rounded-2xl border-dashed border-2 border-gray-100 font-bold text-gray-400 hover:text-gray-900">View All Transactions</Button>
                        </div>

                        {/* Financial Tips */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold px-2">Performance Center</h3>
                            <Card className="p-8 border-none shadow-sm bg-white rounded-3xl h-full">
                                <div className="space-y-8">
                                    <div className="flex gap-6 items-start">
                                        <div className="w-14 h-14 shrink-0 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                            <CreditCard className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-gray-900 mb-1">Weekly Targets</h4>
                                            <p className="text-sm text-gray-500 font-medium">You're ₹1,200 away from your weekly goal. Adding 2 products could help!</p>
                                            <div className="mt-4 w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                                                <div className="w-4/5 h-full bg-blue-500 rounded-full" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-6 items-start">
                                        <div className="w-14 h-14 shrink-0 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                            <BarChart3 className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-gray-900 mb-1">Top Selling Hours</h4>
                                            <p className="text-sm text-gray-500 font-medium">Most of your sales happen between 7 PM and 9 PM. Ensure stock is ready!</p>
                                            <Button variant="outline" className="mt-4 rounded-xl font-black h-9 text-[10px] uppercase border-gray-100 flex items-center gap-2">
                                                View Heatmap
                                                <ArrowRight className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
