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
export const deleteManyAttributes = async (ids) => {
    try {
        const response = await axiosInstance.delete('/attributes/delete-many', { data: ids });
        return response.data;
    } catch (error) {
        console.error('Error deleting multiple attributes:', error);
        throw error;
    }
};

