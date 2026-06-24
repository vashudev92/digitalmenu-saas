'use client';

import Link from 'next/link';
import LandingNavbar from '@/components/landing-navbar';
import LandingFooter from '@/components/landing-footer';
import { ChevronRight, Sparkles, Smartphone, QrCode, Sliders, Check, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Is this a POS or online ordering system?",
      a: "No, DigitalMenu is purely a QR-based Menu Management SaaS. Customers scan the QR code to view your beautiful menu on their mobile browser. The waiter takes orders manually. We explicitly exclude ordering, cart checkouts, and online payments to keep the focus entirely on premium menu presentation."
    },
    {
      q: "Can I make changes to my menu items instantly?",
      a: "Yes! Any edits you make in the Dashboard—updating prices, changing descriptions, uploading a new food image, or marking a dish as unavailable—will reflect on the customer's phone instantly when they scan or refresh, with no need to reprint the QR code."
    },
    {
      q: "Do I get a different QR code for each table?",
      a: "You generate one high-resolution QR code for your entire restaurant. This simplifies your prints and lets you display it on table tents, acrylic stands, or counter cards across all tables."
    },
    {
      q: "How do the print templates work?",
      a: "We provide built-in print templates (Table Tent, Acrylic Stand, Counter Card) with your logo, instructions, and QR code. You can preview them directly on your dashboard and print them using standard browser print options (Ctrl+P) or save them as PDFs."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-white">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 md:pt-32 md:pb-40 border-b border-[#D4A437]/10">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#D4A437]/5 blur-[120px] pointer-events-none" />
        <div className="absolute top-0 right-10 w-[300px] h-[300px] rounded-full bg-[#D4A437]/3 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Sparkles className="w-4 h-4 text-[#D4A437]" />
            <span className="text-[#D4A437] text-xs font-semibold uppercase tracking-wider">
              Luxury QR Menu Management
            </span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Create. Share. Serve.<br />
            All with <span className="gold-gradient-text">One Scan.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl leading-relaxed mb-10">
            A premium, digital menu solution designed for fine-dining venues, bistros, and high-end cafes. Empower guests to explore your cuisine with an elegant, mobile-first design.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#D4A437] to-[#B88E2F] hover:from-[#B88E2F] hover:to-[#A37B24] text-black font-bold text-base transition-all duration-300 shadow-[0_0_20px_rgba(212,164,55,0.3)] hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              Start Your Free Trial <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              href="/r/trattoria-bella"
              target="_blank"
              className="w-full sm:w-auto px-8 py-4 rounded-full border border-gray-700 hover:border-[#D4A437] hover:bg-[#D4A437]/5 text-gray-300 hover:text-white font-semibold text-base transition-all flex items-center justify-center gap-2"
            >
              View Demo Menu <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="mt-4 text-xs text-gray-500">
            No credit card required • Instant setup in 2 minutes
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-[#080808] border-b border-[#D4A437]/10" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to Run a <span className="gold-gradient-text">Smarter Menu</span>
            </h2>
            <p className="max-w-xl mx-auto text-gray-400 text-base">
              Say goodbye to printing costs and outdated menus. Manage categories, items, themes and generate templates on a luxury portal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-gold p-8 rounded-3xl flex flex-col items-start hover:border-[#D4A437]/40 transition-all duration-300">
              <div className="p-4 rounded-2xl bg-[#D4A437]/10 border border-[#D4A437]/20 text-[#D4A437] mb-6">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold mb-3">Mobile-First Reader</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Stunning presentation for restaurant customers. Features search fields, sticky horizontal category tabs, and veg/non-veg tags.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-gold p-8 rounded-3xl flex flex-col items-start hover:border-[#D4A437]/40 transition-all duration-300">
              <div className="p-4 rounded-2xl bg-[#D4A437]/10 border border-[#D4A437]/20 text-[#D4A437] mb-6">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold mb-3">One QR, Multiple Templates</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Generate a single QR code for the entire restaurant. Preview and print physical templates like Table Tents, Stands, and Counter Cards.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-gold p-8 rounded-3xl flex flex-col items-start hover:border-[#D4A437]/40 transition-all duration-300">
              <div className="p-4 rounded-2xl bg-[#D4A437]/10 border border-[#D4A437]/20 text-[#D4A437] mb-6">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold mb-3">Luxury Custom Themes</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Customize your customer view. Choose from premium templates: Luxury Dark, Elegant Light, Cafe Theme, and Modern Theme.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 border-b border-[#D4A437]/10" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Get Up and Running in <span className="gold-gradient-text">Three Steps</span>
            </h2>
            <p className="max-w-xl mx-auto text-gray-400 text-base">
              Build your digital menu card and launch it in minutes. No complex hardware required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Step 1 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#D4A437] to-[#B88E2F] text-black font-bold font-serif text-2xl flex items-center justify-center shadow-lg mb-6 z-10">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Register & Build Profile</h3>
              <p className="text-gray-400 text-sm leading-relaxed px-4">
                Sign up for an account, fill in your restaurant info (Logo, Banner, Contacts), and select your desired luxury theme.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#D4A437] to-[#B88E2F] text-black font-bold font-serif text-2xl flex items-center justify-center shadow-lg mb-6 z-10">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Create Categories & Dishes</h3>
              <p className="text-gray-400 text-sm leading-relaxed px-4">
                Add categories (e.g. Starters, Chef Picks, Drinks) and enter your items with photos, prices, descriptions, and dietary tags.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#D4A437] to-[#B88E2F] text-black font-bold font-serif text-2xl flex items-center justify-center shadow-lg mb-6 z-10">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Download & Place QR Code</h3>
              <p className="text-gray-400 text-sm leading-relaxed px-4">
                Download your generated high-res QR code, print using one of our styled table templates, and display them on tables.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-[#080808] border-b border-[#D4A437]/10" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Transparent, Simple <span className="gold-gradient-text">Pricing Plans</span>
            </h2>
            <p className="max-w-xl mx-auto text-gray-400 text-base">
              Choose the package that matches your restaurant size. Upgrade or cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="glass p-8 rounded-3xl flex flex-col justify-between border-gray-800">
              <div>
                <h3 className="text-xl font-bold text-gray-300 mb-2">Free</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-serif font-bold">$0</span>
                  <span className="text-gray-500 text-sm ml-2">/ month</span>
                </div>
                <p className="text-gray-400 text-xs mb-6">Perfect for small local cafes starting out.</p>
                <div className="border-t border-gray-900 my-6" />
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-[#D4A437]" /> Up to 2 Categories
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-[#D4A437]" /> Up to 15 Menu Items
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-[#D4A437]" /> Standard Dark Theme
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-[#D4A437]" /> Table Tent Template
                  </li>
                </ul>
              </div>
              <Link
                href="/register"
                className="w-full text-center py-3 rounded-xl border border-gray-800 hover:border-[#D4A437] text-gray-300 hover:text-white font-medium text-sm transition-all"
              >
                Sign Up Free
              </Link>
            </div>

            {/* Premium Plan (Featured) */}
            <div className="glass-gold p-8 rounded-3xl flex flex-col justify-between relative transform scale-105 border-[#D4A437]/45">
              <div className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 rounded-full bg-[#D4A437] text-black text-xs font-bold uppercase tracking-wider shadow-md">
                Popular
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#D4A437] mb-2">Premium</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-serif font-bold">$19</span>
                  <span className="text-gray-500 text-sm ml-2">/ month</span>
                </div>
                <p className="text-gray-400 text-xs mb-6">Ideal for standard bistros and growing eateries.</p>
                <div className="border-t border-[#D4A437]/10 my-6" />
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm text-gray-200 font-medium">
                    <Check className="w-4 h-4 text-[#D4A437]" /> Unlimited Categories
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-200 font-medium">
                    <Check className="w-4 h-4 text-[#D4A437]" /> Up to 100 Menu Items
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-200 font-medium">
                    <Check className="w-4 h-4 text-[#D4A437]" /> All QR Print Templates
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-200 font-medium">
                    <Check className="w-4 h-4 text-[#D4A437]" /> Access to 4 Themes
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-200 font-medium">
                    <Check className="w-4 h-4 text-[#D4A437]" /> Download PNG & PDF
                  </li>
                </ul>
              </div>
              <Link
                href="/register"
                className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-[#D4A437] to-[#B88E2F] hover:from-[#B88E2F] hover:to-[#A37B24] text-black font-bold text-sm transition-all duration-300 shadow-[0_0_10px_rgba(212,164,55,0.2)]"
              >
                Start Trial
              </Link>
            </div>

            {/* Luxury Plan */}
            <div className="glass p-8 rounded-3xl flex flex-col justify-between border-gray-800">
              <div>
                <h3 className="text-xl font-bold text-gray-300 mb-2">Luxury</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-serif font-bold">$49</span>
                  <span className="text-gray-500 text-sm ml-2">/ month</span>
                </div>
                <p className="text-gray-400 text-xs mb-6">Designed for fine dining, hotels, and luxury brands.</p>
                <div className="border-t border-gray-900 my-6" />
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-[#D4A437]" /> Unlimited Categories & Items
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-[#D4A437]" /> Custom Styling & Branding
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-[#D4A437]" /> Vector SVG Downloads
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-[#D4A437]" /> All Premium Themes
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-[#D4A437]" /> Priority Support
                  </li>
                </ul>
              </div>
              <Link
                href="/register"
                className="w-full text-center py-3 rounded-xl border border-gray-800 hover:border-[#D4A437] text-gray-300 hover:text-white font-medium text-sm transition-all"
              >
                Go Luxury
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 border-b border-[#D4A437]/10" id="faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400 text-base">
              Have questions about DigitalMenu? We have answers.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="glass rounded-2xl overflow-hidden border-gray-900 transition-all duration-300">
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between text-base font-semibold text-white hover:text-[#D4A437] transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="text-[#D4A437] text-xl font-bold">{activeFaq === index ? "−" : "+"}</span>
                </button>
                {activeFaq === index && (
                  <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed border-t border-gray-950/20 pt-4 bg-[#0c0c0c]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
