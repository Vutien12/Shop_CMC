import api from './axiosInstance.js';
import router from '@/Router/routes.js';

// Login thường
export const login = (email, password, rememberMe = false) => {
  return api.post('/auth/login', { email, password }, { params: { rememberMe } });
};

// Đăng ký
export const signup = (userData) => {
  return api.post('/users', userData);
};

// Logout
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch {
    console.warn('Logout API failed, proceeding with client cleanup');
  } finally {
    // XÓA TOÀN BỘ dữ liệu người dùng
    localStorage.removeItem('accessToken');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    // Chuyển hướng về login
    await router.push('/login');
  }
};
