'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Store,
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
  const { data: session } = useSession();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, href: '/dashboard' },
    { name: 'Restaurant Profile', icon: <Store className="w-5 h-5" />, href: '/dashboard/profile' },
    { name: 'Categories', icon: <Layers className="w-5 h-5" />, href: '/dashboard/categories' },
    { name: 'Menu Items', icon: <UtensilsCrossed className="w-5 h-5" />, href: '/dashboard/items' },
    { name: 'QR Code', icon: <QrCode className="w-5 h-5" />, href: '/dashboard/qrcode' },
    { name: 'Subscription', icon: <CreditCard className="w-5 h-5" />, href: '/dashboard/subscription' },
    { name: 'Settings', icon: <Settings className="w-5 h-5" />, href: '/dashboard/settings' },
  ];

  return (
    <aside className="w-64 bg-[#080808] border-r border-[#D4A437]/10 flex flex-col justify-between h-screen sticky top-0 shrink-0 z-20">
      <div>
        {/* Logo */}
        <div className="h-20 border-b border-[#D4A437]/10 flex items-center px-6 gap-2">
          <ChefHat className="w-6 h-6 text-[#D4A437]" />
          <span className="font-serif font-bold text-xl tracking-wide text-white">
            DigitalMenu
          </span>
        </div>

        {/* User Card */}
        <div className="p-4 mx-4 mt-6 rounded-2xl bg-gray-950/60 border border-gray-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4A437] to-[#B88E2F] text-black font-bold flex items-center justify-center text-sm">
            {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'O'}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold text-white truncate">{session?.user?.name || 'Owner'}</h4>
            <span className="text-[10px] text-[#D4A437] font-semibold tracking-wider uppercase">
              {session?.user?.role || 'Owner'}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="mt-8 px-4 space-y-1.5">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#D4A437]/10 border border-[#D4A437]/35 text-[#D4A437] shadow-[0_0_10px_rgba(212,164,55,0.05)]'
                    : 'border border-transparent text-gray-400 hover:text-white hover:bg-gray-950'
                }`}
              >
                <div className={`transition-colors ${isActive ? 'text-[#D4A437]' : 'text-gray-500 group-hover:text-gray-300'}`}>
                  {item.icon}
                </div>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Action */}
      <div className="p-4 border-t border-[#D4A437]/10">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/5 border border-transparent transition-all"
        >
          <LogOut className="w-5 h-5 text-gray-500 group-hover:text-red-400" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
