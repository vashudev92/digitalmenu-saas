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

    const plans = await db.plan.findMany({
      orderBy: { price: 'asc' },
    });

    return NextResponse.json({ plans });
  } catch (error) {
    console.error('Plans fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      planId,
      price,
      billingCycleQuarterlyCost,
      billingCycleYearlyCost,
      diningAreasAllowed,
      qrCodesAllowed,
      galleryImagesAllowed,
      premiumThemesAllowed,
      storageGb,
      supportLevel,
      features,
      description,
    } = body;

    if (!planId) {
      return NextResponse.json({ error: 'Missing plan ID' }, { status: 400 });
    }

    const existingPlan = await db.plan.findUnique({
      where: { id: planId },
    });

    if (!existingPlan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    const updatedPlan = await db.plan.update({
      where: { id: planId },
      data: {
        price: price !== undefined ? parseFloat(price) : existingPlan.price,
        billingCycleQuarterlyCost: billingCycleQuarterlyCost !== undefined ? parseFloat(billingCycleQuarterlyCost) : existingPlan.billingCycleQuarterlyCost,
        billingCycleYearlyCost: billingCycleYearlyCost !== undefined ? parseFloat(billingCycleYearlyCost) : existingPlan.billingCycleYearlyCost,
        diningAreasAllowed: diningAreasAllowed !== undefined ? parseInt(diningAreasAllowed) : existingPlan.diningAreasAllowed,
        qrCodesAllowed: qrCodesAllowed !== undefined ? parseInt(qrCodesAllowed) : existingPlan.qrCodesAllowed,
        galleryImagesAllowed: galleryImagesAllowed !== undefined ? parseInt(galleryImagesAllowed) : existingPlan.galleryImagesAllowed,
        premiumThemesAllowed: premiumThemesAllowed !== undefined ? !!premiumThemesAllowed : existingPlan.premiumThemesAllowed,
        storageGb: storageGb !== undefined ? parseFloat(storageGb) : existingPlan.storageGb,
        supportLevel: supportLevel !== undefined ? supportLevel : existingPlan.supportLevel,
        features: features !== undefined ? features : existingPlan.features,
        description: description !== undefined ? description : existingPlan.description,
      },
    });

    // Log update in Audit Log
    await db.auditLog.create({
      data: {
        action: 'PLAN_CONFIG_UPDATED',
        adminId: session.user.id,
        details: `Updated quotas and rates configuration for plan '${existingPlan.name}'.`,
      },
    });

    return NextResponse.json({
      message: 'Plan configuration updated successfully.',
      plan: updatedPlan,
    });
  } catch (error) {
    console.error('Plan config update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
