'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    ShieldAlert,
    IndianRupee,
    BarChart3,
    Activity,
    Settings,
    Search,
    ShieldCheck,
    UserX,
    RefreshCcw,
    Zap,
    Map as MapIcon,
    AlertTriangle,
    CheckCircle2,
    ArrowUpRight,
    Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/use-toast';
import { useStore } from '@/lib/useStore';
import { Navbar } from '@/components/Navbar';

export default function AdminDashboard() {
    const router = useRouter();
    const { toast } = useToast();
    const user = useStore(useAuthStore, (state) => state.user);

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);

    useEffect(() => {
        if (!isMounted) return;
        if (user === null) {
            router.push('/auth/login');
            return;
        }
        if (user && user.role !== 'ADMIN') {
            router.push('/dashboard');
        }
    }, [user, isMounted]);

    const [activeUsers, setActiveUsers] = useState([
        { id: '1', name: 'Aayush Kumar', email: 'aayush@example.com', role: 'CUSTOMER', status: 'ACTIVE', joined: '20 Jan 2024' },
        { id: '2', name: 'Kirana Market', email: 'seller@example.com', role: 'SELLER', status: 'ACTIVE', joined: '15 Jan 2024' },
        { id: '3', name: 'Amit Singh', email: 'delivery@new.com', role: 'DELIVERY', status: 'ACTIVE', joined: '25 Jan 2024' },
        { id: '4', name: 'Scam User', email: 'bot@scam.com', role: 'CUSTOMER', status: 'FLAGGED', joined: '31 Jan 2024' },
    ]);

    const [fraudFlags, setFraudFlags] = useState([
        { id: 'F1', type: 'MULTIPLE_ACCOUNTS', description: '3 accounts linked to IP 192.168.1.45', severity: 'HIGH', status: 'OPEN' },
        { id: 'F2', type: 'OTP_ABUSE', description: 'Frequent OTP requests from +91 9988...77', severity: 'MEDIUM', status: 'OPEN' },
        { id: 'F3', type: 'PAYMENT_RISK', description: 'Large order sequence from new IP', severity: 'HIGH', status: 'OPEN' },
    ]);

    const [commission, setCommission] = useState(15.5);

    const handleBlockUser = (userId: string) => {
        setActiveUsers(activeUsers.map(u => u.id === userId ? { ...u, status: 'BLOCKED' } : u));
        toast({
            title: "User Blocked",
            description: "Access has been revoked immediately.",
            variant: "destructive"
        });
    };

    if (!isMounted || !user || user.role !== 'ADMIN') return null;

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Admin Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Command Center v2.0</span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">System <span className="text-red-600">Admin</span></h1>
                        <p className="text-gray-500 font-medium">Monitoring platform integrity and commercial metrics.</p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" className="h-12 px-6 rounded-2xl border-gray-100 font-bold gap-2">
                            <Activity className="w-4 h-4" /> System Health
                        </Button>
                        <Button className="h-12 px-8 rounded-2xl gradient-primary font-black shadow-lg">
                            Live Feed
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    {[
                        { label: 'Total Revenue', value: '₹4,82,910', icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Active Users', value: '1,245', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Fraud Flags', value: '12', icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-50' },
                        { label: 'Commission', value: `${commission}%`, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' }
                    ].map((stat, i) => (
                        <Card key={i} className="p-6 border-none shadow-sm rounded-3xl group hover:shadow-xl transition-all">
                            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h2 className="text-2xl font-black text-gray-900 leading-none">{stat.value}</h2>
                        </Card>
                    ))}
                </div>

                <Tabs defaultValue="users" className="space-y-8">
                    <TabsList className="bg-white p-1.5 rounded-2xl border-none shadow-sm inline-flex h-auto">
                        <TabsTrigger value="users" className="px-8 py-3 rounded-xl data-[state=active]:bg-gray-900 data-[state=active]:text-white font-black text-xs uppercase tracking-widest">Manage Users</TabsTrigger>
                        <TabsTrigger value="fraud" className="px-8 py-3 rounded-xl data-[state=active]:bg-gray-900 data-[state=active]:text-white font-black text-xs uppercase tracking-widest">Security Hub</TabsTrigger>
                        <TabsTrigger value="economics" className="px-8 py-3 rounded-xl data-[state=active]:bg-gray-900 data-[state=active]:text-white font-black text-xs uppercase tracking-widest">Economics</TabsTrigger>
                        <TabsTrigger value="analytics" className="px-8 py-3 rounded-xl data-[state=active]:bg-gray-900 data-[state=active]:text-white font-black text-xs uppercase tracking-widest">Analytics</TabsTrigger>
                    </TabsList>

                    <TabsContent value="users">
                        <Card className="border-none shadow-xl bg-white rounded-[3rem] overflow-hidden">
                            <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="relative w-full md:w-96 text-gray-400 focus-within:text-gray-900 transition-colors">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" />
                                    <Input placeholder="Search users by name, email or phone..." className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50/50" />
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="h-14 px-6 rounded-2xl border-gray-100 font-black text-xs uppercase tracking-widest gap-2">
                                        <Filter className="w-4 h-4" /> Filter
                                    </Button>
                                    <Button variant="outline" className="h-14 px-6 rounded-2xl border-gray-100 font-black text-xs uppercase tracking-widest gap-2">
                                        <ArrowUpRight className="w-4 h-4" /> Export
                                    </Button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">User Details</th>
                                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Joined</th>
                                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {activeUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50/30 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div>
                                                        <p className="font-black text-gray-900">{user.name}</p>
                                                        <p className="text-xs font-bold text-gray-400">{user.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <Badge className="bg-gray-100 text-gray-700 border-none font-black text-[10px]">{user.role}</Badge>
                                                </td>
                                                <td className="px-8 py-6 text-sm font-bold text-gray-500">{user.joined}</td>
                                                <td className="px-8 py-6">
                                                    <Badge className={`${user.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'} border-none font-black text-[10px]`}>
                                                        {user.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex gap-2">
                                                        <Button size="icon" variant="ghost" className="w-10 h-10 rounded-xl text-blue-600 hover:bg-blue-50">
                                                            <Activity className="w-4 h-4" />
                                                        </Button>
                                                        {user.status !== 'BLOCKED' && (
                                                            <Button size="icon" variant="ghost" onClick={() => handleBlockUser(user.id)} className="w-10 h-10 rounded-xl text-red-600 hover:bg-red-50">
                                                                <UserX className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="fraud">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex items-center justify-between px-2">
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Real-time Flags</h3>
                                    <Badge className="bg-red-100 text-red-700 font-bold px-4 py-2 border-none">3 UNRESOLVED</Badge>
                                </div>
                                <div className="space-y-4">
                                    {fraudFlags.map((flag) => (
                                        <Card key={flag.id} className="p-6 border-none shadow-sm rounded-[2rem] bg-white group hover:shadow-xl transition-all border-l-4 border-red-500">
                                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                                <div className="flex gap-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                                                        <AlertTriangle className="w-7 h-7" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-black text-gray-900">{flag.type}</h4>
                                                            <Badge className="bg-red-100/50 text-red-600 border-none font-black text-[8px] uppercase">{flag.severity}</Badge>
                                                        </div>
                                                        <p className="text-sm font-medium text-gray-500 leading-relaxed">{flag.description}</p>
                                                        <p className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-widest leading-none">Detection ID: {flag.id}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 self-end md:self-center">
                                                    <Button className="rounded-xl font-black text-xs px-6 h-10">Review</Button>
                                                    <Button variant="ghost" className="rounded-xl font-black text-xs px-6 h-10 text-gray-400">Ignore</Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-8">
                                <Card className="p-8 border-none shadow-sm bg-white rounded-[3rem]">
                                    <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                                        <RefreshCcw className="w-5 h-5 text-blue-500" /> Refund Queue
                                    </h3>
                                    <div className="space-y-4 mb-8">
                                        <div className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center group cursor-pointer hover:bg-emerald-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                                    <IndianRupee className="w-4 h-4 text-emerald-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-gray-900 mb-0.5">ORD-7721 Refund</p>
                                                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none">₹1,240.00</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-gray-300 group-hover:text-emerald-600 hover:bg-transparent">
                                                <ShieldCheck className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="mt-8 p-6 bg-red-50 rounded-[2rem] border border-red-100">
                                        <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-2 leading-none">Anti-Fraud Stat</p>
                                        <p className="text-xl font-black text-red-950 mb-1 leading-none">98.2%</p>
                                        <p className="text-xs font-medium text-red-800 opacity-70">Automated Block Precision</p>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="economics">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Card className="p-8 border-none shadow-sm bg-white rounded-[3rem] md:col-span-2">
                                <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Commission Settings</h3>
                                <p className="text-gray-500 font-medium mb-10">Global platform fee charged on every completed delivery.</p>

                                <div className="space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-end">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Platform Fee</p>
                                                <h4 className="text-3xl font-black text-gray-900 leading-none">{commission}%</h4>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="50"
                                                step="0.5"
                                                value={commission}
                                                onChange={(e) => setCommission(parseFloat(e.target.value))}
                                                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-red-600"
                                            />
                                            <div className="flex justify-between text-[10px] font-black text-gray-400">
                                                <span>OFF (0%)</span>
                                                <span>MAX (50%)</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-6 rounded-[2rem] bg-gray-50">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Avg Yield</p>
                                                <p className="text-xl font-black text-emerald-600">₹42.50</p>
                                            </div>
                                            <div className="p-6 rounded-[2rem] bg-gray-50">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Seller Take</p>
                                                <p className="text-xl font-black text-blue-600">84.5%</p>
                                            </div>
                                        </div>
                                    </div>
                                    <Button className="h-14 px-10 rounded-2xl font-black text-lg shadow-lg gradient-primary">
                                        Update Commercial Rules
                                    </Button>
                                </div>
                            </Card>

                            <div className="space-y-8">
                                <Card className="p-8 border-none shadow-xl bg-gray-900 text-white rounded-[3rem] overflow-hidden relative">
                                    <div className="absolute top-0 right-0 p-8 opacity-20">
                                        <Zap className="w-20 h-20 text-amber-500 fill-amber-500" />
                                    </div>
                                    <h3 className="text-xl font-black mb-2">Surge Pricing</h3>
                                    <p className="text-xs font-medium opacity-60 mb-8 leading-relaxed">Dynamic multiplier currently active in South Mumbai area.</p>
                                    <div className="bg-white/10 p-4 rounded-2xl border border-white/10 mb-6">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-bold opacity-60 uppercase tracking-widest">Current Multiplier</span>
                                            <span className="text-lg font-black text-amber-400">1.4x</span>
                                        </div>
                                    </div>
                                    <Button className="w-full h-12 bg-white text-gray-900 hover:bg-gray-100 rounded-xl font-black text-xs uppercase tracking-widest">
                                        Adjust Parameters
                                    </Button>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="analytics">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Card className="p-8 border-none shadow-sm bg-white rounded-[3rem] md:col-span-2 relative overflow-hidden h-[500px]">
                                <h3 className="text-2xl font-black text-gray-900 mb-8 tracking-tight flex items-center gap-3">
                                    <MapIcon className="w-6 h-6 text-blue-500" /> Order Heatmap
                                </h3>
                                {/* Simulated Heatmap Background */}
                                <div className="absolute inset-0 top-24 m-8 bg-gray-100 rounded-[2.5rem] overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/72.8777,19.0760,11,0/800x600?access_token=pk.eyJ1IjoiZGVtbyIsImEiOiJjbGVhbiJ9')] bg-cover opacity-60 grayscale" />

                                    {/* Heatmap Blobs */}
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.4, 0.6] }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                        className="absolute top-1/3 left-1/4 w-32 h-32 bg-red-600/30 blur-3xl rounded-full"
                                    />
                                    <motion.div
                                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.3, 0.5] }}
                                        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                                        className="absolute top-1/2 left-2/3 w-48 h-48 bg-amber-500/40 blur-[80px] rounded-full"
                                    />
                                    <motion.div
                                        animate={{ scale: [1, 1.4, 1], opacity: [0.7, 0.4, 0.7] }}
                                        transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                                        className="absolute bottom-1/4 left-1/2 w-40 h-40 bg-emerald-500/30 blur-3xl rounded-full"
                                    />

                                    <div className="absolute bottom-6 left-6 flex flex-col gap-2">
                                        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-white">
                                            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">High Demand Zone</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-white">
                                            <div className="w-2 h-2 rounded-full bg-red-500/30" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Normal Load</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <div className="space-y-8">
                                <Card className="p-8 border-none shadow-sm bg-white rounded-[3rem]">
                                    <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-emerald-500" /> Platform Logs
                                    </h3>
                                    <div className="space-y-6">
                                        {[
                                            { t: '12:45:01', a: 'COMMISSION_UPDATE', u: 'Admin', icon: Zap },
                                            { t: '12:42:15', a: 'USER_BLOCKED', u: 'System', icon: ShieldAlert },
                                            { t: '12:38:40', a: 'REVENUE_TRANSFER', u: 'System', icon: IndianRupee },
                                            { t: '12:35:12', a: 'BULK_IMPORT', u: 'Seller_82', icon: ArrowUpRight },
                                        ].map((log, i) => (
                                            <div key={i} className="flex items-start gap-4">
                                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                                                    <log.icon className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-900 mb-0.5 leading-none">{log.a}</p>
                                                    <p className="text-[8px] font-bold text-gray-400 leading-none">{log.t} • {log.u}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Button variant="outline" className="w-full mt-10 h-12 rounded-xl border-gray-100 font-bold text-xs uppercase tracking-widest">
                                        View All Logs
                                    </Button>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
