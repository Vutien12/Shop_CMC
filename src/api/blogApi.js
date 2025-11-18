import api from '@/api/axiosInstance.js';

export const searchBlogs = (params) => api.get('/blogs/search', { params });

