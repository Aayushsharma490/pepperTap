'use client';

import { motion } from 'framer-motion';
import { FileText, ArrowLeft, ShieldCheck, Scale } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50/50">
            <Navbar />

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <Link href="/dashboard" className="inline-flex items-center text-sm text-gray-600 hover:text-green-600 mb-6 group transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-blue-600" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">Terms & Privacy</h1>
                        <p className="text-gray-600">Last updated: January 30, 2026</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <Card className="p-6 glass border-t-4 border-t-green-500">
                            <ShieldCheck className="w-10 h-10 text-green-600 mb-4" />
                            <h2 className="text-xl font-bold mb-2">Privacy Commitment</h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Your data is private and encrypted. We only share necessary info (like address) with local sellers and delivery partners.
                            </p>
                        </Card>
                        <Card className="p-6 glass border-t-4 border-t-blue-500">
                            <Scale className="w-10 h-10 text-blue-600 mb-4" />
                            <h2 className="text-xl font-bold mb-2">Fair Usage</h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Peppertap empowers local businesses. We do not charge hidden fees or participate in predatory pricing.
                            </p>
                        </Card>
                    </div>

                    <Card className="p-8 md:p-12 glass shadow-xl min-h-[600px] prose prose-green max-w-none">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">1. Usage of Platform</h2>
                        <p className="text-gray-600 mb-8">
                            By accessing Peppertap, you agree to support local commerce and respect our delivery partners. Our platform is a bridge between
                            kirana shops and modern consumers. Any misuse of automated tools or fake orders will result in immediate permanent ban.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-800 mb-6">2. Order & Payments</h2>
                        <p className="text-gray-600 mb-8">
                            Payments are handled securely via third-party providers. Refunds for cancelled orders are processed to your Peppertap wallet
                            instantly. Direct bank refunds may take 3-5 business days depending on your bank.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-800 mb-6">3. Delivery & Tracking</h2>
                        <p className="text-gray-600 mb-8">
                            We aim for delivery under 45 minutes for local groceries. Factors like weather, traffic, and high demand may cause delays.
                            Live tracking is provided for transparency, but please treat our riders with kindness.
                        </p>

                        <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4 mt-12">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                                📩
                            </div>
                            <div>
                                <p className="font-bold text-blue-900">Questions?</p>
                                <p className="text-sm text-blue-700">Email us at legal@peppertap.com for clarification on any terms.</p>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </main>
        </div>
    );
}
