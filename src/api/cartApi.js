import api from '@/api/axiosInstance.js';

// POST: Thêm vào giỏ hàng
export const addToCart = async (payload) => {
  const response = await api.post('/carts', payload);
  return response.data;
};

// GET: Lấy giỏ hàng
export const getCart = async () => {
  const response = await api.get('/carts');
  return response.data;
};

// PUT: Cập nhật số lượng
export const updateCartItemQty = async (cartItemId, qty) => {
  const response = await api.put('/carts/item/qty', { cartItemId, qty });
  return response.data;
};

// DELETE: Xóa item theo cartItemId
export const removeCartItem = async (cartItemId) => {
  const response = await api.delete(`/carts/item/${cartItemId}`);
  return response.data;
};

// DELETE: Xóa toàn bộ giỏ hàng
export const clearCart = async () => {
  const response = await api.delete('/carts/clear');
  return response.data;
};
