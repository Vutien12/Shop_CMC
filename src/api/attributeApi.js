import axiosInstance from './axiosInstance';

/**
 * Search attributes with pagination and filters
 */
export const searchAttributes = (params) => {
    return axiosInstance.get('/attributes/search', { params });
};

/**
 * Get a single attribute by ID
 */
export const getAttribute = (id) => {
    return axiosInstance.get(`/attributes/${id}`);
};

/**
 * Create a new attribute
 */
export const createAttribute = (data) => {
    return axiosInstance.post('/attributes', data);
};

/**
 * Update an existing attribute
 */
export const updateAttribute = (id, data) => {
    return axiosInstance.put(`/attributes/${id}`, data);
};

/**
 * Delete a single attribute
 */
export const deleteAttribute = (id) => {
    return axiosInstance.delete(`/attributes/${id}`);
};

/**
 * Delete multiple attributes
 */
export const deleteManyAttributes = (ids) => {
    return axiosInstance.post('/attributes/delete-many', { ids });
};
