<template>
  <div id="fleetcart-store" :class="{ 'menu-open': menuOpen }">
    <!-- Mobile Menu Overlay -->
    <div class="menu-overlay" @click="menuOpen = false" v-if="menuOpen"></div>

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
            </span>
          </div>
          <div class="dropdown">
            <span class="dropdown-trigger">
              <i class="las la-money-bill"></i>
              <span>VNĐ</span>
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

    <!-- Main Header -->
    <header class="header-main">
      <div class="container">
        <!-- Logo -->
        <div class="logo">
          <div class="logo-icon">
            <img src="../../../assets/sidebar-logo-mini copy.svg" alt="ShopCMC Logo" />
          </div>
          <span class="logo-text">ShopCMC</span>
        </div>

        <!-- Mobile Menu Toggle Button -->
        <button class="mobile-menu-toggle" @click="menuOpen = !menuOpen">
          <svg v-if="!menuOpen" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="24" height="24">
            <path d="M 3 9 A 1.0001 1.0001 0 1 0 3 11 L 47 11 A 1.0001 1.0001 0 1 0 47 9 L 3 9 z M 3 24 A 1.0001 1.0001 0 1 0 3 26 L 47 26 A 1.0001 1.0001 0 1 0 47 24 L 3 24 z M 3 39 A 1.0001 1.0001 0 1 0 3 41 L 47 41 A 1.0001 1.0001 0 1 0 47 39 L 3 39 z"></path>
          </svg>
          <i class="fa-solid fa-xmark" v-else></i>
        </button>

        <!-- Mobile Menu Container -->
        <div class="mobile-menu-container">
          <!-- Search Bar -->
          <div class="search-bar">
            <input
              type="text"
              placeholder="Search for products"
              v-model="searchQuery"
              @keyup.enter="handleSearch"
            />
            <button class="search-btn" @click="handleSearch">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M22 22L20 20" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </button>
          </div>

          <!-- Utility Icons -->
          <div class="utility-icons">
            <a href="#" class="icon-link compare-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3.58008 5.15991H17.4201C19.0801 5.15991 20.4201 6.49991 20.4201 8.15991V11.4799" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M6.74008 2L3.58008 5.15997L6.74008 8.32001" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M20.4201 18.84H6.58008C4.92008 18.84 3.58008 17.5 3.58008 15.84V12.52" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M17.26 21.9999L20.42 18.84L17.26 15.6799" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
              <span class="badge">0</span>
            </a>
            <router-link to="/wishlist" class="icon-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
              <span class="badge">{{ wishlistCount }}</span>
            </router-link>
            <a href="#" class="icon-link" @click.prevent="openCart">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7.5 7.67001V6.70001C7.5 4.45001 9.31 2.24001 11.56 2.03001C14.24 1.77001 16.5 3.88001 16.5 6.51001V7.89001" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M9.00001 22H15C19.02 22 19.74 20.39 19.95 18.43L20.7 12.43C20.97 9.99 20.27 8 16 8H8.00001C3.73001 8 3.03001 9.99 3.30001 12.43L4.05001 18.43C4.26001 20.39 4.98001 22 9.00001 22Z" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
              <span class="badge">{{ cartCount }}</span>
            </a>
          </div>
        </div>
      </div>
    </header>

    <!-- Navigation Bar -->
    <nav class="navigation-bar" :class="{ 'mobile-menu-active': menuOpen }">
      <div class="container">
        <div class="nav-wrapper">
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
            <i class="las la-bars"></i>
          </button>

          <!-- Menu Content -->
          <div class="nav-links" v-show="!menuOpen || activeTab === 'menu'">
            <router-link to="/" class="nav-link" @click="closeMenu">Home</router-link>
            <router-link to="/product" class="nav-link" @click="closeMenu">Shop</router-link>
            <router-link to="/blog" class="nav-link" @click="closeMenu">Blog</router-link>

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
            <router-link
              v-for="category in categories"
              :key="category.id"
              :to="`/products?category=${category.id}`"
              class="category-item"
              @click="closeMenu"
            >
              <i class="fa-solid fa-folder"></i>
              <span>{{ category.name }}</span>
            </router-link>
            <div v-if="categories.length === 0" class="no-categories">
              <p>No categories available</p>
            </div>
          </div>
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
import { getCategories } from '@/api/categoryApi.js';

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
      activeTab: 'menu',
      categories: []
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
    this.fetchCategories();
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
      // Only fetch cart if user is logged in
      if (!this.isLoggedIn) {
        return;
      }
      try {
        await this.cartStore.fetchCart(force);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn('[Header] Failed to refresh cart count', error);
        }
      }
    },
    handleCartUpdated() {
      this.updateCartCount(true); // Force refresh to get latest cart data
    },
    openCart() {
      if (!this.isLoggedIn) {
        this.$router.push('/login');
        return;
      }
      window.dispatchEvent(new Event('openCart'));
    },
    closeMenu() {
      this.menuOpen = false;
    },
    async fetchCategories() {
      try {
        const response = await getCategories();
        this.categories = response.data || [];
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        this.categories = [];
      }
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
    },
    handleSearch() {
      if (this.searchQuery && this.searchQuery.trim()) {
        this.$router.push({
          path: '/product',
          query: { keyword: this.searchQuery.trim() }
        });
        this.searchQuery = '';
        this.closeMenu();
      }
    }
  }
};
</script>

<style src="./Header.css"></style>
<style scoped>
.close-menu-btn {
  position: fixed; /* Ensure it is positioned relative to the viewport */
  top: 10px; /* Adjust to a visible location */
  right: 10px; /* Adjust to a visible location */
  z-index: 1100 !important; /* Higher than navigation-bar */
  background: #fff; /* Ensure it contrasts with the background */
  border: none;
  padding: 10px;
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.navigation-bar {
  width: 96%; /* Existing width */
  z-index: 1000; /* Ensure it's below close-menu-btn */
  border-radius: 5px;
}
</style>
