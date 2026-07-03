import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/menu-profiles/[id] — Get a single menu profile with full details
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const restaurant = await db.restaurant.findUnique({
      where: { ownerId: session.user.id },
      select: { id: true },
    });

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    const profile = await db.menuProfile.findFirst({
      where: { id, restaurantId: restaurant.id },
      include: {
        categories: {
          orderBy: { sortOrder: 'asc' },
          include: {
            _count: { select: { menuItems: true } },
          },
        },
        menuItems: {
          orderBy: { createdAt: 'desc' },
        },
        qrCode: true,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Menu profile not found' }, { status: 404 });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Menu profile GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/menu-profiles/[id] — Update a menu profile
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const restaurant = await db.restaurant.findUnique({
      where: { ownerId: session.user.id },
      select: { id: true },
    });

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    // Verify ownership
    const existing = await db.menuProfile.findFirst({
      where: { id, restaurantId: restaurant.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Menu profile not found' }, { status: 404 });
    }

    const body = await request.json();
    const {
      name, slug, description, theme,
      primaryColor, secondaryColor, accentColor,
      fontHeading, fontBody, bannerImage, logoOverride, status, openingHours,
    } = body;

    // Verify theme selection permissions if specified
    if (theme) {
      const subscription = await db.subscription.findUnique({
        where: { restaurantId: restaurant.id },
        include: { plan: true },
      });
      
      if (subscription) {
        const getThemeTier = (key: string): string => {
          if (key === 'LUXURY_DARK' || key === 'MINIMAL_JAPANESE') return 'STARTER';
          if (key === 'MODERN_CAFE' || key === 'ITALIAN_BISTRO') return 'PROFESSIONAL';
          return 'PREMIUM';
        };
        const tier = getThemeTier(theme);
        const planName = subscription.plan.name;
        let isAllowed = true;
        if (planName === 'Free') {
          isAllowed = tier === 'STARTER';
        } else if (planName === 'Premium') {
          isAllowed = tier === 'STARTER' || tier === 'PROFESSIONAL';
        }
        if (!isAllowed) {
          return NextResponse.json(
            { error: `The theme "${theme}" is locked on your current plan. Please upgrade to a higher tier plan.` },
            { status: 403 }
          );
        }
      }
    }

    // Validate slug if changed
    if (slug && slug !== existing.slug) {
      const slugRegex = /^[a-z0-9-]+$/;
      if (!slugRegex.test(slug)) {
        return NextResponse.json({ error: 'Slug must contain only lowercase letters, numbers, and hyphens' }, { status: 400 });
      }

      const slugConflict = await db.menuProfile.findUnique({
        where: {
          restaurantId_slug: {
            restaurantId: restaurant.id,
            slug,
          },
        },
      });

      if (slugConflict && slugConflict.id !== id) {
        return NextResponse.json({ error: 'A menu profile with this slug already exists' }, { status: 409 });
      }
    }

    const profile = await db.menuProfile.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description: description || null }),
        ...(theme !== undefined && { theme: theme || null }),
        ...(primaryColor !== undefined && { primaryColor: primaryColor || null }),
        ...(secondaryColor !== undefined && { secondaryColor: secondaryColor || null }),
        ...(accentColor !== undefined && { accentColor: accentColor || null }),
        ...(fontHeading !== undefined && { fontHeading: fontHeading || null }),
        ...(fontBody !== undefined && { fontBody: fontBody || null }),
        ...(bannerImage !== undefined && { bannerImage: bannerImage || null }),
        ...(logoOverride !== undefined && { logoOverride: logoOverride || null }),
        ...(openingHours !== undefined && { openingHours: openingHours || null }),
        ...(status !== undefined && { status }),
      },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Menu profile PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/menu-profiles/[id] — Delete a menu profile
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const restaurant = await db.restaurant.findUnique({
      where: { ownerId: session.user.id },
      select: { id: true },
    });

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    const existing = await db.menuProfile.findFirst({
      where: { id, restaurantId: restaurant.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Menu profile not found' }, { status: 404 });
    }

    // Prevent deleting the last profile
    const profileCount = await db.menuProfile.count({
      where: { restaurantId: restaurant.id },
    });

    if (profileCount <= 1) {
      return NextResponse.json({ error: 'Cannot delete the last menu profile. At least one profile is required.' }, { status: 400 });
    }

    // Delete the profile (categories and items will be set to null via onDelete: SetNull)
    await db.menuProfile.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Menu profile DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
