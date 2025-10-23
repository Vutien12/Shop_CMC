<template>
  <div class="login-container">
    <Loading v-if="isLoading" />

    <template v-else>
    <!-- Left Side - Illustration -->
    <div class="login-left">
      <button class="back-button" @click="goBack">
        <font-awesome-icon :icon="['fas', 'arrow-left']" />
      </button>
      <div class="illustration">
        <img src="https://images.unsplash.com/photo-1557821552-17105176677c?w=600&h=800&fit=crop" alt="Shopping Cart" />
      </div>
    </div>

    <!-- Right Side - Login Form -->
    <div class="login-right">
      <div class="login-content">
        <h1 class="welcome-title">Welcome</h1>
        <p class="welcome-subtitle">Enter your details below to sign in into your account.</p>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="login-form">
          <!-- Error Message -->
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

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
                placeholder="admin@email.com"
                required
              />
            </div>
          </div>

          <!-- Password Input -->
          <div class="form-group">
            <label for="password">
              Password <span class="required">*</span>
            </label>
            <div class="input-wrapper">
              <font-awesome-icon :icon="['fas', 'lock']" class="input-icon" />
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                placeholder="••••••"
                required
              />
              <button
                type="button"
                class="toggle-password"
                @click="showPassword = !showPassword"
              >
                <font-awesome-icon :icon="['fas', showPassword ? 'eye-slash' : 'eye']" />
              </button>
            </div>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" v-model="rememberMe" />
              <span>Remember me</span>
            </label>
            <a href="#" class="forgot-password" @click.prevent="goToForgotPassword">Forgot password?</a>
          </div>

          <!-- Sign In Button -->
          <button type="submit" class="btn-signin">Sign in</button>

          <!-- Divider -->
          <div class="divider">
            <span>Or</span>
          </div>

          <!-- Social Login Buttons -->
          <div class="social-login">
            <button type="button" class="btn-social btn-google">
              <font-awesome-icon :icon="['fab', 'google']" />
              <span>Sign in with Google</span>
            </button>
            <button type="button" class="btn-social btn-facebook">
              <font-awesome-icon :icon="['fab', 'facebook']" />
              <span>Sign in with Facebook</span>
            </button>
          </div>

          <!-- Sign Up Link -->
          <div class="signup-link">
            Don't have an account? <a href="#" @click.prevent="goToSignup">Sign up</a>
          </div>
        </form>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup>
import { ref, defineOptions, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Loading from '@/User/components/Loading/Loading.vue';

defineOptions({
  name: 'LoginPage'
});

const router = useRouter();
const isLoading = ref(true);
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);
const errorMessage = ref('');

const goBack = () => {
  router.go(-1);
};

const goToSignup = () => {
  router.push('/signup');
};

const goToForgotPassword = () => {
  router.push('/forgotpass');
};

const handleLogin = () => {
  // Xóa thông báo lỗi cũ
  errorMessage.value = '';

  // Lấy danh sách tài khoản từ localStorage (bao gồm cả tài khoản đăng ký mới)
  const registeredAccounts = JSON.parse(localStorage.getItem('userAccounts') || '[]');

  // Dữ liệu tài khoản mẫu mặc định
  const defaultAccounts = [
    { email: 'admin@email.com', password: 'admin123' },
    { email: 'user@email.com', password: 'user123' },
    { email: 'test@email.com', password: 'test123' }
  ];

  // Kết hợp tài khoản mặc định và tài khoản đăng ký
  const allAccounts = [...defaultAccounts, ...registeredAccounts];

  // Kiểm tra tài khoản
  const account = allAccounts.find(
    acc => acc.email === email.value && acc.password === password.value
  );

  if (account) {
    // Đăng nhập thành công
    console.log('Login successful!', { email: email.value });

    // Lưu thông tin đăng nhập
    localStorage.setItem('userEmail', email.value);
    localStorage.setItem('isLoggedIn', 'true');

    // Dispatch custom event để Header cập nhật
    window.dispatchEvent(new Event('loginStatusChanged'));

    // Chuyển đến trang product
    router.push('/product');
  } else {
    // Đăng nhập thất bại
    errorMessage.value = 'Email hoặc mật khẩu không đúng!';
    console.log('Login failed');
  }
};

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
});
</script>

<style src="./Login.css" scoped> </style>
