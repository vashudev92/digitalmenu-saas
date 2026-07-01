'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import {
  BookCopy,
  ChevronLeft,
  Loader2,
  Save,
  CheckCircle,
  AlertCircle,
  Eye,
  Settings,
  Palette,
  Type,
  QrCode,
  Download,
  Printer
} from 'lucide-react';
import ImageCropper from '@/components/image-cropper';
import { THEME_LIST, FONT_OPTIONS, COLOR_PRESETS } from '@/lib/theme-config';

export default function EditMenuProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState(''); // Empty string = inherit
  const [primaryColor, setPrimaryColor] = useState('');
  const [secondaryColor, setSecondaryColor] = useState('');
  const [accentColor, setAccentColor] = useState('');
  const [fontHeading, setFontHeading] = useState('');
  const [fontBody, setFontBody] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [logoOverride, setLogoOverride] = useState('');
  const [status, setStatus] = useState(true);
  
  // Restaurant info (for preview and default QR)
  const [restaurantSlug, setRestaurantSlug] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [generatingQr, setGeneratingQr] = useState(false);

  // Load profile data
  const loadProfile = useCallback(async () => {
    try {
      const res = await fetch(`/api/menu-profiles/${id}`);
      if (!res.ok) {
        throw new Error('Failed to load menu profile');
      }
      const data = await res.json();
      const { profile } = data;

      setName(profile.name || '');
      setSlug(profile.slug || '');
      setDescription(profile.description || '');
      setTheme(profile.theme || '');
      setPrimaryColor(profile.primaryColor || '');
      setSecondaryColor(profile.secondaryColor || '');
      setAccentColor(profile.accentColor || '');
      setFontHeading(profile.fontHeading || '');
      setFontBody(profile.fontBody || '');
      setBannerImage(profile.bannerImage || '');
      setLogoOverride(profile.logoOverride || '');
      setStatus(profile.status);
      
      // Load restaurant details
      const profileRes = await fetch('/api/profile');
      if (profileRes.ok) {
        const rData = await profileRes.json();
        setRestaurantSlug(rData.slug);
      }

      if (profile.qrCode) {
        setQrCodeUrl(profile.qrCode.url);
        setQrCodeDataUrl(profile.qrCode.dataUrl);
      }
    } catch (err) {
      setError('Could not load menu profile details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Handle save
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch(`/api/menu-profiles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          description,
          theme: theme || null,
          primaryColor: primaryColor || null,
          secondaryColor: secondaryColor || null,
          accentColor: accentColor || null,
          fontHeading: fontHeading || null,
          fontBody: fontBody || null,
          bannerImage: bannerImage || null,
          logoOverride: logoOverride || null,
          status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to update menu profile');
        return;
      }

      setMessage('Menu profile updated successfully!');
      
      if (data.profile.qrCode) {
        setQrCodeUrl(data.profile.qrCode.url);
        setQrCodeDataUrl(data.profile.qrCode.dataUrl);
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setSaving(false);
    }
  };

  // Generate QR Code for this profile
  const handleGenerateQR = async () => {
    setGeneratingQr(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          menuProfileId: id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to generate QR Code');
        return;
      }

      setMessage('QR Code generated successfully!');
      setQrCodeUrl(data.url);
      setQrCodeDataUrl(data.dataUrl);
    } catch {
      setError('Failed to generate QR Code.');
    } finally {
      setGeneratingQr(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#D4A437]" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/dashboard/menu-profiles')}
          className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Profiles
        </button>

        {restaurantSlug && slug && (
          <a
            href={`/r/${restaurantSlug}/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-950 border border-gray-900 text-sm font-semibold text-gray-300 hover:text-[#D4A437] hover:border-[#D4A437]/20 transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4" /> Live Preview Menu
          </a>
        )}
      </div>

      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold flex items-center gap-3">
          <BookCopy className="w-8 h-8 text-[#D4A437]" />
          Edit Profile: {name}
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Customize design override, layout settings, and generate QR routing for this dining profile.
        </p>
      </div>

      {/* Messages */}
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

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Config */}
        <div className="glass p-6 sm:p-8 rounded-3xl space-y-6">
          <h3 className="text-lg font-bold border-b border-gray-900 pb-3 flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#D4A437]" /> Basic Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Profile Name (e.g. Rooftop Dining)
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rooftop Lounge"
                className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Slug (scanplate.com/r/slug/profile-slug)
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                placeholder="rooftop"
                className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Profile Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this dining area or special menu layout..."
              className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-all resize-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="status"
              checked={status}
              onChange={(e) => setStatus(e.target.checked)}
              className="rounded border-gray-800 text-[#D4A437] focus:ring-[#D4A437] h-4 w-4 bg-[#0d0d0d]"
            />
            <label htmlFor="status" className="text-sm font-medium text-gray-300 select-none cursor-pointer">
              Profile Active (Visible to QR Scanners)
            </label>
          </div>
        </div>

        {/* Design Override Tab */}
        <div className="glass p-6 sm:p-8 rounded-3xl space-y-8">
          <h3 className="text-lg font-bold border-b border-gray-900 pb-3 flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#D4A437]" /> Style & Design Overrides
          </h3>
          <p className="text-xs text-gray-500">
            Customize style properties specifically for this menu profile. Leave these field inputs empty or set as default to inherit your main restaurant settings.
          </p>

          {/* Theme Selector override */}
          <div className="space-y-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
              Theme Override
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-all"
            >
              <option value="">Inherit Default Restaurant Theme</option>
              {THEME_LIST.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Font selection override */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-900/60">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Heading Font Override
              </label>
              <select
                value={fontHeading}
                onChange={(e) => setFontHeading(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-all"
              >
                <option value="">Inherit Restaurant Heading Font</option>
                {FONT_OPTIONS.map((f) => (
                  <option key={f.family} value={f.family}>
                    {f.family} ({f.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Body Font Override
              </label>
              <select
                value={fontBody}
                onChange={(e) => setFontBody(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-all"
              >
                <option value="">Inherit Restaurant Body Font</option>
                {FONT_OPTIONS.map((f) => (
                  <option key={f.family} value={f.family}>
                    {f.family} ({f.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Colors override */}
          <div className="space-y-4 pt-4 border-t border-gray-900/60">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-gray-400" />
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Custom Color Overrides
              </label>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-[10px] text-gray-500 uppercase mb-2">Primary Override</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={primaryColor || '#000000'}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 border border-gray-850 rounded-xl bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    placeholder="Inherit"
                    className="flex-1 bg-[#0d0d0d] border border-gray-800 rounded-xl px-3 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 uppercase mb-2">Secondary Override</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={secondaryColor || '#000000'}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-10 h-10 border border-gray-850 rounded-xl bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    placeholder="Inherit"
                    className="flex-1 bg-[#0d0d0d] border border-gray-800 rounded-xl px-3 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 uppercase mb-2">Accent Override</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={accentColor || '#000000'}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-10 h-10 border border-gray-850 rounded-xl bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    placeholder="Inherit"
                    className="flex-1 bg-[#0d0d0d] border border-gray-800 rounded-xl px-3 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Presets swatch list */}
            <div className="pt-2">
              <label className="block text-[10px] text-gray-500 uppercase mb-2">Predefined Presets</label>
              <div className="flex flex-wrap gap-2">
                {COLOR_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => {
                      setPrimaryColor(p.primary);
                      setSecondaryColor(p.secondary);
                      setAccentColor(p.accent);
                    }}
                    className="px-2.5 py-1.5 rounded-lg border border-gray-900 bg-gray-950 hover:bg-gray-900 text-[10px] font-semibold text-gray-400 flex items-center gap-1.5"
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.primary }} />
                    {p.name}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setPrimaryColor('');
                    setSecondaryColor('');
                    setAccentColor('');
                  }}
                  className="px-2.5 py-1.5 rounded-lg border border-red-500/25 bg-red-950/15 text-[10px] font-semibold text-red-400 hover:bg-red-950/25"
                >
                  Clear Overrides
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Media Overrides */}
        <div className="glass p-6 sm:p-8 rounded-3xl space-y-6">
          <h3 className="text-lg font-bold border-b border-gray-900 pb-3 flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#D4A437]" /> Media Overrides
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <div>
              <ImageCropper
                label="Logo Override (Square)"
                aspectRatio="square"
                value={logoOverride}
                onChange={(url) => setLogoOverride(url)}
              />
            </div>

            <div>
              <ImageCropper
                label="Banner Image Override (3:1 Rectangle)"
                aspectRatio="banner"
                value={bannerImage}
                onChange={(url) => setBannerImage(url)}
              />
            </div>
          </div>
        </div>

        {/* Form Action save */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4A437] to-[#B88E2F] hover:from-[#B88E2F] hover:to-[#A37B24] text-black font-bold text-base transition-all duration-300 shadow-[0_0_15px_rgba(212,164,55,0.2)] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Saving Changes...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" /> Save Profile Details
            </>
          )}
        </button>
      </form>

      {/* QR Code Segment */}
      <div className="glass p-6 sm:p-8 rounded-3xl space-y-6">
        <h3 className="text-lg font-bold border-b border-gray-900 pb-3 flex items-center gap-2">
          <QrCode className="w-5 h-5 text-[#D4A437]" /> QR Code Routing
        </h3>

        {qrCodeDataUrl ? (
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="p-4 rounded-3xl bg-white border border-gray-250/20 shrink-0">
              <img src={qrCodeDataUrl} alt="QR Code" className="w-48 h-48 object-contain" />
            </div>
            
            <div className="space-y-4 flex-1">
              <div>
                <h4 className="font-bold text-white text-base">Unique Scan Code Router</h4>
                <p className="text-sm text-gray-500 mt-1">
                  This QR code redirects customer devices straight to this menu profile:
                </p>
                <div className="p-3 bg-gray-950 border border-gray-900 rounded-xl mt-2 select-all font-mono text-xs text-[#D4A437] break-all">
                  {qrCodeUrl}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={qrCodeDataUrl}
                  download={`digitalmenu-qr-${slug}.png`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-xs font-semibold text-gray-300 hover:text-white hover:border-gray-700 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download PNG
                </a>
                <button
                  onClick={handleGenerateQR}
                  disabled={generatingQr}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4A437]/10 border border-[#D4A437]/25 text-xs font-bold text-[#D4A437] hover:bg-[#D4A437]/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {generatingQr ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <QrCode className="w-4 h-4" />
                  )}
                  Regenerate QR Code
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <QrCode className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <p className="text-sm text-gray-400 mb-4">No QR Code generated for this menu profile yet.</p>
            <button
              onClick={handleGenerateQR}
              disabled={generatingQr}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4A437] to-[#B88E2F] text-black font-bold text-xs uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-2 mx-auto cursor-pointer"
            >
              {generatingQr ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <QrCode className="w-4 h-4" />
              )}
              Generate QR Code Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
