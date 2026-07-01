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
    name: 'Truffle Tagliatelle',
    description: 'Tandoori cottage cheese, black truffle paste, forest mushrooms.',
    price: 320,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=500&fit=crop',
  };

  return (
    <div 
      className={`min-h-screen w-full overflow-x-hidden ${style.bg} ${style.text} flex flex-col justify-between max-w-[500px] mx-auto relative shadow-2xl pb-28`} 
      style={brandStyles}
    >
      <FontLoader headingFont={restaurant.fontHeading} bodyFont={restaurant.fontBody} />
      
      <div>
        {/* Sticky Header styled by active Theme layoutMode */}
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
                className={`w-7 h-7 object-cover mb-1.5 border border-gray-900/40 ${
                  style.layoutMode === 'cafe' ? 'rounded-2xl' : 
                  style.layoutMode === 'japanese' ? 'rounded-none' : 'rounded-full'
                }`} 
              />
            ) : (
              <ChefHat className="w-5 h-5 mb-1" style={{ color: restaurant.primaryColor || style.accentHex }} />
            )}
            <span 
              className={`font-bold tracking-wide uppercase ${
                style.layoutMode === 'luxury' ? 'font-serif text-sm tracking-widest text-[#D4A437]' :
                style.layoutMode === 'japanese' ? 'font-mono text-xs tracking-widest font-black' : 'text-sm'
              }`} 
              style={headingStyle}
            >
              {restaurant.name}
            </span>
          </div>
        </header>

        {/* Hero Section themed dynamically */}
        <div className={`px-4 mt-5 ${style.layoutMode === 'japanese' ? 'px-0 mt-0' : ''}`}>
          <div 
            className={`relative overflow-hidden bg-gray-950 shadow-md ${
              style.layoutMode === 'luxury' ? 'rounded-none border-2 border-[#D4A437]/20 h-[320px]' : 
              style.layoutMode === 'cafe' ? 'rounded-[2rem] border-none h-[280px]' :
              style.layoutMode === 'japanese' ? 'rounded-none border-none h-[350px]' :
              style.layoutMode === 'bistro' ? 'rounded-xl border-4 border-[#EAE1D2] h-[280px]' :
              style.layoutMode === 'indian' ? 'rounded-2xl border-2 border-[#E8973F]/30 h-[300px]' :
              'rounded-[1.5rem] border border-[#E0D5C8] h-[290px]' // beach layout
            }`}
          >
            {restaurant.banner ? (
              <img src={restaurant.banner} alt="Food Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-b from-gray-950 to-gray-900" />
            )}
            
            {/* Themed Hero overlay gradient */}
            <div className={`absolute inset-0 flex flex-col justify-end p-6 ${
              style.layoutMode === 'luxury' ? 'bg-gradient-to-t from-black/95 via-black/40 to-black/10' :
              style.layoutMode === 'japanese' ? 'bg-gradient-to-t from-black/80 via-black/30 to-transparent' :
              'bg-gradient-to-t from-black/80 via-black/30 to-black/5'
            }`}>
              <h2 
                className={`text-white text-3xl font-bold leading-tight tracking-tight ${
                  style.layoutMode === 'luxury' ? 'font-serif tracking-wider uppercase' :
                  style.layoutMode === 'japanese' ? 'font-mono tracking-wide uppercase' : ''
                }`} 
                style={headingStyle}
              >
                {restaurant.bannerTitle1 || 'Good Food'}<br />
                <span style={{ color: restaurant.primaryColor || style.accentHex }}>
                  {restaurant.bannerTitle2 || 'Great Mood'}
                </span>
              </h2>
              <p className="text-gray-300 text-xs mt-2 font-medium max-w-xs opacity-80">
                {restaurant.bannerSubtitle || "Discover our chef's special selection just for you."}
              </p>
              <div 
                className={`w-12 border-t-2 mt-4 ${
                  style.layoutMode === 'japanese' ? 'hidden' : ''
                }`} 
                style={{ borderColor: restaurant.primaryColor || style.accentHex }} 
              />
            </div>
          </div>
        </div>

        {/* Info Badges Row themed */}
        <div className={`grid grid-cols-3 gap-3 px-4 mt-6 ${style.layoutMode === 'japanese' ? 'px-3 mt-4' : ''}`}>
          {[
            { Icon: ShieldCheck, title: restaurant.badge1Title || 'Hygienic', desc: restaurant.badge1Desc || 'Kitchen' },
            { Icon: Flame, title: restaurant.badge2Title || 'Fresh', desc: restaurant.badge2Desc || 'Ingredients' },
            { Icon: Sparkles, title: restaurant.badge3Title || 'Chef', desc: restaurant.badge3Desc || 'Specials' }
          ].map((b, idx) => (
            <div 
              key={idx} 
              className={`p-3 text-center flex flex-col items-center justify-center border transition-all ${style.cardBg} ${style.cardRadius}`}
              style={{ borderColor: restaurant.primaryColor ? `${restaurant.primaryColor}22` : undefined }}
            >
              <b.Icon className="w-4 h-4 mb-1" style={{ color: restaurant.primaryColor || style.accentHex }} />
              <span 
                className={`text-[9px] font-bold tracking-wider uppercase leading-none ${
                  style.layoutMode === 'luxury' ? 'font-serif text-[#D4A437]' :
                  style.layoutMode === 'japanese' ? 'font-mono text-black font-semibold' : ''
                }`}
              >
                {b.title}
              </span>
              <span className="text-[8px] text-gray-500 mt-1 uppercase font-semibold">{b.desc}</span>
            </div>
          ))}
        </div>

        {/* Today's Special Dish themed */}
        <div className="px-4 mt-8">
          <h3 
            className={`text-lg font-bold mb-3.5 flex items-center gap-1.5 ${
              style.layoutMode === 'luxury' ? 'font-serif uppercase tracking-widest text-[#D4A437]' :
              style.layoutMode === 'japanese' ? 'font-mono uppercase tracking-widest text-black border-b border-black pb-1' : ''
            }`} 
            style={headingStyle}
          >
            Today's Special
          </h3>

          <Link
            href={`/r/${slug}/menu`}
            className={`p-4 border flex gap-4 items-center justify-between shadow-sm active:scale-[0.99] transition-transform ${style.cardBg} ${style.cardRadius}`}
            style={{ borderColor: restaurant.primaryColor ? `${restaurant.primaryColor}22` : undefined }}
          >
            <div className="flex gap-4 items-center overflow-hidden flex-1">
              <div 
                className={`w-16 h-16 bg-gray-950 border border-gray-900 overflow-hidden shrink-0 flex items-center justify-center ${
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
              <div className="overflow-hidden flex-1">
                <div className="flex items-center gap-2">
                  <h4 
                    className={`text-sm truncate ${
                      style.layoutMode === 'luxury' ? 'font-serif font-bold text-white' : 
                      style.layoutMode === 'japanese' ? 'font-mono uppercase tracking-wider text-black font-semibold' : 'font-bold'
                    }`}
                  >
                    {todaySpecial.name}
                  </h4>
                  <span className={`w-2.5 h-2.5 border flex items-center justify-center rounded shrink-0 ${todaySpecial.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                    <span className={`w-1 h-1 rounded-full ${todaySpecial.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                  </span>
                </div>
                <p className={`text-[9px] truncate mt-1 ${style.muted}`}>{todaySpecial.description}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  <Star className="w-3 h-3 fill-current animate-pulse" style={{ color: restaurant.primaryColor || style.accentHex }} />
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
                className={`font-serif font-bold text-sm`} 
                style={{ color: restaurant.primaryColor || style.accentHex }}
              >
                {restaurant.currencySymbol}{todaySpecial.price.toFixed(2)}
              </span>
            </div>
          </Link>
        </div>

        {/* Restaurant Info & Location Cards themed */}
        <div className="px-4 mt-8 pb-8 space-y-4">
          <h3 
            className={`text-lg font-bold flex items-center gap-1.5 ${
              style.layoutMode === 'luxury' ? 'font-serif uppercase tracking-widest text-[#D4A437]' :
              style.layoutMode === 'japanese' ? 'font-mono uppercase tracking-widest text-black border-b border-black pb-1' : ''
            }`} 
            style={headingStyle}
          >
            Restaurant Details
          </h3>

          <div className="grid grid-cols-1 gap-3.5">
            {/* Opening Hours Card */}
            <div 
              className={`p-4 border flex items-center gap-4 ${style.cardBg} ${style.cardRadius}`}
              style={{ borderColor: restaurant.primaryColor ? `${restaurant.primaryColor}22` : undefined }}
            >
              <div className="p-2.5 bg-gray-500/5 rounded-xl border border-gray-900/10">
                <Clock className="w-4.5 h-4.5" style={{ color: restaurant.primaryColor || style.accentHex }} />
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

            {/* Locate Us Card */}
            {restaurant.address && (
              <div 
                className={`p-4 border flex flex-col gap-4.5 ${style.cardBg} ${style.cardRadius}`}
                style={{ borderColor: restaurant.primaryColor ? `${restaurant.primaryColor}22` : undefined }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-gray-500/5 rounded-xl border border-gray-900/10">
                    <MapPin className="w-4.5 h-4.5" style={{ color: restaurant.primaryColor || style.accentHex }} />
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
                    className="w-full py-2.5 rounded-xl bg-gray-950 border border-gray-900 text-xs font-bold text-center text-gray-300 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
                    style={{ 
                      borderColor: restaurant.primaryColor ? `${restaurant.primaryColor}30` : undefined,
                      fontFamily: style.layoutMode === 'japanese' ? 'monospace' : undefined,
                      borderRadius: style.layoutMode === 'cafe' ? '9999px' : style.layoutMode === 'japanese' ? '0px' : undefined
                    }}
                  >
                    <MapPin className="w-3.5 h-3.5 animate-bounce" style={{ color: restaurant.primaryColor || style.accentHex }} />
                    📍 Locate Us
                  </a>
                )}
              </div>
            )}

            {/* Contact details */}
            {(restaurant.phone || restaurant.website) && (
              <div 
                className={`p-4 border grid grid-cols-2 gap-4 ${style.cardBg} ${style.cardRadius}`}
                style={{ borderColor: restaurant.primaryColor ? `${restaurant.primaryColor}22` : undefined }}
              >
                {restaurant.phone && (
                  <a href={`tel:${restaurant.phone}`} className="flex flex-col p-1 hover:bg-gray-500/5 rounded-lg transition-all">
                    <span className="text-[8px] uppercase font-bold tracking-widest text-gray-500">Phone Contact</span>
                    <span className="text-xs font-semibold mt-1 text-white truncate">{restaurant.phone}</span>
                  </a>
                )}
                {restaurant.website && (
                  <a
                    href={restaurant.website.startsWith('http') ? restaurant.website : `https://${restaurant.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col p-1 hover:bg-gray-500/5 rounded-lg transition-all"
                  >
                    <span className="text-[8px] uppercase font-bold tracking-widest text-gray-500">Web Site</span>
                    <span className="text-xs font-semibold mt-1 truncate hover:underline text-[#D4A437]" style={{ color: restaurant.primaryColor || style.accentHex }}>
                      {restaurant.website.replace(/https?:\/\/(www\.)?/, '')}
                    </span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Bottom Menu Navigation Bar themed */}
      <div className="fixed bottom-5 left-0 right-0 mx-auto w-[90%] max-w-[430px] z-40 px-3 no-print">
        <Link
          href={`/r/${slug}/menu`}
          className={`w-full py-4.5 flex items-center justify-center gap-2.5 shadow-2xl transition-all duration-300 active:scale-[0.98] ${style.primaryBtn}`}
          style={{
            background: restaurant.primaryColor
              ? `linear-gradient(135deg, ${restaurant.primaryColor} 0%, ${restaurant.secondaryColor || restaurant.primaryColor} 100%)`
              : undefined,
            color: restaurant.primaryColor ? '#000000' : undefined,
            borderRadius: style.layoutMode === 'cafe' ? '9999px' : style.layoutMode === 'japanese' ? '0px' : undefined
          }}
        >
          <BookOpen className="w-4 h-4 shrink-0" />
          <span className="text-xs font-bold tracking-widest uppercase">Browse Full Menu</span>
        </Link>
      </div>
    </div>
  );
}
