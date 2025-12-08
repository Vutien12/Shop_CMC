import api from '@/api/axiosInstance.js'

/**
 * Get all categories
 * @returns {Promise}
 */
export const getCategories = async () => {
  const response = await api.get('/categories')
  return response.data
}

/**
 * Get a single category by ID
 * @param {number} id - Category ID
 * @returns {Promise}
 */
export const getCategoryById = async (id) => {
  const response = await api.get(`/categories/${id}`)
  return response.data
}

/**
 * Create a new category
 * @param {Object} categoryData - Category data
 * @returns {Promise}
 */
export const createCategory = async (categoryData) => {
  const response = await api.post('/categories', categoryData)
  return response.data
}

/**
 * Update a category
 * @param {number} id - Category ID
 * @param {Object} categoryData - Updated category data
 * @returns {Promise}
 */
export const updateCategory = async (id, categoryData) => {
  const response = await api.put(`/categories/${id}`, categoryData)
  return response.data
}

/**
 * Delete a category
 * @param {number} id - Category ID
 * @returns {Promise}
 */
export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`)
  return response.data
}

/**
 * Get trending categories
 * @returns {Promise}
 */
export const getTrendingCategories = async () => {
  const response = await api.get('categories/trending')
  return response.data
}

