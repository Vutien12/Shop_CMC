<template>
  <div class="oauth-callback">
    <Loading />
    <p>{{ statusMessage }}</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Loading from '@/User/components/Loading/Loading.vue';
import jwt_decode from 'jwt-decode';

const router = useRouter();
const statusMessage = ref('Đang xử lý đăng nhập...');

onMounted(async () => {
  const accessToken = new URLSearchParams(window.location.search).get('accessToken');
  if (!accessToken) return router.replace('/login');

  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('isLoggedIn', 'true');
  window.dispatchEvent(new Event('loginStatusChanged'));
  window.history.replaceState({}, '', '/');

  const decoded = jwt_decode(accessToken);
  const target = decoded.scope?.includes('ADMIN') ? '/admin' : '/';

  await router.replace(target);
});
</script>

<style scoped>
.oauth-callback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 1.5rem;
  text-align: center;
  color: #555;
  font-size: 1.1rem;
}

.oauth-callback p {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
