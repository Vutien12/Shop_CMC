import api from './axiosInstance.js';

// Search products
export const searchProducts = async (params = {}) => {
  const response = await api.get('/products/search', { params });
  return response.data;
};

// Get product detail by ID (for viewing)
export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// Get product detail for editing (admin)
export const getProductForEdit = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

/**
 * Create a new product
 * @param {Object} productData - Product data with variations, variants, and options
 * @returns {Promise}
 */
export const createProduct = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

/**
 * Update a product
 * @param {number} id - Product ID
 * @param {Object} productData - Updated product data
 * @returns {Promise}
 */
export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

/**
 * Delete a product
 * @param {number} id - Product ID
 * @returns {Promise}
 */
export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data
};

/**
 * Get products by category
 * @param {number} categoryId - Category ID
 * @param {Object} options - Additional options (page, size, sort)
 * @returns {Promise}
 */
export const getProductsByCategory = async (categoryId, options = {}) => {
  const { page = 0, size = 20, sort = 'updatedAt,desc' } = options;
  const response = await api.get('/products/search', {
    params: {
      page,
      size,
      sort,
      categoryIds: [categoryId]
    },
    paramsSerializer: {
      indexes: null
    }
  });
  return response.data;
};

/**
 * Get new arrivals products
 * @param {number} limit - Number of products to fetch
 * @returns {Promise}
 */
export const getNewArrivals = async (limit = 10) => {
  const response = await api.get('/products/new-arrivals', {
    params: { limit }
  });
  return response.data;
};

/**
 * Get special products (products on sale)
 * @param {number} limit - Number of products to fetch
 * @returns {Promise}
 */
export const getSpecialProducts = async (limit = 10) => {
  const response = await api.get('/products/special', {
    params: { limit }
  });
  return response.data;
};

/**
 * Get featured products
 * @param {number} limit - Number of products to fetch
 * @returns {Promise}
 */
export const getFeaturedProducts = async (limit = 10) => {
  const response = await api.get('/products/featured', {
    params: { limit }
  });
  return response.data;
};

export default {
  searchProducts,
  getProductById,
  getProductForEdit,
  createProduct,
  updateProduct,
  deleteProduct,
  getNewArrivals,
  getSpecialProducts,
  getFeaturedProducts,
};

