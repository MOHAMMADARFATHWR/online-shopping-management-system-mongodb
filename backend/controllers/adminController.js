const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Review = require('../models/Review');

// @desc    Get Admin Dashboard Stats via MongoDB Aggregation Pipelines
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // Basic counts
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // 1. Total Revenue Aggregation
    const revenueAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    // 2. Orders by Status Aggregation Pipeline
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
      { $project: { status: '$_id', count: 1, _id: 0 } }
    ]);

    // 3. Monthly Revenue Pipeline ($group by year-month)
    const monthlyRevenue = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          ordersCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          month: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              {
                $cond: [
                  { $lt: ['$_id.month', 10] },
                  { $concat: ['0', { $toString: '$_id.month' }] },
                  { $toString: '$_id.month' }
                ]
              }
            ]
          },
          revenue: 1,
          ordersCount: 1,
          _id: 0
        }
      }
    ]);

    // 4. Revenue & Sales by Category Pipeline ($unwind items, $lookup products)
    const categoryRevenue = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $group: {
          _id: '$productDetails.category',
          totalSales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          totalQuantity: { $sum: '$items.quantity' }
        }
      },
      { $project: { category: '$_id', totalSales: 1, totalQuantity: 1, _id: 0 } },
      { $sort: { totalSales: -1 } }
    ]);

    // 5. Top Selling Products Pipeline
    const topProducts = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          productName: { $first: '$items.productName' },
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      { $project: { productId: '$_id', productName: 1, totalSold: 1, totalRevenue: 1, _id: 0 } }
    ]);

    // 6. Average Product Rating Aggregation
    const avgRatingAgg = await Product.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    const avgRating = avgRatingAgg.length > 0 ? Math.round(avgRatingAgg[0].avgRating * 10) / 10 : 0;

    res.json({
      success: true,
      stats: {
        totalCustomers,
        totalProducts,
        totalOrders,
        totalRevenue,
        avgRating
      },
      charts: {
        monthlyRevenue,
        categoryRevenue,
        ordersByStatus,
        topProducts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all customers with order counts and spending (Admin)
// @route   GET /api/admin/customers
// @access  Private/Admin
const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.aggregate([
      { $match: { role: 'customer' } },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'userId',
          as: 'customerOrders'
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          phone: 1,
          city: 1,
          state: 1,
          createdAt: 1,
          orderCount: { $size: '$customerOrders' },
          totalSpent: {
            $reduce: {
              input: '$customerOrders',
              initialValue: 0,
              in: { $add: ['$$value', '$$this.totalAmount'] }
            }
          }
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    res.json({ success: true, count: customers.length, customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders for admin
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all reviews for admin moderation
// @route   GET /api/admin/reviews
// @access  Private/Admin
const getAllReviewsAdmin = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'name email')
      .populate('productId', 'name image category')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllCustomers,
  getAllOrdersAdmin,
  getAllReviewsAdmin
};
