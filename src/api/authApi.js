// src/api/authApi.js
import api from './axiosInstance.js';

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
  } finally {
    localStorage.clear();
    window.location.href = '/login';
  }
};
