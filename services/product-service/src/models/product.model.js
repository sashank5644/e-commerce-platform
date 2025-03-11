const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true }, 
  category: { type: String, required: true },
  inventory: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  featured: { type: Boolean, default: false },
});

module.exports = mongoose.model('Product', productSchema);