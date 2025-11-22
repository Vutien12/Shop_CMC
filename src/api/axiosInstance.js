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

// Cấu hình baseURL dựa vào môi trường:
// - DEV (Vite dev server): dùng relative path '/api/v1' để Vite proxy forward tới backend
// - PROD: dùng VITE_API_BASE_URL từ .env
const _envBase = import.meta.env.VITE_API_BASE_URL;
const isDev = import.meta.env.DEV; // Vite tự động set biến này

let baseURL;
if (isDev) {
  // Development: dùng relative path để tận dụng Vite proxy (tránh CORS)
  baseURL = '/api/v1';
  console.log('[axiosInstance] Dev mode: using proxy baseURL:', baseURL);
} else {
  // Production: dùng env variable hoặc fallback
  const fallbackBase = 'http://localhost:8080/elec';
  if (!_envBase) {
    console.warn('[axiosInstance] VITE_API_BASE_URL is not set. Falling back to', fallbackBase);
  }
  baseURL = `${_envBase || fallbackBase}/api/v1`;
}

const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
});

// Thêm Authorization header và logging
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

  // Debug logging
  console.log('[axios] Request:', {
    method: config.method?.toUpperCase(),
    url: config.url,
    baseURL: config.baseURL,
    fullURL: `${config.baseURL}${config.url}`,
    isPublic,
    hasAuth: !!config.headers.Authorization,
    withCredentials: config.withCredentials,
  });

  return config;
});

// Tự refresh token nếu 401
api.interceptors.response.use(
  (response) => {
    // Debug logging cho response thành công
    console.log('[axios] Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    // Debug logging cho lỗi
    console.error('[axios] Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      headers: error.response?.headers,
    });

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
