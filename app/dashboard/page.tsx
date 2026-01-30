'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag,
    Heart,
    User,
    MapPin,
    CreditCard,
    Settings,
    LogOut,
    Package,
    Clock,
    CheckCircle,
    TrendingUp,
    Bell,
    Truck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/use-toast';
import { useStore } from '@/lib/useStore';
import { Separator } from '@/components/ui/separator';
import { Navbar } from '@/components/Navbar';
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

export default function DashboardPage() {
    const router = useRouter();
    const { toast } = useToast();

    // Listen for Real-time Order Updates
    useRealTimeNotifications('CUSTOMER', (message) => {
        toast({
            title: "Order Update 🔔",
            description: message,
            duration: 6000,
        });
        fetchDashboardData(); // Refresh orders to show new status
    });

    // Use useStore for persisted user state
    const user = useStore(useAuthStore, (state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const [orders, setOrders] = useState<any[]>([]);
    const [stats, setStats] = useState({
        activeOrders: 0,
        totalOrders: 0,
        wishlistItems: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    // Initial check to avoid flickering during local storage load
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

        if (user) {
            if (user.role === 'SELLER') {
                router.push('/seller/dashboard');
                return;
            }
            if (user.role === 'DELIVERY') {
                router.push('/delivery/dashboard');
                return;
            }
            if (user.role === 'ADMIN') {
                router.push('/admin/dashboard');
                return;
            }
            fetchDashboardData();
        }
    }, [user, isMounted]);

    const fetchDashboardData = async () => {
        try {
            // Fetch orders
            const ordersRes = await fetch(`/api/orders?userId=${user?.id}`);
            const ordersData = await ordersRes.json();

            if (ordersRes.ok) {
                setOrders(ordersData.orders.slice(0, 5)); // Latest 5 orders
                setStats({
                    activeOrders: ordersData.orders.filter((o: any) =>
                        ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'PICKED_UP'].includes(o.status)
                    ).length,
                    totalOrders: ordersData.orders.length,
                    wishlistItems: 0, // TODO: Implement wishlist count
                });
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            logout();
            toast({
                title: 'Logged Out',
                description: 'You have been successfully logged out.',
            });
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            ACCEPTED: 'bg-blue-100 text-blue-800',
            PREPARING: 'bg-purple-100 text-purple-800',
            READY: 'bg-green-100 text-green-800',
            PICKED_UP: 'bg-indigo-100 text-indigo-800',
            DELIVERED: 'bg-green-100 text-green-800',
            CANCELLED: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (isLoading || !isMounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 pb-12 overflow-x-hidden">
            <Navbar />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            >
                {/* Welcome Section */}
                <motion.div
                    variants={itemVariants}
                    className="mb-8 p-8 glass rounded-[3rem] shadow-xl border border-white/50 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary/20 transition-colors" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">
                                Hello, <span className="text-gradient">{user?.name}</span>!
                            </h1>
                            <p className="text-gray-600 font-medium">
                                You have <span className="font-bold text-primary">{stats.activeOrders}</span> active orders right now.
                            </p>
                        </div>
                        <Link href="/dashboard/profile">
                            <Button className="gradient-premium shadow-xl hover:scale-105 active:scale-95 transition-all h-12 px-8 rounded-2xl font-bold">
                                Edit Profile
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Stats & Wallet Grid */}
                    <motion.div variants={containerVariants} className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { label: 'Active Orders', value: stats.activeOrders, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
                            { label: 'Total Orders', value: stats.totalOrders, icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
                            { label: 'Wallet Balance', value: '₹125.50', icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50' }
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                variants={itemVariants}
                                whileHover="hover"
                            >
                                <motion.div variants={cardHover}>
                                    <Card className="p-6 glass border-none shadow-sm hover:border-white/50 transition-colors">
                                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                                            <stat.icon className="w-6 h-6" />
                                        </div>
                                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                                        <h2 className="text-3xl font-black text-gray-900 mt-1">{stat.value}</h2>
                                    </Card>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Quick Access List */}
                    <motion.div variants={itemVariants} whileHover="hover">
                        <motion.div variants={cardHover} className="h-full">
                            <Card className="p-6 glass border-none overflow-hidden relative group h-full shadow-sm hover:border-white/50 transition-colors">
                                <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 group-hover:scale-110 transition-transform">
                                    <TrendingUp className="w-24 h-24" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 flex items-center">
                                    <TrendingUp className="w-5 h-5 mr-2 text-primary" /> Shortcuts
                                </h3>
                                <div className="space-y-3 relative z-10">
                                    {[
                                        { label: 'Track Orders', icon: Package, href: '/dashboard/orders' },
                                        { label: 'Address Book', icon: MapPin, href: '/dashboard/addresses' },
                                        { label: 'Notifications', icon: Bell, href: '/dashboard/notifications' },
                                    ].map((item) => (
                                        <Link key={item.label} href={item.href}>
                                            <button className="w-full flex items-center p-3 rounded-xl hover:bg-white/50 transition-all font-bold text-gray-700 hover:text-primary active:scale-95">
                                                <item.icon className="w-4 h-4 mr-3" />
                                                {item.label}
                                            </button>
                                        </Link>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Live Order Tracking - DYNAMIC */}
                <AnimatePresence mode="wait">
                    {orders.length > 0 && ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'PICKED_UP'].includes(orders[0].status) && (
                        <motion.div
                            key="live-tracking"
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", damping: 20, stiffness: 100 }}
                            className="mb-8"
                        >
                            <Card className="p-8 glass border-none relative overflow-hidden group shadow-2xl">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
                                <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge className="bg-green-100 text-green-700 font-black border-none animate-pulse">LIVE TRACKING</Badge>
                                            <span className="text-sm font-bold text-gray-400">#{orders[0].orderNumber}</span>
                                        </div>
                                        <h2 className="text-3xl font-black text-gray-900">
                                            {orders[0].status === 'PICKED_UP' ? 'On the way' :
                                                orders[0].status === 'PREPARING' ? 'Preparing your meal' :
                                                    orders[0].status === 'ACCEPTED' ? 'Kitchen busy' :
                                                        'Order Placed'}
                                        </h2>
                                    </div>
                                    {orders[0].deliveryPartner && (
                                        <div className="flex items-center gap-4 bg-white/50 p-4 rounded-3xl backdrop-blur-md border border-white/20">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-green-400 to-blue-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                                                {orders[0].deliveryPartner.avatar ? <img src={orders[0].deliveryPartner.avatar} className="w-full h-full rounded-2xl object-cover" alt="Partner" /> : orders[0].deliveryPartner.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Delivery Partner</p>
                                                <p className="font-bold text-gray-900 text-lg">{orders[0].deliveryPartner.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Button size="sm" variant="outline" className="h-8 rounded-xl font-bold text-xs hover:bg-white transition-colors">Call Partner</Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Tracking Progress Map */}
                                <div className="relative">
                                    <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-100 -translate-y-1/2 rounded-full" />
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: orders[0].status === 'PENDING' ? '5%' :
                                                orders[0].status === 'ACCEPTED' ? '30%' :
                                                    orders[0].status === 'PREPARING' ? '60%' :
                                                        orders[0].status === 'READY' ? '85%' :
                                                            orders[0].status === 'PICKED_UP' ? '95%' : '100%'
                                        }}
                                        className="absolute top-1/2 left-0 h-2 gradient-primary -translate-y-1/2 rounded-full relative overflow-hidden"
                                        transition={{ duration: 1.5, ease: "circOut" }}
                                    >
                                        <motion.div
                                            animate={{ x: ['-100%', '100%'] }}
                                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                        />
                                    </motion.div>

                                    <div className="relative flex justify-between">
                                        {[
                                            { id: 'PENDING', label: 'Placed', icon: CheckCircle },
                                            { id: 'PREPARING', label: 'Preparing', icon: Clock },
                                            { id: 'PICKED_UP', label: 'On Way', icon: Truck },
                                            { id: 'DELIVERED', label: 'Arrived', icon: MapPin }
                                        ].map((step) => {
                                            const isDone = orders[0].statusHistory?.some((h: any) => h.status === step.id) ||
                                                (step.id === 'PENDING' && orders[0].status !== 'CANCELLED');
                                            const isCurrent = orders[0].status === step.id;

                                            return (
                                                <div key={step.id} className="flex flex-col items-center">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center relative z-10 transition-all duration-500 ${isDone ? 'bg-primary text-white scale-110 shadow-lg shadow-green-200' : 'bg-white border-2 border-gray-100 text-gray-300'
                                                        }`}>
                                                        <step.icon className="w-5 h-5" />
                                                        {isCurrent && <div className="absolute inset-0 rounded-2xl bg-primary animate-ping opacity-20" />}
                                                    </div>
                                                    <p className={`mt-3 text-xs font-bold leading-none ${isDone ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Dashboard Bottom Section */}
                <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Orders */}
                    <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
                        <Card className="p-6 glass border-none shadow-sm min-h-[400px]">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">Recent Orders</h2>
                                <Link href="/dashboard/orders" className="text-sm font-bold text-primary hover:underline">
                                    View all activity
                                </Link>
                            </div>

                            {orders.length === 0 ? (
                                <div className="text-center py-12">
                                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-4 font-medium">No orders yet</p>
                                    <Link href={user?.role === 'SELLER' ? '/seller/products' : '/'}>
                                        <Button className="gradient-primary rounded-xl font-bold h-12 px-8">
                                            {user?.role === 'SELLER' ? 'Add Product' : 'Start Shopping'}
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <motion.div
                                            layout
                                            key={order.id}
                                            className="p-5 border border-gray-100/50 rounded-[2rem] bg-white/40 hover:bg-white/80 transition-all group relative overflow-hidden hover:shadow-xl hover:-translate-y-1"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform">
                                                        <ShoppingBag className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-900">Order #{order.orderNumber}</p>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                            {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge className={`${getStatusColor(order.status)} border-none font-black rounded-lg px-3 py-1 text-[10px]`}>
                                                    {order.status}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between mt-6">
                                                <p className="text-xl font-black text-gray-900">
                                                    ₹{order.totalAmount.toFixed(2)}
                                                </p>
                                                <div className="flex gap-2">
                                                    <Link href={`/dashboard/orders/${order.id}`}>
                                                        <Button size="sm" variant="outline" className="text-[10px] font-black uppercase tracking-widest rounded-xl h-10 px-6 border-gray-100 hover:bg-white text-gray-500 transition-all active:scale-95">Details</Button>
                                                    </Link>
                                                    <Button
                                                        size="sm"
                                                        className="gradient-primary text-[10px] font-black uppercase tracking-widest rounded-xl h-10 px-6 shadow-lg hover:scale-105 active:scale-95 transition-all"
                                                        onClick={() => {
                                                            toast({
                                                                title: "Order Replicated! 🚀",
                                                                description: "All items added to cart. Proceeding to checkout...",
                                                            });
                                                            router.push('/checkout');
                                                        }}
                                                    >
                                                        Reorder
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </motion.div>

                    {/* Right Column: Account & Suggestions */}
                    <motion.div variants={containerVariants} className="space-y-8">
                        {/* Account Settings Panel */}
                        <motion.div variants={itemVariants}>
                            <Card className="p-6 glass border-none overflow-hidden relative shadow-sm">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: 'Profile', icon: User, href: '/dashboard/profile', color: 'green' },
                                        { label: 'Addresses', icon: MapPin, href: '/dashboard/addresses', color: 'blue' },
                                        { label: 'Coupons', icon: ShoppingBag, href: '/dashboard/coupons', color: 'purple' },
                                        { label: 'Alerts', icon: Bell, href: '/dashboard/notifications', color: 'yellow' },
                                    ].map((item) => (
                                        <Link key={item.label} href={item.href} className={`flex flex-col items-center p-4 rounded-2xl bg-${item.color}-50/30 hover:bg-${item.color}-50/60 transition-all border border-transparent hover:border-${item.color}-100 group`}>
                                            <div className={`w-10 h-10 rounded-xl bg-${item.color}-50 flex items-center justify-center text-${item.color}-600 mb-2 group-hover:scale-110 transition-transform shadow-sm`}>
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">{item.label}</span>
                                        </Link>
                                    ))}
                                </div>
                                <div className="mt-8 space-y-2">
                                    <Link href="/help" className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/50 transition-all group">
                                        <span className="text-sm font-bold text-gray-700">Help & Support</span>
                                        <Clock className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-between p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold group active:scale-95"
                                    >
                                        <span className="text-sm">Logout Session</span>
                                        <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Smart Suggestions */}
                        <motion.div variants={itemVariants}>
                            <Card className="p-8 gradient-primary text-white overflow-hidden relative border-none shadow-2xl rounded-[3rem]">
                                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                                    <ShoppingBag className="w-32 h-32" />
                                </div>
                                <h3 className="text-xl font-black mb-1">Smart Picks</h3>
                                <p className="text-xs text-white/80 mb-6 font-medium uppercase tracking-widest">Based on patterns</p>

                                <div className="space-y-3 relative z-10">
                                    {[
                                        { name: 'Fresh Coriander', hint: 'Weekly buy', emoji: '🥬' },
                                        { name: 'Full Cream Milk', hint: 'Running low?', emoji: '🐄' }
                                    ].map((item) => (
                                        <div key={item.name} className="flex items-center bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors cursor-pointer group">
                                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3 text-lg group-hover:scale-110 transition-transform">{item.emoji}</div>
                                            <div className="flex-1">
                                                <p className="text-xs font-black">{item.name}</p>
                                                <p className="text-[10px] font-bold opacity-70 uppercase tracking-tighter">{item.hint}</p>
                                            </div>
                                            <Button size="icon" variant="ghost" className="h-9 w-9 hover:bg-white/20 rounded-xl active:scale-90">+</Button>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>

                        {/* AI Suggestions Panel */}
                        <motion.div variants={itemVariants}>
                            <Card className="p-8 border-none shadow-xl gradient-premium text-white rounded-[3rem] overflow-hidden relative group">
                                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-black mb-1 flex items-center gap-2">
                                        AI Pick for You
                                        <Badge className="bg-white/20 text-white border-none text-[8px] font-black">PRO</Badge>
                                    </h3>
                                    <p className="text-xs font-medium opacity-80 mb-8 leading-relaxed">Based on your late-night snacking patterns.</p>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10 hover:bg-white/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-95 group">
                                            <div className="text-2xl group-hover:scale-125 transition-transform">🍫</div>
                                            <div className="flex-1">
                                                <p className="text-sm font-black">Dark Chocolate</p>
                                                <p className="text-[10px] font-medium opacity-70">Pairs well with your usual coffee</p>
                                            </div>
                                            <TrendingUp className="w-4 h-4 text-amber-300" />
                                        </div>
                                        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10 hover:bg-white/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-95 group">
                                            <div className="text-2xl group-hover:scale-125 transition-transform">🥜</div>
                                            <div className="flex-1">
                                                <p className="text-sm font-black">Roasted Almonds</p>
                                                <p className="text-[10px] font-medium opacity-70">Highly rated by people like you</p>
                                            </div>
                                            <TrendingUp className="w-4 h-4 text-emerald-300" />
                                        </div>
                                    </div>

                                    <Button className="w-full mt-8 bg-white text-gray-900 hover:bg-gray-50 h-12 rounded-2xl font-black shadow-xl transition-all hover:scale-105 active:scale-95">
                                        Add All to Cart
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}
