'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    MapPin,
    Plus,
    Home,
    Building,
    MoreVertical,
    CheckCircle2,
    Navigation,
    Phone,
    Clock,
    Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { SellerSidebar } from '@/components/seller/SellerSidebar';
import { useAuthStore } from '@/store/authStore';
import { useStore } from '@/lib/useStore';
import { useToast } from '@/components/ui/use-toast';

export default function SellerAddressesPage() {
    const user = useStore(useAuthStore, (state) => state.user);
    const { toast } = useToast();
    const [isMounted, setIsMounted] = useState(false);

    const [addresses, setAddresses] = useState([
        { id: '1', label: 'Main Storefront', type: 'Primary', street: '12/A, Market Street', area: 'Downtown', city: 'Mumbai', zip: '400001', phone: '+91 98765 43210', status: 'ACTIVE' },
        { id: '2', label: 'North Warehouse', type: 'Warehouse', street: 'Plot 45, Industrial Belt', area: 'Andheri East', city: 'Mumbai', zip: '400069', phone: '+91 98765 43211', status: 'INACTIVE' },
    ]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleSetPrimary = (id: string) => {
        toast({ title: 'Primary Address Updated', description: 'This address will now be used for all new pickups.' });
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
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Address <span className="text-amber-500">Book</span></h1>
                            <p className="text-gray-500 font-medium">Manage your pickup locations and warehouses.</p>
                        </div>
                        <Button className="gradient-primary h-12 px-8 rounded-2xl font-black shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            Add Location
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {addresses.map((addr, i) => (
                            <motion.div
                                key={addr.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className={`p-8 border-none shadow-sm rounded-3xl relative overflow-hidden group transition-all hover:shadow-xl bg-white ${addr.type === 'Primary' ? 'ring-2 ring-amber-500' : ''}`}>
                                    {addr.type === 'Primary' && (
                                        <div className="absolute top-0 right-0">
                                            <div className="bg-amber-500 text-white text-[10px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest">Primary</div>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-6">
                                        <div className={`w-14 h-14 rounded-3xl flex items-center justify-center ${addr.type === 'Primary' ? 'bg-amber-50 text-amber-500' : 'bg-gray-50 text-gray-400'}`}>
                                            {addr.type === 'Primary' ? <Home className="w-7 h-7" /> : <Building className="w-7 h-7" />}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-black text-gray-900 mb-1">{addr.label}</h3>
                                            <div className="space-y-3 mt-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                                    <MapPin className="w-4 h-4 text-amber-500" />
                                                    {addr.street}, {addr.area}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-400 font-bold ml-6">
                                                    {addr.city} • {addr.zip}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                                    <Phone className="w-4 h-4 text-gray-400" />
                                                    {addr.phone}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 mt-8">
                                                <Button
                                                    variant="outline"
                                                    className="rounded-2xl h-12 font-black border-gray-100 hover:bg-gray-50"
                                                    onClick={() => handleSetPrimary(addr.id)}
                                                    disabled={addr.type === 'Primary'}
                                                >
                                                    Set Primary
                                                </Button>
                                                <Button variant="ghost" className="rounded-2xl h-12 font-black text-red-500 hover:bg-red-50 hover:text-red-600">
                                                    <Trash2 className="w-5 h-5 mr-2" />
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}

                        {/* Add New Empty State Component */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="border-4 border-dashed border-gray-100 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-amber-200 transition-all"
                        >
                            <div className="w-20 h-20 rounded-[2.5rem] bg-gray-50 flex items-center justify-center group-hover:bg-amber-50 transition-all mb-6">
                                <Plus className="w-10 h-10 text-gray-300 group-hover:text-amber-400" />
                            </div>
                            <h4 className="text-xl font-black text-gray-400 group-hover:text-gray-900 transition-all">Add New Location</h4>
                            <p className="text-sm font-medium text-gray-400 mt-2 max-w-[200px]">Expand your reach with different pickup points.</p>
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
}
