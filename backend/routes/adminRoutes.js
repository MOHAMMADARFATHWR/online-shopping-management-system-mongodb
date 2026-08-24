const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllCustomers,
  getAllOrdersAdmin,
  getAllReviewsAdmin
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/customers', getAllCustomers);
router.get('/orders', getAllOrdersAdmin);
router.get('/reviews', getAllReviewsAdmin);

module.exports = router;
