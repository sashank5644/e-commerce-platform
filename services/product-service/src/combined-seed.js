const mongoose = require('mongoose');
const Product = require('./models/product.model');
const Redis = require('ioredis');
require('dotenv').config();

// Import products to fetch
const insertProducts = require('./insert-products');
const seedProducts = require('./seed-products');
const additionalProducts = require('./additional-products');
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Initialize Redis client
const redisConfig = process.env.REDIS_URL_EXT || {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
};
console.log('Connecting to Redis with config:', redisConfig);
const redis = new Redis(redisConfig);

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
  process.exit(1);
});

const combinedSeed = async () => {
  try {
    
    // Combine all products
    const allProducts = [...insertProducts, ...seedProducts, ...additionalProducts];

    // Validate image URLs (optional but recommended)
    for (const product of allProducts) {
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

    // Insert all products into MongoDB
    const inserted = await Product.insertMany(allProducts);
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

combinedSeed();