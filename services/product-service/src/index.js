const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const productRoutes = require('./routes/product.routes');

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'https://e-commerce-platform-sable.vercel.app',
    'https://e-commerce-platform-git-main-sms-projects-1bbf5e72.vercel.app', 
    'https://e-commerce-platform-h4zgdsm2p-sms-projects-1bbf5e72.vercel.app'
  ],
  credentials: true,
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    // Remove or comment out the seeding function
    // seedProducts();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/products', productRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

app.listen(PORT, () => {
  console.log(`Product Service is running on port ${PORT}`);
});