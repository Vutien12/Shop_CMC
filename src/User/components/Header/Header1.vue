<template>
  <header class="header-main">
    <!-- Top Bar -->
    <div class="top-bar">
      <div class="container">
        <div class="top-links">
          <router-link to="/contact" class="top-link">
            <i class="las la-envelope"></i>
            <span>Contact</span>
          </router-link>
          <div class="dropdown">
            <span class="dropdown-trigger">
              <i class="las la-language"></i>
              <span>English</span>
              <i class="fa-solid fa-chevron-down"></i>
            </span>
          </div>
          <div class="dropdown">
            <span class="dropdown-trigger">
              <i class="las la-money-bill"></i>
              <span>USD</span>
              <i class="fa-solid fa-chevron-down"></i>
            </span>
          </div>
          <!-- Login/Logout Link -->
          <router-link v-if="!isLoggedIn" to="/login" class="top-link">
            <i class="las la-sign-in-alt"></i>
            <span>Login / Register</span>
          </router-link>
          <router-link v-else to="/account" class="top-link">
            <i class="las la-user"></i>
            <span>Account</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Top Section: Logo, Search, Icons -->
    <div class="header-top">
      <div class="container">
        <!-- Mobile Menu Button -->
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <i class="fa-solid fa-bars"></i>
        </button>

        <!-- Logo -->
        <div class="logo-section">
          <router-link to="/" class="logo-link">
            <div class="logo-icon">
              <i class="material-icons">shopping_cart</i>
            </div>
            <span class="logo-text">CMC SHOP</span>
          </router-link>
        </div>

        <!-- Mobile Search Button -->
        <button class="mobile-search-btn">
          <i class="material-icons">search</i>
        </button>

        <!-- Search Bar -->
        <div class="search-section">
          <div class="search-wrapper">
            <input
              type="text"
              class="search-input"
              placeholder="Search for products"
              v-model="searchQuery"
              @keyup.enter="handleSearch"
            />
            <button class="search-btn" @click="handleSearch">
              <i class="material-icons">search</i>
            </button>
          </div>
        </div>

        <!-- Action Icons -->
        <div class="actions-section">
          <!-- Cart -->
          <router-link to="/cart" class="action-icon action-btn">
            <i class="fa-solid fa-cart-shopping"></i>
            <span class="action-text">Giỏ hàng</span>
            <span class="badge" v-if="cartCount > 0">{{ cartCount }}</span>
          </router-link>

          <!-- User Account -->
          <div class="action-icon action-btn user-menu" @click="toggleUserMenu">
            <i class="fa-regular fa-user"></i>
            <span class="action-text">Đăng nhập</span>
            <span class="badge" v-if="isLoggedIn">1</span>

            <!-- Dropdown Menu -->
            <div class="dropdown-menu" v-if="showUserMenu">
              <template v-if="isLoggedIn">
                <router-link to="/profile" class="dropdown-item">
                  <i class="material-icons">account_circle</i>
                  <span>My Account</span>
                </router-link>
                <router-link to="/orders" class="dropdown-item">
                  <i class="material-icons">inventory_2</i>
                  <span>My Orders</span>
                </router-link>
                <button @click="handleLogout" class="dropdown-item">
                  <i class="material-icons">logout</i>
                  <span>Logout</span>
                </button>
              </template>
              <template v-else>
                <router-link to="/login" class="dropdown-item">
                  <i class="material-icons">login</i>
                  <span>Login</span>
                </router-link>
                <router-link to="/signup" class="dropdown-item">
                  <i class="material-icons">person_add</i>
                  <span>Sign Up</span>
                </router-link>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation Bar -->
    <div class="header-bottom desktop-only">
      <div class="container">
        <div class="nav-wrapper">
          <button class="all-categories-btn">
            <span>ALL CATEGORIES</span>
            <i class="fa-solid fa-bars"></i>
          </button>
          <nav class="bottom-nav">
            <router-link to="/" class="nav-item">Home</router-link>
            <router-link to="/shop" class="nav-item">Shop</router-link>
            <router-link to="/blog" class="nav-item">Blog</router-link>
            <router-link to="/about" class="nav-item">About</router-link>
          </nav>
        </div>
      </div>
    </div>

    <!-- Mobile Sidebar -->
    <div class="mobile-sidebar" :class="{ active: showMobileMenu }">
      <div class="mobile-sidebar-overlay" @click="toggleMobileMenu"></div>
      <div class="mobile-sidebar-content">
        <!-- Mobile Tabs -->
        <div class="mobile-tabs">
          <button
            class="mobile-tab"
            :class="{ active: activeTab === 'categories' }"
            @click="activeTab = 'categories'"
          >
            Categories
          </button>
          <button
            class="mobile-tab"
            :class="{ active: activeTab === 'menu' }"
            @click="activeTab = 'menu'"
          >
            Menu
          </button>
          <button
            class="mobile-tab"
            :class="{ active: activeTab === 'more' }"
            @click="activeTab = 'more'"
          >
            More
          </button>
          <button class="mobile-close-btn" @click="toggleMobileMenu">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>

        <!-- Tab Content -->
        <div class="mobile-tab-content">
          <!-- Categories Tab -->
          <div class="tab-panel" v-if="activeTab === 'categories'">
            <router-link to="/shop?category=electronics" class="mobile-menu-item" @click="toggleMobileMenu">
              <i class="fa-solid fa-laptop"></i>
              <span>Electronics</span>
            </router-link>
            <router-link to="/shop?category=fashion" class="mobile-menu-item" @click="toggleMobileMenu">
              <i class="fa-solid fa-shirt"></i>
              <span>Fashion</span>
            </router-link>
            <router-link to="/shop?category=sports" class="mobile-menu-item" @click="toggleMobileMenu">
              <i class="fa-solid fa-basketball"></i>
              <span>Sports</span>
            </router-link>
          </div>

          <!-- Menu Tab -->
          <div class="tab-panel" v-if="activeTab === 'menu'">
            <router-link to="/shop" class="mobile-menu-item" @click="toggleMobileMenu">
              <span>Shop</span>
            </router-link>
            <router-link to="/blog" class="mobile-menu-item" @click="toggleMobileMenu">
              <span>Blog</span>
            </router-link>
            <router-link to="/buy-now" class="mobile-menu-item" @click="toggleMobileMenu">
              <span>Buy Now!</span>
            </router-link>
          </div>

          <!-- More Tab -->
          <div class="tab-panel" v-if="activeTab === 'more'">
            <router-link to="/about" class="mobile-menu-item" @click="toggleMobileMenu">
              <i class="fa-solid fa-circle-info"></i>
              <span>About</span>
            </router-link>
            <router-link to="/contact" class="mobile-menu-item" @click="toggleMobileMenu">
              <i class="fa-solid fa-envelope"></i>
              <span>Contact</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/User/stores/cartStore';
