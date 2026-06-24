'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Store, Link as LinkIcon, Phone, MapPin, Globe, Loader2, Save, FileText, CheckCircle, Image } from 'lucide-react';
import ImageCropper from '@/components/image-cropper';

type ThemeType = 'LUXURY_DARK' | 'ELEGANT_LIGHT' | 'CAFE_THEME' | 'MODERN_THEME';

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
  const [theme, setTheme] = useState<ThemeType>('LUXURY_DARK');
  const [currencySymbol, setCurrencySymbol] = useState('₹');

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
        setTheme(data.theme || 'LUXURY_DARK');
        setCurrencySymbol(data.currencySymbol || '₹');
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
          theme,
          currencySymbol,
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

  const themesList = [
    {
      id: 'LUXURY_DARK' as ThemeType,
      name: 'Luxury Dark',
      bg: 'bg-[#0A0A0A]',
      accent: 'border-[#D4A437]',
      text: 'text-white',
      desc: 'Elegant gold highlights on deep black'
    },
    {
      id: 'ELEGANT_LIGHT' as ThemeType,
      name: 'Elegant Light',
      bg: 'bg-[#F7F3EE]',
      accent: 'border-[#D4A24C]',
      text: 'text-[#1F1F1F]',
      desc: 'Chic cream theme with premium brown text'
    },
    {
      id: 'CAFE_THEME' as ThemeType,
      name: 'Cafe Theme',
      bg: 'bg-[#1E1610]',
      accent: 'border-[#A07855]',
      text: 'text-[#F5F2EB]',
      desc: 'Warm espresso background with latte colors'
    },
    {
      id: 'MODERN_THEME' as ThemeType,
      name: 'Modern Theme',
      bg: 'bg-zinc-950',
      accent: 'border-white',
      text: 'text-white',
      desc: 'Minimalist high-contrast layout'
    }
  ];

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
        </div>

        {/* Theme Selector */}
        <div className="glass p-6 sm:p-8 rounded-3xl space-y-6">
          <h3 className="text-lg font-bold border-b border-gray-900 pb-3">Theme Selection</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {themesList.map((t) => {
              const isSelected = theme === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`p-5 rounded-2xl cursor-pointer border-2 transition-all flex flex-col justify-between h-32 ${t.bg} ${
                    isSelected
                      ? `${t.accent} shadow-[0_0_15px_rgba(212,164,55,0.15)]`
                      : 'border-transparent hover:border-gray-800 opacity-60 hover:opacity-90'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`font-serif font-bold text-lg ${t.text}`}>{t.name}</span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#D4A437] flex items-center justify-center">
                        <CheckCircle className="w-3.5 h-3.5 text-black" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{t.desc}</span>
                </div>
              );
            })}
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
