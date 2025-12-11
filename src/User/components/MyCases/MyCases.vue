<template>
  <div class="account-wrapper">
    <Header />

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
            <router-link to="/orders" @mouseenter="prefetch('/orders')" @mouseleave="cancel" class="nav-item">
              <i class="fa-solid fa-cart-shopping"></i>
              <span>My Orders</span>
            </router-link>
            <router-link to="/my-cases" class="nav-item">
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
            <i class="fa-solid fa-chevron-right"></i>
            <span>My Cases</span>
          </div>

          <section class="cases-section">
            <div class="section-header">
              <h2>My Cases</h2>
            </div>

            <!-- Skeleton -->
            <div v-if="casesLoading" class="skeleton-table">
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
            <div v-else-if="!cases.length" class="empty-state">
              <i class="fa-solid fa-rotate-left" style="font-size: 48px; color: #ccc;"></i>
              <p>Bạn chưa có yêu cầu nào</p>
              <router-link to="/orders" class="btn-primary">Xem đơn hàng</router-link>
            </div>

            <!-- Cases Table -->
            <div v-else class="cases-table-wrapper">
              <table class="cases-table">
                <thead>
                  <tr>
                    <th>Case ID</th>
                    <th>Order ID</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(caseItem, i) in cases" :key="caseItem.id" class="fade-in" :style="{ animationDelay: `${i * 0.1}s` }">
                    <td>{{ caseItem.id }}</td>
                    <td>{{ caseItem.orderId }}</td>
                    <td><span class="status-badge" :class="getTypeClass(caseItem.type)">{{ getTypeLabel(caseItem.type) }}</span></td>
                    <td><span class="status-badge" :class="getStatusClass(caseItem.status)">{{ getStatusLabel(caseItem.status) }}</span></td>
                    <td>{{ formatDate(caseItem.createdAt) }}</td>
                    <td>
                      <router-link :to="`/case-detail/${caseItem.id}`" class="action-btn">
                        <i class="fa-regular fa-eye"></i>
                      </router-link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
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
import Chatbot from '@/User/components/Chatbot/Chatbot.vue';
import { useAuth } from '@/User/components/useAuth.js';
import { getMyOrderCases } from '@/api/orderCaseApi.js';
import { usePrefetch } from '@/User/stores/usePrefetch.js'
const { prefetch, cancel } = usePrefetch();

const router = useRouter();
const { handleLogout: authLogout } = useAuth();

const isLoading = ref(true);
const casesLoading = ref(false);
const cases = ref([]);

// Load cases
const loadCases = async () => {
  try {
    casesLoading.value = true;
    const response = await getMyOrderCases();
    console.log('Cases response:', response);

    // Check for both 1000 and 200 status codes
    if (response.code === 1000 || response.code === 200) {
      cases.value = response.result || [];
      console.log('Loaded cases:', cases.value);
    }
  } catch (error) {
    console.error('Error loading cases:', error);
  } finally {
    casesLoading.value = false;
  }
};

// Logout
const handleLogout = async () => {
  await authLogout();
  await router.push('/login');
};

// Format date
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// Get type label - Updated for new enum
const getTypeLabel = (type) => {
  const labels = {
    'CANCEL': 'Cancel',
    'REFUND': 'Refund',
    'EXCHANGE': 'Exchange',
    'REQUEST_INFO': 'Request Info'
  };
  return labels[type] || type;
};

// Get type class - Updated for new enum
const getTypeClass = (type) => {
  const classes = {
    'CANCEL': 'type-cancel',
    'REFUND': 'type-refund',
    'EXCHANGE': 'type-exchange',
    'REQUEST_INFO': 'type-info'
  };
  return classes[type] || '';
};

// Get status label
const getStatusLabel = (status) => {
  const labels = {
    'PENDING': 'Pending',
    'REQUESTING_INFO': 'Info Requested',
    'USER_RESPONDED': 'Responded',
    'APPROVED': 'Approved',
    'REJECTED': 'Rejected',
    'RETURNING': 'Returning',
    'RETURNED': 'Returned',
    'REFUNDED': 'Refunded',
    'COMPLETED': 'Completed',
    'CLOSED': 'Closed'
  };
  return labels[status] || status;
};

