import api from '@/api/axiosInstance.js';

/**
 * Get all users
 * @returns {Promise}
 */
export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

/**
 * Get a single user by ID
 * @param {number} id - User ID
 * @returns {Promise}
 */
export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise}
 */
export const createUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

/**
 * Update a user
 * @param {number} id - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise}
 */
export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

/**
 * Delete a user
 * @param {number} id - User ID
 * @returns {Promise}
 */
export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

/**
 * Delete multiple users
 * @param {Array<number>} ids - Array of user IDs
 * @returns {Promise}
 */
export const deleteManyUsers = async (ids) => {
  const response = await api.post('/users/delete-many', { ids });
  return response.data;
};
