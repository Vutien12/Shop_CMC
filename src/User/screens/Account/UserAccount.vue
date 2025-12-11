<template>
  <div class="account-wrapper">
    <Header />

    <!-- Transition chính -->
    <transition name="fade" mode="out-in">
      <div v-if="isLoading">
        <Loading />
      </div>
      <div v-else class="account-page">
        <!-- Sidebar -->
        <aside class="account-sidebar">
          <nav class="sidebar-nav">
            <router-link to="/account" class="nav-item">
              <i class="fa-solid fa-gauge"></i>
              <span>Dashboard</span>
            </router-link>
            <router-link to="/orders" @mouseenter="prefetch('/orders')" @mouseleave="cancel" class="nav-item">
              <i class="fa-solid fa-cart-shopping"></i>
              <span>My Orders</span>
            </router-link>
            <router-link to="/my-cases" @mouseenter="prefetch('/my-cases')" @mouseleave="cancel" class="nav-item">
              <i class="fa-solid fa-rotate-left"></i>
              <span>My Cases</span>
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
          </div>

          <!-- Recent Orders Section (Lazy Load) -->
          <div ref="ordersTarget">
            <section v-if="ordersVisible" class="orders-section">
              <div class="section-header">
                <h2>Recent Orders</h2>
                <router-link to="/orders" class="view-all">View All</router-link>
              </div>

              <!-- Skeleton -->
              <div v-if="ordersLoading" class="skeleton-table">
                <div class="skeleton-row" v-for="n in 3" :key="n">
                  <div class="skeleton-cell"></div>
                  <div class="skeleton-cell"></div>
                  <div class="skeleton-cell short"></div>
                  <div class="skeleton-cell"></div>
                  <div class="skeleton-cell short"></div>
                  <div class="skeleton-cell action"></div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-else-if="!recentOrders.length" class="empty-state">
                <i class="fa-regular fa-clipboard" style="font-size: 48px; color: #ccc;"></i>
                <p>Chưa có đơn hàng nào gần đây</p>
                <router-link to="/products" class="btn-primary">Mua sắm ngay</router-link>
              </div>

              <!-- Table -->
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
                  <tr v-for="(order, i) in recentOrders" :key="order.id" class="fade-in" :style="{ animationDelay: `${i * 0.1}s` }">
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
                      <router-link :to="`/orderdetail/${order.id}`" class="action-btn">
                        <i class="fa-regular fa-eye"></i>
                      </router-link>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <!-- Account Info Section (Lazy Load) -->
          <div ref="infoTarget">
            <section v-if="infoVisible" class="account-info-section">
              <div class="section-header">
                <h2>Account Information</h2>
                <router-link to="/profile" class="edit-link">Edit</router-link>
              </div>

              <!-- Skeleton Info -->
              <div v-if="infoLoading" class="skeleton-info">
                <div class="info-card">
                  <div class="skeleton-line long"></div>
                  <div class="skeleton-line"></div>
                  <div class="skeleton-line"></div>
                  <div class="skeleton-line short"></div>
                </div>
                <div class="info-card">
                  <div class="skeleton-line long"></div>
                  <div class="skeleton-line long"></div>
                </div>
              </div>

              <!-- Real Info -->
              <div v-else class="info-grid">
                <div class="info-card">
                  <h3>Account Details</h3>
                  <p class="info-item"><strong>Name:</strong> {{ userInfo.name }}</p>
                  <p class="info-item"><strong>Email:</strong> {{ userInfo.email }}</p>
                  <p class="info-item"><strong>Phone:</strong> {{ userInfo.phone }}</p>
                </div>
                <div class="info-card">
                  <h3>Default Shipping Address</h3>
                  <p class="info-item">{{ userInfo.address }}</p>
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
import { useAccountStore } from '@/User/stores/accountStore.js';
import { useAuth } from '@/User/components/useAuth.js';
import { useToast } from '@/User/components/Toast/useToast.js';
import { useLazyLoad } from '@/User/components/LazyLoad/useLazyLoad.js';
import { usePrefetch } from '@/User/stores/usePrefetch.js';
import Chatbot from '@/User/components/Chatbot/Chatbot.vue'

const router = useRouter();
const { handleLogout: authLogout } = useAuth();
const { add: toast } = useToast();
const accountStore = useAccountStore();
const { prefetch, cancel } = usePrefetch();

// State
const isLoading = ref(true);
const recentOrders = ref([]);
const userInfo = ref({});
const ordersLoading = ref(false);
const infoLoading = ref(false);

// Lazy load targets
const ordersTarget = ref(null);
const infoTarget = ref(null);

// Nhận giá trị trả về từ useLazyLoad
const { isVisible: ordersVisible } = useLazyLoad(async () => {
  // Data đã được load ở onMounted, chỉ cần set loading state
  ordersLoading.value = true;
  try {
    // Nếu cache còn, trả về ngay; nếu không thì fetch
    if (recentOrders.value.length === 0) {
      const data = await accountStore.fetchData(false, true);
      recentOrders.value = data.recentOrders;
    }
  } catch {
    toast('Không thể tải đơn hàng. Vui lòng thử lại.', 'error');
  } finally {
    ordersLoading.value = false;
  }
}, ordersTarget);

const { isVisible: infoVisible } = useLazyLoad(async () => {
  // Data đã được load ở onMounted, chỉ cần set loading state
  infoLoading.value = true;
  try {
    // Nếu cache còn, trả về ngay; nếu không thì fetch
    if (!userInfo.value.name) {
      const data = await accountStore.fetchData(false, true);
      userInfo.value = data.userInfo;
    }
  } catch {
    toast('Không thể tải thông tin tài khoản.', 'error');
  } finally {
    infoLoading.value = false;
  }
}, infoTarget);

// Logout
const handleLogout = async () => {
  await authLogout();
  await router.push('/login');
};

// Initial load (cache)
onMounted(async () => {
  try {
    // For dashboard: load both user info and orders
    const data = await accountStore.fetchData(false, true);
    recentOrders.value = data.recentOrders;
    userInfo.value = data.userInfo;
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

<style src="./UserAccount.css" scoped></style>

<style scoped>
/* === TRANSITION === */
.fade-enter-active, .fade-leave-active { transition: all 0.5s ease; }
.fade-enter-from { opacity: 0; transform: translateY(10px); }


/* === SKELETON === */
.skeleton-table, .skeleton-info { pointer-events: none; }
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

.skeleton-line {
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 12px;
}
.skeleton-line.long { width: 80%; }
.skeleton-line.short { width: 50%; }

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* === EMPTY STATE === */
.empty-state {
  text-align: center;
  padding: 40px 20px;
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
  margin-top: 12px;
}
.btn-primary:hover { background: #0056b3; }

/* === ROW ANIMATION === */
.fade-in {
  animation: fadeInRow 0.5s ease forwards;
  opacity: 0;
}

@keyframes fadeInRow {
  to { opacity: 1; transform: translateY(0); }
}
</style>
