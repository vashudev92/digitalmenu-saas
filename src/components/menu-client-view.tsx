'use client';

import { useState, useEffect } from 'react';
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
  SlidersHorizontal,
  Menu
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
  // Traditional Zen/Japanese common mappings
  sushi: <Flame className="w-3.5 h-3.5 shrink-0" />,
  sashimi: <UtensilsCrossed className="w-3.5 h-3.5 shrink-0" />,
  ramen: <Soup className="w-3.5 h-3.5 shrink-0" />,
  robata: <Utensils className="w-3.5 h-3.5 shrink-0" />,
  donburi: <Soup className="w-3.5 h-3.5 shrink-0" />,
  dessert: <IceCream className="w-3.5 h-3.5 shrink-0" />,
  drinks: <Wine className="w-3.5 h-3.5 shrink-0" />,
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
      className={`min-h-screen w-full ${style.bg} ${style.text} flex flex-col justify-between max-w-[480px] mx-auto shadow-2xl relative text-left overflow-hidden`}
      style={brandStyles}
    >
      <FontLoader headingFont={fontHeading} bodyFont={fontBody} />

      {/* ==================== JAPANESE ZEN SPLIT-VIEW LAYOUT ==================== */}
      {style.layoutMode === 'japanese' ? (
        <div className="flex flex-col h-screen overflow-hidden">
          {/* Header */}
          <header className={`px-4 pt-4 pb-3 flex items-center justify-between z-30 bg-white/80 backdrop-blur-md border-b ${style.divider}`}>
            <Link
              href={profileSlug ? `/r/${restaurantSlug}?profile=${profileSlug}` : `/r/${restaurantSlug}`}
              className="p-1.5 rounded-full text-black hover:bg-black/5 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>

            <div className="flex-1 flex justify-center min-w-0 px-4">
              <AnimatePresence mode="wait">
                {isSearchOpen ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-[240px]"
                  >
                    <input
                      type="text"
                      value={search}
                      autoFocus
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search drinks & food..."
                      className="w-full pl-3 pr-8 py-1 bg-zinc-100 border border-black/10 rounded-full text-xs focus:outline-none"
                    />
                    {search && (
                      <button 
                        onClick={() => setSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </motion.div>
                ) : (
                  <motion.h1 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-serif text-lg font-bold italic text-black tracking-wide truncate"
                    style={headingStyle}
                  >
                    Our Menu
                  </motion.h1>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-1.5 rounded-full text-black hover:bg-black/5 transition-all"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsInfoOpen(true)}
                className="p-1.5 rounded-full text-black hover:bg-black/5 transition-all"
              >
                <Info className="w-5 h-5" style={{ color: primaryColor || style.accentHex }} />
              </button>
            </div>
          </header>

          {/* Veg-Only Slider under Header */}
          <div className="bg-[#FAF7F2] px-4 py-2 border-b border-black/5 flex items-center justify-between shrink-0">
            <span className="text-[8px] uppercase font-bold tracking-widest text-[#55534E]">Dishes</span>
            <button
              type="button"
              onClick={() => setVegOnly(!vegOnly)}
              className="flex items-center gap-2 cursor-pointer select-none border-none bg-transparent p-0 focus:outline-none"
            >
              <span className="text-[10px] font-semibold text-black">Veg Only</span>
              <span className="relative inline-block w-8 h-4">
                <span className={`block w-8 h-4 rounded-full transition-all relative ${vegOnly ? 'bg-[#A8221E]' : 'bg-zinc-300'}`}>
                  <span className={`absolute top-[2px] left-[2px] bg-white rounded-full h-3 w-3 transition-all block ${vegOnly ? 'translate-x-4' : ''}`} />
                </span>
              </span>
            </button>
          </div>

          {/* Main split viewport */}
          <div className="flex flex-1 overflow-hidden h-[calc(100vh-120px)] relative">
            
            {/* Left Sidebar Categories */}
            <div className="w-[75px] shrink-0 border-r border-[#E6E2D8] bg-white/70 backdrop-blur-md flex flex-col items-center py-4 gap-4 overflow-y-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveCategory('ALL')}
                style={activeCategory === 'ALL' ? { borderLeftColor: primaryColor || '#A8221E' } : {}}
                className={`w-full py-2.5 flex flex-col items-center gap-1 transition-all border-l-2 ${
                  activeCategory === 'ALL'
                    ? 'text-[#A8221E] border-l-[#A8221E] bg-[#A8221E]/5 font-bold'
                    : 'text-[#55534E] border-l-transparent hover:text-black font-semibold'
                }`}
              >
                <Star className={`w-4 h-4 shrink-0 ${activeCategory === 'ALL' ? 'fill-current' : ''}`} />
                <span className="text-[7.5px] uppercase tracking-wider">All</span>
              </button>

              {categories.map((cat) => {
                const isCatActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    style={isCatActive ? { borderLeftColor: primaryColor || '#A8221E' } : {}}
                    className={`w-full py-2.5 flex flex-col items-center gap-1.5 transition-all border-l-2 shrink-0 ${
                      isCatActive
                        ? 'text-[#A8221E] border-l-[#A8221E] bg-[#A8221E]/5 font-bold'
                        : 'text-[#55534E] border-l-transparent hover:text-black font-semibold'
                    }`}
                  >
                    <span className="shrink-0 scale-105">
                      {iconMap[cat.icon] || <Utensils className="w-4 h-4" />}
                    </span>
                    <span className="text-[7px] uppercase tracking-wider truncate max-w-[65px] font-bold text-center leading-tight">
                      {cat.name.replace(/^(Main|Poolside|Rooftop|Lounge)\s+/, '')}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Items Grid */}
            <div className="flex-1 overflow-y-auto px-4 py-4 bg-[#FAF7F2] relative">
              {loading ? (
                <div className="space-y-4 pt-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-3 bg-white border border-[#E6E2D8] rounded-3xl h-20 flex gap-4 items-center animate-pulse">
                      <div className="w-14 h-14 rounded-xl bg-zinc-200" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-zinc-200 rounded w-2/3" />
                        <div className="h-2 bg-zinc-200 rounded w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6 pb-28">
                  {categories
                    .filter((cat) => activeCategory === 'ALL' || activeCategory === cat.id)
                    .map((cat) => {
                      const itemsInCat = getFilteredItems(cat.id);
                      if (itemsInCat.length === 0) return null;

                      return (
                        <div key={cat.id} className="space-y-3.5">
                          {activeCategory === 'ALL' && (
                            <h3 
                              className="font-serif text-xs font-black tracking-widest text-[#1F1F24] border-b border-black/5 pb-1 uppercase text-left flex items-center gap-1.5"
                              style={headingStyle}
                            >
                              <span>{cat.name.replace(/^(Main|Poolside|Rooftop|Lounge)\s+/, '')}</span>
                              <span className="text-[8px] font-sans font-normal tracking-normal text-gray-400">({itemsInCat.length})</span>
                            </h3>
                          )}
                          
                          <div className="space-y-3.5">
                            {itemsInCat.map((item) => {
                              const spicyLevel = getSpicyLevel(item.name, item.description);
                              return (
                                <div
                                  key={item.id}
                                  className="flex p-2.5 gap-4 items-center justify-between border bg-white rounded-[1.8rem] shadow-[0_4px_25px_rgba(168,34,30,0.015)] relative group hover:border-[#A8221E]/15 transition-all duration-300"
                                  style={{ borderColor: '#EAE2D5' }}
                                >
                                  {/* Left image */}
                                  <div className="w-16 h-16 bg-zinc-950 overflow-hidden shrink-0 flex items-center justify-center rounded-2xl relative shadow-sm">
                                    {item.image ? (
                                      <img src={item.image} alt={item.name} className="object-cover w-full h-full" loading="lazy" />
                                    ) : (
                                      <ChefHat className="w-5 h-5 text-zinc-700" />
                                    )}
                                  </div>

                                  {/* Right info */}
                                  <div className="flex-1 flex flex-col justify-between h-16 min-w-0 pr-1.5 relative text-left">
                                    <div className="space-y-0.5 pr-5">
                                      {item.isFeatured && (
                                        <span className="block text-[6.5px] uppercase tracking-widest text-[#A8221E] font-extrabold leading-none mb-0.5">
                                          Chef's Special
                                        </span>
                                      )}
                                      <div className="flex items-center gap-1.5">
                                        <h4 className="font-bold text-xs truncate leading-tight text-[#1F1F24]">{item.name}</h4>
                                        <span className={`w-2.5 h-2.5 border flex items-center justify-center rounded shrink-0 ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                                          <span className={`w-1 h-1 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                                        </span>
                                      </div>
                                      <p className="text-[8.5px] leading-relaxed line-clamp-2 text-[#55534E] font-medium leading-normal pr-1">
                                        {item.description}
                                      </p>
                                    </div>
                                    
                                    <div className="flex items-center justify-between mt-0.5">
                                      <span className="text-[10px] font-bold text-[#A8221E]" style={{ color: primaryColor || '#A8221E' }}>
                                        {currencySymbol}{item.price.toFixed(2)}
                                      </span>
                                      {spicyLevel > 0 && (
                                        <div className="flex gap-0.5">
                                          {[...Array(spicyLevel)].map((_, i) => (
                                            <Flame key={i} className="w-2.5 h-2.5 fill-[#A8221E] text-[#A8221E]" />
                                          ))}
                                        </div>
                                      )}
                                    </div>

                                    {/* Red Plus Button */}
                                    <button 
                                      className="absolute bottom-0 right-0 w-5.5 h-5.5 rounded-full flex items-center justify-center text-white shadow-md active:scale-90 transition-all font-bold"
                                      style={{ backgroundColor: primaryColor || '#A8221E' }}
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}

                  {/* Japanese Zen Footer signoff */}
                  <div className="pt-8 pb-10 text-center flex flex-col items-center gap-1 border-t border-black/5">
                    <span className="font-serif text-[#A8221E] text-xs">いただきます</span>
                    <span className="text-[8.5px] uppercase font-bold tracking-widest text-[#A8221E] leading-none">Itadakimasu</span>
                    <span className="text-[7.5px] text-[#55534E] font-medium">Let's enjoy this meal together.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // ==================== STANDARD FLUID HORIZONTAL LAYOUT ====================
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
                      style.layoutMode === 'cafe' ? 'rounded-2xl' : 'rounded-full'
                    }`}
                  />
                ) : (
                  <ChefHat className="w-5 h-5 mb-0.5" style={{ color: primaryColor || style.accentHex }} />
                )}
                <span
                  className={`font-bold tracking-widest uppercase ${
                    style.layoutMode === 'luxury' ? 'font-serif text-[10px] text-[#D4A853]' : 'text-[10px]'
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
                  placeholder="Search drinks & food..."
                  className={`w-full pl-9 pr-10 py-2.5 text-xs focus:outline-none transition-all ${style.inputBg} ${style.text} border focus:border-opacity-60 ${
                    style.layoutMode === 'cafe' ? 'rounded-full' : 'rounded-xl'
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
                    style.layoutMode === 'cafe' ? 'rounded-full' : 'rounded-lg'
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
                        style.layoutMode === 'cafe' ? 'rounded-full' : 'rounded-lg'
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
                            style.layoutMode === 'luxury' ? 'font-serif text-[#D4A853] uppercase tracking-widest' : ''
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

                      {/* ====== 1. MODERN CAFE (Horizontal list card layout) ====== */}
                      {style.layoutMode === 'cafe' ? (
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
                        // ====== 2. BEACH RESTAURANT (Card Grid Layout) ======
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
                      ) : (
                        // ====== 3. LUXURY / BISTRO / INDIAN (Classic List Layout) ======
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
                                        className={`text-xs truncate ${
                                          style.layoutMode === 'luxury' ? 'font-serif font-bold text-white' : 'font-bold'
                                        }`}
                                      >
                                        {item.name}
                                      </h4>
                                      <span className={`w-2.5 h-2.5 border flex items-center justify-center rounded shrink-0 ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                                      </span>
                                    </div>
                                    <p className={`text-[9px] mt-1 line-clamp-1 ${style.muted}`}>{item.description}</p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                      {spicyLevel > 0 && (
                                        <div className="flex gap-0.5">
                                          {[...Array(spicyLevel)].map((_, i) => (
                                            <Flame key={i} className="w-2.5 h-2.5 fill-red-500 text-red-500" />
                                          ))}
                                        </div>
                                      )}
                                      <span className="text-[7px] text-gray-500 font-mono">15m</span>
                                    </div>
                                  </div>
                                </div>

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
            </div>
          )}
        </div>
      )}

      {/* Persistent Bottom Tab Bar */}
      <nav
        className={`fixed bottom-0 left-0 right-0 mx-auto max-w-[480px] z-40 py-2.5 px-6 flex justify-around items-center backdrop-blur-md border-t border-white/[0.04] no-print ${style.navBg}`}
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 10px)' }}
      >
        <Link
          href={profileSlug ? `/r/${restaurantSlug}?profile=${profileSlug}` : `/r/${restaurantSlug}`}
          className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span className="text-[8px] uppercase font-bold tracking-wider">Home</span>
        </Link>

        <button
          type="button"
          onClick={() => {
            setSearch('');
            setActiveCategory('ALL');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-0.5 transition-colors cursor-pointer text-white font-bold"
          style={{ color: primaryColor || style.accentHex }}
        >
          <BookOpen className="w-4 h-4 fill-current" />
          <span className="text-[8px] uppercase font-bold tracking-wider">Menu</span>
        </button>

        <button
          type="button"
          onClick={() => setIsInfoOpen(true)}
          className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
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
