const Product = require('../models/product.model');
const redis = require('../config/redis');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const cachedProducts = await redis.get('all_products');
    
    if (cachedProducts) {
      return res.status(200).json(JSON.parse(cachedProducts));
    }
    
    const products = await Product.find();
    const formattedProducts = products.map(product => ({
      ...product._doc,
      image: product.imageUrl, // Map imageUrl to image
    }));
    await redis.set('all_products', JSON.stringify(formattedProducts), 'EX', 3600);
    res.status(200).json(formattedProducts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single product
exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const cachedProduct = await redis.get(`product_${productId}`);
    
    if (cachedProduct) {
      return res.status(200).json(JSON.parse(cachedProduct));
    }
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const formattedProduct = {
      ...product._doc,
      image: product.imageUrl, // Map imageUrl to image
    };
    await redis.set(`product_${productId}`, JSON.stringify(formattedProduct), 'EX', 3600);
    res.status(200).json(formattedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, imageUrl, category, inventory } = req.body;
    const product = new Product({ name, description, price, imageUrl, category, inventory });
    await product.save();
    await redis.del('all_products');
    const formattedProduct = {
      ...product._doc,
      image: product.imageUrl, // Map imageUrl to image
    };
    res.status(201).json(formattedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = req.body;
    const product = await Product.findByIdAndUpdate(productId, updates, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await redis.del(`product_${productId}`);
    await redis.del('all_products');
    const formattedProduct = {
      ...product._doc,
      image: product.imageUrl, // Map imageUrl to image
    };
    res.status(200).json(formattedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await redis.del(`product_${productId}`);
    await redis.del('all_products');
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update product inventory
exports.updateInventory = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.inventory < quantity) {
      return res.status(400).json({ message: 'Insufficient inventory' });
    }
    product.inventory -= quantity;
    await product.save();
    await redis.del(`product_${productId}`);
    await redis.del('all_products');
    const formattedProduct = {
      ...product._doc,
      image: product.imageUrl, // Map imageUrl to image
    };
    res.status(200).json({ message: 'Inventory updated successfully', product: formattedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update product inventory (batch)
exports.updateInventoryBatch = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items array is required and must not be empty' });
    }

    for (const item of items) {
      const { productId, quantity } = item;
      if (!productId || !quantity || quantity < 0) {
        return res.status(400).json({ message: `Invalid item data: ${JSON.stringify(item)}` });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${productId}` });
      }

      if (product.inventory < quantity) {
        return res.status(400).json({ message: `Insufficient inventory for product ${productId}` });
      }

      product.inventory -= quantity;
      await product.save();
      await redis.del(`product_${productId}`);
    }

    await redis.del('all_products');
    res.status(200).json({ message: 'Inventory updated successfully' });
  } catch (error) {
    console.error('Update inventory batch error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.invalidateCache = async (req, res) => {
  try {
    await redis.del('all_products');
    const productKeys = await redis.keys('product_*');
    if (productKeys.length > 0) {
      await redis.del(productKeys);
    }
    res.status(200).json({ message: 'Cache invalidated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};