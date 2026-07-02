'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTheme } from '@/lib/theme-config';
import FontLoader from '@/components/font-loader';
import {
  Search,
  Soup,
  UtensilsCrossed,
  IceCream,
  Wine,
  Pizza,
  Coffee,
  Utensils,
  ChevronLeft,
  ChefHat,
  Star,
  Home,
  BookOpen,
  Info,
  MapPin,
  Phone,
  Globe,
  X,
  Clock,
  Compass
} from 'lucide-react';
import Link from 'next/link';

interface CategoryOption {
  id: string;
  name: string;
  icon: string;
}

interface MenuItemOption {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isVeg: boolean;
  isFeatured: boolean;
  categoryId: string;
}

interface Props {
  restaurantName: string;
  restaurantSlug: string;
  logoUrl: string;
  theme: string;
  currencySymbol?: string;
  fontHeading?: string | null;
  fontBody?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
  favicon?: string | null;
  openingHours?: string | null;
  categories: CategoryOption[];
  menuItems: MenuItemOption[];
  address?: string | null;
  phone?: string | null;
  website?: string | null;
  googleMapsUrl?: string | null;
}

const iconMap: { [key: string]: React.ReactNode } = {
  Sparkles: <Star className="w-3.5 h-3.5 shrink-0 fill-current" />,
  Soup: <Soup className="w-3.5 h-3.5 shrink-0" />,
  UtensilsCrossed: <UtensilsCrossed className="w-3.5 h-3.5 shrink-0" />,
  IceCream: <IceCream className="w-3.5 h-3.5 shrink-0" />,
  Wine: <Wine className="w-3.5 h-3.5 shrink-0" />,
  Pizza: <Pizza className="w-3.5 h-3.5 shrink-0" />,
  Coffee: <Coffee className="w-3.5 h-3.5 shrink-0" />,
  Utensils: <Utensils className="w-3.5 h-3.5 shrink-0" />,
};

