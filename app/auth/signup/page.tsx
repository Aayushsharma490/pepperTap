'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, Eye, EyeOff, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

export default function SignupPage() {
    const router = useRouter();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'CUSTOMER',
        agreeToTerms: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (formData.password !== formData.confirmPassword) {
            toast({
                title: 'Passwords do not match',
                description: 'Please make sure both passwords are the same.',
                variant: 'destructive',
            });
            return;
        }

        if (!formData.agreeToTerms) {
            toast({
                title: 'Terms & Conditions',
                description: 'Please agree to the terms and conditions.',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                    role: formData.role,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Signup failed');
            }

            toast({
                title: 'Account Created! 🎉',
                description: 'Please check your email for the OTP code.',
            });

            // Redirect to OTP verification
            router.push(`/auth/verify-otp?email=${encodeURIComponent(formData.email)}`);
        } catch (error: any) {
            toast({
                title: 'Signup Failed',
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
                        <p className="text-gray-600">Create your account to get started.</p>
                    </div>

                    {/* Signup Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Input */}
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="pl-10"
                                    autoComplete="name"
                                    required
                                />
                            </div>
                        </div>

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

                        {/* Phone Input */}
                        <div className="space-y-2">
                            <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="9876543210"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="pl-10"
                                    autoComplete="tel"
                                />
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">I want to</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['CUSTOMER', 'SELLER', 'DELIVERY'].map((role) => (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role })}
                                        className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${formData.role === role
                                            ? 'border-green-500 bg-green-50 text-green-700'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        {role === 'CUSTOMER' && '🛒 Buy'}
                                        {role === 'SELLER' && '🏪 Sell'}
                                        {role === 'DELIVERY' && '🚚 Deliver'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                                <Link href="/auth/forgot-password" title="Forgot password" className="text-xs text-green-600 hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
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
                                    autoComplete="new-password"
                                    required
                                    minLength={6}
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

                        {/* Confirm Password Input */}
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="pl-10"
                                    autoComplete="new-password"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        {/* Terms & Conditions */}
                        <label className="flex items-start space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.agreeToTerms}
                                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                                className="w-4 h-4 mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <span className="text-sm text-gray-600">
                                I agree to the{' '}
                                <Link href="/terms" className="text-green-600 hover:text-green-700">
                                    Terms & Conditions
                                </Link>{' '}
                                and{' '}
                                <Link href="/privacy" className="text-green-600 hover:text-green-700">
                                    Privacy Policy
                                </Link>
                            </span>
                        </label>

                        {/* Signup Button */}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5 mr-2" />
                                    Create Account
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link href="/auth/login" className="text-green-600 hover:text-green-700 font-semibold">
                                Login
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
