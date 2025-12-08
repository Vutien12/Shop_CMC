import api from '@/api/axiosInstance.js';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_SORT } from '@/Config/search.js';

// Create order
export const createOrder = async (orderData) => {
  try {
    return await api.post('/orders', orderData);
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    return await api.get(`/orders/${orderId}`);
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

// Search orders (for admin)
export const searchOrders = async (page, size, sort) => {
  try {
    return await api.get('/orders/search', {
      params: {
        page: page ?? DEFAULT_PAGE,
        size: size ?? DEFAULT_PAGE_SIZE.orders,
        sort: sort ?? DEFAULT_SORT.orders
      }
    });
  } catch (error) {
    console.error('Error searching orders:', error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    return await api.put(`/orders/${orderId}/status`, { status });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};


// Send order email
export const sendOrderEmail = async (orderId) => {
  try {
    return await api.post(`/orders/${orderId}/send-email`);
  } catch (error) {
    console.error('Error sending order email:', error);
    throw error;
  }
};

// Delete orders
export const deleteOrders = async (orderIds) => {
  try {
    return await api.delete('/orders', {
      data: { ids: orderIds }
    });
  } catch (error) {
    console.error('Error deleting orders:', error);
    throw error;
  }
};

