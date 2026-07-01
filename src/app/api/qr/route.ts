import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { headers } from 'next/headers';
import qrcode from 'qrcode';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
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

    // Optional query param filter
    const { searchParams } = new URL(request.url);
    const menuProfileId = searchParams.get('menuProfileId');

    // Retrieve host dynamically
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const isLocal = host.includes('localhost') || host.includes('127.0.0.1') || host.startsWith('192.168') || host.startsWith('10.');
    const protocol = isLocal ? 'http' : 'https';

    if (menuProfileId) {
      const profile = await db.menuProfile.findFirst({
        where: { id: menuProfileId, restaurantId: restaurant.id },
        include: { qrCode: true },
      });

      if (!profile) {
        return NextResponse.json({ error: 'Menu profile not found' }, { status: 404 });
      }

      const menuUrl = `${protocol}://${host}/r/${restaurant.slug}/${profile.slug}`;

      // Generate base64 QR
      const qrBase64 = await qrcode.toDataURL(menuUrl, {
        width: 512,
        margin: 2,
        color: { dark: '#000000', light: '#FFFFFF' },
      });

      // Sync db record
      if (!profile.qrCode) {
        await db.qRCode.create({
          data: {
            url: menuUrl,
            dataUrl: qrBase64,
            restaurantId: restaurant.id,
            menuProfileId: profile.id,
          },
        });
      } else if (profile.qrCode.url !== menuUrl) {
        await db.qRCode.update({
          where: { id: profile.qrCode.id },
          data: { url: menuUrl, dataUrl: qrBase64 },
        });
      }

      return NextResponse.json({
        url: menuUrl,
        dataUrl: qrBase64,
      });
    }

    // Default restaurant-level QR
    const qrCode = await db.qRCode.findFirst({
      where: { restaurantId: restaurant.id, menuProfileId: null },
    });

    const menuUrl = `${protocol}://${host}/r/${restaurant.slug}`;
    const qrBase64 = await qrcode.toDataURL(menuUrl, {
      width: 512,
      margin: 2,
      color: { dark: '#000000', light: '#FFFFFF' },
    });

    if (!qrCode) {
      await db.qRCode.create({
        data: {
          url: menuUrl,
          dataUrl: qrBase64,
          restaurantId: restaurant.id,
        },
      });
    } else if (qrCode.url !== menuUrl) {
      await db.qRCode.update({
        where: { id: qrCode.id },
        data: { url: menuUrl, dataUrl: qrBase64 },
      });
    }

    return NextResponse.json({
      url: menuUrl,
      dataUrl: qrBase64,
    });
  } catch (error) {
    console.error('Error fetching/generating QR code:', error);
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

    const { menuProfileId } = await request.json();

    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const isLocal = host.includes('localhost') || host.includes('127.0.0.1') || host.startsWith('192.168') || host.startsWith('10.');
    const protocol = isLocal ? 'http' : 'https';

    if (menuProfileId) {
      const profile = await db.menuProfile.findFirst({
        where: { id: menuProfileId, restaurantId: restaurant.id },
        include: { qrCode: true },
      });

      if (!profile) {
        return NextResponse.json({ error: 'Menu profile not found' }, { status: 404 });
      }

      const menuUrl = `${protocol}://${host}/r/${restaurant.slug}/${profile.slug}`;
      const qrBase64 = await qrcode.toDataURL(menuUrl, {
        width: 512,
        margin: 2,
        color: { dark: '#000000', light: '#FFFFFF' },
      });

      if (!profile.qrCode) {
        await db.qRCode.create({
          data: {
            url: menuUrl,
            dataUrl: qrBase64,
            restaurantId: restaurant.id,
            menuProfileId: profile.id,
          },
        });
      } else {
        await db.qRCode.update({
          where: { id: profile.qrCode.id },
          data: { url: menuUrl, dataUrl: qrBase64 },
        });
      }

      return NextResponse.json({
        url: menuUrl,
        dataUrl: qrBase64,
      });
    }

    // Default restaurant QR POST
    const menuUrl = `${protocol}://${host}/r/${restaurant.slug}`;
    const qrBase64 = await qrcode.toDataURL(menuUrl, {
      width: 512,
      margin: 2,
      color: { dark: '#000000', light: '#FFFFFF' },
    });

    const qrCode = await db.qRCode.findFirst({
      where: { restaurantId: restaurant.id, menuProfileId: null },
    });

    if (!qrCode) {
      await db.qRCode.create({
        data: {
          url: menuUrl,
          dataUrl: qrBase64,
          restaurantId: restaurant.id,
        },
      });
    } else {
      await db.qRCode.update({
        where: { id: qrCode.id },
        data: { url: menuUrl, dataUrl: qrBase64 },
      });
    }

    return NextResponse.json({
      url: menuUrl,
      dataUrl: qrBase64,
    });
  } catch (error) {
    console.error('Error generating QR code POST:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
