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
            <i class="fa-solid fa-chevron-right"></i>
            <router-link to="/my-cases">My Cases</router-link>
            <i class="fa-solid fa-chevron-right"></i>
            <span>Case #{{ caseId }}</span>
          </div>

          <div v-if="caseDetail" class="case-detail-content">
            <!-- Case Header -->
            <div class="case-header">
              <div class="case-header-left">
                <h2>Case Details</h2>
                <p class="case-id">Case ID: <strong>#{{ caseDetail.id }}</strong></p>
                <p class="case-date">
                  <i class="fa-regular fa-calendar"></i>
                  {{ formatDate(caseDetail.createdAt) }}
                </p>
              </div>
              <div class="case-header-right">
                <span class="status-badge" :class="getStatusClass(caseDetail.status)">
                  {{ getStatusLabel(caseDetail.status) }}
                </span>
              </div>
            </div>

            <!-- Case Info Grid -->
            <div class="case-info-grid">
              <!-- Basic Info -->
              <div class="info-card">
                <h3><i class="fa-solid fa-info-circle"></i> Basic Information</h3>
                <div class="info-content">
                  <div class="info-row">
                    <label>Order ID:</label>
                    <router-link :to="`/orderdetail/${caseDetail.orderId}`" class="order-link">
                      #{{ caseDetail.orderId }}
                    </router-link>
                  </div>
                  <div class="info-row">
                    <label>Type:</label>
                    <span class="type-badge" :class="getTypeClass(caseDetail.type)">
                      {{ getTypeLabel(caseDetail.type) }}
                    </span>
                  </div>
                  <div class="info-row">
                    <label>Status:</label>
                    <span class="status-badge" :class="getStatusClass(caseDetail.status)">
                      {{ getStatusLabel(caseDetail.status) }}
                    </span>
                  </div>
                  <div class="info-row">
                    <label>Created:</label>
                    <span>{{ formatDateTime(caseDetail.createdAt) }}</span>
                  </div>
                  <div class="info-row" v-if="caseDetail.updatedAt">
                    <label>Last Updated:</label>
                    <span>{{ formatDateTime(caseDetail.updatedAt) }}</span>
                  </div>
                </div>
              </div>

              <!-- Refund Info -->
              <div class="info-card" v-if="caseDetail.refundAmount || caseDetail.needReturn !== null">
                <h3><i class="fa-solid fa-money-bill-wave"></i> Refund Information</h3>
                <div class="info-content">
                  <div class="info-row" v-if="caseDetail.refundAmount">
                    <label>Refund Amount:</label>
                    <span class="refund-amount">{{ formatPrice(caseDetail.refundAmount) }}</span>
                  </div>
                  <div class="info-row" v-if="caseDetail.needReturn !== null">
                    <label>Need Return:</label>
                    <span :class="caseDetail.needReturn ? 'text-warning' : 'text-muted'">
                      <template v-if="caseDetail.needReturn">
                        {{ caseDetail.status === 'COMPLETED' ? 'Yes' : 'Yes - Please return the item' }}
                      </template>
                      <template v-else>No</template>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Request Reason -->
            <div class="reason-section">
              <h3><i class="fa-solid fa-message"></i> Your Request</h3>
              <div class="reason-content">
                {{ caseDetail.reason }}
              </div>
            </div>

            <!-- Admin Note -->
            <div v-if="caseDetail.adminNote" class="admin-note-section">
              <h3><i class="fa-solid fa-user-shield"></i> Admin Response</h3>
              <div class="admin-note-content">
                {{ caseDetail.adminNote }}
              </div>
            </div>

            <!-- Response Form (Only if status is REQUESTING_INFO) -->
            <div v-if="caseDetail.status === 'REQUESTING_INFO'" class="response-section">
              <h3><i class="fa-solid fa-reply"></i> Provide Additional Information</h3>
              <p class="response-hint">The admin has requested more information. Please provide the details below.</p>
              <form @submit.prevent="submitResponse">
                <div class="form-group">
                  <label for="responseMessage">Your Response <span class="required">*</span></label>
                  <textarea
                    id="responseMessage"
                    v-model="responseMessage"
                    class="form-control"
                    rows="6"
                    placeholder="Please provide the requested information..."
                    required
                    :disabled="submitting"
                  ></textarea>
                </div>
                <div class="form-actions">
                  <button type="submit" class="btn-primary" :disabled="submitting || !responseMessage.trim()">
                    <i class="fa-solid fa-paper-plane"></i>
                    {{ submitting ? 'Sending...' : 'Send Response' }}
                  </button>
                </div>
              </form>
            </div>


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
import { useRouter, useRoute } from 'vue-router';
import Header from '@/User/components/Header1/Header.vue';
import Footer from '@/User/components/Footer/Footer.vue';
import Loading from '@/User/components/Loading/Loading.vue';
import Chatbot from '@/User/components/Chatbot/Chatbot.vue';
import { useAuth } from '@/User/components/useAuth.js';
import { useToast } from '@/User/components/Toast/useToast.js';
import { getOrderCaseById, respondToCase } from '@/api/orderCaseApi.js';
import { usePrefetch } from '@/User/stores/usePrefetch.js'

const { prefetch, cancel } = usePrefetch();
const router = useRouter();
const route = useRoute();
const { handleLogout: authLogout } = useAuth();
const { add: toast } = useToast();

