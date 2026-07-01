'use client';

import { useState, useEffect, useCallback } from 'react';
import { THEME_LIST } from '@/lib/theme-config';
import {
  BookCopy,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  QrCode,
  Layers,
  UtensilsCrossed,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

interface MenuProfile {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  theme: string | null;
  status: boolean;
  createdAt: string;
  _count: {
    categories: number;
    menuItems: number;
  };
  qrCode: {
    id: string;
    url: string;
  } | null;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function MenuProfilesPage() {
  const [profiles, setProfiles] = useState<MenuProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formSlugManual, setFormSlugManual] = useState(false);
  const [formDescription, setFormDescription] = useState('');
  const [formTheme, setFormTheme] = useState('');
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<MenuProfile | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadProfiles = useCallback(async () => {
    try {
      const res = await fetch('/api/menu-profiles');
      if (!res.ok) throw new Error('Failed to load profiles');
      const data = await res.json();
      setProfiles(data.profiles || []);
    } catch {
      setError('Could not load menu profiles.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  // Auto-clear messages after 4s
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage('');
        setError('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const openCreateModal = () => {
    setFormName('');
    setFormSlug('');
    setFormSlugManual(false);
    setFormDescription('');
    setFormTheme('');
    setIsThemeDropdownOpen(false);
    setIsModalOpen(true);
  };

  const handleNameChange = (value: string) => {
    setFormName(value);
    if (!formSlugManual) {
      setFormSlug(slugify(value));
    }
  };

  const handleSlugChange = (value: string) => {
    setFormSlugManual(true);
    setFormSlug(slugify(value));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formSlug) return;

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/menu-profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          slug: formSlug,
          description: formDescription || undefined,
          theme: formTheme || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create profile');
        setSaving(false);
        return;
      }

      setMessage('Menu profile created successfully!');
      setIsModalOpen(false);
      loadProfiles();
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch(`/api/menu-profiles/${deleteTarget.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to delete profile');
        setDeleting(false);
        setDeleteTarget(null);
        return;
      }

      setMessage('Menu profile deleted successfully.');
      setDeleteTarget(null);
      loadProfiles();
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setDeleting(false);
    }
  };

  const getThemeInfo = (themeKey: string | null) => {
    if (!themeKey) return null;
    return THEME_LIST.find((t) => t.key === themeKey) || null;
  };

  const selectedThemeInfo = getThemeInfo(formTheme);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#D4A437]" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold flex items-center gap-3">
            <BookCopy className="w-8 h-8 text-[#D4A437]" />
            Menu Profiles
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Create and manage multiple menu profiles for different occasions, locations, or seasons.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#D4A437] to-[#B88E2F] text-black font-bold text-sm shadow-[0_0_15px_rgba(212,164,55,0.2)] hover:shadow-[0_0_20px_rgba(212,164,55,0.3)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create New Profile
        </button>
      </div>

      {/* Success & Error Messages */}
      {message && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm flex items-center gap-3">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Profiles Grid */}
      {profiles.length === 0 ? (
        <div className="glass rounded-3xl">
          <div className="text-center py-20 px-8">
            <div className="w-20 h-20 rounded-2xl bg-gray-950 border border-gray-900 flex items-center justify-center mx-auto mb-6">
              <BookCopy className="w-10 h-10 text-gray-700" />
            </div>
            <h3 className="font-serif text-xl font-bold text-white mb-2">No Menu Profiles Yet</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-8">
              Create your first menu profile to start organizing your restaurant&apos;s menu.
              Each profile can have its own theme, categories, and items.
            </p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4A437] to-[#B88E2F] text-black font-bold text-sm shadow-[0_0_15px_rgba(212,164,55,0.2)] hover:shadow-[0_0_20px_rgba(212,164,55,0.3)] transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Create Your First Profile
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => {
            const themeInfo = getThemeInfo(profile.theme);
            return (
              <div
                key={profile.id}
                className="group glass rounded-3xl overflow-hidden border border-gray-900/50 hover:border-[#D4A437]/20 transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,164,55,0.05)] flex flex-col"
              >
                {/* Card Header with Theme Strip */}
                <div className="relative h-3 w-full">
                  <div
                    className="absolute inset-0"
                    style={{
                      background: themeInfo
                        ? `linear-gradient(135deg, ${themeInfo.previewBg} 0%, ${themeInfo.previewAccent} 50%, ${themeInfo.previewBg} 100%)`
                        : 'linear-gradient(135deg, #0A0A0A 0%, #D4A437 50%, #0A0A0A 100%)',
                    }}
                  />
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Top Row: Title & Status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0 mr-3">
                      <h3 className="font-serif text-xl font-bold text-white truncate">
                        {profile.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 font-mono">/{profile.slug}</p>
                    </div>
                    <span
                      className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        profile.status
                          ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-400'
                          : 'bg-gray-800/50 border border-gray-800 text-gray-500'
                      }`}
                    >
                      {profile.status ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Description */}
                  {profile.description && (
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                      {profile.description}
                    </p>
                  )}

                  {/* Theme Preview */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border border-gray-700 shadow-inner"
                        style={{ backgroundColor: themeInfo?.previewBg || '#0A0A0A' }}
                        title="Background"
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-gray-700 shadow-inner"
                        style={{ backgroundColor: themeInfo?.previewAccent || '#D4A437' }}
                        title="Accent"
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-gray-700 shadow-inner"
                        style={{ backgroundColor: themeInfo?.previewText || '#FFFFFF' }}
                        title="Text"
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {themeInfo?.name || 'Default Theme'}
                    </span>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="text-center p-3 rounded-xl bg-gray-950/60 border border-gray-900">
                      <div className="flex items-center justify-center mb-1">
                        <Layers className="w-3.5 h-3.5 text-[#D4A437]" />
                      </div>
                      <p className="text-lg font-bold text-white">{profile._count.categories}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Categories</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-gray-950/60 border border-gray-900">
                      <div className="flex items-center justify-center mb-1">
                        <UtensilsCrossed className="w-3.5 h-3.5 text-[#D4A437]" />
                      </div>
                      <p className="text-lg font-bold text-white">{profile._count.menuItems}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Items</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-gray-950/60 border border-gray-900">
                      <div className="flex items-center justify-center mb-1">
                        <QrCode className="w-3.5 h-3.5 text-[#D4A437]" />
                      </div>
                      <p className="text-lg font-bold text-white">
                        {profile.qrCode ? (
                          <span className="text-emerald-400 text-xs font-semibold">Yes</span>
                        ) : (
                          <span className="text-gray-600 text-xs font-semibold">No</span>
                        )}
                      </p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">QR Code</p>
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-900/60">
                    <a
                      href={`/dashboard/menu-profiles/${profile.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-sm font-medium text-gray-300 hover:text-[#D4A437] hover:border-[#D4A437]/30 transition-all cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </a>
                    <button
                      onClick={() => setDeleteTarget(profile)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-sm font-medium text-gray-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE PROFILE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg glass-gold rounded-3xl p-6 sm:p-8 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-[#D4A437]/10 border border-[#D4A437]/20">
                <Sparkles className="w-5 h-5 text-[#D4A437]" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">Create New Profile</h3>
                <p className="text-xs text-gray-500 mt-0.5">Set up a new menu profile for your restaurant</p>
              </div>
            </div>

            <form onSubmit={handleCreate} className="space-y-5">
              {/* Profile Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Profile Name
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Lunch Menu, Weekend Special"
                  className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-all"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  URL Slug
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm">/</span>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="auto-generated-from-name"
                    className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl pl-7 pr-4 py-3.5 text-sm text-white font-mono focus:outline-none transition-all"
                  />
                </div>
                <p className="text-[10px] text-gray-600 mt-1.5">Only lowercase letters, numbers, and hyphens</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Description
                  <span className="text-gray-600 normal-case tracking-normal font-normal ml-1">(optional)</span>
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="A brief description of this menu profile..."
                  rows={3}
                  className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-all resize-none"
                />
              </div>

              {/* Theme Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Theme
                  <span className="text-gray-600 normal-case tracking-normal font-normal ml-1">(optional)</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                    className="w-full flex items-center justify-between bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-4 py-3.5 text-sm text-left focus:outline-none transition-all cursor-pointer"
                  >
                    {selectedThemeInfo ? (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <div
                            className="w-3 h-3 rounded-full border border-gray-700"
                            style={{ backgroundColor: selectedThemeInfo.previewBg }}
                          />
                          <div
                            className="w-3 h-3 rounded-full border border-gray-700"
                            style={{ backgroundColor: selectedThemeInfo.previewAccent }}
                          />
                        </div>
                        <span className="text-white">{selectedThemeInfo.name}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">Choose a theme...</span>
                    )}
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform ${
                        isThemeDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isThemeDropdownOpen && (
                    <div className="absolute z-50 mt-2 w-full max-h-64 overflow-y-auto bg-[#0d0d0d] border border-gray-800 rounded-xl shadow-2xl shadow-black/60">
                      {/* No theme option */}
                      <button
                        type="button"
                        onClick={() => {
                          setFormTheme('');
                          setIsThemeDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-400 hover:bg-gray-900 hover:text-white transition-colors cursor-pointer border-b border-gray-900"
                      >
                        No theme (use default)
                      </button>
                      {THEME_LIST.map((theme) => (
                        <button
                          key={theme.key}
                          type="button"
                          onClick={() => {
                            setFormTheme(theme.key);
                            setIsThemeDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-900 transition-colors cursor-pointer ${
                            formTheme === theme.key
                              ? 'bg-[#D4A437]/5 border-l-2 border-[#D4A437]'
                              : 'border-l-2 border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-1 shrink-0">
                            <div
                              className="w-3 h-3 rounded-full border border-gray-700"
                              style={{ backgroundColor: theme.previewBg }}
                            />
                            <div
                              className="w-3 h-3 rounded-full border border-gray-700"
                              style={{ backgroundColor: theme.previewAccent }}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-white truncate">{theme.name}</p>
                            <p className="text-[10px] text-gray-600 truncate">{theme.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={saving || !formName || !formSlug}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4A437] to-[#B88E2F] hover:from-[#B88E2F] hover:to-[#A37B24] text-black font-bold text-base transition-all duration-300 shadow-[0_0_15px_rgba(212,164,55,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Create Profile
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md glass-gold rounded-3xl p-6 sm:p-8 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setDeleteTarget(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
                <Trash2 className="w-8 h-8 text-red-400" />
              </div>

              <h3 className="font-serif text-xl font-bold text-white mb-2">Delete Profile</h3>
              <p className="text-sm text-gray-400 mb-1">
                Are you sure you want to delete
              </p>
              <p className="text-base font-bold text-white mb-4">
                &ldquo;{deleteTarget.name}&rdquo;?
              </p>
              <p className="text-xs text-gray-600 mb-8 max-w-sm mx-auto">
                This will remove the profile and unlink all associated categories and menu items.
                This action cannot be undone.
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  className="flex-1 py-3 rounded-xl bg-gray-950 border border-gray-800 text-sm font-semibold text-gray-300 hover:text-white hover:border-gray-700 transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="flex-1 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-sm font-bold text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete Profile
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
