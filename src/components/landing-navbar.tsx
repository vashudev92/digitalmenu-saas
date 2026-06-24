'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Menu, X, ChefHat } from 'lucide-react';

export default function LandingNavbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#0A0A0A]/85 backdrop-blur-md border-b border-[#D4A437]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#D4A437]/20 to-[#D4A437]/5 border border-[#D4A437]/30 group-hover:border-[#D4A437]/60 transition-all duration-300">
                <ChefHat className="w-6 h-6 text-[#D4A437]" />
              </div>
              <span className="font-serif font-bold text-2xl tracking-wide text-white group-hover:text-[#D4A437] transition-all duration-300">
                DigitalMenu
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/features" className="text-gray-300 hover:text-[#D4A437] font-medium text-sm transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-300 hover:text-[#D4A437] font-medium text-sm transition-colors">
              Pricing
            </Link>
            <Link href="/faq" className="text-gray-300 hover:text-[#D4A437] font-medium text-sm transition-colors">
              FAQ
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-[#D4A437] font-medium text-sm transition-colors">
              Contact
            </Link>
          </div>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#D4A437] to-[#B88E2F] hover:from-[#B88E2F] hover:to-[#A37B24] text-black font-semibold text-sm transition-all duration-300 shadow-[0_0_15px_rgba(212,164,55,0.2)] hover:shadow-[0_0_25px_rgba(212,164,55,0.4)]"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-4 py-2.5 rounded-full border border-gray-700 hover:border-red-500/50 hover:bg-red-500/10 text-gray-300 hover:text-red-400 font-medium text-sm transition-all"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-white font-medium text-sm px-4 py-2 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#D4A437] to-[#B88E2F] hover:from-[#B88E2F] hover:to-[#A37B24] text-black font-semibold text-sm transition-all duration-300 shadow-[0_0_15px_rgba(212,164,55,0.2)]"
                >
                  Start Free Trial
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-900 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-[#D4A437]/10 bg-[#0A0A0A]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/features"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-300 hover:text-[#D4A437] hover:bg-gray-900 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-300 hover:text-[#D4A437] hover:bg-gray-900 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/faq"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-300 hover:text-[#D4A437] hover:bg-gray-900 transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-300 hover:text-[#D4A437] hover:bg-gray-900 transition-colors"
            >
              Contact
            </Link>
          </div>
          <div className="pt-4 pb-4 border-t border-gray-950 px-5 flex flex-col gap-3">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-3 rounded-full bg-gradient-to-r from-[#D4A437] to-[#B88E2F] text-black font-semibold text-base"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="w-full py-3 rounded-full border border-gray-800 text-gray-300 text-base"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-3 rounded-full border border-gray-800 text-gray-300 font-medium text-base"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-3 rounded-full bg-gradient-to-r from-[#D4A437] to-[#B88E2F] text-black font-semibold text-base"
                >
                  Start Free Trial
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
