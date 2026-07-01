'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useCallback } from 'react';
import { Store, Link as LinkIcon, Phone, MapPin, Globe, Loader2, Save, FileText, CheckCircle, Image, Palette, Type, Pipette, Lock } from 'lucide-react';
import ImageCropper from '@/components/image-cropper';
import { THEME_LIST, FONT_OPTIONS, COLOR_PRESETS } from '@/lib/theme-config';

export default function ProfilePage() {
  const { update: updateSession } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsApp, setWhatsApp] = useState('');
  const [website, setWebsite] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [logo, setLogo] = useState('');
  const [banner, setBanner] = useState('');
  const [favicon, setFavicon] = useState('');
  const [theme, setTheme] = useState<string>('LUXURY_DARK');
  const [currencySymbol, setCurrencySymbol] = useState('₹');
  const [openingHours, setOpeningHours] = useState('11:00 AM - 11:00 PM');
  const [planName, setPlanName] = useState('Free');

  // Typography states
  const [fontHeading, setFontHeading] = useState('Playfair Display');
  const [fontBody, setFontBody] = useState('Inter');

  // Custom brand color states
  const [primaryColor, setPrimaryColor] = useState('#D4A437');
  const [secondaryColor, setSecondaryColor] = useState('#B88E2F');
  const [accentColor, setAccentColor] = useState('#F5D76E');

  // Welcome page customizations
  const [bannerTitle1, setBannerTitle1] = useState('');
  const [bannerTitle2, setBannerTitle2] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [badge1Title, setBadge1Title] = useState('');
  const [badge1Desc, setBadge1Desc] = useState('');
  const [badge2Title, setBadge2Title] = useState('');
  const [badge2Desc, setBadge2Desc] = useState('');
  const [badge3Title, setBadge3Title] = useState('');
  const [badge3Desc, setBadge3Desc] = useState('');

  // Load Google Fonts dynamically for preview
  const loadGoogleFont = useCallback((family: string) => {
    const fontOption = FONT_OPTIONS.find((f) => f.family === family);
    if (!fontOption) return;
    const linkId = `gfont-${family.replace(/\s+/g, '-').toLowerCase()}`;
    if (document.getElementById(linkId)) return;
    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontOption.googleParam}&display=swap`;
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    loadGoogleFont(fontHeading);
  }, [fontHeading, loadGoogleFont]);

  useEffect(() => {
    loadGoogleFont(fontBody);
  }, [fontBody, loadGoogleFont]);

  // Load Profile
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/profile');
        if (!res.ok) throw new Error('Failed to load profile');
        const data = await res.json();
        
        setName(data.name || '');
        setSlug(data.slug || '');
        setTagline(data.tagline || '');
        setDescription(data.description || '');
        setAddress(data.address || '');
        setPhone(data.phone || '');
        setWhatsApp(data.whatsApp || '');
        setWebsite(data.website || '');
        setGoogleMapsUrl(data.googleMapsUrl || '');
        setLogo(data.logo || '');
        setBanner(data.banner || '');
        setFavicon(data.favicon || '');
        setTheme(data.theme || 'LUXURY_DARK');
        setCurrencySymbol(data.currencySymbol || '₹');
        setOpeningHours(data.openingHours || '11:00 AM - 11:00 PM');
        setPlanName(data.subscription?.plan?.name || 'Free');

        // Typography
        setFontHeading(data.fontHeading || 'Playfair Display');
        setFontBody(data.fontBody || 'Inter');

        // Custom brand colors
        setPrimaryColor(data.primaryColor || '#D4A437');
        setSecondaryColor(data.secondaryColor || '#B88E2F');
        setAccentColor(data.accentColor || '#F5D76E');

        // Customize Welcome Page content
        setBannerTitle1(data.bannerTitle1 || '');
        setBannerTitle2(data.bannerTitle2 || '');
        setBannerSubtitle(data.bannerSubtitle || '');
        setBadge1Title(data.badge1Title || '');
        setBadge1Desc(data.badge1Desc || '');
        setBadge2Title(data.badge2Title || '');
        setBadge2Desc(data.badge2Desc || '');
        setBadge3Title(data.badge3Title || '');
        setBadge3Desc(data.badge3Desc || '');
      } catch (err) {
        setError('Could not load restaurant profile.');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          slug,
          tagline,
          description,
          address,
          phone,
          whatsApp,
          website,
          googleMapsUrl,
          logo,
          banner,
          favicon,
          theme,
          currencySymbol,
          openingHours,
          fontHeading,
          fontBody,
          primaryColor,
          secondaryColor,
          accentColor,
          bannerTitle1,
          bannerTitle2,
          bannerSubtitle,
          badge1Title,
          badge1Desc,
          badge2Title,
          badge2Desc,
          badge3Title,
          badge3Desc,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to update profile');
        return;
      }

      setMessage('Profile updated successfully!');
      
      // Update NextAuth session if the slug or name changed
      await updateSession({
        restaurantSlug: data.restaurant.slug,
        name: data.restaurant.name,
      });

      setSlug(data.restaurant.slug);
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setSaving(false);
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold flex items-center gap-2">
          <Store className="w-8 h-8 text-[#D4A437]" /> Restaurant Profile
        </h1>
        <p className="text-gray-400 text-sm mt-1">Configure your brand appearance, themes, and contact routing.</p>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm flex items-center gap-3">
          <CheckCircle className="w-5 h-5" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm flex items-center gap-3">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Core Profile */}
        <div className="glass p-6 sm:p-8 rounded-3xl space-y-6">
          <h3 className="text-lg font-bold border-b border-gray-900 pb-3">Basic Information</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Restaurant Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Trattoria Bella"
                className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                URL Slug (scanplate.com/r/slug)
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="trattoria-bella"
                className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Currency Symbol
              </label>
              <select
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-all"
              >
                <option value="₹">₹ (Indian Rupee)</option>
                <option value="$">$ (US Dollar)</option>
                <option value="€">€ (Euro)</option>
                <option value="£">£ (Pound Sterling)</option>
                <option value="AED">AED (Dirham)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Fine Italian Dining & Woodfired Pizza"
              className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a luxurious summary of your venue..."
              className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-all resize-none"
            />
          </div>
        </div>

        {/* Media Assets */}
        <div className="glass p-6 sm:p-8 rounded-3xl space-y-6">
          <h3 className="text-lg font-bold border-b border-gray-900 pb-3">Media Uploads</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <div>
              <ImageCropper
                label="Logo Upload (Square)"
                aspectRatio="square"
                value={logo}
                onChange={(base64) => setLogo(base64)}
              />
            </div>

            <div>
              <ImageCropper
                label="Banner Upload (3:1 Rectangle)"
                aspectRatio="banner"
                value={banner}
                onChange={(base64) => setBanner(base64)}
              />
            </div>
          </div>

          <div className="border-t border-gray-900 pt-6">
            <div className="max-w-xs">
              <ImageCropper
                label="Favicon (Browser Tab Icon)"
                aspectRatio="square"
                value={favicon}
                onChange={(base64) => setFavicon(base64)}
              />
            </div>
          </div>
        </div>

        {/* Banner & Welcome Badges Customization */}
        <div className="glass p-6 sm:p-8 rounded-3xl space-y-6">
          <h3 className="text-lg font-bold border-b border-gray-900 pb-3">Banner & Welcome Badges</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Banner Title Line 1
              </label>
              <input
                type="text"
                value={bannerTitle1}
                onChange={(e) => setBannerTitle1(e.target.value)}
                placeholder="Good Food"
                className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Banner Title Line 2
              </label>
              <input
                type="text"
                value={bannerTitle2}
                onChange={(e) => setBannerTitle2(e.target.value)}
                placeholder="Great Mood"
                className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Banner Subtitle
            </label>
            <input
              type="text"
              value={bannerSubtitle}
              onChange={(e) => setBannerSubtitle(e.target.value)}
              placeholder="Discover our chef's special selection just for you."
              className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-all"
            />
          </div>

          <div className="border-t border-gray-900 pt-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Welcome Badges (Shown under Banner)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Badge 1 */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Badge 1 (Header / Desc)</span>
                <input
                  type="text"
                  value={badge1Title}
                  onChange={(e) => setBadge1Title(e.target.value)}
                  placeholder="Hygienic"
                  className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-all"
                />
                <input
                  type="text"
                  value={badge1Desc}
                  onChange={(e) => setBadge1Desc(e.target.value)}
                  placeholder="Kitchen"
                  className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-all"
                />
              </div>

              {/* Badge 2 */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Badge 2 (Header / Desc)</span>
                <input
                  type="text"
                  value={badge2Title}
                  onChange={(e) => setBadge2Title(e.target.value)}
                  placeholder="Fresh"
                  className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-all"
                />
                <input
                  type="text"
                  value={badge2Desc}
                  onChange={(e) => setBadge2Desc(e.target.value)}
                  placeholder="Ingredients"
                  className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-all"
                />
              </div>

              {/* Badge 3 */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Badge 3 (Header / Desc)</span>
                <input
                  type="text"
                  value={badge3Title}
                  onChange={(e) => setBadge3Title(e.target.value)}
                  placeholder="Chef"
                  className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-all"
                />
                <input
                  type="text"
                  value={badge3Desc}
                  onChange={(e) => setBadge3Desc(e.target.value)}
                  placeholder="Specials"
                  className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Theme Selector — 12 Themes */}
        <div className="glass p-6 sm:p-8 rounded-3xl space-y-6">
          <h3 className="text-lg font-bold border-b border-gray-900 pb-3 flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#D4A437]" /> Theme Selection
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {THEME_LIST.map((t) => {
              const isSelected = theme === t.key;
              
              // Subscription check
              const normPlan = planName.toLowerCase();
              let isAllowed = true;
              if (normPlan === 'free' || normPlan === 'starter') {
                isAllowed = t.key === 'LUXURY_DARK' || t.key === 'MINIMAL_JAPANESE';
              } else if (normPlan === 'premium' || normPlan === 'professional') {
                isAllowed = t.key === 'LUXURY_DARK' || t.key === 'MINIMAL_JAPANESE' || t.key === 'MODERN_CAFE' || t.key === 'ITALIAN_BISTRO';
              }

              return (
                <div
                  key={t.key}
                  onClick={() => {
                    if (isAllowed) {
                      setTheme(t.key);
                    } else {
                      alert(`The "${t.name}" theme is a premium feature not included in your ${planName} plan. Please upgrade your subscription to unlock this experience!`);
                    }
                  }}
                  className={`relative p-4 rounded-2xl cursor-pointer border-2 transition-all group ${
                    isSelected
                      ? 'border-[#D4A437] shadow-[0_0_20px_rgba(212,164,55,0.15)]'
                      : 'border-transparent hover:border-gray-700'
                  } ${!isAllowed ? 'opacity-40 hover:opacity-50' : 'opacity-85 hover:opacity-100'}`}
                  style={{ backgroundColor: t.previewBg }}
                >
                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#D4A437] flex items-center justify-center z-10">
                      <CheckCircle className="w-3.5 h-3.5 text-black" />
                    </div>
                  )}

                  {/* Locked indicator */}
                  {!isAllowed && (
                    <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-black/60 border border-gray-800 flex items-center justify-center z-10" title="Premium Theme Locked">
                      <Lock className="w-3 h-3 text-[#D4A437]" />
                    </div>
                  )}

                  {/* Theme name */}
                  <span
                    className="block font-serif font-bold text-sm mb-1"
                    style={{ color: t.previewText }}
                  >
                    {t.name}
                  </span>

                  {/* Description */}
                  <span className="block text-[10px] leading-tight mb-3 opacity-60" style={{ color: t.previewText }}>
                    {t.description}
                  </span>

                  {/* Live preview bars */}
                  <div className="flex gap-1.5">
                    <div
                      className="h-2 flex-[3] rounded-full"
                      style={{ backgroundColor: t.previewAccent }}
                    />
                    <div
                      className="h-2 flex-[2] rounded-full opacity-40"
                      style={{ backgroundColor: t.previewText }}
                    />
                    <div
                      className="h-2 flex-[1] rounded-full opacity-25"
                      style={{ backgroundColor: t.previewAccent }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Typography */}
        <div className="glass p-6 sm:p-8 rounded-3xl space-y-6">
          <h3 className="text-lg font-bold border-b border-gray-900 pb-3 flex items-center gap-2">
            <Type className="w-5 h-5 text-[#D4A437]" /> Typography
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Heading Font
              </label>
              <select
                value={fontHeading}
                onChange={(e) => setFontHeading(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-all"
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f.family} value={f.family}>
                    {f.family} — {f.description}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Body Font
              </label>
              <select
                value={fontBody}
                onChange={(e) => setFontBody(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-all"
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f.family} value={f.family}>
                    {f.family} — {f.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Live Font Preview */}
          <div className="bg-[#0d0d0d] border border-gray-800 rounded-2xl p-6 space-y-3">
            <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-3">Live Preview</span>
            <h4
              className="text-2xl font-bold text-white"
              style={{ fontFamily: `'${fontHeading}', serif` }}
            >
              The Grand Menu
            </h4>
            <p
              className="text-sm text-gray-300 leading-relaxed"
              style={{ fontFamily: `'${fontBody}', sans-serif` }}
            >
              Explore our carefully curated selection of dishes, crafted with the finest ingredients
              and presented with artisanal elegance. Each plate tells a story of culinary mastery.
            </p>
            <div className="flex gap-4 pt-1">
              <span
                className="text-lg font-semibold text-[#D4A437]"
                style={{ fontFamily: `'${fontHeading}', serif` }}
              >
                ₹1,250
              </span>
              <span
                className="text-sm text-gray-400 self-end"
                style={{ fontFamily: `'${fontBody}', sans-serif` }}
              >
                Truffle Risotto
              </span>
            </div>
          </div>
        </div>

        {/* Custom Brand Colors */}
        <div className="glass p-6 sm:p-8 rounded-3xl space-y-6">
          <h3 className="text-lg font-bold border-b border-gray-900 pb-3 flex items-center gap-2">
            <Pipette className="w-5 h-5 text-[#D4A437]" /> Custom Brand Colors
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Primary Color */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Primary Color
              </label>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-12 h-12 rounded-xl border-2 border-gray-800 cursor-pointer bg-transparent [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-none"
                  />
                </div>
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="#D4A437"
                  className="flex-1 bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-all font-mono"
                />
              </div>
            </div>

            {/* Secondary Color */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Secondary Color
              </label>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-12 h-12 rounded-xl border-2 border-gray-800 cursor-pointer bg-transparent [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-none"
                  />
                </div>
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  placeholder="#B88E2F"
                  className="flex-1 bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-all font-mono"
                />
              </div>
            </div>

            {/* Accent Color */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Accent Color
              </label>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-12 h-12 rounded-xl border-2 border-gray-800 cursor-pointer bg-transparent [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-none"
                  />
                </div>
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  placeholder="#F5D76E"
                  className="flex-1 bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-all font-mono"
                />
              </div>
            </div>
          </div>

          {/* Color Presets */}
          <div>
            <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-3">Quick Presets</span>
            <div className="flex flex-wrap gap-3">
              {COLOR_PRESETS.map((preset) => {
                const isActive =
                  primaryColor === preset.primary &&
                  secondaryColor === preset.secondary &&
                  accentColor === preset.accent;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setPrimaryColor(preset.primary);
                      setSecondaryColor(preset.secondary);
                      setAccentColor(preset.accent);
                    }}
                    className={`group flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all ${
                      isActive
                        ? 'border-[#D4A437] bg-[#D4A437]/10'
                        : 'border-gray-800 hover:border-gray-600 bg-[#0d0d0d]'
                    }`}
                    title={preset.name}
                  >
                    {/* Color swatch trio */}
                    <div className="flex -space-x-1">
                      <div
                        className="w-5 h-5 rounded-full border-2 border-black"
                        style={{ backgroundColor: preset.primary }}
                      />
                      <div
                        className="w-5 h-5 rounded-full border-2 border-black"
                        style={{ backgroundColor: preset.secondary }}
                      />
                      <div
                        className="w-5 h-5 rounded-full border-2 border-black"
                        style={{ backgroundColor: preset.accent }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors whitespace-nowrap">
                      {preset.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Preview Bar */}
          <div className="bg-[#0d0d0d] border border-gray-800 rounded-2xl p-5">
            <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-3">Color Preview</span>
            <div className="flex gap-3 h-10 rounded-xl overflow-hidden">
              <div className="flex-[3] rounded-lg" style={{ backgroundColor: primaryColor }} />
              <div className="flex-[2] rounded-lg" style={{ backgroundColor: secondaryColor }} />
              <div className="flex-[1] rounded-lg" style={{ backgroundColor: accentColor }} />
            </div>
            <div className="flex gap-3 mt-2">
              <span className="flex-[3] text-[10px] text-gray-500 text-center">Primary</span>
              <span className="flex-[2] text-[10px] text-gray-500 text-center">Secondary</span>
              <span className="flex-[1] text-[10px] text-gray-500 text-center">Accent</span>
            </div>
          </div>
        </div>

        {/* Contact Links */}
        <div className="glass p-6 sm:p-8 rounded-3xl space-y-6">
          <h3 className="text-lg font-bold border-b border-gray-900 pb-3">Contact & Details</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl pl-9 pr-4 py-3.5 text-sm text-white focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                WhatsApp Link / Number (Format: +15551234567)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={whatsApp}
                  onChange={(e) => setWhatsApp(e.target.value)}
                  placeholder="+15551234567"
                  className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl pl-9 pr-4 py-3.5 text-sm text-white focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Website URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Globe className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://trattoriabella.com"
                  className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl pl-9 pr-4 py-3.5 text-sm text-white focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Google Maps Embed/Location URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl pl-9 pr-4 py-3.5 text-sm text-white focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Opening Hours
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={openingHours}
                  onChange={(e) => setOpeningHours(e.target.value)}
                  placeholder="e.g. 11:00 AM - 11:00 PM"
                  className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Physical Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Golden Avenue, Gourmet District, NY 10001"
                className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl pl-9 pr-4 py-3.5 text-sm text-white focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
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
              <Save className="w-5 h-5" /> Save Restaurant Profile
            </>
          )}
        </button>

      </form>
    </div>
  );
}
