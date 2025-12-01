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
    // XÓA TOÀN BỘ dữ liệu người dùng và session
    localStorage.clear(); // Xóa tất cả localStorage
    sessionStorage.clear(); // Xóa tất cả sessionStorage
    
    // Chuyển hướng về login và reload để reset state
    await router.push('/login');
    window.location.reload(); // Force reload để clear tất cả state
  }
};

export const forgotPassword = (email) => {
  return api.post('/auth/forgot-password', null, { params: { email } })
}

export const resetPassword = (payload) => {
  return api.post('/auth/reset-password', payload)
}
