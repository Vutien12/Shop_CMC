import axiosInstance from './axiosInstance';

/**
 * Get reports based on filters
 * @param {Object} params - Report search parameters
 * @returns {Promise}
 */
export const getReports = (params) => {
  return axiosInstance.get('/reports', { params });
};

/**
 * Export report to Excel/CSV
 * @param {Object} params - Report search parameters
 * @returns {Promise}
 */
export const exportReport = (params) => {
  return axiosInstance.get('/reports/export', {
    params,
    responseType: 'blob'
  });
};

