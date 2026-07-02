'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  Sparkles, 
  Smartphone, 
  QrCode, 
  Sliders, 
  Check, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Palette, 
  Flame, 
  Eye, 
  CheckCircle2, 
  Maximize2 
} from 'lucide-react';
import LandingNavbar from '@/components/landing-navbar';
import LandingFooter from '@/components/landing-footer';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/ui/animated-section';

export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const experiences = [
    {
      key: 'luxury',
      name: 'Luxury Fine Dining',
      desc: 'Elegant Serif fonts, gold double borders, and deep ambient backgrounds.',
      idealFor: 'Michelin Star, Steakhouses, Hotel Lounges',
      accent: '#D4A853',
      bgClass: 'bg-black text-[#FAFAFA]',
      borderClass: 'border-2 border-double border-[#D4A853]/40',
      fontClass: 'font-serif',
    },
    {
      key: 'japanese',
      name: 'Japanese Zen',
      desc: 'Pure whitespaces, flat grids, monospaced pricing, and minimal accents.',
      idealFor: 'Omakase, Ramen Bars, Modern Izakayas',
      accent: '#1F1F24',
      bgClass: 'bg-[#FCFAF2] text-[#1F1F24]',
      borderClass: 'border border-black/10',
      fontClass: 'font-sans tracking-tight',
    },
    {
      key: 'cafe',
      name: 'Modern Cafe',
      desc: 'Warm earthy colors, friendly typography, and highly rounded layouts.',
      idealFor: 'Specialty Coffee, Bakeries, Brunch Spots',
      accent: '#5D4037',
      bgClass: 'bg-[#FAF6F0] text-[#3E2723]',
      borderClass: 'border border-[#5D4037]/15 rounded-3xl',
      fontClass: 'font-sans',
    },
    {
      key: 'bistro',
      name: 'Italian Bistro',
      desc: 'Espresso tones, warm terracotta borders, and classic elegant cards.',
      idealFor: 'Trattorias, Wine Bars, Mediterranean Bistros',
      accent: '#800020',
      bgClass: 'bg-[#FFFDF9] text-[#2A201C]',
      borderClass: 'border-2 border-[#800020]/15',
      fontClass: 'font-serif',
    },
    {
      key: 'indian',
      name: 'Royal Indian',
      desc: 'Deep maroon backgrounds, saffron accent lines, and decorative titles.',
      idealFor: 'Multi-cuisine, Fine Indian dining, Lounges',
      accent: '#E8973F',
      bgClass: 'bg-[#1C0505] text-[#FAFAFA]',
      borderClass: 'border border-[#E8973F]/30',
      fontClass: 'font-serif',
    },
    {
      key: 'beach',
      name: 'Beach Club',
      desc: 'Breezy sand backdrops, ocean-teal highlights, and photo-first columns.',
      idealFor: 'Poolside cafes, Seaside bistros, Rooftops',
      accent: '#00897B',
      bgClass: 'bg-[#F2ECE4] text-[#1E3532]',
      borderClass: 'border-b-4 border-[#00897B]/30',
      fontClass: 'font-sans',
    }
  ];

  const faqs = [
    {
      q: "Is this a point-of-sale (POS) or online ordering system?",
      a: "No, DigitalMenu is purely a premium Restaurant Digital Branding Platform. Customers scan QR codes to view your menu on their mobile browsers. Waiters take orders manually. We intentionally exclude online carts and checkouts to guarantee an elegant, distraction-free guest experience."
    },
    {
      q: "Can I update menu items instantly?",
      a: "Yes! Any changes made in your Brand Studio dashboard—updating pricing, changing details, uploading dish photography, or toggling item availability—will reflect on guest devices instantly with no reprint required."
    },
    {
      q: "Do I need a separate QR code for each table?",
      a: "No. You can generate a single high-resolution QR routing code for your entire restaurant (or one for each specific dining area/profile, such as poolside vs. main dining). This simplifies printing and fits beautifully onto standees."
    },
    {
      q: "How do the QR Standee print templates work?",
      a: "Our built-in Print Studio features high-contrast templates for Table Tents, Acrylic Stands, and Counter Cards. You can customize them with your branding, download them as high-quality PDFs, or print them directly from your browser."
    },
    {
      q: "Can I connect a custom domain or custom theme?",
      a: "Our Professional and Premium plans support customized typography, brand colors, custom CSS variables, and bespoke headers/footers to make your menus feel like a native extension of your restaurant's website."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#09090B] text-[#FAFAFA] overflow-x-hidden selection:bg-[#D4A853]/30 selection:text-white">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-28 pb-24 md:pt-36 md:pb-36 border-b border-white/[0.04]">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#D4A853]/5 blur-[140px] pointer-events-none" />
        <div className="absolute top-0 right-10 w-[350px] h-[350px] rounded-full bg-[#D4A853]/3 blur-[110px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#D4A853]" />
                <span className="text-[#D4A853] text-[10px] font-bold uppercase tracking-wider">
                  Luxury Brand Platform
                </span>
              </div>

              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.08] text-white">
                Elevate your menu.<br />
                Define your <span className="gold-gradient-text">Identity.</span>
              </h1>

              <p className="max-w-xl text-gray-400 text-lg md:text-xl leading-relaxed">
                A digital menu brand engine designed for Michelin stars, hotel lounges, and premium coffee venues. Turn a basic QR scan into a memorable visual experience.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#D4A853] hover:bg-[#C49B4A] text-black font-semibold text-sm transition-all shadow-lg hover:shadow-[#D4A853]/10 hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
                >
                  Start Free Trial <ChevronRight className="w-4 h-4 text-black" />
                </Link>
                <Link
                  href="/r/royal-spice/main"
                  target="_blank"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white font-semibold text-sm border border-white/[0.06] hover:border-white/[0.12] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Explore Demo Menu <ArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
              </div>
              
              <div className="text-xs text-gray-500 flex items-center gap-4">
                <span>✓ Instant Setup</span>
                <span>•</span>
                <span>✓ No Card Required</span>
                <span>•</span>
                <span>✓ 6 Luxury Templates</span>
              </div>
            </div>

            {/* Right Graphic Preview */}
            <div className="lg:col-span-5 relative flex justify-center">
              {/* Virtual Smartphone Frame */}
              <div className="relative w-[280px] h-[570px] rounded-[42px] border-8 border-white/[0.08] bg-[#0E0E10] shadow-2xl shadow-black/80 p-3 overflow-hidden flex flex-col">
                <div className="absolute top-0 inset-x-0 h-6 bg-black flex justify-center items-center z-20">
                  <div className="w-20 h-4 rounded-full bg-black flex items-center justify-center">
                    <div className="w-8 h-1 rounded-full bg-white/10" />
                  </div>
                </div>

                {/* Simulated luxury menu preview */}
                <div className="w-full h-full rounded-[30px] overflow-hidden bg-black flex flex-col relative text-left">
                  {/* Banner */}
                  <div className="h-32 bg-gradient-to-t from-black/80 to-transparent relative z-10 flex items-end p-4">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544025162-d76694265947?w=600')] bg-cover bg-center opacity-60" />
                    <div className="relative z-10">
                      <span className="text-[10px] font-bold text-[#D4A853] uppercase tracking-widest">Est. 2012</span>
                      <h4 className="font-serif text-lg font-bold text-white leading-tight">Royal Spice</h4>
                    </div>
                  </div>

                  {/* Menu Content */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="flex gap-2 pb-2 border-b border-white/5 scrollbar-none overflow-x-auto">
                      <span className="text-[10px] font-bold text-black bg-[#D4A853] px-2 py-0.5 rounded-full shrink-0">Chef picks</span>
                      <span className="text-[10px] font-bold text-gray-400 border border-white/10 px-2 py-0.5 rounded-full shrink-0">Starters</span>
                      <span className="text-[10px] font-bold text-gray-400 border border-white/10 px-2 py-0.5 rounded-full shrink-0">Mains</span>
                    </div>

                    <div className="space-y-3">
                      <div className="border border-[#D4A853]/20 bg-white/[0.02] p-3 rounded-lg flex gap-3">
                        <div className="w-12 h-12 bg-[url('https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300')] bg-cover bg-center rounded" />
                        <div className="flex-1">
                          <div className="flex justify-between items-baseline">
                            <h5 className="font-serif text-xs font-bold text-white">Truffle Pizza</h5>
                            <span className="text-[10px] text-[#D4A853] font-bold">$24</span>
                          </div>
                          <p className="text-[9px] text-gray-400 mt-1 leading-normal line-clamp-2">Shaved summer truffles, buffalo mozzarella, white sauce.</p>
                        </div>
                      </div>

                      <div className="border border-[#D4A853]/20 bg-white/[0.02] p-3 rounded-lg flex gap-3">
                        <div className="w-12 h-12 bg-[url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300')] bg-cover bg-center rounded" />
                        <div className="flex-1">
                          <div className="flex justify-between items-baseline">
                            <h5 className="font-serif text-xs font-bold text-white">Saffron Risotto</h5>
                            <span className="text-[10px] text-[#D4A853] font-bold">$28</span>
                          </div>
                          <p className="text-[9px] text-gray-400 mt-1 leading-normal line-clamp-2">Acquerello rice, saffron stamens, 36-month parmigiano-reggiano.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating welcome badge */}
                  <div className="absolute bottom-4 inset-x-4 glass p-2.5 rounded-xl border-[#D4A853]/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#D4A853]/20 flex items-center justify-center">
                        <Palette className="w-3.5 h-3.5 text-[#D4A853]" />
                      </div>
                      <span className="text-[9px] text-white font-medium">Luxury dark active</span>
                    </div>
                    <span className="text-[9px] text-[#D4A853] font-bold">V3.0 Preview</span>
                  </div>
                </div>
              </div>

              {/* Floating elements behind phone */}
              <div className="absolute -bottom-6 -left-6 glass p-4 rounded-2xl border-[#D4A853]/20 shadow-xl hidden md:flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#D4A853]/10 text-[#D4A853]">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h6 className="text-xs font-bold text-white">Universal Routing</h6>
                  <p className="text-[10px] text-gray-400">Scan to auto-localize</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-10 border-b border-white/[0.04] bg-black/20 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-6">
            Empowering modern hospitality brands globally
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-40">
            <span className="font-serif text-lg font-bold text-white tracking-widest">ROYAL SPICE</span>
            <span className="font-serif text-lg font-bold text-white tracking-widest">TRATTORIA BELLA</span>
            <span className="font-serif text-lg font-bold text-white tracking-widest">ZEN LOUNGE</span>
            <span className="font-serif text-lg font-bold text-white tracking-widest">BISTRO L'ESPRESSO</span>
          </div>
        </div>
      </section>

      {/* Menu Experiences Gallery */}
      <section className="py-24 border-b border-white/[0.04] relative" id="experiences">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-left mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs font-medium text-gray-400">
              <Palette className="w-3.5 h-3.5 text-[#D4A853]" /> Layout Engines
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold">
              Complete brand transformations.<br />
              Not just <span className="gold-gradient-text">font changes.</span>
            </h2>
            <p className="max-w-xl text-gray-400 text-sm">
              Changing the Menu Experience transforms the header layout, card structures, buttons, border details, spacing ratios, and scrolling physics to match a distinct aesthetic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map((exp, idx) => (
              <AnimatedSection key={exp.key} delay={idx * 0.1} className="flex">
                <div className="surface-1 border border-white/[0.06] rounded-2xl p-6 flex flex-col justify-between hover:border-[#D4A853]/30 transition-all group w-full">
                  <div>
                    {/* Simulated Mini layout preview header */}
                    <div className={`h-24 ${exp.bgClass} rounded-xl p-3 mb-5 flex flex-col justify-between overflow-hidden relative border border-white/5`}>
                      <div className="flex justify-between items-center">
                        <span className={`text-[8px] font-bold uppercase tracking-widest ${exp.fontClass}`}>Menu</span>
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400/80" />
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/80" />
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400/80" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className={`w-8 h-8 rounded shrink-0 bg-gray-400/20 ${exp.borderClass}`} />
                        <div className="space-y-1 w-full justify-center flex flex-col">
                          <div className="h-1.5 w-1/2 bg-gray-400/30 rounded" />
                          <div className="h-1 w-1/3 bg-gray-400/20 rounded" />
                        </div>
                      </div>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-white mb-2 flex items-center gap-2">
                      {exp.name}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed mb-4">{exp.desc}</p>
                  </div>

                  <div className="border-t border-white/[0.05] pt-4 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Ideal Venue:</span>
                      <span className="text-[10px] text-[#D4A853] font-semibold">{exp.idealFor}</span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Studio Feature Showcase */}
      <section className="py-24 border-b border-white/[0.04]" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="text-xs font-bold text-[#D4A853] uppercase tracking-widest">Aesthetic Control</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold">
              The Brand Studio. Built for creators.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Every detail is tailored to your taste. A clean, responsive workflow lets restaurant owners design menus on desktop or tablet and track styling live.
            </p>
          </div>

          <div className="space-y-24">
            {/* Split Feature 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-5 text-left">
                <div className="w-10 h-10 rounded-xl bg-[#D4A853]/10 border border-[#D4A853]/20 flex items-center justify-center text-[#D4A853]">
                  <Sliders className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-3xl font-bold text-white">Visual Design Engine</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Go beyond default stylesheets. Customize colors using HSL palettes or click presets. Mix and match 10 custom Google font packages. Upload high-fidelity logos, welcome banners, and custom browser tab tab icons (favicons) instantly.
                </p>
                <div className="flex gap-4 pt-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-[#D4A853]" /> Typography Packages
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-[#D4A853]" /> Color Swatches
                  </div>
                </div>
              </div>
              <div className="lg:col-span-6">
                <div className="surface-1 border border-white/[0.06] p-5 rounded-2xl shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Style Settings</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-lg text-left">
                      <span className="text-[10px] text-gray-500 block uppercase font-bold">Heading font</span>
                      <span className="text-xs font-serif font-bold text-white block mt-1">Playfair Display</span>
                    </div>
                    <div className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-lg text-left">
                      <span className="text-[10px] text-gray-500 block uppercase font-bold">Body font</span>
                      <span className="text-xs font-sans font-bold text-white block mt-1">Inter Sans</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-left">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Brand Presets</span>
                    <div className="flex gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#D4A853] border border-white/20 cursor-pointer" />
                      <span className="w-6 h-6 rounded-full bg-[#800020] border border-white/20 cursor-pointer" />
                      <span className="w-6 h-6 rounded-full bg-[#00897B] border border-white/20 cursor-pointer" />
                      <span className="w-6 h-6 rounded-full bg-[#5D4037] border border-white/20 cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Split Feature 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center lg:flex-row-reverse">
              <div className="lg:col-span-6 lg:order-2 space-y-5 text-left">
                <div className="w-10 h-10 rounded-xl bg-[#D4A853]/10 border border-[#D4A853]/20 flex items-center justify-center text-[#D4A853]">
                  <QrCode className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-3xl font-bold text-white">QR Code Print Studio</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Design beautiful physical standees directly from the dashboard. Toggle between Table Tents, Acrylic Stands, and Counter Cards. Customize instructions and sizes, download high-definition PNGs, or print directly using native browser dialogs with automatic print-media overrides.
                </p>
                <div className="flex gap-4 pt-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-[#D4A853]" /> Centered PDFs
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-[#D4A853]" /> Monogram Fallbacks
                  </div>
                </div>
              </div>
              <div className="lg:col-span-6 lg:order-1">
                <div className="surface-1 border border-white/[0.06] p-6 rounded-2xl shadow-xl flex flex-col items-center">
                  <div className="w-36 h-36 bg-white p-3 rounded-xl border border-white/[0.06] mb-4 relative flex items-center justify-center">
                    <QrCode className="w-28 h-28 text-black" />
                    <div className="absolute inset-0 bg-[#D4A853]/10 border border-[#D4A853]/40 rounded-xl pointer-events-none" />
                  </div>
                  <div className="flex gap-3 w-full">
                    <span className="flex-1 bg-white/[0.03] text-white border border-white/5 p-2 rounded-lg text-xs font-semibold">Table Tent</span>
                    <span className="flex-1 bg-white/[0.03] text-white border border-white/5 p-2 rounded-lg text-xs font-semibold">Acrylic Stand</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 border-b border-white/[0.04]" id="how-it-works">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold text-[#D4A853] uppercase tracking-widest">Simple Workflow</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold">Three steps to digital brand luxury</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="surface-1 border border-white/[0.06] p-8 rounded-2xl text-left relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#D4A853]/5 to-transparent pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 font-serif font-bold text-lg text-[#D4A853] flex items-center justify-center mb-6">
                01
              </div>
              <h4 className="text-lg font-bold text-white mb-3">Claim Your Workspace</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Register your restaurant name, claim your unique URL routing slug, and set up your digital restaurant card profiles.
              </p>
            </div>

            <div className="surface-1 border border-white/[0.06] p-8 rounded-2xl text-left relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#D4A853]/5 to-transparent pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 font-serif font-bold text-lg text-[#D4A853] flex items-center justify-center mb-6">
                02
              </div>
              <h4 className="text-lg font-bold text-white mb-3">Add Menu Categories</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Organize menu dishes into categories. Add descriptions, pricing, custom diet markings, and crop beautiful dish imagery.
              </p>
            </div>

            <div className="surface-1 border border-white/[0.06] p-8 rounded-2xl text-left relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#D4A853]/5 to-transparent pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 font-serif font-bold text-lg text-[#D4A853] flex items-center justify-center mb-6">
                03
              </div>
              <h4 className="text-lg font-bold text-white mb-3">Print & Display Standees</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Select your preferred print template, adjust dimensions, download high-res PDFs, and place them on tables for instant scanning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-black/20 border-b border-white/[0.04]" id="pricing">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-5">
            <span className="text-xs font-bold text-[#D4A853] uppercase tracking-widest">Subscription Tiers</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold">Transparent Plans for Any Scale</h2>
            
            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/5">
              <button 
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  billingCycle === 'monthly' ? 'bg-[#D4A853] text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBillingCycle('yearly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === 'yearly' ? 'bg-[#D4A853] text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                Yearly <span className="bg-black/10 px-1 py-0.5 rounded text-[9px]">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="surface-1 border border-white/[0.06] p-8 rounded-2xl flex flex-col justify-between text-left relative">
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Starter</span>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-serif font-bold text-white">$0</span>
                  <span className="text-gray-400 text-xs ml-2">/ month</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed mb-6">Perfect for small local venues and tasting projects.</p>
                <div className="border-t border-white/[0.05] my-6" />
                <ul className="space-y-3.5 text-xs text-gray-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#D4A853]" /> 1 Menu Profile
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#D4A853]" /> Up to 25 Dishes
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#D4A853]" /> 2 Layout Templates
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    ✕ Custom Domain Links
                  </li>
                </ul>
              </div>
              <Link 
                href="/register" 
                className="mt-8 w-full border border-white/10 hover:border-white/20 hover:bg-white/[0.02] text-white py-3 rounded-xl text-xs font-bold text-center block transition-all cursor-pointer"
              >
                Get Started
              </Link>
            </div>

            {/* Professional Plan */}
            <div className="surface-1 border-2 border-[#D4A853] p-8 rounded-2xl flex flex-col justify-between text-left relative shadow-xl shadow-[#D4A853]/5">
              <div className="absolute -top-3.5 left-6 bg-[#D4A853] text-black px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">
                Most Popular
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#D4A853] uppercase tracking-widest block mb-2">Professional</span>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-serif font-bold text-white">
                    {billingCycle === 'monthly' ? '$29' : '$23'}
                  </span>
                  <span className="text-gray-400 text-xs ml-2">/ month</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed mb-6">Built for growing dining locations, cafes, and bars.</p>
                <div className="border-t border-white/[0.05] my-6" />
                <ul className="space-y-3.5 text-xs text-gray-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#D4A853]" /> 3 Menu Profiles
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#D4A853]" /> Unlimited Dishes
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#D4A853]" /> 4 Layout Templates
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#D4A853]" /> Custom Brand Colors
                  </li>
                </ul>
              </div>
              <Link 
                href="/register" 
                className="mt-8 w-full bg-[#D4A853] hover:bg-[#C49B4A] text-black py-3 rounded-xl text-xs font-bold text-center block transition-all cursor-pointer"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="surface-1 border border-white/[0.06] p-8 rounded-2xl flex flex-col justify-between text-left relative">
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Premium</span>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-serif font-bold text-white">
                    {billingCycle === 'monthly' ? '$79' : '$63'}
                  </span>
                  <span className="text-gray-400 text-xs ml-2">/ month</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed mb-6">Designed for multi-location groups and fine dining suites.</p>
                <div className="border-t border-white/[0.05] my-6" />
                <ul className="space-y-3.5 text-xs text-gray-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#D4A853]" /> Unlimited Profiles
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#D4A853]" /> Unlimited Dishes
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#D4A853]" /> Unlock All 6+ Experiences
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#D4A853]" /> Custom Fonts & Domain Mapping
                  </li>
                </ul>
              </div>
              <Link 
                href="/register" 
                className="mt-8 w-full border border-white/10 hover:border-white/20 hover:bg-white/[0.02] text-white py-3 rounded-xl text-xs font-bold text-center block transition-all cursor-pointer"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 border-b border-white/[0.04]" id="faq">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <span className="text-xs font-bold text-[#D4A853] uppercase tracking-widest">Common Questions</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index}
                  className="surface-1 border border-white/[0.06] rounded-xl overflow-hidden text-left"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-serif text-base font-bold text-white hover:bg-white/[0.01] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className={`transform transition-transform duration-200 text-gray-500 ${isOpen ? 'rotate-90 text-[#D4A853]' : ''}`}>
                      <ChevronRight className="w-5 h-5" />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-1 text-xs text-gray-400 leading-relaxed border-t border-white/[0.03]">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
