import api from './axiosInstance.js'

/**
 * Get contact information (phone, email, address, social links)
 * @returns {Promise<Object>} API response with contact information
 */
export const getContactInfo = async () => {
  const response = await api.get('/contact')
  return response.data
}

/**
 * Send contact support request
 * @param {Object} contactData - Contact request data
 * @param {string} contactData.email - Sender's email
 * @param {string} contactData.subject - Subject of the message
 * @param {string} contactData.message - Message content
 * @returns {Promise<Object>} API response
 */
export const sendContactSupport = async (contactData) => {
  const response = await api.post('/contact', contactData)
  return response.data
}

