'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import {
  QrCode,
  Copy,
  Check,
  Download,
  Printer,
  Loader2,
  Search,
  ExternalLink,
  SlidersHorizontal,
  Calendar,
  Layers,
  UtensilsCrossed,
  ChefHat,
  Palette,
  X,
  FileText,
  Clock
} from 'lucide-react';
import { THEME_LIST } from '@/lib/theme-config';

type TemplateType = 'TABLE_TENT' | 'ACRYLIC_STAND' | 'COUNTER_CARD';

interface MenuProfile {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  theme: string | null;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    categories: number;
    menuItems: number;
  };
  qrCode: {
    id: string;
    url: string;
    dataUrl: string;
  } | null;
}

export default function QRCodePage() {
  const [profiles, setProfiles] = useState<MenuProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [restaurantName, setRestaurantName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [restaurantSlug, setRestaurantSlug] = useState('');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'updatedAt' | 'itemsCount' | 'categoriesCount'>('updatedAt');

  // Copy success indicator
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Printing/Studio Modal State
  const [activePrintProfile, setActivePrintProfile] = useState<MenuProfile | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('TABLE_TENT');
  const [welcomeText, setWelcomeText] = useState('');
  const [instructionText, setInstructionText] = useState('');
  const [thankYouText, setThankYouText] = useState('');

  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/menu-profiles');
      const profileRes = await fetch('/api/profile');

      if (res.ok && profileRes.ok) {
        const data = await res.json();
        const profileData = await profileRes.json();

        setProfiles(data.profiles || []);
        setRestaurantName(profileData.name || '');
        setLogoUrl(profileData.logo || '');
        setRestaurantSlug(profileData.slug || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCopyLink = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadPNG = (profileName: string, dataUrl: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${restaurantName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${profileName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Canvas Standee Template builder
  const handleDownloadCanvasQR = async (profile: MenuProfile) => {
    try {
      if (!profile.qrCode) return;
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 1200;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Draw premium dark gradient background
      const grad = ctx.createLinearGradient(0, 0, 0, 1200);
      grad.addColorStop(0, '#0F0C08');
      grad.addColorStop(0.5, '#1A1510');
      grad.addColorStop(1, '#0A0A0A');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 800, 1200);

      // 2. Draw gold borders
      ctx.strokeStyle = '#D4A437';
      ctx.lineWidth = 4;
      ctx.strokeRect(18, 18, 800 - 36, 1200 - 36);
      ctx.strokeStyle = '#D4A437';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(28, 28, 800 - 56, 1200 - 56);

      const loadImage = (src: string): Promise<HTMLImageElement | null> => {
        return new Promise((resolve) => {
          if (!src) return resolve(null);
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = src;
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
        });
      };

      const [logoImg, qrImg] = await Promise.all([
        loadImage(logoUrl),
        loadImage(profile.qrCode.dataUrl)
      ]);

      // 3. Logo circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(400, 180, 55, 0, Math.PI * 2);
      ctx.strokeStyle = '#D4A437';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.closePath();

      if (logoImg) {
        ctx.beginPath();
        ctx.arc(400, 180, 53, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(logoImg, 347, 127, 106, 106);
      } else {
        ctx.fillStyle = '#D4A437';
        ctx.font = 'bold 45px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(restaurantName.charAt(0).toUpperCase() || 'R', 400, 180);
      }
      ctx.restore();

      // 4. Restaurant name
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 44px Georgia, Garamond, serif';
      ctx.textAlign = 'center';
      ctx.fillText(restaurantName, 400, 285);

      // 5. Divider
      ctx.strokeStyle = 'rgba(212, 164, 55, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(280, 315);
      ctx.lineTo(520, 315);
      ctx.stroke();

      const placeholders = getPlaceholders(selectedTemplate);
      const welcome = welcomeText || placeholders.welcome;
      const instruction = instructionText || placeholders.instruction;
      const thankYou = thankYouText || placeholders.thankYou;

      // 6. Welcome
      ctx.fillStyle = '#E8C163';
      ctx.font = 'italic 26px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText(welcome, 400, 360);

      // 7. QR code
      if (qrImg) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(225, 435, 350, 350);
        ctx.drawImage(qrImg, 240, 450, 320, 320);
      }

      // 8. Instruction text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(instruction, 400, 840);

      // 9. QR URL
      ctx.fillStyle = '#E8C163';
      ctx.font = '500 20px monospace';
      ctx.fillText(profile.qrCode.url.replace(/https?:\/\//, ''), 400, 890);

      // 10. Thank you footer
      ctx.fillStyle = '#8C8C8C';
      ctx.font = 'italic 22px Georgia, serif';
      ctx.fillText(thankYou, 400, 1050);

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${restaurantName.toLowerCase()}-${profile.name.toLowerCase()}-standee.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
    }
  };

  const getPlaceholders = (template: TemplateType) => {
    switch (template) {
      case 'TABLE_TENT':
        return {
          welcome: 'Table Dining Menu',
          instruction: 'Scan to Browse Menu',
          thankYou: 'Thank you for dining with us!',
        };
      case 'ACRYLIC_STAND':
        return {
          welcome: 'Welcome to Our Table',
          instruction: 'Scan QR to View Menu',
          thankYou: 'Enjoy your food!',
        };
      case 'COUNTER_CARD':
        return {
          welcome: 'Welcome! Scan to view our digital menu.',
          instruction: 'Scan & Browse',
          thankYou: 'Digital Menu View — No waiter download needed',
        };
    }
  };

  const placeholders = getPlaceholders(selectedTemplate);

  const openPrintStudio = (profile: MenuProfile) => {
    setActivePrintProfile(profile);
    const p = getPlaceholders(selectedTemplate);
    setWelcomeText('');
    setInstructionText('');
    setThankYouText('');
  };

  const handlePrint = () => {
    window.print();
  };

  // Search, filter, and sort profiles
  const processedProfiles = profiles
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'updatedAt') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      if (sortBy === 'itemsCount') {
        return b._count.menuItems - a._count.menuItems;
      }
      if (sortBy === 'categoriesCount') {
        return b._count.categories - a._count.categories;
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#D4A437]" />
      </div>
    );
  }

  const getThemeInfo = (themeKey: string | null) => {
    if (!themeKey) return null;
    return THEME_LIST.find((t) => t.key === themeKey) || null;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div className="no-print flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold flex items-center gap-3">
            <QrCode className="w-8 h-8 text-[#D4A437]" />
            QR Code Management
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Display, download, and customize QR routing codes for all your restaurant dining profiles.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="no-print flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-950 border border-gray-900 rounded-2xl p-4">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search profiles..."
            className="w-full bg-black border border-gray-800 focus:border-[#D4A437] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-all"
          />
        </div>

        {/* Sorting options */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <SlidersHorizontal className="w-4 h-4 text-gray-500 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full sm:w-48 bg-black border border-gray-800 focus:border-[#D4A437] rounded-xl px-3 py-2.5 text-xs text-[#D4A437] font-semibold focus:outline-none cursor-pointer"
          >
            <option value="updatedAt">Sort by: Last Updated</option>
            <option value="name">Sort by: Name (A-Z)</option>
            <option value="itemsCount">Sort by: Dishes Count</option>
            <option value="categoriesCount">Sort by: Categories Count</option>
          </select>
        </div>
      </div>

      {/* Cards list */}
      {processedProfiles.length === 0 ? (
        <div className="text-center py-20 bg-gray-950/20 border border-gray-900/60 rounded-3xl no-print">
          <QrCode className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <h3 className="font-serif text-lg font-bold text-white mb-1">No Profiles Matching</h3>
          <p className="text-gray-500 text-xs max-w-sm mx-auto">
            Try correcting your search term or make sure your Menu Profiles are active.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 no-print">
          {processedProfiles.map((profile) => {
            const themeInfo = getThemeInfo(profile.theme);
            const isCopySuccess = copiedId === profile.id;
            return (
              <div
                key={profile.id}
                className="group glass rounded-3xl overflow-hidden border border-gray-900 hover:border-[#D4A437]/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,164,55,0.03)] flex flex-col bg-gray-950/20"
              >
                {/* QR Code preview block */}
                <div className="p-6 bg-black flex flex-col items-center justify-center relative border-b border-gray-900 group-hover:bg-[#D4A437]/1 transition-colors">
                  <div className="p-3 bg-white rounded-2xl border border-gray-100 flex items-center justify-center w-36 h-36 shadow-md shrink-0 select-none">
                    {profile.qrCode ? (
                      <img src={profile.qrCode.dataUrl} alt="QR Code" className="w-full h-full object-contain" />
                    ) : (
                      <QrCode className="w-12 h-12 text-gray-300" />
                    )}
                  </div>
                  <span className="block text-[9px] font-mono text-gray-600 mt-3 select-all truncate max-w-full px-4">
                    {profile.qrCode?.url || 'No URL'}
                  </span>
                </div>

                {/* Profile Meta Body */}
                <div className="p-6 flex flex-col flex-1 space-y-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white truncate group-hover:text-[#D4A437] transition-colors">
                      {profile.name}
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-0.5 font-mono">/{profile.slug}</p>
                  </div>

                  {/* Badges details */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-400">
                    <div className="flex items-center gap-1.5 bg-black border border-gray-900 rounded-xl p-2">
                      <Layers className="w-3.5 h-3.5 text-[#D4A437]" />
                      <span>{profile._count.categories} Categories</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-black border border-gray-900 rounded-xl p-2">
                      <UtensilsCrossed className="w-3.5 h-3.5 text-[#D4A437]" />
                      <span>{profile._count.menuItems} Dishes</span>
                    </div>
                  </div>

                  {/* Theme Info & Date */}
                  <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1">
                    <div className="flex items-center gap-1">
                      <Palette className="w-3.5 h-3.5 text-gray-600" />
                      <span>Theme: <strong>{themeInfo?.name || 'Inherit'}</strong></span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-600" />
                      <span>{new Date(profile.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>

                  {/* Actions footer bar */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-900 gap-1.5">
                    {/* Print Standee button */}
                    <button
                      onClick={() => openPrintStudio(profile)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#D4A437]/10 hover:bg-[#D4A437]/15 border border-[#D4A437]/25 text-xs font-bold text-[#D4A437] transition-all cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Print Studio
                    </button>

                    {/* Quick copies */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => profile.qrCode && handleCopyLink(profile.id, profile.qrCode.url)}
                        title="Copy QR Scan URL"
                        className="p-2.5 rounded-xl bg-gray-950 border border-gray-900 text-gray-400 hover:text-white transition-all cursor-pointer"
                      >
                        {isCopySuccess ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {profile.qrCode && (
                        <a
                          href={`/r/${restaurantSlug}/${profile.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open Live Menu"
                          className="p-2.5 rounded-xl bg-gray-950 border border-gray-900 text-gray-400 hover:text-white transition-all cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}

                      <button
                        onClick={() => profile.qrCode && handleDownloadPNG(profile.name, profile.qrCode.dataUrl)}
                        title="Download PNG QR"
                        className="p-2.5 rounded-xl bg-gray-950 border border-gray-900 text-gray-400 hover:text-white transition-all cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PRINT TEMPLATE STUDIO MODAL */}
      {activePrintProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm no-print">
          <div className="w-full max-w-4xl bg-black border border-gray-900 rounded-3xl p-6 sm:p-8 relative flex flex-col md:flex-row gap-8 max-h-[95vh] overflow-y-auto">
            <button
              onClick={() => setActivePrintProfile(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left: Custom settings & print trigger */}
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                  <Printer className="w-6 h-6 text-[#D4A437]" />
                  QR Print Studio
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Customize the look and texts on the printable stands for profile: <strong>{activePrintProfile.name}</strong>
                </p>
              </div>

              {/* Template selector */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Choose Layout Shape
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  <button
                    onClick={() => setSelectedTemplate('TABLE_TENT')}
                    className={`text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedTemplate === 'TABLE_TENT'
                        ? 'border-[#D4A437] bg-[#D4A437]/5'
                        : 'border-gray-900 bg-transparent hover:border-gray-800'
                    }`}
                  >
                    <span className="block text-xs font-bold text-white">Table Tent (Foldable Card)</span>
                    <span className="block text-[10px] text-gray-500 mt-0.5">Dual-sided card layout. Print, fold down the center, and place on restaurant tables.</span>
                  </button>

                  <button
                    onClick={() => setSelectedTemplate('ACRYLIC_STAND')}
                    className={`text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedTemplate === 'ACRYLIC_STAND'
                        ? 'border-[#D4A437] bg-[#D4A437]/5'
                        : 'border-gray-900 bg-transparent hover:border-gray-800'
                    }`}
                  >
                    <span className="block text-xs font-bold text-white">Acrylic Table Standee (5x7)</span>
                    <span className="block text-[10px] text-gray-500 mt-0.5">Vertical menu display card, sized for standard acrylic holders.</span>
                  </button>

                  <button
                    onClick={() => setSelectedTemplate('COUNTER_CARD')}
                    className={`text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedTemplate === 'COUNTER_CARD'
                        ? 'border-[#D4A437] bg-[#D4A437]/5'
                        : 'border-gray-900 bg-transparent hover:border-gray-800'
                    }`}
                  >
                    <span className="block text-xs font-bold text-white">Counter Card (Horizontal)</span>
                    <span className="block text-[10px] text-gray-500 mt-0.5">Perfect for checkout counters, bar setups, or lobby entrances.</span>
                  </button>
                </div>
              </div>

              {/* Text settings */}
              <div className="space-y-4 pt-4 border-t border-gray-900">
                <h4 className="font-bold text-xs text-white uppercase tracking-wider">Customize Template Text</h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase mb-1">Welcome Text</label>
                    <input
                      type="text"
                      value={welcomeText}
                      onChange={(e) => setWelcomeText(e.target.value)}
                      placeholder={placeholders.welcome}
                      className="w-full bg-gray-950 border border-gray-800 focus:border-[#D4A437] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase mb-1">Instruction Text</label>
                    <input
                      type="text"
                      value={instructionText}
                      onChange={(e) => setInstructionText(e.target.value)}
                      placeholder={placeholders.instruction}
                      className="w-full bg-gray-950 border border-gray-800 focus:border-[#D4A437] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase mb-1">Footer Thank You</label>
                    <input
                      type="text"
                      value={thankYouText}
                      onChange={(e) => setThankYouText(e.target.value)}
                      placeholder={placeholders.thankYou}
                      className="w-full bg-gray-950 border border-gray-800 focus:border-[#D4A437] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Action triggers */}
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-900">
                <button
                  onClick={handlePrint}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#D4A437] to-[#B88E2F] hover:from-[#B88E2F] hover:to-[#A37B24] text-black font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Print Template (Ctrl + P)
                </button>
                <button
                  onClick={() => handleDownloadCanvasQR(activePrintProfile)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gray-950 border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#D4A437]" /> Download PNG Standee
                </button>
                <span className="block text-[9px] text-gray-600 text-center">
                  Tip: Toggle landscape mode on your printer settings when using the Table Tent card folding style.
                </span>
              </div>
            </div>

            {/* Right: Real-time preview */}
            <div className="w-full md:w-[350px] shrink-0 bg-gray-950 rounded-2xl border border-gray-900 p-6 flex items-center justify-center select-none overflow-hidden">
              {/* Standee display card mock */}
              <div className="bg-white text-black p-5 border-2 border-double border-[#D4A437] w-full max-w-[280px] aspect-[4/6] flex flex-col justify-between items-center text-center shadow-lg relative rounded">
                <div className="flex flex-col items-center">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="w-8 h-8 object-contain mb-1.5 rounded-full" />
                  ) : (
                    <ChefHat className="w-5 h-5 text-[#D4A437] mb-1" />
                  )}
                  <h4 className="font-serif font-bold text-xs uppercase tracking-wider">{restaurantName}</h4>
                  <span className="text-[8px] font-serif italic text-gray-500 leading-none">
                    {welcomeText || placeholders.welcome}
                  </span>
                </div>

                <div className="w-24 h-24 my-2 flex items-center justify-center border border-gray-100 p-1 bg-white select-none">
                  {activePrintProfile.qrCode ? (
                    <img src={activePrintProfile.qrCode.dataUrl} alt="QR Code" className="w-full h-full" />
                  ) : (
                    <QrCode className="w-8 h-8 text-gray-300" />
                  )}
                </div>

                <div className="flex flex-col items-center">
                  <p className="text-[8px] font-bold tracking-wider uppercase">{instructionText || placeholders.instruction}</p>
                  <p className="text-[7px] font-mono text-gray-400 mt-1 select-all">{activePrintProfile.qrCode?.url.replace(/https?:\/\//, '')}</p>
                  <p className="text-[7px] font-serif italic text-gray-500 mt-2 leading-none">{thankYouText || placeholders.thankYou}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINT-ONLY OUTSIDE MODAL CONTAINER (This renders in standard print view with @media print overrides) */}
      {activePrintProfile && (
        <div className="hidden print:flex justify-center bg-white text-black p-0 m-0 w-full min-h-screen items-center relative">
          {/* 1. TABLE TENT PRINT TEMPLATE */}
          {selectedTemplate === 'TABLE_TENT' && (
            <div className="bg-white text-black p-12 border-[8px] border-double border-[#D4A437] w-full max-w-[650px] aspect-[4/6] flex flex-col justify-between print-card relative">
              {/* Top Panel (Flipped 180 degrees) */}
              <div className="flex flex-col items-center justify-center border-b border-dashed border-gray-300 pb-16 rotate-180 flex-1">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-14 h-14 object-contain mb-3 rounded-full border border-gray-200" />
                ) : (
                  <ChefHat className="w-10 h-10 text-[#D4A437] mb-2" />
                )}
                <h4 className="font-serif font-bold text-xl uppercase tracking-wider">{restaurantName}</h4>
                <span className="text-xs font-serif italic text-gray-500 mt-1">{welcomeText || placeholders.welcome}</span>
                <div className="w-32 h-32 my-4 flex items-center justify-center border border-gray-100 p-1.5 bg-white shadow-sm">
                  <img src={activePrintProfile.qrCode?.dataUrl} alt="QR Code" className="w-full h-full" />
                </div>
                <p className="text-xs font-bold tracking-wider uppercase">{instructionText || placeholders.instruction}</p>
                <p className="text-[10px] font-mono text-gray-400 mt-1">{activePrintProfile.qrCode?.url.replace(/https?:\/\//, '')}</p>
              </div>

              {/* Bottom Panel */}
              <div className="flex flex-col items-center justify-center pt-16 flex-1">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-14 h-14 object-contain mb-3 rounded-full border border-gray-200" />
                ) : (
                  <ChefHat className="w-10 h-10 text-[#D4A437] mb-2" />
                )}
                <h4 className="font-serif font-bold text-xl uppercase tracking-wider">{restaurantName}</h4>
                <span className="text-xs font-serif italic text-gray-500 mt-1">{welcomeText || placeholders.welcome}</span>
                <div className="w-32 h-32 my-4 flex items-center justify-center border border-gray-100 p-1.5 bg-white shadow-sm">
                  <img src={activePrintProfile.qrCode?.dataUrl} alt="QR Code" className="w-full h-full" />
                </div>
                <p className="text-xs font-bold tracking-wider uppercase">{instructionText || placeholders.instruction}</p>
                <p className="text-[10px] font-mono text-gray-400 mt-1">{activePrintProfile.qrCode?.url.replace(/https?:\/\//, '')}</p>
              </div>
            </div>
          )}

          {/* 2. ACRYLIC STAND TEMPLATE */}
          {selectedTemplate === 'ACRYLIC_STAND' && (
            <div className="bg-white text-black p-12 border-[12px] border-double border-[#D4A437] w-full max-w-[450px] aspect-[5/7] flex flex-col justify-between items-center text-center print-card">
              <div className="flex flex-col items-center">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-16 h-16 object-contain mb-4 rounded-full border border-gray-200" />
                ) : (
                  <ChefHat className="w-10 h-10 text-[#D4A437] mb-2" />
                )}
                <h4 className="font-serif font-bold text-2xl uppercase tracking-wider">{restaurantName}</h4>
                <span className="text-sm font-serif italic text-gray-500 mt-1.5">{welcomeText || placeholders.welcome}</span>
              </div>

              <div className="w-48 h-48 my-6 flex items-center justify-center border border-gray-100 p-2 bg-white shadow-sm">
                <img src={activePrintProfile.qrCode?.dataUrl} alt="QR Code" className="w-full h-full" />
              </div>

              <div className="flex flex-col items-center">
                <p className="text-sm font-bold tracking-wider uppercase">{instructionText || placeholders.instruction}</p>
                <p className="text-[10px] font-mono text-gray-400 mt-1.5">{activePrintProfile.qrCode?.url.replace(/https?:\/\//, '')}</p>
                <div className="w-40 border-t border-gray-200 my-4" />
                <p className="text-xs font-serif italic text-gray-500">{thankYouText || placeholders.thankYou}</p>
              </div>
            </div>
          )}

          {/* 3. COUNTER CARD TEMPLATE */}
          {selectedTemplate === 'COUNTER_CARD' && (
            <div className="bg-white text-black p-12 border-[12px] border-double border-[#D4A437] w-full max-w-[650px] aspect-[7/5] flex flex-row justify-between items-center print-card text-left">
              <div className="flex-1 pr-6 flex flex-col justify-between h-full py-4">
                <div>
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="w-16 h-16 object-contain mb-4 rounded-full border border-gray-200" />
                  ) : (
                    <ChefHat className="w-12 h-12 text-[#D4A437] mb-2" />
                  )}
                  <h4 className="font-serif font-bold text-3xl uppercase tracking-wider">{restaurantName}</h4>
                  <p className="text-sm font-serif italic text-gray-500 mt-2">{welcomeText || placeholders.welcome}</p>
                </div>

                <div className="pt-6">
                  <p className="text-sm font-bold tracking-wider uppercase">{instructionText || placeholders.instruction}</p>
                  <p className="text-xs font-mono text-gray-400 mt-1.5">{activePrintProfile.qrCode?.url.replace(/https?:\/\//, '')}</p>
                  <div className="w-32 border-t border-gray-200 my-4" />
                  <p className="text-xs font-serif italic text-gray-500 leading-none">{thankYouText || placeholders.thankYou}</p>
                </div>
              </div>

              <div className="w-56 h-56 flex items-center justify-center border border-gray-100 p-2.5 bg-white shadow-sm shrink-0">
                <img src={activePrintProfile.qrCode?.dataUrl} alt="QR Code" className="w-full h-full" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
