import api from './axiosInstance'

/**
 * Get all options
 * @returns {Promise}
 */
export const getOptions = async () => {
  const response = await api.get('/options')
  return response.data
}

/**
 * Get global options
 * @returns {Promise}
 */
export const getGlobalOptions = async () => {
  const response = await api.get('/options/global')
  return response.data
}

/**
 * Get a single option by ID
 * @param {number} id - Option ID
 * @returns {Promise}
 */
export const getOptionById = async (id) => {
  const response = await api.get(`/options/${id}`)
  return response.data
}

/**
 * Create a new option
 * @param {Object} optionData - Option data
 * @returns {Promise}
 */
export const createOption = async (optionData) => {
  const response = await api.post('/options', optionData)
  return response.data
}

/**
 * Update an option
 * @param {number} id - Option ID
 * @param {Object} optionData - Updated option data
 * @returns {Promise}
 */
export const updateOption = async (id, optionData) => {
  const response = await api.put(`/options/${id}`, optionData)
  return response.data
}

/**
 * Delete an option
 * @param {number} id - Option ID
 * @returns {Promise}
 */
export const deleteOption = async (id) => {
  const response = await api.delete(`/options/${id}`)
  return response.data
}

