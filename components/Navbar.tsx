'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, Heart, User, Menu, Bell, Settings, Sun, Moon, Shield, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/store/cartStore';
import { useStore } from '@/lib/useStore';
import { useAuthStore } from '@/store/authStore';
import { Badge } from '@/components/ui/badge';

import { useSearchStore } from '@/store/searchStore';

export function Navbar() {
    const { query, setQuery } = useSearchStore();
    const totalItems = useStore(useCartStore, (state) => state.getTotalItems()) ?? 0;
    const user = useStore(useAuthStore, (state) => state.user);
    const [isDark, setIsDark] = useState(false);

    const toggleDark = () => {
        setIsDark(!isDark);
        // In a real app, this would toggle a class on the html element
        document.documentElement.classList.toggle('dark');
    };

    return (
        <header className="sticky top-0 z-50 glass border-b">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            P
                        </div>
                        <h1 className="text-2xl font-bold text-gradient">Peppertap</h1>
                    </Link>

                    <div className="hidden md:flex flex-1 max-w-xl mx-8">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Search for products..."
                                className="pl-10 pr-10"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-primary transition-colors">
                                <Mic className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <Button onClick={toggleDark} variant="ghost" size="icon" className="relative hover:bg-amber-50 hover:text-amber-600 transition-colors">
                            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </Button>

                        <Link href="/wishlist">
                            <Button asChild variant="ghost" size="icon" className="relative hover:bg-pink-50 hover:text-pink-600 transition-colors">
                                <div><Heart className="h-5 w-5" /></div>
                            </Button>
                        </Link>

                        <Link href="/notifications">
                            <Button asChild variant="ghost" size="icon" className="relative hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                <div><Bell className="h-5 w-5" /></div>
                            </Button>
                        </Link>

                        <Link href="/cart">
                            <Button asChild variant="ghost" size="icon" className="relative hover:bg-green-50 hover:text-green-600 transition-colors">
                                <div>
                                    <ShoppingCart className="h-5 w-5" />
                                    {totalItems > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-md animate-in zoom-in">
                                            {totalItems}
                                        </span>
                                    )}
                                </div>
                            </Button>
                        </Link>

                        <Link href={user ? (user.role === 'SELLER' ? "/seller/dashboard" : user.role === 'ADMIN' ? "/admin/dashboard" : "/dashboard") : "/auth/login"}>
                            <Button asChild variant="ghost" className="h-10 px-2 flex items-center gap-2 hover:bg-purple-50 hover:text-purple-600 transition-colors rounded-xl group">
                                <div>
                                    {user ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-400 to-blue-500 border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold group-hover:scale-105 transition-transform">
                                                {user.name?.charAt(0) || 'U'}
                                            </div>
                                            {user.role === 'SELLER' && (
                                                <Badge className="hidden lg:flex bg-purple-100 text-purple-700 hover:bg-purple-100 border-none px-1.5 py-0 text-[10px] font-black uppercase">Seller Hub</Badge>
                                            )}
                                            {user.role === 'ADMIN' && (
                                                <Badge className="hidden lg:flex bg-red-100 text-red-700 hover:bg-red-100 border-none px-1.5 py-0 text-[10px] font-black uppercase flex items-center gap-1">
                                                    <Shield className="w-2 h-2" /> Admin Control
                                                </Badge>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <User className="h-5 w-5" />
                                            <span className="text-sm font-bold">Login</span>
                                        </div>
                                    )}
                                </div>
                            </Button>
                        </Link>

                        <div className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Mobile Search */}
                <div className="md:hidden mt-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Search for products..."
                            className="pl-10 h-9"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
