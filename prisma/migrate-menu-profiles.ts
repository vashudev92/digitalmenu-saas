/**
 * Migration Script: Create Default Menu Profiles
 * ================================================
 * Run this after `prisma db push` to create a "Main Restaurant"
 * MenuProfile for every existing restaurant that doesn't have one.
 * 
 * Usage: npx tsx prisma/migrate-menu-profiles.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Starting Menu Profile migration...\n');

  // Get all restaurants
  const restaurants = await prisma.restaurant.findMany({
    include: {
      menuProfiles: true,
      categories: true,
      menuItems: true,
    },
  });

  let created = 0;
  let skipped = 0;

  for (const restaurant of restaurants) {
    // Skip if already has a profile
    if (restaurant.menuProfiles.length > 0) {
      console.log(`  ⏭  ${restaurant.name} — already has ${restaurant.menuProfiles.length} profile(s)`);
      skipped++;
      continue;
    }

    // Create default "Main Restaurant" profile
    const profile = await prisma.menuProfile.create({
      data: {
        name: 'Main Restaurant',
        slug: 'main',
        description: `Default menu for ${restaurant.name}`,
        theme: null, // Use restaurant's default theme
        restaurantId: restaurant.id,
      },
    });

    // Assign all existing categories to this profile
    if (restaurant.categories.length > 0) {
      await prisma.category.updateMany({
        where: { restaurantId: restaurant.id },
        data: { menuProfileId: profile.id },
      });
      console.log(`    📂 Assigned ${restaurant.categories.length} categories to default profile`);
    }

    // Assign all existing menu items to this profile
    if (restaurant.menuItems.length > 0) {
      await prisma.menuItem.updateMany({
        where: { restaurantId: restaurant.id },
        data: { menuProfileId: profile.id },
      });
      console.log(`    🍽  Assigned ${restaurant.menuItems.length} menu items to default profile`);
    }

    console.log(`  ✅ ${restaurant.name} — created "Main Restaurant" profile`);
    created++;
  }

  console.log(`\n📊 Migration Complete:`);
  console.log(`   Created: ${created} profiles`);
  console.log(`   Skipped: ${skipped} (already had profiles)`);
}

main()
  .catch((e) => {
    console.error('❌ Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
