'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Settings,
    Bell,
    Lock,
    Fingerprint,
    Smartphone,
    Globe,
    Database,
    Trash2,
    Save,
    Clock,
    Truck,
    Navigation,
    Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Navbar } from '@/components/Navbar';
import { SellerSidebar } from '@/components/seller/SellerSidebar';
import { useAuthStore } from '@/store/authStore';
import { useStore } from '@/lib/useStore';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';

export default function SellerSettingsPage() {
    const user = useStore(useAuthStore, (state) => state.user);
    const { toast } = useToast();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleSave = () => {
        toast({ title: 'Settings Saved', description: 'Your preferences have been updated successfully.' });
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
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Store <span className="text-amber-500">Settings</span></h1>
                            <p className="text-gray-500 font-medium">Configure your store's behavior and notifications.</p>
                        </div>
                        <Button onClick={handleSave} className="gradient-primary h-12 px-8 rounded-2xl font-black shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                            <Save className="w-5 h-5" />
                            Save Configuration
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Operational Settings */}
                        <div className="space-y-8">
                            <Card className="p-8 border-none shadow-sm bg-white rounded-[2.5rem]">
                                <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-amber-500" />
                                    Operational Hours
                                </h3>
                                <div className="space-y-6">
                                    {[
                                        { day: 'Monday - Friday', hours: '06:00 AM - 11:00 PM', active: true },
                                        { day: 'Saturday', hours: '08:00 AM - 10:00 PM', active: true },
                                        { day: 'Sunday', hours: '08:00 AM - 08:00 PM', active: false },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                            <div>
                                                <p className="font-bold text-gray-900">{item.day}</p>
                                                <p className="text-xs font-medium text-gray-400">{item.hours}</p>
                                            </div>
                                            <Switch defaultChecked={item.active} className="data-[state=checked]:bg-amber-500" />
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card className="p-8 border-none shadow-sm bg-white rounded-[2.5rem]">
                                <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                    <Truck className="w-5 h-5 text-blue-500" />
                                    Delivery Preferences
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-gray-900">Auto-Assign Fleet</p>
                                            <p className="text-xs font-medium text-gray-400">Automatically ping nearby drivers upon order prep.</p>
                                        </div>
                                        <Switch defaultChecked={true} className="data-[state=checked]:bg-blue-500" />
                                    </div>
                                    <Separator className="bg-gray-50" />
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-gray-900">Instant Accept</p>
                                            <p className="text-xs font-medium text-gray-400">Accept all incoming orders automatically.</p>
                                        </div>
                                        <Switch defaultChecked={false} className="data-[state=checked]:bg-blue-500" />
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Security & Alerts */}
                        <div className="space-y-8">
                            <Card className="p-8 border-none shadow-sm bg-white rounded-[2.5rem]">
                                <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                    <Bell className="w-5 h-5 text-emerald-500" />
                                    Alert Preferences
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-gray-900">New Order Alerts</p>
                                            <p className="text-xs font-medium text-gray-400">Push notifications for every new order.</p>
                                        </div>
                                        <Switch defaultChecked={true} className="data-[state=checked]:bg-emerald-500" />
                                    </div>
                                    <Separator className="bg-gray-50" />
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-gray-900">Revenue Summaries</p>
                                            <p className="text-xs font-medium text-gray-400">Daily financial summary at end of day.</p>
                                        </div>
                                        <Switch defaultChecked={true} className="data-[state=checked]:bg-emerald-500" />
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-8 border-none shadow-sm bg-white rounded-[2.5rem]">
                                <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3 text-red-500">
                                    <Trash2 className="w-5 h-5" />
                                    Danger Zone
                                </h3>
                                <p className="text-sm font-medium text-gray-400 mb-6">Irreversible actions that affect your entire store presence.</p>
                                <div className="space-y-4">
                                    <Button variant="outline" className="w-full h-14 rounded-2xl font-black border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600">
                                        Temporarily Close Store
                                    </Button>
                                    <Button variant="ghost" className="w-full h-14 rounded-2xl font-black text-gray-300 hover:text-red-600 border border-transparent hover:border-red-100">
                                        Delete Merchant Account
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
