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

const combinedSeed = async () => {
  try {
    // Products from insertProducts.js (with featured flag)
    const insertProducts = [
      {
        name: 'MacBook Air',
        description: 'A high-performance laptop for work and gaming.',
        price: 999.99,
        imageUrl: 'https://9to5mac.com/wp-content/uploads/sites/6/2024/06/MacBook-Air-M3-15-inch-deals.jpg?quality=82&strip=all&w=1024',
        category: 'Electronics',
        inventory: 10,
        createdAt: new Date('2025-03-09T00:00:00.000Z'),
        featured: true, // Add featured flag
      },
      {
        name: 'Beats By Dre',
        description: 'Wireless headphones with noise cancellation.',
        price: 49.99,
        imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQTQ3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1687660671363',
        category: 'Accessories',
        inventory: 20,
        createdAt: new Date('2025-03-09T00:00:00.000Z'),
        featured: true,
      },
      {
        name: 'Apple Watch',
        description: 'A stylish smartwatch with fitness tracking and notifications.',
        price: 199.99,
        imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/s10-case-unselect-gallery-1-202409_FMT_WHH?wid=752&hei=720&fmt=p-jpg&qlt=80&.v=1724620929305',
        category: 'Wearables',
        inventory: 15,
        createdAt: new Date('2025-03-09T00:00:00.000Z'),
        featured: true,
      },
      {
        name: 'Beats Pill',
        description: 'Portable Bluetooth speaker with excellent sound quality.',
        price: 79.99,
        imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MW463?wid=2000&hei=2000&fmt=jpeg&qlt=90&.v=1716251412721',
        category: 'Audio',
        inventory: 25,
        createdAt: new Date('2025-03-09T00:00:00.000Z'),
        featured: true,
      },
      {
        name: 'Apple iPhone 16 Pro',
        description: 'Latest smartphone with a high-resolution camera and fast processor.',
        price: 799.99,
        imageUrl: 'https://www.apple.com/newsroom/images/2024/09/apple-debuts-iphone-16-pro-and-iphone-16-pro-max/article/Apple-iPhone-16-Pro-hero-geo-240909_inline.jpg.large.jpg',
        category: 'Electronics',
        inventory: 8,
        createdAt: new Date('2025-03-09T00:00:00.000Z'),
        featured: true,
      },
      {
        name: 'Apple Magic Mouse',
        description: 'Ergonomic wireless mouse with adjustable DPI settings.',
        price: 29.99,
        imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MXK53?wid=2000&hei=2000&fmt=jpeg&qlt=95&.v=1730508286345',
        category: 'Accessories',
        inventory: 30,
        createdAt: new Date('2025-03-09T00:00:00.000Z'),
        featured: true,
      },
    ];

    // Products from seedProducts.js (without featured flag)
    const seedProducts = [
      {
        name: "AirPods",
        description: "High-quality sound with noise cancellation and long battery life",
        price: 79.99,
        imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/og-airpods-4-202409?wid=1200&hei=630&fmt=jpeg&qlt=95&.v=1724144134014",
        category: "electronics",
        inventory: 50,
      },
      {
        name: "Smart Home Security Camera",
        description: "1080p HD camera with motion detection and night vision",
        price: 129.99,
        imageUrl: "https://m.media-amazon.com/images/I/61IsgsyFC8L.jpg",
        category: "electronics",
        inventory: 30,
      },
      {
        name: "Leather Phone Case",
        description: "Premium leather case with card slots and kickstand",
        price: 34.99,
        imageUrl: "https://as-images.apple.com/is/MYYT3?wid=1000&hei=1000&fmt=jpeg&qlt=95&.v=1723595139562",
        category: "accessories",
        inventory: 100,
      },
      {
        name: "Multi-port USB Charger",
        description: "Fast charging with 5 USB ports and intelligent power distribution",
        price: 25.99,
        imageUrl: "https://m.media-amazon.com/images/I/61bW96tW7gL.jpg",
        category: "accessories",
        inventory: 75,
      },
      {
        name: "Fitness Tracker",
        description: "Track steps, heart rate, sleep, and more with 7-day battery life",
        price: 89.99,
        imageUrl: "https://m.media-amazon.com/images/I/712E2zAz5wL._AC_UY1000_.jpg",
        category: "wearables",
        inventory: 45,
      },
      {
        name: "Fitbit Watch",
        description: "Stylish smartwatch with health monitoring and smartphone notifications",
        price: 199.99,
        imageUrl: "https://content.abt.com/image.php/fitbit-smartwatch-GA05185SLV-dynamic-front-left-view.jpg?image=/images/products/BDP_Images/fitbit-smartwatch-GA05185SLV-dynamic-front-left-view.jpg&canvas=1&width=750&height=550",
        category: "wearables",
        inventory: 25,
      },
      {
        name: "AirPods Pro",
        description: "Waterproof speaker with 360° sound and 20-hour battery life",
        price: 59.99,
        imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-pro-2-hero-select-202409_FMT_WHH?wid=750&hei=556&fmt=jpeg&qlt=90&.v=1724041668836",
        category: "audio",
        inventory: 60,
      },
      {
        name: "PlayStation VR",
        description: "Over-ear headphones with premium sound quality and comfort",
        price: 149.99,
        imageUrl: "https://m.media-amazon.com/images/I/61LfMet7s4L._AC_UF894,1000_QL80_.jpg",
        category: "audio",
        inventory: 40,
      },
      {
        name: "Mag-Safe Wireless Charger",
        description: "Fast wireless charging pad compatible with iPhone and Android devices",
        price: 39.99,
        imageUrl: "https://m.media-amazon.com/images/I/51ZTUXXpT1L._AC_UF894,1000_QL80_.jpg",
        category: "accessories",
        inventory: 80
      },
      {
        name: "Bluetooth Mechanical Keyboard",
        description: "Compact wireless mechanical keyboard with RGB backlighting",
        price: 99.99,
        imageUrl: "https://m.media-amazon.com/images/I/71ZRus2YNcL.jpg",
        category: "electronics",
        inventory: 35
      },
      {
        name: "Portable Power Bank",
        description: "10,000mAh power bank with fast charging and dual USB ports",
        price: 45.99,
        imageUrl: "https://m.media-amazon.com/images/I/610Vz+2eDmL._AC_UF894,1000_QL80_.jpg",
        category: "accessories",
        inventory: 90
      },
      {
        name: "Sony Noise-Canceling Headphones",
        description: "Over-ear headphones with active noise cancellation and deep bass",
        price: 179.99,
        imageUrl: "https://m.media-amazon.com/images/I/41tp0JPPlmL._AC_UF894,1000_QL80_.jpg",
        category: "audio",
        inventory: 50
      },
      {
        name: "Apple ipad Pro M4",
        description: "WiFi-enabled LED smart bulb with voice control and app integration",
        price: 24.99,
        imageUrl: "https://m.media-amazon.com/images/I/714-7INRdwL._AC_UF1000,1000_QL80_.jpg",
        category: "electronics",
        inventory: 100
      },
      {
        name: "Samsung 4K TV",
        description: "Streaming stick with 4K HDR, Dolby Vision, and voice remote",
        price: 1059.99,
        imageUrl: "https://m.media-amazon.com/images/I/91snjIt0nUL.jpg",
        category: "electronics",
        inventory: 70
      }
      
    ];

    // Combine all products
    const allProducts = [...insertProducts, ...seedProducts];

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