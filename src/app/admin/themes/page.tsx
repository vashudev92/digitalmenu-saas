'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Palette,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Lock,
  LogOut,
  ArrowLeft,
  Search,
  SlidersHorizontal,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Layers,
  FileText,
  X
} from 'lucide-react';
import Link from 'next/link';

interface ThemeItem {
  id: string;
  key: string;
  name: string;
  previewImage: string;
  description: string;
  version: string;
  tier: string;
  monthlyCost: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminThemesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [themes, setThemes] = useState<ThemeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTheme, setEditingTheme] = useState<ThemeItem | null>(null);

  // Form states
  const [formKey, setFormKey] = useState('');
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formVersion, setFormVersion] = useState('1.0.0');
  const [formTier, setFormTier] = useState('STARTER');
  const [formCost, setFormCost] = useState('0');
  const [formStatus, setFormStatus] = useState('PUBLISHED');
  const [formPreview, setFormPreview] = useState('');

  async function loadThemes() {
    try {
      const res = await fetch('/api/admin/themes');
      if (!res.ok) {
        if (res.status === 401) {
          setError('Unauthorized. Only platform administrators can view this page.');
          return;
        }
        throw new Error('Failed to load themes data');
      }
      const data = await res.json();
      setThemes(data.themes || []);
    } catch (err) {
      setError('Could not fetch theme library.');
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
      loadThemes();
    }
  }, [session, status]);

  const openAddModal = () => {
    setEditingTheme(null);
    setFormKey('');
    setFormName('');
    setFormDesc('');
    setFormVersion('1.0.0');
    setFormTier('STARTER');
    setFormCost('0');
    setFormStatus('PUBLISHED');
    setFormPreview('');
    setError('');
    setMessage('');
    setIsModalOpen(true);
  };

  const openEditModal = (theme: ThemeItem) => {
    setEditingTheme(theme);
    setFormKey(theme.key);
    setFormName(theme.name);
    setFormDesc(theme.description || '');
    setFormVersion(theme.version || '1.0.0');
    setFormTier(theme.tier || 'STARTER');
    setFormCost(theme.monthlyCost.toString());
    setFormStatus(theme.status || 'PUBLISHED');
    setFormPreview(theme.previewImage || '');
    setError('');
    setMessage('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const isEdit = !!editingTheme;
      const url = '/api/admin/themes';
      const method = isEdit ? 'PUT' : 'POST';
      const body = {
        ...(isEdit ? { id: editingTheme.id } : { key: formKey }),
        name: formName,
        description: formDesc,
        version: formVersion,
        tier: formTier,
        monthlyCost: parseFloat(formCost) || 0.0,
        status: formStatus,
        previewImage: formPreview,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to save theme');
        return;
      }

      setMessage(isEdit ? 'Theme details updated successfully!' : 'New theme registered successfully!');
      setIsModalOpen(false);
      loadThemes();
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this theme from the library? This cannot be undone.')) return;
    setError('');
    setMessage('');

    try {
      const res = await fetch(`/api/admin/themes?id=${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to delete theme');
        return;
      }
      setMessage('Theme deleted successfully.');
      loadThemes();
    } catch {
      setError('Could not delete theme.');
    }
  };

  const filteredThemes = themes.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.key.toLowerCase().includes(search.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(search.toLowerCase()))
  );

  if (status === 'loading' || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0A0A0A] text-white">
        <Loader2 className="w-10 h-10 animate-spin text-[#D4A437]" />
      </div>
    );
  }

  if (error && !themes.length) {
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4A437]/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
            <Link href="/admin" className="hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Dashboard
            </Link>
            <span>/</span>
            <span className="text-[#D4A437]">Theme Management</span>
          </div>
          <h1 className="font-serif text-3xl font-bold flex items-center gap-3">
            <Palette className="w-8 h-8 text-[#D4A437]" /> Theme Library
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Configure premium SaaS layouts, tier permissions, monthly license pricing, and publishing states.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#D4A437] to-[#B88E2F] text-black font-bold text-sm shadow-[0_0_15px_rgba(212,164,55,0.2)] hover:shadow-[0_0_20px_rgba(212,164,55,0.3)] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Register Theme
          </button>
          
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="p-3 rounded-xl bg-gray-950 border border-gray-900 text-gray-400 hover:text-red-400 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-3">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-gray-950 border border-gray-900 rounded-2xl p-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search themes by name, key, or description..."
            className="w-full bg-black border border-gray-800 focus:border-[#D4A437] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Library Grid */}
      {filteredThemes.length === 0 ? (
        <div className="text-center py-20 bg-gray-950/20 border border-gray-900/60 rounded-3xl">
          <Palette className="w-12 h-12 text-gray-800 mx-auto mb-4" />
          <h3 className="font-serif text-lg font-bold text-white mb-1">No Themes Found</h3>
          <p className="text-gray-500 text-xs">Register your first layout template to display it in the library catalog.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredThemes.map((theme) => (
            <div
              key={theme.id}
              className="group glass rounded-3xl overflow-hidden border border-gray-900 hover:border-[#D4A437]/20 transition-all duration-300 flex flex-col bg-gray-950/10"
            >
              {/* Preview image placeholder */}
              <div className="h-44 bg-gray-950 border-b border-gray-900 relative flex items-center justify-center overflow-hidden">
                {theme.previewImage ? (
                  <img src={theme.previewImage} alt={theme.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="text-center p-6">
                    <Palette className="w-10 h-10 text-gray-800 mx-auto mb-2" />
                    <span className="text-[10px] text-gray-600 font-mono">{theme.key}</span>
                  </div>
                )}
                
                {/* Status indicator */}
                <span className={`absolute top-4 right-4 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                  theme.status === 'PUBLISHED'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {theme.status}
                </span>

                {/* Tier indicator */}
                <span className="absolute bottom-4 left-4 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-black/60 border border-gray-800 text-gray-300">
                  {theme.tier} Plan
                </span>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#D4A437] transition-colors truncate">
                      {theme.name}
                    </h3>
                    <span className="text-[10px] text-gray-600 font-mono shrink-0">v{theme.version}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed line-clamp-3">
                    {theme.description || 'No description provided.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-900 flex items-center justify-between">
                  <div>
                    <span className="block text-[8px] text-gray-500 uppercase tracking-widest leading-none">License Cost</span>
                    <span className="text-sm font-semibold text-[#D4A437] mt-1 block">
                      ₹{theme.monthlyCost.toFixed(0)} <span className="text-[9px] text-gray-600 font-normal">/ month</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(theme)}
                      className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white transition-all cursor-pointer"
                      title="Edit details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(theme.id)}
                      className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-red-400 transition-all cursor-pointer"
                      title="Delete theme"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* REGISTRATION / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-black border border-gray-900 rounded-3xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl font-bold mb-6 flex items-center gap-2">
              <Palette className="w-6 h-6 text-[#D4A437]" />
              {editingTheme ? 'Edit Theme Template' : 'Register Theme Template'}
            </h3>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">
                    Theme Key
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!editingTheme}
                    value={formKey}
                    onChange={(e) => setFormKey(e.target.value.toUpperCase().replace(/\s+/g, '_'))}
                    placeholder="LUXURY_DARK"
                    className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">
                    Friendly Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Luxury Fine Dining"
                    className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Elegant gold highlights on slate black layout..."
                  className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">
                    Tier Group
                  </label>
                  <select
                    value={formTier}
                    onChange={(e) => setFormTier(e.target.value)}
                    className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="STARTER">Starter Plan</option>
                    <option value="PROFESSIONAL">Professional Plan</option>
                    <option value="PREMIUM">Premium Plan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">
                    Monthly Price
                  </label>
                  <input
                    type="number"
                    value={formCost}
                    onChange={(e) => setFormCost(e.target.value)}
                    placeholder="499"
                    className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="PUBLISHED">Published</option>
                    <option value="DISABLED">Disabled</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">
                    Version
                  </label>
                  <input
                    type="text"
                    value={formVersion}
                    onChange={(e) => setFormVersion(e.target.value)}
                    placeholder="1.0.0"
                    className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">
                    Preview Image URL
                  </label>
                  <input
                    type="text"
                    value={formPreview}
                    onChange={(e) => setFormPreview(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3.5 mt-6 rounded-xl bg-gradient-to-r from-[#D4A437] to-[#B88E2F] hover:from-[#B88E2F] hover:to-[#A37B24] text-black font-bold text-xs uppercase tracking-wider shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
                  </>
                ) : (
                  'Save Theme Config'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
