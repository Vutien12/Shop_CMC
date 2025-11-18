import api from './axiosInstance.js';

// Search products
export const searchProducts = (params = {}) => {
  return api.get('/products/search', { params });
};

// Get product detail by ID
export const getProductById = (id) => {
  return api.get(`/products/${id}`);
};

