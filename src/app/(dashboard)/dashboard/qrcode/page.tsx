'use client';

import { useState, useEffect, useRef } from 'react';
import {
  QrCode,
  Search,
  SlidersHorizontal,
  Printer,
  Download,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Palette,
  Clock,
  FileText,
  ChefHat,
  X,
  Lock,
  Loader2,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { THEME_LIST } from '@/lib/theme-config';

interface MenuProfile {
  id: string;
  name: string;
  slug: string;
  theme: string | null;
  status: boolean;
  updatedAt: string;
  _count: {
    categories: number;
    menuItems: number;
  };
  qrCode?: {
    id: string;
    url: string;
    dataUrl: string;
  } | null;
}

type TemplateType = 'TABLE_TENT' | 'ACRYLIC_STAND' | 'COUNTER_CARD';

export default function QRCodePage() {
  const [profiles, setProfiles] = useState<MenuProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantSlug, setRestaurantSlug] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  // Filters & Searching
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'updatedAt' | 'name' | 'itemsCount' | 'categoriesCount'>('updatedAt');

  // Sort Dropdown States
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortOptions = [
    { value: 'updatedAt', label: 'Last Updated' },
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'itemsCount', label: 'Dishes Count' },
    { value: 'categoriesCount', label: 'Categories Count' }
  ];

  // Copy URL state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Print Studio States
  const [activePrintProfile, setActivePrintProfile] = useState<MenuProfile | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('ACRYLIC_STAND');
  const [welcomeText, setWelcomeText] = useState('');
  const [instructionText, setInstructionText] = useState('');
  const [thankYouText, setThankYouText] = useState('');

  async function loadData() {
    try {
      // Load restaurant details
      const profileRes = await fetch('/api/profile');
      if (profileRes.ok) {
        const rData = await profileRes.json();
        setRestaurantName(rData.name || '');
        setRestaurantSlug(rData.slug || '');
        setLogoUrl(rData.logo || '');
      }

      // Load menu profiles
      const res = await fetch('/api/menu-profiles');
      if (!res.ok) throw new Error('Failed to load menu profiles');
      const data = await res.json();
      setProfiles(data.profiles || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleCopyLink = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleDownloadPNG = (profileName: string, dataUrl: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${restaurantName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${profileName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Centered PDF print window generator (Issue 2)
  const handleDownloadPDF = (profile: MenuProfile) => {
    if (!profile.qrCode) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>${restaurantName} - ${profile.name} QR Code</title>
          <style>
            body {
              font-family: 'Georgia', serif;
              text-align: center;
              margin: 0;
              padding: 50px;
              background: #fff;
              color: #000;
            }
            .container {
              max-width: 500px;
              margin: 40px auto;
              border: 4px double #D4A437;
              padding: 40px;
              border-radius: 8px;
            }
            .logo {
              width: 80px;
              height: 80px;
              border-radius: 50%;
              object-fit: cover;
              margin-bottom: 15px;
              border: 2px solid #D4A437;
            }
            h1 {
              font-size: 28px;
              margin: 0 0 5px 0;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            .area {
              font-size: 14px;
              color: #666;
              margin-bottom: 30px;
              text-transform: uppercase;
            }
            .qr-box {
              width: 250px;
              height: 250px;
              margin: 0 auto 30px auto;
              padding: 10px;
              border: 1px solid #eee;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .qr-box img {
              width: 100%;
              height: 100%;
            }
            .instruction {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 10px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .url {
              font-family: monospace;
              font-size: 12px;
              color: #888;
            }
          </style>
        </head>
        <body>
          <div class="container">
            ${logoUrl ? `<img class="logo" src="${logoUrl}" alt="Logo" />` : ''}
            <h1>${restaurantName}</h1>
            <div class="area">Dining Area: ${profile.name}</div>
            <div class="qr-box">
              <img src="${profile.qrCode.dataUrl}" alt="QR" />
            </div>
            <div class="instruction">Scan to View Menu</div>
            <div class="url">${profile.qrCode.url.replace(/https?:\/\//, '')}</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Canvas Standee Template builder (with security taint handles - Issue 1)
  const handleDownloadCanvasQR = async (profile: MenuProfile) => {
    try {
      if (!profile.qrCode) return;
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 1200;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Draw gradient background
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
          if (!src.startsWith('data:')) {
            img.crossOrigin = 'anonymous';
          }
          img.src = src;
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
        });
      };

      const [logoImg, qrImg] = await Promise.all([
        loadImage(logoUrl),
        loadImage(profile.qrCode.dataUrl)
      ]);

      const placeholders = getPlaceholders(selectedTemplate);
      const welcome = welcomeText || placeholders.welcome;
      const instruction = instructionText || placeholders.instruction;
      const thankYou = thankYouText || placeholders.thankYou;

      // Draw restaurant details text headings
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 44px Georgia, Garamond, serif';
      ctx.textAlign = 'center';
      ctx.fillText(restaurantName, 400, 285);

      ctx.strokeStyle = 'rgba(212, 164, 55, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(280, 315);
      ctx.lineTo(520, 315);
      ctx.stroke();

      ctx.fillStyle = '#E8C163';
      ctx.font = 'italic 26px Georgia, serif';
      ctx.fillText(welcome, 400, 360);

      // QR box background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(225, 435, 350, 350);

      if (qrImg) {
        ctx.drawImage(qrImg, 240, 450, 320, 320);
      }

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(instruction, 400, 840);

      ctx.fillStyle = '#E8C163';
      ctx.font = '500 20px monospace';
      ctx.fillText(profile.qrCode.url.replace(/https?:\/\//, ''), 400, 890);

      ctx.fillStyle = '#8C8C8C';
      ctx.font = 'italic 22px Georgia, serif';
      ctx.fillText(thankYou, 400, 1050);

      // Draw logo inside try/catch to avoid canvas security tainting block issues
      let dataUrl = '';
      try {
        if (logoImg) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(400, 180, 53, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(logoImg, 347, 127, 106, 106);
          ctx.restore();

          ctx.beginPath();
          ctx.arc(400, 180, 55, 0, Math.PI * 2);
          ctx.strokeStyle = '#D4A437';
          ctx.lineWidth = 3;
          ctx.stroke();
          ctx.closePath();
        } else {
          ctx.fillStyle = '#D4A437';
          ctx.font = 'bold 45px serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(restaurantName.charAt(0).toUpperCase() || 'R', 400, 180);
        }
        dataUrl = canvas.toDataURL('image/png');
      } catch (taintError) {
        console.warn('Canvas tainted, fallback mode: monogram text logo');
        // Clear logo area and draw monogram text
        ctx.fillStyle = '#1A1510';
        ctx.beginPath();
        ctx.arc(400, 180, 56, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#D4A437';
        ctx.font = 'bold 45px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(restaurantName.charAt(0).toUpperCase() || 'R', 400, 180);

        dataUrl = canvas.toDataURL('image/png');
      }

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${restaurantName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${profile.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-standee.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Canvas Standee generate error:', err);
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
          welcome: 'Fresh & Hygienic',
          instruction: 'Scan to view digital menu card',
          thankYou: 'Dine-in Contactless Experience',
        };
      case 'COUNTER_CARD':
      default:
        return {
          welcome: 'Scan & Browse',
          thankYou: 'Digital Menu View — No waiter download needed',
          instruction: 'Scan to View Menu',
        };
    }
  };

  const placeholders = getPlaceholders(selectedTemplate);

  const openPrintStudio = (profile: MenuProfile) => {
    setActivePrintProfile(profile);
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
        <div className="relative shrink-0 text-left w-full sm:w-auto" ref={sortDropdownRef}>
          <button
            type="button"
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            className="w-full sm:w-52 flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-black border border-gray-800 text-xs font-semibold text-gray-300 hover:text-white hover:border-[#D4A437]/30 transition-all cursor-pointer select-none"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <span className="text-[#D4A437] font-bold">
                Sort by: {sortOptions.find(o => o.value === sortBy)?.label || 'Sort Options'}
              </span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-gray-550 transition-transform ${isSortDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSortDropdownOpen && (
            <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-full sm:w-52 bg-[#0D0D0F] border border-white/[0.06] rounded-2xl shadow-2xl shadow-black/80 z-50 p-2 space-y-1">
              {sortOptions.map((opt) => {
                const isSelected = opt.value === sortBy;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setSortBy(opt.value as any);
                      setIsSortDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#D4A437]/10 text-[#D4A437]'
                        : 'text-gray-400 hover:bg-white/[0.01] hover:text-white'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#D4A437]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Grid of Profile QR Cards (Issue 2 redesign) */}
      {processedProfiles.length === 0 ? (
        <div className="text-center py-20 bg-gray-950/20 border border-gray-900/60 rounded-3xl no-print">
          <QrCode className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <h3 className="font-serif text-lg font-bold text-white mb-1">No Profiles Found</h3>
          <p className="text-gray-500 text-xs">Create dining profiles first under the Profiles manager.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 no-print">
          {processedProfiles.map((profile) => {
            const themeInfo = getThemeInfo(profile.theme);
            const isCopySuccess = copiedId === profile.id;
            return (
              <div
                key={profile.id}
                className="group glass rounded-3xl overflow-hidden border border-gray-900 hover:border-[#D4A437]/20 transition-all duration-300 flex flex-col bg-gray-950/25"
              >
                {/* Large QR Preview block (Issue 2 fix) */}
                <div className="p-6 bg-black flex flex-col items-center justify-center relative border-b border-gray-900/60 group-hover:bg-[#D4A437]/1 transition-colors min-h-[220px]">
                  <div className="p-4 bg-white rounded-2xl border border-gray-200 flex items-center justify-center w-40 h-40 shadow-xl shrink-0 select-none relative group-hover:scale-[1.02] transition-transform">
                    {profile.qrCode ? (
                      <img src={profile.qrCode.dataUrl} alt="QR Code" className="w-full h-full object-contain" />
                    ) : (
                      <QrCode className="w-16 h-16 text-gray-300" />
                    )}
                  </div>
                  <span className="block text-[9px] font-mono text-gray-600 mt-4 select-all truncate max-w-full px-4">
                    {profile.qrCode?.url || 'No URL'}
                  </span>
                </div>

                {/* Profile Meta Body */}
                <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      {logoUrl ? (
                        <img src={logoUrl} alt="Logo" className="w-5 h-5 rounded-full object-cover border border-gray-900" />
                      ) : (
                        <ChefHat className="w-4 h-4 text-[#D4A437]" />
                      )}
                      <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Dining Area</span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-white truncate group-hover:text-[#D4A437] transition-colors">
                      {profile.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 font-mono">/{profile.slug}</p>
                  </div>

                  {/* Categories & Dishes Count */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-400">
                    <div className="flex items-center gap-1.5 bg-black/60 border border-gray-900 rounded-xl p-2.5">
                      <Layers className="w-3.5 h-3.5 text-[#D4A437]" />
                      <span>{profile._count.categories} Categories</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/60 border border-gray-900 rounded-xl p-2.5">
                      <ChefHat className="w-3.5 h-3.5 text-[#D4A437]" />
                      <span>{profile._count.menuItems} Dishes</span>
                    </div>
                  </div>

                  {/* Theme Info & Date */}
                  <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1">
                    <div className="flex items-center gap-1">
                      <Palette className="w-3.5 h-3.5 text-gray-600" />
                      <span>Theme: <strong>{themeInfo?.name || 'Inherited Default'}</strong></span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-600" />
                      <span>{new Date(profile.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>

                  {/* Actions footer bar (Redesigned with required buttons) */}
                  <div className="flex flex-col gap-2 pt-4 border-t border-gray-900">
                    <div className="flex items-center gap-2">
                      {/* Print Studio trigger */}
                      <button
                        onClick={() => openPrintStudio(profile)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#D4A437]/10 hover:bg-[#D4A437]/15 border border-[#D4A437]/25 text-xs font-bold text-[#D4A437] transition-all cursor-pointer"
                        title="Open Print Standee Studio"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Print Studio
                      </button>

                      {/* Download PDF button (Issue 2) */}
                      <button
                        onClick={() => handleDownloadPDF(profile)}
                        className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white transition-all cursor-pointer"
                        title="Download PDF QR"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 justify-end">
                      {/* Download PNG QR */}
                      <button
                        onClick={() => profile.qrCode && handleDownloadPNG(profile.name, profile.qrCode.dataUrl)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
                        title="Download PNG QR"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download PNG
                      </button>

                      {/* Copy Link */}
                      <button
                        onClick={() => profile.qrCode && handleCopyLink(profile.id, profile.qrCode.url)}
                        title="Copy QR Scan URL"
                        className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white transition-all cursor-pointer"
                      >
                        {isCopySuccess ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Preview Live Menu */}
                      {profile.qrCode && (
                        <a
                          href={`/r/${restaurantSlug}/${profile.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open Live Menu"
                          className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white transition-all cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
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
          <div className="w-full max-w-4xl bg-black border border-gray-900 rounded-3xl p-4 sm:p-6 md:p-8 relative flex flex-col md:flex-row gap-6 md:gap-8 max-h-[95vh] overflow-y-auto">
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
                  <Printer className="w-6 h-6 text-[#D4A437]" /> Print Standee Studio
                </h3>
                <p className="text-gray-500 text-xs mt-1">
                  Customize table tents, counter cards, and acrylic stands for <strong>{activePrintProfile.name}</strong>
                </p>
              </div>

              {/* Template Selection */}
              <div className="space-y-3">
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Folding Standee Style</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { key: 'TABLE_TENT', name: 'Table Tent', desc: 'Folds in half' },
                    { key: 'ACRYLIC_STAND', name: 'Acrylic Stand', desc: 'Standard portrait' },
                    { key: 'COUNTER_CARD', name: 'Counter Card', desc: 'Landscape table stand' }
                  ].map((tpl) => (
                    <div
                      key={tpl.key}
                      onClick={() => setSelectedTemplate(tpl.key as TemplateType)}
                      className={`p-3 rounded-xl border-2 text-center cursor-pointer transition-all ${
                        selectedTemplate === tpl.key
                          ? 'border-[#D4A437] bg-[#D4A437]/5 text-white'
                          : 'border-gray-900 bg-black text-gray-400 hover:border-gray-800'
                      }`}
                    >
                      <span className="block text-xs font-bold">{tpl.name}</span>
                      <span className="block text-[8px] text-gray-500 mt-0.5 leading-none">{tpl.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inputs */}
              <div className="space-y-4 pt-2 border-t border-gray-900/60">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase mb-1">Header Subtitle Override</label>
                    <input
                      type="text"
                      value={welcomeText}
                      onChange={(e) => setWelcomeText(e.target.value)}
                      placeholder={placeholders.welcome}
                      className="w-full bg-gray-950 border border-gray-800 focus:border-[#D4A437] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase mb-1">Diner Instruction Override</label>
                    <input
                      type="text"
                      value={instructionText}
                      onChange={(e) => setInstructionText(e.target.value)}
                      placeholder={placeholders.instruction}
                      className="w-full bg-gray-950 border border-gray-800 focus:border-[#D4A437] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
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
              </div>
            </div>

            {/* Right: Real-time preview */}
            <div className="w-full md:w-[350px] shrink-0 bg-gray-950 rounded-2xl border border-gray-900 p-6 flex items-center justify-center select-none overflow-hidden">
              {/* Standee display card mock */}
              <div className="bg-white text-black p-6 border-4 border-double border-[#D4A437] w-full max-w-[280px] aspect-[4/6] flex flex-col justify-between items-center text-center shadow-lg relative rounded">
                <div className="flex flex-col items-center">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="w-9 h-9 object-cover mb-1.5 rounded-full border border-gray-200" />
                  ) : (
                    <ChefHat className="w-5 h-5 text-[#D4A437] mb-1" />
                  )}
                  <h4 className="font-serif font-bold text-sm uppercase tracking-wider">{restaurantName}</h4>
                  <span className="text-[9px] font-serif italic text-gray-500 leading-none mt-0.5">
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
                  <p className="text-[9px] font-bold tracking-wider uppercase">{instructionText || placeholders.instruction}</p>
                  <p className="text-[7px] font-mono text-gray-400 mt-1 select-all">{activePrintProfile.qrCode?.url.replace(/https?:\/\//, '')}</p>
                  <p className="text-[8px] font-serif italic text-gray-500 mt-2 leading-none">{thankYouText || placeholders.thankYou}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINT-ONLY CONTAINER */}
      {activePrintProfile && (
        <div className="hidden print:flex justify-center bg-white text-black p-0 m-0 w-full min-h-screen items-center relative">
          {/* 1. TABLE TENT PRINT TEMPLATE */}
          {selectedTemplate === 'TABLE_TENT' && (
            <div className="bg-white text-black p-12 border-[8px] border-double border-[#D4A437] w-full max-w-[650px] aspect-[4/6] flex flex-col justify-between print-card relative">
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
