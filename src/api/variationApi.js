import api from './axiosInstance';

/**
 * Get all variations with pagination
 * @param {Object} params
 * @param {number} params.page
 * @param {number} params.size
 */
export const getVariations = async (params = {}) => {
  try {
    const response = await api.get('/variations', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching variations:', error);
    throw error;
  }
};

/**
 * Get global variations
 */
export const getGlobalVariations = async () => {
  try {
    const response = await api.get('/variations/global');
    return response.data;
  } catch (error) {
    console.error('Error fetching global variations:', error);
    throw error;
  }
};

/**
 * Get a single variation by ID
 */
export const getVariationById = async (id) => {
  try {
    const response = await api.get(`/variations/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching variation ${id}:`, error);
    throw error;
  }
};

/**
 * Create variation
 */
export const createVariation = async (data) => {
  try {
    const response = await api.post('/variations', data);
    return response.data;
  } catch (error) {
    console.error('Error creating variation:', error);
    throw error;
  }
};

/**
 * Update variation
 */
export const updateVariation = async (id, data) => {
  try {
    const response = await api.put(`/variations/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating variation ${id}:`, error);
    throw error;
  }
};

/**
 * Delete single variation
 */
export const deleteVariation = async (id) => {
  try {
    const response = await api.delete(`/variations/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting variation ${id}:`, error);
    throw error;
  }
};

/**
 * Attach a file to a variation value (for image type)
 * @param {Object} entityFileData - Entity file data
 * @param {number} entityFileData.fileId - File ID
 * @param {number} entityFileData.entityId - Variation value ID
 * @param {string} entityFileData.entityType - "VARIATION_VALUE"
 * @param {string} entityFileData.zone - "VARIATION"
 * @returns {Promise}
 */
export const attachFileToVariationValue = async (entityFileData) => {
  try {
    // Convert entityType and zone to uppercase (API requires uppercase values)
    const normalizedData = {
      ...entityFileData,
      entityType: entityFileData.entityType.toUpperCase(),
      zone: entityFileData.zone.toUpperCase()
    };
    const response = await api.post('/entity-files', normalizedData);
    return response.data;
  } catch (error) {
    console.error('Error attaching file to variation value:', error);
    throw error;
  }
};

/**
 * Delete multiple variations
 */
export const deleteManyVariations = async (ids) => {
  try {
    const response = await api.post('/variations/delete-many', ids);
    return response.data;
  } catch (error) {
    console.error('Error deleting multiple variations:', error);
    throw error;
  }
};

/**
 * Get variation values
 */
export const getVariationValues = async (variationId) => {
  try {
    const response = await api.get(`/variations/${variationId}/values`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching values for variation ${variationId}:`, error);
    throw error;
  }
};

/**
 * Search variations
 */
export const searchVariations = async (query) => {
  try {
    const response = await api.get('/variations/search', {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching variations:', error);
    throw error;
  }
};
