<template>
  <div id="fleetcart-store" :class="{ 'menu-open': menuOpen }">
    <!-- Mobile Menu Overlay -->
    <div class="menu-overlay" @click="menuOpen = false" v-if="menuOpen"></div>

    <!-- Top Bar -->
    <div class="top-bar">
      <div class="container">
        <span class="welcome-message">Welcome to FleetCart store</span>
        <div class="top-links">
          <a href="#" class="top-link">
            <i class="fa-regular fa-envelope"></i>
            <span>Contact</span>
          </a>
          <div class="dropdown">
            <span class="dropdown-trigger">
              <i class="fa-solid fa-globe"></i>
              <span>English</span>
              <i class="fa-solid fa-chevron-down"></i>
            </span>
          </div>
          <div class="dropdown">
            <span class="dropdown-trigger">
              <i class="fa-solid fa-dollar-sign"></i>
              <span>USD</span>
              <i class="fa-solid fa-chevron-down"></i>
            </span>
          </div>
          <!-- Login/Logout Link -->
          <router-link v-if="!isLoggedIn" to="/login" class="top-link">
            <i class="fa-regular fa-user"></i>
            <span>Login</span>
          </router-link>
          <router-link v-else to="/account" class="top-link">
            <i class="fa-regular fa-user"></i>
            <span>Account</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Main Header -->
    <header class="header-main">
      <div class="container">
        <!-- Logo -->
        <div class="logo">
          <div class="logo-icon">
            <img src="../../../assets/sidebar-logo-mini copy.svg" alt="FleetCart Logo" />
          </div>
          <span class="logo-text">FleetCart</span>
        </div>

        <!-- Mobile Menu Toggle Button -->
        <button class="mobile-menu-toggle" @click="menuOpen = !menuOpen">
          <i class="fa-solid fa-bars" v-if="!menuOpen"></i>
          <i class="fa-solid fa-xmark" v-else></i>
        </button>

        <!-- Mobile Menu Container -->
        <div class="mobile-menu-container">
          <!-- Search Bar -->
          <div class="search-bar">
            <input type="text" placeholder="Search for products" />
            <div class="category-dropdown">
              <span>All Categories</span>
              <i class="fa-solid fa-chevron-down"></i>
            </div>
            <button class="search-btn">
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>

          <!-- Utility Icons -->
          <div class="utility-icons">
            <router-link to="/wishlist" class="icon-link">
              <i class="fa-regular fa-heart"></i>
              <span class="badge">{{ wishlistCount }}</span>
            </router-link>
            <a href="#" class="icon-link compare-icon">
              <i class="fa-solid fa-repeat"></i>
              <span class="badge">0</span>
            </a>
            <a href="#" class="icon-link" @click.prevent="openCart">
              <i class="fa-solid fa-cart-shopping"></i>
              <span class="badge">{{ cartCount }}</span>
            </a>
          </div>
        </div>
      </div>
    </header>

    <!-- Navigation Bar -->
    <nav class="navigation-bar">
      <div class="container">
        <button class="all-categories-btn">
          <span>ALL CATEGORIES</span>
          <i class="fa-solid fa-bars"></i>
        </button>
        <div class="nav-links">
          <router-link to="/product" class="nav-link">Shop</router-link>
          <router-link to="/blog" class="nav-link">Blog</router-link>
          <a href="#" class="nav-link">Buy Now!</a>
        </div>
      </div>
    </nav>

    <!-- Cart Sidebar Component -->
    <Cart />
  </div>
</template>

<script>
import Cart from '../Cart/Cart.vue';

export default {
  name: 'HeaderMain',
  components: {
    Cart
  },
  data() {
    return {
      menuOpen: false,
      isLoggedIn: false,
      wishlistCount: 0,
      cartCount: 0,
    };
  },
  mounted() {
    // Kiểm tra trạng thái đăng nhập khi component được mount
    this.checkLoginStatus();

    // Cập nhật số lượng wishlist
    this.updateWishlistCount();

    // Cập nhật số lượng cart
    this.updateCartCount();

    // Lắng nghe sự thay đổi trong localStorage
    window.addEventListener('storage', this.checkLoginStatus);

    // Lắng nghe custom event khi đăng nhập/đăng xuất
    window.addEventListener('loginStatusChanged', this.checkLoginStatus);

    // Lắng nghe custom event khi wishlist thay đổi
    window.addEventListener('wishlistChanged', this.updateWishlistCount);

    // Lắng nghe custom event khi cart thay đổi
    window.addEventListener('cartChanged', this.updateCartCount);
  },
  beforeUnmount() {
    // Cleanup listeners
    window.removeEventListener('storage', this.checkLoginStatus);
    window.removeEventListener('loginStatusChanged', this.checkLoginStatus);
    window.removeEventListener('wishlistChanged', this.updateWishlistCount);
    window.removeEventListener('cartChanged', this.updateCartCount);
  },
  methods: {
    checkLoginStatus() {
      this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    },
    updateWishlistCount() {
      const wishlist = JSON.parse(localStorage.getItem('userWishlist') || '[]');
      this.wishlistCount = wishlist.length;
    },
    updateCartCount() {
      const cart = JSON.parse(localStorage.getItem('userCart') || '[]');
      this.cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    },
    openCart() {
      window.dispatchEvent(new Event('openCart'));
    },
    handleLogout() {
      // Xóa thông tin đăng nhập
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userEmail');

      // Cập nhật trạng thái
      this.isLoggedIn = false;

      // Dispatch custom event
      window.dispatchEvent(new Event('loginStatusChanged'));

      // Chuyển về trang login
      this.$router.push('/login');
    }
  }
};
</script>

<style src="./Header.css"></style>
