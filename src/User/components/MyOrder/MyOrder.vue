<template>
  <div class="account-wrapper">
    <Header1 />
    <Loading v-if="isLoading" />

    <div v-else class="account-page">
      <!-- Sidebar -->
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
          <i class="fa-solid fa-chevron-right"></i>
          <span>My Orders</span>
        </div>

        <section class="orders-section">
          <div class="section-header">
            <h2>My Orders</h2>
          </div>

          <!-- Empty state -->
          <div v-if="orders.length === 0" class="empty-orders">
            <i class="fa-solid fa-cart-shopping"></i>
            <p>You haven't placed any orders yet</p>
            <router-link to="/home" class="btn-shop">Start Shopping</router-link>
          </div>

          <!-- Orders Table -->
          <div v-else class="orders-table-wrapper">
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
              <tr v-for="order in orders" :key="order.id">
                <td>{{ order.id }}</td>
                <td>{{ order.date }}</td>
                <td>
                    <span class="status-badge" :class="order.statusClass">
                      {{ order.status }}
                    </span>
                </td>
                <td>{{ order.total }}</td>
                <td class="transaction-id">{{ order.transaction }}</td>
                <td>
                  <router-link :to="`/orders/${order.id}`" class="action-btn">
                    <i class="fa-regular fa-eye"></i>
                  </router-link>
                </td>
              </tr>
              </tbody>
            </table>

            <!-- Pagination -->
            <div class="pagination" v-if="totalPages > 1">
              <button @click="changePage(currentPage - 1)" :disabled="currentPage === 0">
                Previous
              </button>
              <span>Page {{ currentPage + 1 }} of {{ totalPages }}</span>
              <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages - 1">
                Next
              </button>
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
import { getOrders } from '@/api/orderApi.js';
import { logout } from '@/api/authApi.js';

const router = useRouter();

const isLoading = ref(true);
const orders = ref([]);
const currentPage = ref(0);
const totalPages = ref(0);
const pageSize = 10;

const formatCurrency = (amount, currency = 'VND') => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency }).format(amount);
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

const loadOrders = async () => {
  try {
    isLoading.value = true;
    const res = await getOrders(currentPage.value, pageSize);
    const data = res.data.result;

    orders.value = data.content.map(order => ({
      id: order.id,
      date: formatDate(order.createdAt),
      status: order.status.replace('_', ' '),
      statusClass: getStatusClass(order.status),
      total: formatCurrency(order.total, order.currency),
      transaction: order.transactions[0]?.transactionId
        ? `...${order.transactions[0].transactionId.slice(-8)}`
        : '-'
    }));

    totalPages.value = data.totalPages;
  } catch (error) {
    console.error('Load orders failed:', error);
    if (error.response?.status === 401) handleLogout();
  } finally {
    isLoading.value = false;
  }
};

const changePage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page;
    loadOrders();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const handleLogout = async () => {
  try {
    await logout();
  } catch {
    console.warn('Logout failed');
  } finally {
    localStorage.clear();
    window.dispatchEvent(new Event('loginStatusChanged'));
    router.push('/login');
  }
};

onMounted(() => {
  loadOrders();
});
</script>

<style src="./MyOrder.css" scoped></style>
