<template>
  <div class="forgot-container">
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
        <p class="reset-subtitle">Enter your account email to receive a link allowing you to reset your password.</p>

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
          <button type="submit" class="btn-reset">Reset Password</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');

const goBack = () => {
  router.go(-1);
};

const handleResetPassword = () => {
  console.log('Reset password for:', email.value);
  // Add your reset password logic here
  alert('Password reset link has been sent to your email!');
};
</script>

<style scoped>
@import './Forgotpass.css';
</style>
