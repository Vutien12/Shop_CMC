import api from './axiosInstance.js';

export const getRecentOrders = (page = 0, size = 5) => {
  return api.get('/orders/search', {
    params: { page, size, sort: 'createdAt,desc' }
  });
};

export const getUserInfo = () => {
  return api.get('/users/my-info');
};
