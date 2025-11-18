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
            <span>Login / Register</span>
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
            <input type="text" placeholder="Search for products" v-model="searchQuery" />
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
    <nav class="navigation-bar" :class="{ 'mobile-menu-active': menuOpen }">
      <div class="container">
        <!-- Mobile Menu Tabs -->
        <div class="mobile-menu-tabs" v-if="menuOpen">
          <button
            class="menu-tab"
            :class="{ active: activeTab === 'categories' }"
            @click="activeTab = 'categories'"
          >
            Categories
          </button>
          <button
            class="menu-tab"
            :class="{ active: activeTab === 'menu' }"
            @click="activeTab = 'menu'"
          >
            Menu
          </button>
          <button
            class="menu-tab"
            :class="{ active: activeTab === 'more' }"
            @click="activeTab = 'more'"
          >
            More
          </button>
          <button class="close-menu-btn" @click="closeMenu">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Desktop ALL CATEGORIES Button -->
        <button class="all-categories-btn desktop-only">
          <span>ALL CATEGORIES</span>
          <i class="fa-solid fa-bars"></i>
        </button>

        <!-- Menu Content -->
        <div class="nav-links" v-show="!menuOpen || activeTab === 'menu'">
          <router-link to="/" class="nav-link" @click="closeMenu">Home</router-link>
          <router-link to="/product" class="nav-link" @click="closeMenu">Shop</router-link>
          <router-link to="/blog" class="nav-link" @click="closeMenu">Blog</router-link>
          <a href="#" class="nav-link" @click="closeMenu">Buy Now!</a>
        </div>

        <!-- More Content (Mobile Only) -->
        <div class="more-content" v-show="menuOpen && activeTab === 'more'">
          <div class="more-cards">
            <a href="#" class="more-card" @click="closeMenu">
              <div class="more-card-icon">
                <i class="fa-regular fa-envelope"></i>
              </div>
              <span class="more-card-title">Contact</span>
            </a>
            <router-link to="/blog" class="more-card" @click="closeMenu">
              <div class="more-card-icon">
                <i class="fa-regular fa-comment"></i>
              </div>
              <span class="more-card-title">Blog</span>
            </router-link>
          </div>
        </div>

        <!-- Categories Content (Mobile Only) -->
        <div class="categories-content" v-show="menuOpen && activeTab === 'categories'">
          <div class="category-list">
            <a href="#" class="category-item" @click="closeMenu">
              <i class="fa-solid fa-laptop"></i>
              <span>Electronics</span>
            </a>
            <a href="#" class="category-item" @click="closeMenu">
              <i class="fa-solid fa-shirt"></i>
              <span>Fashion</span>
            </a>
            <a href="#" class="category-item" @click="closeMenu">
              <i class="fa-solid fa-house"></i>
              <span>Home & Garden</span>
            </a>
            <a href="#" class="category-item" @click="closeMenu">
              <i class="fa-solid fa-dumbbell"></i>
              <span>Sports</span>
            </a>
          </div>
        </div>
      </div>
    </nav>

    <!-- Cart Sidebar Component -->
    <Cart />
  </div>
</template>

<script>
import Cart from '../Cart/Cart.vue';
import { useCartStore } from '@/User/stores/cartStore.js';
import { useWishlistStore } from '@/User/stores/wishlistStore.js';
import { useAuth } from '@/User/components/useAuth.js';

export default {
  name: 'HeaderMain',
  components: {
    Cart
  },
  setup() {
    const cartStore = useCartStore();
    const wishlistStore = useWishlistStore();
    const { handleLogout } = useAuth();
    return { cartStore, wishlistStore, authLogout: handleLogout };
  },
  data() {
    return {
      menuOpen: false,
      isLoggedIn: false,
      wishlistCount: 0,
      searchQuery: '',
      activeTab: 'menu' // Default tab for mobile menu
    };
  },
  computed: {
    cartCount() {
      return this.cartStore?.itemCount || 0;
    },
    wishlistCountComputed() {
      return this.wishlistStore?.items?.length || 0;
    }
  },
  watch: {
    wishlistCountComputed: {
      handler(val) {
        this.wishlistCount = val;
      },
      immediate: true
    }
  },
  mounted() {
    this.checkLoginStatus();
    if (this.isLoggedIn) {
      this.refreshWishlistCount(true);
    } else {
      this.wishlistCount = 0;
    }
    this.updateCartCount(true);
    window.addEventListener('storage', this.checkLoginStatus);
    window.addEventListener('loginStatusChanged', this.checkLoginStatus);
    window.addEventListener('wishlistChanged', this.refreshWishlistCount);
    window.addEventListener('cartUpdated', this.handleCartUpdated);
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.checkLoginStatus);
    window.removeEventListener('loginStatusChanged', this.checkLoginStatus);
    window.removeEventListener('wishlistChanged', this.refreshWishlistCount);
    window.removeEventListener('cartUpdated', this.handleCartUpdated);
  },
  methods: {
    checkLoginStatus() {
      this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (this.isLoggedIn) {
        this.refreshWishlistCount(true);
      } else {
        this.wishlistCount = 0;
      }
    },
    updateWishlistCount() {
      this.wishlistCount = this.wishlistStore.items.length;
    },
    async updateCartCount(force = false) {
      try {
        await this.cartStore.fetchCart(force);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn('[Header] Failed to refresh cart count', error);
        }
      }
    },
    handleCartUpdated() {
      this.updateCartCount();
    },
    openCart() {
      window.dispatchEvent(new Event('openCart'));
    },
    closeMenu() {
      this.menuOpen = false;
    },
    async refreshWishlistCount(force = false) {
      if (!this.isLoggedIn) {
        this.wishlistCount = 0;
        return;
      }
      try {
        await this.wishlistStore.fetchWishlist(undefined, undefined, force);
        this.wishlistCount = this.wishlistStore.items.length;
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn('[Header] Failed to refresh wishlist', error);
        }
      }
    },
    async handleLogout() {
      try {
        await this.authLogout();
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Logout failed', error);
        }
      } finally {
        this.isLoggedIn = false;
        window.dispatchEvent(new Event('loginStatusChanged'));
        this.$router.push('/login');
      }
    }
  }
};
</script>

<style src="./Header.css"></style>
