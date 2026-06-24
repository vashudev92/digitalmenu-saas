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

// GET profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const restaurant = await db.restaurant.findUnique({
      where: { ownerId: session.user.id },
      include: { qrCode: true, subscription: { include: { plan: true } } },
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
      slug: proposedSlug,
    } = data;

    if (!name) {
      return NextResponse.json({ error: 'Restaurant Name is required' }, { status: 400 });
    }

    // Find the existing restaurant
    const restaurant = await db.restaurant.findUnique({
      where: { ownerId: session.user.id },
    });

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
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
          NOT: { ownerId: session.user.id },
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
        where: { ownerId: session.user.id },
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

        await tx.qRCode.upsert({
          where: { restaurantId: updated.id },
          create: {
            url: newMenuUrl,
            dataUrl: qrDataUrl,
            restaurantId: updated.id,
          },
          update: {
            url: newMenuUrl,
            dataUrl: qrDataUrl,
          },
        });
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
