import api from '@/api/axiosInstance.js'

export const getOrders = (page = 0, size = 10) => {
  return api.get('/orders/search', {
    params: { page, size, sort: 'createdAt,desc' }
  });
};
