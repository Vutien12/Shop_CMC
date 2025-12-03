import api from './axiosInstance';

// Search flash sales with pagination
export const searchFlashSales = async (searchRequest) => {
  try {
    const params = {
      page: searchRequest.page || 0,
      size: searchRequest.size || 10,
      sort: `${searchRequest.sortBy || 'createdAt'},${(searchRequest.direction || 'DESC').toLowerCase()}`
    };

    const response = await api.get('/flash-sales/search', { params });
    return response.data;
  } catch (error) {
    console.error('Error searching flash sales:', error);
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
