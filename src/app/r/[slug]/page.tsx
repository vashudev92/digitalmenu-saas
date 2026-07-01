import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChefHat, ShieldCheck, Flame, Sparkles, BookOpen, Star, Clock, MapPin, Phone, Globe } from 'lucide-react';
import type { Metadata } from 'next';
import { getTheme } from '@/lib/theme-config';
import FontLoader from '@/components/font-loader';

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
    // Dynamic favicon override
    ...(restaurant?.favicon && {
      icons: {
        icon: restaurant.favicon,
      },
    }),
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

  // Get active theme from centralized config
  const style = getTheme(restaurant.theme);

  // Font styles
  const headingStyle = restaurant.fontHeading ? { fontFamily: `'${restaurant.fontHeading}', serif` } : {};
  const bodyStyle = restaurant.fontBody ? { fontFamily: `'${restaurant.fontBody}', sans-serif` } : {};

  // Fallback default featured item if none is marked
  const todaySpecial = restaurant.menuItems[0] || {
    name: 'Truffle Tagliatelle',
    description: 'Tandoori cottage cheese, black truffle paste, forest mushrooms.',
    price: 320,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=500&fit=crop',
  };

  const brandStyles = {
    '--brand-primary': restaurant.primaryColor || style.accentHex,
    '--brand-secondary': restaurant.secondaryColor || style.accentHex,
    '--brand-accent': restaurant.accentColor || style.accentHex,
    ...bodyStyle
  } as React.CSSProperties;

  return (
    <div className={`min-h-screen w-full overflow-x-hidden ${style.bg} ${style.text} flex flex-col justify-between max-w-[500px] mx-auto relative shadow-2xl pb-24`} style={brandStyles}>
      <FontLoader headingFont={restaurant.fontHeading} bodyFont={restaurant.fontBody} />
      
      <div>
        {/* Header Bar */}
        <header className={`px-5 py-4 flex flex-col items-center justify-center z-10 sticky top-0 ${style.headerBg} backdrop-blur-md border-b ${style.divider}`}>
          <div className="flex flex-col items-center">
            {restaurant.logo ? (
              <img src={restaurant.logo} alt="Logo" className="w-8 h-8 rounded-full object-cover mb-1 border border-gray-800" />
            ) : (
              <ChefHat className={`w-6 h-6 ${style.accentText} mb-0.5`} />
            )}
            <span className="font-serif font-bold text-sm tracking-wide uppercase" style={headingStyle}>{restaurant.name}</span>
          </div>
        </header>

        {/* Hero Section */}
        <div className="px-4 mt-4">
          <div className="relative rounded-3xl overflow-hidden h-[300px] bg-gray-950 border border-gray-900 shadow-md">
            {restaurant.banner ? (
              <img src={restaurant.banner} alt="Food Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-b from-gray-950 to-gray-900" />
            )}
            
            {/* Soft dark text overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10 flex flex-col justify-end p-6">
              <h2 className="font-serif text-white text-3xl font-bold leading-tight tracking-tight" style={headingStyle}>
                {restaurant.bannerTitle1 || 'Good Food'}<br />
                <span className={style.accentText}>{restaurant.bannerTitle2 || 'Great Mood'}</span>
              </h2>
              <p className="text-gray-400 text-xs mt-2 font-medium max-w-xs">
                {restaurant.bannerSubtitle || "Discover our chef's special selection just for you."}
              </p>
              <div className="w-10 border-t-2 mt-3" style={{ borderColor: style.accentHex }} />
            </div>
          </div>
        </div>

        {/* Info badges row */}
        <div className="grid grid-cols-3 gap-3 px-4 mt-5">
          <div className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center ${style.cardBg}`}>
            <ShieldCheck className={`w-5 h-5 mb-1.5 ${style.accentText}`} />
            <span className="text-[10px] font-bold tracking-wider uppercase leading-none">{restaurant.badge1Title || 'Hygienic'}</span>
            <span className="text-[9px] text-gray-500 mt-1 uppercase font-semibold">{restaurant.badge1Desc || 'Kitchen'}</span>
          </div>
          
          <div className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center ${style.cardBg}`}>
            <Flame className={`w-5 h-5 mb-1.5 ${style.accentText}`} />
            <span className="text-[10px] font-bold tracking-wider uppercase leading-none">{restaurant.badge2Title || 'Fresh'}</span>
            <span className="text-[9px] text-gray-500 mt-1 uppercase font-semibold">{restaurant.badge2Desc || 'Ingredients'}</span>
          </div>

          <div className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center ${style.cardBg}`}>
            <Sparkles className={`w-5 h-5 mb-1.5 ${style.accentText}`} />
            <span className="text-[10px] font-bold tracking-wider uppercase leading-none">{restaurant.badge3Title || 'Chef'}</span>
            <span className="text-[9px] text-gray-500 mt-1 uppercase font-semibold">{restaurant.badge3Desc || 'Specials'}</span>
          </div>
        </div>

        {/* Today's Special Dish */}
        <div className="px-4 mt-6">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="font-serif text-lg font-bold flex items-center gap-1.5" style={headingStyle}>
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
                  <h4 className="font-bold text-sm truncate">{todaySpecial.name}</h4>
                  <span className={`w-3 h-3 border flex items-center justify-center rounded shrink-0 ${todaySpecial.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                    <span className={`w-1 h-1 rounded-full ${todaySpecial.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                  </span>
                </div>
                <p className={`text-[10px] truncate mt-1 ${style.muted}`}>{todaySpecial.description}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  <Star className="w-3 h-3 fill-current" style={{ color: restaurant.primaryColor || style.accentHex }} />
                  <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: restaurant.primaryColor || style.accentHex }}>Popular</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end justify-between h-14 shrink-0">
              <div className={style.muted}>
                <Star className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-sm" style={{ color: restaurant.primaryColor || style.accentHex }}>
                {restaurant.currencySymbol}{todaySpecial.price.toFixed(2)}
              </span>
            </div>
          </Link>
        </div>

        {/* Restaurant Information Section (Locate Us, Hours, Phone) */}
        <div className="px-4 mt-8 pb-8 space-y-4">
          <h3 className="font-serif text-lg font-bold flex items-center gap-1.5" style={headingStyle}>
            Restaurant Information
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {/* Opening Hours Card */}
            <div className={`p-4 rounded-3xl border flex items-center gap-4 ${style.cardBg}`}>
              <div className="p-3 bg-gray-500/5 rounded-2xl border border-gray-900/50">
                <Clock className="w-5 h-5" style={{ color: restaurant.primaryColor || style.accentHex }} />
              </div>
              <div>
                <span className="block text-[9px] uppercase font-bold tracking-widest text-gray-500">Opening Hours</span>
                <span className="block text-sm font-semibold mt-0.5">{restaurant.openingHours || '11:00 AM - 11:00 PM'}</span>
              </div>
            </div>

            {/* Locate Us Card */}
            {restaurant.address && (
              <div className={`p-4 rounded-3xl border flex flex-col gap-4 ${style.cardBg}`}>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-500/5 rounded-2xl border border-gray-900/50">
                    <MapPin className="w-5 h-5" style={{ color: restaurant.primaryColor || style.accentHex }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-[9px] uppercase font-bold tracking-widest text-gray-500">Address</span>
                    <span className="block text-xs font-semibold mt-0.5 leading-relaxed truncate">{restaurant.address}</span>
                  </div>
                </div>

                {restaurant.googleMapsUrl && (
                  <a
                    href={restaurant.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-2xl bg-gray-950 border border-gray-900 text-xs font-bold text-center text-gray-300 hover:text-white hover:border-[#D4A437]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    style={{ borderColor: restaurant.primaryColor ? `${restaurant.primaryColor}33` : undefined }}
                  >
                    <MapPin className="w-3.5 h-3.5" style={{ color: restaurant.primaryColor || style.accentHex }} />
                    📍 Locate Us
                  </a>
                )}
              </div>
            )}

            {/* Contact Details Card (Phone & Website) */}
            {(restaurant.phone || restaurant.website) && (
              <div className={`p-4 rounded-3xl border grid grid-cols-2 gap-4 ${style.cardBg}`}>
                {restaurant.phone && (
                  <a href={`tel:${restaurant.phone}`} className="flex flex-col p-2 hover:bg-gray-500/5 rounded-xl transition-all">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-gray-500">Phone</span>
                    <span className="text-xs font-semibold mt-0.5 text-white truncate">{restaurant.phone}</span>
                  </a>
                )}
                {restaurant.website && (
                  <a
                    href={restaurant.website.startsWith('http') ? restaurant.website : `https://${restaurant.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col p-2 hover:bg-gray-500/5 rounded-xl transition-all"
                  >
                    <span className="text-[9px] uppercase font-bold tracking-widest text-gray-500">Website</span>
                    <span className="text-xs font-semibold mt-0.5 truncate text-white hover:underline">{restaurant.website.replace(/https?:\/\/(www\.)?/, '')}</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Bottom Menu Navigation Bar */}
      <div className="fixed bottom-4 left-0 right-0 mx-auto w-[90%] max-w-[450px] z-40 px-3">
        <Link
          href={`/r/${slug}/menu`}
          className={`w-full py-4.5 rounded-full flex items-center justify-center gap-2.5 shadow-2xl transition-all duration-300 active:scale-[0.98] ${style.primaryBtn}`}
          style={{
            background: restaurant.primaryColor
              ? `linear-gradient(135deg, ${restaurant.primaryColor} 0%, ${restaurant.secondaryColor || restaurant.primaryColor} 100%)`
              : undefined,
            color: restaurant.primaryColor ? '#000000' : undefined
          }}
        >
          <BookOpen className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold tracking-widest uppercase">View Full Menu</span>
        </Link>
      </div>

    </div>
  );
}
