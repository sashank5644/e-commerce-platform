const express = require('express');
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware.authenticate);

router.post('/api/payments', paymentController.processPayment);

// Process a payment
router.post('/', paymentController.processPayment);

// Process a refund
router.post('/refund', paymentController.processRefund);

// Get user's payment history
router.get('/history', paymentController.getPaymentHistory);

// Admin: Get all payments
router.get('/', authMiddleware.authorizeAdmin, paymentController.getAllPayments);

module.exports = router;