import { useAuth } from '@/User/components/useAuth';

const router = useRouter();
const cartStore = useCartStore();
const { logout } = useAuth();

// State
const searchQuery = ref('');
const showUserMenu = ref(false);
const isLoggedIn = ref(false);
const showMobileMenu = ref(false);
const activeTab = ref('menu');

// Computed
const cartCount = computed(() => cartStore.items?.length || 0);

// Methods
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/shop',
      query: { q: searchQuery.value }
    });
  }
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
  if (showMobileMenu.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

const handleLogout = () => {
  logout();
  showUserMenu.value = false;
  router.push('/login');
};

const handleClickOutside = (event) => {
  if (!event.target.closest('.user-menu')) {
    showUserMenu.value = false;
  }
};

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  // Check login status
  const token = localStorage.getItem('token');
  isLoggedIn.value = !!token;

  // Listen for login status changes
  window.addEventListener('storage', checkLoginStatus);
  window.addEventListener('loginStatusChanged', checkLoginStatus);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('storage', checkLoginStatus);
  window.removeEventListener('loginStatusChanged', checkLoginStatus);
});

const checkLoginStatus = () => {
  const token = localStorage.getItem('token');
  isLoggedIn.value = !!token || localStorage.getItem('isLoggedIn') === 'true';
};
</script>

<style scoped>
@import './Header.css';
</style>
