const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');

const defaultProducts = [
  { _id: '65f1a2b3c4d5e6f7a8b9c0d1', name: 'Wireless Noise Canceling Headphones', price: 14999, discount: 15, stock: 45, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80' },
  { _id: '65f1a2b3c4d5e6f7a8b9c0d2', name: 'Ultra-Slim Smartwatch Pro 5', price: 8999, discount: 20, stock: 30, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80' },
  { _id: '65f1a2b3c4d5e6f7a8b9c0d3', name: 'Mechanical Gaming Keyboard RGB', price: 4500, discount: 10, stock: 25, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80' },
  { _id: '65f1a2b3c4d5e6f7a8b9c0d4', name: '4K Ultra HD Streaming Camera', price: 6200, discount: 5, stock: 18, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80' },
  { _id: '65f1a2b3c4d5e6f7a8b9c0d5', name: 'Portable Bluetooth Speaker Max', price: 3499, discount: 12, stock: 50, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80' },
  { _id: '65f1a2b3c4d5e6f7a8b9c0d6', name: 'Ergonomic Wireless Gaming Mouse', price: 2999, discount: 10, stock: 40, image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80' },
  { _id: '65f1a2b3c4d5e6f7a8b9c0d7', name: 'Classic Men Denim Jacket', price: 2999, discount: 25, stock: 60, image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80' },
  { _id: '65f1a2b3c4d5e6f7a8b9c0d8', name: 'Women Floral Summer Midi Dress', price: 1899, discount: 15, stock: 35, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80' },
  { _id: '65f1a2b3c4d5e6f7a8b9c0d9', name: 'Casual Canvas Sneakers Sport', price: 2499, discount: 20, stock: 55, image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80' },
  { _id: '65f1a2b3c4d5e6f7a8b9c0da', name: 'Polarized Aviator Sunglasses', price: 1299, discount: 30, stock: 80, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80' },
  { _id: '65f1a2b3c4d5e6f7a8b9c0db', name: 'Programmable Espresso Coffee Maker', price: 11999, discount: 18, stock: 20, image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80' },
  { _id: '65f1a2b3c4d5e6f7a8b9c0de', name: 'Designing Data-Intensive Applications', price: 1499, discount: 10, stock: 50, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80' },
  { _id: '65f1a2b3c4d5e6f7a8b9c0e0', name: 'Premium TPE Yoga Mat with Alignment Marks', price: 1599, discount: 20, stock: 40, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80' },
  { _id: '65f1a2b3c4d5e6f7a8b9c0e1', name: 'Organic Vitamin C Hydrating Face Serum', price: 1199, discount: 25, stock: 65, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80' },
  { _id: '65f1a2b3c4d5e6f7a8b9c0e2', name: 'Waterproof Laptop Backpack 15.6 Inch', price: 2199, discount: 15, stock: 50, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80' }
];

// In-memory carts fallback
const inMemoryCarts = {};

const calculateTotal = (items) => {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
};

// Helper to resolve product
const findProduct = async (productId) => {
  let product = null;
  if (mongoose.connection.readyState === 1) {
    try {
      product = await Product.findById(productId);
    } catch (e) {}
  }
  if (!product) {
    product = defaultProducts.find(p => p._id === productId || p._id.toString() === productId?.toString());
  }
  return product;
};

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  const userId = req.user._id.toString();

  if (mongoose.connection.readyState === 1) {
    try {
      let cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
      if (!cart) {
        cart = await Cart.create({ userId: req.user._id, items: [], totalAmount: 0 });
      }
      return res.json({ success: true, cart });
    } catch (e) {}
  }

  // Fallback in-memory cart
  if (!inMemoryCarts[userId]) {
    inMemoryCarts[userId] = { userId, items: [], totalAmount: 0 };
  }
  res.json({ success: true, cart: inMemoryCarts[userId] });
};

// @desc    Add product to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user._id.toString();

    const product = await findProduct(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const finalPrice = product.discount > 0 
      ? Math.round(product.price * (1 - product.discount / 100))
      : product.price;

    if (mongoose.connection.readyState === 1) {
      try {
        let cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
          cart = new Cart({ userId: req.user._id, items: [], totalAmount: 0 });
        }

        const itemIndex = cart.items.findIndex(
          (item) => item.productId.toString() === productId.toString()
        );

        if (itemIndex > -1) {
          cart.items[itemIndex].quantity += Number(quantity);
          cart.items[itemIndex].price = finalPrice;
        } else {
          cart.items.push({
            productId: product._id,
            productName: product.name,
            quantity: Number(quantity),
            price: finalPrice
          });
        }

        cart.totalAmount = calculateTotal(cart.items);
        await cart.save();
        return res.json({ success: true, cart, message: `${product.name} added to cart!` });
      } catch (e) {}
    }

    // In-memory fallback cart handling
    if (!inMemoryCarts[userId]) {
      inMemoryCarts[userId] = { userId, items: [], totalAmount: 0 };
    }
    const memCart = inMemoryCarts[userId];

    const idx = memCart.items.findIndex(i => i.productId.toString() === productId.toString());
    if (idx > -1) {
      memCart.items[idx].quantity += Number(quantity);
    } else {
      memCart.items.push({
        _id: 'mem_item_' + Date.now() + Math.random().toString(36).substring(2, 5),
        productId: product._id,
        productName: product.name,
        quantity: Number(quantity),
        price: finalPrice
      });
    }
    memCart.totalAmount = calculateTotal(memCart.items);

    res.json({ success: true, cart: memCart, message: `${product.name} added to cart!` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;
    const userId = req.user._id.toString();

    if (quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const cart = await Cart.findOne({ userId: req.user._id });
        if (cart) {
          const item = cart.items.id(itemId);
          if (item) {
            item.quantity = Number(quantity);
            cart.totalAmount = calculateTotal(cart.items);
            await cart.save();
            return res.json({ success: true, cart });
          }
        }
      } catch (e) {}
    }

    // Fallback in-memory
    const memCart = inMemoryCarts[userId] || { userId, items: [], totalAmount: 0 };
    const item = memCart.items.find(i => i._id.toString() === itemId.toString());
    if (item) {
      item.quantity = Number(quantity);
    }
    memCart.totalAmount = calculateTotal(memCart.items);

    res.json({ success: true, cart: memCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id.toString();

    if (mongoose.connection.readyState === 1) {
      try {
        const cart = await Cart.findOne({ userId: req.user._id });
        if (cart) {
          cart.items = cart.items.filter((item) => item._id.toString() !== itemId.toString());
          cart.totalAmount = calculateTotal(cart.items);
          await cart.save();
          return res.json({ success: true, cart, message: 'Item removed from cart' });
        }
      } catch (e) {}
    }

    const memCart = inMemoryCarts[userId] || { userId, items: [], totalAmount: 0 };
    memCart.items = memCart.items.filter(i => i._id.toString() !== itemId.toString());
    memCart.totalAmount = calculateTotal(memCart.items);

    res.json({ success: true, cart: memCart, message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    if (mongoose.connection.readyState === 1) {
      try {
        const cart = await Cart.findOne({ userId: req.user._id });
        if (cart) {
          cart.items = [];
          cart.totalAmount = 0;
          await cart.save();
        }
      } catch (e) {}
    }

    inMemoryCarts[userId] = { userId, items: [], totalAmount: 0 };

    res.json({ success: true, message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
};
