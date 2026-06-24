import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// GET all categories for the user's restaurant
export async function GET() {
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

    const categories = await db.category.findMany({
      where: { restaurantId: restaurant.id },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST create category
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

    const { name, icon, sortOrder, status } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Category Name is required' }, { status: 400 });
    }

    // Check if category name already exists for this restaurant
    const existing = await db.category.findUnique({
      where: {
        restaurantId_name: {
          restaurantId: restaurant.id,
          name: name.trim(),
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'Category with this name already exists' }, { status: 409 });
    }

    const category = await db.category.create({
      data: {
        name: name.trim(),
        icon: icon || 'Utensils',
        sortOrder: sortOrder !== undefined ? Number(sortOrder) : 0,
        status: status !== undefined ? Boolean(status) : true,
        restaurantId: restaurant.id,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT / EDIT category or reorder
export async function PUT(request: Request) {
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

    const body = await request.json();

    // Check if it's a reorder batch request
    if (body.reorder && Array.isArray(body.categories)) {
      const updates = body.categories.map((c: { id: string; sortOrder: number }) => {
        return db.category.updateMany({
          where: {
            id: c.id,
            restaurantId: restaurant.id,
          },
          data: {
            sortOrder: c.sortOrder,
          },
        });
      });

      await db.$transaction(updates);
      return NextResponse.json({ message: 'Categories reordered successfully' });
    }

    // Otherwise, edit a single category
    const { id, name, icon, sortOrder, status } = body;

    if (!id || !name) {
      return NextResponse.json({ error: 'Category ID and Name are required' }, { status: 400 });
    }

    // Check if category name is already in use by another category
    const duplicate = await db.category.findFirst({
      where: {
        restaurantId: restaurant.id,
        name: name.trim(),
        NOT: { id },
      },
    });

    if (duplicate) {
      return NextResponse.json({ error: 'Another category with this name already exists' }, { status: 409 });
    }

    const updatedCategory = await db.category.update({
      where: {
        id,
        restaurantId: restaurant.id,
      },
      data: {
        name: name.trim(),
        icon: icon || 'Utensils',
        sortOrder: sortOrder !== undefined ? Number(sortOrder) : 0,
        status: status !== undefined ? Boolean(status) : true,
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE category
export async function DELETE(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    await db.category.delete({
      where: {
        id,
        restaurantId: restaurant.id,
      },
    });

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
