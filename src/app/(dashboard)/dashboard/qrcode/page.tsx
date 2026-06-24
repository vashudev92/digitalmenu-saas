'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { QrCode, Copy, Check, Download, Printer, Loader2, ArrowUpRight, ChefHat } from 'lucide-react';

type TemplateType = 'TABLE_TENT' | 'ACRYLIC_STAND' | 'COUNTER_CARD';

export default function QRCodePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('TABLE_TENT');
  
  // DB QR states
  const [restaurantName, setRestaurantName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [scanUrl, setScanUrl] = useState('');
  const [qrBase64, setQrBase64] = useState('');

  useEffect(() => {
    async function loadQRCode() {
      try {
        const res = await fetch('/api/qr');
        const profileRes = await fetch('/api/profile');
        
        if (!res.ok || !profileRes.ok) throw new Error('Failed to load QR details');
        
        const data = await res.json();
        const profileData = await profileRes.json();
        
        setScanUrl(data.url);
        setQrBase64(data.dataUrl);
        setRestaurantName(profileData.name);
        setLogoUrl(profileData.logo || '');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadQRCode();
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(scanUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPNG = () => {
    const link = document.createElement('a');
    link.href = qrBase64;
    link.download = `${restaurantName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#D4A437]" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Info */}
      <div className="no-print">
        <h1 className="font-serif text-3xl font-bold flex items-center gap-2">
          <QrCode className="w-8 h-8 text-[#D4A437]" /> QR Code Manager
        </h1>
        <p className="text-gray-400 text-sm mt-1">Generate, preview, and print physical QR code displays for your guest tables.</p>
      </div>

      {/* Main Settings Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start no-print">
        {/* QR Code Card */}
        <div className="md:col-span-1 glass p-6 rounded-3xl flex flex-col items-center text-center">
          <h3 className="font-bold text-lg mb-4 text-white">QR Code Preview</h3>
          <div className="p-4 bg-white rounded-2xl border border-gray-100 flex items-center justify-center w-full max-w-[200px] aspect-square shadow-lg">
            {qrBase64 ? (
              <img src={qrBase64} alt="QR Code" className="w-full h-full object-contain" />
            ) : (
              <QrCode className="w-16 h-16 text-gray-300" />
            )}
          </div>
          <span className="text-xs text-gray-500 font-semibold tracking-wider uppercase mt-4">Permanent Link</span>
          <p className="text-sm text-[#D4A437] font-semibold select-all mt-1 truncate max-w-full px-4">{scanUrl}</p>
          
          <div className="flex flex-col gap-2 w-full mt-6">
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-800 hover:border-[#D4A437] hover:bg-[#D4A437]/5 text-gray-300 hover:text-white text-sm font-semibold transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" /> Link Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copy Scan URL
                </>
              )}
            </button>

            <button
              onClick={handleDownloadPNG}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#D4A437] to-[#B88E2F] hover:from-[#B88E2F] hover:to-[#A37B24] text-black text-sm font-bold shadow-[0_0_10px_rgba(212,164,55,0.15)] transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download PNG
            </button>
          </div>
        </div>

        {/* Template Settings & Actions */}
        <div className="md:col-span-2 glass p-6 sm:p-8 rounded-3xl space-y-6">
          <h3 className="font-serif text-2xl font-bold mb-4">Print Template Studio</h3>
          
          <div className="space-y-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
              Select Display Template
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setSelectedTemplate('TABLE_TENT')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedTemplate === 'TABLE_TENT'
                    ? 'border-[#D4A437] bg-[#D4A437]/10 text-white'
                    : 'border-gray-800 bg-[#0d0d0d] text-gray-400 hover:border-gray-700 hover:text-white'
                }`}
              >
                <span className="block font-bold text-sm">Table Tent</span>
                <span className="block text-[10px] text-gray-500 mt-1">Foldable 4x6 self-standing card with dual panels.</span>
              </button>

              <button
                onClick={() => setSelectedTemplate('ACRYLIC_STAND')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedTemplate === 'ACRYLIC_STAND'
                    ? 'border-[#D4A437] bg-[#D4A437]/10 text-white'
                    : 'border-gray-800 bg-[#0d0d0d] text-gray-400 hover:border-gray-700 hover:text-white'
                }`}
              >
                <span className="block font-bold text-sm">Acrylic Stand</span>
                <span className="block text-[10px] text-gray-500 mt-1">5x7 vertical card template with gold border designs.</span>
              </button>

              <button
                onClick={() => setSelectedTemplate('COUNTER_CARD')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedTemplate === 'COUNTER_CARD'
                    ? 'border-[#D4A437] bg-[#D4A437]/10 text-white'
                    : 'border-gray-800 bg-[#0d0d0d] text-gray-400 hover:border-gray-700 hover:text-white'
                }`}
              >
                <span className="block font-bold text-sm">Counter Card</span>
                <span className="block text-[10px] text-gray-500 mt-1">Horizontal layout card for front counters or bars.</span>
              </button>
            </div>
          </div>

          <div className="border-t border-gray-900 pt-6">
            <button
              onClick={handlePrint}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-gray-800 hover:border-[#D4A437] hover:bg-[#D4A437]/5 text-gray-300 hover:text-white text-base font-semibold shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-5 h-5 text-[#D4A437]" /> Print Selected Template (Ctrl + P)
            </button>
            <span className="block text-[10px] text-gray-500 text-center mt-2.5">
              Tips: Set your browser print options to 'Landscape' for Table Tent and hide 'Headers and Footers' for high-quality card layout.
            </span>
          </div>
        </div>
      </div>

      {/* PRINT-ONLY AND PREVIEW CONTAINER */}
      <div className="flex justify-center bg-gray-950 p-6 sm:p-12 rounded-3xl border border-gray-900 print-layout no-shadow-print no-bg-print">
        
        {/* 1. TABLE TENT TEMPLATE */}
        {selectedTemplate === 'TABLE_TENT' && (
          <div className="bg-white text-black p-8 border-4 border-double border-[#D4A437] w-full max-w-[650px] aspect-[4/6] flex flex-col justify-between print-card relative shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            {/* Top Panel (Flipped 180 degrees for foldover upright displays) */}
            <div className="flex flex-col items-center justify-center border-b border-dashed border-gray-300 pb-12 rotate-180 flex-1">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-12 h-12 object-contain mb-3 rounded-full" />
              ) : (
                <ChefHat className="w-8 h-8 text-[#D4A437] mb-2" />
              )}
              <h4 className="font-serif font-bold text-lg">{restaurantName}</h4>
              <span className="text-[10px] font-serif italic text-gray-500">Fine Dining Menu</span>
              <div className="w-28 h-28 my-3 flex items-center justify-center border border-gray-200 p-1">
                {qrBase64 && <img src={qrBase64} alt="QR Code" className="w-full h-full" />}
              </div>
              <p className="text-[10px] font-bold tracking-wider uppercase">Scan QR Code to Browse Menu</p>
            </div>

            {/* FOLD LINE */}
            <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-[#D4A437]/45 text-center -translate-y-1/2 no-print select-none">
              <span className="bg-white text-gray-400 text-[9px] uppercase px-3 tracking-widest font-semibold">FOLD LINE</span>
            </div>

            {/* Bottom Panel */}
            <div className="flex flex-col items-center justify-center pt-12 flex-1">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-12 h-12 object-contain mb-3 rounded-full" />
              ) : (
                <ChefHat className="w-8 h-8 text-[#D4A437] mb-2" />
              )}
              <h4 className="font-serif font-bold text-lg">{restaurantName}</h4>
              <span className="text-[10px] font-serif italic text-gray-500">Fine Dining Menu</span>
              <div className="w-28 h-28 my-3 flex items-center justify-center border border-gray-200 p-1">
                {qrBase64 && <img src={qrBase64} alt="QR Code" className="w-full h-full" />}
              </div>
              <p className="text-[10px] font-bold tracking-wider uppercase">Scan QR Code to Browse Menu</p>
            </div>
          </div>
        )}

        {/* 2. ACRYLIC STAND TEMPLATE */}
        {selectedTemplate === 'ACRYLIC_STAND' && (
          <div className="bg-white text-black p-10 border-8 border-double border-[#D4A437] w-full max-w-[450px] aspect-[5/7] flex flex-col justify-between items-center text-center print-card shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col items-center">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-16 h-16 object-contain mb-4 rounded-full" />
              ) : (
                <ChefHat className="w-10 h-10 text-[#D4A437] mb-2" />
              )}
              <h3 className="font-serif font-bold text-2xl tracking-wide">{restaurantName}</h3>
              <div className="w-20 border-t border-[#D4A437] my-3" />
              <p className="text-xs text-gray-500 tracking-widest uppercase font-semibold">Welcome to Our Table</p>
            </div>

            <div className="my-8 flex flex-col items-center">
              <div className="p-3 bg-white border-2 border-gray-100 rounded-2xl shadow-md w-40 h-40 flex items-center justify-center">
                {qrBase64 && <img src={qrBase64} alt="QR Code" className="w-full h-full object-contain" />}
              </div>
              <p className="text-xs font-bold tracking-widest uppercase mt-6 text-[#D4A437] font-serif">Scan QR to View Menu</p>
              <p className="text-[10px] text-gray-400 mt-1 max-w-[200px]">No download or registration required.</p>
            </div>

            <div className="text-[10px] text-gray-500 italic">
              Thank you for dining with us!
            </div>
          </div>
        )}

        {/* 3. COUNTER CARD TEMPLATE */}
        {selectedTemplate === 'COUNTER_CARD' && (
          <div className="bg-white text-black p-10 border-4 border-[#D4A437] w-full max-w-[650px] aspect-[7/4] flex justify-between items-center print-card shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col items-start max-w-[60%] text-left">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-16 h-16 object-contain mb-4 rounded-full" />
              ) : (
                <ChefHat className="w-10 h-10 text-[#D4A437] mb-2" />
              )}
              <h3 className="font-serif font-bold text-2xl tracking-wide">{restaurantName}</h3>
              <p className="text-sm text-gray-500 mt-2">Welcome! Scan the QR code to explore our gourmet menu offerings directly on your mobile device.</p>
              <div className="w-16 border-t border-[#D4A437] my-4" />
              <span className="text-[10px] text-gray-400 italic">Digital Menu Viewer - No Cart Checkout Needed</span>
            </div>

            <div className="flex flex-col items-center shrink-0">
              <div className="p-3 bg-white border border-gray-200 rounded-2xl shadow-md w-36 h-36 flex items-center justify-center">
                {qrBase64 && <img src={qrBase64} alt="QR Code" className="w-full h-full object-contain" />}
              </div>
              <span className="text-[10px] font-bold tracking-widest uppercase mt-4 text-[#D4A437] font-serif">Scan & Browse</span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
