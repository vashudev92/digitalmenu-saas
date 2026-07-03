import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
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
  UserCheck,
  ChevronRight,
  BookCopy,
  Settings,
  Calendar,
  ChefHat
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

  const cookieStore = await cookies();
  const impersonateId = cookieStore.get('impersonate_restaurant_id')?.value;

  let whereClause: any = { ownerId: session.user.id };
  if (impersonateId && session.user.role === 'ADMIN') {
    whereClause = { id: impersonateId };
  }

  const restaurant = await db.restaurant.findUnique({
    where: whereClause,
    include: {
      _count: {
        select: {
          categories: true,
          menuItems: true,
          menuProfiles: true,
        },
      },
      qrCodes: true,
      subscription: {
        include: {
          plan: true,
        },
      },
      // Fetch latest items for high-density summary
      menuItems: {
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: { category: true }
      }
    },
  });

  if (!restaurant) {
    redirect('/register');
  }

  const totalCategories = restaurant._count.categories;
  const totalMenuItems = restaurant._count.menuItems;
  const totalProfiles = restaurant._count.menuProfiles;
  const qrStatus = restaurant.qrCodes.length > 0 ? 'Active' : 'Missing';

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-left">
      {/* Premium Stripe-like Glass Welcome Header */}
      <Card className="p-4 sm:p-6 bg-gradient-to-br from-zinc-900 to-black border-white/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        {/* Decorative subtle gold light leak */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A853]/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="space-y-1 relative z-10">
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
            Welcome back, {restaurant.name}
          </h1>
          <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
            Manage your digital menu workspace. Customize branding typography, edit active dish catalogs, and configure multi-profile restaurant menus.
          </p>
        </div>
        <div className="flex flex-col sm:items-end justify-center gap-1.5 relative z-10 shrink-0 self-start sm:self-center">
          <Badge variant="gold" showDot={true} className="w-fit">
            {restaurant.subscription?.plan?.name || 'Trial'} Plan
          </Badge>
          {restaurant.subscription?.endDate && (
            <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#D4A853]" /> Expires: {new Date(restaurant.subscription.endDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </Card>

      {/* High Density KPI Statistics Dashboard Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* KPI: Categories */}
        <Card className="p-3.5 sm:p-4 flex flex-col justify-between h-28 border-white/[0.04] bg-zinc-900/40 relative group overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest block">Categories</span>
              <h3 className="text-2xl font-serif font-black text-white mt-1.5">{totalCategories}</h3>
            </div>
            <div className="p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-gray-500 group-hover:text-[#D4A853] transition-colors">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <Link href="/dashboard/categories" className="text-[10px] text-[#D4A853] hover:underline flex items-center gap-0.5 font-semibold">
            View list <ChevronRight className="w-3 h-3" />
          </Link>
        </Card>

        {/* KPI: Dishes */}
        <Card className="p-3.5 sm:p-4 flex flex-col justify-between h-28 border-white/[0.04] bg-zinc-900/40 relative group overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest block">Dishes Directory</span>
              <h3 className="text-2xl font-serif font-black text-white mt-1.5">{totalMenuItems}</h3>
            </div>
            <div className="p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-gray-500 group-hover:text-[#D4A853] transition-colors">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <Link href="/dashboard/items" className="text-[10px] text-[#D4A853] hover:underline flex items-center gap-0.5 font-semibold">
            View list <ChevronRight className="w-3 h-3" />
          </Link>
        </Card>

        {/* KPI: Menu Profiles */}
        <Card className="p-3.5 sm:p-4 flex flex-col justify-between h-28 border-white/[0.04] bg-zinc-900/40 relative group overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest block">Active Profiles</span>
              <h3 className="text-2xl font-serif font-black text-white mt-1.5">{totalProfiles}</h3>
            </div>
            <div className="p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-gray-500 group-hover:text-[#D4A853] transition-colors">
              <BookCopy className="w-4 h-4" />
            </div>
          </div>
          <Link href="/dashboard/menu-profiles" className="text-[10px] text-[#D4A853] hover:underline flex items-center gap-0.5 font-semibold">
            View list <ChevronRight className="w-3 h-3" />
          </Link>
        </Card>

        {/* KPI: QR Status */}
        <Card className="p-3.5 sm:p-4 flex flex-col justify-between h-28 border-white/[0.04] bg-zinc-900/40 relative group overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest block">QR Routing Code</span>
              <h3 className={`text-2xl font-serif font-black mt-1.5 ${qrStatus === 'Active' ? 'text-emerald-400' : 'text-amber-400'}`}>{qrStatus}</h3>
            </div>
            <div className="p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-gray-500 group-hover:text-[#D4A853] transition-colors">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <Link href="/dashboard/qrcode" className="text-[10px] text-[#D4A853] hover:underline flex items-center gap-0.5 font-semibold">
            Print Studio <ChevronRight className="w-3 h-3" />
          </Link>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column: Quick Actions Panel */}
        <Card className="p-4 sm:p-5 md:col-span-1 border-white/[0.04] bg-zinc-900/20 space-y-4">
          <div>
            <h3 className="font-serif text-sm font-bold text-white tracking-wider uppercase">Quick Actions</h3>
            <p className="text-[10px] text-gray-500 mt-0.5">Rapid adjustments configuration settings.</p>
          </div>
          
          <div className="space-y-2">
            <Link
              href="/dashboard/items"
              className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.04] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#D4A853]/10 text-[#D4A853]">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-bold text-white">Add Menu Dish</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-white transition-colors" />
            </Link>

            <Link
              href="/dashboard/categories"
              className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.04] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#D4A853]/10 text-[#D4A853]">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-bold text-white">Create Category</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-white transition-colors" />
            </Link>

            <Link
              href="/dashboard/qrcode"
              className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.04] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#D4A853]/10 text-[#D4A853]">
                  <Download className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-bold text-white">QR Standee Creator</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-white transition-colors" />
            </Link>
          </div>
        </Card>

        {/* Right column: High density lists summary */}
        <Card className="p-4 sm:p-5 md:col-span-2 border-white/[0.04] bg-zinc-900/20 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif text-sm font-bold text-white tracking-wider uppercase">Recently Added Dishes</h3>
              <p className="text-[10px] text-gray-500 mt-0.5">Quick lookup of items recently uploaded to menus.</p>
            </div>
            <Link href="/dashboard/items" className="text-[10px] text-[#D4A853] hover:underline font-semibold flex items-center gap-0.5">
              Edit all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="border border-white/[0.04] rounded-xl overflow-hidden divide-y divide-white/[0.04]">
            {restaurant.menuItems.length > 0 ? (
              restaurant.menuItems.map((item) => (
                <div key={item.id} className="p-3 flex items-center justify-between bg-zinc-900/40 hover:bg-zinc-900/60 transition-colors">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 bg-zinc-950 border border-white/5 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                      ) : (
                        <ChefHat className="w-4.5 h-4.5 text-gray-600" />
                      )}
                    </div>
                    <div className="text-left overflow-hidden">
                      <span className="text-xs font-bold text-white block truncate">{item.name}</span>
                      <span className="text-[9px] text-gray-500 block truncate">{item.category?.name || 'Uncategorized'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-xs font-bold text-white">
                      {restaurant.currencySymbol}{item.price.toFixed(2)}
                    </span>
                    <span className={`w-1.5 h-1.5 rounded-full ${item.isAvailable ? 'bg-green-500' : 'bg-red-500'}`} title={item.isAvailable ? 'In stock' : 'Out of stock'} />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-gray-500 space-y-2">
                <ChefHat className="w-8 h-8 mx-auto text-gray-700" />
                <p>No menu dishes created yet.</p>
                <Link href="/dashboard/items" className="text-[10px] text-[#D4A853] hover:underline font-bold block">
                  Add Your First Dish
                </Link>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
