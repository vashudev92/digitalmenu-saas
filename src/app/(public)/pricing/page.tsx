import LandingNavbar from '@/components/landing-navbar';
import LandingFooter from '@/components/landing-footer';
import Link from 'next/link';
import { Check, Info } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      desc: "Ideal for small street vendors, coffee carts, and local diners.",
      features: [
        "Up to 2 categories",
        "Up to 15 menu items",
        "1 basic QR code template",
        "Standard Dark Theme only",
        "View-only menu viewer",
        "Self-service online documentation"
      ],
      action: "Sign Up Free"
    },
    {
      name: "Premium",
      price: "$19",
      desc: "Designed for standard bistros, cafes, and independent restaurants.",
      features: [
        "Unlimited categories",
        "Up to 100 menu items",
        "3 print-ready templates",
        "Access to Cafe & Modern themes",
        "Download QR as high-res PNG/PDF",
        "Priority email customer support",
        "Veg/Non-Veg tag toggles"
      ],
      action: "Start 14-Day Free Trial",
      popular: true
    },
    {
      name: "Luxury",
      price: "$49",
      desc: "Crafted for fine dining establishments, boutique hotels, and chains.",
      features: [
        "Unlimited categories & items",
        "All QR templates (Stands, Table, Cards)",
        "All luxury themes (Gold Dark/Cream Light)",
        "Vector SVG + high-res exports",
        "Custom branding & logo uploads",
        "Dedicated account manager",
        "WhatsApp click-to-contact routing"
      ],
      action: "Get Started Now"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-white">
      <LandingNavbar />

      <header className="relative pt-20 pb-16 text-center border-b border-[#D4A437]/10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-[#D4A437]/5 blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Simple, Transparent <span className="gold-gradient-text">Pricing</span>
          </h1>
          <p className="max-w-xl mx-auto text-gray-400 text-base md:text-lg">
            No setup fees, no ordering transaction percentages. Just simple monthly pricing to power your menu.
          </p>
        </div>
      </header>

      <main className="flex-grow py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`glass p-8 rounded-3xl flex flex-col justify-between transition-all duration-300 relative ${
                  plan.popular
                    ? 'border-[#D4A437]/55 bg-gradient-to-b from-[#D4A437]/5 to-transparent shadow-[0_0_30px_rgba(212,164,55,0.15)] scale-105'
                    : 'border-gray-800 hover:border-[#D4A437]/25'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 right-8 px-3 py-1 rounded-full bg-[#D4A437] text-black text-xs font-bold uppercase tracking-wider">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="text-xl font-bold mb-2 text-white">{plan.name}</h3>
                  <p className="text-gray-400 text-xs mb-6 min-h-[32px]">{plan.desc}</p>
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl md:text-5xl font-serif font-bold text-white">{plan.price}</span>
                    <span className="text-gray-500 text-sm ml-2">/ month</span>
                  </div>
                  <div className="border-t border-gray-900 my-6" />
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((f, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3 text-sm text-gray-300">
                        <Check className="w-4 h-4 text-[#D4A437] shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/register"
                  className={`w-full text-center py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-[#D4A437] to-[#B88E2F] text-black hover:scale-[1.01] shadow-[0_0_15px_rgba(212,164,55,0.2)]'
                      : 'border border-gray-800 hover:border-[#D4A437] text-gray-300 hover:text-white'
                  }`}
                >
                  {plan.action}
                </Link>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto mt-16 p-6 rounded-2xl bg-gray-950/40 border border-gray-900 flex gap-4 items-start">
            <Info className="w-5 h-5 text-[#D4A437] shrink-0 mt-0.5" />
            <p className="text-xs text-gray-400 leading-relaxed">
              <strong>Need a bespoke enterprise plan?</strong> If you manage a large hotel chain or a restaurant franchise with 10+ locations requiring white-label domains or unique API integrations, please reach out via our contact page to get custom pricing.
            </p>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
