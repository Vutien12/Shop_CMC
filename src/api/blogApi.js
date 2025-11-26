import api from '@/api/axiosInstance.js';

/**
 * Search/Get all blogs
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 0)
 * @param {number} params.size - Page size (default: 10)
 * @param {string} params.sortBy - Sort field (default: 'createdAt')
 * @param {string} params.direction - Sort direction: 'ASC' or 'DESC' (default: 'DESC')
 * @param {string} params.keyword - Search keyword (optional)
 * @param {boolean} params.isPublished - Filter by publish status (optional)
 * @param {string} params.authorName - Filter by author name (optional)
 * @returns {Promise}
 */
export const searchBlogs = (params) => api.get('/blogs/search', { params });

/**
 * Get blog by ID
 * @param {number} id - Blog ID
 * @returns {Promise}
 */
export const getBlogById = (id) => api.get(`/blogs/${id}`);

/**
 * Create new blog
 * @param {Object} data - Blog data
 * @param {string} data.title - Blog title
 * @param {string} data.content - Blog content (HTML)
 * @param {string} data.thumbnail - Blog thumbnail URL
 * @param {boolean} data.isPublished - Publish status
 * @returns {Promise}
 */
export const createBlog = (data) => api.post('/blogs', data);

/**
 * Update blog
 * @param {number} id - Blog ID
 * @param {Object} data - Blog data to update
 * @returns {Promise}
 */
export const updateBlog = (id, data) => api.put(`/blogs/${id}`, data);

/**
 * Delete single blog
 * @param {number} id - Blog ID
 * @returns {Promise}
 */
export const deleteBlog = (id) => api.delete(`/blogs/${id}`);

/**
 * Delete multiple blogs
 * @param {Array<number>} ids - Array of blog IDs
 * @returns {Promise}
 */
export const deleteManyBlogs = (ids) => api.delete('/blogs/delete-many', { data: { ids } });

