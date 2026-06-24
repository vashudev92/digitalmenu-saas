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

    const qrCode = await db.qRCode.findFirst({
      where: {
        restaurant: {
          ownerId: session.user.id,
        },
      },
    });

    if (!qrCode) {
      return NextResponse.json({ error: 'QR Code not found' }, { status: 404 });
    }

    return NextResponse.json(qrCode);
  } catch (error) {
    console.error('Error fetching QR code:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
