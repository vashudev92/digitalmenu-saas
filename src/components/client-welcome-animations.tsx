'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Flame, Sparkles, Star, Clock, MapPin, Phone, ChefHat, ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8 mt-6"
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
            className={`p-3 text-center flex flex-col items-center justify-center border transition-all ${style.cardBg} ${style.cardRadius}`}
            style={{ borderColor: restaurant.primaryColor ? `${restaurant.primaryColor}15` : undefined }}
          >
            <b.Icon className="w-4 h-4 mb-1" style={{ color: restaurant.primaryColor || style.accentHex }} />
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
          className={`p-4 border flex gap-4 items-center justify-between shadow-sm active:scale-[0.99] transition-transform ${style.cardBg} ${style.cardRadius}`}
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
                <img src={todaySpecial.image} alt={todaySpecial.name} className="object-cover w-full h-full" />
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
        <h3 
          className={`text-sm font-bold flex items-center gap-1.5 ${
            style.layoutMode === 'luxury' ? 'font-serif uppercase tracking-widest text-[#D4A853]' :
            style.layoutMode === 'japanese' ? 'font-mono uppercase tracking-widest text-black border-b border-black pb-1' : ''
          }`} 
          style={headingStyle}
        >
          Restaurant Details
        </h3>

        <div className="grid grid-cols-1 gap-3.5">
          {/* Hours */}
          <div 
            className={`p-4 border flex items-center gap-4 ${style.cardBg} ${style.cardRadius}`}
            style={{ borderColor: restaurant.primaryColor ? `${restaurant.primaryColor}15` : undefined }}
          >
            <div className="p-2 bg-white/[0.02] rounded-lg border border-white/5">
              <Clock className="w-4 h-4" style={{ color: restaurant.primaryColor || style.accentHex }} />
            </div>
            <div>
              <span className="block text-[8px] uppercase font-bold tracking-widest text-gray-500">Opening Hours</span>
              <span 
                className={`block text-xs font-semibold mt-0.5 ${
                  style.layoutMode === 'japanese' ? 'font-mono' : ''
                }`}
              >
                {restaurant.openingHours || '11:00 AM - 11:00 PM'}
              </span>
            </div>
          </div>

          {/* Address */}
          {restaurant.address && (
            <div 
              className={`p-4 border flex flex-col gap-3.5 ${style.cardBg} ${style.cardRadius}`}
              style={{ borderColor: restaurant.primaryColor ? `${restaurant.primaryColor}15` : undefined }}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/[0.02] rounded-lg border border-white/5">
                  <MapPin className="w-4 h-4" style={{ color: restaurant.primaryColor || style.accentHex }} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-[8px] uppercase font-bold tracking-widest text-gray-500">Physical Location</span>
                  <span className="block text-xs font-semibold mt-0.5 leading-relaxed truncate">{restaurant.address}</span>
                </div>
              </div>

              {restaurant.googleMapsUrl && (
                <a
                  href={restaurant.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/5 text-[10px] font-bold text-center text-gray-300 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  style={{ 
                    borderColor: restaurant.primaryColor ? `${restaurant.primaryColor}20` : undefined,
                    fontFamily: style.layoutMode === 'japanese' ? 'monospace' : undefined,
                    borderRadius: style.layoutMode === 'cafe' ? '9999px' : style.layoutMode === 'japanese' ? '0px' : undefined
                  }}
                >
                  <MapPin className="w-3.5 h-3.5" style={{ color: restaurant.primaryColor || style.accentHex }} />
                  📍 Locate Us
                </a>
              )}
            </div>
          )}

          {/* Contacts info grid */}
          {(restaurant.phone || restaurant.website) && (
            <div 
              className={`p-4 border grid grid-cols-2 gap-4 ${style.cardBg} ${style.cardRadius}`}
              style={{ borderColor: restaurant.primaryColor ? `${restaurant.primaryColor}15` : undefined }}
            >
              {restaurant.phone && (
                <a href={`tel:${restaurant.phone}`} className="flex flex-col p-1 hover:bg-white/[0.02] rounded-lg transition-all">
                  <span className="text-[8px] uppercase font-bold tracking-widest text-gray-500">Phone Contact</span>
                  <span className="text-xs font-semibold mt-1 text-white truncate">{restaurant.phone}</span>
                </a>
              )}
              {restaurant.website && (
                <a
                  href={restaurant.website.startsWith('http') ? restaurant.website : `https://${restaurant.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col p-1 hover:bg-white/[0.02] rounded-lg transition-all"
                >
                  <span className="text-[8px] uppercase font-bold tracking-widest text-gray-500">Website</span>
                  <span className="text-xs font-semibold mt-1 truncate hover:underline text-[#D4A853]" style={{ color: restaurant.primaryColor || style.accentHex }}>
                    {restaurant.website.replace(/https?:\/\/(www\.)?/, '')}
                  </span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
