const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'Please add a description']
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['Electronics', 'Fashion', 'Home & Kitchen', 'Books', 'Sports', 'Beauty', 'Accessories'],
      index: true
    },
    brand: {
      type: String,
      required: [true, 'Please specify a brand'],
      default: 'Generic'
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price must be positive']
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount must be positive'],
      max: [100, 'Discount cannot exceed 100%']
    },
    stock: {
      type: Number,
      required: [true, 'Please add stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Compound index for category and price queries
productSchema.index({ category: 1, price: 1 });

module.exports = mongoose.model('Product', productSchema);
