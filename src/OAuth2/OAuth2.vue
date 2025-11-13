<!-- src/OAuth2/OAuth2.vue -->
<template>
  <div class="callback-container">
    <Loading />
    <p>Đang đăng nhập...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/api/axiosInstance';
import jwt_decode from 'jwt-decode';
import Loading from '@/User/components/Loading/Loading.vue';

const router = useRouter();
const route = useRoute();

onMounted(async () => {
  const code = route.query.code;
  const state = route.query.state;
  const provider = route.path.includes('google') ? 'google' : 'facebook';
  const savedState = localStorage.getItem('oauth_state');

  // Kiểm tra state (chống CSRF)
  if (!code || !state || state !== savedState) {
    alert('Đăng nhập thất bại. Vui lòng thử lại lại.');
    await router.push('/login');
    return;
  }

  localStorage.removeItem('oauth_state');

  try {
    console.log('[OAuth2] Gọi BE:', `/auth/oauth2/callback/${provider}`, { code });
    const res = await api.get(`/auth/oauth2/callback/${provider}`, {
      params: { code },
      withCredentials: true  // BẮT BUỘC: để nhận cookie refreshToken
    });

    console.log('[OAuth2] Response:', res.data);

    // CHECK code === 200
    if (res.data.code === 200 && res.data.result?.accessToken) {
      const { accessToken } = res.data.result;

      // Lưu accessToken
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('isLoggedIn', 'true');

      // Giải mã role
      const decoded = jwt_decode(accessToken);
      const role = decoded.scope || 'ROLE_USER';
      console.log('[OAuth2] Login thành công, role:', role);

      // Redirect
      await router.push(role === 'ROLE_ADMIN' ? '/admin' : '/');

      // Phát sự kiện login
      window.dispatchEvent(new Event('loginStatusChanged'));
    } else {
      throw new Error('Invalid response: missing accessToken');
    }
  } catch (err) {
    console.error('[OAuth2] Lỗi đăng nhập:', err);
    alert('Đăng nhập thất bại. Vui lòng thử lại.');
    await router.push('/login');
  }
});
</script>

<style scoped>
.callback-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 1rem;
}
</style>
