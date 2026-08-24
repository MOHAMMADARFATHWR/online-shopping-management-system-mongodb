const Product = require('../models/Product');
const mongoose = require('mongoose');

const defaultProducts = [
  // Electronics
  {
    _id: '65f1a2b3c4d5e6f7a8b9c0d1',
    name: 'Wireless Noise Canceling Headphones',
    description: 'Immersive sound quality with active noise cancellation, 30-hour battery life, and ultra-soft memory foam earcups.',
    category: 'Electronics',
    brand: 'AudioPhonic',
    price: 14999,
    discount: 15,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    rating: 4.8,
    reviewCount: 24
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c0d2',
    name: 'Ultra-Slim Smartwatch Pro 5',
    description: 'AMOLED display, GPS tracking, heart rate monitor, sleep analysis, and water resistance up to 50 meters.',
    category: 'Electronics',
    brand: 'TechGear',
    price: 8999,
    discount: 20,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    rating: 4.5,
    reviewCount: 18
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c0d3',
    name: 'Mechanical Gaming Keyboard RGB',
    description: 'Tactile blue switches, customizable per-key RGB backlighting, durable aluminum top plate, and detachable USB-C cable.',
    category: 'Electronics',
    brand: 'CyberKeys',
    price: 4500,
    discount: 10,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
    rating: 4.7,
    reviewCount: 32
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c0d4',
    name: '4K Ultra HD Streaming Camera',
    description: 'Crystal clear 4K resolution, dual stereo microphones, auto-focus lens, and privacy shutter for streaming and conferencing.',
    category: 'Electronics',
    brand: 'VisionPlus',
    price: 6200,
    discount: 5,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
    rating: 4.3,
    reviewCount: 12
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c0d5',
    name: 'Portable Bluetooth Speaker Max',
    description: 'Deep bass sound output, IPX7 waterproof rating, 24-hour continuous playtime, and built-in power bank capability.',
    category: 'Electronics',
    brand: 'SoundBoom',
    price: 3499,
    discount: 12,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
    rating: 4.6,
    reviewCount: 29
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c0d6',
    name: 'Ergonomic Wireless Gaming Mouse',
    description: '16,000 DPI optical sensor, ultra-lightweight design, zero-latency wireless connectivity, and customizable side buttons.',
    category: 'Electronics',
    brand: 'CyberKeys',
    price: 2999,
    discount: 10,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
    rating: 4.4,
    reviewCount: 15
  },

  // Fashion
  {
    _id: '65f1a2b3c4d5e6f7a8b9c0d7',
    name: 'Classic Men Denim Jacket',
    description: '100% premium cotton denim jacket with standard fit, button front closure, and button-flap chest pockets.',
    category: 'Fashion',
    brand: 'UrbanCraft',
    price: 2999,
    discount: 25,
    stock: 60,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80',
    rating: 4.6,
    reviewCount: 22
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c0d8',
    name: 'Women Floral Summer Midi Dress',
    description: 'Lightweight breathable rayon fabric, attractive A-line silhouette, square neckline, and comfortable puff sleeves.',
    category: 'Fashion',
    brand: 'VogueStyle',
    price: 1899,
    discount: 15,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
    rating: 4.7,
    reviewCount: 19
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c0d9',
    name: 'Casual Canvas Sneakers Sport',
    description: 'Versatile low-top lace-up sneakers featuring cushioned insoles, flexible rubber outsoles, and durable canvas upper.',
    category: 'Fashion',
    brand: 'StepEasy',
    price: 2499,
    discount: 20,
    stock: 55,
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80',
    rating: 4.5,
    reviewCount: 27
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c0da',
    name: 'Polarized Aviator Sunglasses',
    description: 'UV400 protection coating, lightweight metal frame, scratch-resistant tac lenses, and comfortable silicone nose pads.',
    category: 'Fashion',
    brand: 'SunGazer',
    price: 1299,
    discount: 30,
    stock: 80,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
    rating: 4.4,
    reviewCount: 14
  },

  // Home & Kitchen
  {
    _id: '65f1a2b3c4d5e6f7a8b9c0db',
    name: 'Programmable Espresso Coffee Maker',
    description: '15-bar Italian pressure pump, built-in milk frother, digital touchscreen display, and automatic shutoff timer.',
    category: 'Home & Kitchen',
    brand: 'BrewMaster',
    price: 11999,
    discount: 18,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80',
    rating: 4.9,
    reviewCount: 41
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c0dc',
    name: 'Non-Stick Ceramic Cookware Set 10-Piece',
    description: 'Eco-friendly PTFE/PFOA free ceramic non-stick coating, heavy-gauge aluminum core, and tempered glass lids.',
    category: 'Home & Kitchen',
    brand: 'ChefSelect',
    price: 7499,
    discount: 22,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&q=80',
    rating: 4.6,
    reviewCount: 16
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c0dd',
    name: 'Digital Air Fryer 5.5L Capacity',
    description: 'Rapid air circulation technology for 85% less oil cooking, 8 preset cooking functions, and non-stick dishwasher-safe basket.',
    category: 'Home & Kitchen',
    brand: 'BrewMaster',
    price: 5999,
    discount: 15,
    stock: 28,
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80',
    rating: 4.7,
    reviewCount: 35
  },

  // Books
  {
    _id: '65f1a2b3c4d5e6f7a8b9c0de',
    name: 'Designing Data-Intensive Applications',
    description: 'The definitive guide to the architecture, storage engines, distributed data processing, and NoSQL systems by Martin Kleppmann.',
    category: 'Books',
    brand: 'OReilly Press',
    price: 1499,
    discount: 10,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
    rating: 4.95,
    reviewCount: 58
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c0df',
    name: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    description: 'Essential handbook by Robert C. Martin detailing principles of writing clean, maintainable, and robust software.',
    category: 'Books',
    brand: 'Prentice Hall',
    price: 1299,
    discount: 15,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80',
    rating: 4.85,
    reviewCount: 42
  },

  // Sports
  {
    _id: '65f1a2b3c4d5e6f7a8b9c0e0',
    name: 'Premium TPE Yoga Mat with Alignment Marks',
    description: 'Non-slip textured surface, 6mm thickness for knee joint cushioning, eco-friendly TPE material, and carrying strap.',
    category: 'Sports',
    brand: 'ZenFit',
    price: 1599,
    discount: 20,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80',
    rating: 4.6,
    reviewCount: 20
  },

  // Beauty
  {
    _id: '65f1a2b3c4d5e6f7a8b9c0e1',
    name: 'Organic Vitamin C Hydrating Face Serum',
    description: '20% active Vitamin C with hyaluronic acid and Vitamin E. Brightens skin tone, reduces fine lines, and promotes collagen.',
    category: 'Beauty',
    brand: 'GlowOrganics',
    price: 1199,
    discount: 25,
    stock: 65,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
    rating: 4.8,
    reviewCount: 31
  },

  // Accessories
  {
    _id: '65f1a2b3c4d5e6f7a8b9c0e2',
    name: 'Waterproof Laptop Backpack 15.6 Inch',
    description: 'Multi-compartment storage with padded laptop sleeve, external USB charging port, anti-theft back pocket, and luggage strap.',
    category: 'Accessories',
    brand: 'TravelEase',
    price: 2199,
    discount: 15,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    rating: 4.7,
    reviewCount: 26
  }
];

