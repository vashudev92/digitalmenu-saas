import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import Link from 'next/link';
import { Layers, UtensilsCrossed, QrCode, ArrowUpRight, Plus, Download, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login');
  }

  const restaurant = await db.restaurant.findUnique({
    where: { ownerId: session.user.id },
    include: {
      _count: {
        select: {
          categories: true,
          menuItems: true,
        },
      },
      qrCode: true,
      subscription: {
        include: {
          plan: true,
        },
      },
    },
  });

  if (!restaurant) {
    redirect('/register');
  }

  const totalCategories = restaurant._count.categories;
  const totalMenuItems = restaurant._count.menuItems;
  const qrStatus = restaurant.qrCode ? 'Generated' : 'Not Generated';

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#D4A437]/15 to-[#D4A437]/5 border border-[#D4A437]/25 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold">Welcome to {restaurant.name}</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your menu card, design QR code displays, and review subscriptions.</p>
        </div>
        <div className="sm:flex items-center gap-2 px-4 py-2 rounded-full glass border-[#D4A437]/20 text-xs font-semibold text-[#D4A437] w-fit">
          <Sparkles className="w-4 h-4" /> {restaurant.subscription?.plan?.name || 'Trial'} Plan Active
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Categories */}
        <div className="glass p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Categories</span>
            <h3 className="text-3xl font-bold mt-2 font-serif">{totalCategories}</h3>
            <Link href="/dashboard/categories" className="text-xs text-[#D4A437] hover:underline mt-3 inline-flex items-center gap-1">
              View Categories <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="p-4 rounded-xl bg-gray-950/80 border border-gray-900 text-[#D4A437]">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Total Menu Items */}
        <div className="glass p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Menu Items</span>
            <h3 className="text-3xl font-bold mt-2 font-serif">{totalMenuItems}</h3>
            <Link href="/dashboard/items" className="text-xs text-[#D4A437] hover:underline mt-3 inline-flex items-center gap-1">
              View Menu Items <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="p-4 rounded-xl bg-gray-950/80 border border-gray-900 text-[#D4A437]">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
        </div>

        {/* QR Code Status */}
        <div className="glass p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">QR Code Status</span>
            <h3 className="text-3xl font-bold mt-2 font-serif text-emerald-400">{qrStatus}</h3>
            <Link href="/dashboard/qrcode" className="text-xs text-[#D4A437] hover:underline mt-3 inline-flex items-center gap-1">
              QR Settings <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="p-4 rounded-xl bg-gray-950/80 border border-gray-900 text-[#D4A437]">
            <QrCode className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass p-8 rounded-3xl">
        <h3 className="font-serif text-xl font-bold mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link
            href="/dashboard/categories"
            className="p-5 rounded-2xl bg-gray-950/40 hover:bg-[#D4A437]/5 border border-gray-900 hover:border-[#D4A437]/30 flex flex-col items-start transition-all"
          >
            <div className="p-2.5 rounded-lg bg-[#D4A437]/10 text-[#D4A437] mb-4">
              <Plus className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base mb-1">Add Menu Category</h4>
            <p className="text-xs text-gray-500">Create groupings like Chef Picks, Starters, or Desserts.</p>
          </Link>

          <Link
            href="/dashboard/items"
            className="p-5 rounded-2xl bg-gray-950/40 hover:bg-[#D4A437]/5 border border-gray-900 hover:border-[#D4A437]/30 flex flex-col items-start transition-all"
          >
            <div className="p-2.5 rounded-lg bg-[#D4A437]/10 text-[#D4A437] mb-4">
              <Plus className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base mb-1">Add Menu Item</h4>
            <p className="text-xs text-gray-500">Add dishes, specify prices, vegetarian flags, and upload images.</p>
          </Link>

          <Link
            href="/dashboard/qrcode"
            className="p-5 rounded-2xl bg-gray-950/40 hover:bg-[#D4A437]/5 border border-gray-900 hover:border-[#D4A437]/30 flex flex-col items-start transition-all"
          >
            <div className="p-2.5 rounded-lg bg-[#D4A437]/10 text-[#D4A437] mb-4">
              <Download className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base mb-1">Download QR Code</h4>
            <p className="text-xs text-gray-500">Print Table Tents, Acrylic Stands, or Counter Cards.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
