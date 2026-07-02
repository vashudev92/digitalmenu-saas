'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Menu, X, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingNavbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Monitor scroll positioning to update navbar background opacity
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#09090B]/80 backdrop-blur-md border-b border-white/[0.04] h-16' 
          : 'bg-transparent h-20'
      } flex items-center`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] group-hover:border-[#D4A853]/50 transition-all duration-300">
              <ChefHat className="w-5 h-5 text-[#D4A853]" />
            </div>
            <span className="font-serif font-bold text-lg tracking-wide text-white group-hover:text-[#D4A853] transition-all duration-300">
              DigitalMenu
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-7">
            <Link href="/features" className="text-gray-400 hover:text-white font-medium text-xs tracking-wider uppercase transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-400 hover:text-white font-medium text-xs tracking-wider uppercase transition-colors">
              Pricing
            </Link>
            <Link href="/faq" className="text-gray-400 hover:text-white font-medium text-xs tracking-wider uppercase transition-colors">
              FAQ
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-white font-medium text-xs tracking-wider uppercase transition-colors">
              Contact
            </Link>
          </div>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-xl bg-[#D4A853] hover:bg-[#C49B4A] text-black font-semibold text-xs transition-all shadow-md hover:scale-[1.01]"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-3.5 py-2 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-red-500/5 hover:border-red-500/20 text-gray-400 hover:text-red-400 font-semibold text-xs transition-all cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-400 hover:text-white font-semibold text-xs px-3.5 py-2 transition-colors uppercase tracking-wider"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl bg-[#D4A853] hover:bg-[#C49B4A] text-black font-semibold text-xs transition-all shadow-md hover:scale-[1.01]"
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
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.03] transition-all cursor-pointer"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="absolute top-full left-0 right-0 border-b border-white/[0.06] bg-[#09090B] px-6 py-6 space-y-4 md:hidden flex flex-col"
          >
            <div className="space-y-1.5 flex flex-col">
              <Link
                href="/features"
                onClick={() => setIsOpen(false)}
                className="px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/[0.03] transition-colors"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                onClick={() => setIsOpen(false)}
                className="px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/[0.03] transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/faq"
                onClick={() => setIsOpen(false)}
                className="px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/[0.03] transition-colors"
              >
                FAQ
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/[0.03] transition-colors"
              >
                Contact
              </Link>
            </div>
            <div className="pt-4 border-t border-white/[0.04] flex flex-col gap-2.5">
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center py-3 rounded-xl bg-[#D4A853] text-black font-semibold text-sm"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="w-full py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-red-500/5 hover:text-red-400 font-semibold text-sm cursor-pointer"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center py-3 rounded-xl border border-white/10 text-gray-300 font-semibold text-sm"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center py-3 rounded-xl bg-[#D4A853] text-black font-semibold text-sm"
                  >
                    Start Free Trial
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
