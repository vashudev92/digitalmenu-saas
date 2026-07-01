import { PrismaClient, Role, SubscriptionStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import qrcode from 'qrcode';

const prisma = new PrismaClient();

const baseDishes = [
  // --- Chef's Specials ---
  {
    categoryName: "Chef's Specials",
    icon: "Sparkles",
    name: "Truffle Butter Paneer",
    description: "Cottage cheese simmered in rich creamy tomato gravy laced with premium black truffle butter.",
    price: 490,
    isVeg: true,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=500&fit=crop"
  },
  {
    categoryName: "Chef's Specials",
    icon: "Sparkles",
    name: "Royal Spice Dum Biryani",
    description: "Slow-cooked long grain basmati rice layered with aromatic spices and saffron-infused vegetables.",
    price: 450,
    isVeg: true,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=500&fit=crop"
  },
  {
    categoryName: "Chef's Specials",
    icon: "Sparkles",
    name: "Golden Garlic Butter Lobsters",
    description: "Whole fresh lobster cooked in white wine, butter, and gold-dusted fried garlic.",
    price: 1250,
    isVeg: false,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=500&fit=crop"
  },
  {
    categoryName: "Chef's Specials",
    icon: "Sparkles",
    name: "Smoked Salmon Carpaccio",
    description: "Thinly sliced cured salmon, capers, dill cream cheese, and cold-pressed olive oil.",
    price: 680,
    isVeg: false,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&fit=crop"
  },
  {
    categoryName: "Chef's Specials",
    icon: "Sparkles",
    name: "Saffron Tandoori Broccoli",
    description: "Fresh broccoli florets marinated in cheese cream, cashew paste, and Kashmiri saffron.",
    price: 380,
    isVeg: true,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=500&fit=crop"
  },

  // --- Starters ---
  {
    categoryName: "Starters",
    icon: "Soup",
    name: "Crispy Lotus Stem Honey Chilli",
    description: "Crispy fried lotus stems tossed in organic honey, red chillies, and sesame.",
    price: 320,
    isVeg: true,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=500&fit=crop"
  },
  {
    categoryName: "Starters",
    icon: "Soup",
    name: "Peshawari Paneer Tikka",
    description: "Cottage cheese chunks filled with almond paste, char-grilled in a clay tandoor oven.",
    price: 360,
    isVeg: true,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=500&fit=crop"
  },
  {
    categoryName: "Starters",
    icon: "Soup",
    name: "Cheese Stuffed Mushrooms",
    description: "Oven-baked button mushrooms stuffed with spinach, garlic, and melted mozzarella.",
    price: 340,
    isVeg: true,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=500&fit=crop"
  },
  {
    categoryName: "Starters",
    icon: "Soup",
    name: "Kafir Lime Chicken Kebabs",
    description: "Minced chicken skewers flavored with lemongrass, kafir lime, and fresh coriander.",
    price: 410,
    isVeg: false,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=500&fit=crop"
  },
  {
    categoryName: "Starters",
    icon: "Soup",
    name: "Butter Garlic Calamari",
    description: "Tender squid rings wok-fried in slow-melted butter, parsley, and garlic.",
    price: 450,
    isVeg: false,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=500&fit=crop"
  },
  {
    categoryName: "Starters",
    icon: "Soup",
    name: "Spicy Peri Peri Prawns",
    description: "Pan-seared jumbo prawns tossed in hot bird's eye chilli and peri peri marinade.",
    price: 490,
    isVeg: false,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=500&fit=crop"
  },

  // --- Indian ---
  {
    categoryName: "Indian",
    icon: "Utensils",
    name: "Dal Bukhara",
    description: "Creamy black lentils slow-simmered for 18 hours with tomatoes, cream, and butter.",
    price: 360,
    isVeg: true,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=500&fit=crop"
  },
  {
    categoryName: "Indian",
    icon: "Utensils",
    name: "Paneer Lababdar",
    description: "Cottage cheese chunks cooked in rich onion, tomato, and cashew gravy.",
    price: 390,
    isVeg: true,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=500&fit=crop"
  },
  {
    categoryName: "Indian",
    icon: "Utensils",
    name: "Subz Dewani Handi",
    description: "Assorted vegetables cooked in a spinach and green herb rich country gravy.",
    price: 340,
    isVeg: true,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=500&fit=crop"
  },
  {
    categoryName: "Indian",
    icon: "Utensils",
    name: "Murg Makhani (Butter Chicken)",
    description: "Charcoal-grilled tandoori chicken cooked in a rich, buttery, velvety tomato gravy.",
    price: 460,
    isVeg: false,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=500&fit=crop"
  },
  {
    categoryName: "Indian",
    icon: "Utensils",
    name: "Awadhi Nalli Nihari",
    description: "Slow-cooked mutton shank stew flavored with rose petals and traditional spices.",
    price: 590,
    isVeg: false,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=500&fit=crop"
  },
  {
    categoryName: "Indian",
    icon: "Utensils",
    name: "Butter Garlic Naan",
    description: "Leavened clay-oven flatbread topped with minced garlic and melted butter.",
    price: 80,
    isVeg: true,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1626803775151-61d756612f97?q=80&w=500&fit=crop"
  },

  // --- Chinese ---
  {
    categoryName: "Chinese",
    icon: "UtensilsCrossed",
    name: "Vegetable Manchurian",
    description: "Crispy vegetable balls tossed in a tangy, spicy, and glossy dark soy sauce.",
    price: 310,
    isVeg: true,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=500&fit=crop"
  },
  {
    categoryName: "Chinese",
    icon: "UtensilsCrossed",
    name: "Chilli Garlic Hakka Noodles",
    description: "Wok-tossed noodles with colorful vegetables, garlic, and fiery red chilli oil.",
    price: 290,
    isVeg: true,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=500&fit=crop"
  },
  {
    categoryName: "Chinese",
    icon: "UtensilsCrossed",
    name: "Szechuan Paneer",
    description: "Cottage cheese strips wok-fried with bell peppers in spicy Szechuan peppercorn sauce.",
    price: 350,
    isVeg: true,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=500&fit=crop"
  },
  {
    categoryName: "Chinese",
    icon: "UtensilsCrossed",
    name: "Crispy Honey Chicken",
    description: "Battered chicken strips wok-tossed in sweet honey glaze, sesame, and green onions.",
    price: 390,
    isVeg: false,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=500&fit=crop"
  },
  {
    categoryName: "Chinese",
    icon: "UtensilsCrossed",
    name: "Szechuan Fish Stir-Fry",
    description: "Fresh sea bass fillets cooked with exotic greens, dry chillies, and soy sauce.",
    price: 490,
    isVeg: false,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=500&fit=crop"
  },
  {
    categoryName: "Chinese",
    icon: "UtensilsCrossed",
    name: "Ginger Garlic Crab Stir-Fry",
    description: "Fresh local crab cooked in sweet soy ginger sauce, spring onions, and Shaoxing wine.",
    price: 690,
    isVeg: false,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=500&fit=crop"
  },

  // --- Italian ---
  {
    categoryName: "Italian",
    icon: "Pizza",
    name: "Classic Margherita Pizza",
    description: "Artisanal crust, San Marzano tomato sauce, fresh mozzarella, extra virgin olive oil, and fresh basil.",
    price: 380,
    isVeg: true,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=500&fit=crop"
  },
  {
    categoryName: "Italian",
    icon: "Pizza",
    name: "Truffle Wild Mushroom Pizza",
    description: "Assorted wild forest mushrooms, buffalo mozzarella, and white truffle oil glaze.",
    price: 490,
    isVeg: true,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&fit=crop"
  },
  {
    categoryName: "Italian",
    icon: "Pizza",
    name: "Four Cheese Sun-Dried Tomato Pizza",
    description: "Mozzarella, Gorgonzola, Parmesan, and goat cheese topped with sweet sun-dried tomatoes.",
    price: 460,
    isVeg: true,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=500&fit=crop"
  },
  {
    categoryName: "Italian",
    icon: "Pizza",
    name: "Fiery Pepperoni Pizza",
    description: "Beef pepperoni slices, fresh mozzarella, tomato sauce, and hot honey drizzle.",
    price: 480,
    isVeg: false,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&fit=crop"
  },
  {
    categoryName: "Italian",
    icon: "Pizza",
    name: "Wild Mushroom Risotto",
    description: "Arborio rice cooked with porcini broth, butter, and freshly grated Parmigiano-Reggiano.",
    price: 420,
    isVeg: true,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=500&fit=crop"
  },
  {
    categoryName: "Italian",
    icon: "Pizza",
    name: "Seafood Linguine Marinara",
    description: "Linguine tossed with prawns, mussels, calamari, garlic, fresh tomatoes, and white wine.",
    price: 590,
    isVeg: false,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&fit=crop"
  },

  // --- Desserts ---
  {
    categoryName: "Desserts",
    icon: "IceCream",
    name: "Classic Tiramisu",
    description: "Espresso soaked ladyfingers layered with fresh whipped mascarpone and dark cocoa powder.",
    price: 260,
    isVeg: true,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=500&fit=crop"
  },
  {
    categoryName: "Desserts",
    icon: "IceCream",
    name: "Warm Chocolate Fondant",
    description: "Rich dark chocolate cake with a molten chocolate center, served with vanilla bean ice cream.",
    price: 280,
    isVeg: true,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=500&fit=crop"
  },
  {
    categoryName: "Desserts",
    icon: "IceCream",
    name: "Saffron Rabdi Jamun",
    description: "Warm golden gulab jamuns served on a bed of chilled slow-reduced saffron sweet milk.",
    price: 240,
    isVeg: true,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=500&fit=crop"
  },
  {
    categoryName: "Desserts",
    icon: "IceCream",
    name: "Baked Blueberry Cheesecake",
    description: "New York style rich baked cheesecake topped with sweet blueberry compote.",
    price: 290,
    isVeg: true,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=500&fit=crop"
  },
  {
    categoryName: "Desserts",
    icon: "IceCream",
    name: "Mango Panna Cotta",
    description: "Silky vanilla cream pudding topped with fresh Alphonso mango pulp coulis.",
    price: 220,
    isVeg: true,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=500&fit=crop"
  },

  // --- Beverages ---
  {
    categoryName: "Beverages",
    icon: "Wine",
    name: "Signature Mint Mojito",
    description: "Fresh crushed mint leaves, lime chunks, organic cane sugar, and club soda.",
    price: 180,
    isVeg: true,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=500&fit=crop"
  },
  {
    categoryName: "Beverages",
    icon: "Wine",
    name: "Mango Passionfruit Cooler",
    description: "Sweet Alphonso mango puree blended with sour passionfruit syrup and sparkling tonic.",
    price: 210,
    isVeg: true,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=500&fit=crop"
  },
  {
    categoryName: "Beverages",
    icon: "Wine",
    name: "Iced Rose Latte",
    description: "Premium espresso shot shaken with cold milk and sweet organic rose petal syrup.",
    price: 190,
    isVeg: true,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1626803775151-61d756612f97?q=80&w=500&fit=crop"
  },
  {
    categoryName: "Beverages",
    icon: "Wine",
    name: "Blue Lagoon Mocktail",
    description: "Curacao orange rind syrup, lime juice, mint leaves, sprite, and crushed ice.",
    price: 180,
    isVeg: true,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=500&fit=crop"
  },
  {
    categoryName: "Beverages",
    icon: "Wine",
    name: "Masala Chai",
    description: "Strong milk tea brewed with crushed cardamom, cinnamon, cloves, and ginger.",
    price: 90,
    isVeg: true,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1626803775151-61d756612f97?q=80&w=500&fit=crop"
  },
  {
    categoryName: "Beverages",
    icon: "Wine",
    name: "Sparkling Water",
    description: "Premium natural carbonated water served chilled with a fresh lemon wedge.",
    price: 120,
    isVeg: true,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1626803775151-61d756612f97?q=80&w=500&fit=crop"
  }
];

async function main() {
  console.log('Seeding database...');

  // Clean Database
  await prisma.subscription.deleteMany();
  await prisma.qRCode.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.menuProfile.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.theme.deleteMany();

  // Create Platform Theme Library
  const themesToSeed = [
    {
      key: 'LUXURY_DARK',
      name: 'Luxury Fine Dining',
      description: 'Gold highlights on deep black, elegant serif headings and thin double gold borders',
      version: '1.0.0',
      tier: 'STARTER',
      monthlyCost: 0.0,
      status: 'PUBLISHED',
      previewImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&fit=crop'
    },
    {
      key: 'MINIMAL_JAPANESE',
      name: 'Japanese Minimal',
      description: 'Lots of whitespace, minimal layout, borderless simple cards, thin typography',
      version: '1.0.0',
      tier: 'STARTER',
      monthlyCost: 0.0,
      status: 'PUBLISHED',
      previewImage: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=600&fit=crop'
    },
    {
      key: 'MODERN_CAFE',
      name: 'Modern Cafe',
      description: 'Coffee colors, rounded cards, friendly typography, warm illustrations',
      version: '1.0.0',
      tier: 'PROFESSIONAL',
      monthlyCost: 499.0,
      status: 'PUBLISHED',
      previewImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600&fit=crop'
    },
    {
      key: 'ITALIAN_BISTRO',
      name: 'Italian Bistro',
      description: 'Warm beige backdrop, deep wine red highlights, rustic card frames',
      version: '1.0.0',
      tier: 'PROFESSIONAL',
      monthlyCost: 499.0,
      status: 'PUBLISHED',
      previewImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&fit=crop'
    },
    {
      key: 'TRADITIONAL_INDIAN',
      name: 'Traditional Indian',
      description: 'Rich maroon backdrop, saffron gold highlights, decorative headings',
      version: '1.0.0',
      tier: 'PREMIUM',
      monthlyCost: 999.0,
      status: 'PUBLISHED',
      previewImage: 'https://images.unsplash.com/photo-1585938338392-50a59970d8ee?q=80&w=600&fit=crop'
    },
    {
      key: 'BEACH_RESTAURANT',
      name: 'Beach Restaurant',
      description: 'Ocean teal & sand colors, relaxed spacing, photo-first layouts',
      version: '1.0.0',
      tier: 'PREMIUM',
      monthlyCost: 999.0,
      status: 'PUBLISHED',
      previewImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&fit=crop'
    }
  ];

  for (const t of themesToSeed) {
    await prisma.theme.create({ data: t });
  }
  console.log('Platform Theme Library seeded.');

  // Create Plans
  const freePlan = await prisma.plan.create({
    data: {
      name: 'Free',
      price: 0,
      description: 'Perfect for small cafes to display a simple digital menu.',
      features: ['Up to 2 Categories', 'Up to 15 Menu Items', '1 QR Code Template (Table Tent)', 'Standard Theme'],
    },
  });

  const premiumPlan = await prisma.plan.create({
    data: {
      name: 'Premium',
      price: 19,
      description: 'Ideal for medium-sized restaurants wanting high-quality presentation.',
      features: [
        'Unlimited Categories',
        'Up to 100 Menu Items',
        '3 QR Code Templates (Table Tent, Stand, Card)',
        'Access to Cafe & Modern Themes',
        'Download PNG & PDF',
      ],
    },
  });

  const luxuryPlan = await prisma.plan.create({
    data: {
      name: 'Luxury',
      price: 49,
      description: 'For premium venues demanding bespoke presentation and rich capabilities.',
      features: [
        'Unlimited Categories & Menu Items',
        'All QR Code Templates & Designs',
        'All Custom Luxury Themes (Dark/Light/Classic)',
        'Download PNG, SVG & PDF',
        'Priority Technical Support',
      ],
    },
  });

  // Create Admins
  const adminPassword = await bcrypt.hash('adminpass', 10);
  await prisma.user.create({
    data: {
      email: 'admin@digitalmenu.com',
      name: 'Platform Admin',
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });

  // Create Trattoria Bella Owner
  const ownerPassword = await bcrypt.hash('password', 10);
  const trattoriaOwner = await prisma.user.create({
    data: {
      email: 'owner@trattoria.com',
      name: 'Mario Rossi',
      passwordHash: ownerPassword,
      role: Role.OWNER,
    },
  });

  // Create Trattoria Bella Restaurant
  const trattoria = await prisma.restaurant.create({
    data: {
      name: 'Trattoria Bella',
      slug: 'trattoria-bella',
      tagline: 'Fine Italian Dining & Woodfired Pizza',
      description: 'A luxurious Italian experience in the heart of the city. We serve handmade pastas, fresh seafood, and authentic Neapolitan woodfired pizzas using imported ingredients.',
      address: '123 Golden Avenue, Gourmet District, NY 10001',
      phone: '+1 (555) 123-4567',
      whatsApp: '+15551234567',
      website: 'https://trattoriabella.com',
      googleMapsUrl: 'https://maps.google.com/?q=Trattoria+Bella',
      logo: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&h=400&fit=crop',
      theme: 'LUXURY_DARK',
      currencySymbol: '$',
      ownerId: trattoriaOwner.id,
    },
  });

  // Create Trattoria Bella Subscription
  const today = new Date();
  const nextYear = new Date();
  nextYear.setFullYear(today.getFullYear() + 1);

  await prisma.subscription.create({
    data: {
      status: SubscriptionStatus.ACTIVE,
      restaurantId: trattoria.id,
      planId: luxuryPlan.id,
      startDate: today,
      endDate: nextYear,
    },
  });

  // Create default main QR Code for Trattoria
  const trattoriaMenuUrl = `http://localhost:3000/r/${trattoria.slug}`;
  const trattoriaQrData = await qrcode.toDataURL(trattoriaMenuUrl, {
    width: 512,
    margin: 2,
    color: { dark: '#000000', light: '#FFFFFF' },
  });

  await prisma.qRCode.create({
    data: {
      url: trattoriaMenuUrl,
      dataUrl: trattoriaQrData,
      restaurantId: trattoria.id,
    },
  });

  // Create Trattoria Categories & Items
  const trattoriaCategory = await prisma.category.create({
    data: { name: 'Chef Picks', icon: 'Sparkles', sortOrder: 1, restaurantId: trattoria.id },
  });

  await prisma.menuItem.create({
    data: {
      name: 'Truffle Tagliatelle',
      description: 'Handmade fresh egg pasta, black truffle paste, forest mushrooms, aged parmigiano-reggiano cream.',
      price: 28.00,
      image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=500&fit=crop',
      isVeg: true,
      isFeatured: true,
      categoryId: trattoriaCategory.id,
      restaurantId: trattoria.id,
    }
  });

  console.log('Trattoria Bella seeded.');

  // ==========================================
  // SEED "ROYAL SPICE" DEMO RESTAURANT
  // ==========================================
  const royalSpiceOwner = await prisma.user.create({
    data: {
      email: 'owner@royalspice.com',
      name: 'Aravind Sharma',
      passwordHash: ownerPassword,
      role: Role.OWNER,
    },
  });

  const royalSpice = await prisma.restaurant.create({
    data: {
      name: 'Royal Spice',
      slug: 'royal-spice',
      tagline: 'Gourmet Multi-Cuisine Fine Dining Heritage',
      description: 'Experience pure dining heritage with hand-selected ingredients, premium recipes, and luxurious visual themes across our beautiful dining arenas.',
      address: '77 Heritage Boulevard, Royal Gardens, Mumbai 400001',
      phone: '+91 22 8765 4321',
      whatsApp: '+919999988888',
      website: 'https://royalspice.co.in',
      googleMapsUrl: 'https://maps.google.com/?q=Royal+Spice+Restaurant',
      logo: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&h=400&fit=crop',
      theme: 'LUXURY_DARK',
      currencySymbol: '₹',
      ownerId: royalSpiceOwner.id,
    },
  });

  // Activate Subscription
  await prisma.subscription.create({
    data: {
      status: SubscriptionStatus.ACTIVE,
      restaurantId: royalSpice.id,
      planId: luxuryPlan.id,
      startDate: today,
      endDate: nextYear,
    },
  });

  // Generate main platform routing QR code for Royal Spice
  const royalSpiceUrl = `http://localhost:3000/r/${royalSpice.slug}`;
  const royalSpiceQrData = await qrcode.toDataURL(royalSpiceUrl, {
    width: 512,
    margin: 2,
    color: { dark: '#000000', light: '#FFFFFF' },
  });

  await prisma.qRCode.create({
    data: {
      url: royalSpiceUrl,
      dataUrl: royalSpiceQrData,
      restaurantId: royalSpice.id,
    },
  });

  // 5 Profiles: Main Restaurant, Pool Side Dining, Rooftop Dining, Garden Restaurant, and Executive Lounge
  const profilesConfigs = [
    {
      name: 'Main Restaurant',
      slug: 'main',
      prefix: 'Main',
      description: 'Elegant heritage fine dining inside our majestic central dining room.',
      theme: 'LUXURY_DARK',
      primaryColor: '#D4A437',
      secondaryColor: '#B88E2F',
      accentColor: '#F5D76E',
      fontHeading: 'Playfair Display',
      fontBody: 'Inter',
      openingHours: '11:00 AM - 11:00 PM',
    },
    {
      name: 'Pool Side Dining',
      slug: 'poolside',
      prefix: 'Poolside',
      description: 'Relaxed breeze-brushed dining tables under canopies right next to the crystal pool.',
      theme: 'BEACH_RESTAURANT',
      primaryColor: '#00897B',
      secondaryColor: '#00695C',
      accentColor: '#80CBC4',
      fontHeading: 'Lora',
      fontBody: 'Nunito',
      openingHours: '12:00 PM - 10:00 PM',
    },
    {
      name: 'Rooftop Dining',
      slug: 'rooftop',
      prefix: 'Rooftop',
      description: 'Stellar skyline views, open skies, and glowing candlelit lounge tables.',
      theme: 'ITALIAN_BISTRO',
      primaryColor: '#800020',
      secondaryColor: '#600018',
      accentColor: '#D4AF37',
      fontHeading: 'Montserrat',
      fontBody: 'Raleway',
      openingHours: '06:00 PM - 12:00 AM',
    },
    {
      name: 'Garden Restaurant',
      slug: 'garden',
      prefix: 'Garden',
      description: 'Cozy garden tables surrounded by blooming jasmines and warm hanging lamps.',
      theme: 'MODERN_CAFE',
      primaryColor: '#5D4037',
      secondaryColor: '#4E342E',
      accentColor: '#D7CCC8',
      fontHeading: 'Poppins',
      fontBody: 'Inter',
      openingHours: '11:00 AM - 10:00 PM',
    },
    {
      name: 'Executive Lounge',
      slug: 'lounge',
      prefix: 'Lounge',
      description: 'Quiet, minimal Zen layout with low tables and premium green tea selections.',
      theme: 'MINIMAL_JAPANESE',
      primaryColor: '#1F1F24',
      secondaryColor: '#2D2D35',
      accentColor: '#E6E2D8',
      fontHeading: 'Libre Baskerville',
      fontBody: 'DM Sans',
      openingHours: '05:00 PM - 02:00 AM',
    },
  ];

  for (const config of profilesConfigs) {
    // Create Profile
    const profile = await prisma.menuProfile.create({
      data: {
        name: config.name,
        slug: config.slug,
        description: config.description,
        theme: config.theme,
        primaryColor: config.primaryColor,
        secondaryColor: config.secondaryColor,
        accentColor: config.accentColor,
        fontHeading: config.fontHeading,
        fontBody: config.fontBody,
        openingHours: config.openingHours,
        restaurantId: royalSpice.id,
      },
    });

    // Create Profile QR Code
    const pUrl = `http://localhost:3000/r/${royalSpice.slug}/${profile.slug}`;
    const pQrData = await qrcode.toDataURL(pUrl, {
      width: 512,
      margin: 2,
      color: { dark: '#000000', light: '#FFFFFF' },
    });

    await prisma.qRCode.create({
      data: {
        url: pUrl,
        dataUrl: pQrData,
        restaurantId: royalSpice.id,
        menuProfileId: profile.id,
      },
    });

    // Create 7 Categories for this Profile with unique names per restaurant
    const catsMap: Record<string, string> = {};
    const uniqueCats = Array.from(new Set(baseDishes.map(d => d.categoryName)));

    let sortOrder = 1;
    for (const catName of uniqueCats) {
      const icon = baseDishes.find(d => d.categoryName === catName)?.icon || 'Utensils';
      const customName = `${config.prefix} ${catName}`; // e.g. "Poolside Starters"
      const category = await prisma.category.create({
        data: {
          name: customName,
          icon,
          sortOrder: sortOrder++,
          restaurantId: royalSpice.id,
          menuProfileId: profile.id,
        },
      });
      catsMap[catName] = category.id;
    }

    // Populate exactly all 41 dishes into this profile
    for (const dish of baseDishes) {
      const categoryId = catsMap[dish.categoryName];
      await prisma.menuItem.create({
        data: {
          name: dish.name,
          description: dish.description,
          price: dish.price,
          image: dish.image,
          isVeg: dish.isVeg,
          isFeatured: dish.isFeatured,
          categoryId,
          restaurantId: royalSpice.id,
          menuProfileId: profile.id,
        },
      });
    }

    console.log(`Seeded Menu Profile: ${config.name} (41 dishes)`);
  }

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
