import api from './axiosInstance'

/**
 * Get all brands
 * @returns {Promise}
 */
export const getBrands = async () => {
  const response = await api.get('/brands')
  return response.data
}

/**
 * Get a single brand by ID
 * @param {number} id - Brand ID
 * @returns {Promise}
 */
export const getBrandById = async (id) => {
  const response = await api.get(`/brands/${id}`)
  return response.data
}

/**
 * Create a new brand
 * @param {Object} brandData - Brand data
 * @returns {Promise}
 */
export const createBrand = async (brandData) => {
  const response = await api.post('/brands', brandData)
  return response.data
}

/**
 * Update a brand
 * @param {number} id - Brand ID
 * @param {Object} brandData - Updated brand data
 * @returns {Promise}
 */
export const updateBrand = async (id, brandData) => {
  const response = await api.put(`/brands/${id}`, brandData)
  return response.data
}

/**
 * Delete a single brand
 * @param {number} id - Brand ID
 * @returns {Promise}
 */
export const deleteBrand = async (id) => {
  const response = await api.delete(`/brands/${id}`)
  return response.data
}

/**
 * Delete multiple brands
 * @param {number[]} ids - Array of brand IDs
 * @returns {Promise}
 */
export const deleteManyBrands = async (ids) => {
  const response = await api.delete('/brands/delete-many', {
    data: ids,
  })
  return response.data
}

/**
 * Attach a file to a brand (logo)
 * @param {Object} entityFileData - Entity file data
 * @returns {Promise}
 */
export const attachFileToBrand = async (entityFileData) => {
  const response = await api.post('/entity-files', entityFileData)
  return response.data
}

/**
 * Get entity files for a brand
 * @param {number} entityId - Brand ID
 * @param {string} entityType - Entity type (default: "brand")
 * @param {string} zone - Zone (default: "logo")
 * @returns {Promise}
 */
export const getBrandFiles = async (entityId, entityType = 'brand', zone = 'logo') => {
  const response = await api.get('/entity-files', {
    params: {
      entityId,
      entityType,
      zone,
    },
  })
  return response.data
}

/**
 * Delete an entity file
 * @param {number} id - Entity file ID
 * @returns {Promise}
 */
export const deleteEntityFile = async (id) => {
  const response = await api.delete(`/entity-files/${id}`)
  return response.data
}

