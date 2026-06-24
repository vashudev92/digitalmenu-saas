import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const restaurant = await db.restaurant.findUnique({
      where: { ownerId: session.user.id },
    });

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    // Delete all categories and cascade menu items
    await db.category.deleteMany({
      where: { restaurantId: restaurant.id },
    });

    return NextResponse.json({ message: 'Menu database reset successfully' });
  } catch (error) {
    console.error('Error resetting menu:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
