const Review = require('../models/Review');
const Product = require('../models/Product');

// Helper to recalculate average product rating and review count
const updateProductRating = async (productId) => {
  const reviews = await Review.find({ productId });

  if (reviews.length === 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: 0,
      reviewCount: 0
    });
  } else {
    const totalRating = reviews.reduce((acc, item) => acc + item.rating, 0);
    const avgRating = Math.round((totalRating / reviews.length) * 10) / 10;

    await Product.findByIdAndUpdate(productId, {
      rating: avgRating,
      reviewCount: reviews.length
    });
  }
};

// @desc    Get reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add review for a product
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    if (!comment) {
      return res.status(400).json({ success: false, message: 'Please add a comment' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user already reviewed this product
    const alreadyReviewed = await Review.findOne({
      productId,
      userId: req.user._id
    });

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      productId,
      userId: req.user._id,
      rating: Number(rating),
      comment
    });

    await updateProductRating(productId);

    const populatedReview = await Review.findById(review._id).populate('userId', 'name');

    res.status(201).json({ success: true, review: populatedReview, message: 'Review submitted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete review (Admin or owner)
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (req.user.role !== 'admin' && review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    const productId = review.productId;
    await review.deleteOne();

    await updateProductRating(productId);

    res.json({ success: true, message: 'Review removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProductReviews,
  createReview,
  deleteReview
};
