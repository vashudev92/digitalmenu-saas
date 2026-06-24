'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ExternalLink, HelpCircle, Bell } from 'lucide-react';

export default function DashboardHeader() {
  const { data: session } = useSession();
  const slug = session?.user?.restaurantSlug;

  return (
    <header className="h-20 bg-[#0A0A0A] border-b border-[#D4A437]/10 flex items-center justify-between px-8 sticky top-0 z-10">
      <div>
        <h2 className="text-lg font-bold text-white">
          Workspace Dashboard
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">Manage your digital menu listings and QR settings.</p>
      </div>

      <div className="flex items-center gap-6">
        {slug ? (
          <Link
            href={`/r/${slug}`}
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4A437]/20 bg-[#D4A437]/5 hover:bg-[#D4A437]/10 text-[#D4A437] text-xs font-semibold tracking-wide transition-all shadow-[0_0_10px_rgba(212,164,55,0.05)] hover:shadow-[0_0_15px_rgba(212,164,55,0.15)]"
          >
            <span>View Live Menu</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <span className="text-xs text-gray-500 font-medium">No active restaurant URL</span>
        )}

        <div className="flex items-center gap-3 text-gray-400">
          <button className="p-2 rounded-full hover:bg-gray-900 hover:text-white transition-colors cursor-pointer">
            <Bell className="w-5 h-5" />
          </button>
          <Link href="/faq" target="_blank" className="p-2 rounded-full hover:bg-gray-900 hover:text-white transition-colors">
            <HelpCircle className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
