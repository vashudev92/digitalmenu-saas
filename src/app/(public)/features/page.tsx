import LandingNavbar from '@/components/landing-navbar';
import LandingFooter from '@/components/landing-footer';
import { ChefHat, QrCode, Sliders, Smartphone, Zap, Eye, Download, Layers } from 'lucide-react';

export default function FeaturesPage() {
  const details = [
    {
      icon: <Smartphone className="w-8 h-8 text-[#D4A437]" />,
      title: "Mobile-First Design",
      desc: "Our menu viewer is built specifically for smartphones. When a customer scans your QR code, they receive a lightning-fast, smooth, app-like menu reading experience. No zooming in on clunky PDFs."
    },
    {
      icon: <Zap className="w-8 h-8 text-[#D4A437]" />,
      title: "Instant Live Updates",
      desc: "Changing a dish price or description? Ran out of a specific ingredient? Deactivate a menu item or update details in real-time. Changes go live instantly without reprinting codes."
    },
    {
      icon: <Sliders className="w-8 h-8 text-[#D4A437]" />,
      title: "Luxury Themes Selection",
      desc: "Establish your culinary identity. Switch between themes like Luxury Dark (black & gold), Elegant Light (premium cream), Cafe Theme (warm brown tones), or Modern Theme (high-contrast minimalist)."
    },
    {
      icon: <QrCode className="w-8 h-8 text-[#D4A437]" />,
      title: "One QR Code for All",
      desc: "No more table configuration headache. Set up a single high-quality QR code for the entire restaurant. We provide templates tailored for acrylic displays, table tents, and cards."
    },
    {
      icon: <Download className="w-8 h-8 text-[#D4A437]" />,
      title: "High-Res PDF & PNG Exports",
      desc: "Download your generated QR code in multiple formats: high-res PNG for digital designs, SVG vectors for professional printing, and print-ready templates designed to match standard sizing."
    },
    {
      icon: <Layers className="w-8 h-8 text-[#D4A437]" />,
      title: "Drag-and-Drop Categories",
      desc: "Order your menu your way. Quickly drag, re-order, or toggle category visibilities (Chef Picks, Starters, Indian, Desserts) from our clean sidebar dashboard."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-white">
      <LandingNavbar />
      
      <header className="relative pt-20 pb-16 text-center border-b border-[#D4A437]/10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-[#D4A437]/5 blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Platform <span className="gold-gradient-text">Features</span>
          </h1>
          <p className="max-w-xl mx-auto text-gray-400 text-base md:text-lg">
            Everything your restaurant needs to manage and showcase an elegant contactless menu.
          </p>
        </div>
      </header>

      <main className="flex-grow py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {details.map((feat, idx) => (
              <div key={idx} className="glass p-8 rounded-3xl hover:border-[#D4A437]/35 transition-all duration-300">
                <div className="p-3 rounded-2xl bg-[#D4A437]/10 w-fit mb-6 border border-[#D4A437]/15">
                  {feat.icon}
                </div>
                <h3 className="font-serif text-xl font-bold mb-3">{feat.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
