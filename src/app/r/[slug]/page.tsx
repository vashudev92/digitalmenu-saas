import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChefHat, BookOpen } from 'lucide-react';
import type { Metadata } from 'next';
import { getTheme, getContrastColor } from '@/lib/theme-config';
import FontLoader from '@/components/font-loader';
import ClientWelcomeAnimations from '@/components/client-welcome-animations';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ profile?: string }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { profile: profileSlug } = (await searchParams) || {};
  const restaurant = await db.restaurant.findUnique({
    where: { slug },
  });

  if (!restaurant) {
    return { title: 'Digital Menu' };
  }

  let title = `${restaurant.name} | Welcome`;
  if (profileSlug) {
    const profile = await db.menuProfile.findUnique({
      where: {
        restaurantId_slug: {
          restaurantId: restaurant.id,
          slug: profileSlug,
        },
      },
    });
    if (profile) {
      title = `${restaurant.name} — ${profile.name} | Welcome`;
    }
  }

  return {
    title,
    description: restaurant.description || 'Browse our premium menu listings.',
    ...(restaurant.favicon && {
      icons: {
        icon: restaurant.favicon,
      },
    }),
  };
}

export default async function RestaurantWelcomePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { profile: profileSlug } = (await searchParams) || {};
  
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

  // Find the menu profile if specified
  let resolvedProfile = null;
  if (profileSlug) {
    resolvedProfile = await db.menuProfile.findUnique({
      where: {
        restaurantId_slug: {
          restaurantId: restaurant.id,
          slug: profileSlug,
        },
      },
    });
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
  const resolvedTheme = resolvedProfile?.theme || restaurant.theme;
  const resolvedFontHeading = resolvedProfile?.fontHeading || restaurant.fontHeading;
  const resolvedFontBody = resolvedProfile?.fontBody || restaurant.fontBody;
  const resolvedLogo = resolvedProfile?.logoOverride || restaurant.logo;
  const resolvedBanner = resolvedProfile?.bannerImage || restaurant.banner;
  const resolvedPrimaryColor = resolvedProfile?.primaryColor || restaurant.primaryColor;
  const resolvedSecondaryColor = resolvedProfile?.secondaryColor || restaurant.secondaryColor;
  const resolvedAccentColor = resolvedProfile?.accentColor || restaurant.accentColor;
  const resolvedOpeningHours = resolvedProfile?.openingHours || restaurant.openingHours;

  const style = getTheme(resolvedTheme);

  // Font styles
  const headingStyle = resolvedFontHeading ? { fontFamily: `'${resolvedFontHeading}', serif` } : {};
  const bodyStyle = resolvedFontBody ? { fontFamily: `'${resolvedFontBody}', sans-serif` } : {};

  // Custom colors variables mapping
  const brandStyles = {
    '--brand-primary': resolvedPrimaryColor || style.accentHex,
    '--brand-secondary': resolvedSecondaryColor || style.accentHex,
    '--brand-accent': resolvedAccentColor || style.accentHex,
    ...bodyStyle
  } as unknown as React.CSSProperties;

  const todaySpecial = restaurant.menuItems[0] || {
    name: 'Chef Specialty Selection',
    description: 'Fresh locally sourced seasonal ingredients crafted by culinary masters.',
    price: 28.00,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600',
  };

  const resolvedRestaurant = {
    ...restaurant,
    name: resolvedProfile?.name ? `${restaurant.name} (${resolvedProfile.name})` : restaurant.name,
    logo: resolvedLogo,
    banner: resolvedBanner,
    theme: resolvedTheme,
    primaryColor: resolvedPrimaryColor,
    secondaryColor: resolvedSecondaryColor,
    accentColor: resolvedAccentColor,
    fontHeading: resolvedFontHeading,
    fontBody: resolvedFontBody,
    openingHours: resolvedOpeningHours,
  };

  return (
    <ClientWelcomeAnimations 
      restaurant={resolvedRestaurant} 
      style={style} 
      headingStyle={headingStyle}
      todaySpecial={todaySpecial}
      profileSlug={profileSlug}
      brandStyles={brandStyles}
    />
  );
}
