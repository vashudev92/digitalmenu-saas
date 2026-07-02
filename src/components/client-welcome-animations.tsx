'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Flame, Sparkles, Star, Clock, MapPin, Phone, ChefHat, ArrowUpRight } from 'lucide-react';

interface ClientWelcomeAnimationsProps {
  restaurant: any;
  style: any;
  headingStyle: any;
  todaySpecial: any;
}

export default function ClientWelcomeAnimations({
  restaurant,
  style,
  headingStyle,
  todaySpecial,
}: ClientWelcomeAnimationsProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* WOW Moment Entry Loader */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6"
            style={{
              backgroundColor: restaurant.primaryColor ? `${restaurant.primaryColor}0d` : '#050505',
              backgroundImage: 'radial-gradient(circle at center, rgba(212,168,83,0.08) 0%, rgba(5,5,5,1) 80%)'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-4 text-center"
            >
              {restaurant.logo ? (
                <motion.img
                  src={restaurant.logo}
                  alt="Logo"
                  animate={{ opacity: [0.5, 1, 0.5], scale: [0.98, 1.02, 0.98] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="w-16 h-16 object-cover rounded-full border border-white/10 shadow-2xl"
                />
              ) : (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5], scale: [0.98, 1.02, 0.98] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="p-4 bg-white/[0.02] border border-white/10 rounded-full"
                >
                  <ChefHat className="w-8 h-8 text-[#D4A853]" style={{ color: restaurant.primaryColor || '#D4A853' }} />
                </motion.div>
              )}
              <h1 className="font-serif text-lg tracking-widest uppercase text-[#D4A853] mt-2" style={{ color: restaurant.primaryColor || '#D4A853', ...headingStyle }}>
                {restaurant.name}
              </h1>
              <span className="w-6 h-[1px] bg-white/20 my-1" />
              <p className="text-[8px] uppercase tracking-[0.25em] text-gray-500 font-bold">
                Crafting Culinary Experience
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Entrance Transition */}
      <AnimatePresence>
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-10 mt-6"
          >
            {/* Badges Grid */}
            <div className={`grid grid-cols-3 gap-3 px-4 ${style.layoutMode === 'japanese' ? 'px-3 mt-4' : ''}`}>
              {[
                { Icon: ShieldCheck, title: restaurant.badge1Title || 'Hygienic', desc: restaurant.badge1Desc || 'Kitchen' },
                { Icon: Flame, title: restaurant.badge2Title || 'Fresh', desc: restaurant.badge2Desc || 'Ingredients' },
                { Icon: Sparkles, title: restaurant.badge3Title || 'Chef', desc: restaurant.badge3Desc || 'Specials' }
              ].map((b, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 text-center flex flex-col items-center justify-center border transition-all ${style.cardBg} ${style.cardRadius} hover:border-[#D4A853]/40`}
                  style={{ borderColor: restaurant.primaryColor ? `${restaurant.primaryColor}15` : undefined }}
                >
                  <b.Icon className="w-4 h-4 mb-1.5" style={{ color: restaurant.primaryColor || style.accentHex }} />
                  <span 
                    className={`text-[9px] font-bold tracking-wider uppercase leading-none ${
                      style.layoutMode === 'luxury' ? 'font-serif text-[#D4A853]' :
                      style.layoutMode === 'japanese' ? 'font-mono text-black font-semibold' : ''
                    }`}
                  >
                    {b.title}
                  </span>
                  <span className="text-[8px] text-gray-500 mt-1 uppercase font-semibold">{b.desc}</span>
                </div>
              ))}
            </div>

            {/* Restaurant Storytelling Section */}
            <div className="px-4 text-center space-y-6">
              <div className="flex flex-col items-center">
                <span className="w-8 h-[1px] bg-[#D4A853]/40 mb-3" style={{ backgroundColor: restaurant.primaryColor ? `${restaurant.primaryColor}40` : undefined }} />
                <h3 className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-1">
                  The Culinary Journey
                </h3>
                <h2 className="font-serif text-xl font-medium italic text-white" style={headingStyle}>
                  Our Heritage & Story
                </h2>
              </div>

              <p className="text-xs leading-relaxed text-gray-400 font-serif italic max-w-sm mx-auto">
                "{restaurant.description || 'Welcome to our gastronomy portal, where we curate authentic tastes, exquisite ingredients, and culinary mastery to deliver an unparalleled dining experience.'}"
              </p>

              {restaurant.tagline && (
                <div className="border border-white/5 bg-white/[0.01] rounded-2xl p-4 inline-block text-left max-w-xs mx-auto">
                  <span className="block text-[8px] uppercase tracking-widest text-gray-500 font-bold">Signature Style</span>
                  <span className="block text-xs font-serif text-white mt-1 italic">{restaurant.tagline}</span>
                </div>
              )}

              {/* Chef Message */}
              <div className="bg-gradient-to-br from-white/[0.01] to-transparent border border-white/[0.04] p-5 rounded-2xl space-y-3 relative overflow-hidden">
                <div className="absolute top-2 right-4 text-white/[0.02] text-6xl font-serif select-none">“</div>
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center shrink-0">
                    <ChefHat className="w-5 h-5 text-[#D4A853]" style={{ color: restaurant.primaryColor || '#D4A853' }} />
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-[#D4A853] font-bold" style={{ color: restaurant.primaryColor || '#D4A853' }}>
                      Message from the Kitchen
                    </span>
                    <span className="block text-xs font-serif text-white font-medium italic">Chef's Signature Philosophy</span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 text-left leading-relaxed italic">
                  "Gastronomy is an art form. We believe in sourcing only the freshest local organic ingredients, blending heritage recipes with modern culinary craftsmanship to spark delight in every bite."
                </p>
              </div>
            </div>

            {/* Today's Special */}
            <div className="px-4">
              <h3 
                className={`text-sm font-bold mb-3 flex items-center gap-1.5 ${
                  style.layoutMode === 'luxury' ? 'font-serif uppercase tracking-widest text-[#D4A853]' :
                  style.layoutMode === 'japanese' ? 'font-mono uppercase tracking-widest text-black border-b border-black pb-1' : ''
                }`} 
                style={headingStyle}
              >
                Today's Special
              </h3>

              <Link
                href={`/r/${restaurant.slug}/menu`}
                className={`p-4 border flex gap-4 items-center justify-between shadow-sm hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-300 ${style.cardBg} ${style.cardRadius}`}
                style={{ borderColor: restaurant.primaryColor ? `${restaurant.primaryColor}15` : undefined }}
              >
                <div className="flex gap-4 items-center overflow-hidden flex-1">
                  <div 
                    className={`w-14 h-14 bg-zinc-950 border border-white/5 overflow-hidden shrink-0 flex items-center justify-center ${
                      style.layoutMode === 'cafe' ? 'rounded-2xl' :
                      style.layoutMode === 'japanese' ? 'rounded-none border border-black' : 'rounded-lg'
                    }`}
                  >
                    {todaySpecial.image ? (
                      <img src={todaySpecial.image} alt={todaySpecial.name} className="object-cover w-full h-full hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <ChefHat className={`w-5 h-5 ${style.muted}`} />
                    )}
                  </div>
                  <div className="overflow-hidden flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <h4 
                        className={`text-xs truncate ${
                          style.layoutMode === 'luxury' ? 'font-serif font-bold text-white' : 
                          style.layoutMode === 'japanese' ? 'font-mono uppercase tracking-wider text-black font-semibold' : 'font-bold'
                        }`}
                      >
                        {todaySpecial.name}
                      </h4>
                      <span className={`w-2.5 h-2.5 border flex items-center justify-center rounded shrink-0 ${todaySpecial.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${todaySpecial.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                      </span>
                    </div>
                    <p className={`text-[9px] truncate mt-1 ${style.muted}`}>{todaySpecial.description}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <Star className="w-3 h-3 fill-current text-[#D4A853]" />
                      <span 
                        className={`text-[8px] font-bold uppercase tracking-wider ${
                          style.layoutMode === 'luxury' ? 'font-serif' :
                          style.layoutMode === 'japanese' ? 'font-mono' : ''
                        }`} 
                        style={{ color: restaurant.primaryColor || style.accentHex }}
                      >
                        Popular Pick
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-end h-12 shrink-0 pl-2">
                  <span 
                    className="font-serif font-bold text-xs" 
                    style={{ color: restaurant.primaryColor || style.accentHex }}
                  >
                    {restaurant.currencySymbol}{todaySpecial.price.toFixed(2)}
                  </span>
                </div>
              </Link>
            </div>

            {/* Details & Location */}
            <div className="px-4 pb-8 space-y-4 text-left">
              <div className="flex items-center gap-3">
                <span className="h-[1px] flex-1 bg-white/5" />
                <h3 
                  className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500 shrink-0" 
                  style={headingStyle}
                >
                  Guest Directory
                </h3>
                <span className="h-[1px] flex-1 bg-white/5" />
              </div>

              <div className="grid grid-cols-1 gap-3 text-xs">
                {/* Hours & Map */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 border border-white/[0.04] bg-white/[0.01] rounded-2xl flex flex-col justify-between min-h-[90px]">
                    <Clock className="w-4 h-4 text-gray-500 mb-2" style={{ color: restaurant.primaryColor || style.accentHex }} />
                    <div>
                      <span className="block text-[8px] uppercase font-bold tracking-widest text-gray-500">Service Hours</span>
                      <span className="block text-xs font-semibold mt-0.5 text-white">{restaurant.openingHours || '11:00 AM - 11:00 PM'}</span>
                    </div>
                  </div>

                  {restaurant.googleMapsUrl ? (
                    <a 
                      href={restaurant.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] transition-all rounded-2xl flex flex-col justify-between min-h-[90px] group animate-none"
                    >
                      <MapPin className="w-4 h-4 text-gray-500 mb-2 group-hover:scale-105 transition-transform" style={{ color: restaurant.primaryColor || style.accentHex }} />
                      <div>
                        <span className="block text-[8px] uppercase font-bold tracking-widest text-gray-500">Location Guide</span>
                        <span className="block text-xs font-semibold mt-0.5 text-[#D4A853] hover:underline" style={{ color: restaurant.primaryColor || style.accentHex }}>📍 Get Directions</span>
                      </div>
                    </a>
                  ) : (
                    <div className="p-3 border border-white/[0.04] bg-white/[0.01] rounded-2xl flex flex-col justify-between min-h-[90px]">
                      <MapPin className="w-4 h-4 text-gray-500 mb-2" style={{ color: restaurant.primaryColor || style.accentHex }} />
                      <div>
                        <span className="block text-[8px] uppercase font-bold tracking-widest text-gray-500">Location</span>
                        <span className="block text-xs font-semibold mt-0.5 text-white truncate">{restaurant.address || 'Dining Room'}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Details */}
                {(restaurant.phone || restaurant.website || restaurant.address) && (
                  <div className="p-4 border border-white/[0.04] bg-white/[0.01] rounded-2xl space-y-3">
                    {restaurant.address && (
                      <div>
                        <span className="block text-[8px] uppercase font-bold tracking-widest text-gray-500">Address</span>
                        <span className="block text-xs text-gray-300 mt-0.5 leading-relaxed">{restaurant.address}</span>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 pt-1.5 border-t border-white/5">
                      {restaurant.phone && (
                        <a href={`tel:${restaurant.phone}`} className="block hover:opacity-80 transition-opacity">
                          <span className="block text-[8px] uppercase font-bold tracking-widest text-gray-500">Reservations</span>
                          <span className="block text-xs text-white font-medium mt-0.5">{restaurant.phone}</span>
                        </a>
                      )}
                      {restaurant.website && (
                        <a
                          href={restaurant.website.startsWith('http') ? restaurant.website : `https://${restaurant.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block hover:opacity-80 transition-opacity"
                        >
                          <span className="block text-[8px] uppercase font-bold tracking-widest text-gray-500">Gastronomy Web</span>
                          <span className="block text-xs font-medium mt-0.5 truncate text-[#D4A853]" style={{ color: restaurant.primaryColor || style.accentHex }}>
                            {restaurant.website.replace(/https?:\/\/(www\.)?/, '')}
                          </span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
