exports.createOrder = async (req, res) => {
  try {
    console.log('Received createOrder request:', req.body);
    const { shippingAddress, paymentMethod } = req.body;
    const userId = req.user.id;
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: 'Shipping address and payment method are required' });
    }

    // Fetch cart data
    let cartResponse;
    console.log('Fetching cart from:', `${CART_SERVICE_URL}/`);
    try {
      cartResponse = await axios.get(`${CART_SERVICE_URL}/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      console.log('Cart response:', cartResponse.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error.message, error.response?.status, error.response?.data);
      return res.status(500).json({ message: 'Failed to retrieve cart', error: error.message });
    }

    const cart = cartResponse.data.cart;
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Rest of the createOrder logic...
    console.log('Order created successfully:', order);
    res.status(201).json({ order });
  } catch (error) {
    console.error('Create order error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};