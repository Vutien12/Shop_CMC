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
          <router-link to="/addresses">My Addresses</router-link>
        </div>

        <!-- New Address Section -->
        <section class="address-section">
          <h2>My Addresses</h2>

          <!-- New Address Form -->
          <div class="address-form-card">
            <h3>{{ isEditMode ? 'Edit Address' : 'New Address' }}</h3>

            <form @submit.prevent="saveAddress" class="address-form">
              <div class="form-row">
                <div class="form-group">
                  <label>
                    First Name <span class="required">*</span>
                  </label>
                  <input
                    type="text"
                    v-model="formData.firstName"
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
                    v-model="formData.lastName"
                    required
                    class="form-input"
                  />
                </div>
              </div>

              <div class="form-group">
                <label>
                  Street Address <span class="required">*</span>
                </label>
                <input
                  type="text"
                  v-model="formData.address1"
                  placeholder="Address Line 1"
                  required
                  class="form-input"
                />
                <input
                  type="text"
                  v-model="formData.address2"
                  placeholder="Address Line 2 (optional)"
                  class="form-input mt-2"
                />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>
                    City <span class="required">*</span>
                  </label>
                  <input
                    type="text"
                    v-model="formData.city"
                    required
                    class="form-input"
                  />
                </div>
                <div class="form-group">
                  <label>
                    Postcode / ZIP <span class="required">*</span>
                  </label>
                  <input
                    type="text"
                    v-model="formData.postcode"
                    required
                    class="form-input"
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>
                    Country <span class="required">*</span>
                  </label>
                  <select v-model="formData.country" required class="form-select">
                    <option value="">Please Select</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Vietnam">Vietnam</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>
                    State / Province <span class="required">*</span>
                  </label>
                  <select v-model="formData.state" required class="form-select">
                    <option value="">Please Select</option>
                    <option value="State 1">Hà Nội</option>
                    <option value="State 2">Hồ Chí Minh</option>
                    <option value="State 3">Đà Nẵng</option>
                  </select>
                </div>
              </div>

              <div class="form-actions">
                <button type="button" class="btn-cancel" @click="cancelForm">
                  Cancel
                </button>
                <button type="submit" class="btn-save">
                  Save Address
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
import { useRouter, useRoute } from 'vue-router';
import Header1 from '@/User/components/Header/Header1.vue';
import Footer from '@/User/components/Footer/Footer.vue';

const router = useRouter();
const route = useRoute();

const isEditMode = ref(false);
const editingId = ref(null);

const formData = ref({
  firstName: '',
  lastName: '',
  address1: '',
  address2: '',
  city: '',
  postcode: '',
  country: '',
  state: ''
});

// Load address data if editing
onMounted(() => {
  const addressId = route.params.id;
  if (addressId) {
    isEditMode.value = true;
    editingId.value = parseInt(addressId);

    // Load the address from localStorage
    const addresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
    const addressToEdit = addresses.find(addr => addr.id === editingId.value);

    if (addressToEdit) {
      formData.value = { ...addressToEdit };
    }
  }
});

// Cancel form
const cancelForm = () => {
  router.push('/addresses');
};

// Save address
const saveAddress = () => {
  // Get existing addresses
  const addresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');

  if (isEditMode.value) {
    // Update existing address
    const index = addresses.findIndex(addr => addr.id === editingId.value);
    if (index !== -1) {
      addresses[index] = {
        ...formData.value,
        id: editingId.value
      };
    }
    alert('Address updated successfully!');
  } else {
    // Add new address
    const newAddress = {
      ...formData.value,
      id: Date.now()
    };
    addresses.push(newAddress);
    alert('Address saved successfully!');
  }

  // Save to localStorage
  localStorage.setItem('userAddresses', JSON.stringify(addresses));

  // Redirect back to addresses page
  router.push('/addresses');
};

// Logout
const handleLogout = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userEmail');
  window.dispatchEvent(new Event('loginStatusChanged'));
  router.push('/login');
};
</script>

<style src="./NewAddress.css" scoped></style>
