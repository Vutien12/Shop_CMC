<template>
  <div class="signup-container">
    <Loading v-if="isLoading" />

    <template v-else>
    <!-- Left Side - Illustration -->
    <div class="signup-left">
      <button class="back-button" @click="goBack">
        <font-awesome-icon :icon="['fas', 'arrow-left']" />
      </button>
      <div class="illustration">
        <img src="https://images.unsplash.com/photo-1557821552-17105176677c?w=600&h=800&fit=crop" alt="Shopping Cart" />
      </div>
    </div>

    <!-- Right Side - Register Form -->
    <div class="signup-right">
      <div class="signup-content">
        <!-- Title -->
        <h1 class="register-title">Register</h1>
        <p class="register-subtitle">Enter your details below to create your account.</p>
        <!-- General Error -->
        <div v-if="generalError" class="error-message general-error">
          {{ generalError }}
        </div>
        <!-- Register Form -->
        <form @submit.prevent="handleSignup" class="register-form">
          <!-- General Error -->
          <div v-if="generalError" class="error-message general-error">
            {{ generalError }}
          </div>
            <!-- First Name -->
            <div class="form-group">
              <label>First Name <span class="required">*</span></label>
              <div class="input-wrapper">
                <font-awesome-icon :icon="['fas', 'user']" class="input-icon" />
                <input
                  type="text"
                  v-model="firstName"
                  placeholder="Nguyen"
                  required
                  :class="{ 'error': fieldErrors.firstName }"
                />
              </div>
              <p v-if="fieldErrors.firstName" class="field-error">{{ fieldErrors.firstName }}</p>
            </div>

          <!-- Last Name -->
          <div class="form-group">
            <label>Last Name <span class="required">*</span></label>
            <div class="input-wrapper">
              <font-awesome-icon :icon="['fas', 'user']" class="input-icon" />
              <input
                type="text"
                v-model="lastName"
                placeholder="Van A"
                required
                :class="{ 'error': fieldErrors.lastName }"
              />
            </div>
            <p v-if="fieldErrors.lastName" class="field-error">{{ fieldErrors.lastName }}</p>
          </div>

          <!-- Email -->
          <div class="form-group">
            <label>Email <span class="required">*</span></label>
            <div class="input-wrapper">
              <font-awesome-icon :icon="['fas', 'envelope']" class="input-icon" />
              <input
                type="email"
                v-model="email"
                placeholder="nguyen@example.com"
                required
                :class="{ 'error': fieldErrors.email }"
              />
            </div>
            <p v-if="fieldErrors.email" class="field-error">{{ fieldErrors.email }}</p>
          </div>

          <!-- Phone -->
          <div class="form-group">
            <label>Phone <span class="required">*</span></label>
            <div class="input-wrapper">
              <font-awesome-icon :icon="['fas', 'phone']" class="input-icon" />
              <input
                type="tel"
                v-model="phone"
                placeholder="0987654321"
                required
                :class="{ 'error': fieldErrors.phone }"
              />
            </div>
            <p v-if="fieldErrors.phone" class="field-error">{{ fieldErrors.phone }}</p>
          </div>

          <!-- Password -->
          <div class="form-group">
            <label>Password <span class="required">*</span></label>
            <div class="input-wrapper">
              <font-awesome-icon :icon="['fas', 'lock']" class="input-icon" />
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                placeholder="••••••••••••"
                required
                :class="{ 'error': fieldErrors.password }"
              />
              <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                <font-awesome-icon :icon="['fas', showPassword ? 'eye-slash' : 'eye']" />
              </button>
            </div>
            <p v-if="fieldErrors.password" class="field-error">{{ fieldErrors.password }}</p>
          </div>

          <!-- Confirm Password Input -->
          <div class="form-group">
            <label for="confirmPassword">
              Confirm Password <span class="required">*</span>
            </label>
            <div class="input-wrapper">
              <font-awesome-icon :icon="['fas', 'lock']" class="input-icon" />
              <input
                :type="showPassword ? 'text' : 'password'"
                id="confirmPassword"
                v-model="confirmPassword"
                placeholder="••••••••••••"
                required
                :class="{ 'error': fieldErrors.password }"
              />
              <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                <font-awesome-icon :icon="['fas', showPassword ? 'eye-slash' : 'eye']" />
              </button>
            </div>
            <p v-if="fieldErrors.password" class="field-error">{{ fieldErrors.password }}</p>
          </div>

          <!-- Privacy Policy Checkbox -->
          <div class="form-checkbox">
            <label class="checkbox-label">
              <input type="checkbox" v-model="agreeToPolicy" required />
              <span>I agree to the <a href="#" class="policy-link">Privacy Policy</a></span>
            </label>
          </div>

          <!-- Sign Up Button -->
          <button type="submit" class="btn-signin" :disabled="isSubmitting">
            {{ isSubmitting ? 'Creating...' : 'Sign Up' }}
          </button>

          <!-- Divider -->
          <div class="divider">
            <span>Or</span>
          </div>

          <!-- Social Register Buttons -->
          <div class="social-login" style="display: flex; flex-direction: column; gap: 12px;">
            <button type="button" class="btn-social btn-google" @click="signupWithGoogle">
              <font-awesome-icon :icon="['fab', 'google']" />
              <span>Continue with Google</span>
            </button>
            <button type="button" class="btn-social btn-facebook" @click="signupWithFacebook">
              <font-awesome-icon :icon="['fab', 'facebook']" />
              <span>Continue with Facebook</span>
            </button>
            <button type="button" class="btn-social btn-github" @click="signupWithGithub">
              <font-awesome-icon :icon="['fab', 'github']" />
              <span>Continue with GitHub</span>
            </button>
          </div>

          <!-- Sign In Link -->
          <div class="login-link">
            Already have an account? <a href="#" @click.prevent="goToLogin">Sign in</a>
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
import { OAuthProviders } from '@/Config/oauth.js';
import { signup } from '@/api/authApi.js';

