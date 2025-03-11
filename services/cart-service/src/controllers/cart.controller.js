// cart-service/src/controllers/cart.controller.js
const Cart = require('../models/cart.model');
const axios = require('axios');

// Service URLs
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3003/api/products';

// Get cart by user ID
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      // Create a new empty cart if one doesn't exist
      cart = new Cart({
        userId,
        items: [],
        totalAmount: 0
      });
      await cart.save();
    }
    
    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    console.log('addToCart request received:', req.body, 'User:', req.user.id);
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;
    
    if (!productId) {
      return res.status(400).json({ message: 'ProductId is required' });
    }
    
    try {
      console.log(`Requesting product from ${PRODUCT_SERVICE_URL}/${productId} with token: ${req.header('Authorization')?.replace('Bearer ', '') || 'No token'}`);
      const productResponse = await axios.get(`${PRODUCT_SERVICE_URL}/${productId}`, {
        headers: {
          'Authorization': `Bearer ${req.header('Authorization')?.replace('Bearer ', '')}`
        }
      });
      console.log('productResponse data:', productResponse.data);
      const product = productResponse.data;
      
      if (product.inventory < quantity) {
        return res.status(400).json({ message: 'Insufficient inventory' });
      }
      
      let cart = await Cart.findOne({ userId }) || new Cart({ userId, items: [], totalAmount: 0 });
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({
          productId,
          name: product.name,
          price: product.price,
          quantity,
          imageUrl: product.imageUrl
        });
      }
      
      cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      await cart.save();
      
      res.status(200).json({ cart });
    } catch (error) {
      console.error('Product validation failed:', {
        productId,
        errorMessage: error.message,
        status: error.response?.status,
        responseData: error.response?.data
      });
      if (error.response && error.response.status === 404) {
        return res.status(404).json({ message: 'Product not found' });
      }
      throw error;
    }
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    
    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: 'ProductId and quantity are required' });
    }
    
    if (quantity < 0) {
      return res.status(400).json({ message: 'Quantity must be non-negative' });
    }
    
    // Find cart
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    // Find item in cart
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    // If quantity is 0, remove item from cart
    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      // Validate product has sufficient inventory
      try {
        const productResponse = await axios.get(`${PRODUCT_SERVICE_URL}/${productId}`, {
          headers: {
            'Authorization': `Bearer ${req.header('Authorization')?.replace('Bearer ', '')}`
          }
        });
        
        const product = productResponse.data;
        
        if (product.inventory < quantity) {
          return res.status(400).json({ message: 'Insufficient inventory' });
        }
        
        // Update quantity
        cart.items[itemIndex].quantity = quantity;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          return res.status(404).json({ message: 'Product not found' });
        }
        throw error;
      }
    }
    
    // Recalculate total amount
    cart.totalAmount = cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    // Save cart
    await cart.save();
    
    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    
    // Find cart
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    // Find item in cart
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    // Remove item from cart
    cart.items.splice(itemIndex, 1);
    
    // Recalculate total amount
    cart.totalAmount = cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    // Save cart
    await cart.save();
    
    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find cart
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    // Clear cart items
    cart.items = [];
    cart.totalAmount = 0;
    
    // Save cart
    await cart.save();
    
    res.status(200).json({ cart: { items: [], totalAmount: 0 } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};