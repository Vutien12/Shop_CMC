import api from './axiosInstance';

// Get all flash sales (Admin only)
export const getAllFlashSales = async () => {
  try {
    const response = await api.get('/flash-sales');
    return response.data;
  } catch (error) {
    console.error('Error getting all flash sales:', error);
    throw error;
  }
};

// Get active flash sales (Public)
export const getActiveFlashSales = async () => {
  try {
    const response = await api.get('/flash-sales/active');
    return response.data;
  } catch (error) {
    console.error('Error getting active flash sales:', error);
    throw error;
  }
};

// Get flash sale by ID
export const getFlashSale = async (flashSaleId) => {
  try {
    const response = await api.get(`/flash-sales/${flashSaleId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting flash sale:', error);
    throw error;
  }
};

// Create flash sale
export const createFlashSale = async (flashSaleData) => {
  try {
    const response = await api.post('/flash-sales', flashSaleData);
    return response.data;
  } catch (error) {
    console.error('Error creating flash sale:', error);
    console.error('Error details:', error.response?.data);
    throw error;
  }
};

// Update flash sale
export const updateFlashSale = async (flashSaleId, flashSaleData) => {
  try {
    const response = await api.put(`/flash-sales/${flashSaleId}`, flashSaleData);
    return response.data;
  } catch (error) {
    console.error('Error updating flash sale:', error);
    console.error('Error details:', error.response?.data);
    throw error;
  }
};

// Delete flash sale
export const deleteFlashSale = async (flashSaleId) => {
  try {
    const response = await api.delete(`/flash-sales/${flashSaleId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting flash sale:', error);
    throw error;
  }
};

// Get flash sale items
export const getFlashSaleItems = async (flashSaleId) => {
  try {
    const response = await api.get(`/flash-sales/${flashSaleId}/items`);
    return response.data;
  } catch (error) {
    console.error('Error getting flash sale items:', error);
    throw error;
  }
};

// Add product to flash sale
export const addProductToFlashSale = async (flashSaleId, itemData) => {
  try {
    const response = await api.post(`/flash-sales/${flashSaleId}/items`, itemData);
    return response.data;
  } catch (error) {
    console.error('Error adding product to flash sale:', error);
    console.error('Error details:', error.response?.data);
    throw error;
  }
};

// Update flash sale item
export const updateFlashSaleItem = async (itemId, itemData) => {
  try {
    const response = await api.put(`/flash-sales/items/${itemId}`, itemData);
    return response.data;
  } catch (error) {
    console.error('Error updating flash sale item:', error);
    console.error('Error details:', error.response?.data);
    throw error;
  }
};

// Remove product from flash sale
export const removeProductFromFlashSale = async (itemId) => {
  try {
    const response = await api.delete(`/flash-sales/items/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing product from flash sale:', error);
    throw error;
  }
};

// Get available variants for flash sale
export const getAvailableVariants = async (keyword = '') => {
  try {
    const params = keyword ? { keyword } : {};
    const response = await api.get('/flash-sales/available-variants', { params });
    return response.data;
  } catch (error) {
    console.error('Error getting available variants:', error);
    throw error;
  }
};

