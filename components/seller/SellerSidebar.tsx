'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    ClipboardList,
    Wallet,
    MessageSquare,
    LogOut,
    Settings,
    ChevronRight,
    Store,
    MapPin,
    Tag,
    Bell,
    User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

const sidebarItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/seller/dashboard' },
    { name: 'Product Manager', icon: Package, href: '/seller/products' },
    { name: 'Orders Queue', icon: ClipboardList, href: '/seller/orders' },
    { name: 'Store Addresses', icon: MapPin, href: '/seller/addresses' },
    { name: 'Coupons & Deals', icon: Tag, href: '/seller/coupons' },
    { name: 'Notifications', icon: Bell, href: '/seller/notifications' },
    { name: 'Earnings', icon: Wallet, href: '/seller/earnings' },
    { name: 'Support', icon: MessageSquare, href: '/seller/support' },
];

export function SellerSidebar() {
    const pathname = usePathname();
    const logout = useAuthStore((state) => state.logout);
    const router = useRouter();
    const { toast } = useToast();

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            logout();
            toast({ title: 'Logged Out', description: 'See you soon!' });
            router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <aside className="w-64 bg-white border-r h-[calc(100-rem)] sticky top-20 hidden lg:flex flex-col p-6 gap-8">
            <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white">
                    <Store className="w-5 h-5" />
                </div>
                <h2 className="font-black text-gray-900 tracking-tight">Seller Hub</h2>
            </div>

            <nav className="flex-1 space-y-2">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-between p-3 rounded-2xl transition-all group",
                                isActive
                                    ? "bg-amber-50 text-amber-600 shadow-sm"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={cn("w-5 h-5", isActive ? "text-amber-600" : "text-gray-400 group-hover:text-gray-600")} />
                                <span className="font-bold text-sm tracking-tight">{item.name}</span>
                            </div>
                            {isActive && <ChevronRight className="w-4 h-4" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="space-y-4 pt-6 border-t font-sans">
                <Link
                    href="/seller/profile"
                    className="flex items-center gap-3 p-3 rounded-2xl text-gray-500 hover:bg-gray-50 transition-all font-bold text-sm"
                >
                    <User className="w-5 h-5" />
                    My Profile
                </Link>
                <Link
                    href="/seller/settings"
                    className="flex items-center gap-3 p-3 rounded-2xl text-gray-500 hover:bg-gray-50 transition-all font-bold text-sm"
                >
                    <Settings className="w-5 h-5" />
                    Store Settings
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm"
                >
                    <LogOut className="w-5 h-5" />
                    Logout Profile
                </button>
            </div>
        </aside>
    );
}