const caseId = ref(route.params.id);
const isLoading = ref(true);
const caseDetail = ref(null);
const responseMessage = ref('');
const submitting = ref(false);

// Load case detail
const loadCaseDetail = async () => {
  try {
    const response = await getOrderCaseById(caseId.value);
    console.log('Case detail response:', response);

    // Support both code 200 and 1000
    if (response.code === 1000 || response.code === 200) {
      caseDetail.value = response.result;
      console.log('Case detail loaded:', caseDetail.value);
    } else {
      console.error('Unexpected response code:', response.code);
      alert('Failed to load case details');
      await router.push('/my-cases');
    }
  } catch (error) {
    console.error('Error loading case:', error);
    alert('Error loading case details');
    await router.push('/my-cases');
  }
};

// Submit response
const submitResponse = async () => {
  if (!responseMessage.value.trim()) return;

  try {
    submitting.value = true;
    const response = await respondToCase(caseId.value, {
      responseMessage: responseMessage.value
    });

    console.log('Submit response result:', response);

    // Support both code 200 and 1000
    if (response.code === 1000 || response.code === 200) {
      toast('Your response has been sent successfully!', 'success');
      responseMessage.value = '';
      await loadCaseDetail(); // Reload to see updated status
    } else {
      toast(response.message || 'Failed to send response', 'error');
    }
  } catch (error) {
    console.error('Error submitting response:', error);
    toast('Error sending response. Please try again.', 'error');
  } finally {
    submitting.value = false;
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

// Format datetime
const formatDateTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format price
const formatPrice = (amount) => {
  if (!amount) return '0đ';
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
};

// Get type label - Updated for new enum
const getTypeLabel = (type) => {
  const labels = {
    'CANCEL': 'Cancel Order',
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
    'PENDING': 'Pending Review',
    'REQUESTING_INFO': 'Information Requested',
    'USER_RESPONDED': 'Response Submitted',
    'APPROVED': 'Approved',
    'REJECTED': 'Rejected',
    'RETURNING': 'Item Returning',
    'RETURNED': 'Item Returned',
    'REFUNDED': 'Refund Processed',
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
  await loadCaseDetail();
  isLoading.value = false;
});
</script>

<style scoped>
@import '@/User/components/MyOrder/MyOrder.css';

.case-detail-content {
  background: #fff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.case-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 20px;
  border-bottom: 2px solid #f3f4f6;
  margin-bottom: 30px;
}

.case-header-left h2 {
  margin: 0 0 10px 0;
  font-size: 24px;
  color: #111;
}

.case-id {
  font-size: 14px;
  color: #666;
  margin: 5px 0;
}

.case-date {
  font-size: 13px;
  color: #999;
  margin: 5px 0;
}

.case-date i {
  margin-right: 5px;
}

.case-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.info-card {
  background: #f9fafb;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e5e7eb;
}

.info-card h3 {
  font-size: 16px;
  margin: 0 0 15px 0;
  color: #111;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-card h3 i {
  color: #3b82f6;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-row label {
  font-weight: 600;
  color: #666;
  min-width: 120px;
}

.order-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
}

.order-link:hover {
  text-decoration: underline;
}

.refund-amount {
  color: #059669;
  font-weight: 600;
  font-size: 16px;
}

.text-warning {
  color: #f59e0b;
  font-weight: 600;
}

.text-muted {
  color: #9ca3af;
}

.reason-section,
.admin-note-section,
.response-section,
.timeline-section {
  margin-bottom: 30px;
}

.reason-section h3,
.admin-note-section h3,
.response-section h3,
.timeline-section h3 {
  font-size: 18px;
  margin: 0 0 15px 0;
  color: #111;
  display: flex;
  align-items: center;
  gap: 8px;
}

.reason-content,
.admin-note-content {
  background: #f9fafb;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  line-height: 1.6;
  color: #374151;
}

.admin-note-content {
  background: #eff6ff;
  border-color: #bfdbfe;
}

.response-hint {
  color: #666;
  margin-bottom: 15px;
  font-size: 14px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
}

.required {
  color: #ef4444;
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-control:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-control:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: 12px;
}

.btn-primary {
  padding: 12px 24px;
  background-color: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e5e7eb;
}

.timeline-item {
  position: relative;
  padding-bottom: 20px;
}

.timeline-marker {
  position: absolute;
  left: -26px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3b82f6;
  border: 3px solid #fff;
  box-shadow: 0 0 0 2px #e5e7eb;
}

.timeline-content {
  background: #f9fafb;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.timeline-title {
  font-weight: 600;
  color: #111;
  margin-bottom: 4px;
}

.timeline-date {
  font-size: 13px;
  color: #666;
}

.timeline-status {
  font-size: 12px;
  color: #3b82f6;
  margin-top: 4px;
}

/* Badge Styles */
.type-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.type-cancel {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #991b1b;
  border: 1px solid #fca5a5;
}

.type-refund {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
  border: 1px solid #6ee7b7;
}

.type-exchange {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
  border: 1px solid #fcd34d;
}

.type-info {
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  color: #3730a3;
  border: 1px solid #a5b4fc;
}

.status-info {
  background-color: #e0e7ff;
  color: #3730a3;
}

.status-responded {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-returning {
  background-color: #fef3c7;
  color: #92400e;
}

.status-returned {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-refunded {
  background-color: #d1fae5;
  color: #065f46;
}

.status-closed {
  background-color: #f3f4f6;
  color: #6b7280;
}
</style>

