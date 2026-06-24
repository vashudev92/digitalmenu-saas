import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { headers } from 'next/headers';
import qrcode from 'qrcode';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the restaurant with its existing QR record
    const restaurant = await db.restaurant.findUnique({
      where: {
        ownerId: session.user.id,
      },
      include: {
        qrCode: true,
      },
    });

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    // Dynamically retrieve the current host
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    
    // Determine the protocol (http for localhost/local IPs, https for Vercel/domains)
    const isLocal = host.includes('localhost') || host.includes('127.0.0.1') || host.startsWith('192.168') || host.startsWith('10.');
    const protocol = isLocal ? 'http' : 'https';
    
    const menuUrl = `${protocol}://${host}/r/${restaurant.slug}`;

    // Generate dynamic high-res QR code base64
    const qrBase64 = await qrcode.toDataURL(menuUrl, {
      width: 512,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    // Auto-sync with the database so database statistics remain correct
    if (!restaurant.qrCode) {
      await db.qRCode.create({
        data: {
          url: menuUrl,
          dataUrl: qrBase64,
          restaurantId: restaurant.id,
        },
      });
    } else if (restaurant.qrCode.url !== menuUrl) {
      await db.qRCode.update({
        where: { id: restaurant.qrCode.id },
        data: {
          url: menuUrl,
          dataUrl: qrBase64,
        },
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
