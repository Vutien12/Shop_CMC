import axiosInstance from './axiosInstance';

/**
 * Get all variations with pagination
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.size - Page size (default: 10)
 * @returns {Promise} Response with variations list
 */
export const getVariations = async (params = {}) => {
    try {
        const response = await axiosInstance.get('/variations', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching variations:', error);
        throw error;
    }
};

/**
 * Get a single variation by ID
 * @param {number} id - Variation ID
 * @returns {Promise} Response with variation details
 */
export const getVariationById = async (id) => {
    try {
        const response = await axiosInstance.get(`/variations/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching variation ${id}:`, error);
        throw error;
    }
};

/**
 * Create a new variation
 * @param {Object} data - Variation data
 * @param {string} data.name - Variation name (e.g., "Màu sắc", "RAM")
 * @param {string} data.type - Variation type ("Text", "Image", "Color")
 * @param {boolean} data.isGlobal - Whether variation is global
 * @param {Array} data.variationValues - Array of variation values
 * @param {string} data.variationValues[].label - Display label
 * @param {string} data.variationValues[].value - Internal value
 * @returns {Promise} Response with created variation
 * 
 * @example
 * createVariation({
 *   name: "Màu sắc",
 *   type: "Text",
 *   isGlobal: true,
 *   variationValues: [
 *     { label: "Đen", value: "black" },
 *     { label: "Trắng", value: "white" }
 *   ]
 * })
 */
export const createVariation = async (data) => {
    try {
        const response = await axiosInstance.post('/variations', data);
        return response.data;
    } catch (error) {
        console.error('Error creating variation:', error);
        throw error;
    }
};

/**
 * Update an existing variation
 * @param {number} id - Variation ID
 * @param {Object} data - Updated variation data
 * @returns {Promise} Response with updated variation
 * 
 * @example
 * updateVariation(1, {
 *   name: "Màu sắc cập nhật",
 *   type: "Text",
 *   isGlobal: true,
 *   variationValues: [
 *     { label: "Đen", value: "black" },
 *     { label: "Xanh", value: "blue" }
 *   ]
 * })
 */
export const updateVariation = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/variations/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating variation ${id}:`, error);
        throw error;
    }
};

/**
 * Delete a single variation
 * @param {number} id - Variation ID
 * @returns {Promise} Response confirming deletion
 */
export const deleteVariation = async (id) => {
    try {
        const response = await axiosInstance.delete(`/variations/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting variation ${id}:`, error);
        throw error;
    }
};

/**
 * Delete multiple variations
 * @param {Array<number>} ids - Array of variation IDs
 * @returns {Promise} Response confirming deletions
 * 
 * @example
 * deleteManyVariations([1, 2, 3])
 */
export const deleteManyVariations = async (ids) => {
    try {
        // Backend có thể mong đợi POST với array trực tiếp
        const response = await axiosInstance.post('/variations/delete-many', ids);
        return response.data;
    } catch (error) {
        console.error('Error deleting multiple variations:', error);
        console.error('Request IDs:', ids);
        throw error;
    }
};

/**
 * Get all variation values for a specific variation
 * @param {number} variationId - Variation ID
 * @returns {Promise} Response with variation values
 */
export const getVariationValues = async (variationId) => {
    try {
        const response = await axiosInstance.get(`/variations/${variationId}/values`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching values for variation ${variationId}:`, error);
        throw error;
    }
};

/**
 * Search variations by name or type
 * @param {string} query - Search query
 * @returns {Promise} Response with matching variations
 */
export const searchVariations = async (query) => {
    try {
        const response = await axiosInstance.get('/variations/search', {
            params: { q: query }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching variations:', error);
        throw error;
    }
};
