'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Store,
  UtensilsCrossed,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Lock,
  LogOut,
  ArrowRight,
  Search
} from 'lucide-react';
import Link from 'next/link';

interface RestaurantItem {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  ownerName: string;
  ownerEmail: string;
  dishesCount: number;
  planName: string;
  subStatus: string;
}

interface Stats {
  totalRestaurants: number;
  activeSubCount: number;
  suspendedCount: number;
  totalMenuItems: number;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState<Stats | null>(null);
  const [restaurants, setRestaurants] = useState<RestaurantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  async function loadAdminData() {
    try {
      const res = await fetch('/api/admin/dashboard');
      if (!res.ok) {
        if (res.status === 401) {
          setError('Unauthorized. Only platform administrators can view this page.');
          return;
        }
        throw new Error('Failed to load admin data');
      }
      const data = await res.json();
      setStats(data.stats);
      setRestaurants(data.restaurants);
    } catch (err) {
      setError('Could not fetch administrator analytics.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    if (session && session.user.role !== 'ADMIN') {
      setError('Unauthorized. Only platform administrators can view this page.');
      setLoading(false);
      return;
    }
    if (session && session.user.role === 'ADMIN') {
      loadAdminData();
    }
  }, [session, status]);

  const handleAction = async (id: string, action: 'suspend' | 'approve') => {
    setActionLoadingId(id);
    try {
      const res = await fetch('/api/admin/suspend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurantId: id, action }),
      });

      if (!res.ok) throw new Error('Action failed');

      setRestaurants((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, subStatus: action === 'suspend' ? 'CANCELLED' : 'ACTIVE' } : r
        )
      );

      // Reload stats
      const statsRes = await fetch('/api/admin/dashboard');
      const statsData = await statsRes.json();
      setStats(statsData.stats);
    } catch (err) {
      alert('Failed to perform admin status change.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredRestaurants = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      r.ownerEmail.toLowerCase().includes(search.toLowerCase())
  );

  if (status === 'loading' || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0A0A0A] text-white">
        <Loader2 className="w-10 h-10 animate-spin text-[#D4A437]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0A0A0A] text-white p-4">
        <div className="glass p-8 rounded-3xl text-center max-w-md">
          <Lock className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <h3 className="font-serif text-2xl font-bold mb-2">Access Denied</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">{error}</p>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#D4A437] to-[#B88E2F] text-black font-bold text-sm"
          >
            Login as Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6 sm:p-10 space-y-8">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-[#D4A437]/10 pb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-[#D4A437]" />
          <div>
            <h1 className="font-serif text-3xl font-bold">Admin Portal</h1>
            <span className="text-xs text-gray-500 font-semibold tracking-widest uppercase">Platform Control Panel</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/admin/themes"
            className="text-xs text-[#D4A437] hover:text-white border border-[#D4A437]/20 hover:border-[#D4A437]/60 px-4 py-2.5 rounded-full transition-all bg-[#D4A437]/5 font-semibold"
          >
            Theme Library
          </Link>
          <Link
            href="/dashboard"
            className="text-xs text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700 px-4 py-2.5 rounded-full transition-all"
          >
            Owner View
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-xs font-semibold tracking-wide transition-all"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </div>

      {/* Stats row */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="glass p-6 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Restaurants</span>
              <h3 className="text-3xl font-bold mt-1 font-serif text-white">{stats.totalRestaurants}</h3>
            </div>
            <div className="p-3.5 rounded-xl bg-gray-950 border border-gray-900 text-[#D4A437]">
              <Store className="w-5 h-5" />
            </div>
          </div>

          <div className="glass p-6 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Active Subs</span>
              <h3 className="text-3xl font-bold mt-1 font-serif text-emerald-400">{stats.activeSubCount}</h3>
            </div>
            <div className="p-3.5 rounded-xl bg-gray-950 border border-gray-900 text-[#D4A437]">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="glass p-6 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Suspended</span>
              <h3 className="text-3xl font-bold mt-1 font-serif text-red-400">{stats.suspendedCount}</h3>
            </div>
            <div className="p-3.5 rounded-xl bg-gray-950 border border-gray-900 text-[#D4A437]">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="glass p-6 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Dishes</span>
              <h3 className="text-3xl font-bold mt-1 font-serif text-white">{stats.totalMenuItems}</h3>
            </div>
            <div className="p-3.5 rounded-xl bg-gray-950 border border-gray-900 text-[#D4A437]">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* Restaurants List Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-serif text-2xl font-bold text-white">Registered Venues</h2>
          
          {/* Search bar */}
          <div className="relative w-full sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by restaurant or owner..."
              className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-600 focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="glass rounded-3xl overflow-hidden overflow-x-auto border-gray-850">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-900 bg-gray-950/40 text-xs font-semibold text-gray-400 uppercase">
                <th className="px-6 py-4.5">Restaurant Details</th>
                <th className="px-6 py-4.5">Owner Contact</th>
                <th className="px-6 py-4.5">Registered</th>
                <th className="px-6 py-4.5 text-center">Dishes</th>
                <th className="px-6 py-4.5">Plan Tier</th>
                <th className="px-6 py-4.5">Status</th>
                <th className="px-6 py-4.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900/60 text-sm">
              {filteredRestaurants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No restaurants found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredRestaurants.map((res) => {
                  const isSuspended = res.subStatus === 'CANCELLED';
                  const dateFormatted = new Date(res.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  });

                  return (
                    <tr key={res.id} className="hover:bg-gray-950/20 transition-all">
                      {/* Name & Slug */}
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{res.name}</div>
                        <Link
                          href={`/r/${res.slug}`}
                          target="_blank"
                          className="text-xs text-[#D4A437] hover:underline inline-flex items-center gap-0.5 mt-0.5"
                        >
                          /r/{res.slug} <ArrowRight className="w-2.5 h-2.5" />
                        </Link>
                      </td>
                      
                      {/* Owner details */}
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-200">{res.ownerName}</div>
                        <div className="text-xs text-gray-500">{res.ownerEmail}</div>
                      </td>

                      {/* Date created */}
                      <td className="px-6 py-4 text-gray-300 text-xs">
                        {dateFormatted}
                      </td>

                      {/* Total dishes */}
                      <td className="px-6 py-4 text-center text-gray-200 font-semibold">
                        {res.dishesCount}
                      </td>

                      {/* Plan */}
                      <td className="px-6 py-4 text-xs font-semibold text-gray-300">
                        {res.planName}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isSuspended
                              ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                              : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                          }`}
                        >
                          {isSuspended ? 'Suspended' : 'Active'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        {actionLoadingId === res.id ? (
                          <Loader2 className="w-5 h-5 animate-spin text-gray-500 ml-auto" />
                        ) : isSuspended ? (
                          <button
                            onClick={() => handleAction(res.id, 'approve')}
                            className="px-3.5 py-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-all cursor-pointer"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAction(res.id, 'suspend')}
                            className="px-3.5 py-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-all cursor-pointer"
                          >
                            Suspend
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
