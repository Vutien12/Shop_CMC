<template>
  <div class="account-wrapper">
    <Header1 />

    <div class="account-page">
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
          <span>My Wishlist</span>
        </div>

        <!-- Wishlist Section -->
        <section class="wishlist-section">
          <h2>My Wishlist</h2>

          <div class="wishlist-table-wrapper">
            <table class="wishlist-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in wishlistItems" :key="item.id">
                  <td>
                    <div class="product-image">
                      <img :src="item.image" :alt="item.name" />
                    </div>
                  </td>
                  <td>
                    <div class="product-name">{{ item.name }}</div>
                  </td>
                  <td>
                    <div class="product-price">${{ item.price }}</div>
                  </td>
                  <td>
                    <span class="availability-badge" :class="item.availabilityClass">
                      {{ item.availability }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button class="action-btn cart-btn" title="Add to Cart" @click="addToCart(item)">
                        <i class="fa-solid fa-cart-shopping"></i>
                      </button>
                      <button class="action-btn remove-btn" title="Remove" @click="removeItem(item.id)">
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Empty State -->
            <div v-if="wishlistItems.length === 0" class="empty-state">
              <i class="fa-regular fa-heart"></i>
              <h3>Your wishlist is empty</h3>
              <p>Add items you love to your wishlist!</p>
              <router-link to="/product" class="btn-browse">Browse Products</router-link>
            </div>
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

const router = useRouter();
const wishlistItems = ref([]);

// Load wishlist from localStorage
const loadWishlist = () => {
  const saved = localStorage.getItem('userWishlist');
  if (saved) {
    wishlistItems.value = JSON.parse(saved);
  }
};

// Load on component mount
onMounted(() => {
  loadWishlist();
});

const handleLogout = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userEmail');
  window.dispatchEvent(new Event('loginStatusChanged'));
  router.push('/login');
};

const removeItem = (id) => {
  // Remove from local array
  wishlistItems.value = wishlistItems.value.filter(item => item.id !== id);

  // Update localStorage
  localStorage.setItem('userWishlist', JSON.stringify(wishlistItems.value));

  // Dispatch event để cập nhật số lượng wishlist trong header
  window.dispatchEvent(new Event('wishlistChanged'));
};

const addToCart = (item) => {
  // Get current cart from localStorage
  let cart = JSON.parse(localStorage.getItem('userCart') || '[]');

  // Check if product already exists in cart
  const existingItem = cart.find(cartItem => cartItem.id === item.id);

  if (existingItem) {
    // Increase quantity
    existingItem.quantity++;
  } else {
    // Add new item to cart
    const cartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1
    };
    cart.push(cartItem);
  }

  // Save to localStorage
  localStorage.setItem('userCart', JSON.stringify(cart));

  // Dispatch event để cập nhật số lượng cart trong header
  window.dispatchEvent(new Event('cartChanged'));

  // Open cart sidebar
  window.dispatchEvent(new Event('openCart'));
};
</script>

<style src="./Wishlist.css" scoped></style>
