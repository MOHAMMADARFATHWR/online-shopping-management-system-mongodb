const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Review = require('../models/Review');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
  const connString = process.env.MONGODB_URI;
  if (!connString || connString.includes('your_mongodb_atlas_connection_string')) {
    console.error('❌ MONGODB_URI is not configured in backend/.env file. Seed aborted.');
    process.exit(1);
  }

  try {
    console.log('📡 Connecting to MongoDB Atlas...');
    await mongoose.connect(connString, {
      dbName: 'online_shopping_db',
      serverSelectionTimeoutMS: 10000
    });
    console.log('✅ Connected to MongoDB Atlas for Seeding!');
  } catch (err) {
    console.error('❌ MongoDB Atlas Connection Error:', err.message);
    console.error('💡 Tip: Please ensure 0.0.0.0/0 is added to your MongoDB Atlas Network Access IP Whitelist.');
    process.exit(1);
  }
};

const sampleUsers = [
  // 2 Admin Users
  {
    name: 'Main Admin',
    email: 'admin@shopmongo.com',
    password: 'adminpassword123',
    phone: '9876543210',
    address: '100 Tech Park Way',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    role: 'admin'
  },
  {
    name: 'Secondary Admin',
    email: 'storemanager@shopmongo.com',
    password: 'adminpassword123',
    phone: '9876543211',
    address: '200 Retail Boulevard',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    role: 'admin'
  },
  // 10 Customer Users
  {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    password: 'userpassword123',
    phone: '9123456780',
    address: 'Flat 402, Sunshine Apts, MG Road',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110001',
    role: 'customer'
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    password: 'userpassword123',
    phone: '9123456781',
    address: '12 Green Park Society',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380001',
    role: 'customer'
  },
  {
    name: 'Ananya Verma',
    email: 'ananya.verma@example.com',
    password: 'userpassword123',
    phone: '9123456782',
    address: '88 Cyber City Drive',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122002',
    role: 'customer'
  },
  {
    name: 'Aarav Kumar',
    email: 'aarav.kumar@example.com',
    password: 'userpassword123',
    phone: '9123456783',
    address: '15 Lake View Street',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500001',
    role: 'customer'
  },
  {
    name: 'Sneha Reddy',
    email: 'sneha.reddy@example.com',
    password: 'userpassword123',
    phone: '9123456784',
    address: '45 IT Colony, Gachibowli',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500032',
    role: 'customer'
  },
  {
    name: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    password: 'userpassword123',
    phone: '9123456785',
    address: '77 Heritage Lane',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302001',
    role: 'customer'
  },
  {
    name: 'Neha Gupta',
    email: 'neha.gupta@example.com',
    password: 'userpassword123',
    phone: '9123456786',
    address: '303 Salt Lake City',
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700091',
    role: 'customer'
  },
  {
    name: 'Rohan Deshmukh',
    email: 'rohan.d@example.com',
    password: 'userpassword123',
    phone: '9123456787',
    address: '19 Kothrud Avenue',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411038',
    role: 'customer'
  },
  {
    name: 'Kavya Nair',
    email: 'kavya.nair@example.com',
    password: 'userpassword123',
    phone: '9123456788',
    address: '52 Marine Drive',
    city: 'Kochi',
    state: 'Kerala',
    pincode: '682001',
    role: 'customer'
  },
  {
    name: 'Arjun Das',
    email: 'arjun.das@example.com',
    password: 'userpassword123',
    phone: '9123456789',
    address: '101 Anna Salai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600002',
    role: 'customer'
  }
];

