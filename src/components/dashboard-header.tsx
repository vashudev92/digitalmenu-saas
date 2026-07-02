'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { ExternalLink, HelpCircle, Bell } from 'lucide-react';

export default function DashboardHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const slug = session?.user?.restaurantSlug;

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
    <header className="h-16 bg-[#09090B] border-b border-white/[0.04] flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="text-left">
        <h2 className="text-sm font-bold text-white tracking-wide">
          {getPageTitle()}
        </h2>
        <p className="text-[10px] text-gray-500 mt-0.5 leading-none">{getPageSubtitle()}</p>
      </div>

      <div className="flex items-center gap-5">
        {slug ? (
          <Link
            href={`/r/${slug}`}
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] text-white text-[11px] font-semibold transition-all cursor-pointer"
          >
            <span>View Live Menu</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </Link>
        ) : (
          <span className="text-[11px] text-gray-500 font-medium">No active URL</span>
        )}

        <div className="flex items-center gap-1 text-gray-400">
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
