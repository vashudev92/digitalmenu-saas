import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { SubscriptionStatus } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { restaurantId, planId, status, endDate } = await request.json();

    if (!restaurantId || !planId || !status || !endDate) {
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

    // Verify plan exists
    const plan = await db.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    const targetStatus = status as SubscriptionStatus;
    const targetEndDate = new Date(endDate);

    let updatedSubscription;
    if (restaurant.subscription) {
      updatedSubscription = await db.subscription.update({
        where: { id: restaurant.subscription.id },
        data: {
          planId: plan.id,
          status: targetStatus,
          endDate: targetEndDate,
        },
      });
    } else {
      updatedSubscription = await db.subscription.create({
        data: {
          restaurantId: restaurant.id,
          planId: plan.id,
          status: targetStatus,
          endDate: targetEndDate,
        },
      });
    }

    // Create Audit Log
    await db.auditLog.create({
      data: {
        action: 'SUBSCRIPTION_CHANGE_ADMIN',
        details: `Subscription updated for ${restaurant.name}: Plan = ${plan.name}, Status = ${targetStatus}, Expiry = ${targetEndDate.toLocaleDateString()}`,
        adminId: session.user.id,
        reason: 'Manual Admin override from Restaurant CRM panel',
      },
    });

    return NextResponse.json({
      message: 'Subscription updated successfully',
      subscription: updatedSubscription,
    });
  } catch (error) {
    console.error('Change subscription error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
