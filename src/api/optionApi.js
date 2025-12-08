import api from '@/api/axiosInstance.js';

// Get all options (supports optional params)
export const getOptions = async (params) => {
  try {
    const response = await api.get('/options', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching options:', error);
    throw error;
  }
};

// Get option by ID
export const getOptionById = async (id) => {
  try {
    const response = await api.get(`/options/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching option:', error);
    throw error;
  }
};

// Create new option
export const createOption = async (optionData) => {
  try {
    const response = await api.post('/options', optionData);
    return response.data;
  } catch (error) {
    console.error('Error creating option:', error);
    throw error;
  }
};

// Update option
export const updateOption = async (id, optionData) => {
  try {
    const response = await api.put(`/options/${id}`, optionData);
    return response.data;
  } catch (error) {
    console.error('Error updating option:', error);
    throw error;
  }
};

// Delete option
export const deleteOption = async (id) => {
  try {
    const response = await api.delete(`/options/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting option:', error);
    throw error;
  }
};

// Delete multiple options
export const deleteManyOptions = async (ids) => {
  try {
    // Backend expects POST with array directly
    const response = await api.post('/options/delete-many', ids);
    return response.data;
  } catch (error) {
    console.error('Error deleting options:', error);
    console.error('Request IDs:', ids);
    throw error;
  }
};

// Search options
export const searchOptions = async (params = {}) => {
  try {
    const response = await api.get('/options/search', {
      params
    });
    return response.data;
  } catch (error) {
    console.error('Error searching options:', error);
    throw error;
  }
};

// Get global options
export const getGlobalOptions = async () => {
  try {
    const response = await api.get('/options/global');
    return response.data;
  } catch (error) {
    console.error('Error fetching global options:', error);
    throw error;
  }
};
