import axiosInstance from './axiosInstance';

/**
 * Get all attribute sets
 */
export const getAttributeSets = async () => {
    try {
        const response = await axiosInstance.get('/attribute-sets');
        return response.data;
    } catch (error) {
        console.error('Error getting attribute sets:', error);
        throw error;
    }
};

/**
 * Search attribute sets with pagination and filters
 */
export const searchAttributeSets = async (params = {}) => {
    try {
        const response = await axiosInstance.get('/attribute-sets/search', { params });
        return response.data;
    } catch (error) {
        console.error('Error searching attribute sets:', error);
        throw error;
    }
};

/**
 * Get a single attribute set by ID
 */
export const getAttributeSet = (id) => {
    return axiosInstance.get(`/attribute-sets/${id}`);
};

/**
 * Create a new attribute set
 */
export const createAttributeSet = (data) => {
    return axiosInstance.post('/attribute-sets', data);
};

/**
 * Update an existing attribute set
 */
export const updateAttributeSet = (id, data) => {
    return axiosInstance.put(`/attribute-sets/${id}`, data);
};

/**
 * Delete a single attribute set
 */
export const deleteAttributeSet = async (id) => {
    try {
        const response = await axiosInstance.delete(`/attribute-sets/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting attribute set ${id}:`, error);
        throw error;
    }
};

/**
 * Delete multiple attribute sets
 */
export const deleteManyAttributeSets = async (ids) => {
    try {
        const response = await axiosInstance.post('/attribute-sets/delete-many', ids);
        return response.data;
    } catch (error) {
        console.error('Error deleting multiple attribute sets:', error);
        throw error;
    }
};
