import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { restaurantId, action } = await request.json();

    if (!restaurantId || !action) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Verify restaurant exists
    const restaurant = await db.restaurant.findUnique({
      where: { id: restaurantId },
      include: { subscription: true },
    });

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    if (!restaurant.subscription) {
      return NextResponse.json({ error: 'No subscription found for this restaurant' }, { status: 400 });
    }

    const newStatus = action === 'suspend' ? 'CANCELLED' : 'ACTIVE';

    await db.subscription.update({
      where: { id: restaurant.subscription.id },
      data: { status: newStatus },
    });

    return NextResponse.json({
      message: `Restaurant subscription status updated to ${newStatus}`,
    });
  } catch (error) {
    console.error('Admin suspend error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
