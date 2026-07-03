import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import qrcode from 'qrcode';

// Slugify helper
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const impersonateId = searchParams.get('impersonateId');

    let whereClause: any = { ownerId: session.user.id };
    if (impersonateId && session.user.role === 'ADMIN') {
      whereClause = { id: impersonateId };
    }

    const restaurant = await db.restaurant.findUnique({
      where: whereClause,
      include: { qrCodes: true, subscription: { include: { plan: true } } },
    });

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT / UPDATE profile
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const {
      name,
      tagline,
      description,
      address,
      phone,
      whatsApp,
      website,
      googleMapsUrl,
      logo,
      banner,
      theme,
      currencySymbol,
      fontHeading,
      fontBody,
      primaryColor,
      secondaryColor,
      accentColor,
      favicon,
      openingHours,
      bannerTitle1,
      bannerTitle2,
      bannerSubtitle,
      badge1Title,
      badge1Desc,
      badge2Title,
      badge2Desc,
      badge3Title,
      badge3Desc,
      slug: proposedSlug,
    } = data;

    if (!name) {
      return NextResponse.json({ error: 'Restaurant Name is required' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const impersonateId = searchParams.get('impersonateId');

    let whereClause: any = { ownerId: session.user.id };
    if (impersonateId && session.user.role === 'ADMIN') {
      whereClause = { id: impersonateId };
    }

    // Find the existing restaurant
    const restaurant = await db.restaurant.findUnique({
      where: whereClause,
    });

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    // Verify theme permissions if specified
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

    // Process slug update if changed
    let finalSlug = restaurant.slug;
    let slugChanged = false;

    if (proposedSlug && proposedSlug !== restaurant.slug) {
      let slugCandidate = slugify(proposedSlug);
      if (!slugCandidate) slugCandidate = 'restaurant';

      // Verify uniqueness
      const existingWithSlug = await db.restaurant.findFirst({
        where: {
          slug: slugCandidate,
          NOT: { id: restaurant.id },
        },
      });

      if (existingWithSlug) {
        return NextResponse.json({ error: 'This URL slug is already taken' }, { status: 409 });
      }

      finalSlug = slugCandidate;
      slugChanged = true;
    }

    // Perform database updates
    const updatedRestaurant = await db.$transaction(async (tx) => {
      const updated = await tx.restaurant.update({
        where: { id: restaurant.id },
        data: {
          name,
          slug: finalSlug,
          tagline,
          description,
          address,
          phone,
          whatsApp,
          website,
          googleMapsUrl,
          logo,
          banner,
          theme,
          currencySymbol,
          fontHeading: fontHeading || null,
          fontBody: fontBody || null,
          primaryColor: primaryColor || null,
          secondaryColor: secondaryColor || null,
          accentColor: accentColor || null,
          favicon: favicon || null,
          openingHours: openingHours || null,
          bannerTitle1,
          bannerTitle2,
          bannerSubtitle,
          badge1Title,
          badge1Desc,
          badge2Title,
          badge2Desc,
          badge3Title,
          badge3Desc,
        },
      });

      // If the slug changed, update and regenerate the QR Code
      if (slugChanged) {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const newMenuUrl = `${appUrl}/r/${finalSlug}`;

        const qrDataUrl = await qrcode.toDataURL(newMenuUrl, {
          width: 512,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        });

        // Update all QR codes for this restaurant
        const existingQRs = await tx.qRCode.findMany({
          where: { restaurantId: updated.id },
        });

        if (existingQRs.length > 0) {
          for (const qr of existingQRs) {
            const profileSlug = qr.menuProfileId ? 
              (await tx.menuProfile.findUnique({ where: { id: qr.menuProfileId } }))?.slug : null;
            const qrUrl = profileSlug ? `${appUrl}/r/${finalSlug}/${profileSlug}` : `${appUrl}/r/${finalSlug}`;
            const newDataUrl = await qrcode.toDataURL(qrUrl, {
              width: 512,
              margin: 2,
              color: { dark: '#000000', light: '#FFFFFF' },
            });
            await tx.qRCode.update({
              where: { id: qr.id },
              data: { url: qrUrl, dataUrl: newDataUrl },
            });
          }
        }
      }

      return updated;
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      restaurant: updatedRestaurant,
      slugChanged,
    });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
