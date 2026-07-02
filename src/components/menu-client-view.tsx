'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
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
  Compass,
  Sparkles,
  Flame,
  ArrowRight
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [vegOnly, setVegOnly] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const style = getTheme(theme);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

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

  // Load Recent Searches
  useEffect(() => {
    const saved = localStorage.getItem('recent_menu_searches');
    if (saved) setRecentSearches(JSON.parse(saved));
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 850);
    return () => clearTimeout(timer);
  }, []);

  // Save Recent Search
  const addRecentSearch = (query: string) => {
    if (!query.trim()) return;
    const filtered = recentSearches.filter((s) => s !== query.trim());
    const next = [query.trim(), ...filtered].slice(0, 5);
    setRecentSearches(next);
    localStorage.setItem('recent_menu_searches', JSON.stringify(next));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent_menu_searches');
  };

  // Brand Styles mapping
  const brandStyles = {
    '--brand-primary': primaryColor || style.accentHex,
    '--brand-secondary': secondaryColor || style.accentHex,
    '--brand-accent': accentColor || style.accentHex,
    ...(fontBody ? { fontFamily: `'${fontBody}', sans-serif` } : {}),
  } as unknown as React.CSSProperties;

  const headingStyle = fontHeading ? { fontFamily: `'${fontHeading}', serif` } : {};

  // Filter Items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      const matchesVeg = !vegOnly || item.isVeg;
      return matchesSearch && matchesVeg;
    });
  }, [menuItems, search, vegOnly]);

  // Categories list having items after filters
  const activeCategories = useMemo(() => {
    return categories.filter((cat) =>
      filteredItems.some((item) => item.categoryId === cat.id)
    );
  }, [categories, filteredItems]);

  // Scrollspy auto-tracking
  useEffect(() => {
    if (loading || isSearchOpen || isScrollingRef.current) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180; // offset sticky header

      if (scrollPosition < 300) {
        setActiveCategory('ALL');
        return;
      }

      for (const cat of activeCategories) {
        const element = document.getElementById(`cat-section-${cat.id}`);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveCategory(cat.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeCategories, loading, isSearchOpen]);

  // Smooth Scroll Trigger
  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId);
    if (catId === 'ALL') {
      isScrollingRef.current = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => { isScrollingRef.current = false; }, 800);
      return;
    }

    const element = document.getElementById(`cat-section-${catId}`);
    if (element) {
      isScrollingRef.current = true;
      const offset = 148; // category sticky header offset
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
      setTimeout(() => { isScrollingRef.current = false; }, 800);
    }
  };

  // Match Highlighter helper
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={i} className="text-[#D4A853] font-bold" style={{ color: primaryColor || '#D4A853' }}>
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

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

  // Spicy indicator helper (determines spicy level based on text details)
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
        {/* Sticky Header & Categories Navigation */}
        <div className={`sticky top-0 z-30 ${style.headerBg} backdrop-blur-md border-b ${style.divider}`}>
          {/* Header Row */}
          <div className="px-4 pt-4 pb-3 flex items-center justify-between">
            <Link
              href={`/r/${restaurantSlug}`}
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

          {/* Trigger search overlay */}
          <div className="px-4 pb-3">
            <div 
              onClick={() => setIsSearchOpen(true)}
              className={`w-full pl-3.5 pr-4 py-2.5 flex items-center gap-2.5 text-xs text-gray-400 hover:text-gray-200 transition-all cursor-pointer ${style.inputBg} border ${
                style.layoutMode === 'cafe' ? 'rounded-full' :
                style.layoutMode === 'japanese' ? 'rounded-none border-black' : 'rounded-xl'
              }`}
              style={{ borderColor: primaryColor ? `${primaryColor}20` : undefined }}
            >
              <Search className="w-4 h-4 shrink-0" />
              <span>Search delicacies, desserts, drinks...</span>
            </div>
          </div>

          {/* Category tabs */}
          <div className="border-t border-white/[0.04] bg-inherit">
            <div 
              ref={scrollContainerRef}
              className="overflow-x-auto flex flex-row whitespace-nowrap scrollbar-none gap-2 px-4 py-2.5 scroll-smooth"
            >
              <button
                type="button"
                onClick={() => scrollToCategory('ALL')}
                style={getTabStyles(activeCategory === 'ALL')}
                className={`px-4 py-2 text-[10px] font-bold uppercase flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
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
                    onClick={() => scrollToCategory(cat.id)}
                    style={getTabStyles(isCatActive)}
                    className={`px-4 py-2 text-[10px] font-bold uppercase flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
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

        {/* Veg Toggle Bar */}
        <div className="px-4 pb-2 pt-3 flex items-center justify-between">
          <span className={`text-[8px] uppercase font-bold tracking-widest ${style.muted}`}>
            Gourmet Selection
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

        {/* Shimmer skeleton screen or listings */}
        {loading ? (
          <MenuSkeleton />
        ) : (
          <div className="px-4 py-2 space-y-10">
            {activeCategories.map((cat) => {
              const itemsInCat = filteredItems.filter((item) => item.categoryId === cat.id);
              if (itemsInCat.length === 0) return null;

              return (
                <div key={cat.id} id={`cat-section-${cat.id}`} className="space-y-5 scroll-mt-36">
                  {/* Category Header */}
                  <div className={`flex items-center justify-between border-b ${style.divider} pb-2`}>
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
                      <span className={`text-[9px] font-normal font-sans tracking-normal ${style.muted}`}>
                        ({itemsInCat.length})
                      </span>
                    </h3>
                  </div>

                  {/* 1. Cafe & Beach grid layouts */}
                  {(style.layoutMode === 'cafe' || style.layoutMode === 'beach') ? (
                    <div className="grid grid-cols-2 gap-4">
                      {itemsInCat.map((item) => {
                        const spicyLevel = getSpicyLevel(item.name, item.description);
                        return (
                          <div
                            key={item.id}
                            className={`flex flex-col overflow-hidden border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] ${style.cardBg} ${style.cardRadius}`}
                            style={{ borderColor: primaryColor ? `${primaryColor}15` : undefined }}
                          >
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
                                  Recommended
                                </span>
                              )}

                              {/* Custom Veg/Nonveg indicator */}
                              <span className={`absolute top-2 right-2 w-4 h-4 bg-black/60 backdrop-blur-md rounded-md flex items-center justify-center border ${
                                item.isVeg ? 'border-green-500' : 'border-red-500'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                              </span>
                            </div>

                            <div className="p-3 flex-1 flex flex-col justify-between gap-2">
                              <div className="text-left space-y-1">
                                <h4 className="font-bold text-xs truncate leading-tight text-white">{item.name}</h4>
                                <p className={`text-[8px] leading-relaxed line-clamp-2 ${style.muted}`}>
                                  {item.description}
                                </p>
                              </div>

                              <div className="flex items-center justify-between mt-1">
                                <span className="font-serif font-bold text-xs" style={{ color: primaryColor || style.accentHex }}>
                                  {currencySymbol}{item.price.toFixed(2)}
                                </span>
                                
                                {/* Prep time & Spice indicators */}
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
                    // 2. Japanese minimalistic stark layout
                    <div className="divide-y divide-black/15">
                      {itemsInCat.map((item) => {
                        const spicyLevel = getSpicyLevel(item.name, item.description);
                        return (
                          <div key={item.id} className="py-4 flex gap-4 items-center justify-between bg-transparent border-none">
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
                                  <h4 className="font-mono text-xs uppercase font-black tracking-wider truncate">{item.name}</h4>
                                  <span className={`w-2.5 h-2.5 border flex items-center justify-center rounded-none shrink-0 ${
                                    item.isVeg ? 'border-green-600' : 'border-red-600'
                                  }`}>
                                    <span className={`w-1 h-1 rounded-none ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                                  </span>
                                </div>
                                <p className="text-[8px] leading-relaxed mt-0.5 line-clamp-1 opacity-60">
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
                    // 3. Luxury / Bistro / Indian Cards list
                    <div className="space-y-4">
                      {itemsInCat.map((item) => {
                        const spicyLevel = getSpicyLevel(item.name, item.description);
                        return (
                          <div
                            key={item.id}
                            className={`p-4 border flex gap-4 items-center justify-between transition-all duration-300 hover:border-[#D4A853]/30 active:scale-[0.99] ${style.cardBg} ${style.cardRadius}`}
                            style={{ borderColor: primaryColor ? `${primaryColor}15` : undefined }}
                          >
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
                                    className={`text-xs truncate leading-tight ${
                                      style.layoutMode === 'luxury' ? 'font-serif font-bold text-white' : 'font-bold'
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
                                
                                <p className={`text-[9px] leading-relaxed mt-1 line-clamp-2 ${style.muted}`}>
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
            {activeCategories.length === 0 && (
              <div className="text-center py-16 text-gray-500 space-y-4">
                <Compass className="w-12 h-12 mx-auto text-gray-700 mb-1" />
                <h3 className="font-serif text-sm font-bold text-white">We couldn't find that dish</h3>
                <p className="text-[10px] max-w-xs mx-auto leading-relaxed">No dishes match your selected filter criteria. Try adjusting the toggles or keywords.</p>
                <button
                  type="button"
                  onClick={() => { setVegOnly(false); setSearch(''); }}
                  className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-[10px] font-bold uppercase tracking-wider text-white cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Full-Screen Search overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#09090B]/95 backdrop-blur-xl flex flex-col max-w-[480px] mx-auto p-4"
          >
            {/* Input Header */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addRecentSearch(search)}
                  placeholder="Search dishes, drinks, appetizers..."
                  className="w-full bg-white/[0.02] border border-white/10 text-white rounded-xl pl-11 pr-10 py-3 text-xs outline-none focus:border-[#D4A853] transition-all"
                />
                {search && (
                  <button 
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button 
                onClick={() => { setIsSearchOpen(false); }}
                className="text-xs font-bold uppercase tracking-wider text-[#D4A853]"
                style={{ color: primaryColor || '#D4A853' }}
              >
                Done
              </button>
            </div>

            {/* Content list */}
            <div className="flex-1 overflow-y-auto mt-6 space-y-6 scrollbar-none pb-12">
              {/* Recent search history list */}
              {recentSearches.length > 0 && !search && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-gray-500">Recent Searches</span>
                    <button onClick={clearRecentSearches} className="text-[9px] font-bold text-red-400 hover:underline">Clear</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setSearch(s); }}
                        className="px-3 py-1.5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-xl text-[10px] text-gray-300 cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Instant Search Results mapping list */}
              {search && (
                <div className="space-y-4">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-gray-500 block">
                    Instant Search Results ({filteredItems.length})
                  </span>
                  
                  {filteredItems.length > 0 ? (
                    <div className="space-y-3">
                      {filteredItems.map((item) => {
                        const spicyLevel = getSpicyLevel(item.name, item.description);
                        const cat = categories.find(c => c.id === item.categoryId);
                        return (
                          <div 
                            key={item.id}
                            onClick={() => {
                              setIsSearchOpen(false);
                              setTimeout(() => scrollToCategory(item.categoryId), 100);
                            }}
                            className="p-3 border border-white/[0.04] bg-white/[0.01] rounded-xl flex gap-3 items-center hover:bg-white/[0.02] cursor-pointer"
                          >
                            <div className="w-12 h-12 bg-zinc-900 border border-white/5 overflow-hidden shrink-0 flex items-center justify-center rounded-lg">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                              ) : (
                                <ChefHat className="w-4 h-4 text-gray-600" />
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0 text-left">
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-bold text-xs truncate text-white">
                                  {highlightMatch(item.name, search)}
                                </h4>
                                <span className={`w-2 h-2 rounded-full shrink-0 ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                              </div>
                              <p className="text-[9px] truncate text-gray-500 mt-0.5">{item.description}</p>
                              {cat && <span className="text-[8px] bg-white/[0.04] border border-white/5 text-gray-400 px-1.5 py-0.5 rounded font-medium block w-fit mt-1">{cat.name}</span>}
                            </div>

                            <span className="font-serif font-bold text-xs text-white pl-2">
                              {currencySymbol}{item.price.toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 space-y-3">
                      <Compass className="w-8 h-8 mx-auto text-gray-600" />
                      <h4 className="text-xs font-bold text-white">No matches found</h4>
                      <p className="text-[10px] text-gray-500">We couldn't find any dishes matching "{search}".</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