const sampleProducts = [
  // Electronics (6)
  {
    name: 'Wireless Noise Canceling Headphones',
    description: 'Immersive sound quality with active noise cancellation, 30-hour battery life, and ultra-soft memory foam earcups.',
    category: 'Electronics',
    brand: 'AudioPhonic',
    price: 14999,
    discount: 15,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    rating: 4.8,
    reviewCount: 6
  },
  {
    name: 'Ultra-Slim Smartwatch Pro 5',
    description: 'AMOLED display, GPS tracking, heart rate monitor, sleep analysis, and water resistance up to 50 meters.',
    category: 'Electronics',
    brand: 'TechGear',
    price: 8999,
    discount: 20,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    rating: 4.5,
    reviewCount: 4
  },
  {
    name: 'Mechanical Gaming Keyboard RGB',
    description: 'Tactile blue switches, customizable per-key RGB backlighting, durable aluminum top plate, and detachable USB-C cable.',
    category: 'Electronics',
    brand: 'CyberKeys',
    price: 4500,
    discount: 10,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
    rating: 4.7,
    reviewCount: 5
  },
  {
    name: '4K Ultra HD Streaming Camera',
    description: 'Crystal clear 4K resolution, dual stereo microphones, auto-focus lens, and privacy shutter for streaming and conferencing.',
    category: 'Electronics',
    brand: 'VisionPlus',
    price: 6200,
    discount: 5,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
    rating: 4.3,
    reviewCount: 3
  },
  {
    name: 'Portable Bluetooth Speaker Max',
    description: 'Deep bass sound output, IPX7 waterproof rating, 24-hour continuous playtime, and built-in power bank capability.',
    category: 'Electronics',
    brand: 'SoundBoom',
    price: 3499,
    discount: 12,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
    rating: 4.6,
    reviewCount: 4
  },
  {
    name: 'Ergonomic Wireless Gaming Mouse',
    description: '16,000 DPI optical sensor, ultra-lightweight design, zero-latency wireless connectivity, and customizable side buttons.',
    category: 'Electronics',
    brand: 'CyberKeys',
    price: 2999,
    discount: 10,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
    rating: 4.4,
    reviewCount: 2
  },

  // Fashion (5)
  {
    name: 'Classic Men Denim Jacket',
    description: '100% premium cotton denim jacket with standard fit, button front closure, and button-flap chest pockets.',
    category: 'Fashion',
    brand: 'UrbanCraft',
    price: 2999,
    discount: 25,
    stock: 60,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80',
    rating: 4.6,
    reviewCount: 3
  },
  {
    name: 'Women Floral Summer Midi Dress',
    description: 'Lightweight breathable rayon fabric, attractive A-line silhouette, square neckline, and comfortable puff sleeves.',
    category: 'Fashion',
    brand: 'VogueStyle',
    price: 1899,
    discount: 15,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
    rating: 4.7,
    reviewCount: 4
  },
  {
    name: 'Casual Canvas Sneakers Sport',
    description: 'Versatile low-top lace-up sneakers featuring cushioned insoles, flexible rubber outsoles, and durable canvas upper.',
    category: 'Fashion',
    brand: 'StepEasy',
    price: 2499,
    discount: 20,
    stock: 55,
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80',
    rating: 4.5,
    reviewCount: 3
  },
  {
    name: 'Polarized Aviator Sunglasses',
    description: 'UV400 protection coating, lightweight metal frame, scratch-resistant tac lenses, and comfortable silicone nose pads.',
    category: 'Fashion',
    brand: 'SunGazer',
    price: 1299,
    discount: 30,
    stock: 80,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
    rating: 4.4,
    reviewCount: 2
  },
  {
    name: 'Genuine Leather Minimalist Wallet',
    description: 'RFID blocking protection, slim bifold design with 8 card slots, ID window, and dual currency compartments.',
    category: 'Fashion',
    brand: 'UrbanCraft',
    price: 999,
    discount: 10,
    stock: 70,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
    rating: 4.8,
    reviewCount: 3
  },

  // Home & Kitchen (5)
  {
    name: 'Programmable Espresso Coffee Maker',
    description: '15-bar Italian pressure pump, built-in milk frother, digital touchscreen display, and automatic shutoff timer.',
    category: 'Home & Kitchen',
    brand: 'BrewMaster',
    price: 11999,
    discount: 18,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80',
    rating: 4.9,
    reviewCount: 5
  },
  {
    name: 'Non-Stick Ceramic Cookware Set 10-Piece',
    description: 'Eco-friendly PTFE/PFOA free ceramic non-stick coating, heavy-gauge aluminum core, and tempered glass lids.',
    category: 'Home & Kitchen',
    brand: 'ChefSelect',
    price: 7499,
    discount: 22,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&q=80',
    rating: 4.6,
    reviewCount: 3
  },
  {
    name: 'Digital Air Fryer 5.5L Capacity',
    description: 'Rapid air circulation technology for 85% less oil cooking, 8 preset cooking functions, and non-stick dishwasher-safe basket.',
    category: 'Home & Kitchen',
    brand: 'BrewMaster',
    price: 5999,
    discount: 15,
    stock: 28,
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80',
    rating: 4.7,
    reviewCount: 4
  },
  {
    name: 'Robotic Vacuum Cleaner with Mop',
    description: 'Smart LiDAR navigation, 3000Pa suction power, app control, auto-charging, and quiet brushless motor operation.',
    category: 'Home & Kitchen',
    brand: 'CleanBot',
    price: 18999,
    discount: 25,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80',
    rating: 4.8,
    reviewCount: 2
  },
  {
    name: 'Stainless Steel Insulated Water Bottle 1L',
    description: 'Double-wall vacuum insulation keeps drinks cold for 24h or hot for 12h, leak-proof spout lid, and powder coated finish.',
    category: 'Home & Kitchen',
    brand: 'HydroCool',
    price: 899,
    discount: 10,
    stock: 90,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80',
    rating: 4.6,
    reviewCount: 3
  },

  // Books (4)
  {
    name: 'Designing Data-Intensive Applications',
    description: 'The definitive guide to the architecture, storage engines, distributed data processing, and NoSQL systems by Martin Kleppmann.',
    category: 'Books',
    brand: 'OReilly Press',
    price: 1499,
    discount: 10,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
    rating: 4.95,
    reviewCount: 6
  },
  {
    name: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    description: 'Essential handbook by Robert C. Martin detailing principles of writing clean, maintainable, and robust software.',
    category: 'Books',
    brand: 'Prentice Hall',
    price: 1299,
    discount: 15,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80',
    rating: 4.85,
    reviewCount: 4
  },
  {
    name: 'MongoDB: The Definitive Guide (3rd Edition)',
    description: 'Comprehensive guide to managing MongoDB Atlas, aggregation pipelines, document indexing, and microservice integration.',
    category: 'Books',
    brand: 'OReilly Press',
    price: 1699,
    discount: 20,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
    rating: 4.9,
    reviewCount: 5
  },
  {
    name: 'Atomic Habits by James Clear',
    description: 'An easy and proven way to build good habits and break bad ones using behavioral psychology and practical frameworks.',
    category: 'Books',
    brand: 'Random House',
    price: 699,
    discount: 25,
    stock: 100,
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80',
    rating: 4.9,
    reviewCount: 6
  },

  // Sports (4)
  {
    name: 'Premium TPE Yoga Mat with Alignment Marks',
    description: 'Non-slip textured surface, 6mm thickness for knee joint cushioning, eco-friendly TPE material, and carrying strap.',
    category: 'Sports',
    brand: 'ZenFit',
    price: 1599,
    discount: 20,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80',
    rating: 4.6,
    reviewCount: 3
  },
  {
    name: 'Adjustable Dumbbell Set 20KG',
    description: 'Cast iron weight plates with spin-lock collars, anti-slip knurled chrome handles, and compact storage case.',
    category: 'Sports',
    brand: 'IronGrip',
    price: 4999,
    discount: 15,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80',
    rating: 4.7,
    reviewCount: 4
  },
  {
    name: 'Pro Tournament Basketball Size 7',
    description: 'Microfiber composite leather cover, deep channels for superior grip, suitable for both indoor hardwood and outdoor courts.',
    category: 'Sports',
    brand: 'CourtKing',
    price: 1999,
    discount: 10,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
    rating: 4.5,
    reviewCount: 2
  },
  {
    name: 'Resistance Exercise Loop Bands Set of 5',
    description: '100% natural latex bands with 5 varying resistance levels from light to heavy, complete with instruction guide and pouch.',
    category: 'Sports',
    brand: 'ZenFit',
    price: 699,
    discount: 30,
    stock: 75,
    image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&q=80',
    rating: 4.4,
    reviewCount: 3
  },

  // Beauty (3)
  {
    name: 'Organic Vitamin C Hydrating Face Serum',
    description: '20% active Vitamin C with hyaluronic acid and Vitamin E. Brightens skin tone, reduces fine lines, and promotes collagen.',
    category: 'Beauty',
    brand: 'GlowOrganics',
    price: 1199,
    discount: 25,
    stock: 65,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
    rating: 4.8,
    reviewCount: 4
  },
  {
    name: 'Ionic Hair Dryer Professional 2000W',
    description: 'Negative ion generator reduces frizz, 3 heat settings, 2 speed controls, cool shot button, and concentrator nozzle.',
    category: 'Beauty',
    brand: 'StylePro',
    price: 2999,
    discount: 20,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
    rating: 4.5,
    reviewCount: 2
  },
  {
    name: 'Natural Botanical Body Wash 500ml',
    description: 'Sulfates and parabens free shower gel with aloe vera extract, tea tree oil, and refreshing lavender fragrance.',
    category: 'Beauty',
    brand: 'GlowOrganics',
    price: 499,
    discount: 10,
    stock: 80,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
    rating: 4.6,
    reviewCount: 3
  },

  // Accessories (3)
  {
    name: 'Waterproof Laptop Backpack 15.6 Inch',
    description: 'Multi-compartment storage with padded laptop sleeve, external USB charging port, anti-theft back pocket, and luggage strap.',
    category: 'Accessories',
    brand: 'TravelEase',
    price: 2199,
    discount: 15,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    rating: 4.7,
    reviewCount: 4
  },
  {
    name: 'High-Speed 65W GaN Fast Charger',
    description: 'Compact 3-port USB-C and USB-A power adapter compatible with laptops, smartphones, tablets, and handheld consoles.',
    category: 'Accessories',
    brand: 'PowerPulse',
    price: 1899,
    discount: 10,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80',
    rating: 4.8,
    reviewCount: 3
  },
  {
    name: 'Leather Executive Desk Pad Mat',
    description: 'Dual-sided waterproof PU leather desk blotter, smooth mouse gliding surface, 80x40cm size, easy to clean with cloth.',
    category: 'Accessories',
    brand: 'UrbanCraft',
    price: 799,
    discount: 20,
    stock: 60,
    image: 'https://images.unsplash.com/photo-1616440342855-546a9a3b6324?w=800&q=80',
    rating: 4.6,
    reviewCount: 2
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing existing database collections...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});
    await Payment.deleteMany({});
    await Review.deleteMany({});

    console.log('👤 Seeding 2 Admins & 10 Customers...');
    const createdUsers = [];
    for (const u of sampleUsers) {
      const passwordHash = await User.hashPassword(u.password);
      const user = await User.create({
        name: u.name,
        email: u.email,
        passwordHash,
        phone: u.phone,
        address: u.address,
        city: u.city,
        state: u.state,
        pincode: u.pincode,
        role: u.role
      });
      createdUsers.push(user);
    }

    const customers = createdUsers.filter((u) => u.role === 'customer');

    console.log('📦 Seeding 30 Products across 7 Categories...');
    const createdProducts = await Product.insertMany(sampleProducts);

    console.log('🛒 Creating empty Carts for all customers...');
    for (const c of customers) {
      await Cart.create({ userId: c._id, items: [], totalAmount: 0 });
    }

    console.log('📑 Seeding 15 Orders & 15 Payments...');
    const orderStatuses = ['Delivered', 'Delivered', 'Shipped', 'Confirmed', 'Pending'];
    const paymentMethods = ['UPI', 'Card', 'Cash on Delivery'];

    for (let i = 0; i < 15; i++) {
      const customer = customers[i % customers.length];
      const p1 = createdProducts[i % createdProducts.length];
      const p2 = createdProducts[(i + 5) % createdProducts.length];

      const price1 = p1.discount > 0 ? Math.round(p1.price * (1 - p1.discount / 100)) : p1.price;
      const price2 = p2.discount > 0 ? Math.round(p2.price * (1 - p2.discount / 100)) : p2.price;

      const q1 = (i % 2) + 1;
      const q2 = (i % 3) + 1;

      const totalAmount = price1 * q1 + price2 * q2;
      const status = orderStatuses[i % orderStatuses.length];
      const method = paymentMethods[i % paymentMethods.length];

      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - (15 - i) * 5);

      const order = await Order.create({
        userId: customer._id,
        items: [
          { productId: p1._id, productName: p1.name, quantity: q1, price: price1 },
          { productId: p2._id, productName: p2.name, quantity: q2, price: price2 }
        ],
        shippingAddress: {
          name: customer.name,
          phone: customer.phone,
          address: customer.address,
          city: customer.city,
          state: customer.state,
          pincode: customer.pincode
        },
        totalAmount,
        paymentMethod: method,
        paymentStatus: status === 'Delivered' || method !== 'Cash on Delivery' ? 'Paid' : 'Pending',
        orderStatus: status,
        createdAt: orderDate,
        orderDate
      });

      const txnId = 'TXN-' + (100000 + i * 876) + '-' + Math.floor(1000 + Math.random() * 9000);
      await Payment.create({
        orderId: order._id,
        userId: customer._id,
        amount: totalAmount,
        paymentMethod: method,
        paymentStatus: order.paymentStatus === 'Paid' ? 'Completed' : 'Pending',
        transactionId: txnId,
        paymentDate: orderDate,
        createdAt: orderDate
      });
    }

    console.log('⭐ Seeding 30 Reviews...');
    const commentsList = [
      'Absolutely loved this product! Outstanding build quality and lightning fast delivery.',
      'Super satisfied with my purchase. Exactly as described.',
      'Decent value for money. Performs well and meets all my everyday requirements.',
      'Highly recommended! Excellent craftsmanship and great customer support.',
      'Works like a charm. Would definitely purchase again from this store.',
      'Top notch quality! Exceeded my expectations.'
    ];

    for (let i = 0; i < 30; i++) {
      const prod = createdProducts[i % createdProducts.length];
      const cust = customers[i % customers.length];
      const rating = 4 + (i % 2);
      const comment = commentsList[i % commentsList.length];

      try {
        await Review.create({
          productId: prod._id,
          userId: cust._id,
          rating,
          comment
        });
      } catch (err) {}
    }

    console.log('\n✅ DATABASE SEEDING COMPLETED SUCCESSFULLY TO MONGODB ATLAS!');
    console.log('----------------------------------------------------');
    console.log('🔑 ADMIN LOGIN CREDENTIALS:');
    console.log('   Email: admin@shopmongo.com | Password: adminpassword123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedDatabase();
