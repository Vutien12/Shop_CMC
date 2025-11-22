// src/api/cartApi.js
import api from './axiosInstance.js';

// POST: Thêm vào giỏ hàng
export const addToCart = (cartItems) =>
  api.post('/carts', { cartItems });

// GET: Lấy giỏ hàng
export const getCart = () =>
  api.get('/carts');

// PUT: Cập nhật số lượng
export const updateCartItemQty = (cartItemId, qty) =>
  api.put('/carts/item/qty', { cartItemId, qty });

// DELETE: Xóa item theo cartItemId
export const removeCartItem = (cartItemId) =>
  api.delete('/carts/item', { data: { cartItemId } });

// DELETE: Xóa toàn bộ giỏ hàng
export const clearCart = () =>
  api.delete('/carts/clear');
