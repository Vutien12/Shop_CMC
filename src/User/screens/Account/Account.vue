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
        <div class="breadcrumb">
          <router-link to="/">Home</router-link>
          <i class="fa-solid fa-chevron-right"></i>
          <router-link to="/account">My Account</router-link>
        </div>

        <!-- Recent Orders Section -->
      <section class="orders-section">
        <div class="section-header">
          <h2>Recent Orders</h2>
          <a href="/orders" class="view-all">View All</a>
        </div>

        <div class="orders-table-wrapper">
          <table class="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Transaction</th>
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
                <td class="transaction-id">{{ order.tracking }}</td>
                <td>
                  <router-link :to="`/orders/${order.id}`" class="action-btn">
                    <i class="fa-regular fa-eye"></i>
                  </router-link>
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
          <router-link to="/profile" class="edit-link">Edit</router-link>
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Header1 from '@/User/components/Header/Header1.vue';
import Footer from '@/User/components/Footer/Footer.vue';
import Loading from '@/User/components/Loading/Loading.vue';
import { getRecentOrders, getUserInfo } from '@/api/accountApi.js';
import { logout } from '@/api/authApi.js';

const router = useRouter();

const isLoading = ref(true);
const recentOrders = ref([]);
const userInfo = ref({
  name: '',
  email: '',
  phone: '',
  address: 'Chưa có địa chỉ mặc định'
});

const formatCurrency = (amount, currency = 'VND') => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency
  }).format(amount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const getStatusClass = (status) => {
  const map = {
    PAID: 'status-paid',
    PENDING: 'status-pending',
    PENDING_PAYMENT: 'status-pending-payment',
    CANCELLED: 'status-cancelled'
  };
  return map[status] || 'status-pending';
};

const handleLogout = async () => {
  try {
    await logout();
  } catch {
    console.warn('Logout API failed');
  } finally {
    localStorage.clear();
    window.dispatchEvent(new Event('loginStatusChanged'));
    router.push('/login');
  }
};

onMounted(async () => {
  try {
    const [ordersRes, userRes] = await Promise.all([
      getRecentOrders(0, 5),
      getUserInfo()
    ]);

    // Recent Orders
    recentOrders.value = ordersRes.data.result.content.map(order => ({
      id: order.id,
      date: formatDate(order.createdAt),
      status: order.status.replace('_', ' '),
      statusClass: getStatusClass(order.status),
      total: formatCurrency(order.total, order.currency),
      tracking: order.transactions[0]?.transactionId
        ? `...${order.transactions[0].transactionId.slice(-8)}`
        : '-'
    }));

    // User Info
    const user = userRes.data.result;
    userInfo.value = {
      name: `${user.firstName} ${user.lastName}`.trim(),
      email: user.email,
      phone: user.phone || 'Chưa cập nhật',
      address: user.defaultAddress
        ? `${user.defaultAddress.addressLine}${user.defaultAddress.addressLine2 ? ', ' + user.defaultAddress.addressLine2 : ''}, ${user.defaultAddress.city}, ${user.defaultAddress.country}`
        : 'Chưa có địa chỉ mặc định'
    };

  } catch (error) {
    console.error('Load account data failed:', error);
    if (error.response?.status === 401) handleLogout();
  } finally {
    isLoading.value = false;
  }
});
</script>

<style src="./Account.css" scoped></style>
