'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Camera, Save, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/use-toast';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';

export default function ProfilePage() {
    const { user, setUser } = useAuthStore();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Mock API update
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (user) {
                setUser({ ...user, name: formData.name });
            }

            toast({
                title: 'Profile Updated',
                description: 'Your changes have been saved successfully.',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update profile.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Navbar />

            <main className="container mx-auto px-4 py-8 max-w-2xl">
                <Button asChild variant="ghost" className="inline-flex items-center text-sm text-gray-600 hover:text-green-600 mb-6 group transition-colors p-0 h-auto">
                    <Link href="/dashboard">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                </Button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Profile</h1>

                    <Card className="p-8 glass shadow-xl border-t-4 border-t-green-500">
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-green-400 to-blue-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-white">
                                    {formData.name.charAt(0) || 'U'}
                                </div>
                                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border hover:bg-gray-50 transition-colors">
                                    <Camera className="w-4 h-4 text-green-600" />
                                </button>
                            </div>
                            <p className="mt-4 text-sm text-gray-500">Click to change avatar</p>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="pl-10 h-12 bg-white/50 focus:bg-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        value={formData.email}
                                        disabled
                                        className="pl-10 h-12 bg-gray-100 cursor-not-allowed opacity-70"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-400 ml-1 italic">Email cannot be changed after registration</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 ml-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="pl-10 h-12 bg-white/50 focus:bg-white"
                                        placeholder="Add phone number"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 text-lg font-semibold gradient-primary"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        Updating Profile...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </form>
                    </Card>

                    <div className="mt-8 p-6 bg-red-50 border border-red-100 rounded-2xl">
                        <h2 className="text-red-800 font-bold mb-2">Danger Zone</h2>
                        <p className="text-sm text-red-600 mb-4">Deleting your account is permanent and cannot be undone.</p>
                        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700 h-11">
                            Delete Account
                        </Button>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
