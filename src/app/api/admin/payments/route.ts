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

    const payments = await db.payment.findMany({
      include: {
        restaurant: {
          select: { name: true, slug: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ payments });
  } catch (error) {
    console.error('Payments ledger fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { restaurantId, amount, paymentMode, referenceNo, status, adminNotes } = await request.json();

    if (!restaurantId || !amount || !paymentMode) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const restaurant = await db.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    const gstAmount = amount * 0.18; // Standard GST

    const newPayment = await db.payment.create({
      data: {
        restaurantId,
        amount: parseFloat(amount),
        gstAmount,
        paymentMode,
        referenceNo,
        status: status || 'PENDING',
        adminNotes: adminNotes || 'Created manually by administrator.',
      },
    });

    // Log the manual creation in Audit Logs
    await db.auditLog.create({
      data: {
        action: 'PAYMENT_MANUALLY_CREATED',
        adminId: session.user.id,
        details: `Manually created payment entry for restaurant '${restaurant.name}' of amount ${restaurant.currencySymbol || '₹'}${amount} (${status}).`,
        reason: adminNotes,
      },
    });

    return NextResponse.json({
      message: 'Payment entry created successfully.',
      payment: newPayment,
    });
  } catch (error) {
    console.error('Manual payment creation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { paymentId, status, adminNotes } = await request.json();

    if (!paymentId || !status) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const payment = await db.payment.findUnique({
      where: { id: paymentId },
      include: { restaurant: true },
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment record not found' }, { status: 404 });
    }

    const updatedPayment = await db.payment.update({
      where: { id: paymentId },
      data: {
        status,
        adminNotes: adminNotes || payment.adminNotes,
      },
    });

    // Create Audit Log
    await db.auditLog.create({
      data: {
        action: 'PAYMENT_STATUS_UPDATED',
        adminId: session.user.id,
        details: `Updated payment status to '${status}' for restaurant '${payment.restaurant.name}' (Ref: ${payment.referenceNo || 'None'}).`,
        reason: adminNotes,
      },
    });

    return NextResponse.json({
      message: 'Payment status updated successfully.',
      payment: updatedPayment,
    });
  } catch (error) {
    console.error('Payment status update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
