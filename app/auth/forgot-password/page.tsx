'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

export default function ForgotPasswordPage() {
    const { toast } = useToast();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Mock API call for sending recovery OTP
            await new Promise(resolve => setTimeout(resolve, 1500));

            setIsSent(true);
            toast({
                title: 'Instructions Sent!',
                description: `We've sent recovery instructions to ${email}`,
            });
        } catch (error: any) {
            toast({
                title: 'Error',
                description: 'Failed to send recovery email. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md"
            >
                <div className="glass rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16" />

                    {/* Back Button */}
                    <Link href="/auth/login" className="inline-flex items-center text-sm text-gray-600 hover:text-green-600 mb-6 transition-colors group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Login
                    </Link>

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
                            <Mail className="w-8 h-8 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password?</h1>
                        <p className="text-gray-600">
                            No worries! Enter your email and we'll send you instructions to reset it.
                        </p>
                    </div>

                    {!isSent ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-gray-700 ml-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 h-12 bg-white/50 focus:bg-white"
                                        autoComplete="email"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 text-lg font-semibold"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        Sending Instructions...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5 mr-2" />
                                        Send Instructions
                                    </>
                                )}
                            </Button>
                        </form>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center p-6 bg-green-50 rounded-xl border border-green-100"
                        >
                            <p className="text-green-800 font-medium mb-4">
                                Email sent! Please check your inbox for the reset link.
                            </p>
                            <Button variant="outline" onClick={() => setIsSent(false)}>
                                Try another email
                            </Button>
                        </motion.div>
                    )}

                    <p className="mt-8 text-center text-sm text-gray-500">
                        Didn't receive the email? Check your spam folder or{' '}
                        <button className="text-green-600 hover:text-green-700 font-medium">
                            try again
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
