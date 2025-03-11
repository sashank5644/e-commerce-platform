// frontend/src/api/product.js
import { productApi } from './api';

export const fetchProducts = async () => {
  const response = await productApi.get('/products');
  return response.data; // Expecting an array of products
};

export const fetchProductById = async (id) => {
  const response = await productApi.get(`/products/${id}`);
  return response.data; // Expecting a single product
};