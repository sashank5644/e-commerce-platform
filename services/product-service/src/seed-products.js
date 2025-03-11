// seedProducts.js
const mongoose = require('mongoose');
const Product = require('./models/product.model');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const productsToAdd = [
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
  
  // Accessories category
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
  
  // Wearables category
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
  
  // Audio category
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
  }
];

const seedProducts = async () => {
  try {
    await Product.insertMany(productsToAdd);
    console.log('Products added successfully');
  } catch (error) {
    console.error('Error adding products:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedProducts();