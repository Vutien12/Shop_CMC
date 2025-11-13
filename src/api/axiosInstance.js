import axios from 'axios';
import router from '@/Router/routes.js'

const PUBLIC_ENDPOINTS = [
  '/auth/**',                          // /api/v1/auth/**
  '/auth/oauth2/callback/google',      // ĐÚNG
  '/auth/oauth2/callback/facebook',    // ĐÚNG
  '/ws/**',
  '/uploads/**',
  '/products/search',
  '/products/**',
  '/payment/webhook',
];

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,// base chung cho toàn API
  withCredentials: true,
  timeout: 10000,
});

// Thêm Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  const url = config.url || '';

  const isPublic = PUBLIC_ENDPOINTS.some((endpoint) => {
    if (endpoint.includes('**')) {
      const base = endpoint.replace('/**', '');
      return url.startsWith(base);
    }
    return url === endpoint || url.startsWith(endpoint);
  });

  if (!isPublic && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tự refresh token nếu 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await api.post('/auth/refresh');
        const { accessToken } = res.data.result;

        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest); // Gửi lại request cũ
      } catch (refreshError) {
        // Nếu refresh thất bại → logout
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
