import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChefHat, ShieldCheck, Flame, Sparkles, BookOpen, Star, Clock, MapPin, Phone, Globe, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { getTheme } from '@/lib/theme-config';
import FontLoader from '@/components/font-loader';
import ClientWelcomeAnimations from '@/components/client-welcome-animations';

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
    title: restaurant ? `${restaurant.name} | Welcome` : 'Digital Menu',
    description: restaurant?.description || 'Browse our premium menu listings.',
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

  // Check subscription suspension
  const isSuspended = restaurant.subscription?.status === 'CANCELLED';

  if (isSuspended) {
    return (
      <div className="flex min-h-screen bg-[#09090B] items-center justify-center p-4 text-center">
        <div className="surface-1 border border-white/[0.06] p-8 max-w-sm rounded-2xl">
          <ChefHat className="w-10 h-10 mx-auto text-amber-500/40 mb-4 animate-pulse" />
          <h2 className="font-serif text-xl font-bold text-white mb-2">Menu Offline</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            The digital menu card for <strong>{restaurant.name}</strong> is temporarily offline. Please request a physical menu card from your waiter.
          </p>
        </div>
      </div>
    );
  }

  // Get active theme style
  const style = getTheme(restaurant.theme);

  // Font styles
  const headingStyle = restaurant.fontHeading ? { fontFamily: `'${restaurant.fontHeading}', serif` } : {};
  const bodyStyle = restaurant.fontBody ? { fontFamily: `'${restaurant.fontBody}', sans-serif` } : {};

  // Custom colors variables mapping
  const brandStyles = {
    '--brand-primary': restaurant.primaryColor || style.accentHex,
    '--brand-secondary': restaurant.secondaryColor || style.accentHex,
    '--brand-accent': restaurant.accentColor || style.accentHex,
    ...bodyStyle
  } as unknown as React.CSSProperties;

  const todaySpecial = restaurant.menuItems[0] || {
    name: 'Chef Specialty Selection',
    description: 'Fresh locally sourced seasonal ingredients crafted by culinary masters.',
    price: 28.00,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600',
  };

  return (
    <div 
      className={`min-h-screen w-full overflow-x-hidden ${style.bg} ${style.text} flex flex-col justify-between max-w-[480px] mx-auto relative shadow-2xl pb-28`} 
      style={brandStyles}
    >
      <FontLoader headingFont={restaurant.fontHeading} bodyFont={restaurant.fontBody} />
      
      <div>
        {/* Header section */}
        <header 
          className={`px-5 py-4 flex flex-col items-center justify-center z-10 sticky top-0 ${style.headerBg} backdrop-blur-md border-b ${style.divider} ${
            style.layoutMode === 'japanese' ? 'border-b-2 border-black' : ''
          }`}
        >
          <div className="flex flex-col items-center">
            {restaurant.logo ? (
              <img 
                src={restaurant.logo} 
                alt="Logo" 
                className={`w-8 h-8 object-cover mb-1.5 border border-white/5 ${
                  style.layoutMode === 'cafe' ? 'rounded-2xl' : 
                  style.layoutMode === 'japanese' ? 'rounded-none border border-black' : 'rounded-full'
                }`} 
              />
            ) : (
              <ChefHat className="w-5 h-5 mb-1" style={{ color: restaurant.primaryColor || style.accentHex }} />
            )}
            <span 
              className={`font-bold tracking-widest uppercase ${
                style.layoutMode === 'luxury' ? 'font-serif text-xs text-[#D4A853]' :
                style.layoutMode === 'japanese' ? 'font-mono text-xs font-black' : 'text-xs'
              }`} 
              style={headingStyle}
            >
              {restaurant.name}
            </span>
          </div>
        </header>

        {/* Hero Cover */}
        <div className={`px-4 mt-5 ${style.layoutMode === 'japanese' ? 'px-0 mt-0' : ''}`}>
          <div 
            className={`relative overflow-hidden bg-zinc-950 ${
              style.layoutMode === 'luxury' ? 'rounded-none border-t border-b border-[#D4A853]/30 h-[300px]' : 
              style.layoutMode === 'cafe' ? 'rounded-[2rem] h-[260px]' :
              style.layoutMode === 'japanese' ? 'rounded-none h-[320px]' :
              style.layoutMode === 'bistro' ? 'rounded-xl border border-white/5 h-[260px]' :
              style.layoutMode === 'indian' ? 'rounded-2xl border border-[#E8973F]/30 h-[280px]' :
              'rounded-[1.5rem] h-[270px]' // beach layout
            }`}
          >
            {restaurant.banner ? (
              <img src={restaurant.banner} alt="Food Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-b from-zinc-900 to-black" />
            )}
            
            {/* Themed Hero overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-6">
              <h2 
                className={`text-white text-2xl font-bold leading-tight tracking-wide ${
                  style.layoutMode === 'luxury' ? 'font-serif uppercase' :
                  style.layoutMode === 'japanese' ? 'font-mono uppercase' : ''
                }`} 
                style={headingStyle}
              >
                {restaurant.bannerTitle1 || 'Good Food'}<br />
                <span style={{ color: restaurant.primaryColor || style.accentHex }}>
                  {restaurant.bannerTitle2 || 'Great Mood'}
                </span>
              </h2>
              <p className="text-gray-300 text-[10px] mt-2 font-medium max-w-xs opacity-80">
                {restaurant.bannerSubtitle || "Discover our chef's special selection just for you."}
              </p>
            </div>
          </div>
        </div>

        {/* Client Welcome animations / layout tags */}
        <ClientWelcomeAnimations 
          restaurant={restaurant} 
          style={style} 
          headingStyle={headingStyle}
          todaySpecial={todaySpecial}
        />
      </div>

      {/* Floating Bottom Menu Bar */}
      <div className="fixed bottom-5 left-0 right-0 mx-auto w-[90%] max-w-[400px] z-40 px-3 no-print">
        <Link
          href={`/r/${slug}/menu`}
          className={`w-full py-3.5 flex items-center justify-center gap-2.5 shadow-2xl transition-all active:scale-[0.98] ${style.primaryBtn}`}
          style={{
            background: restaurant.primaryColor
              ? `linear-gradient(135deg, ${restaurant.primaryColor} 0%, ${restaurant.secondaryColor || restaurant.primaryColor} 100%)`
              : undefined,
            color: restaurant.primaryColor ? '#000000' : undefined,
            borderRadius: style.layoutMode === 'cafe' ? '9999px' : style.layoutMode === 'japanese' ? '0px' : undefined
          }}
        >
          <BookOpen className="w-4 h-4 shrink-0" />
          <span className="text-xs font-bold tracking-widest uppercase">Browse Menu</span>
        </Link>
      </div>
    </div>
  );
}
