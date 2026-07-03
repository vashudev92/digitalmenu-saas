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
  ChefHat,
  X
} from 'lucide-react';

export default function DashboardSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
    { name: 'Overview', icon: <LayoutDashboard className="w-4 h-4" />, href: '/dashboard' },
    { name: 'Restaurant Brand', icon: <Store className="w-4 h-4" />, href: '/dashboard/profile' },
    { name: 'Menu Profiles', icon: <BookCopy className="w-4 h-4" />, href: '/dashboard/menu-profiles' },
    { name: 'Categories', icon: <Layers className="w-4 h-4" />, href: '/dashboard/categories' },
    { name: 'Dishes Directory', icon: <UtensilsCrossed className="w-4 h-4" />, href: '/dashboard/items' },
    { name: 'QR Code Studio', icon: <QrCode className="w-4 h-4" />, href: '/dashboard/qrcode' },
    { name: 'Subscription Plan', icon: <CreditCard className="w-4 h-4" />, href: '/dashboard/subscription' },
    { name: 'System Settings', icon: <Settings className="w-4 h-4" />, href: '/dashboard/settings' },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar aside */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-[#09090B] border-r border-white/[0.04] flex flex-col justify-between h-screen z-50 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-20 shrink-0 overflow-y-auto scrollbar-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Logo Header */}
          <div className="h-16 border-b border-white/[0.04] flex items-center px-6 gap-2.5 bg-zinc-950/65 backdrop-blur justify-between md:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="p-1 rounded-lg bg-[#D4A853]/10 border border-[#D4A853]/25 text-[#D4A853] shrink-0 shadow-md shadow-[#D4A853]/5">
                <ChefHat className="w-4.5 h-4.5" />
              </div>
              <span className="font-serif font-black text-base tracking-widest uppercase bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                DigitalMenu
              </span>
            </div>
            {/* Close button on mobile sidebar header */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-500 hover:text-white md:hidden block hover:bg-white/[0.03]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Impersonation Banner Alert */}
          {impersonateSlug && (
            <div className="mx-4 mt-4 p-3.5 rounded-xl bg-[#D4A437]/5 border border-[#D4A437]/20 text-left shadow-lg">
              <span className="text-[9px] text-[#D4A437] font-bold uppercase tracking-[0.15em] block">Simulation Mode</span>
              <span className="text-xs text-white block truncate font-serif italic mt-0.5">{impersonateSlug}</span>
              <button
                onClick={handleExitImpersonate}
                className="mt-2.5 w-full py-1.5 text-[10px] font-bold uppercase text-black bg-[#D4A437] hover:bg-[#C49B4A] rounded-lg transition-all cursor-pointer shadow-sm active:scale-[0.98]"
              >
                Exit Simulation
              </button>
            </div>
          )}

          {/* User context account info card */}
          <div className="p-3 mx-4 mt-5 rounded-xl bg-white/[0.01] border border-white/[0.04] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4A853] to-[#B88E2F] text-black font-serif font-black flex items-center justify-center text-xs shrink-0 select-none shadow-md">
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'O'}
            </div>
            <div className="overflow-hidden text-left">
              <h4 className="text-xs font-bold text-white truncate leading-tight">{session?.user?.name || 'Owner Account'}</h4>
              <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase mt-0.5 block">
                {session?.user?.role || 'Owner'}
              </span>
            </div>
          </div>

          {/* Navigation Sidebar lists */}
          <nav className="mt-6 px-3 space-y-1">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={index}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'bg-[#D4A853]/5 text-[#D4A853] border-l-2 border-[#D4A853] pl-3.5'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.01]'
                  }`}
                >
                  <div className={`transition-colors shrink-0 ${isActive ? 'text-[#D4A853]' : 'text-gray-500'}`}>
                    {item.icon}
                  </div>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer System Logout Card */}
        <div className="p-4 border-t border-white/[0.04] bg-zinc-950/65">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-gray-500 hover:text-red-400 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
