const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticate, authorizeAdmin } = require('../middleware/auth.middleware');

// Public routes
router.get('/', productController.getAllProducts); // Fetch all products (public)
router.get('/:id', authenticate, productController.getProductById); // Fetch a single product (protected)

// Admin routes
router.post('/', authenticate, authorizeAdmin, productController.createProduct);
router.put('/:id', authenticate, authorizeAdmin, productController.updateProduct);
router.delete('/:id', authenticate, authorizeAdmin, productController.deleteProduct);

// Internal route for updating inventory
router.put('/inventory/update', productController.updateInventory);
// Add batch update route
router.put('/inventory/batch', authenticate, productController.updateInventoryBatch);

// Add this route in product.routes.js
router.post('/invalidate-cache', authenticate, authorizeAdmin, productController.invalidateCache);


module.exports = router;