'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Phone, HelpCircle, ArrowLeft, ChevronRight, ShoppingBag, CreditCard, Truck } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const faqs = [
    {
        category: 'Ordering',
        icon: <ShoppingBag className="w-5 h-5 text-green-600" />,
        questions: [
            'How do I place an order?',
            'Can I cancel my order after it is prepared?',
            'What is the minimum order value?',
        ]
    },
    {
        category: 'Delivery',
        icon: <Truck className="w-5 h-5 text-blue-600" />,
        questions: [
            'How long does delivery take?',
            'Can I change my delivery address?',
            'How do I track my delivery rider?',
        ]
    },
    {
        category: 'Payments',
        icon: <CreditCard className="w-5 h-5 text-purple-600" />,
        questions: [
            'What payment methods are supported?',
            'How do refunds work?',
            'Where can I find my invoice?',
        ]
    }
];

export default function HelpPage() {
    return (
        <div className="min-h-screen bg-gray-50/50">
            <Navbar />

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <Link href="/dashboard" className="inline-flex items-center text-sm text-gray-600 hover:text-green-600 mb-6 group transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>

                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">How can we help?</h1>
                        <p className="text-gray-600">Search our knowledge base or contact support</p>
                    </div>

                    {/* Support Channels */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <Card className="p-6 glass border-t-4 border-t-green-500 hover:shadow-xl transition-all cursor-pointer group">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
                                    <MessageSquare className="w-7 h-7" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg">WhatsApp Support</h3>
                                    <p className="text-sm text-gray-500">Get instant help from our team</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </div>
                        </Card>
                        <Card className="p-6 glass border-t-4 border-t-blue-500 hover:shadow-xl transition-all cursor-pointer group">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Phone className="w-7 h-7" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg">Call Support</h3>
                                    <p className="text-sm text-gray-500">9 AM - 11 PM Support</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </div>
                        </Card>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                        <HelpCircle className="w-6 h-6 mr-3 text-purple-600" />
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-8">
                        {faqs.map((group, i) => (
                            <div key={i}>
                                <div className="flex items-center gap-2 mb-4">
                                    {group.icon}
                                    <h3 className="font-bold text-lg uppercase tracking-wider text-gray-500">{group.category}</h3>
                                </div>
                                <div className="space-y-3">
                                    {group.questions.map((q, j) => (
                                        <Card key={j} className="p-4 glass hover:bg-white/80 transition-colors cursor-pointer flex items-center justify-between group">
                                            <span className="text-gray-700 font-medium">{q}</span>
                                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-16 text-center p-12 glass rounded-3xl bg-gradient-to-br from-green-50 to-blue-50">
                        <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
                        <p className="text-gray-600 mb-8">Our support team is available 24/7 to assist you with any issues.</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button className="gradient-primary px-8">Chat with us</Button>
                            <Button variant="outline" className="bg-white">Email Support</Button>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
