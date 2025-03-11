const Payment = require('../models/payment.model');

// Mock payment processing function
const mockProcessPayment = (paymentData) => {
  const { amount, paymentMethod } = paymentData;
  // Simulate payment processing
  const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  
  // Simulate success/failure (95% success rate for demo purposes)
  const isSuccess = Math.random() > 0.05;
  
  return {
    transactionId,
    status: isSuccess ? 'completed' : 'failed',
  };
};

// Mock refund processing function
const mockProcessRefund = (paymentData) => {
  const { transactionId } = paymentData;
  // Simulate refund processing (always succeeds for demo)
  return {
    transactionId,
    status: 'refunded',
  };
};

// Process a payment
exports.processPayment = async (req, res) => {
  try {
    const { amount, currency, paymentMethod, orderId, description } = req.body;
    if (!amount || !currency || !paymentMethod || !orderId || !description) {
      return res.status(400).json({ message: 'Missing required payment details' });
    }
    // Mock successful payment response
    const paymentResult = {
      transactionId: `txn_${Date.now()}`,
      status: 'completed', // or 'failed' for testing
    };
    res.status(200).json(paymentResult);
  } catch (error) {
    console.error('Payment processing error:', error.message);
    res.status(500).json({ message: 'Payment processing failed', error: error.message });
  }
};
// Process a refund
exports.processRefund = async (req, res) => {
  try {
    const { transactionId, amount, reason } = req.body;
    const userId = req.user.id;

    if (!transactionId || !amount) {
      return res.status(400).json({ message: 'Transaction ID and amount are required' });
    }

    // Find payment
    const payment = await Payment.findOne({ transactionId, userId });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.status === 'refunded') {
      return res.status(400).json({ message: 'Payment already refunded' });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({ message: 'Only completed payments can be refunded' });
    }

    if (payment.amount < amount) {
      return res.status(400).json({ message: 'Refund amount exceeds original payment' });
    }

    // Mock refund processing
    const refundResult = mockProcessRefund({ transactionId });
    payment.status = refundResult.status;

    await payment.save();

    res.status(200).json({
      message: 'Refund processed successfully',
      payment: {
        transactionId: payment.transactionId,
        status: payment.status,
      },
    });
  } catch (error) {
    console.error('Refund processing error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's payment history (optional)
exports.getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const payments = await Payment.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ payments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin: Get all payments (optional)
exports.getAllPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const total = await Payment.countDocuments(filter);
    const payments = await Payment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      payments,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};