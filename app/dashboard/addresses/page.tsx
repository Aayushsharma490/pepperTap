'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plus, Trash2, Edit2, Check, ArrowLeft, Home, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

interface Address {
    id: string;
    type: 'Home' | 'Work' | 'Other';
    fullAddress: string;
    isDefault: boolean;
}

const initialAddresses: Address[] = [
    {
        id: '1',
        type: 'Home',
        fullAddress: 'H-204, Green Valley Apartments, HSR Layout Sector 2, Bangalore - 560102',
        isDefault: true,
    },
    {
        id: '2',
        type: 'Work',
        fullAddress: 'Tower B, 4th Floor, Salarpuria Tech Park, Whitefield, Bangalore - 560066',
        isDefault: false,
    },
];

export default function AddressesPage() {
    const { toast } = useToast();
    const [addresses, setAddresses] = useState<Address[]>(initialAddresses);

    const deleteAddress = (id: string) => {
        setAddresses(addresses.filter(a => a.id !== id));
        toast({
            title: 'Address Removed',
            description: 'The address has been deleted successfully.',
        });
    };

    const setDefault = (id: string) => {
        setAddresses(addresses.map(a => ({
            ...a,
            isDefault: a.id === id
        })));
        toast({
            title: 'Default Address Updated',
            description: 'Your primary delivery address has been changed.',
        });
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Navbar />

            <main className="container mx-auto px-4 py-8 max-w-3xl">
                <Button asChild variant="ghost" className="inline-flex items-center text-sm text-gray-600 hover:text-green-600 mb-6 group transition-colors p-0 h-auto">
                    <Link href="/dashboard">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                </Button>

                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">My Addresses</h1>
                    <Button className="gradient-primary">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New
                    </Button>
                </div>

                <div className="space-y-4">
                    {addresses.map((address) => (
                        <motion.div
                            key={address.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <Card className={`p-6 glass border-2 transition-all ${address.isDefault ? 'border-green-500 shadow-lg scale-[1.02]' : 'border-transparent'}`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-2xl ${address.type === 'Home' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                            {address.type === 'Home' ? <Home className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-gray-800">{address.type}</h3>
                                                {address.isDefault && (
                                                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Default</span>
                                                )}
                                            </div>
                                            <p className="text-gray-600 text-sm max-w-md leading-relaxed">
                                                {address.fullAddress}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!address.isDefault && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-gray-400 hover:text-green-600"
                                                onClick={() => setDefault(address.id)}
                                            >
                                                Set Default
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-600">
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-gray-400 hover:text-red-600"
                                            onClick={() => deleteAddress(address.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}

                    {addresses.length === 0 && (
                        <Card className="p-12 text-center glass border-dashed border-2">
                            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600">You haven't added any addresses yet.</p>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
}
