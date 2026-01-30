'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const setUser = useAuthStore((state) => state.setUser);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Set user in store
            setUser(data.user);

            toast({
                title: 'Login Successful! 🎉',
                description: `Welcome back, ${data.user.name || 'User'}!`,
            });

            // Redirect to dashboard
            router.push('/dashboard');
        } catch (error: any) {
            toast({
                title: 'Login Failed',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="glass rounded-2xl p-8 shadow-2xl">
                    {/* Logo & Title */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold gradient-text mb-2">Peppertap</h1>
                        <p className="text-gray-600">Welcome back! Please login to continue.</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="pl-10"
                                    autoComplete="email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="pl-10 pr-10"
                                    autoComplete="current-password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.rememberMe}
                                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                                    className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                />
                                <span className="text-sm text-gray-600">Remember me</span>
                            </label>
                            <Link href="/auth/forgot-password" className="text-sm text-green-600 hover:text-green-700">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Login Button */}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Logging in...
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5 mr-2" />
                                    Login
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Demo Accounts */}
                    <div className="mt-8 space-y-4">
                        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100/50">
                            <p className="text-[10px] font-black text-emerald-900 mb-3 uppercase tracking-widest leading-none">Quick Demo Access</p>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => { setFormData({ email: 'customer@example.com', password: 'demo123', rememberMe: true }); }}
                                    className="h-10 text-[10px] font-black uppercase rounded-xl border-emerald-100 hover:bg-white text-emerald-700"
                                >
                                    Customer
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => { setFormData({ email: 'seller@example.com', password: 'seller123', rememberMe: true }); }}
                                    className="h-10 text-[10px] font-black uppercase rounded-xl border-emerald-100 hover:bg-white text-emerald-700"
                                >
                                    Seller
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => { setFormData({ email: 'delivery@new.com', password: 'delivery123', rememberMe: true }); }}
                                    className="h-10 text-[10px] font-black uppercase rounded-xl border-emerald-100 hover:bg-white text-emerald-700 col-span-2"
                                >
                                    Delivery Partner
                                </Button>
                            </div>
                        </div>

                        <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/30">
                            <p className="text-[10px] font-black text-blue-900 mb-2 uppercase tracking-widest leading-none">Manual Credentials</p>
                            <div className="text-[10px] text-blue-700/70 font-bold space-y-1">
                                <p>Customer: customer@example.com / demo123</p>
                                <p>Seller: seller@example.com / seller123</p>
                                <p>Delivery: delivery@new.com / delivery123</p>
                            </div>
                        </div>
                    </div>

                    {/* Signup Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link href="/auth/signup" className="text-green-600 hover:text-green-700 font-semibold">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="mt-4 text-center">
                    <Link href="/" className="text-sm text-gray-600 hover:text-gray-800">
                        ← Back to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
