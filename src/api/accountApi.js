import api from './axiosInstance.js';

export const getRecentOrders = (page = 0, size = 5) => {
  return api.get('/orders/search', {
    params: { page, size, sort: 'createdAt,desc' }
  });
};
export const searchWishlist = (page = 0, size = 5) => {
  return api.get('/wishlist/search', {
    params: { page, size, sort: 'addedAt,desc' }
  });
};
export const getAddresses = (page = 0, size = 5) => {
  return api.get('/addresses/search', {
    params: { page, size, sort: 'createdAt,desc' }
  });
};
export const removeFromWishlist = (wishlistId) => {return api.delete(`/wishlist/${wishlistId}`);};
export const updateWishlistItem = (wishlistId) => { return api.put(`/wishlist/${wishlistId}/sync`); };
export const getAddressById = (id) => { return api.get(`/addresses/${id}`); };
export const createAddress = (data) => { return api.post('/addresses', data); };
export const updateAddress = (id, data) => { return api.put(`/addresses/${id}`, data); };
export const deleteAddress = (id) => {return api.delete(`/addresses/${id}`);};
export const getMyInfo = () => api.get('/users/my-info');
export const updateProfile = (data) => api.put('/users/profile', data);
export const changePassword = (data) => api.post('/users/change-password', data);

