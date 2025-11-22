import api from './axiosInstance.js';

// Search products
export const searchProducts = (params = {}) => {
  return api.get('/products/search', { params });
};
