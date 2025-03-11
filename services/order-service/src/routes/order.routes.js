const express = require('express');
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware.authenticate);

// User routes
router.post('/', orderController.createOrder);
router.get('/user', orderController.getUserOrders);
router.get('/:id', orderController.getOrderById);
router.post('/:id/cancel', orderController.cancelOrder);

// Admin routes
router.get('/', authMiddleware.authorizeAdmin, orderController.getAllOrders);
router.put('/:id/status', authMiddleware.authorizeAdmin, orderController.updateOrderStatus);

module.exports = router;