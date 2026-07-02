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

    const requests = await db.upgradeRequest.findMany({
      include: {
        restaurant: {
          select: { name: true, slug: true },
        },
        plan: {
          select: { name: true, price: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error('Upgrade requests fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { requestId, action, adminNotes } = await request.json();

    if (!requestId || !action) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Fetch the request
    const upgradeReq = await db.upgradeRequest.findUnique({
      where: { id: requestId },
      include: {
        restaurant: {
          include: {
            subscription: true,
          },
        },
        plan: true,
      },
    });

    if (!upgradeReq) {
      return NextResponse.json({ error: 'Upgrade request not found' }, { status: 404 });
    }

    if (upgradeReq.status !== 'PENDING') {
      return NextResponse.json({ error: 'Upgrade request already processed' }, { status: 400 });
    }

    if (action === 'APPROVE') {
      // 1. Calculate new subscription end date
      const startDate = new Date();
      const endDate = new Date();
      const cycle = upgradeReq.billingCycle.toUpperCase();

      if (cycle === 'YEARLY') {
        endDate.setFullYear(startDate.getFullYear() + 1);
      } else if (cycle === 'QUARTERLY') {
        endDate.setMonth(startDate.getMonth() + 3);
      } else {
        // default MONTHLY
        endDate.setMonth(startDate.getMonth() + 1);
      }

      // 2. Update Subscription
      if (upgradeReq.restaurant.subscription) {
        await db.subscription.update({
          where: { id: upgradeReq.restaurant.subscription.id },
          data: {
            planId: upgradeReq.planId,
            status: 'ACTIVE',
            billingCycle: upgradeReq.billingCycle,
            startDate,
            endDate,
          },
        });
      } else {
        await db.subscription.create({
          data: {
            restaurantId: upgradeReq.restaurantId,
            planId: upgradeReq.planId,
            status: 'ACTIVE',
            billingCycle: upgradeReq.billingCycle,
            startDate,
            endDate,
          },
        });
      }

      // 3. Update Upgrade Request
      await db.upgradeRequest.update({
        where: { id: requestId },
        data: {
          status: 'APPROVED',
          adminNotes: adminNotes || 'Approved by system administrator.',
        },
      });

      // 4. Update or Create verified payment ledger entry
      const existingPayment = await db.payment.findFirst({
        where: {
          restaurantId: upgradeReq.restaurantId,
          referenceNo: upgradeReq.referenceNo,
          status: 'PENDING',
        },
      });

      if (existingPayment) {
        await db.payment.update({
          where: { id: existingPayment.id },
          data: {
            status: 'VERIFIED',
            adminNotes: adminNotes || 'Payment verified during upgrade request approval.',
          },
        });
      } else {
        await db.payment.create({
          data: {
            restaurantId: upgradeReq.restaurantId,
            amount: upgradeReq.amount,
            gstAmount: upgradeReq.amount * 0.18, // 18% standard GST
            paymentMode: 'BANK_TRANSFER',
            referenceNo: upgradeReq.referenceNo,
            status: 'VERIFIED',
            proofAttachment: upgradeReq.paymentProof,
            adminNotes: adminNotes || 'Manually created payment upon request approval.',
          },
        });
      }

      // 5. Create Audit Log
      await db.auditLog.create({
        data: {
          action: 'SUBSCRIPTION_UPGRADE_APPROVED',
          adminId: session.user.id,
          details: `Approved plan upgrade to '${upgradeReq.plan.name}' (${upgradeReq.billingCycle}) for restaurant '${upgradeReq.restaurant.name}'. Expiry date: ${endDate.toLocaleDateString()}.`,
          reason: adminNotes,
        },
      });

      return NextResponse.json({
        message: 'Upgrade request approved successfully and subscription activated.',
      });
    } else if (action === 'REJECT') {
      // 1. Update Upgrade Request
      await db.upgradeRequest.update({
        where: { id: requestId },
        data: {
          status: 'REJECTED',
          adminNotes: adminNotes || 'Rejected by system administrator.',
        },
      });

      // 2. Reject payment if found
      const existingPayment = await db.payment.findFirst({
        where: {
          restaurantId: upgradeReq.restaurantId,
          referenceNo: upgradeReq.referenceNo,
          status: 'PENDING',
        },
      });

      if (existingPayment) {
        await db.payment.update({
          where: { id: existingPayment.id },
          data: {
            status: 'FAILED',
            adminNotes: adminNotes || 'Payment rejected during upgrade request disapproval.',
          },
        });
      }

      // 3. Create Audit Log
      await db.auditLog.create({
        data: {
          action: 'SUBSCRIPTION_UPGRADE_REJECTED',
          adminId: session.user.id,
          details: `Rejected plan upgrade request to '${upgradeReq.plan.name}' (${upgradeReq.billingCycle}) for restaurant '${upgradeReq.restaurant.name}'.`,
          reason: adminNotes,
        },
      });

      return NextResponse.json({
        message: 'Upgrade request rejected successfully.',
      });
    }

    return NextResponse.json({ error: 'Invalid action type' }, { status: 400 });
  } catch (error) {
    console.error('Upgrade request action error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
