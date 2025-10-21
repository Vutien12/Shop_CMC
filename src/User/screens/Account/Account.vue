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
      <!-- Recent Orders Section -->
      <section class="orders-section">
        <div class="section-header">
          <h2>Recent Orders</h2>
          <a href="#" class="view-all">View All</a>
        </div>

        <div class="orders-table-wrapper">
          <table class="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Tracking</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in recentOrders" :key="order.id">
                <td>{{ order.id }}</td>
                <td>{{ order.date }}</td>
                <td>
                  <span class="status-badge" :class="order.statusClass">
                    {{ order.status }}
                  </span>
                </td>
                <td>{{ order.total }}</td>
                <td>{{ order.tracking }}</td>
                <td>
                  <button class="action-btn">
                    <i class="fa-regular fa-eye"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Account Information Section -->
      <section class="account-info-section">
        <div class="section-header">
          <h2>Account Information</h2>
          <a href="#" class="edit-link">Edit</a>
        </div>

        <div class="info-grid">
          <div class="info-card">
            <h3>Account Details</h3>
            <p class="info-item">
              <strong>Name:</strong> {{ userInfo.name }}
            </p>
            <p class="info-item">
              <strong>Email:</strong> {{ userInfo.email }}
            </p>
            <p class="info-item">
              <strong>Phone:</strong> {{ userInfo.phone }}
            </p>
          </div>

          <div class="info-card">
            <h3>Default Shipping Address</h3>
            <p class="info-item">{{ userInfo.address }}</p>
          </div>
        </div>
      </section>
    </main>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Header1 from '@/User/components/Header/Header1.vue';
import Footer from '@/User/components/Footer/Footer.vue';

const router = useRouter();

const recentOrders = ref([
  {
    id: '2184',
    date: 'Oct 19, 2025',
    status: 'Pending',
    statusClass: 'status-pending',
    total: '$170.00',
    tracking: '-'
  },
  {
    id: '2183',
    date: 'Oct 18, 2025',
    status: 'Pending Payment',
    statusClass: 'status-pending-payment',
    total: 'BDT 170.00',
    tracking: '-'
  },
  {
    id: '2179',
    date: 'Oct 15, 2025',
    status: 'Pending Payment',
    statusClass: 'status-pending-payment',
    total: '$760.00',
    tracking: '-'
  },
  {
    id: '2178',
    date: 'Oct 14, 2025',
    status: 'Pending',
    statusClass: 'status-pending',
    total: '$8.66',
    tracking: '-'
  },
  {
    id: '2172',
    date: 'Oct 12, 2025',
    status: 'Pending',
    statusClass: 'status-pending',
    total: '$824.99',
    tracking: '-'
  }
]);

const userInfo = ref({
  name: 'John Doe',
  email: localStorage.getItem('userEmail') || 'user@email.com',
  phone: '+1 234 567 8900',
  address: '123 Main Street, City, Country, 12345'
});

const handleLogout = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userEmail');
  window.dispatchEvent(new Event('loginStatusChanged'));
  router.push('/login');
};
</script>

<style src="./Account.css" scoped></style>
