<template>
  <div class="account-wrapper">
    <Header />

    <!-- Transition toàn trang -->
    <transition name="fade" mode="out-in">
      <div v-if="isLoading" class="loading-wrapper">
        <Loading />
      </div>

      <div v-else class="account-page">
        <!-- Sidebar -->
        <aside class="account-sidebar">
          <nav class="sidebar-nav">
            <router-link to="/account" @mouseenter="prefetch('/account')" @mouseleave="cancel" class="nav-item">
              <i class="fa-solid fa-gauge"></i>
              <span>Dashboard</span>
            </router-link>
            <router-link to="/orders" class="nav-item">
              <i class="fa-solid fa-cart-shopping"></i>
              <span>My Orders</span>
            </router-link>
            <router-link to="/wishlist" @mouseenter="prefetch('/wishlist')" @mouseleave="cancel" class="nav-item">
              <i class="fa-regular fa-heart"></i>
              <span>My Wishlist</span>
            </router-link>
            <router-link to="/addresses" @mouseenter="prefetch('/addresses')" @mouseleave="cancel" class="nav-item">
              <i class="fa-regular fa-address-book"></i>
              <span>My Addresses</span>
            </router-link>
            <router-link to="/profile" @mouseenter="prefetch('/profile')" @mouseleave="cancel" class="nav-item">
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

          <!-- Lazy Load Orders Section -->
          <div ref="ordersTarget">
            <section v-if="ordersVisible" class="orders-section">
              <div class="section-header">
                <h2>My Orders</h2>
              </div>

              <!-- Skeleton -->
              <div v-if="ordersLoading" class="skeleton-table">
                <div class="skeleton-row" v-for="n in 5" :key="n">
                  <div class="skeleton-cell"></div>
                  <div class="skeleton-cell"></div>
                  <div class="skeleton-cell short"></div>
                  <div class="skeleton-cell"></div>
                  <div class="skeleton-cell short"></div>
                  <div class="skeleton-cell action"></div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-else-if="!orders.length" class="empty-state">
                <i class="fa-solid fa-cart-shopping" style="font-size: 48px; color: #ccc;"></i>
                <p>Bạn chưa có đơn hàng nào</p>
                <router-link to="/products" class="btn-primary">Mua sắm ngay</router-link>
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
                  <tr v-for="(order, i) in orders" :key="order.id" class="fade-in" :style="{ animationDelay: `${i * 0.1}s` }">
                    <td>{{ order.id }}</td>
                    <td>{{ order.date }}</td>
                    <td><span class="status-badge" :class="order.statusClass">{{ order.status }}</span></td>
                    <td>{{ order.total }}</td>
                    <td class="transaction-id">{{ order.transaction }}</td>
                    <td>
                      <router-link :to="`/orderdetail/${order.id}`" class="action-btn">
                        <i class="fa-regular fa-eye"></i>
                      </router-link>
                    </td>
                  </tr>
                  </tbody>
                </table>

                <!-- Pagination -->
                <div v-if="totalPages > 1" class="pagination">
                  <button @click="changePage(currentPage - 1)" :disabled="currentPage === 0" class="page-btn prev">
                    <i class="fa-solid fa-chevron-left"></i>
                  </button>
                  <span class="page-info">
                    Page {{ currentPage + 1 }} of {{ totalPages }}
                  </span>
                  <button @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages - 1" class="page-btn next">
                    <i class="fa-solid fa-chevron-right"></i>
                  </button>
                </div>

              </div>
            </section>
          </div>
        </main>
      </div>
    </transition>

    <Footer />
    <Chatbot />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Header from '@/User/components/Header1/Header.vue';
import Footer from '@/User/components/Footer/Footer.vue';
import Loading from '@/User/components/Loading/Loading.vue';
import { useOrderStore } from '@/User/stores/orderStore.js';
import { useAuth } from '@/User/components/useAuth.js';
import { useToast } from '@/User/components/Toast/useToast.js';
import { useLazyLoad } from '@/User/components/LazyLoad/useLazyLoad.js';
import { usePrefetch } from '@/User/stores/usePrefetch.js';
import Chatbot from '@/User/components/Chatbot/Chatbot.vue'

const router = useRouter();
const { handleLogout: authLogout } = useAuth();
const { add: toast } = useToast();
const orderStore = useOrderStore();
const { prefetch, cancel } = usePrefetch();

// State
const isLoading = ref(true);
const orders = ref([]);
const totalPages = ref(0);
const currentPage = ref(0);
const ordersLoading = ref(false);


// Lazy load
const ordersTarget = ref(null);
const { isVisible: ordersVisible } = useLazyLoad(async () => {
  if (orders.value.length) return;
  ordersLoading.value = true;
  try {
    const data = await orderStore.fetchOrders(0);
    orders.value = data.orders;
    totalPages.value = data.totalPages;
    currentPage.value = 0;
  } catch {
    toast('Không thể tải đơn hàng.', 'error');
  } finally {
    ordersLoading.value = false;
  }
}, ordersTarget);

// Pagination
const changePage = async (page) => {
  if (page < 0 || page >= totalPages.value) return;
  ordersLoading.value = true;
  try {
    const data = await orderStore.fetchOrders(page, undefined, true);
    orders.value = data.orders;
    totalPages.value = data.totalPages;
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch {
    toast('Không thể tải trang.', 'error');
  } finally {
    ordersLoading.value = false;
  }
};

// Logout
const handleLogout = async () => {
  await authLogout();
  await router.push('/login');
};


// Initial load
onMounted(async () => {
  try {
    const cached = orderStore.orders.length > 0;
    if (cached) {
      orders.value = orderStore.orders;
      totalPages.value = orderStore.totalPages;
      currentPage.value = orderStore.currentPage;
    } else {
      const data = await orderStore.fetchOrders();
      orders.value = data.orders;
      totalPages.value = data.totalPages;
    }
  } catch (error) {
    if (error.response?.status === 401) {
      toast('Phiên đăng nhập hết hạn.', 'error');
      await handleLogout();
    }
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 600);
  }
});
</script>

<style src="./MyOrder.css" scoped></style>

<style scoped>
/* Reuse từ /account */
.fade-enter-active, .fade-leave-active { transition: all 0.5s ease; }
.fade-enter-from { opacity: 0; transform: translateY(10px); }

.loading-wrapper { min-height: 60vh; display: flex; align-items: center; justify-content: center; }

/* Skeleton */
.skeleton-table { pointer-events: none; }
.skeleton-row { display: flex; gap: 12px; margin-bottom: 12px; }
.skeleton-cell {
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  flex: 1;
}
.skeleton-cell.short { flex: 0.5; }
.skeleton-cell.action { flex: 0.3; }

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}
.empty-state p { margin: 16px 0; font-size: 1.1rem; }
.btn-primary {
  display: inline-block;
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border-radius: 6px;
  text-decoration: none;
}
.btn-primary:hover { background: #0056b3; }

/* Row animation */
.fade-in {
  animation: fadeInRow 0.5s ease forwards;
  opacity: 0;
  transform: translateY(10px);
}

@keyframes fadeInRow {
  to { opacity: 1; transform: translateY(0); }
}
</style>

