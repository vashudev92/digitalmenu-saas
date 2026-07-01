import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { Role } from '@prisma/client';

// GET all themes
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const themes = await db.theme.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ themes });
  } catch (error) {
    console.error('Themes list GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create theme
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { key, name, previewImage, description, version, tier, monthlyCost, status } = body;

    if (!key || !name) {
      return NextResponse.json({ error: 'Key and Name are required' }, { status: 400 });
    }

    // Check conflict
    const existing = await db.theme.findUnique({
      where: { key },
    });
    if (existing) {
      return NextResponse.json({ error: 'A theme with this key already exists' }, { status: 409 });
    }

    const theme = await db.theme.create({
      data: {
        key,
        name,
        previewImage: previewImage || '',
        description: description || '',
        version: version || '1.0.0',
        tier: tier || 'STARTER',
        monthlyCost: parseFloat(monthlyCost) || 0.0,
        status: status || 'PUBLISHED',
      },
    });

    return NextResponse.json({ theme }, { status: 201 });
  } catch (error) {
    console.error('Theme POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT update theme
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, previewImage, description, version, tier, monthlyCost, status } = body;

    if (!id) {
      return NextResponse.json({ error: 'Theme ID is required' }, { status: 400 });
    }

    const theme = await db.theme.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(previewImage !== undefined && { previewImage }),
        ...(description !== undefined && { description }),
        ...(version !== undefined && { version }),
        ...(tier !== undefined && { tier }),
        ...(monthlyCost !== undefined && { monthlyCost: parseFloat(monthlyCost) }),
        ...(status !== undefined && { status }),
      },
    });

    return NextResponse.json({ theme });
  } catch (error) {
    console.error('Theme PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE theme
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Theme ID is required' }, { status: 400 });
    }

    await db.theme.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Theme deleted successfully' });
  } catch (error) {
    console.error('Theme DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
