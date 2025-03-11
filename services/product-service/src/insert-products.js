const mongoose = require('mongoose');
const Product = require('./models/product.model');
const Redis = require('ioredis');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Initialize Redis client
const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: process.env.REDIS_PORT || 6379,
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
  process.exit(1);
});

const insertProducts = async () => {
  try {
    const products = [
      {
        name: 'Laptop',
        description: 'A high-performance laptop for work and gaming.',
        price: 999.99,
        imageUrl: 'https://9to5mac.com/wp-content/uploads/sites/6/2024/06/MacBook-Air-M3-15-inch-deals.jpg?quality=82&strip=all&w=1024',
        category: 'Electronics',
        inventory: 10,
        createdAt: new Date('2025-03-09T00:00:00.000Z'),
      },
      {
        name: 'Headphones',
        description: 'Wireless headphones with noise cancellation.',
        price: 49.99,
        imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQTQ3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1687660671363',
        category: 'Accessories',
        inventory: 20,
        createdAt: new Date('2025-03-09T00:00:00.000Z'),
      },
      {
        name: 'Smartwatch',
        description: 'A stylish smartwatch with fitness tracking and notifications.',
        price: 199.99,
        imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/s10-case-unselect-gallery-1-202409_FMT_WHH?wid=752&hei=720&fmt=p-jpg&qlt=80&.v=1724620929305',
        category: 'Wearables',
        inventory: 15,
        createdAt: new Date('2025-03-09T00:00:00.000Z'),
      },
      {
        name: 'Bluetooth Speaker',
        description: 'Portable Bluetooth speaker with excellent sound quality.',
        price: 79.99,
        imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MW463?wid=2000&hei=2000&fmt=jpeg&qlt=90&.v=1716251412721',
        category: 'Audio',
        inventory: 25,
        createdAt: new Date('2025-03-09T00:00:00.000Z'),
      },
      {
        name: 'Smartphone',
        description: 'Latest smartphone with a high-resolution camera and fast processor.',
        price: 799.99,
        imageUrl: 'https://www.apple.com/newsroom/images/2024/09/apple-debuts-iphone-16-pro-and-iphone-16-pro-max/article/Apple-iPhone-16-Pro-hero-geo-240909_inline.jpg.large.jpg',
        category: 'Electronics',
        inventory: 8,
        createdAt: new Date('2025-03-09T00:00:00.000Z'),
      },
      {
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with adjustable DPI settings.',
        price: 29.99,
        imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MXK53?wid=2000&hei=2000&fmt=jpeg&qlt=95&.v=1730508286345',
        category: 'Accessories',
        inventory: 30,
        createdAt: new Date('2025-03-09T00:00:00.000Z'),
      },
    ];

    // Validate image URLs (optional but recommended)
    for (const product of products) {
      try {
        const response = await fetch(product.imageUrl, { method: 'HEAD' });
        if (!response.ok) {
          console.warn(`Image URL for ${product.name} is invalid: ${product.imageUrl}`);
        }
      } catch (error) {
        console.warn(`Failed to validate image URL for ${product.name}: ${error.message}`);
      }
    }

    // Clear existing products in MongoDB
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products into MongoDB
    const inserted = await Product.insertMany(products);
    console.log('Inserted products:', inserted.map(p => p.name));

    // Invalidate the Redis cache for all products
    await redis.del('all_products');
    console.log('Invalidated Redis cache for all_products');

    // Close connections and exit
    await mongoose.connection.close();
    await redis.quit();
    process.exit(0);
  } catch (error) {
    console.error('Error inserting products:', error);
    await mongoose.connection.close();
    await redis.quit();
    process.exit(1);
  }
};

insertProducts();