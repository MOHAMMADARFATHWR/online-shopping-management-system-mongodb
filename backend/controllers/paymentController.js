const Payment = require('../models/Payment');

// @desc    Get payment details by Order ID
// @route   GET /api/payments/order/:orderId
// @access  Private
const getPaymentByOrderId = async (req, res) => {
  try {
    const payment = await Payment.findOne({ orderId: req.params.orderId })
      .populate('userId', 'name email')
      .populate('orderId');

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    res.json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all payments (Admin)
// @route   GET /api/payments
// @access  Private/Admin
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('userId', 'name email')
      .populate('orderId')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: payments.length, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPaymentByOrderId,
  getAllPayments
};
