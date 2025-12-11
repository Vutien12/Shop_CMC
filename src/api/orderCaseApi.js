import api from '@/api/axiosInstance.js';

const BASE_URL = '/order-cases';

// ============== USER ENDPOINTS ==============

/**
 * Create a new order case
 * @param {Object} caseData - The order case data
 * @returns {Promise} API response
 */
export const createOrderCase = async (caseData) => {
  try {
    const response = await api.post(BASE_URL, caseData);
    return response.data;
  } catch (error) {
    console.error('Error creating order case:', error);
    throw error;
  }
};

/**
 * User responds to admin request for additional information
 * @param {Number} caseId - The order case ID
 * @param {Object} responseData - The response data
 * @returns {Promise} API response
 */
export const respondToCase = async (caseId, responseData) => {
  try {
    const response = await api.put(`${BASE_URL}/${caseId}/respond`, responseData);
    return response.data;
  } catch (error) {
    console.error('Error responding to case:', error);
    throw error;
  }
};

/**
 * Get all order cases for current user
 * @returns {Promise} API response
 */
export const getMyOrderCases = async () => {
  try {
    const response = await api.get(`${BASE_URL}/my-cases`);
    return response.data;
  } catch (error) {
    console.error('Error fetching my order cases:', error);
    throw error;
  }
};

/**
 * Get order case by ID
 * @param {Number} caseId - The order case ID
 * @returns {Promise} API response
 */
export const getOrderCaseById = async (caseId) => {
  try {
    const response = await api.get(`${BASE_URL}/${caseId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order case:', error);
    throw error;
  }
};

/**
 * Get all order cases for a specific order
 * @param {Number} orderId - The order ID
 * @returns {Promise} API response
 */
export const getOrderCasesByOrderId = async (orderId) => {
  try {
    const response = await api.get(`${BASE_URL}/order/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order cases by order ID:', error);
    throw error;
  }
};

// ============== ADMIN ENDPOINTS ==============

/**
 * Admin gets all order cases
 * @returns {Promise} API response
 */
export const getAllOrderCases = async () => {
  try {
    const response = await api.get(`${BASE_URL}/admin/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all order cases:', error);
    throw error;
  }
};

/**
 * Admin searches order cases with filters
 * @param {Object} searchParams - Search parameters (type, status, page, size, sort, etc.)
 * @returns {Promise} API response with paginated data
 */
export const searchOrderCases = async (searchParams = {}) => {
  try {
    const cleanParams = Object.entries(searchParams).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});

    const response = await api.get(`${BASE_URL}/admin/search`, {
      params: cleanParams
    });
    return response.data;
  } catch (error) {
    console.error('Error searching order cases:', error);
    throw error;
  }
};

/**
 * Admin updates an order case
 * @param {Number} caseId - The order case ID
 * @param {Object} updateData - The update data (status, adminNote, refundAmount, etc.)
 * @returns {Promise} API response
 */
export const updateOrderCase = async (caseId, updateData) => {
  try {
    const response = await api.put(`${BASE_URL}/${caseId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating order case:', error);
    throw error;
  }
};

/**
 * Admin deletes an order case
 * @param {Number} caseId - The order case ID
 * @returns {Promise} API response
 */
export const deleteOrderCase = async (caseId) => {
  try {
    const response = await api.delete(`${BASE_URL}/${caseId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting order case:', error);
    throw error;
  }
};

/**
 * Batch delete multiple order cases
 * @param {Array} caseIds - Array of order case IDs to delete
 * @returns {Promise} API response
 */
export const batchDeleteOrderCases = async (caseIds) => {
  try {
    const promises = caseIds.map(id => deleteOrderCase(id));
    return await Promise.all(promises);
  } catch (error) {
    console.error('Error batch deleting order cases:', error);
    throw error;
  }
};

export default {
  createOrderCase,
  respondToCase,
  getMyOrderCases,
  getOrderCaseById,
  getOrderCasesByOrderId,
  getAllOrderCases,
  searchOrderCases,
  updateOrderCase,
  deleteOrderCase,
  batchDeleteOrderCases
};