// Get status class
const getStatusClass = (status) => {
  const classes = {
    'PENDING': 'status-pending',
    'REQUESTING_INFO': 'status-info',
    'USER_RESPONDED': 'status-responded',
    'APPROVED': 'status-approved',
    'REJECTED': 'status-rejected',
    'RETURNING': 'status-returning',
    'RETURNED': 'status-returned',
    'REFUNDED': 'status-refunded',
    'COMPLETED': 'status-completed',
    'CLOSED': 'status-closed'
  };
  return classes[status] || '';
};

onMounted(async () => {
  await loadCases();
  isLoading.value = false;
});
</script>

<style scoped>
/* Import base styles */
@import '@/User/components/MyOrder/MyOrder.css';

/* Cases Section - Same as Orders Section */
.cases-section {
  background-color: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 28px;
  color: #333;
  margin: 0;
}

/* Cases Table - Same style as Orders Table */
.cases-table-wrapper {
  overflow-x: auto;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  margin-top: 15px;
}

.cases-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
}

.cases-table thead {
  background: #f8f9fa;
}

.cases-table th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #333;
  font-size: 14px;
  border-bottom: 2px solid #e0e0e0;
}

.cases-table td {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  color: #666;
}

.cases-table tbody tr {
  transition: background-color 0.2s;
}

.cases-table tbody tr:hover {
  background: #f8f9fa;
}

.cases-table tbody tr:last-child td {
  border-bottom: none;
}

/* Status Badge - Same as MyOrder */
.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

/* Type Badges */
.type-cancel {
  background: #fee2e2;
  color: #991b1b;
}

.type-refund {
  background: #d1fae5;
  color: #065f46;
}

.type-exchange {
  background: #fef3c7;
  color: #92400e;
}

.type-info {
  background: #e0e7ff;
  color: #3730a3;
}

/* Status Badges */
.status-pending {
  background: #fef3c7;
  color: #92400e;
}

.status-approved {
  background: #d1fae5;
  color: #065f46;
}

.status-rejected {
  background: #fee2e2;
  color: #991b1b;
}

.status-info {
  background: #e0e7ff;
  color: #3730a3;
}

.status-responded {
  background: #dbeafe;
  color: #1e40af;
}

.status-completed {
  background: #d1fae5;
  color: #065f46;
}

.status-refunded {
  background: #d1fae5;
  color: #065f46;
}

.status-returning {
  background: #fef3c7;
  color: #92400e;
}

.status-returned {
  background: #dbeafe;
  color: #1e40af;
}

.status-closed {
  background: #f3f4f6;
  color: #6b7280;
}

/* Action Button */
.action-btn {
  background: white;
  border: 1px solid #dee2e6;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #495057;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  min-height: 40px;
}

.action-btn:hover {
  background: #f8f9fa;
  border-color: #007bff;
  color: #007bff;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-state i {
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 16px;
  margin-bottom: 24px;
}

.empty-state .btn-primary {
  background: #0066FF;
  color: white;
  padding: 12px 32px;
  border-radius: 6px;
  text-decoration: none;
  display: inline-block;
  font-weight: 500;
  transition: background 0.3s;
}

.empty-state .btn-primary:hover {
  background: #0052CC;
}

/* Skeleton Loading */
.skeleton-table {
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
  margin-top: 15px;
}

.skeleton-row {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.skeleton-cell {
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  flex: 1;
}

.skeleton-cell.short {
  flex: 0.5;
}

.skeleton-cell.action {
  flex: 0.3;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Fade-in Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

/* Loading Wrapper */
.loading-wrapper {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive */
@media (max-width: 768px) {
  .account-page {
    flex-direction: column;
  }

  .account-sidebar {
    width: 100%;
    padding: 20px 0;
  }

  .sidebar-nav {
    flex-direction: row;
    overflow-x: auto;
    padding: 0 15px;
  }

  .nav-item {
    white-space: nowrap;
    padding: 12px 20px;
  }

  .account-main {
    padding: 20px;
  }

  .cases-table {
    font-size: 13px;
  }

  .cases-table th,
  .cases-table td {
    padding: 12px 8px;
  }
}
</style>

