const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const proxy = require('express-http-proxy');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Proxy routes to the appropriate microservices
app.use('/api/auth', proxy(process.env.AUTH_SERVICE_URL));
app.use('/api/products', proxy(process.env.PRODUCT_SERVICE_URL));
app.use('/api/cart', proxy(process.env.CART_SERVICE_URL));
app.use('/api/orders', proxy(process.env.ORDER_SERVICE_URL));
app.use('/api/payments', proxy(process.env.PAYMENT_SERVICE_URL));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
});