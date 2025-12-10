import api from '@/api/axiosInstance.js';

/**
 * Get available shipping services from GHN
 * @param {Object} request - { from_district, to_district }
 * @returns {Promise} List of available services
 */
// shippingApi.js
export const getAvailableServices = (request) => {
  return api.post('/ghn/available-services', {
    from_district: request.from_district,
    to_district: request.to_district
  });
};

/**
 * Calculate shipping fee from GHN
 * @param {Object} request - GhnFeeRequest object
 * @returns {Promise} Fee calculation response
 */
export const calculateShippingFee = (request) => {
  return api.post('/ghn/shipping-fee', request);
};

