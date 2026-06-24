'use client';

import LandingNavbar from '@/components/landing-navbar';
import LandingFooter from '@/components/landing-footer';
import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const categories = [
    {
      title: "General Questions",
      items: [
        {
          q: "What is DigitalMenu exactly?",
          a: "DigitalMenu is a software platform (SaaS) that allows restaurants to build and manage an online menu card and generate a single QR code. Customers scan the QR code to read the menu instantly on their mobile browser. There is no app download required, and we intentionally exclude ordering, carts, and payment integrations."
        },
        {
          q: "Do customer accounts exist?",
          a: "No, customers do not create accounts. They simply scan the QR code and read the menu as public visitors, keeping the experience friction-free."
        }
      ]
    },
    {
      title: "Menu & Management",
      items: [
        {
          q: "How do I update prices or run daily specials?",
          a: "You can update prices, mark items as out of stock, write description additions, or rearrange categories instantly via your owner dashboard. All customer screens update immediately in real-time."
        },
        {
          q: "Is there a limit to the number of items I can add?",
          a: "The Free plan supports up to 15 items and 2 categories. The Premium plan supports up to 100 items. The Luxury plan supports unlimited items and categories."
        }
      ]
    },
    {
      title: "QR Codes & Customization",
      items: [
        {
          q: "Do I need a new QR code if I add a menu item?",
          a: "No, the QR code links to a permanent URL for your restaurant. Your menu changes update dynamically, so your printed codes are set once and never need to be replaced."
        },
        {
          q: "Can I customize the visual style of my customer menu?",
          a: "Yes. In the Profile dashboard, you can choose from 4 luxury themes (Luxury Dark, Elegant Light, Cafe, and Modern) and upload your own branding (logo and banner images)."
        }
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-white">
      <LandingNavbar />
      
      <header className="relative pt-20 pb-16 text-center border-b border-[#D4A437]/10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-[#D4A437]/5 blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Frequently Asked <span className="gold-gradient-text">Questions</span>
          </h1>
          <p className="max-w-xl mx-auto text-gray-400 text-base md:text-lg">
            Have questions about how our digital menu system works? Browse the answers below.
          </p>
        </div>
      </header>

      <main className="flex-grow py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {categories.map((cat, catIdx) => (
          <div key={catIdx} className="mb-14">
            <h2 className="font-serif text-2xl font-bold mb-6 text-[#D4A437] flex items-center gap-2">
              <HelpCircle className="w-5 h-5" /> {cat.title}
            </h2>
            <div className="space-y-4">
              {cat.items.map((item, itemIdx) => {
                const uniqueIdx = catIdx * 10 + itemIdx;
                const isOpen = openIdx === uniqueIdx;
                return (
                  <div key={itemIdx} className="glass rounded-2xl overflow-hidden border-gray-900 transition-all duration-300">
                    <button
                      onClick={() => setOpenIdx(isOpen ? null : uniqueIdx)}
                      className="w-full text-left px-6 py-5 flex items-center justify-between text-base font-semibold hover:text-[#D4A437] transition-colors"
                    >
                      <span>{item.q}</span>
                      <span className="text-[#D4A437] text-lg font-bold">{isOpen ? "−" : "+"}</span>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed border-t border-gray-950/20 pt-4 bg-[#0c0c0c]">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </main>

      <LandingFooter />
    </div>
  );
}
