'use client';

import { useState, useRef, useMemo } from 'react';
import {
  Search,
  Sparkles,
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
  ChevronDown
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
  categories: CategoryOption[];
  menuItems: MenuItemOption[];
  address?: string | null;
  phone?: string | null;
  website?: string | null;
  googleMapsUrl?: string | null;
}

const iconMap: { [key: string]: React.ReactNode } = {
  Sparkles: <Star className="w-4 h-4 shrink-0 fill-current" />,
  Soup: <Soup className="w-4 h-4 shrink-0" />,
  UtensilsCrossed: <UtensilsCrossed className="w-4 h-4 shrink-0" />,
  IceCream: <IceCream className="w-4 h-4 shrink-0" />,
  Wine: <Wine className="w-4 h-4 shrink-0" />,
  Pizza: <Pizza className="w-4 h-4 shrink-0" />,
  Coffee: <Coffee className="w-4 h-4 shrink-0" />,
  Utensils: <Utensils className="w-4 h-4 shrink-0" />,
};

export default function MenuClientView({
  restaurantName,
  restaurantSlug,
  logoUrl,
  theme,
  currencySymbol = '₹',
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

  // Theme mapping classes
  const themeClasses: { [key: string]: any } = {
    LUXURY_DARK: {
      bg: 'bg-[#0A0A0A]',
      text: 'text-white',
      muted: 'text-gray-400',
      headerBg: 'bg-[#0A0A0A]/95',
      cardBg: 'bg-[#121212] border-[#D4A437]/20',
      inputBg: 'bg-[#121212] border-gray-900 focus:border-[#D4A437]',
      catActive: 'bg-[#D4A437] text-black border-[#D4A437]',
      catInactive: 'bg-[#121212] text-white border-gray-900',
      accentText: 'text-[#D4A437]',
      divider: 'border-gray-900',
      navBg: 'bg-[#121212]/90 border-[#D4A437]/15',
    },
    ELEGANT_LIGHT: {
      bg: 'bg-[#F7F3EE]',
      text: 'text-[#1F1F1F]',
      muted: 'text-[#777777]',
      headerBg: 'bg-[#F7F3EE]/95',
      cardBg: 'bg-white border-[#D4A24C]/25 shadow-sm',
      inputBg: 'bg-white border-[#ece6df] focus:border-[#D4A24C]',
      catActive: 'bg-[#D4A24C] text-white border-[#D4A24C]',
      catInactive: 'bg-white text-gray-500 border-[#ece6df]',
      accentText: 'text-[#D4A24C]',
      divider: 'border-[#ece6df]',
      navBg: 'bg-white/90 border-[#D4A24C]/15',
    },
    CAFE_THEME: {
      bg: 'bg-[#1E1610]',
      text: 'text-[#F5F2EB]',
      muted: 'text-[#A08875]',
      headerBg: 'bg-[#1E1610]/95',
      cardBg: 'bg-[#291E16] border-[#A07855]/20',
      inputBg: 'bg-[#291E16] border-[#3B2B20] focus:border-[#A07855]',
      catActive: 'bg-[#A07855] text-[#F5F2EB] border-[#A07855]',
      catInactive: 'bg-[#291E16] text-[#A08875] border-[#3B2B20]',
      accentText: 'text-[#A07855]',
      divider: 'border-[#3B2B20]',
      navBg: 'bg-[#291E16]/90 border-[#A07855]/15',
    },
    MODERN_THEME: {
      bg: 'bg-black',
      text: 'text-white',
      muted: 'text-zinc-500',
      headerBg: 'bg-black/95',
      cardBg: 'bg-zinc-950 border-zinc-850',
      inputBg: 'bg-zinc-950 border-zinc-850 focus:border-white',
      catActive: 'bg-white text-black border-white',
      catInactive: 'bg-zinc-950 text-zinc-400 border-zinc-850',
      accentText: 'text-white',
      divider: 'border-zinc-900',
      navBg: 'bg-zinc-950/90 border-zinc-850',
    },
  };

  const style = themeClasses[theme] || themeClasses.LUXURY_DARK;

  // Filter items matching active filters
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

  // Check if category has any matching items
  const categoryHasItems = (catId: string) => {
    return getFilteredItems(catId).length > 0;
  };

  return (
    <div className={`min-h-screen w-full ${style.bg} ${style.text} flex flex-col justify-between max-w-[500px] mx-auto shadow-2xl pb-24 overflow-x-hidden relative`}>
      
      <div>
        {/* Sticky Header & Category Wrapper (Unified to prevent mobile overlaps) */}
        <div className={`sticky top-0 z-30 ${style.headerBg} backdrop-blur-md border-b ${style.divider}`}>
          {/* Top Bar */}
          <div className="px-4 pt-4 pb-3 flex items-center justify-between">
            <Link
              href={`/r/${restaurantSlug}`}
              className={`p-1.5 rounded-xl bg-gray-500/5 hover:bg-gray-500/10 border ${style.divider} text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-all`}
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            
            <div className="flex flex-col items-center">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-6 h-6 rounded-full object-cover mb-1 border border-gray-800" />
              ) : (
                <ChefHat className={`w-5 h-5 ${style.accentText} mb-0.5`} />
              )}
              <span className="font-serif font-bold text-sm tracking-wide uppercase">{restaurantName}</span>
            </div>
            
            <div className="w-10"></div>
          </div>

          {/* Search bar */}
          <div className="px-4 pb-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <Search className="w-4.5 h-4.5" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search dishes..."
                className={`w-full rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none transition-all ${style.inputBg} ${style.text} border`}
              />
            </div>
          </div>

          {/* Horizontal Category scrolling selector */}
          <div className="border-t border-gray-950/10 bg-inherit">
            <div className="overflow-x-auto flex flex-row whitespace-nowrap scrollbar-none gap-3 px-4 py-3.5 scroll-smooth [touch-action:pan-x]">
              <button
                type="button"
                onClick={() => setActiveCategory('ALL')}
                className={`px-5 py-3 rounded-2xl border text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 shrink-0 [touch-action:manipulation] cursor-pointer ${
                  activeCategory === 'ALL'
                    ? `${style.catActive} shadow-md`
                    : style.catInactive
                }`}
              >
                <Star className={`w-4 h-4 shrink-0 ${activeCategory === 'ALL' ? 'fill-current' : style.accentText}`} />
                <span>All Menu</span>
              </button>

              {categories.map((cat) => {
                const isCatActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-5 py-3 rounded-2xl border text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 shrink-0 [touch-action:manipulation] cursor-pointer ${
                      isCatActive
                        ? `${style.catActive} shadow-md`
                        : style.catInactive
                    }`}
                  >
                    <span className={`shrink-0 ${isCatActive ? '' : style.accentText}`}>
                      {iconMap[cat.icon] || <Utensils className="w-4 h-4" />}
                    </span>
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Veg-Only and Results Info */}
        <div className="px-4 pb-2 pt-3 flex items-center justify-between">
          <span className={`text-[9px] uppercase font-bold tracking-widest ${style.muted}`}>
            Dishes Available
          </span>
          
          <button 
            type="button"
            onClick={() => setVegOnly(!vegOnly)}
            className="flex items-center gap-2 cursor-pointer select-none border-none bg-transparent p-0 focus:outline-none [touch-action:manipulation]"
          >
            <span className={`text-xs font-semibold ${style.text}`}>Veg Only</span>
            <span className="relative inline-block w-9 h-5">
              <span className={`block w-9 h-5 bg-gray-800 rounded-full transition-all relative ${vegOnly ? 'bg-green-600' : ''}`}>
                <span className={`absolute top-[2px] left-[2px] bg-white rounded-full h-4 w-4 transition-all block ${
                  vegOnly ? 'translate-x-4' : ''
                }`}></span>
              </span>
            </span>
          </button>
        </div>

        {/* Grouped Dishes Content */}
        <div className="px-4 py-2 space-y-8">
          {categories
            .filter((cat) => activeCategory === 'ALL' || activeCategory === cat.id)
            .map((cat) => {
              const itemsInCat = getFilteredItems(cat.id);
              if (itemsInCat.length === 0) return null;

              return (
                <div key={cat.id} className="space-y-4">
                  {/* Category Title Divider */}
                  <div className={`flex items-center justify-between border-b ${style.divider} pb-2`}>
                    <h3 className="font-serif text-lg font-bold tracking-wide">
                      {cat.name} <span className={`text-xs ml-1 font-serif italic ${style.muted}`}>• {itemsInCat.length} items</span>
                    </h3>
                    <span className={`text-[10px] uppercase font-bold tracking-widest hover:underline cursor-pointer ${style.accentText}`}>
                      View All
                    </span>
                  </div>

                  {/* Dishes inside this Category */}
                  <div className="space-y-3.5">
                    {itemsInCat.map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 rounded-2xl border flex gap-4 items-center justify-between ${style.cardBg}`}
                      >
                        {/* Left: Image & Details */}
                        <div className="flex gap-3.5 items-center overflow-hidden">
                          <div className="w-18 h-18 rounded-xl bg-gray-950 overflow-hidden shrink-0 flex items-center justify-center border border-gray-900/50">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                            ) : (
                              <ChefHat className={`w-5 h-5 ${style.muted}`} />
                            )}
                          </div>
                          
                          <div className="overflow-hidden">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm truncate leading-tight">{item.name}</h4>
                              <span className={`w-3.5 h-3.5 border flex items-center justify-center rounded shrink-0 ${
                                item.isVeg ? 'border-green-600' : 'border-red-600'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                              </span>
                            </div>
                            <p className={`text-[10px] leading-relaxed mt-1 line-clamp-2 ${style.muted}`}>{item.description}</p>
                            
                            {item.isFeatured && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#D4A437]/10 border border-[#D4A437]/25 text-[8px] font-bold text-[#D4A437] mt-1.5">
                                Chef Pick
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Right: Actions / Price */}
                        <div className="flex flex-col items-end justify-between h-14 shrink-0">
                          <button className="text-gray-600 hover:text-red-500 transition-colors">
                            <Star className="w-4 h-4 text-gray-500" />
                          </button>
                          <span className={`font-serif font-bold text-sm ${style.accentText}`}>
                            {currencySymbol}{item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

          {/* Empty state fallback */}
          {categories.filter((cat) => activeCategory === 'ALL' || activeCategory === cat.id).every((cat) => !categoryHasItems(cat.id)) && (
            <div className="text-center py-16 text-gray-500">
              <UtensilsCrossed className="w-12 h-12 mx-auto text-gray-700 mb-4" />
              <p className="text-sm">No items found matching the current search parameters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Navigation Bar (Flavoro Style) */}
      <nav className={`fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[500px] z-40 backdrop-blur-md border-t px-6 py-4 flex items-center justify-between ${style.navBg}`}>
        <Link
          href={`/r/${restaurantSlug}`}
          className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors [touch-action:manipulation]"
        >
          <Home className="w-5 h-5" />
          <span className="text-[9px] uppercase font-bold tracking-wider">Home</span>
        </Link>

        <Link
          href={`/r/${restaurantSlug}/menu`}
          className={`flex flex-col items-center gap-1 transition-colors [touch-action:manipulation] ${style.accentText}`}
        >
          <BookOpen className="w-5 h-5 fill-current" />
          <span className="text-[9px] uppercase font-bold tracking-wider">Menu</span>
        </Link>

        <button
          type="button"
          onClick={() => setIsInfoOpen(true)}
          className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer [touch-action:manipulation]"
        >
          <Info className="w-5 h-5" />
          <span className="text-[9px] uppercase font-bold tracking-wider">Info</span>
        </button>
      </nav>

      {/* INFO DRAWER / MODAL */}
      {isInfoOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm glass-gold rounded-t-3xl sm:rounded-3xl p-6 relative">
            <button
              onClick={() => setIsInfoOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-900"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl font-bold mb-6 text-[#D4A437] border-b border-gray-900 pb-2">
              Restaurant Info
            </h3>

            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-3">
                <ChefHat className="w-5 h-5 text-[#D4A437] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">{restaurantName}</h4>
                  <span className="text-xs text-gray-400 italic">Premium Contactless Diner</span>
                </div>
              </div>

              {address && (
                <div className="flex items-start gap-3 text-gray-300">
                  <MapPin className="w-5 h-5 text-[#D4A437] shrink-0 mt-0.5" />
                  {googleMapsUrl ? (
                    <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-xs leading-relaxed hover:underline text-gray-300">
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
                <div className="flex items-center gap-3 text-gray-300">
                  <Phone className="w-5 h-5 text-[#D4A437] shrink-0" />
                  <a href={`tel:${phone}`} className="text-xs hover:underline text-gray-300">{phone}</a>
                </div>
              )}

              {website && (
                <div className="flex items-center gap-3 text-gray-300">
                  <Globe className="w-5 h-5 text-[#D4A437] shrink-0" />
                  <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[#D4A437] hover:underline">
                    {website.replace(/https?:\/\/(www\.)?/, '')}
                  </a>
                </div>
              )}

              {!address && !phone && !website && (
                <p className="text-xs text-gray-400 text-center py-4">
                  Contact details are not available.
                </p>
              )}
            </div>

            <button
              onClick={() => setIsInfoOpen(false)}
              className="w-full py-3.5 mt-6 rounded-xl bg-gradient-to-r from-[#D4A437] to-[#B88E2F] text-black font-bold text-xs uppercase tracking-wider shadow-md"
            >
              Close Info
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
