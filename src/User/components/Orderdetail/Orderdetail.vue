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
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="product in orderDetail.orderProducts" :key="product.id">
                      <td>
                        <div class="product-info">
                          <div class="product-name">{{ product.productName }}</div>
                          <div v-if="product.variations && product.variations.length" class="product-variations">
                            <span v-for="variation in product.variations" :key="variation.id" class="variation-tag">
                              {{ variation.variationName }}: {{ getVariationLabel(variation) }}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>{{ product.variantName }}</td>
                      <td>{{ formatPrice(product.unitPrice) }}</td>
                      <td>{{ product.qty }}</td>
                      <td><strong>{{ formatPrice(product.lineTotal) }}</strong></td>
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

            <!-- Back Button -->
            <div class="action-buttons">
              <router-link to="/orders" class="btn-back">
                <i class="fa-solid fa-arrow-left"></i> Back to Orders
              </router-link>
            </div>
          </div>

          <div v-else class="error-state">
            <i class="fa-solid fa-exclamation-circle"></i>
            <p>Order not found</p>
            <router-link to="/orders" class="btn-back">Back to Orders</router-link>
          </div>
        </main>
      </div>
    </transition>

    <Footer />
    <Chatbot />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from '@/User/components/Header1/Header.vue'
import Footer from '@/User/components/Footer/Footer.vue'
import Loading from '@/User/components/Loading/Loading.vue'
import Chatbot from '@/User/components/Chatbot/Chatbot.vue'
import { getOrderById } from '@/api/orderApi.js'
import { useAuth } from '@/User/components/useAuth.js'
import { useToast } from '@/User/components/Toast/useToast.js'

const route = useRoute()
const router = useRouter()
const { handleLogout: authLogout } = useAuth()
const { add: toast } = useToast()

const isLoading = ref(true)
const orderDetail = ref(null)
const orderId = ref(route.params.id)

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
    'BANK_TRANSFER': 'Bank Transfer'
  }
  return methods[method] || method
}

const getStatusClass = (status) => {
  const classes = {
    'PAID': 'status-success',
    'PENDING': 'status-warning',
    'PROCESSING': 'status-info',
    'SHIPPED': 'status-info',
    'DELIVERED': 'status-success',
    'CANCELLED': 'status-danger',
    'REFUNDED': 'status-secondary'
  }
  return classes[status] || 'status-default'
}

const getVariationLabel = (variation) => {
  if (variation.variationValues && variation.variationValues.length > 0) {
    return variation.variationValues[0].label
  }
  return variation.value
}

const handleLogout = async () => {
  await authLogout()
  await router.push('/login')
}

onMounted(async () => {
  try {
    const response = await getOrderById(orderId.value)
    orderDetail.value = response.data.result
  } catch (error) {
    console.error('Error fetching order detail:', error)
    if (error.response?.status === 401) {
      toast('Phiên đăng nhập hết hạn.', 'error')
      await handleLogout()
    } else {
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