// Helper to filter and sort default catalog instantly
const getInstantCatalog = (req) => {
  const { search, category, minPrice, maxPrice, rating, sort, page = 1, limit = 12 } = req.query;
  let result = [...defaultProducts];

  if (search) {
    const s = search.toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(s) || p.brand.toLowerCase().includes(s) || p.category.toLowerCase().includes(s));
  }

  if (category && category !== 'All') {
    result = result.filter(p => p.category === category);
  }

  if (minPrice) result = result.filter(p => p.price >= Number(minPrice));
  if (maxPrice) result = result.filter(p => p.price <= Number(maxPrice));
  if (rating) result = result.filter(p => p.rating >= Number(rating));

  if (sort === 'price_asc') result.sort((a, b) => a.price - b.price);
  else if (sort === 'price_desc') result.sort((a, b) => b.price - a.price);
  else if (sort === 'rating_desc') result.sort((a, b) => b.rating - a.rating);
  else if (sort === 'popular') result.sort((a, b) => b.reviewCount - a.reviewCount);

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;
  const paginated = result.slice(skip, skip + limitNum);

  return {
    success: true,
    count: paginated.length,
    total: result.length,
    page: pageNum,
    pages: Math.ceil(result.length / limitNum) || 1,
    products: paginated
  };
};

// @desc    Get all products with filtering, search, sorting & pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  // If DB is not connected, respond INSTANTLY (<5ms)
  if (mongoose.connection.readyState !== 1) {
    return res.json(getInstantCatalog(req));
  }

  try {
    const { search, category, minPrice, maxPrice, rating, sort, page = 1, limit = 12 } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { price: 1 };
    else if (sort === 'price_desc') sortOptions = { price: -1 };
    else if (sort === 'rating_desc') sortOptions = { rating: -1 };
    else if (sort === 'popular') sortOptions = { reviewCount: -1 };

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    let total = await Product.countDocuments(query);
    let products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    if (products.length === 0 && !search && (!category || category === 'All')) {
      return res.json(getInstantCatalog(req));
    }

    res.json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      products
    });
  } catch (error) {
    res.json(getInstantCatalog(req));
  }
};

// @desc    Get single product details
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const product = defaultProducts.find(p => p._id === req.params.id || p.name.toLowerCase().includes(req.params.id.toLowerCase())) || defaultProducts[0];
    return res.json({ success: true, product });
  }

  try {
    let product;
    try {
      product = await Product.findById(req.params.id);
    } catch (e) {}

    if (!product) {
      product = defaultProducts.find(p => p._id === req.params.id || p.name.toLowerCase().includes(req.params.id.toLowerCase()));
    }

    if (product) {
      res.json({ success: true, product });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    const fallback = defaultProducts.find(p => p._id === req.params.id) || defaultProducts[0];
    res.json({ success: true, product: fallback });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, description, category, brand, price, discount, stock, image } = req.body;

    const product = new Product({
      name,
      description,
      category,
      brand,
      price,
      discount: discount || 0,
      stock: stock || 0,
      image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'
    });

    const createdProduct = await product.save();
    res.status(201).json({ success: true, product: createdProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { name, description, category, brand, price, discount, stock, image } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.price = price !== undefined ? price : product.price;
      product.discount = discount !== undefined ? discount : product.discount;
      product.stock = stock !== undefined ? stock : product.stock;
      product.image = image || product.image;

      const updatedProduct = await product.save();
      res.json({ success: true, product: updatedProduct });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ success: true, message: 'Product removed successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
