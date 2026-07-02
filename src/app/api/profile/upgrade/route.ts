import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
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

    const pendingRequests = await db.upgradeRequest.findMany({
      where: { restaurantId: restaurant.id, status: 'PENDING' },
      include: { plan: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ requests: pendingRequests });
  } catch (error) {
    console.error('Error loading pending upgrade requests:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
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

    const { planId, billingCycle, paymentMode, paymentProof, referenceNo } = await request.json();

    if (!planId || !billingCycle || !paymentMode) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const plan = await db.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // Determine billing cycle costs
    let amount = plan.price;
    if (billingCycle === 'QUARTERLY') {
      amount = plan.billingCycleQuarterlyCost || (plan.price * 3 * 0.9); // 10% discount default
    } else if (billingCycle === 'YEARLY') {
      amount = plan.billingCycleYearlyCost || (plan.price * 12 * 0.8); // 20% discount default
    }

    // 1. Create UpgradeRequest
    const upgradeRequest = await db.upgradeRequest.create({
      data: {
        restaurantId: restaurant.id,
        planId: plan.id,
        billingCycle,
        amount,
        paymentProof: paymentProof || null,
        referenceNo: referenceNo || null,
        status: 'PENDING',
      },
    });

    // 2. Create Payment record
    await db.payment.create({
      data: {
        restaurantId: restaurant.id,
        amount,
        gstAmount: amount * 0.18, // 18% GST standard
        paymentMode,
        referenceNo: referenceNo || null,
        status: 'PENDING',
        proofAttachment: paymentProof || null,
        adminNotes: `Upgrade request generated for plan ${plan.name} (${billingCycle}).`,
      },
    });

    return NextResponse.json({
      message: 'Upgrade request generated and payment logged successfully.',
      upgradeRequest,
    });
  } catch (error) {
    console.error('Error generating upgrade request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
