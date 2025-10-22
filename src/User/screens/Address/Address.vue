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
          <span>My Addresses</span>
        </div>

        <!-- Address Section -->
        <section class="address-section">
          <h2>My Addresses</h2>

          <!-- Address List -->
          <div class="address-list">
            <!-- Add New Address Button -->
            <button class="btn-add-address" @click="goToNewAddress">
              <i class="fa-solid fa-plus"></i>
              Add New Address
            </button>

            <!-- Address Cards -->
            <div v-if="addresses.length > 0" class="address-grid">
              <div v-for="address in addresses" :key="address.id" class="address-card">
                <div class="address-content">
                  <h4>{{ address.firstName }} {{ address.lastName }}</h4>
                  <p class="address-text">
                    {{ address.address1 }}<br v-if="address.address1" />
                    <span v-if="address.address2">{{ address.address2 }}<br /></span>
                    {{ address.city }}, {{ address.state }} {{ address.postcode }}<br />
                    {{ address.country }}
                  </p>
                </div>
                <div class="address-actions">
                  <button class="action-btn delete-btn" @click="deleteAddress(address.id)" title="Delete">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="empty-state">
              <i class="fa-regular fa-address-book"></i>
              <h3>No addresses found</h3>
              <p>Add your first address to get started</p>
            </div>
          </div>
        </section>
      </main>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, defineOptions } from 'vue';
import { useRouter } from 'vue-router';
import Header1 from '@/User/components/Header/Header1.vue';
import Footer from '@/User/components/Footer/Footer.vue';

defineOptions({
  name: 'UserAddress'
});

const router = useRouter();
const addresses = ref([]);

// Load addresses from localStorage
const loadAddresses = () => {
  const saved = localStorage.getItem('userAddresses');
  if (saved) {
    addresses.value = JSON.parse(saved);
  }
};

// Go to new address page
const goToNewAddress = () => {
  router.push('/new-address');
};

// Delete address
const deleteAddress = (id) => {
  if (confirm('Are you sure you want to delete this address?')) {
    addresses.value = addresses.value.filter(addr => addr.id !== id);
    localStorage.setItem('userAddresses', JSON.stringify(addresses.value));
  }
};

// Logout
const handleLogout = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userEmail');
  window.dispatchEvent(new Event('loginStatusChanged'));
  router.push('/login');
};

// Load addresses on mount
onMounted(() => {
  loadAddresses();
});
</script>

<style src="./Address.css" scoped></style>