export default function MenuClientView({
  restaurantName,
  restaurantSlug,
  logoUrl,
  theme,
  currencySymbol = '₹',
  fontHeading,
  fontBody,
  primaryColor,
  secondaryColor,
  accentColor,
  favicon,
  openingHours,
  categories,
  menuItems,
  address,
  phone,
  website,
  googleMapsUrl,
}: Props) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [vegOnly, setVegOnly] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // Theme configuration
  const style = getTheme(theme);

  // Dynamic Favicon Override with cash-busting parameter
  useEffect(() => {
    const targetFavicon = favicon || logoUrl || '/logo.png';
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = `${targetFavicon}?v=${new Date().getTime()}`;
  }, [favicon, logoUrl]);

  // Brand Colors Styles (CSS Variables injection)
  const brandStyles = {
    '--brand-primary': primaryColor || style.accentHex,
    '--brand-secondary': secondaryColor || style.accentHex,
    '--brand-accent': accentColor || style.accentHex,
    ...(fontBody ? { fontFamily: `'${fontBody}', sans-serif` } : {}),
  } as unknown as React.CSSProperties;

  const headingStyle = fontHeading ? { fontFamily: `'${fontHeading}', serif` } : {};

  const getFilteredItems = (catId: string) => {
    return menuItems.filter((item) => {
      const matchesCategory = item.categoryId === catId;
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      const matchesVeg = !vegOnly || item.isVeg;

      return matchesCategory && matchesSearch && matchesVeg;
    });
  };

  const categoryHasItems = (catId: string) => {
    return getFilteredItems(catId).length > 0;
  };

  // Helper: Get active tab colors dynamically skinned by brand primary color
  const getTabStyles = (isActive: boolean) => {
    if (!isActive) return {};
    
    if (style.layoutMode === 'japanese') {
      return {
        borderBottom: `2px solid ${primaryColor || style.accentHex}`,
        color: primaryColor || style.accentHex,
      };
    }
    
    return {
      backgroundColor: primaryColor || style.accentHex,
      borderColor: primaryColor || style.accentHex,
      color: style.layoutMode === 'indian' ? '#000000' : '#ffffff',
    };
  };

  return (
    <div
      className={`min-h-screen w-full ${style.bg} ${style.text} flex flex-col justify-between max-w-[480px] mx-auto shadow-2xl pb-24 overflow-x-hidden relative text-left`}
      style={brandStyles}
    >
      <FontLoader headingFont={fontHeading} bodyFont={fontBody} />
      
      <div>
        {/* Sticky Header & Category scroll wrapper */}
        <div className={`sticky top-0 z-30 ${style.headerBg} backdrop-blur-md border-b ${style.divider}`}>
          {/* Top Header */}
          <div className="px-4 pt-4 pb-3 flex items-center justify-between">
            <Link
              href={`/r/${restaurantSlug}`}
              className={`p-1.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-gray-400 hover:text-white transition-all`}
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            
            <div className="flex flex-col items-center">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt="Logo" 
                  className={`w-6 h-6 object-cover mb-1 border border-white/5 ${
                    style.layoutMode === 'cafe' ? 'rounded-2xl' : 
                    style.layoutMode === 'japanese' ? 'rounded-none border border-black' : 'rounded-full'
                  }`} 
                />
              ) : (
                <ChefHat className="w-5 h-5 mb-0.5" style={{ color: primaryColor || style.accentHex }} />
              )}
              <span 
                className={`font-bold tracking-widest uppercase ${
                  style.layoutMode === 'luxury' ? 'font-serif text-[10px] text-[#D4A853]' :
                  style.layoutMode === 'japanese' ? 'font-mono text-[10px]' : 'text-[10px]'
                }`}
                style={headingStyle}
              >
                {restaurantName}
              </span>
            </div>
            
            <button
              onClick={() => setIsInfoOpen(true)}
              className="p-1.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              <Info className="w-5 h-5" style={{ color: primaryColor || style.accentHex }} />
            </button>
          </div>

          {/* Search bar */}
          <div className="px-4 pb-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search dishes..."
                className={`w-full pl-9 pr-4 py-2.5 text-xs focus:outline-none transition-all ${style.inputBg} ${style.text} border focus:border-opacity-60 ${
                  style.layoutMode === 'cafe' ? 'rounded-full' :
                  style.layoutMode === 'japanese' ? 'rounded-none border-black' : 'rounded-xl'
                }`}
                style={{ borderColor: primaryColor ? `${primaryColor}20` : undefined }}
              />
            </div>
          </div>

          {/* Category Navigation Bar */}
          <div className="border-t border-white/[0.04] bg-inherit">
            <div className="overflow-x-auto flex flex-row whitespace-nowrap scrollbar-none gap-2 px-4 py-2.5 scroll-smooth">
              <button
                type="button"
                onClick={() => setActiveCategory('ALL')}
                style={getTabStyles(activeCategory === 'ALL')}
                className={`px-3.5 py-2 text-[10px] font-bold uppercase flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                  activeCategory === 'ALL'
                    ? 'shadow border border-white/5'
                    : `${style.catInactive} border border-white/5`
                } ${
                  style.layoutMode === 'cafe' ? 'rounded-full' :
                  style.layoutMode === 'japanese' ? 'rounded-none border-transparent' : 'rounded-lg'
                }`}
              >
                <Star className="w-3 h-3 shrink-0 fill-current" />
                <span>All</span>
              </button>

              {categories.map((cat) => {
                const isCatActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    style={getTabStyles(isCatActive)}
                    className={`px-3.5 py-2 text-[10px] font-bold uppercase flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                      isCatActive
                        ? 'shadow border border-white/5'
                        : `${style.catInactive} border border-white/5`
                    } ${
                      style.layoutMode === 'cafe' ? 'rounded-full' :
                      style.layoutMode === 'japanese' ? 'rounded-none border-transparent' : 'rounded-lg'
                    }`}
                  >
                    <span className="shrink-0">
                      {iconMap[cat.icon] || <Utensils className="w-3 h-3" />}
                    </span>
                    <span>{cat.name.replace(/^(Main|Poolside|Rooftop|Lounge)\s+/, '')}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Veg-Only and Results Info */}
        <div className="px-4 pb-2 pt-3 flex items-center justify-between">
          <span className={`text-[8px] uppercase font-bold tracking-widest ${style.muted}`}>
            Dishes
          </span>
          
          <button 
            type="button"
            onClick={() => setVegOnly(!vegOnly)}
            className="flex items-center gap-2 cursor-pointer select-none border-none bg-transparent p-0 focus:outline-none"
          >
            <span className={`text-[10px] font-semibold ${style.text}`}>Veg Only</span>
            <span className="relative inline-block w-8 h-4">
              <span
                className={`block w-8 h-4 rounded-full transition-all relative ${vegOnly ? 'bg-green-600' : 'bg-zinc-800'}`}
                style={vegOnly && primaryColor ? { backgroundColor: primaryColor } : {}}
              >
                <span className={`absolute top-[2px] left-[2px] bg-white rounded-full h-3 w-3 transition-all block ${
                  vegOnly ? 'translate-x-4' : ''
                }`}></span>
              </span>
            </span>
          </button>
        </div>

        {/* Categories / Dishes Loop */}
        <div className="px-4 py-2 space-y-8">
          {categories
            .filter((cat) => activeCategory === 'ALL' || activeCategory === cat.id)
            .map((cat) => {
              const itemsInCat = getFilteredItems(cat.id);
              if (itemsInCat.length === 0) return null;

              return (
                <div key={cat.id} className="space-y-4">
                  {/* Category Title Header */}
                  <div className={`flex items-center justify-between border-b ${style.divider} pb-1.5`}>
                    <h3 
                      className={`text-sm font-bold tracking-wide ${
                        style.layoutMode === 'luxury' ? 'font-serif text-[#D4A853] uppercase tracking-widest' :
                        style.layoutMode === 'japanese' ? 'font-mono text-black uppercase tracking-wider' : ''
                      }`} 
                      style={headingStyle}
                    >
                      {cat.name.replace(/^(Main|Poolside|Rooftop|Lounge)\s+/, '')}
                      <span className={`text-[9px] ml-2 font-normal font-sans tracking-normal ${style.muted}`}>
                        ({itemsInCat.length})
                      </span>
                    </h3>
                  </div>

                  {/* Themes-specific Visual Layout Engine */}
                  
                  {/* ====== 1. MODERN CAFE / BEACH RESTAURANT (Card Grid Layout) ====== */}
                  {(style.layoutMode === 'cafe' || style.layoutMode === 'beach') ? (
                    <div className="grid grid-cols-2 gap-4">
                      {itemsInCat.map((item) => (
                        <div
                          key={item.id}
                          className={`flex flex-col overflow-hidden border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${style.cardBg} ${style.cardRadius}`}
                          style={{ borderColor: primaryColor ? `${primaryColor}15` : undefined }}
                        >
                          {/* Image */}
                          <div className="aspect-[4/3] w-full bg-zinc-950 overflow-hidden relative shrink-0">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                                <ChefHat className="w-5 h-5 text-zinc-700" />
                              </div>
                            )}
                            
                            {/* Featured Tag */}
                            {item.isFeatured && (
                              <span
                                className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[8px] font-bold text-black"
                                style={{ backgroundColor: primaryColor || style.accentHex }}
                              >
                                Featured
                              </span>
                            )}

                            {/* Veg indicator */}
                            <span className={`absolute top-2 right-2 w-4 h-4 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center border ${
                              item.isVeg ? 'border-green-500' : 'border-red-500'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                            </span>
                          </div>
                          
                          <div className="p-3 flex-1 flex flex-col justify-between gap-2">
                            <div className="text-left">
                              <h4 className="font-bold text-xs truncate leading-tight">{item.name}</h4>
                              <p className={`text-[8px] leading-relaxed mt-1 line-clamp-2 ${style.muted}`}>
                                {item.description}
                              </p>
                            </div>

                            <span className="font-serif font-bold text-xs text-left" style={{ color: primaryColor || style.accentHex }}>
                              {currencySymbol}{item.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : style.layoutMode === 'japanese' ? (
                    // ====== 2. JAPANESE MINIMAL (Stark Zen list) ======
                    <div className="divide-y divide-black/15">
                      {itemsInCat.map((item) => (
                        <div
                          key={item.id}
                          className="py-3.5 flex gap-4 items-center justify-between bg-transparent border-none"
                        >
                          <div className="flex gap-4 items-center overflow-hidden flex-1 text-left">
                            <div className="w-12 h-12 bg-zinc-950 overflow-hidden shrink-0 flex items-center justify-center border border-black rounded-none">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-300" />
                              ) : (
                                <ChefHat className="w-4 h-4 text-zinc-500" />
                              )}
                            </div>
                            
                            <div className="overflow-hidden flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-mono text-xs uppercase font-black tracking-wider truncate">{item.name}</h4>
                                <span className={`w-2.5 h-2.5 border flex items-center justify-center rounded shrink-0 ${
                                  item.isVeg ? 'border-green-600' : 'border-red-600'
                                }`}>
                                  <span className={`w-1 h-1 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                                </span>
                              </div>
                              <p className="text-[8px] leading-relaxed mt-0.5 line-clamp-1 opacity-60">
                                {item.description}
                              </p>
                            </div>
                          </div>

                          <span className="font-mono text-xs font-bold tracking-widest pl-3 shrink-0" style={{ color: primaryColor || style.accentHex }}>
                            {currencySymbol}{item.price.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // ====== 3. LUXURY / BISTRO / INDIAN (Classic Premium List Card Layout) ======
                    <div className="space-y-3.5">
                      {itemsInCat.map((item) => (
                        <div
                          key={item.id}
                          className={`p-4 border flex gap-4 items-center justify-between transition-all duration-300 ${style.cardBg} ${style.cardRadius}`}
                          style={{ borderColor: primaryColor ? `${primaryColor}15` : undefined }}
                        >
                          {/* Image */}
                          <div className="flex gap-3.5 items-center overflow-hidden flex-1 text-left">
                            <div className={`w-16 h-16 bg-zinc-950 overflow-hidden shrink-0 flex items-center justify-center border border-white/5 ${
                              style.layoutMode === 'bistro' ? 'rounded-2xl' : 'rounded-xl'
                            }`}>
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                              ) : (
                                <ChefHat className={`w-5 h-5 ${style.muted}`} />
                              )}
                            </div>
                            
                            <div className="overflow-hidden flex-1">
                              <div className="flex items-center gap-2">
                                <h4 
                                  className={`text-xs truncate leading-tight ${
                                    style.layoutMode === 'luxury' ? 'font-serif font-bold text-white' : 'font-bold'
                                  }`}
                                >
                                  {item.name}
                                </h4>
                                <span className={`w-2.5 h-2.5 border flex items-center justify-center rounded shrink-0 ${
                                  item.isVeg ? 'border-green-600' : 'border-red-600'
                                }`}>
                                  <span className={`w-1 h-1 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                                </span>
                              </div>
                              <p className={`text-[9px] leading-relaxed mt-1 line-clamp-2 ${style.muted}`}>
                                {item.description}
                              </p>
                              
                              {item.isFeatured && (
                                <span
                                  className="inline-flex items-center gap-0.5 mt-1.5 px-2 py-0.5 text-[8px] font-bold text-black uppercase tracking-wider rounded"
                                  style={{ backgroundColor: primaryColor || style.accentHex }}
                                >
                                  Featured
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Price */}
                          <div className="flex flex-col items-end justify-end h-12 shrink-0 pl-2">
                            <span 
                              className="font-serif font-bold text-xs" 
                              style={{ color: primaryColor || style.accentHex }}
                            >
                              {currencySymbol}{item.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

          {/* Empty state fallback */}
          {categories.filter((cat) => activeCategory === 'ALL' || activeCategory === cat.id).every((cat) => !categoryHasItems(cat.id)) && (
            <div className="text-center py-16 text-gray-500">
              <Compass className="w-8 h-8 mx-auto text-gray-700 mb-3" />
              <p className="text-xs">No dishes found matching your current filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Navigation Bar */}
      <nav className={`fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[480px] z-40 backdrop-blur-md border-t px-6 py-4.5 flex items-center justify-between ${style.navBg}`}>
        <Link
          href={`/r/${restaurantSlug}`}
          className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors"
        >
          <Home className="w-4 h-4" />
          <span className="text-[8px] uppercase font-bold tracking-wider">Home</span>
        </Link>

        <Link
          href={`/r/${restaurantSlug}/menu`}
          className="flex flex-col items-center gap-1 transition-colors"
          style={{ color: primaryColor || style.accentHex }}
        >
          <BookOpen className="w-4 h-4 fill-current" />
          <span className="text-[8px] uppercase font-bold tracking-wider">Menu</span>
        </Link>

        <button
          type="button"
          onClick={() => setIsInfoOpen(true)}
          className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors cursor-pointer"
        >
          <Info className="w-4 h-4" />
          <span className="text-[8px] uppercase font-bold tracking-wider">Info</span>
        </button>
      </nav>

      {/* INFO DRAWER / MODAL */}
      <AnimatePresence>
        {isInfoOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/85 backdrop-blur-sm no-print">
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className={`w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6 relative border border-white/5 ${style.cardBg} ${style.bg}`} 
              style={{ backdropFilter: 'blur(20px)' }}
            >
              <button
                onClick={() => setIsInfoOpen(false)}
                className="absolute top-5 right-5 p-1 rounded-lg text-gray-500 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 
                className="text-lg font-bold mb-6 border-b pb-2 text-left" 
                style={{ 
                  ...headingStyle, 
                  color: primaryColor || style.accentHex, 
                  borderColor: primaryColor ? `${primaryColor}15` : undefined 
                }}
              >
                Restaurant Info
              </h3>

              <div className="space-y-5 text-sm text-left">
                <div className="flex items-start gap-3">
                  <ChefHat className="w-4.5 h-4.5 shrink-0 mt-0.5" style={{ color: primaryColor || style.accentHex }} />
                  <div>
                    <h4 className={`font-semibold ${style.text}`}>{restaurantName}</h4>
                    <span className={`text-[10px] italic ${style.muted}`}>Premium Contactless Diner</span>
                  </div>
                </div>

                {/* Opening Hours */}
                <div className="flex items-start gap-3">
                  <Clock className="w-4.5 h-4.5 shrink-0 mt-0.5" style={{ color: primaryColor || style.accentHex }} />
                  <div>
                    <h4 className={`font-semibold ${style.text}`}>Opening Hours</h4>
                    <span className={`text-xs ${style.muted}`}>{openingHours || '11:00 AM - 11:00 PM'}</span>
                  </div>
                </div>

                {address && (
                  <div className={`flex items-start gap-3 ${style.muted}`}>
                    <MapPin className="w-4.5 h-4.5 shrink-0 mt-0.5" style={{ color: primaryColor || style.accentHex }} />
                    {googleMapsUrl ? (
                      <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className={`text-xs leading-relaxed hover:underline ${style.muted}`}>
                        {address}
                      </a>
                    ) : (
                      <p className="text-xs leading-relaxed">
                        {address}
                      </p>
                    )}
                  </div>
                )}

                {phone && (
                  <div className={`flex items-center gap-3 ${style.muted}`}>
                    <Phone className="w-4.5 h-4.5 shrink-0" style={{ color: primaryColor || style.accentHex }} />
                    <a href={`tel:${phone}`} className={`text-xs hover:underline ${style.muted}`}>{phone}</a>
                  </div>
                )}

                {website && (
                  <div className={`flex items-center gap-3 ${style.muted}`}>
                    <Globe className="w-4.5 h-4.5 shrink-0" style={{ color: primaryColor || style.accentHex }} />
                    <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer" className={`text-xs hover:underline`} style={{ color: primaryColor || style.accentHex }}>
                      {website.replace(/https?:\/\/(www\.)?/, '')}
                    </a>
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsInfoOpen(false)}
                className={`w-full py-3 mt-6 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer ${style.primaryBtn}`}
                style={{
                  background: primaryColor
                    ? `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor || primaryColor} 100%)`
                    : undefined,
                  color: primaryColor ? '#000000' : undefined,
                  borderRadius: style.layoutMode === 'cafe' ? '9999px' : style.layoutMode === 'japanese' ? '0px' : undefined
                }}
              >
                Close Info
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
