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
  Search,
  CreditCard,
  Layers,
  Settings,
  BookOpen,
  Plus,
  Trash2,
  DollarSign,
  TrendingUp,
  FileText,
  Clock,
  MapPin,
  ExternalLink,
  Sliders,
  Bell,
  Eye,
  FileCheck,
  ChevronRight,
  Check,
  UserCheck,
  X
} from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, TextArea, Select } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface RestaurantItem {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  ownerName: string;
  ownerEmail: string;
  dishesCount: number;
  profilesCount: number;
  qrCount: number;
  theme: string;
  planName: string;
  subStatus: string;
  expiryDate: string | null;
  createdAt: string;
}

interface UpgradeRequest {
  id: string;
  restaurantId: string;
  planId: string;
  billingCycle: string;
  amount: number;
  paymentProof: string | null;
  referenceNo: string | null;
  status: string;
  createdAt: string;
  restaurant: { name: string; slug: string };
  plan: { name: string };
}

interface PaymentRecord {
  id: string;
  restaurantId: string;
  amount: number;
  gstAmount: number;
  paymentMode: string;
  referenceNo: string | null;
  status: string;
  proofAttachment: string | null;
  adminNotes: string | null;
  createdAt: string;
  restaurant: { name: string };
}

interface AuditLog {
  id: string;
  action: string;
  details: string | null;
  adminId: string | null;
  reason: string | null;
  createdAt: string;
}

interface Stats {
  totalRestaurants: number;
  activeRestaurants: number;
  trialCount: number;
  expiredCount: number;
  cancelledCount: number;
  pendingApprovals: number;
  pendingPayments: number;
  totalRevenue: number;
  expiringSoonCount: number;
  monthlyMRR: number;
}

interface SystemNotification {
  id: string;
  type: string;
  title: string;
  description: string;
  date: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'crm' | 'approvals' | 'payments' | 'themes' | 'plans' | 'settings' | 'logs'>('overview');

  const [stats, setStats] = useState<Stats | null>(null);
  const [restaurants, setRestaurants] = useState<RestaurantItem[]>([]);
  const [upgradeRequests, setUpgradeRequests] = useState<UpgradeRequest[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [themeUsage, setThemeUsage] = useState<Record<string, number>>({});
  const [monthlyStats, setMonthlyStats] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [systemSettings, setSystemSettings] = useState<any>({});
  const [themes, setThemes] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Subscription Edit Modal States
  const [activeSubModalRes, setActiveSubModalRes] = useState<any | null>(null);
  const [subPlanId, setSubPlanId] = useState('');
  const [subStatus, setSubStatus] = useState('ACTIVE');
  const [subEndDate, setSubEndDate] = useState('');

  // Theme Marketplace Config States
  const [activeThemeModal, setActiveThemeModal] = useState<any | null>(null); // 'NEW' or theme object
  const [themeName, setThemeName] = useState('');
  const [themeKey, setThemeKey] = useState('');
  const [themeDesc, setThemeDesc] = useState('');
  const [themeVersion, setThemeVersion] = useState('1.0.0');
  const [themeTier, setThemeTier] = useState('STARTER');
  const [themeStatus, setThemeStatus] = useState('PUBLISHED');
  const [themeBg, setThemeBg] = useState('#0D0D0F');
  const [themeText, setThemeText] = useState('#FFFFFF');
  const [themeAccent, setThemeAccent] = useState('#D4A853');
  const [themeFontHeading, setThemeFontHeading] = useState('Playfair Display');
  const [themeFontBody, setThemeFontBody] = useState('Inter');

  // Modals & Slide-Overs
  const [viewProofUrl, setViewProofUrl] = useState<string | null>(null);
  const [activeApprovalReq, setActiveApprovalReq] = useState<UpgradeRequest | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [editingPlan, setEditingPlan] = useState<any | null>(null);

  async function loadData() {
    try {
      setLoading(true);
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
      setUpgradeRequests(data.upgradeRequests || []);
      setPayments(data.payments || []);
      setAuditLogs(data.auditLogs || []);
      setThemeUsage(data.themeUsage || {});
      setMonthlyStats(data.monthlyStats || []);
      setNotifications(data.notifications || []);

      // Load plans
      const resPlans = await fetch('/api/admin/plans');
      const plansData = await resPlans.json();
      setPlans(plansData.plans || []);

      // Load settings
      const resSettings = await fetch('/api/admin/settings');
      const settingsData = await resSettings.json();
      setSystemSettings(settingsData.settings || {});

      // Load themes
      const resThemes = await fetch('/api/admin/themes');
      const themesData = await resThemes.json();
      setThemes(themesData.themes || []);
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
      loadData();
    }
  }, [session, status]);

  // Impersonate owner view helper
  const handleImpersonate = (restaurantId: string, slug: string) => {
    document.cookie = `impersonate_restaurant_id=${restaurantId}; path=/`;
    document.cookie = `impersonate_restaurant_slug=${slug}; path=/`;
    router.push('/dashboard');
  };

