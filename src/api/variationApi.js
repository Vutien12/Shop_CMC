import api from './axiosInstance'

/**
 * Get all variations
 * @returns {Promise}
 */
export const getVariations = async () => {
  const response = await api.get('/variations')
  return response.data
}

/**
 * Get global variations (only variations marked as global)
 * @returns {Promise}
 */
export const getGlobalVariations = async () => {
  const response = await api.get('/variations/global')
  return response.data
}

/**
 * Get a single variation by ID
 * @param {number} id - Variation ID
 * @returns {Promise}
 */
export const getVariationById = async (id) => {
  const response = await api.get(`/variations/${id}`)
  return response.data
}

/**
 * Create a new variation
 * @param {Object} variationData - Variation data
 * @returns {Promise}
 */
export const createVariation = async (variationData) => {
  const response = await api.post('/variations', variationData)
  return response.data
}

/**
 * Update a variation
 * @param {number} id - Variation ID
 * @param {Object} variationData - Updated variation data
 * @returns {Promise}
 */
export const updateVariation = async (id, variationData) => {
  const response = await api.put(`/variations/${id}`, variationData)
  return response.data
}

/**
 * Delete a variation
 * @param {number} id - Variation ID
 * @returns {Promise}
 */
export const deleteVariation = async (id) => {
  const response = await api.delete(`/variations/${id}`)
  return response.data
}

