import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { cookies, headers } from 'next/headers';
import { db } from '@/lib/db';
import qrcode from 'qrcode';

export const dynamic = 'force-dynamic';

// GET /api/menu-profiles — List all menu profiles for authenticated restaurant
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cookieStore = await cookies();
    const impersonateId = cookieStore.get('impersonate_restaurant_id')?.value;

    let whereClause: any = { ownerId: session.user.id };
    if (impersonateId && session.user.role === 'ADMIN') {
      whereClause = { id: impersonateId };
    }

    const restaurant = await db.restaurant.findUnique({
      where: whereClause,
      select: { id: true, slug: true },
    });

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    const profiles = await db.menuProfile.findMany({
      where: { restaurantId: restaurant.id },
      include: {
        _count: {
          select: {
            categories: true,
            menuItems: true,
          },
        },
        qrCode: {
          select: { id: true, url: true, dataUrl: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Sync/Generate QR Codes dynamically for the current host
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const isLocal = host.includes('localhost') || host.includes('127.0.0.1') || host.startsWith('192.168') || host.startsWith('10.');
    const protocol = isLocal ? 'http' : 'https';

    const syncedProfiles = await Promise.all(
      profiles.map(async (profile) => {
        const expectedUrl = `${protocol}://${host}/r/${restaurant.slug}/${profile.slug}`;
        
        if (!profile.qrCode) {
          // Generate new QR code
          const qrBase64 = await qrcode.toDataURL(expectedUrl, {
            width: 512,
            margin: 2,
            color: { dark: '#000000', light: '#FFFFFF' },
          });
          const newQr = await db.qRCode.create({
            data: {
              url: expectedUrl,
              dataUrl: qrBase64,
              restaurantId: restaurant.id,
              menuProfileId: profile.id,
            },
            select: { id: true, url: true, dataUrl: true },
          });
          return { ...profile, qrCode: newQr };
        } else if (profile.qrCode.url !== expectedUrl) {
          // Update existing QR code
          const qrBase64 = await qrcode.toDataURL(expectedUrl, {
            width: 512,
            margin: 2,
            color: { dark: '#000000', light: '#FFFFFF' },
          });
          const updatedQr = await db.qRCode.update({
            where: { id: profile.qrCode.id },
            data: { url: expectedUrl, dataUrl: qrBase64 },
            select: { id: true, url: true, dataUrl: true },
          });
          return { ...profile, qrCode: updatedQr };
        }
        return profile;
      })
    );

    return NextResponse.json({ profiles: syncedProfiles });
  } catch (error) {
    console.error('Menu profiles GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/menu-profiles — Create a new menu profile
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cookieStore = await cookies();
    const impersonateId = cookieStore.get('impersonate_restaurant_id')?.value;

    let whereClause: any = { ownerId: session.user.id };
    if (impersonateId && session.user.role === 'ADMIN') {
      whereClause = { id: impersonateId };
    }

    const restaurant = await db.restaurant.findUnique({
      where: whereClause,
      select: { id: true },
    });

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    const body = await request.json();
    const { name, slug, description, theme, primaryColor, secondaryColor, accentColor, fontHeading, fontBody, bannerImage, logoOverride, openingHours } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    // Validate slug format
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json({ error: 'Slug must contain only lowercase letters, numbers, and hyphens' }, { status: 400 });
    }

    // Check slug uniqueness within restaurant
    const existing = await db.menuProfile.findUnique({
      where: {
        restaurantId_slug: {
          restaurantId: restaurant.id,
          slug,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'A menu profile with this slug already exists' }, { status: 409 });
    }

    const profile = await db.menuProfile.create({
      data: {
        name,
        slug,
        description: description || null,
        theme: theme || null,
        primaryColor: primaryColor || null,
        secondaryColor: secondaryColor || null,
        accentColor: accentColor || null,
        fontHeading: fontHeading || null,
        fontBody: fontBody || null,
        bannerImage: bannerImage || null,
        logoOverride: logoOverride || null,
        openingHours: openingHours || null,
        restaurantId: restaurant.id,
      },
    });

    return NextResponse.json({ profile }, { status: 201 });
  } catch (error) {
    console.error('Menu profile POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
