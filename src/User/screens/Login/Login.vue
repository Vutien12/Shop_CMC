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

          <!-- General Error Message (401, etc.) -->
          <div v-if="generalError" class="error-message general-error">
            {{ generalError }}
          </div>

          <!-- Login Form -->
          <form @submit.prevent="handleLogin" class="login-form">
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
                  :class="{ 'error': fieldErrors.email }"
                />
              </div>
              <p v-if="fieldErrors.email" class="field-error">{{ fieldErrors.email }}</p>
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
                  placeholder="••••••••••••"
                  required
                  :class="{ 'error': fieldErrors.password }"
                />
                <button
                  type="button"
                  class="toggle-password"
                  @click="showPassword = !showPassword"
                >
                  <font-awesome-icon :icon="['fas', showPassword ? 'eye-slash' : 'eye']" />
                </button>
              </div>
              <p v-if="fieldErrors.password" class="field-error">{{ fieldErrors.password }}</p>
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
            <button type="submit" class="btn-signin" :disabled="isSubmitting">
              {{ isSubmitting ? 'Signing in...' : 'Sign in' }}
            </button>

            <!-- Divider -->
            <div class="divider">
              <span>Or</span>
            </div>

            <!-- Social Login Buttons -->
            <div class="social-login" style="display: flex; flex-direction: column; gap: 16px; width: 100%; margin-bottom: 14px;">
              <button type="button" class="btn-social btn-google" @click="loginWithGoogle">
                <font-awesome-icon :icon="['fab', 'google']" />
                <span>Sign in with Google</span>
              </button>
              <button type="button" class="btn-social btn-facebook" @click="loginWithFacebook">
                <font-awesome-icon :icon="['fab', 'facebook']" />
                <span>Sign in with Facebook</span>
              </button>
              <button type="button" class="btn-social btn-github" @click="loginWithGithub">
                <font-awesome-icon :icon="['fab', 'github']" />
                <span>Sign in with GitHub</span>
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Loading from '@/User/components/Loading/Loading.vue';
import jwt_decode from "jwt-decode";
import { OAuthProviders } from '@/Config/oauth.js'
import { login } from '@/api/authApi.js'

defineOptions({
  name: 'LoginPage'
});

const router = useRouter();
const isLoading = ref(true);
const isSubmitting = ref(false);

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);

const { google, facebook, github } = OAuthProviders;

// Lỗi chung (401, server error)
const generalError = ref('');

// Lỗi theo field (400 validation)
const fieldErrors = ref({
  email: '',
  password: ''
});

const goBack = () => {
  router.go(-1);
};

const goToSignup = () => {
  router.push('/signup');
};

const goToForgotPassword = () => {
  router.push('/forgotpass');
};

// Reset errors
const resetErrors = () => {
  generalError.value = '';
  fieldErrors.value = { email: '', password: '' };
};

const handleLogin = async () => {
  resetErrors();
  isSubmitting.value = true;

  try {
    const res = await login(email.value, password.value, rememberMe.value);

    if (res.data.code === 200) {
      const { accessToken } = res.data.result;

      // Lưu accessToken vào localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('userEmail', email.value);
      localStorage.setItem('isLoggedIn', 'true');

      // Giải mã token để lấy role
      const decoded = jwt_decode(accessToken);
      const role = decoded.scope; // "ROLE_ADMIN" hoặc "ROLE_USER"

      // Chuyển hướng theo role
      if (role === 'ROLE_ADMIN') {
        await router.push('/admin'); // trang dashboard admin
      } else {
        await router.push('/home'); // trang user bình thường
      }
      window.dispatchEvent(new Event('loginStatusChanged'));
    }
  } catch (err) {
    console.error('Login error:', err);
    const response = err.response?.data;
    if (response?.code === 400 && response.result) {
      // Validation errors → gán vào từng field
      fieldErrors.value.email = response.result.email || '';
      fieldErrors.value.password = response.result.password || '';
    } else if (response?.code === 401) {
      // Lỗi xác thực → thông báo chung
      generalError.value = response.message || 'Email hoặc mật khẩu không đúng.';
    } else {
      generalError.value = 'Đăng nhập thất bại. Vui lòng thử lại!';
    }
  } finally {
    isSubmitting.value = false;
  }
};


// Thêm vào <script setup>
const loginWithGoogle = () => {
  const { clientId, redirectUri } = google;
  const scope = 'email profile openid';
  const state = Math.random().toString(36).substring(7); // chống CSRF
  localStorage.setItem('oauth_state', state);

  const url = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `response_type=code&` +
    `scope=${encodeURIComponent(scope)}&` +
    `state=${state}&` +
    `access_type=offline&prompt=consent`;
  window.location.href = url;
};

const loginWithFacebook = () => {
  const { clientId, redirectUri } = facebook;
  const scope = 'email,public_profile';
  const state = Math.random().toString(36).substring(7);
  localStorage.setItem('oauth_state', state);

  const url = `https://www.facebook.com/v20.0/dialog/oauth?` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `response_type=code&` +
    `scope=${scope}&` +
    `state=${state}`;
  window.location.href = url;
};

const loginWithGithub = () => {
  const { clientId, redirectUri } = github;
  const scope = 'read:user user:email';
  const state = Math.random().toString(36).substring(7);
  localStorage.setItem('oauth_state', state);

  const url = `https://github.com/login/oauth/authorize?` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=${encodeURIComponent(scope)}&` +
    `state=${state}`;
  window.location.href = url;
};

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
});
</script>

<style src="./Login.css" scoped></style>

<style scoped>
/* Thêm style cho lỗi */
.field-error {
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  margin-bottom: 0;
}

.general-error {
  background-color: #fee;
  color: #c53030;
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.input-wrapper input.error {
  border-color: #e74c3c;
  box-shadow: 0 0 0 1px #e74c3c;
}

.btn-signin:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