  // Save subscription change
  const handleSaveSubscription = async () => {
    if (!activeSubModalRes || !subPlanId) return;
    try {
      setActionLoadingId(activeSubModalRes.id);
      const res = await fetch('/api/admin/change-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: activeSubModalRes.id,
          planId: subPlanId,
          status: subStatus,
          endDate: subEndDate,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update subscription');
      
      alert('Subscription plan updated successfully!');
      setActiveSubModalRes(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error updating subscription');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Open theme modal for creation
  const handleOpenNewThemeModal = () => {
    setActiveThemeModal('NEW');
    setThemeName('');
    setThemeKey('');
    setThemeDesc('');
    setThemeVersion('1.0.0');
    setThemeTier('STARTER');
    setThemeStatus('PUBLISHED');
    setThemeBg('#0D0D0F');
    setThemeText('#FFFFFF');
    setThemeAccent('#D4A853');
    setThemeFontHeading('Playfair Display');
    setThemeFontBody('Inter');
  };

  // Open theme modal for editing
  const handleOpenEditThemeModal = (theme: any) => {
    setActiveThemeModal(theme);
    setThemeName(theme.name);
    setThemeKey(theme.key);
    setThemeDesc(theme.description || '');
    setThemeVersion(theme.version || '1.0.0');
    setThemeTier(theme.tier || 'STARTER');
    setThemeStatus(theme.status || 'PUBLISHED');
    setThemeBg(theme.bg || '#0D0D0F');
    setThemeText(theme.text || '#FFFFFF');
    setThemeAccent(theme.accent || '#D4A853');
    setThemeFontHeading(theme.fontHeading || 'Playfair Display');
    setThemeFontBody(theme.fontBody || 'Inter');
  };

  // Save layout theme details (create / update)
  const handleSaveTheme = async () => {
    if (!themeName || !themeKey) {
      alert('Theme Name and Key are required.');
      return;
    }
    try {
      const isNew = activeThemeModal === 'NEW';
      const url = '/api/admin/themes';
      const method = isNew ? 'POST' : 'PUT';
      
      const body: any = {
        name: themeName,
        description: themeDesc,
        version: themeVersion,
        tier: themeTier,
        status: themeStatus,
        bg: themeBg,
        text: themeText,
        accent: themeAccent,
        fontHeading: themeFontHeading,
        fontBody: themeFontBody,
      };

      if (isNew) {
        body.key = themeKey.toUpperCase().replace(/[\s-]/g, '_');
      } else {
        body.id = activeThemeModal.id;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save theme layout');

      alert(`Theme layout ${isNew ? 'published' : 'updated'} successfully!`);
      setActiveThemeModal(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error saving theme');
    }
  };

  // Delete custom theme layout
  const handleDeleteTheme = async (themeId: string) => {
    if (!confirm('Are you sure you want to remove this theme layout? All restaurants currently using it will fallback to the default styling.')) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/themes?id=${themeId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to remove theme layout');

      alert('Theme layout deleted successfully.');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error deleting theme');
    }
  };

  // Process Upgrade Request
  const handleApproval = async (action: 'APPROVE' | 'REJECT') => {
    if (!activeApprovalReq) return;
    try {
      const res = await fetch('/api/admin/upgrade-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: activeApprovalReq.id,
          action,
          adminNotes: approvalNotes,
        }),
      });

      if (!res.ok) throw new Error('Action failed');
      
      alert(`Request successfully ${action === 'APPROVE' ? 'Approved' : 'Rejected'}.`);
      setActiveApprovalReq(null);
      setApprovalNotes('');
      loadData();
    } catch (err) {
      alert('Error updating request status.');
    }
  };

  // Suspend/Resume Venue
  const handleSuspendToggle = async (restaurantId: string, currentStatus: string) => {
    setActionLoadingId(restaurantId);
    const action = currentStatus === 'CANCELLED' ? 'approve' : 'suspend';
    try {
      const res = await fetch('/api/admin/suspend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurantId, action }),
      });

      if (!res.ok) throw new Error('Action failed');
      
      alert(`Restaurant successfully ${action === 'suspend' ? 'Suspended' : 'Activated'}.`);
      loadData();
    } catch (err) {
      alert('Error toggling suspension status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Edit Plan Details
  const handleSavePlan = async () => {
    if (!editingPlan) return;
    try {
      const res = await fetch('/api/admin/plans', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: editingPlan.id,
          ...editingPlan,
        }),
      });

      if (!res.ok) throw new Error('Failed to update plan configurations.');
      
      alert('Plan limits and MRR details successfully updated.');
      setEditingPlan(null);
      loadData();
    } catch (err) {
      alert('Error saving plan parameters.');
    }
  };

  // Save Settings
  const handleSaveSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: systemSettings }),
      });

      if (!res.ok) throw new Error('Failed to save settings');
      alert('System settings updated successfully.');
      loadData();
    } catch (err) {
      alert('Error updating system configurations.');
    }
  };

  const filteredRestaurants = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (status === 'loading' || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#050505] text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4A437]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#050505] text-white p-4">
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
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      {/* Top Header Command Bar */}
      <header className="border-b border-white/[0.04] bg-[#0E0E0E]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-[#D4A437]" />
          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block">Operations Center</span>
            <h1 className="font-serif text-lg font-bold text-white leading-none">DigitalMenu Control Panel</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notification bell badge */}
          {notifications.length > 0 && (
            <div className="relative">
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center text-[8px] font-bold text-white animate-pulse">
                {notifications.length}
              </span>
              <button 
                onClick={() => alert(`Operational Notifications:\n` + notifications.map(n => `- ${n.title}: ${n.description}`).join('\n'))}
                className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04] text-gray-400 hover:text-white"
              >
                <Bell className="w-4 h-4" />
              </button>
            </div>
          )}

          <Link
            href="/dashboard"
            className="text-xs text-gray-400 hover:text-white border border-white/[0.04] bg-white/[0.01] px-4 py-2 rounded-xl transition-all"
          >
            Owner View
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </header>

      {/* Main Body Workspace split */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-64 border-r border-white/[0.04] bg-[#0A0A0A] p-4 flex flex-col gap-1.5 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left px-4.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 ${
              activeTab === 'overview'
                ? 'bg-[#D4A437]/10 text-[#D4A437] border-l-2 border-[#D4A437]'
                : 'text-gray-400 hover:bg-white/[0.02] hover:text-white border-l-2 border-transparent'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Executive Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('crm')}
            className={`w-full text-left px-4.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 ${
              activeTab === 'crm'
                ? 'bg-[#D4A437]/10 text-[#D4A437] border-l-2 border-[#D4A437]'
                : 'text-gray-400 hover:bg-white/[0.02] hover:text-white border-l-2 border-transparent'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Restaurant CRM</span>
          </button>

          <button
            onClick={() => setActiveTab('approvals')}
            className={`w-full text-left px-4.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between gap-3 ${
              activeTab === 'approvals'
                ? 'bg-[#D4A437]/10 text-[#D4A437] border-l-2 border-[#D4A437]'
                : 'text-gray-400 hover:bg-white/[0.02] hover:text-white border-l-2 border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileCheck className="w-4 h-4" />
              <span>Upgrade Approvals</span>
            </div>
            {stats && stats.pendingApprovals > 0 && (
              <span className="bg-[#D4A437] text-black px-1.5 py-0.5 rounded-md text-[9px] font-bold">
                {stats.pendingApprovals}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`w-full text-left px-4.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 ${
              activeTab === 'payments'
                ? 'bg-[#D4A437]/10 text-[#D4A437] border-l-2 border-[#D4A437]'
                : 'text-gray-400 hover:bg-white/[0.02] hover:text-white border-l-2 border-transparent'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Payments Ledger</span>
          </button>

          <button
            onClick={() => setActiveTab('themes')}
            className={`w-full text-left px-4.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 ${
              activeTab === 'themes'
                ? 'bg-[#D4A437]/10 text-[#D4A437] border-l-2 border-[#D4A437]'
                : 'text-gray-400 hover:bg-white/[0.02] hover:text-white border-l-2 border-transparent'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Theme Marketplace</span>
          </button>

          <button
            onClick={() => setActiveTab('plans')}
            className={`w-full text-left px-4.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 ${
              activeTab === 'plans'
                ? 'bg-[#D4A437]/10 text-[#D4A437] border-l-2 border-[#D4A437]'
                : 'text-gray-400 hover:bg-white/[0.02] hover:text-white border-l-2 border-transparent'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Plan Configurator</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-4.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 ${
              activeTab === 'settings'
                ? 'bg-[#D4A437]/10 text-[#D4A437] border-l-2 border-[#D4A437]'
                : 'text-gray-400 hover:bg-white/[0.02] hover:text-white border-l-2 border-transparent'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>System Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`w-full text-left px-4.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 ${
              activeTab === 'logs'
                ? 'bg-[#D4A437]/10 text-[#D4A437] border-l-2 border-[#D4A437]'
                : 'text-gray-400 hover:bg-white/[0.02] hover:text-white border-l-2 border-transparent'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Compliance Logs</span>
          </button>
        </aside>

        {/* Dynamic Workspace Container */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full space-y-6">
          
          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 text-left">
              <div>
                <h2 className="font-serif text-xl font-bold text-white">Executive Command Center</h2>
                <p className="text-gray-400 text-xs mt-0.5">Core KPIs, registrations, and dynamic revenue metrics.</p>
              </div>

              {/* Stats Cards Grid */}
              {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="p-4 flex flex-col justify-between min-h-[110px]">
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Total Venues</span>
                      <span className="text-2xl font-serif font-bold text-white">{stats.totalRestaurants}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-[#D4A437] mt-2">
                      <Store className="w-3.5 h-3.5" />
                      <span>{stats.activeRestaurants} Active ({(stats.activeRestaurants / (stats.totalRestaurants || 1) * 100).toFixed(0)}%)</span>
                    </div>
                  </Card>

                  <Card className="p-4 flex flex-col justify-between min-h-[110px]">
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Monthly MRR</span>
                      <span className="text-2xl font-serif font-bold text-white">${stats.monthlyMRR.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 mt-2">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Total Revenue: ${stats.totalRevenue.toFixed(2)}</span>
                    </div>
                  </Card>

                  <Card className="p-4 flex flex-col justify-between min-h-[110px]">
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Trial vs Paid</span>
                      <span className="text-2xl font-serif font-bold text-white">
                        {stats.trialCount} / {stats.activeRestaurants}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-2">
                      <Users className="w-3.5 h-3.5" />
                      <span>Expired/Suspended: {stats.expiredCount + stats.cancelledCount}</span>
                    </div>
                  </Card>

                  <Card className="p-4 flex flex-col justify-between min-h-[110px]">
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Action Queues</span>
                      <span className="text-2xl font-serif font-bold text-[#D4A437]">
                        {stats.pendingApprovals + stats.pendingPayments}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-red-400 mt-2">
                      <Clock className="w-3.5 h-3.5 animate-pulse" />
                      <span>Requires Manual Verification</span>
                    </div>
                  </Card>
                </div>
              )}

              {/* Visual Mock SVG Charts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-5 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Restaurant Growth (6 Months)</h4>
                    <p className="text-[10px] text-gray-500">Cumulative platform registrations.</p>
                  </div>
                  <div className="h-44 w-full flex items-end justify-between pt-4 border-b border-white/5 font-mono text-[9px] text-gray-600">
                    {monthlyStats.map((item, idx) => {
                      const maxRegs = Math.max(...monthlyStats.map(m => m.registrations), 1);
                      const barHeightPercent = (item.registrations / maxRegs) * 80;
                      return (
                        <div key={idx} className="flex flex-col items-center justify-end h-full gap-1.5 flex-1 pb-1">
                          <span className="text-white font-bold">{item.registrations}</span>
                          <div 
                            className="w-8 bg-[#D4A437]/20 border-t border-[#D4A437] rounded-t-md transition-all duration-300 hover:bg-[#D4A437]/40"
                            style={{ height: `${barHeightPercent}%` }}
                          />
                          <span className="mt-1">{item.month}</span>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                <Card className="p-5 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Revenue Growth MRR ($)</h4>
                    <p className="text-[10px] text-gray-500">Verified platform payments ledger totals.</p>
                  </div>
                  <div className="h-44 w-full flex items-end justify-between pt-4 border-b border-white/5 font-mono text-[9px] text-gray-600">
                    {monthlyStats.map((item, idx) => {
                      const maxRev = Math.max(...monthlyStats.map(m => m.revenue), 1);
                      const barHeightPercent = (item.revenue / maxRev) * 80;
                      return (
                        <div key={idx} className="flex flex-col items-center justify-end h-full gap-1.5 flex-1 pb-1">
                          <span className="text-emerald-400 font-bold">${item.revenue}</span>
                          <div 
                            className="w-8 bg-emerald-500/20 border-t border-emerald-500 rounded-t-md transition-all duration-300 hover:bg-emerald-500/40"
                            style={{ height: `${barHeightPercent}%` }}
                          />
                          <span className="mt-1">{item.month}</span>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>

              {/* Theme Usage Split */}
              <Card className="p-5 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Active theme usage split</h4>
                  <p className="text-[10px] text-gray-500">Distribution of layouts across active digital menu profiles.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  {Object.entries(themeUsage).map(([themeKey, count]) => (
                    <div key={themeKey} className="p-3 bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col items-center text-center justify-center">
                      <span className="text-xs font-mono font-bold text-white">{count}</span>
                      <span className="text-[9px] text-gray-500 uppercase font-semibold mt-1 truncate max-w-full">
                        {themeKey.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* TAB 2: CRM MANAGER */}
          {activeTab === 'crm' && (
            <div className="space-y-4 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-white">Restaurant Directory</h2>
                  <p className="text-gray-400 text-xs mt-0.5">Logins simulation, billing extensions, status overrides.</p>
                </div>

                <div className="relative w-full sm:max-w-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, owner, or email..."
                    className="w-full bg-[#0d0d0d] border border-white/5 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <Card className="overflow-hidden overflow-x-auto border-white/5">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] font-bold text-gray-400 uppercase">
                      <th className="px-6 py-4">Venue Details</th>
                      <th className="px-6 py-4">Owner Account</th>
                      <th className="px-6 py-4 text-center">Menu Profiles</th>
                      <th className="px-6 py-4 text-center">Dishes</th>
                      <th className="px-6 py-4">Plan / Expiry</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Impersonation & Overrides</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs">
                    {filteredRestaurants.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                          No restaurants found matching search parameters.
                        </td>
                      </tr>
                    ) : (
                      filteredRestaurants.map((res) => {
                        const isSuspended = res.subStatus === 'CANCELLED';
                        return (
                          <tr key={res.id} className="hover:bg-white/[0.01] transition-all">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {res.logo ? (
                                  <img src={res.logo} className="w-7 h-7 rounded-lg object-cover" />
                                ) : (
                                  <div className="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center text-xs font-bold text-white">
                                    {res.name.charAt(0)}
                                  </div>
                                )}
                                <div>
                                  <span className="font-bold text-white block">{res.name}</span>
                                  <a href={`/r/${res.slug}`} target="_blank" className="text-[10px] text-[#D4A437] hover:underline flex items-center gap-0.5">
                                    /r/{res.slug} <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <span className="font-semibold text-gray-200 block">{res.ownerName}</span>
                              <span className="text-[10px] text-gray-500 block">{res.ownerEmail}</span>
                            </td>

                            <td className="px-6 py-4 text-center font-bold font-mono text-gray-300">
                              {res.profilesCount}
                            </td>

                            <td className="px-6 py-4 text-center font-bold font-mono text-gray-300">
                              {res.dishesCount}
                            </td>

                            <td className="px-6 py-4">
                              <span className="font-semibold text-white block">{res.planName}</span>
                              <span className="text-[10px] text-gray-500 font-mono">
                                {res.expiryDate ? new Date(res.expiryDate).toLocaleDateString() : 'N/A'}
                              </span>
                            </td>

                            <td className="px-6 py-4">
                              <Badge variant={isSuspended ? 'error' : 'success'}>
                                {isSuspended ? 'Suspended' : 'Active'}
                              </Badge>
                            </td>

                            <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                  setActiveSubModalRes(res);
                                  const matchingPlan = plans.find(p => p.name === res.planName);
                                  setSubPlanId(matchingPlan?.id || '');
                                  setSubStatus(res.subStatus || 'ACTIVE');
                                  setSubEndDate(res.expiryDate ? new Date(res.expiryDate).toISOString().split('T')[0] : '');
                                }}
                                className="h-8 gap-1.5"
                              >
                                <Sliders className="w-3.5 h-3.5 text-[#D4A853]" /> Edit Plan
                              </Button>

                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleImpersonate(res.id, res.slug)}
                                className="h-8 gap-1.5"
                              >
                                <UserCheck className="w-3.5 h-3.5 text-[#D4A437]" /> Login As
                              </Button>

                              <Button
                                variant={isSuspended ? 'primary' : 'danger'}
                                size="sm"
                                onClick={() => handleSuspendToggle(res.id, res.subStatus)}
                                isLoading={actionLoadingId === res.id}
                                className="h-8"
                              >
                                {isSuspended ? 'Activate' : 'Suspend'}
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {/* TAB 3: UPGRADE APPROVALS */}
          {activeTab === 'approvals' && (
            <div className="space-y-6 text-left">
              <div>
                <h2 className="font-serif text-xl font-bold text-white">Upgrade Request verification</h2>
                <p className="text-gray-400 text-xs mt-0.5">Approve or reject pending subscription payments.</p>
              </div>

              <Card className="overflow-hidden overflow-x-auto border-white/5">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] font-bold text-gray-400 uppercase">
                      <th className="px-6 py-4">Restaurant</th>
                      <th className="px-6 py-4">Requested Plan</th>
                      <th className="px-6 py-4">Billing Cycle</th>
                      <th className="px-6 py-4">Cost (USD)</th>
                      <th className="px-6 py-4">Reference UTR</th>
                      <th className="px-6 py-4">Requested Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Verification Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs">
                    {upgradeRequests.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                          No upgrade requests logged in the database.
                        </td>
                      </tr>
                    ) : (
                      upgradeRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-white/[0.01] transition-all">
                          <td className="px-6 py-4 font-bold text-white">
                            {req.restaurant?.name || 'Unknown'}
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="gold">{req.plan?.name}</Badge>
                          </td>
                          <td className="px-6 py-4 font-mono font-bold text-gray-300">
                            {req.billingCycle}
                          </td>
                          <td className="px-6 py-4 font-bold font-mono text-emerald-400">
                            ${req.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-mono text-white bg-white/5 px-2 py-1 rounded">
                              {req.referenceNo || 'None'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-500 font-mono">
                            {new Date(req.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={req.status === 'PENDING' ? 'warning' : req.status === 'APPROVED' ? 'success' : 'error'}>
                              {req.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            {req.paymentProof && (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setViewProofUrl(req.paymentProof)}
                                className="h-8"
                              >
                                View Proof
                              </Button>
                            )}
                            
                            {req.status === 'PENDING' && (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => setActiveApprovalReq(req)}
                                className="h-8"
                              >
                                Process Verification
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {/* TAB 4: PAYMENTS LEDGER */}
          {activeTab === 'payments' && (
            <div className="space-y-6 text-left">
              <div>
                <h2 className="font-serif text-xl font-bold text-white">Financial Payments Ledger</h2>
                <p className="text-gray-400 text-xs mt-0.5">Logs of all manual bank transfers and verification records.</p>
              </div>

              <Card className="overflow-hidden overflow-x-auto border-white/5">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] font-bold text-gray-400 uppercase">
                      <th className="px-6 py-4">UTR Reference</th>
                      <th className="px-6 py-4">Restaurant</th>
                      <th className="px-6 py-4">Subtotal</th>
                      <th className="px-6 py-4">GST (18%)</th>
                      <th className="px-6 py-4">Total Amount</th>
                      <th className="px-6 py-4">Mode</th>
                      <th className="px-6 py-4">Processed Date</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs">
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                          No payment transactions recorded in log ledger.
                        </td>
                      </tr>
                    ) : (
                      payments.map((pay) => (
                        <tr key={pay.id} className="hover:bg-white/[0.01] transition-all">
                          <td className="px-6 py-4 font-mono font-bold text-white">
                            {pay.referenceNo || 'MANUAL-ACT'}
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-300">
                            {pay.restaurant?.name || 'Unknown'}
                          </td>
                          <td className="px-6 py-4 font-mono">${pay.amount.toFixed(2)}</td>
                          <td className="px-6 py-4 font-mono text-gray-500">${(pay.gstAmount || 0).toFixed(2)}</td>
                          <td className="px-6 py-4 font-mono font-bold text-emerald-400">
                            ${(pay.amount + (pay.gstAmount || 0)).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-400 text-[10px]">
                            {pay.paymentMode}
                          </td>
                          <td className="px-6 py-4 text-gray-500 font-mono">
                            {new Date(pay.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={pay.status === 'VERIFIED' ? 'success' : pay.status === 'PENDING' ? 'warning' : 'error'}>
                              {pay.status}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {/* TAB 5: THEME MARKETPLACE */}
          {activeTab === 'themes' && (
            <div className="space-y-6 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-white">Theme Marketplace Publisher</h2>
                  <p className="text-gray-400 text-xs mt-0.5">Control layout tiers, brand colors, fonts compatibility, and custom themes.</p>
                </div>
                <Button variant="primary" size="sm" onClick={handleOpenNewThemeModal} className="h-9 gap-1.5 shrink-0 self-start sm:self-center">
                  <Plus className="w-4 h-4 text-black font-bold" /> Publish Custom Theme
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {themes.map((theme) => (
                  <Card key={theme.id} className="p-5 flex flex-col justify-between gap-4 relative overflow-hidden border border-white/[0.04]">
                    {/* Visual Color Bar Indicator using Theme Colors */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 flex">
                      <div className="flex-1" style={{ backgroundColor: theme.bg }} />
                      <div className="flex-1" style={{ backgroundColor: theme.text }} />
                      <div className="flex-1" style={{ backgroundColor: theme.accent }} />
                    </div>

                    <div className="space-y-3 pt-1">
                      <div className="flex items-center justify-between">
                        <Badge variant="gold">{theme.tier}</Badge>
                        <span className="text-[10px] text-gray-500 font-mono">v{theme.version}</span>
                      </div>
                      
                      <div>
                        <h4 className="font-serif font-bold text-white text-base">{theme.name}</h4>
                        <span className="text-[9px] text-gray-500 font-mono block mt-0.5 tracking-wider uppercase">{theme.key}</span>
                      </div>

                      <p className="text-[11px] text-gray-400 leading-normal min-h-[33px]">{theme.description || 'No description provided.'}</p>
                      
                      {/* Theme Colors & Fonts Spec Sheet */}
                      <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3 space-y-2 text-[10px]">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Typography:</span>
                          <span className="text-white font-semibold truncate max-w-[120px]" style={{ fontFamily: theme.fontHeading }}>
                            {theme.fontHeading} / {theme.fontBody}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Brand Palette:</span>
                          <div className="flex gap-1.5">
                            <span className="w-3.5 h-3.5 rounded border border-white/20 block" title={`Background: ${theme.bg}`} style={{ backgroundColor: theme.bg }} />
                            <span className="w-3.5 h-3.5 rounded border border-white/20 block" title={`Text: ${theme.text}`} style={{ backgroundColor: theme.text }} />
                            <span className="w-3.5 h-3.5 rounded border border-white/20 block" title={`Accent: ${theme.accent}`} style={{ backgroundColor: theme.accent }} />
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-2 flex justify-between text-[10px] text-gray-500">
                        <span>Status: <span className="text-emerald-400 font-bold">{theme.status}</span></span>
                        <span>Cost: ${theme.monthlyCost.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" className="flex-1 h-8" onClick={() => handleOpenEditThemeModal(theme)}>
                        Configure details
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 text-red-400 hover:text-red-500" onClick={() => handleDeleteTheme(theme.id)}>
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PLAN CONFIGURATOR */}
          {activeTab === 'plans' && (
            <div className="space-y-6 text-left">
              <div>
                <h2 className="font-serif text-xl font-bold text-white">Plan Configurator</h2>
                <p className="text-gray-400 text-xs mt-0.5">Adjust MRR cycles cost, allowed dining area caps, and premium theme features.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((p) => (
                  <Card key={p.id} className="p-5 flex flex-col justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">{p.name}</h4>
                        <span className="text-lg font-serif font-bold text-[#D4A437]">${p.price}/mo</span>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-relaxed min-h-[33px]">{p.description}</p>
                      
                      <div className="border-t border-white/5 my-2" />
                      
                      <div className="space-y-1.5 text-xs text-gray-300 font-mono">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Quarterly Cost:</span>
                          <span className="text-white">${p.billingCycleQuarterlyCost || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Yearly Cost:</span>
                          <span className="text-white">${p.billingCycleYearlyCost || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Dining Areas Cap:</span>
                          <span className="text-white">{p.diningAreasAllowed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">QR Layout templates:</span>
                          <span className="text-white">{p.qrCodesAllowed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">File Storage limit:</span>
                          <span className="text-white">{p.storageGb} GB</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Support Priority:</span>
                          <span className="text-white">{p.supportLevel}</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full h-9"
                      onClick={() => setEditingPlan(p)}
                    >
                      Edit Config Limits
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: SYSTEM CONFIGURATION */}
          {activeTab === 'settings' && (
            <div className="space-y-6 text-left max-w-xl">
              <div>
                <h2 className="font-serif text-xl font-bold text-white">Platform System Settings</h2>
                <p className="text-gray-400 text-xs mt-0.5">Manage gateways, default taxes, currencies, and invoice templates.</p>
              </div>

              <Card className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Company Name"
                    value={systemSettings.companyName || ''}
                    onChange={(e) => setSystemSettings({ ...systemSettings, companyName: e.target.value })}
                  />
                  <Input
                    label="GST Identification Number"
                    value={systemSettings.gstNumber || ''}
                    onChange={(e) => setSystemSettings({ ...systemSettings, gstNumber: e.target.value })}
                  />
                  <Input
                    label="Currency Code"
                    value={systemSettings.currency || ''}
                    onChange={(e) => setSystemSettings({ ...systemSettings, currency: e.target.value })}
                  />
                  <Input
                    label="Currency Symbol"
                    value={systemSettings.currencySymbol || ''}
                    onChange={(e) => setSystemSettings({ ...systemSettings, currencySymbol: e.target.value })}
                  />
                </div>

                <div className="border-t border-white/5 my-4" />

                <div className="space-y-4">
                  <Select
                    label="SMS Gateway Endpoint"
                    value={systemSettings.smsGateway || ''}
                    onChange={(e) => setSystemSettings({ ...systemSettings, smsGateway: e.target.value })}
                    options={[
                      { value: 'twilio', label: 'Twilio Global API' },
                      { value: 'msg91', label: 'MSG91 Gateway' }
                    ]}
                  />
                  
                  <Select
                    label="WhatsApp Gateway Hook"
                    value={systemSettings.whatsAppGateway || ''}
                    onChange={(e) => setSystemSettings({ ...systemSettings, whatsAppGateway: e.target.value })}
                    options={[
                      { value: 'meta-api', label: 'Meta Cloud Business API' },
                      { value: 'twilio-wa', label: 'Twilio WhatsApp Sandbox' }
                    ]}
                  />

                  <Input
                    label="Invoice Prefix"
                    value={systemSettings.invoicePrefix || ''}
                    onChange={(e) => setSystemSettings({ ...systemSettings, invoicePrefix: e.target.value })}
                  />
                </div>

                <Button
                  variant="primary"
                  className="w-full mt-4"
                  onClick={handleSaveSettings}
                >
                  Save Platform Configurations
                </Button>
              </Card>
            </div>
          )}

          {/* TAB 8: COMPLIANCE AUDIT LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-6 text-left">
              <div>
                <h2 className="font-serif text-xl font-bold text-white">Compliance Audit Trail</h2>
                <p className="text-gray-400 text-xs mt-0.5">Logging ledger reporting all modifications, upgrades, and suspensions.</p>
              </div>

              <Card className="overflow-hidden overflow-x-auto border-white/5">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] font-bold text-gray-400 uppercase">
                      <th className="px-6 py-4">Action</th>
                      <th className="px-6 py-4">Log Details</th>
                      <th className="px-6 py-4">Timestamp</th>
                      <th className="px-6 py-4">Reason Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs">
                    {auditLogs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                          No audit logs registered in trail database.
                        </td>
                      </tr>
                    ) : (
                      auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-white/[0.01] transition-all">
                          <td className="px-6 py-4">
                            <span className="font-mono text-white bg-white/5 px-2 py-1 rounded">
                              {log.action}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-300 max-w-sm leading-normal">
                            {log.details}
                          </td>
                          <td className="px-6 py-4 text-gray-500 font-mono">
                            {new Date(log.createdAt).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-gray-400 italic">
                            {log.reason || 'No admin notes recorded.'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

        </main>
      </div>

      {/* POPUP MODAL: VIEW PROOF IMAGE */}
      {viewProofUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4">
          <button
            onClick={() => setViewProofUrl(null)}
            className="absolute top-5 right-5 text-gray-400 hover:text-white text-xs font-bold bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"
          >
            Close Proof
          </button>
          <div className="max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl border border-white/10">
            <img src={viewProofUrl} alt="Payment Receipt Proof" className="object-contain max-h-[80vh] w-full" />
          </div>
        </div>
      )}

      {/* SLIDE-OVER PANEL: PROCESS APPROVAL DETAILS */}
      {activeApprovalReq && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-zinc-950 border-l border-white/5 h-full p-6 flex flex-col justify-between text-left">
            <div className="space-y-6 overflow-y-auto">
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-lg font-bold text-white">Upgrade Request Detail</h3>
                <button onClick={() => setActiveApprovalReq(null)} className="text-gray-500 hover:text-white">
                  Close
                </button>
              </div>

              <div className="space-y-4 text-xs font-mono text-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-500">Restaurant:</span>
                  <span className="text-white font-bold">{activeApprovalReq.restaurant?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Requested Plan:</span>
                  <span className="text-white font-bold">{activeApprovalReq.plan?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Billing Cycle:</span>
                  <span className="text-white font-bold">{activeApprovalReq.billingCycle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount Due (USD):</span>
                  <span className="text-[#D4A437] font-bold">${activeApprovalReq.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">UTR / Ref No:</span>
                  <span className="text-white font-bold">{activeApprovalReq.referenceNo || 'None'}</span>
                </div>
              </div>

              {activeApprovalReq.paymentProof && (
                <div className="space-y-2">
                  <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">Payment Receipt Uploader</span>
                  <div className="border border-white/5 rounded-xl overflow-hidden aspect-video bg-black flex items-center justify-center relative">
                    <img src={activeApprovalReq.paymentProof} className="object-cover w-full h-full" />
                    <button 
                      onClick={() => setViewProofUrl(activeApprovalReq.paymentProof)}
                      className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/60 text-white text-[10px] hover:bg-black/85"
                    >
                      Enlarge Proof
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">Verification Notes (Reason)</span>
                <TextArea
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Enter reason for approval or rejection..."
                  className="h-24"
                />
              </div>
            </div>

            <div className="flex gap-4 border-t border-white/5 pt-4">
              <Button
                variant="danger"
                className="flex-1"
                onClick={() => handleApproval('REJECT')}
              >
                Reject Request
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => handleApproval('APPROVE')}
              >
                Approve & Activate
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT LIMITS MODAL: PLAN CONFIG */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-zinc-950 border border-white/5 rounded-3xl p-6 relative flex flex-col gap-6 text-left max-h-[90vh] overflow-y-auto">
            <div>
              <h3 className="font-serif text-lg font-bold text-white">Edit Plan Parameters: {editingPlan.name}</h3>
              <p className="text-gray-400 text-xs mt-1">Configure MRR pricing variables and system limits quotas.</p>
            </div>

            <button onClick={() => setEditingPlan(null)} className="absolute top-5 right-5 text-gray-500 hover:text-white">
              Close
            </button>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Monthly price ($)"
                type="number"
                value={editingPlan.price}
                onChange={(e) => setEditingPlan({ ...editingPlan, price: parseFloat(e.target.value) })}
              />
              <Input
                label="Quarterly price ($)"
                type="number"
                value={editingPlan.billingCycleQuarterlyCost}
                onChange={(e) => setEditingPlan({ ...editingPlan, billingCycleQuarterlyCost: parseFloat(e.target.value) })}
              />
              <Input
                label="Yearly price ($)"
                type="number"
                value={editingPlan.billingCycleYearlyCost}
                onChange={(e) => setEditingPlan({ ...editingPlan, billingCycleYearlyCost: parseFloat(e.target.value) })}
              />
              <Input
                label="Dining Areas limit"
                type="number"
                value={editingPlan.diningAreasAllowed}
                onChange={(e) => setEditingPlan({ ...editingPlan, diningAreasAllowed: parseInt(e.target.value) })}
              />
              <Input
                label="QR Codes templates"
                type="number"
                value={editingPlan.qrCodesAllowed}
                onChange={(e) => setEditingPlan({ ...editingPlan, qrCodesAllowed: parseInt(e.target.value) })}
              />
              <Input
                label="Storage limits (GB)"
                type="number"
                value={editingPlan.storageGb}
                onChange={(e) => setEditingPlan({ ...editingPlan, storageGb: parseFloat(e.target.value) })}
              />
            </div>

            <div className="space-y-4">
              <Select
                label="Support level priority"
                value={editingPlan.supportLevel}
                onChange={(e) => setEditingPlan({ ...editingPlan, supportLevel: e.target.value })}
                options={[
                  { value: 'Standard', label: 'Standard level support' },
                  { value: 'Priority', label: 'Priority email support' },
                  { value: '24/7 Premium', label: '24/7 Dedicated manager support' }
                ]}
              />

              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="premiumThemesAllowed"
                  checked={editingPlan.premiumThemesAllowed}
                  onChange={(e) => setEditingPlan({ ...editingPlan, premiumThemesAllowed: e.target.checked })}
                  className="rounded border-white/5 bg-white/5 accent-[#D4A437]"
                />
                <label htmlFor="premiumThemesAllowed" className="text-xs text-gray-300 font-bold select-none cursor-pointer">
                  Unlock Premium/Luxury layout marketplace
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="ghost" onClick={() => setEditingPlan(null)} className="flex-1">
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSavePlan} className="flex-1">
                Save Parameters
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT RESTAURANT SUBSCRIPTION */}
      {activeSubModalRes && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <Card className="w-full max-w-md p-6 bg-[#0D0D0F] border border-white/[0.08] shadow-2xl relative space-y-4 text-left">
            <button
              onClick={() => setActiveSubModalRes(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div>
              <h3 className="font-serif text-lg font-bold text-white">Modify Restaurant Subscription</h3>
              <p className="text-xs text-gray-400 mt-1">Directly override subscription plan parameters for {activeSubModalRes.name}.</p>
            </div>

            <div className="space-y-4">
              <Select
                label="Subscription Plan"
                value={subPlanId}
                onChange={(e) => setSubPlanId(e.target.value)}
                options={plans.map(p => ({ value: p.id, label: `${p.name} ($${p.price}/mo)` }))}
              />

              <Select
                label="Subscription Status"
                value={subStatus}
                onChange={(e) => setSubStatus(e.target.value)}
                options={[
                  { value: 'ACTIVE', label: 'Active (Paid / Subscribed)' },
                  { value: 'TRIAL', label: 'Trial Mode' },
                  { value: 'EXPIRED', label: 'Expired' },
                  { value: 'CANCELLED', label: 'Suspended (Cancelled)' }
                ]}
              />

              <Input
                label="Subscription End Expiration Date"
                type="date"
                value={subEndDate}
                onChange={(e) => setSubEndDate(e.target.value)}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setActiveSubModalRes(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleSaveSubscription}
                isLoading={actionLoadingId === activeSubModalRes.id}
              >
                Save Changes
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* MODAL: CREATE / EDIT CUSTOM THEME */}
      {activeThemeModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn overflow-y-auto">
          <Card className="w-full max-w-lg p-6 bg-[#0D0D0F] border border-white/[0.08] shadow-2xl relative space-y-4 text-left my-8">
            <button
              onClick={() => setActiveThemeModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                {activeThemeModal === 'NEW' ? 'Publish Custom Layout Theme' : 'Edit Theme Layout Configurations'}
              </h3>
              <p className="text-xs text-gray-400 mt-1">Configure layout compatibility tier, font typography, and custom brand color schemes.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Theme Layout Name"
                placeholder="e.g. Parisian Cafe"
                value={themeName}
                onChange={(e) => setThemeName(e.target.value)}
              />

              <Input
                label="Theme Key Identifier"
                placeholder="e.g. PARIS_CAFE"
                value={themeKey}
                onChange={(e) => setThemeKey(e.target.value)}
                disabled={activeThemeModal !== 'NEW'}
              />

              <Input
                label="Version Release"
                placeholder="e.g. 1.0.0"
                value={themeVersion}
                onChange={(e) => setThemeVersion(e.target.value)}
              />

              <Select
                label="Compatibility Tier"
                value={themeTier}
                onChange={(e) => setThemeTier(e.target.value)}
                options={[
                  { value: 'STARTER', label: 'Starter (Free / Entry)' },
                  { value: 'PROFESSIONAL', label: 'Professional (Premium)' },
                  { value: 'PREMIUM', label: 'Premium (Luxury)' }
                ]}
              />

              <Select
                label="Marketplace Status"
                value={themeStatus}
                onChange={(e) => setThemeStatus(e.target.value)}
                options={[
                  { value: 'PUBLISHED', label: 'Published / Active' },
                  { value: 'DISABLED', label: 'Hidden / Draft' }
                ]}
              />

              <div className="sm:col-span-2">
                <Input
                  label="Description"
                  placeholder="Specify design details for restaurant owners..."
                  value={themeDesc}
                  onChange={(e) => setThemeDesc(e.target.value)}
                />
              </div>
              
              <div className="border-t border-white/5 sm:col-span-2 my-2" />

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 select-none">Background Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={themeBg}
                    onChange={(e) => setThemeBg(e.target.value)}
                    className="w-10 h-10 rounded-lg bg-transparent border-0 cursor-pointer p-0"
                  />
                  <span className="font-mono text-xs text-white uppercase">{themeBg}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 select-none">Text Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={themeText}
                    onChange={(e) => setThemeText(e.target.value)}
                    className="w-10 h-10 rounded-lg bg-transparent border-0 cursor-pointer p-0"
                  />
                  <span className="font-mono text-xs text-white uppercase">{themeText}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 select-none">Accent / Highlight Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={themeAccent}
                    onChange={(e) => setThemeAccent(e.target.value)}
                    className="w-10 h-10 rounded-lg bg-transparent border-0 cursor-pointer p-0"
                  />
                  <span className="font-mono text-xs text-white uppercase">{themeAccent}</span>
                </div>
              </div>

              <div />

              <Select
                label="Heading Typography Font"
                value={themeFontHeading}
                onChange={(e) => setThemeFontHeading(e.target.value)}
                options={[
                  { value: 'Playfair Display', label: 'Playfair Display (Serif)' },
                  { value: 'Lora', label: 'Lora (Soft Serif)' },
                  { value: 'Poppins', label: 'Poppins (Geometric Sans)' },
                  { value: 'Montserrat', label: 'Montserrat (Bold Clean)' },
                  { value: 'Libre Baskerville', label: 'Libre Baskerville (Classic Serif)' }
                ]}
              />

              <Select
                label="Body Typography Font"
                value={themeFontBody}
                onChange={(e) => setThemeFontBody(e.target.value)}
                options={[
                  { value: 'Inter', label: 'Inter (Neutral Sans)' },
                  { value: 'Roboto', label: 'Roboto (Modern Sans)' },
                  { value: 'DM Sans', label: 'DM Sans (Geometric Neutral)' },
                  { value: 'Raleway', label: 'Raleway (Elegant Sans)' },
                  { value: 'Nunito', label: 'Nunito (Rounded Friendly)' }
                ]}
              />
            </div>

            {/* Theme Colors Mini Live Preview */}
            <div className="mt-4 p-4 rounded-xl border border-white/[0.04] space-y-2" style={{ backgroundColor: themeBg }}>
              <h4 className="font-bold text-xs" style={{ fontFamily: themeFontHeading, color: themeAccent }}>
                Theme Live Preview Header
              </h4>
              <p className="text-[11px] leading-relaxed" style={{ fontFamily: themeFontBody, color: themeText }}>
                This is how the custom colors and font choices will render inside the customer menu interfaces.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setActiveThemeModal(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleSaveTheme}
              >
                {activeThemeModal === 'NEW' ? 'Publish Theme' : 'Save Theme'}
              </Button>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
}
