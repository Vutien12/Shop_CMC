import axiosInstance from './axiosInstance';

export const createOrder = async (orderData) => {
  try {
    const response = await axiosInstance.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};


