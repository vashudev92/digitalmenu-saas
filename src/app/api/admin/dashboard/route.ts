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

    // 1. Core KPIs
    const totalRestaurants = await db.restaurant.count();
    const activeRestaurants = await db.subscription.count({
      where: { status: 'ACTIVE' },
    });
    const trialCount = await db.subscription.count({
      where: { status: 'TRIAL' },
    });
    const expiredCount = await db.subscription.count({
      where: { status: 'EXPIRED' },
    });
    const cancelledCount = await db.subscription.count({
      where: { status: 'CANCELLED' },
    });

    const pendingApprovals = await db.upgradeRequest.count({
      where: { status: 'PENDING' },
    });
    const pendingPayments = await db.payment.count({
      where: { status: 'PENDING' },
    });

    // Calculate MRR/Revenue from verified payments
    const verifiedPayments = await db.payment.findMany({
      where: { status: 'VERIFIED' },
    });
    const totalRevenue = verifiedPayments.reduce((acc, curr) => acc + curr.amount, 0);

    // Calculate Expiring Soon (next 7 days)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const expiringSoonCount = await db.subscription.count({
      where: {
        status: { in: ['ACTIVE', 'TRIAL'] },
        endDate: {
          lte: sevenDaysFromNow,
          gte: new Date(),
        },
      },
    });

    // 2. Theme Usage Stats
    const restaurantsForTheme = await db.restaurant.findMany({
      select: { theme: true },
    });
    const themeUsage: Record<string, number> = {};
    restaurantsForTheme.forEach((r) => {
      themeUsage[r.theme] = (themeUsage[r.theme] || 0) + 1;
    });

    // 3. CRM Restaurant List
    const rawRestaurants = await db.restaurant.findMany({
      include: {
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
        subscription: {
          include: {
            plan: true,
          },
        },
        _count: {
          select: {
            menuItems: true,
            menuProfiles: true,
            qrCodes: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const restaurantsList = rawRestaurants.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      logo: r.logo,
      ownerName: r.owner.name,
      ownerEmail: r.owner.email,
      dishesCount: r._count.menuItems,
      profilesCount: r._count.menuProfiles,
      qrCount: r._count.qrCodes,
      theme: r.theme,
      planName: r.subscription?.plan?.name || 'Starter',
      subStatus: r.subscription?.status || 'EXPIRED',
      expiryDate: r.subscription?.endDate || null,
      createdAt: r.createdAt,
    }));

    // 4. Upgrade Requests
    const upgradeRequests = await db.upgradeRequest.findMany({
      include: {
        restaurant: {
          select: { name: true, slug: true },
        },
        plan: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // 5. Payments Ledger
    const payments = await db.payment.findMany({
      include: {
        restaurant: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // 6. Audit Logs
    const auditLogs = await db.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // 7. Dynamic SVG chart trend mocks (restaurant growth & revenue over last 6 months)
    const monthlyStats = [
      { month: 'Jan', registrations: 2, revenue: 19 },
      { month: 'Feb', registrations: 4, revenue: 49 },
      { month: 'Mar', registrations: 7, revenue: 98 },
      { month: 'Apr', registrations: 12, revenue: 219 },
      { month: 'May', registrations: 18, revenue: 399 },
      { month: 'Jun', registrations: totalRestaurants, revenue: totalRevenue || 599 },
    ];

    // 8. System Notifications
    const notifications = [];
    if (pendingApprovals > 0) {
      notifications.push({
        id: '1',
        type: 'upgrade_request',
        title: 'Upgrade Requests Pending',
        description: `There are ${pendingApprovals} pending subscription upgrade requests to verify.`,
        date: new Date(),
      });
    }
    if (pendingPayments > 0) {
      notifications.push({
        id: '2',
        type: 'payment_pending',
        title: 'Payments Verification Required',
        description: `There are ${pendingPayments} manual payment proofs waiting to be verified.`,
        date: new Date(),
      });
    }
    if (expiringSoonCount > 0) {
      notifications.push({
        id: '3',
        type: 'subscription_expiring',
        title: 'Subscriptions Expiring',
        description: `${expiringSoonCount} restaurant plans are expiring within the next 7 days.`,
        date: new Date(),
      });
    }

    return NextResponse.json({
      stats: {
        totalRestaurants,
        activeRestaurants,
        trialCount,
        expiredCount,
        cancelledCount,
        pendingApprovals,
        pendingPayments,
        totalRevenue,
        expiringSoonCount,
        monthlyMRR: totalRevenue / 12 || 49,
      },
      restaurants: restaurantsList,
      upgradeRequests,
      payments,
      auditLogs,
      themeUsage,
      monthlyStats,
      notifications,
    });
  } catch (error) {
    console.error('Admin dashboard fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
