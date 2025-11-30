<template>
  <div class="forgot-container">
    <Loading v-if="isLoading" />

    <template v-else>
    <!-- Left Side - Illustration -->
    <div class="forgot-left">
      <button class="back-button" @click="goBack">
        <font-awesome-icon :icon="['fas', 'arrow-left']" />
      </button>
      <div class="illustration">
        <img src="https://images.unsplash.com/photo-1557821552-17105176677c?w=600&h=800&fit=crop" alt="Shopping Cart" />
      </div>
    </div>

    <!-- Right Side - Reset Password Form -->
    <div class="forgot-right">
      <div class="forgot-content">
        <!-- Title -->
        <h1 class="reset-title">Reset Password</h1>
        <p class="reset-subtitle">Enter your account email to receive an OTP to reset your password.</p>

        <!-- messages -->
        <div v-if="generalError" class="error-message general-error">{{ generalError }}</div>

        <!-- Reset Password Form -->
        <form @submit.prevent="handleResetPassword" class="reset-form">
          <!-- Email Input -->
          <div class="form-group">
            <label for="email">
              Email <span class="required">*</span>
            </label>
            <div class="input-wrapper">
              <font-awesome-icon :icon="['fas', 'envelope']" class="input-icon" />
              <input
                type="email"
                id="email"
                v-model="email"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <!-- Reset Password Button -->
          <button type="submit" class="btn-reset" :disabled="isSubmitting">
            {{ isSubmitting ? 'Sending...' : 'Reset Password' }}
          </button>
        </form>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Loading from '@/User/components/Loading/Loading.vue';
import { forgotPassword } from '@/api/authApi.js';
import { useToast } from '@/User/components/Toast/useToast.js';

defineOptions({ name: 'ForgotPass' });

const { add: addToast } = useToast();
const router = useRouter();
const isLoading = ref(true);
const isSubmitting = ref(false);
const email = ref('');

// UX messages
const generalError = ref('');

const goBack = () => {
  router.go(-1);
};

const handleResetPassword = async () => {
  generalError.value = '';

  if (!email.value) {
    generalError.value = 'Vui lòng nhập email.';
    return;
  }

  isSubmitting.value = true;
  try {
    const res = await forgotPassword(email.value);
    // adapt to API response shape
    if (res.data?.code === 200) {
      // show toast with result message (backend returns message in result)
      addToast(res.data?.result || 'OTP đã được gửi tới email của bạn.', 'success');
      // navigate to reset page and pass email as query so user doesn't need to retype
      await router.push({ path: '/reset-password', query: { email: email.value } });
    } else {
      const errMsg = res.data?.message || 'Gửi yêu cầu thất bại.';
      addToast(errMsg, 'error');
      generalError.value = errMsg;
    }
  } catch (err) {
    console.error('Forgot password error:', err);
    const response = err.response?.data;
    const errMsg = response?.message || 'Lỗi mạng. Vui lòng thử lại.';
    addToast(errMsg, 'error');
    if (response?.code === 400 && response.result) {
      generalError.value = response.result.email || response.message || 'Yêu cầu không hợp lệ.';
    } else if (response?.code === 500) {
      generalError.value = response.message || 'Lỗi máy chủ. Vui lòng thử lại sau.';
    } else {
      generalError.value = 'Lỗi mạng. Vui lòng thử lại.';
    }
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
});
</script>

<style scoped>
@import './Forgotpass.css';
</style>
