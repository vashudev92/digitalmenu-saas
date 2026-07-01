import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import MenuClientView from '@/components/menu-client-view';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string; profileSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, profileSlug } = await params;
  
  const restaurant = await db.restaurant.findUnique({
    where: { slug },
  });

  if (!restaurant) {
    return { title: 'Digital Menu Card' };
  }

  const profile = await db.menuProfile.findUnique({
    where: {
      restaurantId_slug: {
        restaurantId: restaurant.id,
        slug: profileSlug,
      },
    },
  });

  const profileName = profile ? ` — ${profile.name}` : '';

  return {
    title: `${restaurant.name}${profileName} | Menu`,
    // Per-restaurant favicon
    ...(restaurant.favicon && {
      icons: {
        icon: restaurant.favicon,
      },
    }),
  };
}

export default async function ProfileMenuPage({ params }: Props) {
  const { slug, profileSlug } = await params;

  const restaurant = await db.restaurant.findUnique({
    where: { slug },
    include: {
      subscription: true,
    },
  });

  if (!restaurant) {
    notFound();
  }

  // Check subscription
  if (restaurant.subscription?.status === 'CANCELLED') {
    return (
      <div className="flex min-h-screen bg-[#0A0A0A] items-center justify-center p-4 text-center">
        <div className="glass p-8 max-w-sm rounded-3xl">
          <h2 className="font-serif text-2xl font-bold text-white mb-2">Menu Offline</h2>
          <p className="text-sm text-gray-500">This menu card is temporarily offline.</p>
        </div>
      </div>
    );
  }

  // Find the menu profile
  const profile = await db.menuProfile.findUnique({
    where: {
      restaurantId_slug: {
        restaurantId: restaurant.id,
        slug: profileSlug,
      },
    },
  });

  if (!profile || !profile.status) {
    notFound();
  }

  // Fetch categories and items for this specific profile
  const categories = await db.category.findMany({
    where: {
      restaurantId: restaurant.id,
      menuProfileId: profile.id,
      status: true,
    },
    orderBy: { sortOrder: 'asc' },
  });

  const menuItems = await db.menuItem.findMany({
    where: {
      restaurantId: restaurant.id,
      menuProfileId: profile.id,
      isAvailable: true,
    },
    include: { category: true },
    orderBy: { name: 'asc' },
  });

  // Filter categories to only those with items
  const activeCategories = categories.filter((cat) =>
    menuItems.some((item) => item.categoryId === cat.id)
  );

  // Resolve theme, fonts, and colors (profile overrides restaurant defaults)
  const resolvedTheme = profile.theme || restaurant.theme;
  const resolvedFontHeading = profile.fontHeading || restaurant.fontHeading;
  const resolvedFontBody = profile.fontBody || restaurant.fontBody;
  const resolvedLogo = profile.logoOverride || restaurant.logo;
  const resolvedPrimaryColor = profile.primaryColor || restaurant.primaryColor;
  const resolvedSecondaryColor = profile.secondaryColor || restaurant.secondaryColor;
  const resolvedAccentColor = profile.accentColor || restaurant.accentColor;
  const resolvedOpeningHours = profile.openingHours || restaurant.openingHours;

  return (
    <MenuClientView
      restaurantName={restaurant.name}
      restaurantSlug={restaurant.slug}
      logoUrl={resolvedLogo || ''}
      theme={resolvedTheme}
      currencySymbol={restaurant.currencySymbol}
      fontHeading={resolvedFontHeading}
      fontBody={resolvedFontBody}
      primaryColor={resolvedPrimaryColor}
      secondaryColor={resolvedSecondaryColor}
      accentColor={resolvedAccentColor}
      favicon={restaurant.favicon}
      openingHours={resolvedOpeningHours}
      categories={activeCategories.map((c) => ({ id: c.id, name: c.name, icon: c.icon }))}
      menuItems={menuItems.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        price: item.price,
        image: item.image || '',
        isVeg: item.isVeg,
        isFeatured: item.isFeatured,
        categoryId: item.categoryId,
      }))}
      address={restaurant.address}
      phone={restaurant.phone}
      website={restaurant.website}
      googleMapsUrl={restaurant.googleMapsUrl}
    />
  );
}
