<template>
  <div class="signup-container">
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

        <!-- Register Form -->
        <form @submit.prevent="handleRegister" class="register-form">
          <!-- Error Message -->
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <!-- Success Message -->
          <div v-if="successMessage" class="success-message">
            {{ successMessage }}
          </div>

          <!-- First Name Input -->
          <div class="form-group">
            <label for="firstName">
              First Name <span class="required">*</span>
            </label>
            <div class="input-wrapper">
              <font-awesome-icon :icon="['fas', 'user']" class="input-icon" />
              <input
                type="text"
                id="firstName"
                v-model="firstName"
                placeholder="First Name"
                required
              />
            </div>
          </div>

          <!-- Last Name Input -->
          <div class="form-group">
            <label for="lastName">
              Last Name <span class="required">*</span>
            </label>
            <div class="input-wrapper">
              <font-awesome-icon :icon="['fas', 'user']" class="input-icon" />
              <input
                type="text"
                id="lastName"
                v-model="lastName"
                placeholder="Last Name"
                required
              />
            </div>
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
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <!-- Phone Input -->
          <div class="form-group">
            <label for="phone">
              Phone <span class="required">*</span>
            </label>
            <div class="input-wrapper">
              <font-awesome-icon :icon="['fas', 'phone']" class="input-icon" />
              <input
                type="tel"
                id="phone"
                v-model="phone"
                placeholder="Phone"
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
                type="password"
                id="password"
                v-model="password"
                placeholder="Password"
                required
              />
            </div>
          </div>

          <!-- Confirm Password Input -->
          <div class="form-group">
            <label for="confirmPassword">
              Confirm Password <span class="required">*</span>
            </label>
            <div class="input-wrapper">
              <font-awesome-icon :icon="['fas', 'lock']" class="input-icon" />
              <input
                type="password"
                id="confirmPassword"
                v-model="confirmPassword"
                placeholder="Confirm Password"
                required
              />
            </div>
          </div>

          <!-- Privacy Policy Checkbox -->
          <div class="form-checkbox">
            <label class="checkbox-label">
              <input type="checkbox" v-model="agreeToPolicy" required />
              <span>I agree to the <a href="#" class="policy-link">Privacy Policy</a></span>
            </label>
          </div>

          <!-- Create Account Button -->
          <button type="submit" class="btn-create">Create Account</button>

          <!-- Divider -->
          <div class="divider">
            <span>Or</span>
          </div>

          <!-- Social Register Buttons -->
          <div class="social-login">
            <button type="button" class="btn-social btn-google">
              <font-awesome-icon :icon="['fab', 'google']" />
              <span>Sign up with Google</span>
            </button>
            <button type="button" class="btn-social btn-facebook">
              <font-awesome-icon :icon="['fab', 'facebook']" />
              <span>Sign up with Facebook</span>
            </button>
          </div>

          <!-- Sign In Link -->
          <div class="signin-link">
            Already Have an Account? <a href="#" @click.prevent="goToLogin">Sign in</a>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const phone = ref('');
const password = ref('');
const confirmPassword = ref('');
const agreeToPolicy = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const goBack = () => {
  router.go(-1);
};

const goToLogin = () => {
  router.push('/login');
};

const handleRegister = () => {
  // Reset messages
  errorMessage.value = '';
  successMessage.value = '';

  // Kiểm tra mật khẩu khớp
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Mật khẩu xác nhận không khớp!';
    return;
  }

  // Kiểm tra độ dài mật khẩu
  if (password.value.length < 6) {
    errorMessage.value = 'Mật khẩu phải có ít nhất 6 ký tự!';
    return;
  }

  // Lấy danh sách tài khoản hiện có từ localStorage
  let accounts = JSON.parse(localStorage.getItem('userAccounts') || '[]');

  // Kiểm tra email đã tồn tại chưa
  const existingAccount = accounts.find(acc => acc.email === email.value);
  if (existingAccount) {
    errorMessage.value = 'Email này đã được đăng ký!';
    return;
  }

  // Tạo tài khoản mới
  const newAccount = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    phone: phone.value,
    password: password.value,
    createdAt: new Date().toISOString()
  };

  // Thêm tài khoản mới vào danh sách
  accounts.push(newAccount);

  // Lưu vào localStorage
  localStorage.setItem('userAccounts', JSON.stringify(accounts));

  console.log('Registration successful!', newAccount);
  successMessage.value = 'Đăng ký thành công! Đang chuyển đến trang đăng nhập...';

  // Chuyển đến trang đăng nhập sau 1.5 giây
  setTimeout(() => {
    router.push('/login');
  }, 1500);
};
</script>

<style src="./SignUp.css"></style>
