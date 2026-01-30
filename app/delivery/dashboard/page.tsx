'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Package,
    TrendingUp,
    History,
    Users,
    Settings,
    LogOut,
    CheckCircle2,
    Clock,
    AlertCircle,
    MapPin,
    Navigation,
    Phone,
    IndianRupee,
    ArrowRight,
    MessageSquare,
    HelpCircle,
    Star,
    ChevronRight,
    X,
    Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/use-toast';
import { useStore } from '@/lib/useStore';
import { Separator } from '@/components/ui/separator';
import { Navbar } from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRealTimeNotifications } from '@/lib/realtime';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
} as const;

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
} as const;

const cardHover = {
    initial: { scale: 1, boxShadow: "0px 0px 0px rgba(0,0,0,0)" },
    hover: {
        scale: 1.02,
        boxShadow: "0px 20px 40px rgba(0,0,0,0.08)",
        transition: { type: "spring", stiffness: 400, damping: 25 }
    }
} as const;

export default function DeliveryDashboardPage() {
    const router = useRouter();
    const { toast } = useToast();
    const user = useStore(useAuthStore, (state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    // Dynamic Logistics Listener
    useRealTimeNotifications('DELIVERY', (message) => {
        toast({
            title: "New Dispatch Alert 🚀",
            description: message,
            duration: 5000,
        });
    });

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;
        if (user === null) {
            router.push('/auth/login');
            return;
        }
        if (user && user.role !== 'DELIVERY') {
            router.push('/dashboard');
            return;
        }

        const fetchData = async () => {
            try {
                // 1. Fetch live orders (READY for pickup)
                const liveRes = await fetch('/api/orders?status=READY');
                if (liveRes.ok) {
                    const data = await liveRes.json();
                    setLiveOrders(data.filter((o: any) => !o.deliveryPartnerId).map((o: any) => ({
                        id: o.orderNumber,
                        customer: o.customer.name,
                        address: o.address.street + ', ' + o.address.city,
                        items: o.items.length,
                        distance: (Math.random() * 5 + 1).toFixed(1) + ' km',
                        time: (Math.random() * 20 + 10).toFixed(0) + ' min',
                        payout: Math.floor(o.totalAmount * 0.1) + 20, // 10% commission + base
                        status: o.status,
                        restaurant: 'Pappertech Merch'
                    })));
                }

                // 2. Fetch active trip for this driver
                const tripRes = await fetch(`/api/orders?deliveryPartnerId=${user.id}&status=PICKED_UP`);
                if (tripRes.ok) {
                    const data = await tripRes.json();
                    if (data.length > 0) {
                        const trip = data[0];
                        setActiveTrip({
                            id: trip.orderNumber,
                            customer: trip.customer.name,
                            address: trip.address.street + ', ' + trip.address.city,
                            items: trip.items.length,
                            payout: Math.floor(trip.totalAmount * 0.1) + 20,
                            status: trip.status
                        });
                    }
                }

                // 3. Fetch earnings/history stats
                const historyRes = await fetch(`/api/orders?deliveryPartnerId=${user.id}&status=DELIVERED`);
                if (historyRes.ok) {
                    const data = await historyRes.json();
                    const totalPay = data.reduce((acc: number, o: any) => acc + (Math.floor(o.totalAmount * 0.1) + 20), 0);
                    setStats({
                        todayEarnings: totalPay,
                        completedToday: data.length,
                        totalKilometers: data.length * 4,
                        rating: 4.8
                    });
                }
            } catch (err) {
                console.error('Failed to fetch delivery data:', err);
            }
        };

        fetchData();
    }, [user, isMounted]);

    const [liveOrders, setLiveOrders] = useState([
        {
            id: 'ORD-9901',
            customer: 'Anita Desai',
            address: 'Juhu Tara Rd, Santacruz West, Mumbai',
            items: 5,
            distance: '2.4 km',
            time: '12 min',
            payout: 45,
            status: 'NEW',
            restaurant: 'Fresh Choice Supermarket'
        },
        {
            id: 'ORD-9902',
            customer: 'Karan Malhotra',
            address: 'Bandra Kurla Complex, Mumbai',
            items: 2,
            distance: '4.8 km',
            time: '18 min',
            payout: 62,
            status: 'NEW',
            restaurant: 'Green Valley Grocers'
        }
    ]);

    const [activeTrip, setActiveTrip] = useState<any>(null);
    const [stats, setStats] = useState({
        todayEarnings: 840,
        completedToday: 12,
        totalKilometers: 38,
        rating: 4.9
    });

    const handleAccept = async (orderNumber: string) => {
        // Find the actual order ID from the orders list if we had it, 
        // but since we are using orderNumber in the UI, we need to map back or use orderNumber
        // For simplicity in this demo flow, we assume we have the order.id
        const order = liveOrders.find(o => o.id === orderNumber);
        if (!order) return;

        try {
            // In a real app, we'd fetch the order ID first or pass it from the API
            // Here we'll simulate the identification and assignment
            const { logisticsEmitter } = await import('@/lib/realtime');

            // Note: We need the full DB ID for the status update
            // For now, we'll use the orderNumber as a proxy if it matches the DB ID pattern, 
            // or fetch the order by number.
            const res = await fetch(`/api/orders?orderNumber=${orderNumber}`);
            const orders = await res.json();
            const dbOrder = orders[0];

            if (dbOrder) {
                // Assign driver and update status
                await fetch(`/api/orders/${dbOrder.id}/status`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        status: 'PICKED_UP',
                        deliveryPartnerId: user?.id
                    })
                });

                setActiveTrip({ ...order, status: 'PICKED_UP' });
                setLiveOrders(liveOrders.filter(o => o.id !== orderNumber));

                logisticsEmitter.emit({
                    type: 'DELIVERY_PICKED',
                    orderId: orderNumber
                });

                toast({
                    title: "Trip Accepted",
                    description: "Order picked up. Redirecting to navigation...",
                });
            }
        } catch (err) {
            console.error('Acceptance failed:', err);
        }
    };

    const handleReject = (orderId: string) => {
        setLiveOrders(liveOrders.filter(o => o.id !== orderId));
        toast({
            variant: "destructive",
            title: "Order Rejected",
            description: "No worries, we'll find another one for you.",
        });
    };

    const [isWithdrawing, setIsWithdrawing] = useState(false);

    const handleWithdrawal = () => {
        if (stats.todayEarnings === 0) {
            toast({
                title: "No balance available",
                description: "You've already withdrawn your daily earnings.",
                variant: "destructive"
            });
            return;
        }

        setIsWithdrawing(true);

        // Simulate bank transfer delay
        setTimeout(() => {
            const amount = stats.todayEarnings.toFixed(2);
            setStats(prev => ({ ...prev, todayEarnings: 0 }));
            setIsWithdrawing(false);

            toast({
                title: "Withdrawal Successful! 🏦",
                description: `₹${amount} has been transferred to your linked bank account.`,
            });

            // Trigger confetti effect if possible (we'll implement the global effect later, 
            // for now use toast and success state)
        }, 2000);
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        logout();
        router.push('/');
    };

    if (!isMounted || !user) return null;

    return (
        <div className="min-h-screen bg-[#fafafa] pb-12">
            <Navbar />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            >
                {/* Delivery Header */}
                <motion.div
                    variants={itemVariants}
                    className="bg-gray-900 text-white p-8 rounded-[3rem] shadow-2xl mb-10 overflow-hidden relative group"
                >
                    <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700">
                        <Navigation className="w-40 h-40 text-amber-500" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Badge className="bg-emerald-500 text-white border-none font-black text-[10px] px-3 py-1 animate-pulse">ONLINE</Badge>
                                <span className="text-gray-400 font-bold text-sm">Fleet Partner</span>
                            </div>
                            <h1 className="text-4xl font-black tracking-tight leading-tight">Delivery <span className="text-amber-500">Fleet</span></h1>
                            <p className="text-gray-400 mt-2 font-medium max-w-md">Safe travels, {user?.name}. We're tracking your live progress and ensuring smooth dispatches.</p>
                        </div>
                        <motion.div variants={containerVariants} className="flex gap-4">
                            {[
                                { label: "Today's Pay", value: `₹${stats.todayEarnings}`, color: 'text-amber-500' },
                                { label: "Completed", value: stats.completedToday, color: 'text-white' }
                            ].map((s) => (
                                <motion.div key={s.label} variants={itemVariants} whileHover={{ scale: 1.05 }}>
                                    <Card className="bg-white/5 border border-white/10 p-5 rounded-[2rem] backdrop-blur-md">
                                        <p className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-widest leading-none">{s.label}</p>
                                        <h3 className={`text-2xl font-black ${s.color} leading-none`}>{s.value}</h3>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>

                <Tabs defaultValue="home" className="space-y-8">
                    <TabsList className="bg-white p-1.5 rounded-2xl border-none shadow-sm inline-flex h-auto w-full md:w-auto overflow-x-auto no-scrollbar">
                        <TabsTrigger value="home" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow-md font-bold text-sm">Dashboard</TabsTrigger>
                        <TabsTrigger value="live" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow-md font-bold text-sm">Live Orders</TabsTrigger>
                        <TabsTrigger value="earnings" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow-md font-bold text-sm">Earnings</TabsTrigger>
                        <TabsTrigger value="history" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow-md font-bold text-sm">History</TabsTrigger>
                        <TabsTrigger value="profile" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow-md font-bold text-sm">Profile</TabsTrigger>
                    </TabsList>

                    <TabsContent value="home">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                {/* Active Trip Preview */}
                                {activeTrip ? (
                                    <Card className="p-8 border-none shadow-xl bg-white rounded-[3rem] relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 w-1/3 h-full bg-emerald-50/50 flex items-center justify-center">
                                            <div className="text-center">
                                                <p className="text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Est. Arrival</p>
                                                <h2 className="text-4xl font-black text-emerald-600">8m</h2>
                                            </div>
                                        </div>
                                        <div className="relative z-10 space-y-6">
                                            <div className="flex items-center gap-3">
                                                <Badge className="bg-emerald-100 text-emerald-700 border-none font-black rounded-lg">ACTIVE TRIP</Badge>
                                                <span className="text-gray-400 font-bold ml-auto">{activeTrip.id}</span>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-widest">Delivery To</p>
                                                <h4 className="text-2xl font-black text-gray-900">{activeTrip.customer}</h4>
                                                <div className="flex items-start gap-2 text-gray-500 mt-2">
                                                    <MapPin className="w-4 h-4 shrink-0 mt-1" />
                                                    <p className="font-medium text-sm leading-relaxed">{activeTrip.address}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 pt-4">
                                                <div className="flex-1 space-y-4">
                                                    <div className="h-40 bg-gray-50 rounded-2xl overflow-hidden relative border border-gray-100 p-4">
                                                        <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/80.25,12.97,14,0/600x400?access_token=pk.eyJ1IjoiZGVtbyIsImEiOiJjbGVhbiJ9')] bg-cover opacity-20 grayscale" />
                                                        <div className="relative h-full flex flex-col justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                                                                <span className="text-[10px] font-black text-gray-400 uppercase">Pickup: Store</span>
                                                            </div>
                                                            <div className="w-[2px] flex-1 bg-dashed bg-gradient-to-b from-blue-500 to-amber-500 ml-[5px] my-1 opacity-30" />
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                                                                <span className="text-[10px] font-black text-gray-400 uppercase">Drop: Anita Desai</span>
                                                            </div>
                                                        </div>
                                                        <motion.div
                                                            animate={{ y: [0, 80, 0] }}
                                                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                                            className="absolute left-[16.5px] top-10 w-2 h-2 bg-white border-2 border-amber-500 rounded-full z-20"
                                                        />
                                                    </div>

                                                    <div className="flex gap-3">
                                                        <Button className="flex-1 gradient-primary h-14 rounded-2xl font-black text-lg gap-2 shadow-lg shadow-amber-500/20">
                                                            <Navigation className="w-5 h-5" /> Start Trip
                                                        </Button>
                                                        <Button variant="outline" className="h-14 w-14 rounded-2xl border-gray-100 hover:bg-gray-50">
                                                            <Phone className="w-5 h-5 text-gray-600" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ) : (
                                    <Card className="p-10 border-none shadow-sm bg-white rounded-[3rem] text-center">
                                        <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
                                            <Package className="w-10 h-10 text-gray-300" />
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-900 mb-2">Ready for Missions?</h3>
                                        <p className="text-gray-500 font-medium mb-8">Go to Live Orders tab to accept your first delivery.</p>
                                        <Button
                                            onClick={() => {
                                                const triggers = document.querySelectorAll('[role="tab"]');
                                                (triggers[1] as HTMLElement).click();
                                            }}
                                            className="gradient-primary h-14 px-10 rounded-2xl font-black shadow-lg"
                                        >
                                            View Available Orders
                                        </Button>
                                    </Card>
                                )}

                                {/* Performance Metrics */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card className="p-8 border-none shadow-sm bg-white rounded-[2.5rem]">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                                <Clock className="w-6 h-6" />
                                            </div>
                                            <Badge variant="outline" className="border-emerald-100 text-emerald-600 font-black">+8% Better</Badge>
                                        </div>
                                        <h3 className="text-3xl font-black text-gray-900">14.2m</h3>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Avg. Delivery Time</p>
                                    </Card>
                                    <Card className="p-8 border-none shadow-sm bg-white rounded-[2.5rem]">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                                                <Star className="w-6 h-6 fill-amber-500" />
                                            </div>
                                            <Badge variant="outline" className="border-gray-100 text-gray-400 font-black">Top Partner</Badge>
                                        </div>
                                        <h3 className="text-3xl font-black text-gray-900">{stats.rating}</h3>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Customer Sentiment</p>
                                    </Card>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <Card className="p-8 border-none shadow-sm bg-white rounded-[3rem]">
                                    <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                                        <HelpCircle className="w-5 h-5 text-blue-500" /> Support
                                    </h3>
                                    <div className="space-y-4">
                                        <Button variant="outline" className="w-full h-14 justify-between px-6 rounded-2xl border-gray-100 font-bold hover:bg-gray-50 text-gray-600">
                                            Accident / Emergency <ChevronRight className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" className="w-full h-14 justify-between px-6 rounded-2xl border-gray-100 font-bold hover:bg-gray-50 text-gray-600">
                                            App Issues <ChevronRight className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" className="w-full h-14 justify-between px-6 rounded-2xl border-gray-100 font-bold hover:bg-gray-50 text-gray-600">
                                            Payment Delayed <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="mt-10 p-6 bg-blue-50 rounded-[2rem] border border-blue-100">
                                        <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2">Live Support</p>
                                        <p className="text-sm font-medium text-blue-900 mb-4">Dispatcher is online and ready to assist you.</p>
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 font-black text-xs">Chat Now</Button>
                                    </div>
                                </Card>

                                <Card className="p-8 border-none shadow-xl bg-gray-900 text-white rounded-[3rem] overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                                        <IndianRupee className="w-20 h-20" />
                                    </div>
                                    <h3 className="text-xl font-black mb-1 leading-tight">Quick Withdrawal</h3>
                                    <p className="text-xs font-medium opacity-60 mb-8 leading-relaxed">Daily earnings can be instantly transferred to your bank.</p>
                                    <Button
                                        onClick={handleWithdrawal}
                                        disabled={isWithdrawing || stats.todayEarnings === 0}
                                        className="w-full h-14 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black shadow-lg transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {isWithdrawing ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Processing Transfer...
                                            </div>
                                        ) : stats.todayEarnings > 0 ? (
                                            `Transfer ₹${stats.todayEarnings.toFixed(2)}`
                                        ) : (
                                            "Transfer Complete ✅"
                                        )}
                                    </Button>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="live">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Available Deliveries</h3>
                                    <p className="text-sm font-medium text-gray-500">Accepted orders will appear in your Active Trips.</p>
                                </div>
                                <Badge className="bg-amber-100 text-amber-700 border-none font-black px-4 py-2">{liveOrders.length} Potential</Badge>
                            </div>

                            {liveOrders.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <AnimatePresence mode="popLayout">
                                        {liveOrders.map((order, i) => (
                                            <motion.div
                                                key={order.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Card className="p-8 border-none shadow-sm bg-white rounded-[3rem] hover:shadow-xl transition-all group overflow-hidden">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div>
                                                            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-none mb-2">Distance: {order.distance}</p>
                                                            <h4 className="text-2xl font-black text-gray-900">{order.restaurant}</h4>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Potential</p>
                                                            <h3 className="text-2xl font-black text-emerald-600 leading-none">₹{order.payout}</h3>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl mb-8">
                                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                                            <Users className="w-5 h-5 text-gray-400" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 leading-none">{order.customer}</p>
                                                            <p className="text-xs font-medium text-gray-500 mt-1 truncate max-w-[200px]">{order.address}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-4">
                                                        <Button
                                                            onClick={() => handleAccept(order.id)}
                                                            className="flex-1 bg-gray-900 hover:bg-black text-white h-14 rounded-2xl font-black gap-2 shadow-lg"
                                                        >
                                                            <Check className="w-5 h-5" /> Accept Order
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleReject(order.id)}
                                                            variant="outline"
                                                            className="h-14 w-14 rounded-2xl border-gray-100 hover:bg-gray-50 group-hover:border-red-100 group-hover:bg-red-50 transition-colors"
                                                        >
                                                            <X className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
                                                        </Button>
                                                    </div>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Card className="p-20 border-none shadow-sm bg-white rounded-[3rem] text-center">
                                    <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
                                        <Clock className="w-10 h-10 text-gray-300 animate-pulse" />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-2">Searching for Orders...</h3>
                                    <p className="text-gray-500 font-medium max-w-sm mx-auto">We're scanning your area for new delivery missions. Hang tight!</p>
                                </Card>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="earnings">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <Card className="p-8 border-none shadow-sm bg-white rounded-[3rem]">
                                    <div className="flex items-center justify-between mb-10">
                                        <h3 className="text-xl font-black text-gray-900">Trip Wise Income</h3>
                                        <Button variant="ghost" className="text-xs font-black text-amber-500 uppercase tracking-widest">Download Statement</Button>
                                    </div>
                                    <div className="space-y-6">
                                        {[
                                            { id: 'T-9921', time: '12:45 PM', distance: '3.4km', amount: 85, surge: 15 },
                                            { id: 'T-9920', time: '11:20 AM', distance: '2.1km', amount: 42, surge: 0 },
                                            { id: 'T-9919', time: '10:05 AM', distance: '5.2km', amount: 98, surge: 25 },
                                            { id: 'T-9918', time: '09:15 AM', distance: '1.8km', amount: 35, surge: 0 },
                                        ].map((trip, i) => (
                                            <div key={i} className="flex items-center justify-between p-6 rounded-[2rem] bg-gray-50 hover:bg-white hover:shadow-xl transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center font-black text-gray-400 group-hover:text-amber-500 group-hover:rotate-12 transition-all">
                                                        <TrendingUp className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-gray-900">{trip.id}</h4>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{trip.time} • {trip.distance}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-black text-gray-900">₹{trip.amount + trip.surge}</p>
                                                    {trip.surge > 0 && <span className="text-[8px] font-black text-emerald-600 uppercase">Includes Surge</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>

                            <div className="space-y-8">
                                <Card className="p-8 border-none shadow-sm bg-white rounded-[3rem]">
                                    <h3 className="text-xl font-black text-gray-900 mb-8">Earning Stats</h3>
                                    <div className="space-y-8">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Base Pay</p>
                                            <div className="flex justify-between items-end">
                                                <h4 className="text-2xl font-black text-gray-900">₹6,420</h4>
                                                <span className="text-xs font-bold text-gray-400">76% of total</span>
                                            </div>
                                            <div className="h-2 bg-gray-50 rounded-full mt-3 overflow-hidden">
                                                <div className="w-[76%] h-full bg-blue-500 rounded-full" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Surge & Bonuses</p>
                                            <div className="flex justify-between items-end">
                                                <h4 className="text-2xl font-black text-emerald-600">₹1,850</h4>
                                                <span className="text-xs font-bold text-gray-400">24% of total</span>
                                            </div>
                                            <div className="h-2 bg-gray-50 rounded-full mt-3 overflow-hidden">
                                                <div className="w-[24%] h-full bg-emerald-500 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="history">
                        <Card className="p-0 border-none shadow-sm bg-white rounded-[3rem] overflow-hidden">
                            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                                <h3 className="text-xl font-black text-gray-900">Completed Orders</h3>
                                <Badge className="bg-gray-100 text-gray-600 border-none font-bold">Oct 2023</Badge>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Order ID</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Date</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Destination</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Payout</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Rating</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {[
                                            { id: 'ORD-8822', date: 'Oct 30', dest: 'Versova, Mumbai', pay: 85, rating: 5 },
                                            { id: 'ORD-8821', date: 'Oct 30', dest: 'Andheri East, Mumbai', pay: 42, rating: 4 },
                                            { id: 'ORD-8815', date: 'Oct 29', dest: 'Goregaon West, Mumbai', pay: 112, rating: 5 },
                                            { id: 'ORD-8812', date: 'Oct 29', dest: 'Malad West, Mumbai', pay: 55, rating: 5 },
                                        ].map((row, i) => (
                                            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-8 py-6 font-black text-gray-900">{row.id}</td>
                                                <td className="px-8 py-6 text-sm font-bold text-gray-500">{row.date}</td>
                                                <td className="px-8 py-6 text-sm font-bold text-gray-900">{row.dest}</td>
                                                <td className="px-8 py-6 font-black text-emerald-600">₹{row.pay}</td>
                                                <td className="px-8 py-6">
                                                    <div className="flex gap-0.5">
                                                        {[...Array(row.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="profile">
                        <div className="max-w-2xl mx-auto space-y-8">
                            <Card className="p-10 border-none shadow-sm bg-white rounded-[3rem] text-center">
                                <div className="relative w-32 h-32 mx-auto mb-6">
                                    <div className="w-full h-full rounded-[2.5rem] bg-amber-100 flex items-center justify-center text-4xl font-black text-amber-600 overflow-hidden">
                                        {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user?.name?.charAt(0)}
                                    </div>
                                    <Button size="icon" className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl gradient-primary text-white shadow-lg border-4 border-white">
                                        <Settings className="w-4 h-4" />
                                    </Button>
                                </div>
                                <h3 className="text-3xl font-black text-gray-900">{user?.name}</h3>
                                <p className="text-gray-500 font-bold mb-8">{user?.email}</p>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-6 rounded-[2rem] bg-gray-50 text-left">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Fleet Partner Since</p>
                                        <p className="font-black text-gray-900">Jan 2024</p>
                                    </div>
                                    <div className="p-6 rounded-[2rem] bg-gray-50 text-left">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Vehicle Type</p>
                                        <p className="font-black text-gray-900">EV Scooter</p>
                                    </div>
                                </div>
                            </Card>

                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                className="w-full h-16 rounded-[2rem] border-red-50 text-red-500 font-black hover:bg-red-50 hover:border-red-100 transition-all gap-3"
                            >
                                <LogOut className="w-5 h-5" /> Logout from Device
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </div>
    );
}
