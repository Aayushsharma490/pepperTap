'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export default function VerifyOTPPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const email = searchParams.get('email') || '';
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Countdown timer for resend
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) value = value[0];
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all 6 digits are entered
        if (newOtp.every((digit) => digit) && index === 5) {
            handleSubmit(newOtp.join(''));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (otpCode?: string) => {
        const code = otpCode || otp.join('');

        if (code.length !== 6) {
            toast({
                title: 'Invalid OTP',
                description: 'Please enter all 6 digits.',
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'OTP verification failed');
            }

            toast({
                title: 'Verification Successful! 🎉',
                description: 'Your account has been verified.',
            });

            // Redirect to login
            setTimeout(() => router.push('/auth/login'), 1500);
        } catch (error: any) {
            toast({
                title: 'Verification Failed',
                description: error.message,
            });
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            // Call resend OTP API (to be implemented)
            toast({
                title: 'OTP Resent',
                description: 'A new OTP has been sent to your email.',
            });
            setResendTimer(60);
        } catch (error) {
            toast({
                title: 'Failed to resend OTP',
                description: 'Please try again later.',
            });
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
                    {/* Icon & Title */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-8 h-8 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Verify OTP</h1>
                        <p className="text-gray-600">
                            We've sent a 6-digit code to<br />
                            <span className="font-semibold text-gray-800">{email}</span>
                        </p>
                    </div>

                    {/* OTP Input */}
                    <div className="mb-8">
                        <div className="flex justify-center gap-2 mb-4">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                                    disabled={isLoading}
                                />
                            ))}
                        </div>

                        {/* Verify Button */}
                        <Button
                            onClick={() => handleSubmit()}
                            className="w-full"
                            disabled={isLoading || otp.some((digit) => !digit)}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Verifying...
                                </>
                            ) : (
                                'Verify OTP'
                            )}
                        </Button>
                    </div>

                    {/* Resend OTP */}
                    <div className="text-center">
                        {resendTimer > 0 ? (
                            <p className="text-sm text-gray-600">
                                Resend OTP in <span className="font-semibold text-green-600">{resendTimer}s</span>
                            </p>
                        ) : (
                            <button
                                onClick={handleResend}
                                className="text-sm text-green-600 hover:text-green-700 font-semibold"
                            >
                                Resend OTP
                            </button>
                        )}
                    </div>

                    {/* Back to Signup */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/auth/signup"
                            className="text-sm text-gray-600 hover:text-gray-800 inline-flex items-center"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to Signup
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
