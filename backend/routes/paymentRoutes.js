const express = require('express');
const router = express.Router();
const { getPaymentByOrderId, getAllPayments } = require('../controllers/paymentController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/order/:orderId', getPaymentByOrderId);
router.get('/', adminOnly, getAllPayments);

module.exports = router;
