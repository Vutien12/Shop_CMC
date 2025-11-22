import api from '@/api/axiosInstance.js'

export const getCategories = () => api.get('/categories');
