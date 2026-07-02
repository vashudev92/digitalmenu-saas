'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Store,
  BookCopy,
  Layers,
  UtensilsCrossed,
  QrCode,
  CreditCard,
  Settings,
  LogOut,
  ChefHat
} from 'lucide-react';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const [impersonateSlug, setImpersonateSlug] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const match = document.cookie.match(new RegExp('(^| )impersonate_restaurant_slug=([^;]+)'));
      if (match) setImpersonateSlug(decodeURIComponent(match[2]));
    }
  }, []);

  const handleExitImpersonate = () => {
    document.cookie = "impersonate_restaurant_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "impersonate_restaurant_slug=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push('/admin');
  };

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, href: '/dashboard' },
    { name: 'Restaurant Profile', icon: <Store className="w-4 h-4" />, href: '/dashboard/profile' },
    { name: 'Menu Profiles', icon: <BookCopy className="w-4 h-4" />, href: '/dashboard/menu-profiles' },
    { name: 'Categories', icon: <Layers className="w-4 h-4" />, href: '/dashboard/categories' },
    { name: 'Menu Items', icon: <UtensilsCrossed className="w-4 h-4" />, href: '/dashboard/items' },
    { name: 'QR Code', icon: <QrCode className="w-4 h-4" />, href: '/dashboard/qrcode' },
    { name: 'Subscription', icon: <CreditCard className="w-4 h-4" />, href: '/dashboard/subscription' },
    { name: 'Settings', icon: <Settings className="w-4 h-4" />, href: '/dashboard/settings' },
  ];

  return (
    <aside className="w-64 bg-[#0B0B0D] border-r border-white/[0.04] flex flex-col justify-between h-screen sticky top-0 shrink-0 z-20 overflow-y-auto scrollbar-none">
      <div>
        {/* Logo */}
        <div className="h-16 border-b border-white/[0.04] flex items-center px-6 gap-2.5">
          <div className="p-1 rounded bg-[#D4A853]/10 border border-[#D4A853]/25 text-[#D4A853] shrink-0">
            <ChefHat className="w-4.5 h-4.5" />
          </div>
          <span className="font-serif font-bold text-base tracking-wide text-white">
            DigitalMenu
          </span>
        </div>

        {/* User Card */}
        <div className="p-3 mx-4 mt-5 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4A853] to-[#C49B4A] text-black font-bold flex items-center justify-center text-xs shrink-0 select-none">
            {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'O'}
          </div>
          <div className="overflow-hidden text-left">
            <h4 className="text-xs font-semibold text-white truncate leading-tight">{session?.user?.name || 'Owner'}</h4>
            <span className="text-[9px] text-[#D4A853] font-semibold tracking-widest uppercase mt-0.5 block">
              {session?.user?.role || 'Owner'}
            </span>
          </div>
        </div>

        {/* Impersonation Indicator */}
        {impersonateSlug && (
          <div className="mx-4 mt-4 p-3 rounded-xl bg-[#D4A437]/5 border border-[#D4A437]/25 text-left">
            <span className="text-[9px] text-[#D4A437] font-bold uppercase tracking-wider block">Admin Impersonating</span>
            <span className="text-xs text-white block truncate font-semibold mt-0.5">{impersonateSlug}</span>
            <button
              onClick={handleExitImpersonate}
              className="mt-2 w-full py-1 text-[10px] font-bold uppercase text-black bg-[#D4A437] hover:bg-[#C49B4A] rounded-lg transition-all cursor-pointer"
            >
              Exit & Return
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="mt-6 px-3 space-y-1">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-medium transition-all relative ${
                  isActive
                    ? 'bg-white/[0.03] text-[#D4A437] border-l-2 border-[#D4A437] pl-3.5'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.01]'
                }`}
              >
                <div className={`transition-colors shrink-0 ${isActive ? 'text-[#D4A437]' : 'text-gray-500 group-hover:text-gray-300'}`}>
                  {item.icon}
                </div>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Action */}
      <div className="p-4 border-t border-white/[0.04] bg-[#0B0B0D]">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-gray-500 hover:text-red-400 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
