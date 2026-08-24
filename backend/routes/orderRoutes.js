const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .post(createOrder)
  .get(getMyOrders);

router.get('/:id', getOrderById);
router.put('/:id/status', adminOnly, updateOrderStatus);

module.exports = router;
