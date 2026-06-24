import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// GET all menu items for the user's restaurant
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

    const items = await db.menuItem.findMany({
      where: { restaurantId: restaurant.id },
      include: {
        category: true,
      },
      orderBy: [
        { category: { sortOrder: 'asc' } },
        { name: 'asc' },
      ],
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST create menu item
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

    const { name, description, price, image, isVeg, isFeatured, isAvailable, categoryId } = await request.json();

    if (!name || price === undefined || !categoryId) {
      return NextResponse.json({ error: 'Name, Price and Category are required' }, { status: 400 });
    }

    // Verify category belongs to this restaurant
    const category = await db.category.findFirst({
      where: {
        id: categoryId,
        restaurantId: restaurant.id,
      },
    });

    if (!category) {
      return NextResponse.json({ error: 'Invalid category selected' }, { status: 400 });
    }

    const item = await db.menuItem.create({
      data: {
        name: name.trim(),
        description: description?.trim() || '',
        price: Number(price),
        image: image || null,
        isVeg: isVeg !== undefined ? Boolean(isVeg) : true,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : false,
        isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
        categoryId,
        restaurantId: restaurant.id,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT edit menu item
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

    const { id, name, description, price, image, isVeg, isFeatured, isAvailable, categoryId } = await request.json();

    if (!id || !name || price === undefined || !categoryId) {
      return NextResponse.json({ error: 'ID, Name, Price and Category are required' }, { status: 400 });
    }

    // Verify category belongs to this restaurant
    const category = await db.category.findFirst({
      where: {
        id: categoryId,
        restaurantId: restaurant.id,
      },
    });

    if (!category) {
      return NextResponse.json({ error: 'Invalid category selected' }, { status: 400 });
    }

    const updatedItem = await db.menuItem.update({
      where: {
        id,
        restaurantId: restaurant.id,
      },
      data: {
        name: name.trim(),
        description: description?.trim() || '',
        price: Number(price),
        image: image || null,
        isVeg: isVeg !== undefined ? Boolean(isVeg) : true,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : false,
        isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
        categoryId,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE menu item
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
      return NextResponse.json({ error: 'Menu Item ID is required' }, { status: 400 });
    }

    await db.menuItem.delete({
      where: {
        id,
        restaurantId: restaurant.id,
      },
    });

    return NextResponse.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
