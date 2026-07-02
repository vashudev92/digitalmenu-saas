import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// Simulate global settings in memory or simple persistent JSON since we don't have a Settings DB model.
// This is perfect for mock/commercial SaaS operations configurations.
let globalSettings = {
  companyName: 'DigitalMenu SaaS Inc.',
  gstNumber: '27AAAAA1111A1Z1',
  currency: 'INR',
  currencySymbol: '₹',
  emailGateway: 'smtp.sendgrid.net',
  smsGateway: 'twilio',
  whatsAppGateway: 'meta-api',
  invoicePrefix: 'DM-2026-',
  themeDefault: 'LUXURY_DARK',
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ settings: globalSettings });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { settings } = await request.json();
    if (!settings) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    globalSettings = { ...globalSettings, ...settings };

    // Log the configuration changes
    await db.auditLog.create({
      data: {
        action: 'SYSTEM_SETTINGS_UPDATED',
        adminId: session.user.id,
        details: 'System settings (GST, Currency, Gateways) updated by administrator.',
      },
    });

    return NextResponse.json({
      message: 'System configuration settings updated successfully.',
      settings: globalSettings,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
