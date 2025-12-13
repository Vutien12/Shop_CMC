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
          <h1 class="reset-title">Reset Password</h1>
          <p class="reset-subtitle">Enter the OTP sent to your email and choose a new password.</p>

          <div v-if="generalError" class="error-message general-error">{{ generalError }}</div>

          <form @submit.prevent="handleSubmit" class="reset-form">
            <div class="form-group">
              <label for="email">Email <span class="required">*</span></label>
              <div class="input-wrapper">
                <font-awesome-icon :icon="['fas', 'envelope']" class="input-icon" />
                <input type="email" id="email" v-model="form.email" required />
              </div>
            </div>

            <div class="form-group">
              <label for="otp">OTP <span class="required">*</span></label>
              <div class="input-wrapper">
                <font-awesome-icon :icon="['fas', 'key']" class="input-icon" />
                <input type="text" id="otp" v-model="form.otp" required />
              </div>
            </div>

            <div class="form-group">
              <label for="newPassword">New Password <span class="required">*</span></label>
              <div class="input-wrapper">
                <font-awesome-icon :icon="['fas', 'lock']" class="input-icon" />
                <input :type="showPassword ? 'text' : 'password'" id="newPassword" v-model="form.newPassword" required />
                <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                  <font-awesome-icon :icon="['fas', showPassword ? 'eye-slash' : 'eye']" />
                </button>
              </div>
            </div>

            <button type="submit" class="btn-reset" :disabled="isSubmitting">{{ isSubmitting ? 'Updating...' : 'Update Password' }}</button>
          </form>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Loading from '@/User/components/Loading/Loading.vue';
import { resetPassword } from '@/api/authApi.js';
import { useToast } from '@/User/components/Toast/useToast.js';

const router = useRouter();
const route = useRoute();
const isLoading = ref(true);
const isSubmitting = ref(false);
const showPassword = ref(false);

const { add: addToast } = useToast();

const form = ref({
  email: route.query.email || '',
  otp: '',
  newPassword: ''
});

const generalError = ref('');

const goBack = () => router.go(-1);

const handleSubmit = async () => {
  generalError.value = '';

  // Basic client-side validation
  if (!form.value.email || !form.value.otp || !form.value.newPassword) {
    generalError.value = 'Please fill in all fields.';
    return;
  }

  isSubmitting.value = true;
  try {
    // Backend expects PasswordRequest: { email, otp, newPassword }
    const payload = {
      email: form.value.email,
      otp: form.value.otp,
      newPassword: form.value.newPassword
    };
    const res = await resetPassword(payload);
    if (res.data?.code === 200) {
      addToast(res.data?.result || 'Password updated successfully.', 'success');
      // redirect to login after short delay
      setTimeout(() => router.push('/login'), 1200);
    } else {
      const errMsg = res.data?.message || 'Password update failed.';
      addToast(errMsg, 'error');
      generalError.value = errMsg;
    }
  } catch (err) {
    console.error('Reset password error:', err);
    const response = err.response?.data;
    const errMsg = response?.message || 'Network error. Please try again.';
    addToast(errMsg, 'error');
    if (response?.code === 400 && response.result) {
      generalError.value = response.message || 'Invalid data.';
    } else if (response?.code === 500) {
      generalError.value = response.message || 'Server error.';
    } else {
      generalError.value = 'Network error. Please try again.';
    }
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 300);
});
</script>

<style scoped>
@import './Forgotpass.css';
</style>
