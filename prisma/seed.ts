import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Hash password for demo accounts
  const hashedPassword = await bcrypt.hash('demo123', 10);

  // Create demo users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      name: 'Admin User',
      role: 'ADMIN',
      phone: '+919999999999',
    },
  });

  const seller = await prisma.user.upsert({
    where: { email: 'seller@example.com' },
    update: {},
    create: {
      email: 'seller@example.com',
      password: await bcrypt.hash('seller123', 10),
      name: 'Kirana Store Owner',
      role: 'SELLER',
      phone: '+919999999998',
    },
  });

  const delivery = await prisma.user.upsert({
    where: { email: 'delivery@new.com' },
    update: {},
    create: {
      email: 'delivery@new.com',
      password: await bcrypt.hash('delivery123', 10),
      name: 'Delivery Partner',
      role: 'DELIVERY',
      phone: '+919999999997',
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      password: hashedPassword,
      name: 'Demo Customer',
      role: 'CUSTOMER',
      phone: '+919999999996',
    },
  });

  console.log('✅ Created demo users');

  // Create customer address
  await prisma.address.create({
    data: {
      userId: customer.id,
      label: 'Home',
      street: '123 Main Street, Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      lat: 19.0760,
      lng: 72.8777,
      isDefault: true,
    },
  });

  console.log('✅ Created customer address');

  // Grocery Products with local images
  const groceryProducts = [
    { name: 'Tata Salt', description: 'Iodized Salt 1kg', price: 25, stock: 100, rating: 4.5, image: '/images/grocery/salt.png' },
    { name: 'Fortune Sunflower Oil', description: 'Refined Oil 1L', price: 180, stock: 50, rating: 4.3, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500' },
    { name: 'Aashirvaad Atta', description: 'Whole Wheat Flour 5kg', price: 280, stock: 75, rating: 4.7, image: '/images/grocery/aata.png' },
    { name: 'Tata Tea Gold', description: 'Premium Tea 500g', price: 250, stock: 60, rating: 4.6, image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=500' },
    { name: 'Amul Butter', description: 'Salted Butter 500g', price: 260, stock: 40, rating: 4.8, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500' },
    { name: 'Maggi Noodles', description: 'Masala Noodles Pack of 12', price: 144, stock: 120, rating: 4.4, image: '/images/grocery/maggie.png' },
    { name: 'Britannia Good Day', description: 'Butter Cookies 600g', price: 80, stock: 90, rating: 4.2, image: '/images/grocery/goodday.png' },
    { name: 'Colgate Toothpaste', description: 'Total Advanced Health 200g', price: 150, stock: 80, rating: 4.5, image: '/images/grocery/colgate.png' },
    { name: 'Surf Excel Detergent', description: 'Matic Front Load 2kg', price: 380, stock: 45, rating: 4.6, image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=500' },
    { name: 'Parle-G Biscuits', description: 'Original Gluco Biscuits 1kg', price: 60, stock: 150, rating: 4.7, image: '/images/grocery/parleg.png' },
    { name: 'Basmati Rice', description: 'India Gate Classic 5kg', price: 550, stock: 55, rating: 4.5, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500' },
    { name: 'Toor Dal', description: 'Premium Quality 1kg', price: 140, stock: 70, rating: 4.4, image: '/images/grocery/toordaal.png' },
  ];

  // Vegetable Products with local and online images
  const vegetableProducts = [
    { name: 'Fresh Tomatoes', description: 'Farm Fresh Red Tomatoes', price: 40, stock: 200, rating: 4.3, image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=500' },
    { name: 'Onions', description: 'Fresh Red Onions', price: 35, stock: 180, rating: 4.2, image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500' },
    { name: 'Potatoes', description: 'Fresh Potatoes', price: 30, stock: 220, rating: 4.4, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500' },
    { name: 'Green Capsicum', description: 'Fresh Bell Peppers', price: 60, stock: 100, rating: 4.5, image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500' },
    { name: 'Carrots', description: 'Fresh Orange Carrots', price: 45, stock: 120, rating: 4.6, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500' },
    { name: 'Spinach', description: 'Fresh Green Spinach Bunch', price: 25, stock: 90, rating: 4.4, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500' },
    { name: 'Cauliflower', description: 'Fresh White Cauliflower', price: 50, stock: 80, rating: 4.3, image: '/images/vegetables/caluriflower.png' },
  ];

  // Restaurant/Fast Food Products with real vegetarian images
  const restaurantProducts = [
    { name: 'Veg Burger', description: 'Crispy Veg Patty Burger with Cheese', price: 120, stock: 50, rating: 4.5, image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500' },
    { name: 'Paneer Burger', description: 'Grilled Paneer Burger', price: 180, stock: 40, rating: 4.6, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500' },
    { name: 'Margherita Pizza', description: 'Classic Cheese Pizza', price: 250, stock: 30, rating: 4.7, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500' },
    { name: 'French Fries', description: 'Crispy Golden Fries', price: 80, stock: 60, rating: 4.4, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500' },
    { name: 'Veg Sandwich', description: 'Grilled Veg Sandwich', price: 100, stock: 45, rating: 4.3, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500' },
    { name: 'Paneer Tikka Roll', description: 'Spicy Paneer Wrap', price: 140, stock: 35, rating: 4.6, image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500' },
    { name: 'Cold Coffee', description: 'Chilled Coffee with Ice Cream', price: 120, stock: 50, rating: 4.5, image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=500' },
  ];

  // Create products
  for (const product of groceryProducts) {
    const { image, ...productData } = product;
    await prisma.product.create({
      data: {
        ...productData,
        category: 'GROCERY',
        sellerId: seller.id,
        images: JSON.stringify([image]),
        reviewCount: Math.floor(Math.random() * 100) + 20,
      },
    });
  }

  for (const product of vegetableProducts) {
    const { image, ...productData } = product;
    await prisma.product.create({
      data: {
        ...productData,
        category: 'VEGETABLES',
        sellerId: seller.id,
        images: JSON.stringify([image]),
        reviewCount: Math.floor(Math.random() * 80) + 15,
      },
    });
  }

  for (const product of restaurantProducts) {
    const { image, ...productData } = product;
    await prisma.product.create({
      data: {
        ...productData,
        category: 'RESTAURANT',
        sellerId: seller.id,
        images: JSON.stringify([image]),
        reviewCount: Math.floor(Math.random() * 60) + 10,
      },
    });
  }

  console.log('✅ Created products');

  // Create coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: 'FIRST50',
        discount: 50,
        type: 'FIXED',
        minOrder: 200,
        maxUses: 100,
        isActive: true,
      },
      {
        code: 'SAVE20',
        discount: 20,
        type: 'PERCENTAGE',
        minOrder: 500,
        maxUses: 500,
        isActive: true,
      },
      {
        code: 'WELCOME100',
        discount: 100,
        type: 'FIXED',
        minOrder: 300,
        maxUses: 50,
        isActive: true,
      },
    ],
  });

  console.log('✅ Created coupons');

  console.log('🎉 Database seeded successfully!');
  console.log('\n📝 Demo Accounts:');
  console.log('Admin: admin@example.com / admin123');
  console.log('Seller: seller@example.com / seller123');
  console.log('Delivery: delivery@new.com / delivery123');
  console.log('Customer: customer@example.com / demo123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
