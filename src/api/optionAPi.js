import axiosInstance from './axiosInstance';

// Get all options
export const getOptions = async () => {
  try {
    const response = await axiosInstance.get('/options');
    return response.data;
  } catch (error) {
    console.error('Error fetching options:', error);
    throw error;
  }
};

// Get option by ID
export const getOptionById = async (id) => {
  try {
    const response = await axiosInstance.get(`/options/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching option:', error);
    throw error;
  }
};

// Create new option
export const createOption = async (optionData) => {
  try {
    const response = await axiosInstance.post('/options', optionData);
    return response.data;
  } catch (error) {
    console.error('Error creating option:', error);
    throw error;
  }
};

// Update option
export const updateOption = async (id, optionData) => {
  try {
    const response = await axiosInstance.put(`/options/${id}`, optionData);
    return response.data;
  } catch (error) {
    console.error('Error updating option:', error);
    throw error;
  }
};

// Delete option
export const deleteOption = async (id) => {
  try {
    const response = await axiosInstance.delete(`/options/${id}`);
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
    const response = await axiosInstance.post('/options/delete-many', ids);
    return response.data;
  } catch (error) {
    console.error('Error deleting options:', error);
    console.error('Request IDs:', ids);
    throw error;
  }
};

// Search options
export const searchOptions = async (query) => {
  try {
    const response = await axiosInstance.get('/options/search', {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching options:', error);
    throw error;
  }
};
