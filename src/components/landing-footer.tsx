import Link from 'next/link';
import { ChefHat } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="bg-[#050505] border-t border-[#D4A437]/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <ChefHat className="w-6 h-6 text-[#D4A437]" />
              <span className="font-serif font-bold text-xl tracking-wide text-white">
                DigitalMenu
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Create premium, responsive QR-based menus for luxury restaurants and fine-dining venues. Elevate your tables, minimize touch points.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-white font-medium text-sm tracking-wider uppercase mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/features" className="text-gray-400 hover:text-[#D4A437] text-sm transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-[#D4A437] text-sm transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-gray-400 hover:text-[#D4A437] text-sm transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-white font-medium text-sm tracking-wider uppercase mb-4">Support & FAQ</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-[#D4A437] text-sm transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-[#D4A437] text-sm transition-colors">
                  Help Center & Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-medium text-sm tracking-wider uppercase mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <span className="text-gray-400 text-sm hover:text-[#D4A437] cursor-pointer transition-colors">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-gray-400 text-sm hover:text-[#D4A437] cursor-pointer transition-colors">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-950 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} DigitalMenu. All rights reserved. Built for premium culinary venues.
          </p>
          <div className="flex space-x-6">
            <span className="text-gray-500 hover:text-[#D4A437] text-xs cursor-pointer">Twitter</span>
            <span className="text-gray-500 hover:text-[#D4A437] text-xs cursor-pointer">Instagram</span>
            <span className="text-gray-500 hover:text-[#D4A437] text-xs cursor-pointer">LinkedIn</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
