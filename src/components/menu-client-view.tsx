'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTheme, getContrastColor } from '@/lib/theme-config';
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
  Compass,
  Flame,
  SlidersHorizontal
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
  profileSlug?: string;
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

// Shimmer Loader Component
function MenuSkeleton() {
  return (
    <div className="space-y-6 p-4">
      {/* Category Pills Shimmer */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 w-20 rounded-full skeleton shrink-0" />
        ))}
      </div>
      {/* Cards Shimmer */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border border-white/[0.04] bg-white/[0.01] rounded-2xl flex gap-4 items-center">
            <div className="w-16 h-16 rounded-xl skeleton shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 skeleton rounded w-2/3" />
              <div className="h-2.5 skeleton rounded w-full" />
              <div className="h-3 skeleton rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MenuClientView({
  restaurantName,
  restaurantSlug,
  profileSlug,
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
  const [loading, setLoading] = useState(true);

  const style = getTheme(theme);

  // Dynamic Favicon Override
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 850);
    return () => clearTimeout(timer);
  }, []);

  // Brand Styles mapping
  const brandStyles = {
    '--brand-primary': primaryColor || style.accentHex,
    '--brand-secondary': secondaryColor || style.accentHex,
    '--brand-accent': accentColor || style.accentHex,
    ...(fontBody ? { fontFamily: `'${fontBody}', sans-serif` } : {}),
  } as unknown as React.CSSProperties;

  const headingStyle = fontHeading ? { fontFamily: `'${fontHeading}', serif` } : {};

  // Filter Items in-place
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

  const getTabStyles = (isActive: boolean) => {
    if (!isActive) return {};
    if (style.layoutMode === 'japanese') {
      return {
        borderBottom: `2px solid ${primaryColor || style.accentHex}`,
        color: primaryColor || style.accentHex,
      };
    }
    const activeBg = primaryColor || style.accentHex;
    const textContrast = getContrastColor(activeBg).color;
    return {
      backgroundColor: activeBg,
      borderColor: activeBg,
      color: textContrast,
    };
  };

  const getSpicyLevel = (name: string, desc: string) => {
    const text = (name + ' ' + desc).toLowerCase();
    if (text.includes('triple spicy') || text.includes('extra hot') || text.includes('schezwan')) return 3;
    if (text.includes('spicy') || text.includes('chili') || text.includes('chilli') || text.includes('hot')) return 2;
    if (text.includes('pepper') || text.includes('masala')) return 1;
    return 0;
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
              href={profileSlug ? `/r/${restaurantSlug}?profile=${profileSlug}` : `/r/${restaurantSlug}`}
              className="p-1.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-gray-400 hover:text-white transition-all"
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

          {/* Search bar (Filters menu list in-place directly) */}
          <div className="px-4 pb-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search drinks & food..."
                className={`w-full pl-9 pr-10 py-2.5 text-xs focus:outline-none transition-all ${style.inputBg} ${style.text} border focus:border-opacity-60 ${
                  style.layoutMode === 'cafe' ? 'rounded-full' :
                  style.layoutMode === 'japanese' ? 'rounded-none border-black' : 'rounded-xl'
                }`}
                style={{ borderColor: primaryColor ? `${primaryColor}20` : undefined }}
              />
              {style.layoutMode === 'cafe' ? (
                <button className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: primaryColor || style.accentHex }}>
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </button>
              ) : search ? (
                <button 
                  onClick={() => setSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : null}
            </div>
          </div>

          {/* Category Navigation Bar (Filters categories in-place) */}
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
                <span>All ({menuItems.length})</span>
              </button>

              {categories.map((cat) => {
                const isCatActive = activeCategory === cat.id;
                const totalCatItems = menuItems.filter(item => item.categoryId === cat.id).length;
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
                    <span>{cat.name.replace(/^(Main|Poolside|Rooftop|Lounge)\s+/, '')} ({totalCatItems})</span>
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
        {loading ? (
          <MenuSkeleton />
        ) : (
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
                        className={`text-sm font-bold tracking-wide flex items-center gap-2 ${
                          style.layoutMode === 'luxury' ? 'font-serif text-[#D4A853] uppercase tracking-widest' :
                          style.layoutMode === 'japanese' ? 'font-mono text-black uppercase tracking-wider' : ''
                        }`}
                        style={headingStyle}
                      >
                        <span className="text-gray-400 shrink-0">
                          {iconMap[cat.icon] || <Utensils className="w-3.5 h-3.5" />}
                        </span>
                        <span>{cat.name.replace(/^(Main|Poolside|Rooftop|Lounge)\s+/, '')}</span>
                        <span className={`text-[9px] ml-2 font-normal font-sans tracking-normal ${style.muted}`}>
                          ({itemsInCat.length})
                        </span>
                      </h3>
                    </div>

                    {/* ====== 1. MODERN CAFE / BEACH RESTAURANT (Card Grid Layout) ====== */}
                    {style.layoutMode === 'cafe' ? (
                      // ====== 1A. MODERN CAFE (Horizontal list card layout) ======
                      <div className="space-y-4">
                        {itemsInCat.map((item) => {
                          const spicyLevel = getSpicyLevel(item.name, item.description);
                          return (
                            <div
                              key={item.id}
                              className={`flex p-3 gap-4 items-center justify-between border transition-all duration-300 hover:shadow-[0_8px_30px_rgba(92,62,33,0.04)] active:scale-[0.98] ${style.cardBg} ${style.cardRadius}`}
                              style={{ borderColor: primaryColor ? `${primaryColor}15` : undefined }}
                            >
                              {/* Left: Square Image */}
                              <div className="w-20 h-20 bg-zinc-950 overflow-hidden shrink-0 flex items-center justify-center rounded-2xl relative">
                                {item.image ? (
                                  <img src={item.image} alt={item.name} className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" loading="lazy" />
                                ) : (
                                  <ChefHat className="w-5 h-5 text-zinc-700" />
                                )}
                                <span className={`absolute bottom-1 right-1 w-3 h-3 bg-black/60 backdrop-blur-md rounded-md flex items-center justify-center border ${
                                  item.isVeg ? 'border-green-500' : 'border-red-500'
                                }`}>
                                  <span className={`w-1 h-1 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                                </span>
                              </div>

                              {/* Right: Info */}
                              <div className="flex-1 flex flex-col justify-between h-20 text-left min-w-0 pr-1 relative">
                                <div className="space-y-0.5 pr-6">
                                  <h4 className={`font-bold text-xs truncate leading-tight ${style.text}`}>{item.name}</h4>
                                  <p className={`text-[8.5px] leading-relaxed line-clamp-2 ${style.text} opacity-75 font-medium`}>
                                    {item.description}
                                  </p>
                                </div>

                                <div className="flex items-center justify-between mt-1">
                                  <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${style.priceBadge}`}>
                                    {currencySymbol}{item.price.toFixed(2)}
                                  </span>
                                  {spicyLevel > 0 && (
                                    <div className="flex gap-0.5">
                                      {[...Array(spicyLevel)].map((_, i) => (
                                        <Flame key={i} className="w-2.5 h-2.5 fill-red-500 text-red-500" />
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Top Right Heart Icon */}
                                <button className="absolute top-0 right-0 p-1 text-gray-400 hover:text-red-500 transition-colors">
                                  <svg className="w-3.5 h-3.5 fill-none stroke-current animate-none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : style.layoutMode === 'beach' ? (
                      // ====== 1B. BEACH RESTAURANT (Card Grid Layout) ======
                      <div className="grid grid-cols-2 gap-4">
                        {itemsInCat.map((item) => {
                          const spicyLevel = getSpicyLevel(item.name, item.description);
                          return (
                            <div
                              key={item.id}
                              className={`flex flex-col overflow-hidden border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] ${style.cardBg} ${style.cardRadius}`}
                              style={{ borderColor: primaryColor ? `${primaryColor}15` : undefined }}
                            >
                              {/* Image */}
                              <div className="aspect-[4/3] w-full bg-zinc-950 overflow-hidden relative shrink-0">
                                {item.image ? (
                                  <img src={item.image} alt={item.name} className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" loading="lazy" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                                    <ChefHat className="w-5 h-5 text-zinc-700" />
                                  </div>
                                )}

                                {item.isFeatured && (
                                  <span
                                    className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[8px] font-bold text-black"
                                    style={{ backgroundColor: primaryColor || style.accentHex }}
                                  >
                                    Featured
                                  </span>
                                )}

                                {/* Veg indicator */}
                                <span className={`absolute top-2 right-2 w-4 h-4 bg-black/60 backdrop-blur-md rounded-md flex items-center justify-center border ${
                                  item.isVeg ? 'border-green-500' : 'border-red-500'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                                </span>
                              </div>

                              <div className="p-3 flex-1 flex flex-col justify-between gap-2">
                                <div className="text-left space-y-1">
                                  <h4 className={`font-bold text-xs truncate leading-tight ${style.text}`}>{item.name}</h4>
                                  <p className={`text-[8px] leading-relaxed line-clamp-2 ${style.text} opacity-75 font-medium`}>
                                    {item.description}
                                  </p>
                                </div>

                                <div className="flex items-center justify-between mt-1">
                                  <span className="font-serif font-bold text-xs" style={{ color: primaryColor || style.accentHex }}>
                                    {currencySymbol}{item.price.toFixed(2)}
                                  </span>

                                  <div className="flex items-center gap-1">
                                    {spicyLevel > 0 && (
                                      <div className="flex gap-0.5" title={`${spicyLevel} Flame Hot`}>
                                        {[...Array(spicyLevel)].map((_, i) => (
                                          <Flame key={i} className="w-2.5 h-2.5 fill-red-500 text-red-500" />
                                        ))}
                                      </div>
                                    )}
                                    <span className="text-[7px] text-gray-500 font-mono">15m prep</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : style.layoutMode === 'japanese' ? (
                      // ====== 2. JAPANESE MINIMAL (Stark Zen list) ======
                      <div className="divide-y divide-black/15">
                        {itemsInCat.map((item) => {
                          const spicyLevel = getSpicyLevel(item.name, item.description);
                          return (
                            <div
                              key={item.id}
                              className="py-3.5 flex gap-4 items-center justify-between bg-transparent border-none"
                            >
                              <div className="flex gap-4 items-center overflow-hidden flex-1 text-left">
                                <div className="w-14 h-14 bg-zinc-950 overflow-hidden shrink-0 flex items-center justify-center border border-black rounded-none">
                                  {item.image ? (
                                    <img src={item.image} alt={item.name} className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-300" loading="lazy" />
                                  ) : (
                                    <ChefHat className="w-4 h-4 text-zinc-500" />
                                  )}
                                </div>

                                <div className="overflow-hidden flex-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className={`font-mono text-xs uppercase font-black tracking-wider truncate ${style.text}`}>{item.name}</h4>
                                    <span className={`w-2.5 h-2.5 border flex items-center justify-center rounded-none shrink-0 ${
                                      item.isVeg ? 'border-green-600' : 'border-red-600'
                                    }`}>
                                      <span className={`w-1.5 h-1.5 rounded-none ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                                    </span>
                                  </div>
                                  <p className={`text-[8px] leading-relaxed mt-0.5 line-clamp-1 ${style.text} opacity-75 font-medium`}>
                                    {item.description}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    {spicyLevel > 0 && (
                                      <div className="flex gap-0.5">
                                        {[...Array(spicyLevel)].map((_, i) => (
                                          <Flame key={i} className="w-2.5 h-2.5 text-black fill-black" />
                                        ))}
                                      </div>
                                    )}
                                    <span className="text-[7px] text-gray-500 font-mono">15 min</span>
                                  </div>
                                </div>
                              </div>

                              <span className="font-mono text-xs font-bold tracking-widest pl-3 shrink-0" style={{ color: primaryColor || style.accentHex }}>
                                {currencySymbol}{item.price.toFixed(2)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      // ====== 3. LUXURY / BISTRO / INDIAN ======
                      <div className="space-y-4">
                        {itemsInCat.map((item) => {
                          const spicyLevel = getSpicyLevel(item.name, item.description);
                          return (
                            <div
                              key={item.id}
                              className={`p-4 border flex gap-4 items-center justify-between transition-all duration-300 hover:border-[#D4A853]/30 active:scale-[0.99] ${style.cardBg} ${style.cardRadius}`}
                              style={{ borderColor: primaryColor ? `${primaryColor}15` : undefined }}
                            >
                              {/* Image */}
                              <div className="flex gap-4 items-center overflow-hidden flex-1 text-left">
                                <div className={`w-16 h-16 bg-zinc-950 overflow-hidden shrink-0 flex items-center justify-center border border-white/5 ${
                                  style.layoutMode === 'bistro' ? 'rounded-2xl' : 'rounded-xl'
                                }`}>
                                  {item.image ? (
                                    <img src={item.image} alt={item.name} className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" loading="lazy" />
                                  ) : (
                                    <ChefHat className={`w-5 h-5 ${style.muted}`} />
                                  )}
                                </div>

                                <div className="overflow-hidden flex-1">
                                  <div className="flex items-center gap-2">
                                    <h4
                                      className={`text-xs truncate leading-tight font-bold ${style.text} ${
                                        style.layoutMode === 'luxury' ? 'font-serif' : ''
                                      }`}
                                    >
                                      {item.name}
                                    </h4>
                                    <span className={`w-2.5 h-2.5 border flex items-center justify-center rounded shrink-0 ${
                                      item.isVeg ? 'border-green-600' : 'border-red-600'
                                    }`}>
                                      <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                                    </span>
                                  </div>

                                  <p className={`text-[9px] leading-relaxed mt-1 line-clamp-2 ${style.text} opacity-75 font-medium`}>
                                    {item.description}
                                  </p>

                                  <div className="flex items-center gap-2 mt-2">
                                    {item.isFeatured && (
                                      <span
                                        className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[8px] font-bold text-black uppercase tracking-wider rounded"
                                        style={{ backgroundColor: primaryColor || style.accentHex }}
                                      >
                                        Chef Recommended
                                      </span>
                                    )}
                                    {spicyLevel > 0 && (
                                      <div className="flex gap-0.5" title={`${spicyLevel} Flame Hot`}>
                                        {[...Array(spicyLevel)].map((_, i) => (
                                          <Flame key={i} className="w-2.5 h-2.5 fill-red-500 text-red-500" />
                                        ))}
                                      </div>
                                    )}
                                    <span className="text-[7.5px] text-gray-500 font-mono bg-white/[0.02] border border-white/5 px-1.5 py-0.5 rounded">15m prep</span>
                                  </div>
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
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

            {/* Empty state fallback */}
            {categories.filter((cat) => activeCategory === 'ALL' || activeCategory === cat.id).every((cat) => !categoryHasItems(cat.id)) && (
              <div className="text-center py-16 text-gray-500 space-y-4">
                <Compass className="w-12 h-12 mx-auto text-gray-700 mb-1" />
                <h3 className="font-serif text-sm font-bold text-white">We couldn't find that dish</h3>
                <p className="text-[10px] max-w-xs mx-auto leading-relaxed">No dishes match your selected filter criteria. Try adjusting the toggles or keywords.</p>
                <button
                  type="button"
                  onClick={() => { setVegOnly(false); setSearch(''); setActiveCategory('ALL'); }}
                  className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-[10px] font-bold uppercase tracking-wider text-white cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sticky Bottom Navigation Bar */}
      <nav className={`fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[480px] z-40 backdrop-blur-md border-t px-6 py-4.5 flex items-center justify-between ${style.navBg}`}>
        <Link
          href={profileSlug ? `/r/${restaurantSlug}?profile=${profileSlug}` : `/r/${restaurantSlug}`}
          className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors"
        >
          <Home className="w-4 h-4" />
          <span className="text-[8px] uppercase font-bold tracking-wider">Home</span>
        </Link>

        <Link
          href={profileSlug ? `/r/${restaurantSlug}/${profileSlug}` : `/r/${restaurantSlug}/menu`}
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
                  color: primaryColor ? getContrastColor(primaryColor).color : undefined,
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
