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

/**
 * Attach a file to a category (thumbnail)
 * @param {Object} entityFileData - Entity file data
 * @returns {Promise}
 */
export const attachFileToCategory = async (entityFileData) => {
  // Convert entityType and zone to uppercase (API requires uppercase values)
  const normalizedData = {
    ...entityFileData,
    entityType: entityFileData.entityType.toUpperCase(),
    zone: entityFileData.zone.toUpperCase()
  }
  const response = await api.post('/entity-files', normalizedData)
  return response.data
}

/**
 * Get entity files for a category
 * @param {number} entityId - Category ID
 * @param {string} entityType - Entity type (default: "CATEGORY")
 * @param {string} zone - Zone (default: "THUMBNAIL")
 * @returns {Promise}
 */
export const getCategoryFiles = async (entityId, entityType = 'CATEGORY', zone = 'THUMBNAIL') => {
  const response = await api.get('/entity-files', {
    params: {
      entityId,
      entityType: entityType.toUpperCase(),
      zone: zone.toUpperCase(),
    },
  })
  return response.data
}