defineOptions({
  name: 'SignupPage'
});

const router = useRouter();
const isLoading = ref(true);
const isSubmitting = ref(false);

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const phone = ref('');
const password = ref('');
const showPassword = ref(false);
const confirmPassword = ref('');
const agreeToPolicy = ref(false);

const { google, facebook, github } = OAuthProviders;

// Errors
const generalError = ref('');
const fieldErrors = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: ''
});

const goBack = () => router.go(-1);
const goToLogin = () => router.push('/login');

const resetErrors = () => {
  generalError.value = '';
  fieldErrors.value = { firstName: '', lastName: '', email: '', phone: '', password: '' };
};

const handleSignup = async () => {
  resetErrors();
  isSubmitting.value = true;

  if (password.value !== confirmPassword.value) {
    fieldErrors.value.password = 'Confirmation password does not match';
    isSubmitting.value = false;
    return;
  }
  if (!agreeToPolicy.value) {
    generalError.value = 'You must agree to the Privacy Policy';
    isSubmitting.value = false;
    return;
  }
  try {
    const payload = {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      password: password.value,
      enabled: true
    };

    const res = await signup(payload);

    if (res.data.code === 200 || res.data.code === 201) {
      alert('Registration successful! Please login.');
      await router.push('/login');
    }
  } catch (err) {
    console.error('Signup error:', err);
    const response = err.response?.data;

    if (response?.code === 400 && response.result) {
      // Validation errors
      Object.keys(response.result).forEach(key => {
        if (Object.hasOwn(fieldErrors.value, key)) {
          fieldErrors.value[key] = response.result[key];
        }
      });
    } else if (response?.code === 409) {
      generalError.value = 'Email already in use.';
    } else {
      generalError.value = response?.message || 'Registration failed. Please try again.!';
    }
  } finally {
    isSubmitting.value = false;
  }
};

// === ĐĂNG KÝ BẰNG GOOGLE ===
const signupWithGoogle = () => {
  const { clientId, redirectUri } = google;
  const scope = 'email profile openid';
  const state = Math.random().toString(36).substring(7);
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

// === ĐĂNG KÝ BẰNG FACEBOOK ===
const signupWithFacebook = () => {
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

// === ĐĂNG KÝ BẰNG GITHUB ===
const signupWithGithub = () => {
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

<style src="./SignUp.css"></style>
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
