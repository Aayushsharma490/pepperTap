'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Store,
    Mail,
    Phone,
    Lock,
    Camera,
    ShieldCheck,
    Star,
    Package,
    Clock,
    ChevronRight,
    MapPin,
    ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { SellerSidebar } from '@/components/seller/SellerSidebar';
import { useAuthStore } from '@/store/authStore';
import { useStore } from '@/lib/useStore';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';

export default function SellerProfilePage() {
    const user = useStore(useAuthStore, (state) => state.user);
    const { toast } = useToast();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        toast({ title: 'Profile Updated', description: 'Your store information has been saved successfully.' });
    };

    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
                <SellerSidebar />

                <main className="flex-1 space-y-8">
                    {/* Hero Profile Card */}
                    <Card className="p-0 border-none shadow-xl rounded-[3rem] overflow-hidden bg-white">
                        <div className="h-48 gradient-premium relative">
                            <div className="absolute -bottom-16 left-12">
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-[2.5rem] bg-white p-1.5 shadow-2xl">
                                        <div className="w-full h-full rounded-[2.2rem] bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-3xl overflow-hidden border border-gray-100">
                                            {user?.name?.charAt(0) || 'S'}
                                        </div>
                                    </div>
                                    <button className="absolute bottom-1 right-1 w-10 h-10 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-amber-600 transition-colors border-4 border-white">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-20 pb-10 px-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                            <div>
                                <h1 className="text-3xl font-black text-gray-900 tracking-tight">{user?.name || 'Store Name'}</h1>
                                <p className="text-gray-500 font-medium flex items-center gap-2 mt-1">
                                    <Mail className="w-4 h-4 text-amber-500" />
                                    {user?.email}
                                </p>
                                <div className="flex gap-4 mt-6">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Store Rating</span>
                                        <div className="flex items-center gap-1.5">
                                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                            <span className="font-black text-gray-900">4.9</span>
                                        </div>
                                    </div>
                                    <Separator orientation="vertical" className="h-8" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Orders</span>
                                        <div className="flex items-center gap-1.5">
                                            <Package className="w-4 h-4 text-blue-500" />
                                            <span className="font-black text-gray-900">1,248</span>
                                        </div>
                                    </div>
                                    <Separator orientation="vertical" className="h-8" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Joined</span>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4 text-emerald-500" />
                                            <span className="font-black text-gray-900">Oct 2023</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Badge className="bg-emerald-50 text-emerald-700 border-none px-6 py-2 rounded-2xl font-black text-sm flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" />
                                Verified Merchant
                            </Badge>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Edit Information */}
                        <div className="lg:col-span-2 space-y-8">
                            <Card className="p-10 border-none shadow-sm rounded-[3rem] bg-white">
                                <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                    Store Details
                                    <Badge variant="outline" className="border-gray-100 text-[10px] uppercase font-bold text-gray-400 rounded-lg">Public Info</Badge>
                                </h3>
                                <form onSubmit={handleUpdate} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Store Name</label>
                                            <Input defaultValue={user?.name} className="h-14 rounded-2xl bg-gray-50 border-none font-bold placeholder:text-gray-300" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Support Phone</label>
                                            <Input defaultValue="+91 98765 43210" className="h-14 rounded-2xl bg-gray-50 border-none font-bold placeholder:text-gray-300" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Store Description</label>
                                        <textarea
                                            rows={4}
                                            className="w-full rounded-2xl bg-gray-50 border-none font-bold p-4 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none placeholder:text-gray-300"
                                            defaultValue="The freshest groceries delivered to your doorstep in minutes. Quality guaranteed by Mumbai's favorite store."
                                        />
                                    </div>
                                    <Button type="submit" className="w-full h-14 gradient-primary rounded-2xl font-black shadow-lg shadow-amber-100 transition-all hover:scale-[1.02] active:scale-95">
                                        Save Changes
                                    </Button>
                                </form>
                            </Card>

                            <Card className="p-10 border-none shadow-sm rounded-[3rem] bg-white">
                                <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                    Security Settings
                                    <Badge variant="outline" className="border-gray-100 text-[10px] uppercase font-bold text-gray-400 rounded-lg">Private</Badge>
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-6 rounded-[2rem] bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-500 shadow-sm">
                                                <Lock className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">Change Password</p>
                                                <p className="text-xs font-medium text-gray-400">Regularly update for better security</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-amber-500 transition-colors" />
                                    </div>
                                    <div className="flex items-center justify-between p-6 rounded-[2rem] bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-500 shadow-sm">
                                                <ShieldCheck className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">Two-Factor Auth</p>
                                                <p className="text-xs font-medium text-gray-400">Add an extra layer of protection</p>
                                            </div>
                                        </div>
                                        <Badge className="bg-amber-100 text-amber-700 border-none uppercase text-[10px] font-black px-3 rounded-lg">Disabled</Badge>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Store Analytics Column */}
                        <div className="space-y-8">
                            <Card className="p-8 border-none shadow-sm bg-white rounded-[2.5rem] overflow-hidden group">
                                <div className="flex items-center justify-between mb-8">
                                    <h4 className="font-black text-gray-900">Operations</h4>
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-amber-500 transition-colors">
                                        <Store className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-gray-500">Service Area</span>
                                        <span className="text-sm font-black text-gray-900">Mumbai West</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-gray-500">Store Hours</span>
                                        <span className="text-sm font-black text-gray-900">6 AM - 11 PM</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-gray-500">Delivery Range</span>
                                        <span className="text-sm font-black text-gray-900">Up to 8 KM</span>
                                    </div>
                                </div>
                                <Separator className="my-8" />
                                <Button variant="ghost" className="w-full text-xs font-black text-gray-400 hover:text-gray-900 h-10 rounded-xl border-dashed border border-gray-100">
                                    Manage Documents
                                </Button>
                            </Card>

                            <Card className="p-8 border-none shadow-lg bg-gray-900 text-white rounded-[2.5rem] relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <ArrowUpRight className="w-32 h-32" />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Growth Tier</p>
                                    <h4 className="text-2xl font-black text-amber-400 mb-6 tracking-tight">Silver Merchant</h4>
                                    <p className="text-sm font-medium opacity-80 leading-relaxed mb-8">
                                        Next Tier: <span className="text-white font-black">Gold</span>. Perform 250 more orders to unlock priority support and lower commission rates.
                                    </p>
                                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div className="w-[65%] h-full bg-amber-400 rounded-full" />
                                    </div>
                                    <p className="text-[10px] font-bold text-right mt-2 opacity-60">65% Progress</p>
                                </div>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
