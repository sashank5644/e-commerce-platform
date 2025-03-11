const Order = require('../models/order.model');
const axios = require('axios');

// Service URLs
const CART_SERVICE_URL = process.env.CART_SERVICE_URL || 'http://localhost:3004/api/carts';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3003/api/products';
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://localhost:3006/api/payments';

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    const userId = req.user.id;
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: 'Shipping address and payment method are required' });
    }

    // Normalize paymentMethod to match schema enum
    const normalizedPaymentMethod = paymentMethod.toLowerCase().replace(' ', '_');
    if (!['credit_card', 'paypal', 'mock'].includes(normalizedPaymentMethod)) {
      return res.status(400).json({ message: `Invalid payment method: ${paymentMethod}. Must be one of 'credit_card', 'paypal', or 'mock'` });
    }

    // Validate shippingAddress structure (optional, schema will enforce this)
    if (!shippingAddress.fullName || !shippingAddress.addressLine1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode || !shippingAddress.phone) {
      return res.status(400).json({ message: 'Shipping address is incomplete. Required fields: fullName, addressLine1, city, state, postalCode, phone' });
    }

    // Fetch cart data
    let cartResponse;
    try {
      cartResponse = await axios.get(`${CART_SERVICE_URL}/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
    } catch (error) {
      console.error(`Failed to fetch cart for user ${userId}:`, error.message);
      return res.status(500).json({ message: 'Failed to retrieve cart', error: error.message });
    }

    const cart = cartResponse.data.cart;
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate totals
    const subtotal = cart.totalAmount;
    const tax = subtotal * 0.1; // 10% tax as an example
    const shippingCost = 5.99; // Flat rate as an example
    const total = subtotal + tax + shippingCost;

    // Create order
    const order = new Order({
      userId,
      items: cart.items,
      shippingAddress,
      paymentInfo: { method: normalizedPaymentMethod, status: 'pending' },
      subtotal,
      tax,
      shippingCost,
      total,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // Process payment
    let paymentResult;
    try {
      const paymentPayload = {
        amount: order.total,
        currency: 'USD',
        paymentMethod: normalizedPaymentMethod,
        orderId: order._id,
        description: `Payment for order ${order._id}`,
      };
      const paymentResponse = await axios.post(`${PAYMENT_SERVICE_URL}/api/payments`, paymentPayload, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      paymentResult = paymentResponse.data;
    } catch (error) {
      console.error(`Payment failed for order ${order._id}:`, error.message);
      order.paymentInfo.status = 'failed';
      order.status = 'pending'; // Allow manual review if payment fails
      await order.save();
      return res.status(500).json({ message: 'Payment processing failed', error: error.message });
    }

    order.paymentInfo.transactionId = paymentResult.transactionId;
    order.paymentInfo.status = paymentResult.status;

    if (paymentResult.status === 'completed') {
      order.status = 'processing';
      try {
        const inventoryItems = order.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        }));
        await axios.put(`${PRODUCT_SERVICE_URL}/inventory/batch`, { items: inventoryItems }, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        await axios.delete(`${CART_SERVICE_URL}/`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
      } catch (error) {
        console.error(`Inventory or cart clear failed for order ${order._id}:`, error.message);
        order.status = 'pending'; // Rollback to pending if inventory update fails
        await order.save();
        return res.status(500).json({ message: 'Failed to update inventory or clear cart', error: error.message });
      }
    } else {
      order.status = 'cancelled';
    }

    await order.save();
    res.status(201).json({ order });
  } catch (error) {
    console.error(`Create order error for user ${req.user.id}:`, error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's orders
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;
    const token = req.header('Authorization')?.replace('Bearer ', '');

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (['shipped', 'delivered'].includes(order.status)) {
      return res.status(400).json({ message: 'Cannot cancel shipped or delivered order' });
    }

    order.status = 'cancelled';
    if (order.paymentInfo.status === 'completed') {
      const refundPayload = {
        transactionId: order.paymentInfo.transactionId,
        amount: order.total,
        reason: 'Order cancelled',
      };
      await axios.post(`${PAYMENT_SERVICE_URL}/api/payments/refund`, refundPayload, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      order.paymentInfo.status = 'refunded';
    }

    await order.save();
    res.status(200).json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin: Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      orders,
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

// Admin: Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status || order.status;
    if (trackingNumber) order.trackingNumber = trackingNumber;

    await order.save();
    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};