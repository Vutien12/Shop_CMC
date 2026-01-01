import api, { stopAutoRefresh } from '@/api/axiosInstance.js';
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
    stopAutoRefresh();
    localStorage.clear();
    sessionStorage.clear();
    await router.push('/login');
    window.location.reload();
  }
};

export const forgotPassword = (email) => {
  return api.post('/auth/forgot-password', null, { params: { email } })
}

export const resetPassword = (payload) => {
  return api.post('/auth/reset-password', payload)
}
