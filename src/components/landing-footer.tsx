import Link from 'next/link';
import { ChefHat } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="bg-[#09090B] border-t border-white/[0.04] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-4 text-left space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[#D4A853]">
                <ChefHat className="w-5 h-5" />
              </div>
              <span className="font-serif font-bold text-lg tracking-wide text-white">
                DigitalMenu
              </span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed max-w-xs">
              A premium, digital menu brand engine designed for Michelin stars, hotel lounges, and specialty coffee venues. Defining digital hospitality.
            </p>
          </div>

          {/* Product Links */}
          <div className="md:col-span-2 text-left">
            <h4 className="text-white font-semibold text-[10px] tracking-wider uppercase mb-4">Product</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/features" className="text-gray-400 hover:text-white text-xs transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-white text-xs transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-gray-400 hover:text-white text-xs transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="md:col-span-3 text-left">
            <h4 className="text-white font-semibold text-[10px] tracking-wider uppercase mb-4">Resources</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white text-xs transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white text-xs transition-colors">
                  Help Center & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="md:col-span-3 text-left">
            <h4 className="text-white font-semibold text-[10px] tracking-wider uppercase mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li>
                <span className="text-gray-400 text-xs hover:text-white cursor-pointer transition-colors block">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-gray-400 text-xs hover:text-white cursor-pointer transition-colors block">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Panel */}
        <div className="border-t border-white/[0.04] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-[10px] tracking-wide">
            &copy; {new Date().getFullYear()} DigitalMenu. All rights reserved. Built for hospitality perfection.
          </p>
          <div className="flex space-x-6">
            <span className="text-gray-500 hover:text-white text-[10px] cursor-pointer transition-colors">Twitter</span>
            <span className="text-gray-500 hover:text-white text-[10px] cursor-pointer transition-colors">Instagram</span>
            <span className="text-gray-500 hover:text-white text-[10px] cursor-pointer transition-colors">LinkedIn</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
