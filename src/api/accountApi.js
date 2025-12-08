import api from '@/api/axiosInstance.js';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_SORT } from '@/Config/search.js';

// Orders
export const getRecentOrders = (page, size) =>
  api.get('/orders/search', {
    params: {
      page: page ?? DEFAULT_PAGE,
      size: size ?? DEFAULT_PAGE_SIZE.orders,
      sort: DEFAULT_SORT.orders
    }
  });

// Wishlist
export const searchWishlist = async (
  page = DEFAULT_PAGE,
  size = DEFAULT_PAGE_SIZE.wishlist
) => {
  const response = await api.get('/wishlist/search', {
    params: { page, size, sort: DEFAULT_SORT.wishlist }
  });
  return response.data;
};

// Addresses
export const getAddresses = (
  page = DEFAULT_PAGE,
  size = DEFAULT_PAGE_SIZE.addresses
) => {
  return api.get('/addresses/search', {
    params: { page, size, sort: DEFAULT_SORT.addresses }
  });
};

// Wishlist actions
export const addToWishlist = async (variantId) => {
  const response = await api.post('/wishlist', { variantId });
  return response.data;
};

export const removeFromWishlist = (wishlistId) =>
  api.delete(`/wishlist/${wishlistId}`);

export const updateWishlistItem = (wishlistId) =>
  api.put(`/wishlist/${wishlistId}/sync`);

// Address actions
export const getAddressById = (id) => api.get(`/addresses/${id}`);
export const createAddress = (data) => api.post('/addresses', data);
export const updateAddress = (id, data) => api.put(`/addresses/${id}`, data);
export const deleteAddress = (id) => api.delete(`/addresses/${id}`);

// User info
export const getMyInfo = () => api.get('/users/my-info');
export const updateProfile = (data) => api.put('/users/profile', data);
export const changePassword = (data) => api.post('/users/change-password', data);
