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
  host: process.env.REDIS_HOST || 'localhost',
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

    const additionalProducts = [
      {
        name: "Samsung Galaxy Tab S9",
        description: "A powerful tablet with AMOLED display and S Pen support.",
        price: 699.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Electronics",
        inventory: 12,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: true,
      },
      {
        name: "Logitech StreamCam",
        description: "Full HD webcam with AI facial tracking for streaming.",
        price: 129.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Accessories",
        inventory: 25,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: false,
      },
      {
        name: "Garmin Fenix 7",
        description: "Advanced fitness smartwatch with solar charging.",
        price: 349.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Wearables",
        inventory: 18,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: true,
      },
      {
        name: "JBL Flip 6",
        description: "Compact waterproof speaker with bold sound.",
        price: 99.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Audio",
        inventory: 30,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: true,
      },
      {
        name: "DJI Mini 4 Pro",
        description: "Lightweight drone with 4K video and obstacle avoidance.",
        price: 759.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Electronics",
        inventory: 10,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: true,
      },
      {
        name: "Anker USB-C Hub",
        description: "Multi-port adapter with HDMI and Ethernet support.",
        price: 59.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Accessories",
        inventory: 40,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: false,
      },
      {
        name: "Oura Ring Gen 4",
        description: "Smart ring for sleep and activity tracking.",
        price: 299.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Wearables",
        inventory: 15,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: true,
      },
      {
        name: "Bose SoundLink Micro",
        description: "Tiny Bluetooth speaker with rugged design.",
        price: 89.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Audio",
        inventory: 35,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: false,
      },
      {
        name: "Lenovo ThinkPad X1 Carbon",
        description: "Ultra-light laptop with 14-inch 4K display.",
        price: 1299.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Electronics",
        inventory: 8,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: true,
      },
      {
        name: "Razer Kishi Ultra",
        description: "Mobile gaming controller with ergonomic grips.",
        price: 149.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Accessories",
        inventory: 20,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: false,
      },
      {
        name: "Polar Vantage M2",
        description: "Sports watch with advanced training metrics.",
        price: 249.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Wearables",
        inventory: 22,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: true,
      },
      {
        name: "Sonos Roam 2",
        description: "Portable smart speaker with Wi-Fi and Bluetooth.",
        price: 179.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Audio",
        inventory: 28,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: true,
      },
      {
        name: "Canon EOS R10",
        description: "Mirrorless camera with 24.2MP sensor and 4K video.",
        price: 979.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Electronics",
        inventory: 7,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: true,
      },
      {
        name: "Belkin BoostCharge Pro",
        description: "3-in-1 wireless charger for phone, watch, and earbuds.",
        price: 129.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Accessories",
        inventory: 50,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: false,
      },
      {
        name: "Whoop 4.0",
        description: "Wearable fitness tracker with strain and recovery insights.",
        price: 239.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Wearables",
        inventory: 17,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: true,
      },
      {
        name: "Audio-Technica ATH-M50x",
        description: "Studio monitor headphones with exceptional clarity.",
        price: 149.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Audio",
        inventory: 45,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: false,
      },
      {
        name: "Asus ROG Ally",
        description: "Handheld gaming console with Windows 11.",
        price: 599.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Electronics",
        inventory: 14,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: true,
      },
      {
        name: "Peak Design Travel Tripod",
        description: "Compact carbon fiber tripod for photography.",
        price: 349.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Accessories",
        inventory: 10,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: false,
      },
      {
        name: "Huawei Watch GT 4",
        description: "Elegant smartwatch with 14-day battery life.",
        price: 219.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Wearables",
        inventory: 20,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: true,
      },
      {
        name: "Harman Kardon Onyx Studio 8",
        description: "Premium Bluetooth speaker with rich bass.",
        price: 299.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Audio",
        inventory: 15,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: true,
      },
      {
        name: "Microsoft Surface Pro 10",
        description: "Versatile 2-in-1 tablet with detachable keyboard.",
        price: 1199.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Electronics",
        inventory: 9,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: true,
      },
      {
        name: "Tile Pro Tracker",
        description: "Bluetooth item finder with 400-ft range.",
        price: 34.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Accessories",
        inventory: 60,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: false,
      },
      {
        name: "Coros Vertix 2",
        description: "Rugged adventure watch with GPS and ECG.",
        price: 699.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Wearables",
        inventory: 13,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: true,
      },
      {
        name: "Ultimate Ears Boom 4",
        description: "Waterproof speaker with 360-degree sound.",
        price: 129.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Audio",
        inventory: 25,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: false,
      },
      {
        name: "Nikon Z50 II",
        description: "Compact mirrorless camera with 20.9MP sensor.",
        price: 859.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Electronics",
        inventory: 11,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: true,
      },
      {
        name: "Spigen ArcStation",
        description: "65W GaN charger with dual USB-C ports.",
        price: 49.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Accessories",
        inventory: 70,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: false,
      },
      {
        name: "Amazfit GTR 4",
        description: "Stylish smartwatch with AMOLED display and Alexa.",
        price: 179.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Wearables",
        inventory: 19,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: true,
      },
      {
        name: "Sennheiser Momentum 4",
        description: "Wireless headphones with 60-hour battery life.",
        price: 349.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Audio",
        inventory: 20,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: true,
      },
      {
        name: "HP Spectre x360",
        description: "Convertible laptop with OLED touchscreen.",
        price: 1399.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Electronics",
        inventory: 6,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: true,
      },
      {
        name: "OtterBox Defender Case",
        description: "Rugged phone case with drop protection.",
        price: 59.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Accessories",
        inventory: 55,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: false,
      },
      {
        name: "Suunto 9 Peak",
        description: "Ultra-thin sports watch with 100m water resistance.",
        price: 499.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Wearables",
        inventory: 14,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: true,
      },
      {
        name: "Edifier W820NB",
        description: "Budget noise-canceling headphones with Hi-Res audio.",
        price: 79.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Audio",
        inventory: 40,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: false,
      },
      {
        name: "Acer Nitro 5",
        description: "Gaming laptop with RTX 4060 and 144Hz display.",
        price: 999.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Electronics",
        inventory: 10,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: true,
      },
      {
        name: "Nomad Base Station",
        description: "Sleek wireless charging hub for multiple devices.",
        price: 99.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Accessories",
        inventory: 30,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: false,
      },
      {
        name: "Withings ScanWatch 2",
        description: "Hybrid smartwatch with ECG and SpO2 sensors.",
        price: 349.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Wearables",
        inventory: 16,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: true,
      },
      {
        name: "Anker Soundcore Liberty 4",
        description: "True wireless earbuds with ANC and LDAC.",
        price: 129.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Audio",
        inventory: 50,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: true,
      },
      {
        name: "GoPro Hero 13 Black",
        description: "Action camera with 5.3K video and HyperSmooth 6.0.",
        price: 399.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Electronics",
        inventory: 12,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: true,
      },
      {
        name: "Ugreen Car Mount Charger",
        description: "Wireless car charger with auto-clamping.",
        price: 39.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Accessories",
        inventory: 65,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: false,
      },
      {
        name: "Xiaomi Smart Band 9",
        description: "Affordable fitness tracker with 21-day battery.",
        price: 59.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Wearables",
        inventory: 80,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: true,
      },
      {
        name: "Klipsch The Three Plus",
        description: "Retro-style speaker with Google Assistant.",
        price: 399.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Audio",
        inventory: 18,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: true,
      },
      {
        name: "Dell XPS 13",
        description: "Premium laptop with InfinityEdge display.",
        price: 1199.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Electronics",
        inventory: 7,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: true,
      },
      {
        name: "Satechi Aluminum Stand",
        description: "Adjustable stand for laptops and tablets.",
        price: 44.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Accessories",
        inventory: 45,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: false,
      },
      {
        name: "TicWatch Pro 5",
        description: "Dual-display smartwatch with Wear OS.",
        price: 329.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Wearables",
        inventory: 15,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: true,
      },
      {
        name: "Shure Aonic 50 Gen 2",
        description: "High-fidelity headphones with adjustable ANC.",
        price: 299.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Audio",
        inventory: 22,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: true,
      },
      {
        name: "Razer Blade 16",
        description: "High-performance gaming laptop with Mini LED.",
        price: 2699.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Electronics",
        inventory: 5,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: true,
      },
      {
        name: "Twelve South BookArc",
        description: "Elegant vertical stand for MacBooks.",
        price: 59.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Accessories",
        inventory: 35,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: false,
      },
      {
        name: "Samsung Galaxy Watch 7",
        description: "Next-gen smartwatch with health insights.",
        price: 299.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Wearables",
        inventory: 20,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: true,
      },
      {
        name: "Bang & Olufsen Beoplay H95",
        description: "Luxury headphones with premium materials.",
        price: 999.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Audio",
        inventory: 10,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: true,
      },
      {
        name: "Sony Alpha 7 IV",
        description: "Full-frame mirrorless camera with 33MP sensor.",
        price: 2499.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Electronics",
        inventory: 4,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: true,
      },
      {
        name: "HyperX Cloud III",
        description: "Gaming headset with 7.1 surround sound.",
        price: 99.99,
        imageUrl: "https://m.media-amazon.com/images/I/71wf0FpPBcL.jpg",
        category: "Audio",
        inventory: 30,
        createdAt: new Date("2025-03-13T00:00:00.000Z"),
        featured: false,
      },
    ];

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