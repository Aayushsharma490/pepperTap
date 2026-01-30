'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    Send,
    User,
    Headset,
    HelpCircle,
    Search,
    Paperclip,
    Smile,
    ArrowRight,
    Circle,
    Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { SellerSidebar } from '@/components/seller/SellerSidebar';
import { useAuthStore } from '@/store/authStore';
import { useStore } from '@/lib/useStore';
import { useToast } from '@/components/ui/use-toast';

export default function SellerSupportPage() {
    const user = useStore(useAuthStore, (state) => state.user);
    const { toast } = useToast();
    const [isMounted, setIsMounted] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const [messages, setMessages] = useState([
        { id: '1', sender: 'ADMIN', text: 'Hello! How can we assist you with your store today?', time: '10:30 AM' },
        { id: '2', sender: 'SELLER', text: 'Hi, I had a question about the recent withdrawal process.', time: '10:32 AM' },
        { id: '3', sender: 'ADMIN', text: 'Sure! Payouts usually take 24-48 hours to reflect in your bank. Is there a specific transaction ID?', time: '10:33 AM' },
    ]);

    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        setIsMounted(true);
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const msg = {
            id: Date.now().toString(),
            sender: 'SELLER',
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, msg]);
        setNewMessage('');

        // Simulate admin response
        setTimeout(() => {
            const adminMsg = {
                id: (Date.now() + 1).toString(),
                sender: 'ADMIN',
                text: "Thanks for reaching out! One of our agents will look into this and get back to you shortly.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, adminMsg]);
        }, 1500);
    };

    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
                <SellerSidebar />

                <main className="flex-1 flex flex-col h-[calc(100vh-180px)]">
                    <div className="flex gap-8 h-full">
                        {/* Chat Interface */}
                        <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
                            {/* Chat Header */}
                            <div className="p-6 border-b flex items-center justify-between bg-white z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
                                        <Headset className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="font-black text-gray-900">Admin Support</h2>
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-50 rounded-full">
                                                <Circle className="w-1.5 h-1.5 fill-green-500 text-green-500" />
                                                <span className="text-[10px] font-black text-green-700">ONLINE</span>
                                            </div>
                                        </div>
                                        <p className="text-xs font-medium text-gray-400 mt-0.5">Average response time: 5 mins</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-400 hover:bg-gray-50"><Info className="w-5 h-5" /></Button>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-gray-50/30">
                                {messages.map((msg, i) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className={`flex ${msg.sender === 'SELLER' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[75%] space-y-1 ${msg.sender === 'SELLER' ? 'items-end' : 'items-start'} flex flex-col`}>
                                            <div className={`p-4 rounded-3xl font-bold text-sm shadow-sm ${msg.sender === 'SELLER'
                                                    ? 'bg-gray-900 text-white rounded-br-lg px-6'
                                                    : 'bg-white text-gray-800 rounded-bl-lg px-6'
                                                }`}>
                                                {msg.text}
                                            </div>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter px-2">{msg.time}</span>
                                        </div>
                                    </motion.div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Chat Input */}
                            <form onSubmit={handleSendMessage} className="p-6 bg-white border-t">
                                <div className="relative flex items-center gap-4">
                                    <div className="flex-1 relative">
                                        <Input
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type your message here..."
                                            className="h-14 rounded-2xl bg-gray-50 border-none pl-6 pr-24 font-bold text-gray-900 focus-visible:ring-amber-500"
                                        />
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                            <Button type="button" variant="ghost" size="icon" className="h-10 w-10 text-gray-400 hover:text-amber-500"><Smile className="w-5 h-5" /></Button>
                                            <Button type="button" variant="ghost" size="icon" className="h-10 w-10 text-gray-400 hover:text-amber-500"><Paperclip className="w-5 h-5" /></Button>
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        className="h-14 w-14 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-100 flex items-center justify-center shrink-0 transition-all hover:scale-105 active:scale-95"
                                    >
                                        <Send className="w-6 h-6" />
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Sidebar Help */}
                        <div className="hidden xl:flex flex-col w-80 gap-6">
                            <Card className="p-6 border-none shadow-sm bg-white rounded-3xl">
                                <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                                    <HelpCircle className="w-5 h-5 text-amber-500" />
                                    Quick Help
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        'How to add products?',
                                        'Status definitions',
                                        'Withdrawal rules',
                                        'Update store details',
                                    ].map((q, i) => (
                                        <button key={i} className="w-full text-left p-4 rounded-2xl bg-gray-50 hover:bg-amber-50 text-gray-600 hover:text-amber-600 font-bold text-sm transition-all group flex items-center justify-between">
                                            {q}
                                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    ))}
                                </div>
                            </Card>

                            <Card className="p-6 border-none shadow-sm gradient-primary text-white rounded-3xl">
                                <h4 className="font-black mb-2">Knowledge Base</h4>
                                <p className="text-xs font-semibold opacity-80 leading-relaxed mb-6">Explore our detailed guides and tutorials to master your storefront.</p>
                                <Button className="w-full bg-white text-gray-900 hover:bg-gray-100 rounded-xl font-bold h-10">Read Docs</Button>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
