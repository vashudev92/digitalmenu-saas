import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Fetch statistics
    const totalRestaurants = await db.restaurant.count();
    const activeSubCount = await db.subscription.count({
      where: { status: { in: ['ACTIVE', 'TRIAL'] } },
    });
    const suspendedCount = await db.subscription.count({
      where: { status: 'CANCELLED' },
    });
    const totalMenuItems = await db.menuItem.count();

    // 2. Fetch all restaurants with details
    const list = await db.restaurant.findMany({
      include: {
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
        subscription: {
          include: {
            plan: {
              select: {
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            menuItems: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const restaurantsList = list.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      theme: r.theme,
      createdAt: r.createdAt,
      ownerName: r.owner.name,
      ownerEmail: r.owner.email,
      dishesCount: r._count.menuItems,
      planName: r.subscription?.plan?.name || 'None',
      subStatus: r.subscription?.status || 'EXPIRED',
    }));

    return NextResponse.json({
      stats: {
        totalRestaurants,
        activeSubCount,
        suspendedCount,
        totalMenuItems,
      },
      restaurants: restaurantsList,
    });
  } catch (error) {
    console.error('Admin dashboard fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
