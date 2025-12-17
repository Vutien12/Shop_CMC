import axiosInstance from './axiosInstance';

/**
 * Get all attributes
 */
export const getAttributes = async () => {
    try {
        const response = await axiosInstance.get('/attributes');
        return response.data;
    } catch (error) {
        console.error('Error getting attributes:', error);
        throw error;
    }
};

/**
 * Search attributes with pagination and filters
 */
export const searchAttributes = async (params = {}) => {
    try {
        const response = await axiosInstance.get('/attributes/search', { params });
        return response.data;
    } catch (error) {
        console.error('Error searching attributes:', error);
        throw error;
    }
};

/**
 * Get a single attribute by ID
 */
export const getAttribute = async (id) => {
    try {
        const response = await axiosInstance.get(`/attributes/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error getting attribute ${id}:`, error);
        throw error;
    }
};

/**
 * Create a new attribute
 */
export const createAttribute = async (data) => {
    try {
        const response = await axiosInstance.post('/attributes', data);
        return response.data;
    } catch (error) {
        console.error('Error creating attribute:', error);
        throw error;
    }
};

/**
 * Update an existing attribute
 */
export const updateAttribute = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/attributes/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating attribute ${id}:`, error);
        throw error;
    }
};

/**
 * Delete a single attribute
 */
export const deleteAttribute = async (id) => {
    try {
        const response = await axiosInstance.delete(`/attributes/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting attribute ${id}:`, error);
        throw error;
    }
};

/**
 * Delete multiple attributes
 */
export const deleteManyAttributes = (ids) => {
  return axiosInstance.delete('/attributes/delete-many', { data: ids });
};



// ============= Attribute Sets =============

/**
 * Search attribute sets with pagination and filters
 */
export const searchAttributeSets = (params) => {
    return axiosInstance.get('/attribute-sets/search', { params });
};

/**
 * Get all attribute sets
 */
export const getAttributeSets = () => {
    return axiosInstance.get('/attribute-sets');
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
export const deleteAttributeSet = (id) => {
    return axiosInstance.delete(`/attribute-sets/${id}`);
};

/**
 * Delete multiple attribute sets
 */
export const deleteManyAttributeSets = (ids) => {
    return axiosInstance.post('/attribute-sets/delete-many', { ids });
};

