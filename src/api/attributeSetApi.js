import axiosInstance from './axiosInstance';

/**
 * Search attribute sets with pagination and filters
 */
export const searchAttributeSets = (params) => {
    return axiosInstance.get('/attribute-sets/search', { params });
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
