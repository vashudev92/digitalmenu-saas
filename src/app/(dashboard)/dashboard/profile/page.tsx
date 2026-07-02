'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useCallback } from 'react';
import { 
  Store, 
  Phone, 
  MapPin, 
  Globe, 
  Loader2, 
  Save, 
  CheckCircle, 
  Palette, 
  Type, 
  Lock,
  User,
  Coffee,
  Clock,
  Compass,
  ArrowRight
} from 'lucide-react';
import ImageCropper from '@/components/image-cropper';
import { THEME_LIST, FONT_OPTIONS, COLOR_PRESETS } from '@/lib/theme-config';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, TextArea, Select } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  const { update: updateSession } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'brand' | 'details' | 'branding' | 'welcome' | 'experience'>('brand');

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
  const [primaryColor, setPrimaryColor] = useState('#D4A853');
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
        setPrimaryColor(data.primaryColor || '#D4A853');
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

  const getThemeTier = (key: string): string => {
    if (key === 'LUXURY_DARK' || key === 'MINIMAL_JAPANESE') return 'STARTER';
    if (key === 'MODERN_CAFE' || key === 'ITALIAN_BISTRO') return 'PROFESSIONAL';
    return 'PREMIUM';
  };

  const isThemeLocked = (themeKey: string) => {
    const tier = getThemeTier(themeKey);
    if (planName === 'Premium') return false;
    if (planName === 'Professional') {
      return tier === 'PREMIUM';
    }
    // Free plan locks PROFESSIONAL & PREMIUM
    return tier !== 'STARTER';
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4A853]" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.04] pb-5">
        <div>
          <h1 className="font-serif text-2xl font-bold flex items-center gap-2 text-white">
            <Store className="w-6 h-6 text-[#D4A853]" /> Brand Studio
          </h1>
          <p className="text-xs text-gray-500 mt-1">Sculpt your brand assets, color schemes, typography, and welcome page interfaces.</p>
        </div>
        <Button 
          variant="primary" 
          size="sm"
          isLoading={saving}
          onClick={handleSubmit}
          leftIcon={<Save className="w-3.5 h-3.5" />}
          className="cursor-pointer"
        >
          Save Changes
        </Button>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-3">
          <CheckCircle className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-3">
          <span>{error}</span>
        </div>
      )}

      {/* Main split dashboard layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Form Columns (7/12) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Tab buttons */}
          <div className="flex border-b border-white/[0.04] overflow-x-auto pb-px scrollbar-none gap-2">
            {[
              { id: 'brand', label: 'Brand & Story' },
              { id: 'details', label: 'Info & Socials' },
              { id: 'experience', label: 'Experiences' },
              { id: 'branding', label: 'Colors & Fonts' },
              { id: 'welcome', label: 'Welcome Copy' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as any)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === t.id 
                    ? 'border-[#D4A853] text-[#D4A853]' 
                    : 'border-transparent text-gray-500 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <Card className="p-6 sm:p-8 space-y-6">
            {/* TAB 1: Brand & Story */}
            {activeTab === 'brand' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input 
                    label="Restaurant Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input 
                    label="URL Slug (digitalmenu-saas/r/slug)"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input 
                    label="Brand Tagline"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                  />
                  <Select 
                    label="Currency Symbol"
                    value={currencySymbol}
                    onChange={(e) => setCurrencySymbol(e.target.value)}
                    options={[
                      { value: '₹', label: '₹ (INR)' },
                      { value: '$', label: '$ (USD)' },
                      { value: '€', label: '€ (EUR)' },
                      { value: '£', label: '£ (GBP)' },
                      { value: 'AED', label: 'AED (Dirham)' }
                    ]}
                  />
                </div>
                <TextArea 
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                {/* Media assets */}
                <div className="space-y-4 pt-4 border-t border-white/[0.04]">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Brand Graphics</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Logo Uploader */}
                    <div className="space-y-2">
                      <span className="block text-[10px] text-gray-500 font-bold uppercase">Logo Asset</span>
                      <ImageCropper
                        label="Logo"
                        aspectRatio="square"
                        value={logo}
                        onChange={(val) => setLogo(val)}
                      />
                    </div>
                    {/* Banner Uploader */}
                    <div className="space-y-2">
                      <span className="block text-[10px] text-gray-500 font-bold uppercase">Banner Asset</span>
                      <ImageCropper
                        label="Banner"
                        aspectRatio="banner"
                        value={banner}
                        onChange={(val) => setBanner(val)}
                      />
                    </div>
                    {/* Favicon Uploader */}
                    <div className="space-y-2">
                      <span className="block text-[10px] text-gray-500 font-bold uppercase">Tab Favicon</span>
                      <ImageCropper
                        label="Favicon"
                        aspectRatio="square"
                        value={favicon}
                        onChange={(val) => setFavicon(val)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Details & Socials */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input 
                    label="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <Input 
                    label="WhatsApp Link"
                    value={whatsApp}
                    onChange={(e) => setWhatsApp(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input 
                    label="Website URL"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                  <Input 
                    label="Opening Hours Description"
                    value={openingHours}
                    onChange={(e) => setOpeningHours(e.target.value)}
                  />
                </div>
                <Input 
                  label="Restaurant Physical Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <Input 
                  label="Google Maps Coordinates/URL"
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                />
              </div>
            )}

            {/* TAB 3: Experience Marketplace */}
            {activeTab === 'experience' && (
              <div className="space-y-6 text-left">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Experience Marketplace</h4>
                <div className="grid grid-cols-1 gap-4">
                  {THEME_LIST.map((themeSpec) => {
                    const themeTier = getThemeTier(themeSpec.key);
                    const isLocked = isThemeLocked(themeSpec.key);
                    const isSelected = theme === themeSpec.key;
                    return (
                      <div 
                        key={themeSpec.key}
                        onClick={() => {
                          if (isLocked) {
                            alert(`Please upgrade your subscription to unlock the ${themeSpec.name} experience.`);
                            return;
                          }
                          setTheme(themeSpec.key);
                        }}
                        className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all cursor-pointer ${
                          isSelected 
                            ? 'border-[#D4A853] bg-[#D4A853]/5' 
                            : 'border-white/[0.04] bg-white/[0.01] hover:border-white/[0.1]'
                        } ${isLocked ? 'opacity-65' : ''}`}
                      >
                        <div className="flex gap-4 items-center">
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center text-xs font-bold uppercase shrink-0 border border-white/5"
                            style={{ backgroundColor: themeSpec.previewBg, color: themeSpec.previewText }}
                          >
                            {themeSpec.name.charAt(0)}
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                              {themeSpec.name}
                              {isLocked && <Lock className="w-3 h-3 text-[#D4A853]" />}
                            </h5>
                            <p className="text-[10px] text-gray-400 mt-1 leading-normal max-w-sm">{themeSpec.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                          <Badge variant={themeTier === 'PREMIUM' ? 'gold' : themeTier === 'PROFESSIONAL' ? 'success' : 'default'}>
                            {themeTier}
                          </Badge>
                          {isSelected && <span className="text-[10px] font-bold text-[#D4A853]">Active</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: Branding Custom Colors & Fonts */}
            {activeTab === 'branding' && (
              <div className="space-y-6">
                {/* Font configuration */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Typography Config</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select 
                      label="Heading Typography"
                      value={fontHeading}
                      onChange={(e) => setFontHeading(e.target.value)}
                      options={FONT_OPTIONS.map(f => ({ value: f.family, label: f.family }))}
                    />
                    <Select 
                      label="Body Typography"
                      value={fontBody}
                      onChange={(e) => setFontBody(e.target.value)}
                      options={FONT_OPTIONS.map(f => ({ value: f.family, label: f.family }))}
                    />
                  </div>
                </div>

                {/* Color pickers */}
                <div className="space-y-4 pt-4 border-t border-white/[0.04]">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Custom Brand Colors</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <span className="block text-[10px] text-gray-500 font-bold uppercase mb-1.5">Primary Color</span>
                      <div className="flex gap-2 items-center">
                        <input 
                          type="color" 
                          value={primaryColor} 
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-10 h-10 rounded border border-white/10 cursor-pointer bg-transparent"
                        />
                        <span className="text-xs text-white uppercase font-mono">{primaryColor}</span>
                      </div>
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-500 font-bold uppercase mb-1.5">Secondary Color</span>
                      <div className="flex gap-2 items-center">
                        <input 
                          type="color" 
                          value={secondaryColor} 
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="w-10 h-10 rounded border border-white/10 cursor-pointer bg-transparent"
                        />
                        <span className="text-xs text-white uppercase font-mono">{secondaryColor}</span>
                      </div>
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-500 font-bold uppercase mb-1.5">Accent Highlight</span>
                      <div className="flex gap-2 items-center">
                        <input 
                          type="color" 
                          value={accentColor} 
                          onChange={(e) => setAccentColor(e.target.value)}
                          className="w-10 h-10 rounded border border-white/10 cursor-pointer bg-transparent"
                        />
                        <span className="text-xs text-white uppercase font-mono">{accentColor}</span>
                      </div>
                    </div>
                  </div>

                  {/* Swatches presets */}
                  <div className="pt-2">
                    <span className="block text-[10px] text-gray-500 font-bold uppercase mb-2">Palette Presets</span>
                    <div className="flex flex-wrap gap-2">
                      {COLOR_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setPrimaryColor(preset.primary);
                            setSecondaryColor(preset.secondary);
                            setAccentColor(preset.accent);
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] text-[10px] font-semibold text-gray-300 flex items-center gap-1.5 cursor-pointer"
                        >
                          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: preset.primary }} />
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: Welcome page customized titles */}
            {activeTab === 'welcome' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input 
                    label="Banner Greeting Line 1"
                    value={bannerTitle1}
                    onChange={(e) => setBannerTitle1(e.target.value)}
                    placeholder="Welcome To"
                  />
                  <Input 
                    label="Banner Greeting Line 2"
                    value={bannerTitle2}
                    onChange={(e) => setBannerTitle2(e.target.value)}
                    placeholder="Our Restaurant"
                  />
                </div>
                <Input 
                  label="Banner Subtitle description"
                  value={bannerSubtitle}
                  onChange={(e) => setBannerSubtitle(e.target.value)}
                  placeholder="Experience authentic flavours curated by chefs."
                />

                <div className="space-y-4 pt-4 border-t border-white/[0.04]">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Features/Highlights Grid</h4>
                  
                  {/* Badge 1 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-white/[0.04] bg-white/[0.01]">
                    <Input 
                      label="Feature 1 Heading"
                      value={badge1Title}
                      onChange={(e) => setBadge1Title(e.target.value)}
                      placeholder="Chef Curated"
                    />
                    <Input 
                      label="Feature 1 Details"
                      value={badge1Desc}
                      onChange={(e) => setBadge1Desc(e.target.value)}
                      placeholder="Exquisite recipes"
                    />
                  </div>

                  {/* Badge 2 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-white/[0.04] bg-white/[0.01]">
                    <Input 
                      label="Feature 2 Heading"
                      value={badge2Title}
                      onChange={(e) => setBadge2Title(e.target.value)}
                      placeholder="Fresh Ingredients"
                    />
                    <Input 
                      label="Feature 2 Details"
                      value={badge2Desc}
                      onChange={(e) => setBadge2Desc(e.target.value)}
                      placeholder="Locally sourced"
                    />
                  </div>

                  {/* Badge 3 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-white/[0.04] bg-white/[0.01]">
                    <Input 
                      label="Feature 3 Heading"
                      value={badge3Title}
                      onChange={(e) => setBadge3Title(e.target.value)}
                      placeholder="Ambient Dining"
                    />
                    <Input 
                      label="Feature 3 Details"
                      value={badge3Desc}
                      onChange={(e) => setBadge3Desc(e.target.value)}
                      placeholder="Comfort dining spots"
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Real-time Phone Mockup Preview Panel (5/12) */}
        <div className="lg:col-span-5 sticky top-24 hidden lg:flex flex-col items-center">
          <div className="w-full text-left mb-2">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Live Experience Preview</span>
          </div>

          <div className="w-full max-w-[280px] h-[550px] rounded-[40px] border-8 border-white/[0.08] bg-[#0E0E10] shadow-2xl p-3 overflow-hidden flex flex-col">
            {/* Phone notch */}
            <div className="absolute top-0 inset-x-0 h-5 bg-black flex justify-center items-center z-20">
              <div className="w-16 h-3 rounded-full bg-black" />
            </div>

            {/* Preview Frame screen content */}
            <div 
              className="w-full h-full rounded-[28px] overflow-hidden bg-black flex flex-col relative text-left"
              style={{ fontFamily: fontBody }}
            >
              {/* Welcome Page Layout Engine Mode */}
              <div className="absolute inset-0 overflow-y-auto flex flex-col">
                {/* Banner image or fallback */}
                <div className="h-28 bg-[#111] relative z-10 flex items-end p-4">
                  {banner ? (
                    <div 
                      className="absolute inset-0 bg-cover bg-center" 
                      style={{ backgroundImage: `url(${banner})` }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black" />
                  )}
                  <div className="absolute inset-0 bg-black/45" />

                  {/* Logo overlay */}
                  <div className="relative z-10 flex gap-2 items-center">
                    {logo ? (
                      <div 
                        className="w-8 h-8 rounded-full border border-white/20 bg-cover bg-center"
                        style={{ backgroundImage: `url(${logo})` }}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-950 flex items-center justify-center font-bold text-white text-[10px]">
                        {name.charAt(0)}
                      </div>
                    )}
                    <h5 
                      className="text-xs font-bold text-white leading-tight"
                      style={{ fontFamily: fontHeading }}
                    >
                      {name || 'My Restaurant'}
                    </h5>
                  </div>
                </div>

                {/* Sub title details text */}
                <div className="p-4 space-y-4">
                  <div className="space-y-1">
                    <h4 
                      className="text-base font-bold text-white leading-normal"
                      style={{ color: primaryColor, fontFamily: fontHeading }}
                    >
                      {bannerTitle1 || 'Welcome To'} {bannerTitle2 || 'Our Restaurant'}
                    </h4>
                    <p className="text-[10px] text-gray-400 leading-normal">{bannerSubtitle || 'Experience fine food.'}</p>
                  </div>

                  {/* Badges highlights block */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/[0.02] border border-white/[0.04] p-2 rounded-lg text-center">
                      <span className="text-[9px] font-bold text-white block truncate">{badge1Title || 'Quality'}</span>
                      <span className="text-[7px] text-gray-500 block truncate mt-0.5">{badge1Desc || 'Fresh ingredients'}</span>
                    </div>
                    <div className="bg-white/[0.02] border border-white/[0.04] p-2 rounded-lg text-center">
                      <span className="text-[9px] font-bold text-white block truncate">{badge2Title || 'Ambiance'}</span>
                      <span className="text-[7px] text-gray-500 block truncate mt-0.5">{badge2Desc || 'Modern dining'}</span>
                    </div>
                    <div className="bg-white/[0.02] border border-white/[0.04] p-2 rounded-lg text-center">
                      <span className="text-[9px] font-bold text-white block truncate">{badge3Title || 'Service'}</span>
                      <span className="text-[7px] text-gray-500 block truncate mt-0.5">{badge3Desc || 'Friendly staff'}</span>
                    </div>
                  </div>

                  {/* Menu button layout */}
                  <div 
                    className="p-3.5 rounded-xl text-center text-xs font-semibold text-black flex items-center justify-between cursor-pointer"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <span>Browse Menu ({currencySymbol})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
