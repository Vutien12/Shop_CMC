<template>
  <div class="account-wrapper">
    <Header1 />

    <Loading v-if="isLoading" />

    <div v-else class="account-page">
      <!-- Sidebar -->
      <aside class="account-sidebar">
        <nav class="sidebar-nav">
          <router-link to="/account" class="nav-item">
            <i class="fa-solid fa-gauge"></i>
            <span>Dashboard</span>
          </router-link>
          <router-link to="/orders" class="nav-item">
            <i class="fa-solid fa-cart-shopping"></i>
            <span>My Orders</span>
          </router-link>
          <router-link to="/wishlist" class="nav-item">
            <i class="fa-regular fa-heart"></i>
            <span>My Wishlist</span>
          </router-link>
          <router-link to="/addresses" class="nav-item">
            <i class="fa-regular fa-address-book"></i>
            <span>My Addresses</span>
          </router-link>
          <router-link to="/profile" class="nav-item">
            <i class="fa-regular fa-user"></i>
            <span>My Profile</span>
          </router-link>
          <a href="#" class="nav-item" @click.prevent="handleLogout">
            <i class="fa-solid fa-right-from-bracket"></i>
            <span>Logout</span>
          </a>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="account-main">
        <!-- Breadcrumb -->
        <div class="breadcrumb">
          <router-link to="/">Home</router-link>
          <i class="fa-solid fa-chevron-right"></i>
          <router-link to="/account">My Account</router-link>
          <i class="fa-solid fa-chevron-right"></i>
          <span>My Profile</span>
        </div>

        <!-- Profile Section -->
        <section class="profile-section">
          <h2>My Profile</h2>

          <!-- Profile Form -->
          <div class="profile-form-card">
            <form @submit.prevent="saveProfile" class="profile-form">
              <div class="form-row">
                <div class="form-group">
                  <label>
                    Email <span class="required">*</span>
                  </label>
                  <input
                    type="email"
                    v-model="profileData.email"
                    required
                    class="form-input"
                  />
                </div>
                <div class="form-group">
                  <label>
                    Phone <span class="required">*</span>
                  </label>
                  <input
                    type="tel"
                    v-model="profileData.phone"
                    required
                    class="form-input"
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>
                    First Name <span class="required">*</span>
                  </label>
                  <input
                    type="text"
                    v-model="profileData.firstName"
                    required
                    class="form-input"
                  />
                </div>
                <div class="form-group">
                  <label>
                    Last Name <span class="required">*</span>
                  </label>
                  <input
                    type="text"
                    v-model="profileData.lastName"
                    required
                    class="form-input"
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>
                    Password
                  </label>
                  <input
                    type="password"
                    v-model="profileData.password"
                    placeholder="Leave blank to keep current password"
                    class="form-input"
                  />
                </div>
                <div class="form-group">
                  <label>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    v-model="profileData.confirmPassword"
                    placeholder="Confirm new password"
                    class="form-input"
                  />
                </div>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn-save">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Header1 from '@/User/components/Header/Header1.vue';
import Footer from '@/User/components/Footer/Footer.vue';
import Loading from '@/User/components/Loading/Loading.vue';

const router = useRouter();

const isLoading = ref(true);
const profileData = ref({
  email: '',
  phone: '',
  firstName: '',
  lastName: '',
  password: '',
  confirmPassword: ''
});

// Load profile from localStorage
const loadProfile = () => {
  // Get current logged-in user email
  const userEmail = localStorage.getItem('userEmail');

  if (userEmail) {
    // Get all accounts
    const accounts = JSON.parse(localStorage.getItem('userAccounts') || '[]');

    // Find current user account
    const currentAccount = accounts.find(acc => acc.email === userEmail);

    if (currentAccount) {
      // Load data from registered account
      profileData.value = {
        email: currentAccount.email,
        phone: currentAccount.phone || '',
        firstName: currentAccount.firstName || '',
        lastName: currentAccount.lastName || '',
        password: '',
        confirmPassword: ''
      };
    } else {
      // Fallback: just set email
      profileData.value.email = userEmail;
    }
  }
};

// Save profile
const saveProfile = () => {
  // Validate passwords match if changing password
  if (profileData.value.password || profileData.value.confirmPassword) {
    if (profileData.value.password !== profileData.value.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Validate password length
    if (profileData.value.password.length < 6) {
      alert('Password must be at least 6 characters!');
      return;
    }
  }

  // Get all accounts
  const accounts = JSON.parse(localStorage.getItem('userAccounts') || '[]');
  const userEmail = localStorage.getItem('userEmail');

  // Find current user account index
  const accountIndex = accounts.findIndex(acc => acc.email === userEmail);

  if (accountIndex !== -1) {
    // Update account information
    accounts[accountIndex] = {
      ...accounts[accountIndex],
      firstName: profileData.value.firstName,
      lastName: profileData.value.lastName,
      email: profileData.value.email,
      phone: profileData.value.phone,
      // Only update password if provided
      ...(profileData.value.password && { password: profileData.value.password })
    };

    // Save back to localStorage
    localStorage.setItem('userAccounts', JSON.stringify(accounts));

    // Update current email if changed
    if (userEmail !== profileData.value.email) {
      localStorage.setItem('userEmail', profileData.value.email);
    }

    alert('Profile updated successfully!');

    // Clear password fields
    profileData.value.password = '';
    profileData.value.confirmPassword = '';
  } else {
    alert('Error: User account not found!');
  }
};

// Logout
const handleLogout = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userEmail');
  window.dispatchEvent(new Event('loginStatusChanged'));
  router.push('/login');
};

// Load profile on mount
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
  loadProfile();
});
</script>

<style src="./Profile.css" scoped></style>

