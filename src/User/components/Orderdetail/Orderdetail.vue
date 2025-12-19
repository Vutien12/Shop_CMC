<template>
  <div class="order-detail-wrapper">
    <Header />

    <transition name="fade" mode="out-in">
      <div v-if="isLoading" class="loading-wrapper">
        <Loading />
      </div>

      <div v-else class="order-detail-page">
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
        <main class="order-detail-main">
          <div class="breadcrumb">
            <router-link to="/">Home</router-link>
            <i class="fa-solid fa-chevron-right"></i>
            <router-link to="/account">My Account</router-link>
            <i class="fa-solid fa-chevron-right"></i>
            <router-link to="/orders">My Orders</router-link>
            <i class="fa-solid fa-chevron-right"></i>
            <span>Order #{{ orderId }}</span>
          </div>

          <div v-if="orderDetail" class="order-detail-content">
            <!-- Order Header -->
            <div class="order-header">
              <div class="order-header-left">
                <h2>Order Details</h2>
                <p class="order-id">Order ID: <strong>#{{ orderDetail.id }}</strong></p>
                <p class="order-date">
                  <i class="fa-regular fa-calendar"></i>
                  {{ formatDate(orderDetail.createdAt) }}
                </p>
              </div>
              <div class="order-header-right">
                <span class="status-badge" :class="getStatusClass(orderDetail.status)">
                  {{ orderDetail.status }}
                </span>
              </div>
            </div>

            <!-- Order Info Grid -->
            <div class="order-info-grid">
              <!-- Customer Info -->
              <div class="info-card">
                <h3><i class="fa-solid fa-user"></i> Customer Information</h3>
                <div class="info-content">
                  <p><strong>Name:</strong> {{ orderDetail.customerFirstName }} {{ orderDetail.customerLastName }}</p>
                  <p><strong>Email:</strong> {{ orderDetail.customerEmail }}</p>
                  <p><strong>Phone:</strong> {{ orderDetail.customerPhone }}</p>
                </div>
              </div>

              <!-- Billing Address -->
              <div class="info-card">
                <h3><i class="fa-solid fa-file-invoice"></i> Billing Address</h3>
                <div class="info-content">
                  <p><strong>{{ orderDetail.billingFirstName }} {{ orderDetail.billingLastName }}</strong></p>
                  <p>{{ orderDetail.billingAddress1 }}</p>
                  <p v-if="orderDetail.billingAddress2">{{ orderDetail.billingAddress2 }}</p>
                  <p>{{ orderDetail.billingCity }}, {{ orderDetail.billingState }} {{ orderDetail.billingZip }}</p>
                  <p>{{ orderDetail.billingCountry }}</p>
                </div>
              </div>

              <!-- Shipping Address -->
              <div class="info-card">
                <h3><i class="fa-solid fa-truck"></i> Shipping Address</h3>
                <div class="info-content">
                  <p><strong>{{ orderDetail.shippingFirstName }} {{ orderDetail.shippingLastName }}</strong></p>
                  <p>{{ orderDetail.shippingAddress1 }}</p>
                  <p v-if="orderDetail.shippingAddress2">{{ orderDetail.shippingAddress2 }}</p>
                  <p>{{ orderDetail.shippingCity }}, {{ orderDetail.shippingState }} {{ orderDetail.shippingZip }}</p>
                  <p>{{ orderDetail.shippingCountry }}</p>
                </div>
              </div>

              <!-- Payment Info -->
              <div class="info-card">
                <h3><i class="fa-solid fa-credit-card"></i> Payment Information</h3>
                <div class="info-content">
                  <p><strong>Method:</strong> {{ formatPaymentMethod(orderDetail.paymentMethod) }}</p>
                  <p><strong>Currency:</strong> {{ orderDetail.currency }}</p>
                  <p v-if="orderDetail.transactions && orderDetail.transactions.length">
                    <strong>Transaction ID:</strong><br>
                    <span class="transaction-id">{{ orderDetail.transactions[0].transactionId }}</span>
                  </p>
                </div>
              </div>
            </div>

            <!-- Order Products -->
            <div class="products-section">
              <h3><i class="fa-solid fa-box"></i> Order Items</h3>
              <div class="products-table-wrapper">
                <table class="products-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Variant</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="product in orderDetail.orderProducts" :key="product.id">
                      <td>
                        <div class="product-info">
                          <div class="product-name">{{ product.productName }}</div>
                          <div v-if="product.variations && product.variations.length" class="product-variations">
                            <span v-for="variation in product.variations" :key="variation.id" class="variation-tag">
                              <span class="variation-label">{{ variation.variationName }}:</span>
                              <template v-if="variation.type === 'IMAGE'">
                                <img :src="variation.value" :alt="variation.variationName" class="variation-image" />
                              </template>
                              <template v-else-if="variation.type === 'COLOR'">
                                <span class="variation-color-wrapper">
                                  <span class="variation-color" :style="{ backgroundColor: variation.value }"></span>
                                </span>
                              </template>
                              <template v-else>
                                <span class="variation-value">{{ variation.value }}</span>
                              </template>
                            </span>
                          </div>
                          <div v-if="product.options && product.options.length" class="product-options">
                            <span v-for="option in product.options" :key="option.id" class="option-tag">
                              {{ option.optionName }}: {{ option.valueLabel }}
                              <template v-if="option.price && option.price > 0">
                                (+{{ formatPrice(option.price) }})
                              </template>
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>{{ product.variantName }}</td>
                      <td>{{ formatPrice(product.unitPrice) }}</td>
                      <td>{{ product.qty }}</td>
                      <td><strong>{{ formatPrice(product.lineTotal) }}</strong></td>
                      <td>
                        <button
                          @click="openReviewModal(product)"
                          class="action-btn review-btn"
                          :class="{ 'reviewed': product.review }"
                          :disabled="!canReview"
                          :title="getReviewButtonTitle(product)"
                        >
                          <i :class="product.review ? 'fa-solid fa-edit' : 'fa-solid fa-pen'"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Order Summary -->
            <div class="order-summary">
              <div class="summary-card">
                <h3>Order Summary</h3>
                <div class="summary-row">
                  <span>Subtotal:</span>
                  <span>{{ formatPrice(orderDetail.subTotal) }}</span>
                </div>
                <div class="summary-row">
                  <span>Shipping ({{ orderDetail.shippingMethod }}):</span>
                  <span>{{ formatPrice(orderDetail.shippingCost) }}</span>
                </div>
                <div v-if="orderDetail.discount > 0" class="summary-row discount">
                  <span>Discount:</span>
                  <span>-{{ formatPrice(orderDetail.discount) }}</span>
                </div>
                <div class="summary-row total">
                  <span>Total:</span>
                  <span>{{ formatPrice(orderDetail.total) }}</span>
                </div>
                <div v-if="orderDetail.note" class="order-note">
                  <strong>Note:</strong>
                  <p>{{ orderDetail.note }}</p>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <router-link to="/orders" class="btn-back">
                <i class="fa-solid fa-arrow-left"></i> Back to Orders
              </router-link>

              <div v-if="showCaseButtons" class="order-actions">
                <!-- Show Cancel button for non-completed orders -->
                <button
                  v-if="canCancelOrder"
                  @click="openCaseModal('CANCEL')"
                  class="btn-action btn-cancel"
                >
                  <i class="fa-solid fa-ban"></i> Cancel Order
                </button>

                <!-- Show Refund and Exchange buttons for completed orders -->
                <button
                  v-if="canRefundOrder"
                  @click="openCaseModal('REFUND')"
                  class="btn-action btn-refund"
                >
                  <i class="fa-solid fa-money-bill-wave"></i> Request Refund
                </button>
                <button
                  v-if="canExchangeOrder"
                  @click="openCaseModal('EXCHANGE')"
                  class="btn-action btn-exchange"
                >
                  <i class="fa-solid fa-arrows-rotate"></i> Exchange Order
                </button>
              </div>
            </div>
          </div>

          <div v-else class="error-state">
            <i class="fa-solid fa-exclamation-circle"></i>
            <p>Order not found</p>
            <router-link to="/orders" @mouseenter="prefetch('/orders')" @mouseleave="cancel"  class="btn-back">Back to Orders</router-link>
          </div>
        </main>
      </div>
    </transition>

    <Footer />
    <Chatbot />

    <!-- Review Modal -->
    <Review
      :isOpen="showReviewModal"
      :order="orderDetail"
      :product="selectedProduct"
      @close="closeReviewModal"
      @submit="handleReviewSubmit"
    />

    <!-- Case Request Modal -->
    <div v-if="showCaseModal" class="modal-overlay" @click="closeCaseModal">
      <div class="modal-dialog case-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ getCaseTypeTitle(caseType) }}</h3>
          <button type="button" class="btn-close" @click="closeCaseModal">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitCase">
            <!-- Show refund amount info for REFUND type -->
            <div v-if="caseType === 'REFUND'" class="refund-info-box">
              <div class="refund-info-item">
                <i class="fa-solid fa-info-circle"></i>
                <div>
                  <strong>Refund Amount:</strong>
                  <span class="refund-amount-value">{{ formatPrice(orderDetail.total) }}</span>
                </div>
              </div>
              <p class="refund-note">The total order amount will be refunded after approval.</p>
            </div>

            <div class="form-group">
              <label for="reason">Reason <span class="required">*</span></label>
              <textarea
                id="reason"
                v-model="caseReason"
                class="form-control"
                rows="6"
                :placeholder="getReasonPlaceholder(caseType)"
                required
              ></textarea>
              <small class="form-hint">Please provide detailed information about your request.</small>
            </div>
            <div class="form-actions">
              <button type="button" class="btn-secondary" @click="closeCaseModal">Cancel</button>
              <button type="submit" class="btn-primary" :disabled="submittingCase">
                <i class="fa-solid fa-paper-plane"></i>
                {{ submittingCase ? 'Submitting...' : 'Submit Request' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from '@/User/components/Header1/Header.vue'
import Footer from '@/User/components/Footer/Footer.vue'
import Loading from '@/User/components/Loading/Loading.vue'
import Chatbot from '@/User/components/Chatbot/Chatbot.vue'
import Review from '@/User/screens/Review/Review.vue'
import { getOrderById } from '@/api/orderApi.js'
import { createOrderCase } from '@/api/orderCaseApi.js'
import { useAuth } from '@/User/components/useAuth.js'
import { useToast } from '@/User/components/Toast/useToast.js'
import { usePrefetch } from '@/User/stores/usePrefetch.js'

const { prefetch, cancel } = usePrefetch();
const route = useRoute()
const router = useRouter()
const { handleLogout: authLogout } = useAuth()
const { add: toast } = useToast()

const isLoading = ref(true)
const orderDetail = ref(null)
const orderId = ref(route.params.id)

// Review modal state
const showReviewModal = ref(false)
const selectedProduct = ref(null)
const canReview = ref(false)

// Case modal state
const showCaseModal = ref(false)
const caseType = ref('CANCEL')
const caseReason = ref('')
const submittingCase = ref(false)

// Computed: Can cancel/refund/exchange order based on status
const canCancelOrder = computed(() => {
  if (!orderDetail.value) return false
  const status = orderDetail.value.status
  // Can cancel if not COMPLETED, CANCELLED, or REFUNDED
  return ['PENDING', 'PENDING_PAYMENT', 'PAID', 'PROCESSING', 'SHIPPED'].includes(status)
})

const canRefundOrder = computed(() => {
  if (!orderDetail.value) return false
  const status = orderDetail.value.status
  // Can refund only if COMPLETED
  return status === 'COMPLETED'
})

const canExchangeOrder = computed(() => {
  if (!orderDetail.value) return false
  const status = orderDetail.value.status
  // Can exchange only if COMPLETED
  return status === 'COMPLETED'
})

const showCaseButtons = computed(() => {
  if (!orderDetail.value) return false
  const status = orderDetail.value.status
  // Don't show any buttons if CANCELLED or REFUNDED
  return !['CANCELLED', 'REFUNDED'].includes(status)
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const formatPaymentMethod = (method) => {
  const methods = {
    'DEBIT_CARD': 'Debit Card',
    'CREDIT_CARD': 'Credit Card',
    'CASH': 'Cash on Delivery',
    'BANK_TRANSFER': 'Bank Transfer',
    'PAYOS_QR': 'PayOS QR',
    'VIETQR': 'VietQR',
    'COD': 'Cash on Delivery'
  }
  return methods[method] || method
}

const getStatusClass = (status) => {
  const classes = {
    'PAID': 'status-success',
    'PENDING': 'status-warning',
    'PROCESSING': 'status-info',
    'SHIPPED': 'status-info',
    'COMPLETED': 'status-success',
    'CANCELLED': 'status-danger',
    'REFUNDED': 'status-secondary'
  }
  return classes[status] || 'status-default'
}


const getReviewButtonTitle = (product) => {
  if (!canReview.value) {
    return 'Only delivered orders can be reviewed'
  }
  if (product.review) {
    return 'Edit your review'
  }
  return 'Write a review'
}

const handleLogout = async () => {
  await authLogout()
  await router.push('/login')
}

// Review modal handlers
const openReviewModal = (product) => {
  selectedProduct.value = product
  showReviewModal.value = true
}

const closeReviewModal = () => {
  showReviewModal.value = false
  selectedProduct.value = null
}

const handleReviewSubmit = (reviewData) => {
  console.log('Review submitted:', reviewData)
  const message = reviewData.isUpdate
    ? 'Đánh giá đã được cập nhật!'
    : 'Cảm ơn bạn đã đánh giá sản phẩm!';
  toast(message, 'success')
  // Review creation/update is handled by Review component and API
}

// Case modal handlers
const openCaseModal = (type) => {
  caseType.value = type
  caseReason.value = ''
  showCaseModal.value = true
}

const closeCaseModal = () => {
  showCaseModal.value = false
  caseType.value = 'CANCEL'
  caseReason.value = ''
}

const getCaseTypeTitle = (type) => {
  const titles = {
    'CANCEL': 'Cancel Order Request',
    'REFUND': 'Refund Request',
    'EXCHANGE': 'Exchange Request',
    'REQUEST_INFO': 'Request Information'
  }
  return titles[type] || 'Submit Request'
}

const getReasonPlaceholder = (type) => {
  const placeholders = {
    'CANCEL': 'Please explain why you want to cancel this order...',
    'REFUND': 'Please provide the reason for requesting a refund...',
    'EXCHANGE': 'Please specify which product you want to exchange and what you prefer instead...',
    'REQUEST_INFO': 'Please provide additional information...'
  }
  return placeholders[type] || 'Please provide details about your request...'
}

const submitCase = async () => {
  if (!caseReason.value.trim()) {
    toast('Please provide a reason for your request', 'error')
    return
  }

  try {
    submittingCase.value = true

    const caseData = {
      orderId: parseInt(orderId.value),
      type: caseType.value,
      reason: caseReason.value
    }

    // Add refundAmount for REFUND type
    if (caseType.value === 'REFUND' && orderDetail.value) {
      caseData.refundAmount = orderDetail.value.total
    }

    const response = await createOrderCase(caseData)

    // Support both code 200 and 1000
    if (response.code === 1000 || response.code === 200) {
      toast('Your request has been submitted successfully!', 'success')
      closeCaseModal() // Close modal immediately
      // Redirect to my cases page
      setTimeout(() => {
        router.push('/my-cases')
      }, 1500)
    } else {
      toast(response.message || 'Failed to submit request', 'error')
    }
  } catch (error) {
    console.error('Error submitting case:', error)
    toast('Error submitting request. Please try again.', 'error')
  } finally {
    submittingCase.value = false
  }
}

onMounted(async () => {
  try {
    const response = await getOrderById(orderId.value)
    console.log('Order detail response:', response)

    // API returns: { code, message, result: {...} }
    const result = response.data?.result || response.data
    orderDetail.value = result

    // Check if order can be reviewed - only COMPLETED status allowed
    if (result) {
      canReview.value = result.status === 'COMPLETED'
    }
  } catch (error) {
    console.error('Error fetching order detail:', error)
    if (error.response?.status === 401) {
      toast('Phiên đăng nhập hết hạn.', 'error')
      await handleLogout()
    } else {
      console.error('Full error:', error.response?.data)
      toast('Không thể tải thông tin đơn hàng.', 'error')
    }
  } finally {
    setTimeout(() => {
      isLoading.value = false
    }, 600)
  }
})
</script>

<style src="./Orderdetail.css" scoped></style>
