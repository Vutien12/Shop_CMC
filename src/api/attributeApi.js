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

