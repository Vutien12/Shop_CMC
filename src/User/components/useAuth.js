import { ref } from 'vue';
import { logout } from '@/api/authApi.js';

export function useAuth() {
  const isLoggedIn = ref(!!localStorage.getItem('accessToken'));

  const handleLogout = async () => {
    await logout();
    isLoggedIn.value = false;
  };

  return { isLoggedIn, handleLogout };
}
