import axios from 'axios';
import router from '@/Router/routes.js'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,// base chung cho toàn API
  withCredentials: true,
  timeout: 10000,
});

// Thêm Authorization header
api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// TỰ ĐỘNG REFRESH KHI 401
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await api.post('/auth/refresh');
        const { accessToken } = res.data.result;
        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        await router.push('/login');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
