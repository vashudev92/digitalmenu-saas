import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChefHat, Phone, MapPin, ArrowRight, Star, Heart, ShieldCheck, Flame, Sparkles, BookOpen, ChevronDown, ChevronLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const restaurant = await db.restaurant.findUnique({
    where: { slug },
  });

  return {
    title: restaurant ? `Welcome to ${restaurant.name}` : 'Digital Menu Card',
  };
}

export default async function RestaurantWelcomePage({ params }: Props) {
  const { slug } = await params;
  
  const restaurant = await db.restaurant.findUnique({
    where: { slug },
    include: {
      subscription: true,
      menuItems: {
        where: { isFeatured: true, isAvailable: true },
        take: 1,
      },
    },
  });

  if (!restaurant) {
    notFound();
  }

  // Check if restaurant subscription is suspended
  const isSuspended = restaurant.subscription?.status === 'CANCELLED';

  if (isSuspended) {
    return (
      <div className="flex min-h-screen bg-[#0A0A0A] items-center justify-center p-4 text-center">
        <div className="glass p-8 max-w-sm rounded-3xl border-amber-500/20">
          <ChefHat className="w-12 h-12 mx-auto text-amber-500/30 mb-4 animate-pulse" />
          <h2 className="font-serif text-2xl font-bold text-white mb-2">Menu Offline</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            The digital menu card for <strong>{restaurant.name}</strong> is temporarily offline. Please request a physical menu card from your waiter.
          </p>
        </div>
      </div>
    );
  }

  // Active theme classes mapping
  const themeClasses: { [key: string]: any } = {
    LUXURY_DARK: {
      bg: 'bg-[#0A0A0A]',
      text: 'text-white',
      muted: 'text-gray-400',
      cardBg: 'bg-[#121212] border-[#D4A437]/15',
      primaryBtn: 'bg-gradient-to-r from-[#D4A437] to-[#B88E2F] hover:from-[#B88E2F] hover:to-[#A37B24] text-black font-bold',
      accentColor: 'text-[#D4A437]',
      divider: 'border-gray-900',
    },
    ELEGANT_LIGHT: {
      bg: 'bg-[#F7F3EE]',
      text: 'text-[#1F1F1F]',
      muted: 'text-[#777777]',
      cardBg: 'bg-white border-[#D4A24C]/25 shadow-sm',
      primaryBtn: 'bg-gradient-to-r from-[#D4A24C] to-[#C2932E] text-white font-bold',
      accentColor: 'text-[#D4A24C]',
      divider: 'border-[#ece6df]',
    },
    CAFE_THEME: {
      bg: 'bg-[#1E1610]',
      text: 'text-[#F5F2EB]',
      muted: 'text-[#A08875]',
      cardBg: 'bg-[#291E16] border-[#A07855]/20',
      primaryBtn: 'bg-gradient-to-r from-[#A07855] to-[#805C3F] text-[#F5F2EB] font-bold',
      accentColor: 'text-[#A07855]',
      divider: 'border-[#3B2B20]',
    },
    MODERN_THEME: {
      bg: 'bg-black',
      text: 'text-white',
      muted: 'text-zinc-500',
      cardBg: 'bg-zinc-950 border-zinc-800',
      primaryBtn: 'bg-white text-black font-bold',
      accentColor: 'text-white',
      divider: 'border-zinc-900',
    },
  };

  const style = themeClasses[restaurant.theme] || themeClasses.LUXURY_DARK;

  // Fallback default featured item if none is marked
  const todaySpecial = restaurant.menuItems[0] || {
    name: 'Truffle Tagliatelle',
    description: 'Tandoori marinated cottage cheese with spices, black truffle paste, forest mushrooms.',
    price: 320,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=500&fit=crop',
  };

  return (
    <div className={`min-h-screen w-full overflow-x-hidden ${style.bg} ${style.text} flex flex-col justify-between max-w-[500px] mx-auto relative shadow-2xl pb-24`}>
      
      <div>
        {/* Header Bar */}
        <header className="px-5 py-4 flex items-center justify-between z-10 sticky top-0 bg-inherit">
          <Link href="/" className="p-1 rounded-xl bg-gray-500/5 hover:bg-gray-500/10 border border-gray-500/10 text-gray-400 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col items-center">
            {restaurant.logo ? (
              <img src={restaurant.logo} alt="Logo" className="w-6 h-6 rounded-full object-cover mb-1 border border-gray-800" />
            ) : (
              <ChefHat className={`w-5 h-5 ${style.accentColor} mb-0.5`} />
            )}
            <span className="font-serif font-bold text-sm tracking-wide uppercase">{restaurant.name}</span>
          </div>
          <div className="w-10"></div>
        </header>

        {/* Hero Section */}
        <div className="px-4 mt-2">
          <div className="relative rounded-3xl overflow-hidden h-[300px] bg-gray-950 border border-gray-900 shadow-md">
            {restaurant.banner ? (
              <img src={restaurant.banner} alt="Food Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-b from-gray-950 to-gray-900" />
            )}
            
            {/* Soft dark text overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10 flex flex-col justify-end p-6">
              <h2 className="font-serif text-white text-3xl font-bold leading-tight tracking-tight">
                Good Food<br />
                <span className="text-[#D4A437]">Great Mood</span>
              </h2>
              <p className="text-gray-400 text-xs mt-2 font-medium max-w-xs">
                Discover our chef's special selection just for you.
              </p>
              <div className="w-10 border-t-2 border-[#D4A437] mt-3" />
            </div>
          </div>
        </div>

        {/* Info badges row */}
        <div className="grid grid-cols-3 gap-3 px-4 mt-5">
          <div className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center ${style.cardBg}`}>
            <ShieldCheck className={`w-5 h-5 mb-1.5 ${style.accentColor}`} />
            <span className="text-[10px] font-bold tracking-wider uppercase leading-none">Hygienic</span>
            <span className="text-[9px] text-gray-500 mt-1 uppercase font-semibold">Kitchen</span>
          </div>
          
          <div className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center ${style.cardBg}`}>
            <Flame className={`w-5 h-5 mb-1.5 ${style.accentColor}`} />
            <span className="text-[10px] font-bold tracking-wider uppercase leading-none">Fresh</span>
            <span className="text-[9px] text-gray-500 mt-1 uppercase font-semibold">Ingredients</span>
          </div>

          <div className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center ${style.cardBg}`}>
            <Sparkles className={`w-5 h-5 mb-1.5 ${style.accentColor}`} />
            <span className="text-[10px] font-bold tracking-wider uppercase leading-none">Chef</span>
            <span className="text-[9px] text-gray-500 mt-1 uppercase font-semibold">Specials</span>
          </div>
        </div>

        {/* Today's Special Dish */}
        <div className="px-4 mt-6">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="font-serif text-lg font-bold flex items-center gap-1.5">
              Today's Special
            </h3>
          </div>

          <Link
            href={`/r/${slug}/menu`}
            className={`p-4 rounded-2xl border flex gap-4 items-center justify-between shadow-sm active:scale-[0.99] transition-transform ${style.cardBg}`}
          >
            <div className="flex gap-4 items-center overflow-hidden">
              <div className="w-18 h-18 rounded-xl bg-gray-950 border border-gray-900 overflow-hidden shrink-0 flex items-center justify-center">
                {todaySpecial.image ? (
                  <img src={todaySpecial.image} alt={todaySpecial.name} className="object-cover w-full h-full" />
                ) : (
                  <ChefHat className={`w-6 h-6 ${style.muted}`} />
                )}
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-white truncate">{todaySpecial.name}</h4>
                  <span className={`w-3 h-3 border flex items-center justify-center rounded shrink-0 ${todaySpecial.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                    <span className={`w-1 h-1 rounded-full ${todaySpecial.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                  </span>
                </div>
                <p className={`text-[10px] truncate mt-1 ${style.muted}`}>{todaySpecial.description}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  <Star className="w-3 h-3 text-[#D4A437] fill-[#D4A437]" />
                  <span className="text-[9px] text-[#D4A437] font-bold uppercase tracking-wider">Popular</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end justify-between h-14 shrink-0">
              <div className="text-gray-500">
                <Star className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-sm text-[#D4A437]">{restaurant.currencySymbol}{todaySpecial.price.toFixed(2)}</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Floating Bottom Menu Navigation Bar */}
      <div className="fixed bottom-4 left-0 right-0 mx-auto w-[90%] max-w-[450px] z-40 px-3">
        <Link
          href={`/r/${slug}/menu`}
          className={`w-full py-4.5 rounded-full flex items-center justify-center gap-2.5 shadow-2xl transition-all duration-300 active:scale-[0.98] ${style.primaryBtn}`}
        >
          <BookOpen className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold tracking-widest uppercase">View Full Menu</span>
        </Link>
      </div>

    </div>
  );
}
