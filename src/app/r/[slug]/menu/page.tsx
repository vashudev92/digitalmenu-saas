import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import MenuClientView from '@/components/menu-client-view';
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
    title: restaurant ? `${restaurant.name} | View Menu` : 'Digital Menu Card',
  };
}

export default async function RestaurantMenuPage({ params }: Props) {
  const { slug } = await params;
  console.log('[RestaurantMenuPage] Fetching menu for slug:', slug);
  
  const restaurant = await db.restaurant.findUnique({
    where: { slug },
    include: {
      subscription: true,
      categories: {
        where: { status: true },
        orderBy: { sortOrder: 'asc' },
      },
      menuItems: {
        where: { isAvailable: true },
        include: { category: true },
        orderBy: { name: 'asc' },
      },
    },
  });

  console.log('[RestaurantMenuPage] DB query finished. Restaurant found:', !!restaurant);

  if (!restaurant) {
    console.log('[RestaurantMenuPage] Restaurant not found, calling notFound()');
    notFound();
  }

  // Check if restaurant subscription is suspended
  const isSuspended = restaurant.subscription?.status === 'CANCELLED';

  if (isSuspended) {
    return (
      <div className="flex min-h-screen bg-[#0A0A0A] items-center justify-center p-4 text-center">
        <div className="glass p-8 max-w-sm rounded-3xl">
          <h2 className="font-serif text-2xl font-bold text-white mb-2">Menu Offline</h2>
          <p className="text-sm text-gray-500">This menu card is temporarily offline.</p>
        </div>
      </div>
    );
  }

  // Filter categories to only those that have items
  const activeCategories = restaurant.categories.filter((cat) => 
    restaurant.menuItems.some((item) => item.categoryId === cat.id)
  );

  return (
    <MenuClientView
      restaurantName={restaurant.name}
      restaurantSlug={restaurant.slug}
      logoUrl={restaurant.logo || ''}
      theme={restaurant.theme}
      currencySymbol={restaurant.currencySymbol}
      categories={activeCategories.map((c) => ({ id: c.id, name: c.name, icon: c.icon }))}
      menuItems={restaurant.menuItems.map((item) => ({
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
