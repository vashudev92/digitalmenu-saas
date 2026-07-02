import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import Link from 'next/link';
import { 
  Layers, 
  UtensilsCrossed, 
  QrCode, 
  ArrowUpRight, 
  Plus, 
  Download, 
  Sparkles,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
      qrCodes: true,
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
  const qrStatus = restaurant.qrCodes.length > 0 ? 'Active' : 'Missing';

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-left">
      {/* Welcome Banner */}
      <Card className="p-6 sm:p-8 bg-gradient-to-br from-[#D4A853]/10 to-transparent border-white/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">Welcome back, {restaurant.name}</h1>
          <p className="text-xs text-gray-400 mt-1">Design menu layout schemes, generate table standees, and review statistics.</p>
        </div>
        <Badge variant="gold" showDot={true} className="w-fit self-start sm:self-center">
          {restaurant.subscription?.plan?.name || 'Trial'} Plan
        </Badge>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Categories */}
        <Card className="p-6 flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Menu Categories</span>
              <h3 className="text-3xl font-bold mt-2 font-serif text-white">{totalCategories}</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-gray-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <Link href="/dashboard/categories" className="text-[11px] text-[#D4A853] hover:underline inline-flex items-center gap-1 font-semibold">
            Manage Categories <ArrowUpRight className="w-3 h-3" />
          </Link>
        </Card>

        {/* Total Menu Items */}
        <Card className="p-6 flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Menu Items</span>
              <h3 className="text-3xl font-bold mt-2 font-serif text-white">{totalMenuItems}</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-gray-400">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <Link href="/dashboard/items" className="text-[11px] text-[#D4A853] hover:underline inline-flex items-center gap-1 font-semibold">
            Manage Dishes <ArrowUpRight className="w-3 h-3" />
          </Link>
        </Card>

        {/* QR Code Status */}
        <Card className="p-6 flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">QR Routing Code</span>
              <h3 className={`text-3xl font-bold mt-2 font-serif ${qrStatus === 'Active' ? 'text-emerald-400' : 'text-amber-400'}`}>{qrStatus}</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-gray-400">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <Link href="/dashboard/qrcode" className="text-[11px] text-[#D4A853] hover:underline inline-flex items-center gap-1 font-semibold">
            Print Studio <ArrowUpRight className="w-3 h-3" />
          </Link>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-8">
        <h3 className="font-serif text-lg font-bold text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link
            href="/dashboard/categories"
            className="p-5 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.04] hover:border-[#D4A853]/30 flex flex-col items-start transition-all"
          >
            <div className="p-2 rounded-lg bg-[#D4A853]/10 text-[#D4A853] mb-4">
              <Plus className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-white mb-1">Create Category</h4>
            <p className="text-[10px] text-gray-500">Group dishes (e.g. Starters, Mains, Desserts).</p>
          </Link>

          <Link
            href="/dashboard/items"
            className="p-5 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.04] hover:border-[#D4A853]/30 flex flex-col items-start transition-all"
          >
            <div className="p-2 rounded-lg bg-[#D4A853]/10 text-[#D4A853] mb-4">
              <Plus className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-white mb-1">Add Menu Dish</h4>
            <p className="text-[10px] text-gray-500">Add photos, descriptions, and dietary labels.</p>
          </Link>

          <Link
            href="/dashboard/qrcode"
            className="p-5 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.04] hover:border-[#D4A853]/30 flex flex-col items-start transition-all"
          >
            <div className="p-2 rounded-lg bg-[#D4A853]/10 text-[#D4A853] mb-4">
              <Download className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-white mb-1">Print QR standee</h4>
            <p className="text-[10px] text-gray-500">Download acrylic cards or print tent standees.</p>
          </Link>
        </div>
      </Card>
    </div>
  );
}
