import { PrismaClient, Role, ThemeType, SubscriptionStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import qrcode from 'qrcode';

const prisma = new PrismaClient();

const damanRestaurants = [
  {
    ownerEmail: 'owner1@damanmenu.com',
    ownerName: 'O Coqueiro Owner',
    name: 'O Coqueiro Beach Shack',
    slug: 'o-coqueiro-shack',
    tagline: 'Traditional Portuguese & Goan Seafood Shack',
    description: 'Traditional Portuguese seafood shack right on Devka beach. Famous for Butter Garlic Lobsters, Tandoori Fish, and Goan Fish Caldin.',
    address: 'Devka Beach Road, Nani Daman, Daman 396210',
    phone: '+91 98765 43210',
    whatsApp: '+919876543210',
    logo: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&h=400&fit=crop',
    theme: ThemeType.LUXURY_DARK,
    currencySymbol: '₹',
    categories: [
      {
        name: 'Devka Starters',
        icon: 'Soup',
        items: [
          { name: 'Peri Peri Prawns', description: 'Plump prawns sautéed in our spicy house-made peri peri sauce.', price: 420, isVeg: false, isFeatured: true, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=500&fit=crop' },
          { name: 'Cheese Stuffed Calamari', description: 'Tender squid tubes stuffed with local herbs and melted mozzarella.', price: 380, isVeg: false, isFeatured: false, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=500&fit=crop' },
          { name: 'Paneer Cafreal Tikka', description: 'Paneer cubes marinated in Goan green herb paste, tandoor grilled.', price: 290, isVeg: true, isFeatured: false, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=500&fit=crop' }
        ]
      },
      {
        name: 'Coastal Mains',
        icon: 'UtensilsCrossed',
        items: [
          { name: 'Goan Fish Curry', description: 'Fresh pomfret cooked in a rich, spiced coconut and tamarind gravy.', price: 480, isVeg: false, isFeatured: true, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&fit=crop' },
          { name: 'Chicken Cafreal', description: 'Traditional Goan-Portuguese green masala chicken, pan-fried to perfection.', price: 390, isVeg: false, isFeatured: true, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=500&fit=crop' },
          { name: 'Vegetable Caldin', description: 'Assorted fresh vegetables in a mild, fragrant yellow coconut milk gravy.', price: 320, isVeg: true, isFeatured: false, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=500&fit=crop' }
        ]
      },
      {
        name: 'Desserts',
        icon: 'IceCream',
        items: [
          { name: 'Bebinca with Ice Cream', description: 'Traditional 7-layered Goan coconut cake, served warm with vanilla ice cream.', price: 220, isVeg: true, isFeatured: true, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=500&fit=crop' }
        ]
      }
    ]
  },
  {
    ownerEmail: 'owner2@damanmenu.com',
    ownerName: 'Daman Delight Owner',
    name: 'Daman Delight Thali',
    slug: 'daman-delight',
    tagline: 'Home-style Gujarati & North Indian Thalis',
    description: 'Home-style Gujarati and North Indian thalis in Nani Daman. We serve authentic food made with fresh ingredients and traditional spices.',
    address: 'Near Dilip Nagar, Nani Daman, Daman 396210',
    phone: '+91 98765 43211',
    whatsApp: '+919876543211',
    logo: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?q=80&w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?q=80&w=1200&h=400&fit=crop',
    theme: ThemeType.ELEGANT_LIGHT,
    currencySymbol: '₹',
    categories: [
      {
        name: 'Gujarati Thalis',
        icon: 'Sparkles',
        items: [
          { name: 'Royal Gujarati Thali', description: 'Unlimited thali: 3 Veg curries, Dal, Kadhi, Roti, Poori, Rice, Farsan, Sweet, and Chaas.', price: 350, isVeg: true, isFeatured: true, image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?q=80&w=500&fit=crop' },
          { name: 'Express Kathiyawadi Thali', description: 'Spicy Ringan Bharta, Sev Tameta, Bajra Rotla, Khichdi, Kadhi, Garlic Chutney, and Jaggery.', price: 280, isVeg: true, isFeatured: false, image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?q=80&w=500&fit=crop' }
        ]
      },
      {
        name: 'Sweets & Add-ons',
        icon: 'IceCream',
        items: [
          { name: 'Kesar Shrikhand', description: 'Sweet, thick strained yogurt flavored with saffron, cardamom, and pistachios.', price: 120, isVeg: true, isFeatured: false, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=500&fit=crop' },
          { name: 'Masala Chaas', description: 'Refreshing buttermilk blended with roasted cumin, mint, and black salt.', price: 60, isVeg: true, isFeatured: false, image: 'https://images.unsplash.com/photo-1626803775151-61d756612f97?q=80&w=500&fit=crop' }
        ]
      }
    ]
  },
  {
    ownerEmail: 'owner3@damanmenu.com',
    ownerName: 'Gold Coast Owner',
    name: 'The Gold Coast Resort Café',
    slug: 'gold-coast-cafe',
    tagline: 'Premium Beachfront Multi-Cuisine Dining',
    description: 'Premium beachfront multi-cuisine dining experience. Enjoy fresh continental dishes, woodfired pizzas, and gourmet coffee overlooking the sea.',
    address: 'Devka Beach Road, Nani Daman, Daman 396210',
    phone: '+91 98765 43212',
    whatsApp: '+919876543212',
    logo: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&h=400&fit=crop',
    theme: ThemeType.MODERN_THEME,
    currencySymbol: '₹',
    categories: [
      {
        name: 'Italian Woodfired',
        icon: 'Pizza',
        items: [
          { name: 'Truffle Mushroom Pizza', description: 'Fresh mozzarella, wild mushrooms, white truffle oil, and wild arugula on sourdough.', price: 490, isVeg: true, isFeatured: true, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=500&fit=crop' },
          { name: 'Smoked Salmon Pizza', description: 'Capers, red onion, dill cream cheese, smoked salmon, and fresh lemon squeeze.', price: 580, isVeg: false, isFeatured: true, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&fit=crop' }
        ]
      },
      {
        name: 'Gourmet Beverages',
        icon: 'Wine',
        items: [
          { name: 'Iced Rose Latte', description: 'Espresso with cold milk, organic rose syrup, topped with edible rose petals.', price: 180, isVeg: true, isFeatured: false, image: 'https://images.unsplash.com/photo-1626803775151-61d756612f97?q=80&w=500&fit=crop' },
          { name: 'Mango Passion Cooler', description: 'Fresh alphanso mango pulp, passionfruit syrup, fresh lime, mint, and sparkling soda.', price: 210, isVeg: true, isFeatured: true, image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=500&fit=crop' }
        ]
      }
    ]
  },
  {
    ownerEmail: 'owner4@damanmenu.com',
    ownerName: 'Jampore Beach Owner',
    name: 'Jampore Beach Grill',
    slug: 'jampore-beach-grill',
    tagline: 'Barbecue Grills & Tandoori Coastal Specialities',
    description: 'Beachside barbecue grills and tandoori specials on Jampore beach. Authentic coal-grilled seafood, spicy kebabs, and refreshing mocktails.',
    address: 'Jampore Beach, Moti Daman, Daman 396220',
    phone: '+91 98765 43213',
    whatsApp: '+919876543213',
    logo: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&h=400&fit=crop',
    theme: ThemeType.CAFE_THEME,
    currencySymbol: '₹',
    categories: [
      {
        name: 'Tandoor Seafood',
        icon: 'UtensilsCrossed',
        items: [
          { name: 'Jampore Lobster Grill', description: 'Whole local lobster marinated in rich tandoori spices, char-grilled over charcoal.', price: 950, isVeg: false, isFeatured: true, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=500&fit=crop' },
          { name: 'Tandoori Crab Masala', description: 'Full crab basted in a hot garlic and tandoori paste, roasted to crispy perfection.', price: 680, isVeg: false, isFeatured: false, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=500&fit=crop' }
        ]
      },
      {
        name: 'Tandoor Veg',
        icon: 'Soup',
        items: [
          { name: 'Peshawari Paneer Tikka', description: 'Aromatic yellow spiced paneer block stuffed with dried fruits, grilled in clay oven.', price: 340, isVeg: true, isFeatured: true, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=500&fit=crop' }
        ]
      }
    ]
  },
  {
    ownerEmail: 'owner5@damanmenu.com',
    ownerName: 'Miramar Owner',
    name: 'Miramar Seafood Garden',
    slug: 'miramar-seafood',
    tagline: 'Authentic Goan-Portuguese Shellfish & Fish Curries',
    description: 'Famous local fish curry and coastal delicacies with garden seating. Experience fresh pomfret, surmai, and crab dishes with local spices.',
    address: 'Devka Beach Road, Nani Daman, Daman 396210',
    phone: '+91 98765 43214',
    whatsApp: '+919876543214',
    logo: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&h=400&fit=crop',
    theme: ThemeType.LUXURY_DARK,
    currencySymbol: '₹',
    categories: [
      {
        name: 'Sea Harvest Frys',
        icon: 'UtensilsCrossed',
        items: [
          { name: 'Surmai Rawa Fry', description: 'Local Kingfish slice coated in spicy green paste and semolina, pan-fried crisp.', price: 440, isVeg: false, isFeatured: true, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=500&fit=crop' },
          { name: 'Golden Bombay Duck Fry', description: 'Crispy rawa batter coated fresh Bombil fish served with mint chutney.', price: 290, isVeg: false, isFeatured: false, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=500&fit=crop' }
        ]
      },
      {
        name: 'Traditional Curries',
        icon: 'Soup',
        items: [
          { name: 'Miramar Pomfret Curry', description: 'Our signature spicy Pomfret curry prepared using local dried red chillies and coconut.', price: 520, isVeg: false, isFeatured: true, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&fit=crop' }
        ]
      }
    ]
  },
  {
    ownerEmail: 'owner6@damanmenu.com',
    ownerName: 'Cidade Owner',
    name: 'Cidade de Daman Portuguese Restaurant',
    slug: 'cidade-de-daman',
    tagline: 'Heritage Goan-Portuguese Recipes inside Moti Daman Fort',
    description: 'Cidade de Daman serves authentic heritage Goan-Portuguese dishes within the ancient walls of Moti Daman Fort. Try our classic Feijoada and Serradura.',
    address: 'Inside Fort Area, Moti Daman, Daman 396220',
    phone: '+91 98765 43215',
    whatsApp: '+919876543215',
    logo: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&h=400&fit=crop',
    theme: ThemeType.ELEGANT_LIGHT,
    currencySymbol: '₹',
    categories: [
      {
        name: 'Portuguese Heritage',
        icon: 'Sparkles',
        items: [
          { name: 'Goan Pork Feijoada', description: 'Classic stew of pork and red kidney beans, spiced with vinegar and Goan garam masala.', price: 460, isVeg: false, isFeatured: true, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=500&fit=crop' },
          { name: 'Prawns Balchao', description: 'Fiery shrimp pickle-style curry, prepared with caramelized onions, vinegar, and hot chillies.', price: 420, isVeg: false, isFeatured: true, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=500&fit=crop' }
        ]
      },
      {
        name: 'Sweets',
        icon: 'IceCream',
        items: [
          { name: 'Portuguese Serradura', description: 'Luxurious layered pudding made with sweetened whipped cream and crushed Marie biscuits.', price: 190, isVeg: true, isFeatured: true, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=500&fit=crop' }
        ]
      }
    ]
  },
  {
    ownerEmail: 'owner7@damanmenu.com',
    ownerName: 'Spice Route Owner',
    name: 'Spice Route Veg',
    slug: 'spice-route-veg',
    tagline: '100% Pure Vegetarian Indian & Chinese Cuisine',
    description: 'Elegant pure-vegetarian dining in Daman. We offer aromatic tandoori paneer starters, rich North Indian curries, and tasty Chinese stir-frys.',
    address: 'Opp. Dilip Nagar Ground, Nani Daman, Daman 396210',
    phone: '+91 98765 43216',
    whatsApp: '+919876543216',
    logo: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=1200&h=400&fit=crop',
    theme: ThemeType.MODERN_THEME,
    currencySymbol: '₹',
    categories: [
      {
        name: 'Gourmet Starters',
        icon: 'Soup',
        items: [
          { name: 'Crispy Veg Salt & Pepper', description: 'Crisp fried babycorn, broccoli, and peppers tossed in a light soy and white pepper sauce.', price: 260, isVeg: true, isFeatured: false, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=500&fit=crop' },
          { name: 'Paneer Malai Kebab', description: 'Soft paneer blocks loaded with cashew paste, cardamom, and fresh cream, baked in clay oven.', price: 320, isVeg: true, isFeatured: true, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=500&fit=crop' }
        ]
      },
      {
        name: 'Spice Route Mains',
        icon: 'UtensilsCrossed',
        items: [
          { name: 'Paneer Lababdar', description: 'Cottage cheese cubes folded in a rich tomato, onion, and cashew gravy with butter.', price: 340, isVeg: true, isFeatured: true, image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=500&fit=crop' },
          { name: 'Veg Diwani Handi', description: 'Assorted seasonal vegetables cooked in a spicy spinach and cashew herb gravy.', price: 290, isVeg: true, isFeatured: false, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=500&fit=crop' }
        ]
      }
    ]
  },
  {
    ownerEmail: 'owner8@damanmenu.com',
    ownerName: 'Dunes Bistro Owner',
    name: 'Dunes Beach Bistro',
    slug: 'dunes-beach-bistro',
    tagline: 'Casual Beachfront Woodfired Pizza & Specialty Burgers',
    description: 'Chill beachfront hangout spot. Serving woodfired artisanal pizzas, delicious specialty burgers, milkshakes, and cold brew coffee.',
    address: 'Devka Beach Road, Nani Daman, Daman 396210',
    phone: '+91 98765 43217',
    whatsApp: '+919876543217',
    logo: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=1200&h=400&fit=crop',
    theme: ThemeType.CAFE_THEME,
    currencySymbol: '₹',
    categories: [
      {
        name: 'Woodfired Pizzas',
        icon: 'Pizza',
        items: [
          { name: 'Spicy Diavola Pizza', description: 'San Marzano marinara, spicy pepperoni, fresh mozzarella, and hot chilli honey.', price: 480, isVeg: false, isFeatured: true, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&fit=crop' },
          { name: 'Garden Green Pizza', description: 'Pesto base, cherry tomatoes, baby spinach, roasted garlic, feta cheese, and balsamic drizzle.', price: 420, isVeg: true, isFeatured: false, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=500&fit=crop' }
        ]
      },
      {
        name: 'Bistro Burgers',
        icon: 'Coffee',
        items: [
          { name: 'Smoked BBQ Bacon Burger', description: 'Prime beef patty, smoked bacon, caramelized onions, cheddar, and house barbecue sauce.', price: 360, isVeg: false, isFeatured: true, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=500&fit=crop' }
        ]
      }
    ]
  },
  {
    ownerEmail: 'owner9@damanmenu.com',
    ownerName: 'Sea Crest Owner',
    name: 'Sea Crest Fine Dine',
    slug: 'sea-crest-dine',
    tagline: 'Luxury Multicuisine Fine Dining Restaurant',
    description: 'Elegant multicuisine fine dining restaurant. Try our gourmet Asian bowls, classic Continental bakes, and rich Indian clay-oven items.',
    address: 'Devka Beach Road, Nani Daman, Daman 396210',
    phone: '+91 98765 43218',
    whatsApp: '+919876543218',
    logo: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&h=400&fit=crop',
    theme: ThemeType.LUXURY_DARK,
    currencySymbol: '₹',
    categories: [
      {
        name: 'Pan Asian Bowls',
        icon: 'UtensilsCrossed',
        items: [
          { name: 'Thai Green Curry Bowl', description: 'Aromatic green coconut curry with exotic vegetables, served with jasmine rice.', price: 390, isVeg: true, isFeatured: true, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=500&fit=crop' },
          { name: 'Crispy Szechuan Fish', description: 'Battered sea bass wok-fried in our hot and spicy Szechuan pepper sauce.', price: 460, isVeg: false, isFeatured: true, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=500&fit=crop' }
        ]
      },
      {
        name: 'Continental Mains',
        icon: 'Soup',
        items: [
          { name: 'Herb Roasted Chicken', description: 'Roasted half chicken served with creamy mashed potatoes, grilled vegetables, and rosemary jus.', price: 480, isVeg: false, isFeatured: false, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=500&fit=crop' }
        ]
      }
    ]
  },
  {
    ownerEmail: 'owner10@damanmenu.com',
    ownerName: 'Daman Darshan Owner',
    name: 'Daman Darshan Dhaba',
    slug: 'daman-darshan',
    tagline: 'Authentic North Indian & Punjabi Highway Dhaba',
    description: 'Authentic Punjabi highway dhaba experience in Daman. Savour rich butter paneer, spicy clay-oven tandoori chicken, and oversized butter naans.',
    address: 'Daman-Vapi Road, Nani Daman, Daman 396215',
    phone: '+91 98765 43219',
    whatsApp: '+919876543219',
    logo: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?q=80&w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1626803775151-61d756612f97?q=80&w=1200&h=400&fit=crop',
    theme: ThemeType.CAFE_THEME,
    currencySymbol: '₹',
    categories: [
      {
        name: 'Tandoor Dhaba Special',
        icon: 'UtensilsCrossed',
        items: [
          { name: 'Dhaba Tandoori Chicken', description: 'Full chicken marinated in hot red pepper paste and yogurt, roasted in tandoor.', price: 420, isVeg: false, isFeatured: true, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=500&fit=crop' },
          { name: 'Paneer Tikka Shaslik', description: 'Cottage cheese cubes skewered with onions and bell peppers, basted with spiced mustard oil.', price: 290, isVeg: true, isFeatured: false, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=500&fit=crop' }
        ]
      },
      {
        name: 'Dhaba Curries & Breads',
        icon: 'Soup',
        items: [
          { name: 'Dhaba Dal Makhani', description: 'Black lentils slow simmered overnight with butter and fresh cream.', price: 240, isVeg: true, isFeatured: true, image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=500&fit=crop' },
          { name: 'Butter Garlic Naan', description: 'Leavened clay-oven flatbread topped with chopped garlic and butter brush.', price: 70, isVeg: true, isFeatured: false, image: 'https://images.unsplash.com/photo-1626803775151-61d756612f97?q=80&w=500&fit=crop' }
        ]
      }
    ]
  }
];

async function main() {
  console.log('Seeding database...');

  // 1. Clean database
  await prisma.subscription.deleteMany();
  await prisma.qRCode.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();
  await prisma.plan.deleteMany();

  // 2. Create Plans
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

  console.log('Plans created.');

  // 3. Create Admins
  const adminPassword = await bcrypt.hash('adminpass', 10);
  await prisma.user.create({
    data: {
      email: 'admin@digitalmenu.com',
      name: 'Platform Admin',
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });

  // 4. Create original owner credentials & Trattoria Bella (USD style)
  const ownerPassword = await bcrypt.hash('password', 10);
  const trattoriaOwner = await prisma.user.create({
    data: {
      email: 'owner@trattoria.com',
      name: 'Mario Rossi',
      passwordHash: ownerPassword,
      role: Role.OWNER,
    },
  });

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
      theme: ThemeType.LUXURY_DARK,
      currencySymbol: '$',
      ownerId: trattoriaOwner.id,
    },
  });

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

  const trattoriaMenuUrl = `http://localhost:3000/r/${trattoria.slug}`;
  const trattoriaQrData = await qrcode.toDataURL(trattoriaMenuUrl, {
    width: 512,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  });

  await prisma.qRCode.create({
    data: {
      url: trattoriaMenuUrl,
      dataUrl: trattoriaQrData,
      restaurantId: trattoria.id,
    },
  });

  console.log('Trattoria Bella seeded.');

  // 5. Seed 10 Daman, India Restaurants
  for (const rData of damanRestaurants) {
    const pwdHash = await bcrypt.hash('password', 10);
    const owner = await prisma.user.create({
      data: {
        email: rData.ownerEmail,
        name: rData.ownerName,
        passwordHash: pwdHash,
        role: Role.OWNER,
      },
    });

    const restaurant = await prisma.restaurant.create({
      data: {
        name: rData.name,
        slug: rData.slug,
        tagline: rData.tagline,
        description: rData.description,
        address: rData.address,
        phone: rData.phone,
        whatsApp: rData.whatsApp,
        logo: rData.logo,
        banner: rData.banner,
        theme: rData.theme,
        currencySymbol: rData.currencySymbol,
        ownerId: owner.id,
      },
    });

    // Create Subscription
    await prisma.subscription.create({
      data: {
        status: SubscriptionStatus.ACTIVE,
        restaurantId: restaurant.id,
        planId: luxuryPlan.id,
        startDate: today,
        endDate: nextYear,
      },
    });

    const rMenuUrl = `http://localhost:3000/r/${restaurant.slug}`;
    const rQrData = await qrcode.toDataURL(rMenuUrl, {
      width: 512,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    // Create QR Code entry
    await prisma.qRCode.create({
      data: {
        url: rMenuUrl,
        dataUrl: rQrData,
        restaurantId: restaurant.id,
      },
    });

    // Create Categories and Menu Items
    let order = 1;
    for (const catData of rData.categories) {
      const category = await prisma.category.create({
        data: {
          name: catData.name,
          icon: catData.icon,
          sortOrder: order++,
          restaurantId: restaurant.id,
        },
      });

      for (const itemData of catData.items) {
        await prisma.menuItem.create({
          data: {
            name: itemData.name,
            description: itemData.description,
            price: itemData.price,
            image: itemData.image,
            isVeg: itemData.isVeg,
            isFeatured: itemData.isFeatured,
            categoryId: category.id,
            restaurantId: restaurant.id,
          },
        });
      }
    }

    console.log(`Seeded restaurant: ${rData.name}`);
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
