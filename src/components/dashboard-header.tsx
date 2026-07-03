'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { ExternalLink, HelpCircle, Bell, Menu } from 'lucide-react';

export default function DashboardHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const slug = session?.user?.restaurantSlug;

  const [isImpersonating, setIsImpersonating] = useState(false);

  useEffect(() => {
    setIsImpersonating(document.cookie.includes('impersonate_restaurant_id='));
  }, []);

  const handleExitImpersonate = () => {
    document.cookie = "impersonate_restaurant_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "impersonate_restaurant_slug=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    window.location.href = '/admin';
  };

  // Resolve dynamic title
  const getPageTitle = () => {
    if (pathname.includes('/profile')) return 'Restaurant Profile';
    if (pathname.includes('/menu-profiles')) return 'Menu Profiles';
    if (pathname.includes('/categories')) return 'Categories';
    if (pathname.includes('/items')) return 'Menu Items';
    if (pathname.includes('/qrcode')) return 'QR Code Studio';
    if (pathname.includes('/subscription')) return 'Subscription';
    if (pathname.includes('/settings')) return 'Settings';
    return 'Workspace Dashboard';
  };

  const getPageSubtitle = () => {
    if (pathname.includes('/profile')) return 'Manage your brand identity, contact details, and locations.';
    if (pathname.includes('/menu-profiles')) return 'Configure distinct dining experiences and layout schemes.';
    if (pathname.includes('/categories')) return 'Organize your dishes into scannable menu categories.';
    if (pathname.includes('/items')) return 'Add and edit dishes, dietary markers, and pricing details.';
    if (pathname.includes('/qrcode')) return 'Download routing codes and print themed tabletop tent standees.';
    if (pathname.includes('/subscription')) return 'View subscription status, features, and plan tiers.';
    if (pathname.includes('/settings')) return 'Manage password, credentials, and account parameters.';
    return 'Overview of menu configurations and platform metrics.';
  };

  return (
    <header className="h-16 bg-[#09090B] border-b border-white/[0.04] flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 w-full backdrop-blur-md bg-opacity-80">
      <div className="flex items-center gap-3 text-left min-w-0">
        {/* Hamburger Toggle */}
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg hover:bg-white/[0.03] text-gray-400 hover:text-white transition-all cursor-pointer md:hidden block focus:outline-none shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-white tracking-wide truncate">
            {getPageTitle()}
          </h2>
          <p className="text-[10px] text-gray-500 mt-0.5 leading-none hidden sm:block truncate">{getPageSubtitle()}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-5 shrink-0">
        {isImpersonating && (
          <button
            onClick={handleExitImpersonate}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[10px] md:text-[11px] font-semibold transition-all cursor-pointer shrink-0"
          >
            <span>Exit Simulation</span>
          </button>
        )}
        {slug ? (
          <Link
            href={`/r/${slug}`}
            target="_blank"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] text-white text-[10px] md:text-[11px] font-semibold transition-all cursor-pointer shrink-0"
          >
            <span className="hidden xs:inline">View Live Menu</span>
            <ExternalLink className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400" />
          </Link>
        ) : (
          <span className="text-[10px] md:text-[11px] text-gray-500 font-medium hidden xs:inline">No active URL</span>
        )}

        <div className="flex items-center gap-0.5 text-gray-400">
          <button className="p-2 rounded-lg hover:bg-white/[0.03] hover:text-white transition-all cursor-pointer">
            <Bell className="w-4 h-4" />
          </button>
          <Link href="/faq" target="_blank" className="p-2 rounded-lg hover:bg-white/[0.03] hover:text-white transition-all">
            <HelpCircle className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
