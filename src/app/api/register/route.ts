import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import qrcode from 'qrcode';

// Slugify helper
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

export async function POST(request: Request) {
  try {
    const { name, email, password, restaurantName } = await request.json();

    if (!name || !email || !password || !restaurantName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // 1. Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // 2. Generate slug and ensure uniqueness
    let slug = slugify(restaurantName);
    if (!slug) slug = 'restaurant';
    
    let existingRestaurant = await db.restaurant.findUnique({
      where: { slug },
    });

    let counter = 1;
    let uniqueSlug = slug;
    while (existingRestaurant) {
      uniqueSlug = `${slug}-${counter}`;
      existingRestaurant = await db.restaurant.findUnique({
        where: { slug: uniqueSlug },
      });
      counter++;
    }

    // 3. Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 4. Create User, Restaurant, QR Code, and Subscription in a transaction
    const result = await db.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          name,
          passwordHash,
          role: 'OWNER',
        },
      });

      // Get Default Free Plan
      let freePlan = await tx.plan.findFirst({
        where: { name: 'Free' },
      });

      // If not seeded yet, create it
      if (!freePlan) {
        freePlan = await tx.plan.create({
          data: {
            name: 'Free',
            price: 0,
            description: 'Perfect for small cafes to display a simple digital menu.',
            features: ['Up to 2 Categories', 'Up to 15 Menu Items', '1 QR Code Template', 'Standard Theme'],
          },
        });
      }

      // Create restaurant
      const restaurant = await tx.restaurant.create({
        data: {
          name: restaurantName,
          slug: uniqueSlug,
          ownerId: user.id,
          tagline: `Welcome to ${restaurantName}`,
          description: `Enjoy our delicious digital menu.`,
        },
      });

      // Create default MenuProfile
      const defaultProfile = await tx.menuProfile.create({
        data: {
          name: 'Main Restaurant',
          slug: 'main',
          description: `Default menu for ${restaurantName}`,
          restaurantId: restaurant.id,
        },
      });

      // Create QR code
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const menuUrl = `${appUrl}/r/${uniqueSlug}/main`;
      
      // Generate QR Data URL
      const qrDataUrl = await qrcode.toDataURL(menuUrl, {
        width: 512,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      await tx.qRCode.create({
        data: {
          url: menuUrl,
          dataUrl: qrDataUrl,
          restaurantId: restaurant.id,
          menuProfileId: defaultProfile.id,
        },
      });

      // Create subscription (Trial active for 1 year)
      const startDate = new Date();
      const endDate = new Date();
      endDate.setFullYear(startDate.getFullYear() + 1);

      await tx.subscription.create({
        data: {
          status: 'TRIAL',
          restaurantId: restaurant.id,
          planId: freePlan.id,
          startDate,
          endDate,
        },
      });

      return { user, restaurant };
    });

    return NextResponse.json(
      { 
        message: 'Registration successful', 
        user: { id: result.user.id, email: result.user.email, name: result.user.name },
        restaurant: { id: result.restaurant.id, slug: result.restaurant.slug }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during registration' },
      { status: 500 }
    );
  }
}
