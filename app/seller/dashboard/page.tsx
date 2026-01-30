'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag,
    Package,
    TrendingUp,
    Users,
    Plus,
    LayoutDashboard,
    Boxes,
    ClipboardList,
    Settings,
    LogOut,
    ArrowUpRight,
    Search,
    Filter,
    MoreVertical,
    CheckCircle2,
    Clock,
    AlertCircle,
    Truck,
    Star,
    Download,
    Upload,
    DollarSign,
    MessageSquare,
    HelpCircle,
    FileSpreadsheet,
    History,
    ArrowDownRight,
    ArrowRight,
    Wallet
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "../../../components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

export default function SellerDashboardPage() {
    const router = useRouter();
    const { toast } = useToast();
    const user = useStore(useAuthStore, (state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const [stats, setStats] = useState({
        totalRevenue: 45280.50,
        activeOrders: 12,
        totalProducts: 48,
        customerRating: 4.8
    });

    const [orders, setOrders] = useState([
        { id: '1', orderNo: 'ORD-8821', customer: 'Rahul Sharma', amount: 1250, status: 'PREPARING', time: '10 min ago', itemsCount: 4 },
        { id: '2', orderNo: 'ORD-8822', customer: 'Anjali Gupta', amount: 890, status: 'PENDING', time: '15 min ago', itemsCount: 2 },
        { id: '3', orderNo: 'ORD-8823', customer: 'Vikram Singh', amount: 2100, status: 'READY', time: '5 min ago', itemsCount: 6 },
    ]);

    const [catalog, setCatalog] = useState([
        { id: '1', name: 'Organic Bananas', cat: 'Fruits', price: 45, stock: 85, status: 'In Stock', img: '🍌' },
        { id: '2', name: 'Full Cream Milk', cat: 'Dairy', price: 62, stock: 12, status: 'Low Stock', img: '🐄' },
        { id: '3', name: 'Sourdough Bread', cat: 'Bakery', price: 85, stock: 0, status: 'Out of Stock', img: '🍞' },
    ]);

    const [newProduct, setNewProduct] = useState({
        name: '',
        category: 'Grocery',
        price: '',
        stock: '',
        image: '📦'
    });

    const [isAddProductOpen, setIsAddProductOpen] = useState(false);

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
        if (user && user.role !== 'SELLER') {
            router.push('/dashboard');
            return;
        }

        const fetchData = async () => {
            try {
                const [productsRes, ordersRes] = await Promise.all([
                    fetch(`/api/products?sellerId=${user.id}`),
                    fetch(`/api/orders?sellerId=${user.id}`)
                ]);

                if (productsRes.ok) {
                    const products = await productsRes.json();
                    setCatalog(products.map((p: any) => ({
                        id: p.id,
                        name: p.name,
                        cat: p.category,
                        price: p.price,
                        stock: p.stock,
                        status: p.stock > 20 ? 'In Stock' : (p.stock > 0 ? 'Low Stock' : 'Out of Stock'),
                        img: JSON.parse(p.images || '[]')[0] || '📦'
                    })));
                    setStats(prev => ({ ...prev, totalProducts: products.length }));
                }

                if (ordersRes.ok) {
                    const ordersData = await ordersRes.json();
                    setOrders(ordersData.map((o: any) => ({
                        id: o.id,
                        orderNo: o.orderNumber,
                        customer: o.customer.name,
                        amount: o.totalAmount,
                        status: o.status,
                        time: new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        itemsCount: o.items.length
                    })));
                    setStats(prev => ({
                        ...prev,
                        activeOrders: ordersData.filter((o: any) => ['PENDING', 'ACCEPTED', 'PREPARING'].includes(o.status)).length,
                        totalRevenue: ordersData.reduce((acc: number, o: any) => acc + o.totalAmount, 0)
                    }));
                }
            } catch (error) {
                console.error('Error fetching seller data:', error);
            }
        };

        fetchData();
    }, [user, isMounted]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        logout();
        router.push('/');
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newProduct.name,
                    category: newProduct.category,
                    price: newProduct.price,
                    stock: newProduct.stock,
                    images: [newProduct.image],
                    sellerId: user?.id
                })
            });

            if (response.ok) {
                const product = await response.json();
                setCatalog([{
                    id: product.id,
                    name: product.name,
                    cat: product.category,
                    price: product.price,
                    stock: product.stock,
                    status: product.stock > 20 ? 'In Stock' : (product.stock > 0 ? 'Low Stock' : 'Out of Stock'),
                    img: JSON.parse(product.images || '[]')[0] || '📦'
                }, ...catalog]);

                setNewProduct({ name: '', category: 'Grocery', price: '', stock: '', image: '📦' });
                setIsAddProductOpen(false);
                toast({
                    title: "Product Added",
                    description: `${product.name} has been added to your catalog.`,
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add product.",
                variant: "destructive"
            });
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setCatalog(catalog.filter(p => p.id !== productId));
                toast({
                    title: "Product Deleted",
                    description: "Item has been removed from your catalog.",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete product.",
                variant: "destructive"
            });
        }
    };

    const exportToCSV = () => {
        const headers = ['Name', 'Category', 'Price', 'Stock', 'Status'];
        const csvContent = [
            headers.join(','),
            ...catalog.map(p => `${p.name},${p.cat},${p.price},${p.stock},${p.status}`)
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `inventory_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        toast({
            title: "Export Success ✅",
            description: "Your product catalog has been downloaded.",
        });
    };

    const handleOrderPrepared = (orderId: string) => {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'READY' } : o));

        // Notify Delivery & Customer
        const { logisticsEmitter } = require('@/lib/realtime');
        logisticsEmitter.emit({
            type: 'SELLER_ACCEPTED',
            orderId: order.orderNo,
            payload: { customer: order.customer }
        });

        toast({
            title: "Order Ready! 📦",
            description: `${order.orderNo} is now ready for pickup.`,
        });
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
                {/* Header */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[2.5rem] shadow-sm mb-8 border border-white/50 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-amber-500/10 transition-colors" />
                    <div className="relative z-10">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Merchant <span className="text-gradient-amber">Hub</span></h1>
                        <p className="text-gray-500 font-medium">Welcome back, {user?.name}. Here's what's happening today.</p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto relative z-10">
                        <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                            <DialogTrigger asChild>
                                <Button className="w-full gradient-primary h-12 px-8 rounded-2xl font-black shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                                    <Plus className="w-5 h-5" />
                                    Add Product
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] rounded-[3rem] border-none shadow-2xl glass overlow-hidden">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black text-gray-900">Add New <span className="text-amber-500">Product</span></DialogTitle>
                                    <DialogDescription className="font-medium text-gray-500">
                                        Fill in the details to add this item to your store catalog.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleAddProduct} className="space-y-6 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Product Name</Label>
                                        <Input
                                            id="name"
                                            value={newProduct.name}
                                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                            placeholder="e.g. Fresh strawberries"
                                            className="h-12 rounded-xl bg-gray-50 border-none font-bold focus:ring-2 focus:ring-amber-500/20"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="price" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Price (₹)</Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                value={newProduct.price}
                                                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                                placeholder="99"
                                                className="h-12 rounded-xl bg-gray-50 border-none font-bold focus:ring-2 focus:ring-amber-500/20"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="stock" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Initial Stock</Label>
                                            <Input
                                                id="stock"
                                                type="number"
                                                value={newProduct.stock}
                                                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                                placeholder="50"
                                                className="h-12 rounded-xl bg-gray-50 border-none font-bold focus:ring-2 focus:ring-amber-500/20"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Category</Label>
                                        <Select value={newProduct.category} onValueChange={(val) => setNewProduct({ ...newProduct, category: val })}>
                                            <SelectTrigger className="h-12 rounded-xl bg-gray-50 border-none font-bold outline-none ring-offset-transparent">
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-none shadow-xl">
                                                <SelectItem value="Grocery">Grocery</SelectItem>
                                                <SelectItem value="Fruits">Fruits</SelectItem>
                                                <SelectItem value="Vegetables">Vegetables</SelectItem>
                                                <SelectItem value="Dairy">Dairy</SelectItem>
                                                <SelectItem value="Bakery">Bakery</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <DialogFooter className="pt-4">
                                        <Button type="submit" className="w-full h-12 gradient-amber rounded-xl font-black shadow-lg hover:scale-[1.02] active:scale-95 transition-all">Confirm & Add</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </motion.div>

                {/* Merchant Stats Grid */}
                <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {[
                        { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+12.5%' },
                        { label: 'Active Orders', value: stats.activeOrders, icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50', trend: 'Live Tracking' },
                        { label: 'Delivery Fleet', value: '8 Online', icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50', trend: 'Available' },
                        { label: 'Store Rating', value: stats.customerRating, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'Top 5%' }
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            variants={itemVariants}
                            whileHover="hover"
                        >
                            <motion.div variants={cardHover}>
                                <Card className="p-6 border-none shadow-sm hover:shadow-md transition-all rounded-[2rem] group relative overflow-hidden bg-white">
                                    <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{stat.label}</p>
                                            <h2 className="text-2xl font-black text-gray-900 mt-2">{stat.value}</h2>
                                        </div>
                                        <Badge variant="outline" className="border-none bg-gray-50 text-[10px] font-black text-gray-500 rounded-lg py-1">
                                            {stat.trend}
                                        </Badge>
                                    </div>
                                </Card>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>

                <Tabs defaultValue="orders" className="space-y-8">
                    <TabsList className="bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border-none shadow-sm inline-flex h-auto">
                        <TabsTrigger value="orders" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-sm">
                            Orders Queue
                        </TabsTrigger>
                        <TabsTrigger value="inventory" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-sm">
                            Inventory
                        </TabsTrigger>
                        <TabsTrigger value="earnings" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-sm">
                            Earnings
                        </TabsTrigger>
                        <TabsTrigger value="reviews" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-sm">
                            Reviews
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-sm">
                            Insights
                        </TabsTrigger>
                        <TabsTrigger value="support" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-sm">
                            Support
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="orders">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Real-time Order Tracking */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex items-center justify-between px-2">
                                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                        Live Tracking Hub
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                        </span>
                                    </h3>
                                    <Button variant="ghost" className="text-xs font-bold text-gray-400 hover:text-gray-900">View Map</Button>
                                </div>

                                <div className="space-y-4">
                                    {orders.map((order, i) => (
                                        <motion.div
                                            key={order.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <Card className="p-6 border-none shadow-sm rounded-3xl bg-white overflow-hidden group">
                                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                                    <div className="flex gap-4">
                                                        <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                                                            <Package className="w-7 h-7" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-black text-gray-900">{order.orderNo}</h4>
                                                            <p className="text-sm font-bold text-gray-500">{order.customer}</p>
                                                            <div className="flex items-center gap-4 mt-4">
                                                                <div className="flex flex-col items-center gap-1 group/step">
                                                                    <div className={`w-3 h-3 rounded-full ${['PENDING', 'PREPARING', 'READY'].includes(order.status) ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-gray-200'}`} />
                                                                    <span className="text-[8px] font-black text-gray-400 uppercase">Received</span>
                                                                </div>
                                                                <div className="w-10 h-[2px] bg-gray-100 rounded-full" />
                                                                <div className="flex flex-col items-center gap-1">
                                                                    <div className={`w-3 h-3 rounded-full ${['PREPARING', 'READY'].includes(order.status) ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-gray-200'}`} />
                                                                    <span className="text-[8px] font-black text-gray-400 uppercase">Kitchen</span>
                                                                </div>
                                                                <div className="w-10 h-[2px] bg-gray-100 rounded-full" />
                                                                <div className="flex flex-col items-center gap-1">
                                                                    <div className={`w-3 h-3 rounded-full ${order.status === 'READY' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-200'}`} />
                                                                    <span className="text-[8px] font-black text-gray-400 uppercase">Ready</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between md:justify-end gap-6 self-stretch md:self-center bg-gray-50/50 p-6 md:bg-transparent md:p-0 rounded-3xl">
                                                        <div className="text-left md:text-right hidden sm:block">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Driver Assigned</p>
                                                            <p className="text-sm font-bold text-gray-900">Amit Kumar</p>
                                                        </div>
                                                        {order.status !== 'READY' ? (
                                                            <Button
                                                                onClick={() => handleOrderPrepared(order.id)}
                                                                className="h-12 px-6 rounded-xl gradient-primary font-black shadow-lg hover:scale-105 active:scale-95 transition-all"
                                                            >
                                                                Mark as Prepared
                                                            </Button>
                                                        ) : (
                                                            <Badge className="bg-emerald-100 text-emerald-700 border-none font-black h-12 px-6 rounded-xl flex items-center gap-2">
                                                                <CheckCircle2 className="w-4 h-4" /> Ready for Pickup
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Sidebar: Merchant Smart Insights */}
                            <div className="space-y-6">
                                <Card className="p-8 border-none shadow-xl gradient-premium text-white rounded-[3rem] overflow-hidden relative group">
                                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
                                    <div className="relative z-10">
                                        <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
                                            Smart Insights
                                            <Badge className="bg-white/20 text-white border-none text-[8px] font-black">BETA</Badge>
                                        </h3>
                                        <p className="text-xs font-medium opacity-80 mb-8 leading-relaxed">Based on store patterns and inventory levels</p>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10 hover:bg-white/15 transition-all">
                                                <div className="text-2xl">🥬</div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-black">Fresh Coriander</p>
                                                    <p className="text-[10px] font-medium opacity-70">Running Low • Weekly buy cycle</p>
                                                </div>
                                                <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl hover:bg-white/20 text-white shadow-sm">+</Button>
                                            </div>

                                            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10 hover:bg-white/15 transition-all">
                                                <div className="text-2xl">🐄</div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-black">Full Cream Milk</p>
                                                    <p className="text-[10px] font-medium opacity-70">Stock Alert • High demand hours</p>
                                                </div>
                                                <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl hover:bg-white/20 text-white shadow-sm">+</Button>
                                            </div>
                                        </div>

                                        <Button className="w-full mt-8 bg-white text-gray-900 hover:bg-gray-50 h-12 rounded-2xl font-black shadow-xl">
                                            Create Auto-Restock
                                        </Button>
                                    </div>
                                </Card>

                                {/* Store Analytics Summary */}
                                <Card className="p-6 border-none shadow-sm bg-white rounded-3xl">
                                    <h4 className="font-black text-gray-900 mb-6 flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        Store Efficiency
                                    </h4>
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex justify-between text-xs font-bold mb-2">
                                                <span className="text-gray-500">Pick-up Speed</span>
                                                <span className="text-emerald-600">8.2 min avg</span>
                                            </div>
                                            <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                                <div className="w-[85%] h-full bg-emerald-500 rounded-full" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs font-bold mb-2">
                                                <span className="text-gray-500">Inventory Accuracy</span>
                                                <span className="text-amber-500">92%</span>
                                            </div>
                                            <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                                <div className="w-[92%] h-full bg-amber-500 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                    <Separator className="my-6" />
                                    <Link href="/seller/earnings" className="text-xs font-black text-gray-400 hover:text-amber-500 transition-colors flex items-center gap-2 justify-center">
                                        Detailed Performance Report
                                        <ArrowUpRight className="w-3 h-3" />
                                    </Link>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="inventory">
                        <div className="space-y-8">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Catalog Management</h3>
                                <div className="flex gap-3 w-full md:w-auto">
                                    <Button variant="outline" onClick={exportToCSV} className="flex-1 md:flex-none h-12 px-6 rounded-2xl font-black border-gray-100 hover:bg-gray-50 flex items-center gap-2">
                                        <FileSpreadsheet className="w-5 h-5" />
                                        Export CSV
                                    </Button>
                                    <Button variant="outline" className="flex-1 md:flex-none h-12 px-6 rounded-2xl font-black border-gray-100 hover:bg-gray-50 flex items-center gap-2">
                                        <Upload className="w-5 h-5" />
                                        Import Bulk
                                    </Button>
                                </div>
                            </div>

                            <Card className="p-0 border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-50">
                                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Product</th>
                                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Category</th>
                                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Price</th>
                                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Stock</th>
                                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Status</th>
                                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {catalog.map((prod, i) => (
                                                <motion.tr
                                                    key={prod.id}
                                                    layout
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="group hover:bg-gray-50 transition-colors"
                                                >
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                                                                {prod.img}
                                                            </div>
                                                            <span className="font-black text-gray-900">{prod.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <Badge variant="outline" className="border-gray-100 text-gray-400 font-bold px-3 py-1 rounded-lg">
                                                            {prod.cat}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-8 py-6 font-black text-gray-900">₹{prod.price}</td>
                                                    <td className="px-8 py-6">
                                                        <span className={`text-sm font-black ${prod.stock === 0 ? 'text-red-500' : 'text-gray-600'}`}>
                                                            {prod.stock} units
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <Badge className={`${prod.status === 'In Stock' ? 'bg-emerald-100 text-emerald-700' :
                                                            prod.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' :
                                                                'bg-red-100 text-red-700'
                                                            } border-none font-black rounded-lg px-3 py-1`}>
                                                            {prod.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="w-9 h-9 rounded-xl hover:bg-blue-50 text-blue-600 transition-all"
                                                                onClick={() => {
                                                                    setNewProduct({
                                                                        name: prod.name,
                                                                        category: prod.cat,
                                                                        price: prod.price.toString(),
                                                                        stock: prod.stock.toString(),
                                                                        image: prod.img
                                                                    });
                                                                    setIsAddProductOpen(true);
                                                                }}
                                                            >
                                                                <TrendingUp className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="w-9 h-9 rounded-xl hover:bg-red-50 text-red-600 transition-all"
                                                                onClick={() => handleDeleteProduct(prod.id)}
                                                            >
                                                                <LogOut className="w-4 h-4 rotate-90" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="earnings">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <Card className="p-8 border-none shadow-sm rounded-[2.5rem] bg-white">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-xl font-black text-gray-900">Revenue Analytics</h3>
                                        <Select defaultValue="week">
                                            <SelectTrigger className="w-32 h-10 rounded-xl bg-gray-50 border-none font-bold">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-none shadow-xl">
                                                <SelectItem value="week">This Week</SelectItem>
                                                <SelectItem value="month">This Month</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="h-64 flex items-end justify-between gap-4 px-4">
                                        {[65, 45, 75, 55, 90, 80, 70].map((h, i) => (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-3">
                                                <div className="w-full bg-amber-500/10 rounded-full relative group">
                                                    <motion.div
                                                        initial={{ height: 0 }}
                                                        animate={{ height: `${h}%` }}
                                                        className="w-full bg-amber-500 rounded-full group-hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20"
                                                    />
                                                </div>
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Day {i + 1}</span>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                <Card className="p-0 border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
                                    <div className="px-8 py-6 border-b border-gray-50">
                                        <h3 className="text-xl font-black text-gray-900">Payout History</h3>
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        {[
                                            { date: 'Oct 28, 2023', amount: '₹12,450.00', status: 'PAID' },
                                            { date: 'Oct 21, 2023', amount: '₹10,500.00', status: 'PAID' },
                                            { date: 'Oct 14, 2023', amount: '₹8,900.00', status: 'PAID' },
                                        ].map((item, i) => (
                                            <div key={i} className="px-8 py-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                                        <ArrowDownRight className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-900">{item.date}</p>
                                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bank Transfer</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-black text-gray-900">{item.amount}</p>
                                                    <Badge className="bg-emerald-100 text-emerald-700 border-none font-black text-[10px] px-2 py-0.5 mt-1">{item.status}</Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>

                            <div className="space-y-8">
                                <Card className="p-8 border-none shadow-xl bg-gray-900 text-white rounded-[2.5rem] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <Wallet className="w-32 h-32" />
                                    </div>
                                    <h4 className="text-lg font-black mb-1 opacity-60 uppercase tracking-widest">Available Balance</h4>
                                    <h2 className="text-4xl font-black mb-8 tracking-tight">₹45,280.50</h2>
                                    <Button className="w-full h-14 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black shadow-xl shadow-amber-500/20">
                                        Withdraw to Bank
                                    </Button>
                                    <p className="text-[10px] font-bold text-center mt-4 opacity-40">Next payout scheduled for Nov 04, 2023</p>
                                </Card>

                                <Card className="p-6 border-none shadow-sm bg-white rounded-3xl">
                                    <h4 className="font-black text-gray-900 mb-6 flex items-center gap-2">
                                        <DollarSign className="w-5 h-5 text-emerald-500" />
                                        Profit Margins
                                    </h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50">
                                            <span className="text-sm font-bold text-gray-500">Gross Margin</span>
                                            <span className="text-sm font-black text-emerald-600">32.4%</span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50">
                                            <span className="text-sm font-bold text-gray-500">Net Profit</span>
                                            <span className="text-sm font-black text-blue-600">₹14.2k</span>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="reviews">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                {[
                                    { name: 'Rahul S.', rating: 5, date: '2 hours ago', text: 'Amazing quality! The organic bananas were perfectly ripe and the delivery was incredibly fast.', product: 'Organic Bananas' },
                                    { name: 'Sneha K.', rating: 4, date: 'Yesterday', text: 'Good service, but the milk carton was slightly dented. Products are fresh though.', product: 'Full Cream Milk' },
                                    { name: 'Amit G.', rating: 5, date: '2 days ago', text: 'Best store in Mumbai West. Very reliable for daily essentials.', product: 'Sourdough Bread' },
                                ].map((rev, i) => (
                                    <Card key={i} className="p-8 border-none shadow-sm rounded-[2.5rem] bg-white group hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-black text-gray-400">
                                                    {rev.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-gray-900">{rev.name}</h4>
                                                    <div className="flex gap-1 mt-0.5">
                                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} className={`w-3 h-3 ${s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />)}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{rev.date}</span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-600 leading-relaxed mb-6">"{rev.text}"</p>
                                        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                            <Badge variant="outline" className="border-gray-100 text-gray-400 font-bold px-3 py-1 rounded-lg">Product: {rev.product}</Badge>
                                            <Button variant="ghost" className="text-xs font-black text-amber-500 hover:text-amber-600">Reply to Review</Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            <div className="space-y-8">
                                <Card className="p-8 border-none shadow-sm rounded-[3rem] bg-white text-center">
                                    <div className="w-20 h-20 bg-amber-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                        <Star className="w-10 h-10 text-amber-500 fill-amber-500" />
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 mb-1">4.9</h3>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Overall Store Rating</p>
                                    <div className="space-y-3">
                                        {[5, 4, 3, 2, 1].map(r => (
                                            <div key={r} className="flex items-center gap-4">
                                                <span className="text-xs font-black text-gray-400 w-4">{r}</span>
                                                <div className="flex-1 h-2 bg-gray-50 rounded-full overflow-hidden">
                                                    <div className={`h-full bg-amber-400 rounded-full w-[${r === 5 ? '90' : r === 4 ? '60' : '5'}%]`}></div>
                                                </div>
                                                <span className="text-[10px] font-black text-gray-400 w-8">{r === 5 ? '942' : r === 4 ? '124' : '5'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                <Card className="p-8 border-none shadow-xl gradient-premium text-white rounded-[2.5rem] overflow-hidden group">
                                    <h4 className="text-lg font-black mb-4 tracking-tight leading-tight">Reward Loyal Customers</h4>
                                    <p className="text-xs font-medium opacity-80 mb-8 leading-relaxed">Top reviewers can be auto-awarded with exclusive store coupons.</p>
                                    <Button variant="ghost" className="w-full bg-white/10 hover:bg-white/20 text-white rounded-xl h-12 font-black">Configure Rewards</Button>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="support">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-black text-gray-900 px-2">Recent Inquiries</h3>
                                {[
                                    { id: '1', user: 'Ananya M.', subject: 'Order Cancellation', status: 'PENDING', time: '10 min ago' },
                                    { id: '2', user: 'Rohan V.', subject: 'Payment Discrepancy', status: 'REPLIED', time: '1 hour ago' },
                                    { id: '3', user: 'Kirti S.', subject: 'Product Quality Issue', status: 'CLOSED', time: 'Yesterday' },
                                ].map((ticket, i) => (
                                    <Card key={i} className="p-6 border-none shadow-sm rounded-3xl bg-white hover:shadow-md transition-all group cursor-pointer">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${ticket.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600'}`}>
                                                    <MessageSquare className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-gray-900">{ticket.subject}</h4>
                                                    <p className="text-xs font-bold text-gray-400">From: {ticket.user} • {ticket.time}</p>
                                                </div>
                                            </div>
                                            <Badge className={`${ticket.status === 'PENDING' ? 'bg-amber-500 text-white' :
                                                ticket.status === 'REPLIED' ? 'bg-blue-300 text-white' : 'bg-gray-200 text-gray-500'
                                                } border-none font-black rounded-lg px-2 py-1 text-[10px]`}>
                                                {ticket.status}
                                            </Badge>
                                        </div>
                                    </Card>
                                ))}
                                <Button variant="outline" className="w-full h-14 rounded-3xl font-black border-dashed border-gray-100 hover:bg-gray-50 text-gray-400 hover:text-gray-900 border-2">
                                    View All Archive
                                </Button>
                            </div>

                            <div className="space-y-8">
                                <Card className="p-8 border-none shadow-xl bg-gray-900 text-white rounded-[3rem] text-center">
                                    <div className="w-20 h-20 bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
                                        <HelpCircle className="w-10 h-10 text-amber-500" />
                                    </div>
                                    <h3 className="text-2xl font-black mb-4 leading-tight">Need Manager Support?</h3>
                                    <p className="text-sm font-medium opacity-60 mb-8 leading-relaxed">Our merchant relationship team is available 24/7 for critical issues.</p>
                                    <div className="flex gap-4">
                                        <Button className="flex-1 h-12 bg-white text-gray-900 rounded-xl font-black hover:bg-gray-50">Live Chat</Button>
                                        <Button variant="ghost" className="flex-1 h-12 bg-white/5 text-white rounded-xl font-black hover:bg-white/10 underline">Contact Account Rep</Button>
                                    </div>
                                </Card>

                                <Card className="p-8 border-none shadow-sm rounded-[3rem] bg-white">
                                    <h4 className="font-black text-gray-900 mb-6 flex items-center gap-2">
                                        <History className="w-5 h-5 text-blue-500" />
                                        Support Metrics
                                    </h4>
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex justify-between text-xs font-bold mb-2">
                                                <span className="text-gray-500">Avg. Response Time</span>
                                                <span className="text-gray-900">14 mins</span>
                                            </div>
                                            <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                                <div className="w-[88%] h-full bg-blue-500 rounded-full"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs font-bold mb-2">
                                                <span className="text-gray-500">Customer Satisfaction</span>
                                                <span className="text-gray-900">96.4%</span>
                                            </div>
                                            <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                                <div className="w-[96%] h-full bg-emerald-500 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="analytics">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="p-10 border-none shadow-sm rounded-[3rem] bg-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <TrendingUp className="w-32 h-32" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Demand Forecast</h3>
                                <div className="space-y-6 relative z-10">
                                    {[
                                        { item: 'Cold Drinks', forecast: '+45% Increase', desc: 'Expected due to heatwave in Mumbai', trend: 'UP' },
                                        { item: 'Ice Cream', forecast: '+28% Increase', desc: 'Strong weekend evening trend', trend: 'UP' }
                                    ].map((insight, i) => (
                                        <div key={i} className="p-6 rounded-[2.5rem] bg-gray-50 border border-gray-100 group/item hover:bg-white hover:shadow-xl transition-all">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-black text-gray-900">{insight.item}</h4>
                                                <Badge className="bg-emerald-100 text-emerald-700 border-none font-black">{insight.trend}</Badge>
                                            </div>
                                            <p className="text-sm font-black text-amber-600 mb-1">{insight.forecast}</p>
                                            <p className="text-xs font-medium text-gray-400">{insight.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card className="p-10 border-none shadow-xl bg-gray-900 text-white rounded-[3rem] relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-10 opacity-10">
                                    <Users className="w-40 h-40" />
                                </div>
                                <h3 className="text-2xl font-black mb-8 tracking-tight">Customer Sentiments</h3>
                                <div className="space-y-6 relative z-10">
                                    <div className="flex items-center gap-6 mb-10">
                                        <div className="text-5xl font-black text-amber-400">4.9</div>
                                        <div>
                                            <div className="flex gap-1 mb-1">
                                                {['', '', '', '', ''].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Based on 1.2k reviews</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-sm font-medium opacity-80 italic leading-relaxed">
                                            "Freshness is amazing. The coriander arrived yesterday was still crisp today. Keep it up!"
                                        </p>
                                        <div className="h-px bg-white/10" />
                                        <p className="text-sm font-medium opacity-80 italic leading-relaxed">
                                            "Delivery was super fast. Impressed by the packaging of dairy products."
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Market Must-Haves Section */}
                        <div className="mt-12">
                            <h3 className="text-2xl font-black text-gray-900 mb-8 px-2 flex items-center gap-3">
                                Market Must-Haves
                                <Badge className="bg-amber-100 text-amber-700 border-none text-[10px] font-black rounded-lg">High Demand</Badge>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { name: 'Avocados', growth: '+120%', tag: 'Trending', icon: '🥑', color: 'bg-emerald-50 text-emerald-600' },
                                    { name: 'Oat Milk', growth: '+85%', tag: 'Must-Have', icon: '🥛', color: 'bg-blue-50 text-blue-600' },
                                    { name: 'Kombucha', growth: '+64%', tag: 'New Entry', icon: '🍷', color: 'bg-purple-50 text-purple-600' },
                                    { name: 'Dragon Fruit', growth: '+40%', tag: 'Seasonal', icon: '🌵', color: 'bg-pink-50 text-pink-600' }
                                ].map((item, i) => (
                                    <Card key={i} className="p-6 border-none shadow-sm bg-white rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all group">
                                        <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                                            {item.icon}
                                        </div>
                                        <h4 className="font-black text-gray-900 text-lg mb-1">{item.name}</h4>
                                        <div className="flex items-center justify-between mt-4">
                                            <span className="text-xs font-black text-emerald-600">{item.growth} Growth</span>
                                            <Badge variant="outline" className="border-gray-100 text-[8px] font-bold text-gray-400 uppercase">{item.tag}</Badge>
                                        </div>
                                        <Button variant="ghost" className="w-full mt-6 h-10 rounded-xl text-xs font-black text-gray-400 hover:text-amber-500 border border-dashed border-gray-100 hover:border-amber-200">
                                            Search Suppliers
                                        </Button>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </div>
    );
}
