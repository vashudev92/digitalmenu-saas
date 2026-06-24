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
  
  // Custom template texts
  const [welcomeText, setWelcomeText] = useState('');
  const [instructionText, setInstructionText] = useState('');
  const [thankYouText, setThankYouText] = useState('');

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

  const getPlaceholders = () => {
    switch (selectedTemplate) {
      case 'TABLE_TENT':
        return {
          welcome: 'Fine Dining Menu',
          instruction: 'Scan QR Code to Browse Menu',
          thankYou: 'Thank you for dining with us!',
        };
      case 'ACRYLIC_STAND':
        return {
          welcome: 'Welcome to Our Table',
          instruction: 'Scan QR to View Menu',
          thankYou: 'Thank you for dining with us!',
        };
      case 'COUNTER_CARD':
        return {
          welcome: 'Welcome! Scan the QR code to explore our gourmet menu offerings.',
          instruction: 'Scan & Browse',
          thankYou: 'Digital Menu Viewer - No Cart Checkout Needed',
        };
      default:
        return {
          welcome: 'Welcome to Our Table',
          instruction: 'Scan QR to View Menu',
          thankYou: 'Thank you for dining with us!',
        };
    }
  };

  const placeholders = getPlaceholders();

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

  const handleDownloadQR = async () => {
    try {
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

      // 2. Draw gold double borders
      // Outer border
      ctx.strokeStyle = '#D4A437';
      ctx.lineWidth = 4;
      ctx.strokeRect(18, 18, 800 - 36, 1200 - 36);
      // Inner border
      ctx.strokeStyle = '#D4A437';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(28, 28, 800 - 56, 1200 - 56);

      // Helper function to load images with crossOrigin support
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

      // Load logo and QR code images
      const [logoImg, qrImg] = await Promise.all([
        loadImage(logoUrl),
        loadImage(qrBase64)
      ]);

      // 3. Draw logo container circle
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
        // Draw elegant placeholder fallback letter
        ctx.fillStyle = '#D4A437';
        ctx.font = 'bold 45px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(restaurantName.charAt(0).toUpperCase() || 'R', 400, 180);
      }
      ctx.restore();

      // 4. Draw Restaurant Name
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 44px Georgia, Garamond, serif';
      ctx.textAlign = 'center';
      ctx.fillText(restaurantName, 400, 285);

      // 5. Draw Gold Divider line
      ctx.strokeStyle = 'rgba(212, 164, 55, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(280, 315);
      ctx.lineTo(520, 315);
      ctx.stroke();

      // 6. Draw Welcome Text
      const welcomeTextVal = welcomeText || placeholders.welcome;
      const instructionTextVal = instructionText || placeholders.instruction;
      const thankYouTextVal = thankYouText || placeholders.thankYou;

      ctx.fillStyle = '#E8C163';
      ctx.font = 'italic 26px Georgia, serif';
      ctx.textAlign = 'center';
      
      // Handle potential long welcome texts for counter template by splitting it or wrapping it
      if (welcomeTextVal.length > 40) {
        const words = welcomeTextVal.split(' ');
        let line1 = '';
        let line2 = '';
        for (let i = 0; i < words.length; i++) {
          if ((line1 + words[i]).length < 35) {
            line1 += words[i] + ' ';
          } else {
            line2 += words[i] + ' ';
          }
        }
        ctx.fillText(line1.trim(), 400, 360);
        ctx.fillText(line2.trim(), 400, 395);
      } else {
        ctx.fillText(welcomeTextVal, 400, 375);
      }

      // 7. Draw QR Code Card (White Container)
      ctx.save();
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 25;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 12;

      // Rounded rectangle function
      const drawRoundRect = (x: number, y: number, w: number, h: number, r: number) => {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        ctx.fill();
      };
      drawRoundRect(220, 450, 360, 360, 24);
      ctx.restore();

      // Draw QR code inside white card
      if (qrImg) {
        ctx.drawImage(qrImg, 250, 480, 300, 300);
      }

      // 8. Draw Instruction Text
      ctx.fillStyle = '#D4A437';
      ctx.font = 'bold 30px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText(instructionTextVal, 400, 890);

      // Sub-instruction
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '16px sans-serif';
      ctx.fillText('No app download or registration required.', 400, 930);

      // Gold Accent Divider
      ctx.fillStyle = '#D4A437';
      ctx.beginPath();
      ctx.moveTo(395, 970);
      ctx.lineTo(400, 965);
      ctx.lineTo(405, 970);
      ctx.lineTo(400, 975);
      ctx.closePath();
      ctx.fill();
      
      ctx.strokeStyle = 'rgba(212, 164, 55, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(250, 970);
      ctx.lineTo(380, 970);
      ctx.moveTo(420, 970);
      ctx.lineTo(550, 970);
      ctx.stroke();

      // 9. Draw Thank You Text
      ctx.fillStyle = '#9CA3AF';
      ctx.font = 'italic 22px Georgia, serif';
      ctx.fillText(thankYouTextVal, 400, 1040);

      // 10. Trigger download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${restaurantName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-standee.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error generating QR Standee Canvas:', err);
      handleDownloadPNG();
    }
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
              onClick={handleDownloadQR}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#D4A437] to-[#B88E2F] hover:from-[#B88E2F] hover:to-[#A37B24] text-black text-sm font-bold shadow-[0_0_10px_rgba(212,164,55,0.15)] transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download QR
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

          {/* Edit Template Text Fields */}
          <div className="border-t border-gray-900 pt-6 space-y-4">
            <h4 className="font-bold text-sm text-white">Customize Template Text</h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Welcome / Heading Text
                </label>
                <input
                  type="text"
                  value={welcomeText}
                  onChange={(e) => setWelcomeText(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  placeholder={placeholders.welcome}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Scan Instruction Text
                </label>
                <input
                  type="text"
                  value={instructionText}
                  onChange={(e) => setInstructionText(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  placeholder={placeholders.instruction}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Footer / Thank You Text
                </label>
                <input
                  type="text"
                  value={thankYouText}
                  onChange={(e) => setThankYouText(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  placeholder={placeholders.thankYou}
                />
              </div>
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
              <span className="text-[10px] font-serif italic text-gray-500">{welcomeText || placeholders.welcome}</span>
              <div className="w-28 h-28 my-3 flex items-center justify-center border border-gray-200 p-1">
                {qrBase64 && <img src={qrBase64} alt="QR Code" className="w-full h-full" />}
              </div>
              <p className="text-[10px] font-bold tracking-wider uppercase">{instructionText || placeholders.instruction}</p>
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
              <span className="text-[10px] font-serif italic text-gray-500">{welcomeText || placeholders.welcome}</span>
              <div className="w-28 h-28 my-3 flex items-center justify-center border border-gray-200 p-1">
                {qrBase64 && <img src={qrBase64} alt="QR Code" className="w-full h-full" />}
              </div>
              <p className="text-[10px] font-bold tracking-wider uppercase">{instructionText || placeholders.instruction}</p>
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
              <p className="text-xs text-gray-500 tracking-widest uppercase font-semibold">{welcomeText || placeholders.welcome}</p>
            </div>

            <div className="my-8 flex flex-col items-center">
              <div className="p-3 bg-white border-2 border-gray-100 rounded-2xl shadow-md w-40 h-40 flex items-center justify-center">
                {qrBase64 && <img src={qrBase64} alt="QR Code" className="w-full h-full object-contain" />}
              </div>
              <p className="text-xs font-bold tracking-widest uppercase mt-6 text-[#D4A437] font-serif">{instructionText || placeholders.instruction}</p>
              <p className="text-[10px] text-gray-400 mt-1 max-w-[200px]">No download or registration required.</p>
            </div>

            <div className="text-[10px] text-gray-500 italic">
              {thankYouText || placeholders.thankYou}
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
              <p className="text-sm text-gray-500 mt-2">{welcomeText || placeholders.welcome}</p>
              <div className="w-16 border-t border-[#D4A437] my-4" />
              <span className="text-[10px] text-gray-400 italic">{thankYouText || placeholders.thankYou}</span>
            </div>

            <div className="flex flex-col items-center shrink-0">
              <div className="p-3 bg-white border border-gray-200 rounded-2xl shadow-md w-36 h-36 flex items-center justify-center">
                {qrBase64 && <img src={qrBase64} alt="QR Code" className="w-full h-full object-contain" />}
              </div>
              <span className="text-[10px] font-bold tracking-widest uppercase mt-4 text-[#D4A437] font-serif">{instructionText || placeholders.instruction}</span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
