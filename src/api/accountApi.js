import api from './axiosInstance.js';

export const getRecentOrders = (page = 0, size = 5) => {
  return api.get('/orders/search', {
    params: { page, size, sort: 'createdAt,desc' }
  });
};

export const getUserInfo = () => {
  return api.get('/users/my-info');
};

export const getAddresses = (page = 0, size = 5) => {
  return api.get('/addresses/search', {
    params: {
      page,
      size,
      sort: 'createdAt,desc'
    }
  });
};
export const deleteAddress = (id) => {
  return api.delete(`/addresses/${id}`);
};
export const getMyInfo = () => api.get('/users/my-info');
export const updateProfile = (data) => api.put('/users/profile', data);
export const changePassword = (data) => api.post('/users/change-password', data);

