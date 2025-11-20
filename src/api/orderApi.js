import axiosInstance from './axiosInstance';

export const createOrder = async (orderData) => {
  try {
    const response = await axiosInstance.post('/orders', orderData);
    return response;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/orders/${orderId}`);
    return response;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

