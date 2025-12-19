<template>
  <div class="order-complete-wrapper">
    <Header />

    <div class="order-complete-container">
      <!-- Loading State -->
      <div v-if="!order" class="loading-state">
        <div class="spinner"></div>
        <p>Loading order details...</p>
      </div>

      <!-- Success Message -->
      <div v-else class="success-section">
        <div class="success-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>

        <h1>Order Successful!</h1>
        <p class="order-number">Order ID: <strong>#{{ order.id }}</strong></p>
        <p class="order-message">Thank you for your purchase. We will contact you soon.</p>
      </div>

      <!-- Order Summary -->
      <div v-if="order" class="order-summary">
        <h2>Order Summary</h2>

        <div class="summary-grid">
          <!-- Customer Info -->
          <div class="summary-card">
            <h3>Customer Information</h3>
            <div class="info-item">
              <span class="label">Name:</span>
              <span class="value">{{ order.customerFirstName }} {{ order.customerLastName }}</span>
            </div>
            <div class="info-item">
              <span class="label">Email:</span>
              <span class="value">{{ order.customerEmail }}</span>
            </div>
            <div class="info-item">
              <span class="label">Phone:</span>
              <span class="value">{{ order.customerPhone }}</span>
            </div>
          </div>

          <!-- Shipping Address -->
          <div class="summary-card">
            <h3>Shipping Address</h3>
            <div class="info-item">
              <span class="value">
                {{ order.shippingFirstName }} {{ order.shippingLastName }}<br>
                {{ order.shippingAddress1 }}<br>
                <span v-if="order.shippingAddress2">{{ order.shippingAddress2 }}<br></span>
                {{ order.shippingCity }}, {{ order.shippingState }} {{ order.shippingZip }}<br>
                {{ order.shippingCountry }}
              </span>
            </div>
          </div>

          <!-- Payment Info -->
          <div class="summary-card">
            <h3>Payment Information</h3>
            <div class="info-item">
              <span class="label">Method:</span>
              <span class="value badge" :class="paymentMethodClass">{{ paymentMethodText }}</span>
            </div>
            <div class="info-item">
              <span class="label">Shipping:</span>
              <span class="value">{{ order.shippingMethod }}</span>
            </div>
            <div class="info-item">
              <span class="label">Status:</span>
              <span class="value badge" :class="statusClass">{{ statusText }}</span>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="order-items">
          <h3>Ordered Products</h3>
          <div class="items-table">
            <div class="table-header">
              <div class="col-product">Product</div>
              <div class="col-sku">SKU</div>
              <div class="col-qty">Quantity</div>
              <div class="col-price">Unit Price</div>
              <div class="col-total">Total</div>
            </div>

            <div v-for="item in order.orderProducts" :key="item.id" class="table-row">
              <div class="col-product">
                <div class="product-info">
                  <img :src="item.productThumbnail || '/images/placeholder.jpg'" :alt="item.productName" class="product-thumb">
                  <div class="product-text">
                    <div class="product-name">{{ item.productName }}</div>
                    <div class="variant-name">{{ item.variantName }}</div>
                    <div v-if="item.variations && item.variations.length > 0" class="variations-text">
                      <span v-for="variation in item.variations" :key="variation.id" class="variation-tag">
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
                    <div v-if="item.options && item.options.length > 0" class="options-text">
                      <span v-for="opt in item.options" :key="opt.id" class="option-tag">
                        {{ opt.optionName }}: {{ opt.valueLabel }}
                        <template v-if="opt.price && opt.price > 0">
                          (+{{ formatPrice(opt.price) }})
                        </template>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-sku">{{ item.sku }}</div>
              <div class="col-qty">{{ item.qty }}</div>
              <div class="col-price">{{ formatPrice(item.unitPrice) }}</div>
              <div class="col-total">{{ formatPrice(item.lineTotal) }}</div>
            </div>
          </div>
        </div>

        <!-- Order Total -->
        <div class="order-total">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>{{ formatPrice(order.subTotal) }}</span>
          </div>
          <div v-if="order.discount > 0" class="total-row discount">
            <span>Discount:</span>
            <span>-{{ formatPrice(order.discount) }}</span>
          </div>
          <div class="total-row">
            <span>Shipping:</span>
            <span>{{ formatPrice(order.shippingCost) }}</span>
          </div>
          <div class="total-row grand-total">
            <span>Total:</span>
            <span>{{ formatPrice(order.total) }}</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div v-if="order" class="action-buttons">
        <router-link to="/orders" class="btn btn-primary">
          View My Orders
        </router-link>
        <router-link to="/" class="btn btn-secondary">
          Continue Shopping
        </router-link>
      </div>

      <!-- Note -->
      <div v-if="order && order.note" class="order-note">
        <h3>Order Note</h3>
        <p>{{ order.note }}</p>
      </div>
    </div>

    <Footer />
    <BottomNavBar />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getOrderById } from '@/api/orderApi.js'
import Header from '@/User/components/Header1/Header.vue'
import Footer from '@/User/components/Footer/Footer.vue'
import BottomNavBar from '@/User/components/BottomNavBar.vue'

const route = useRoute()
const router = useRouter()
const order = ref(null)

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price || 0).replace('₫', 'đ')
}

const paymentMethodText = computed(() => {
  const map = {
    'COD': 'Cash on Delivery',
    'DEBIT_CARD': 'Debit Card',
    'PAYOS_QR': 'PayOS QR',
    'VIETQR': 'VietQR'
  }
  return map[order.value?.paymentMethod] || order.value?.paymentMethod
})

const paymentMethodClass = computed(() => {
  const map = {
    'COD': 'badge-info',
    'DEBIT_CARD': 'badge-success',
    'PAYOS_QR': 'badge-success',
    'VIETQR': 'badge-success'
  }
  return map[order.value?.paymentMethod] || 'badge-info'
})

const statusText = computed(() => {
  const map = {
    'PENDING': 'Pending',
    'CONFIRMED': 'Confirmed',
    'PROCESSING': 'Processing',
    'SHIPPED': 'Shipped',
    'COMPLETED': 'Completed',
    'CANCELLED': 'Cancelled'
  }
  return map[order.value?.status] || order.value?.status
})

const statusClass = computed(() => {
  const map = {
    'PENDING': 'badge-warning',
    'CONFIRMED': 'badge-info',
    'PROCESSING': 'badge-info',
    'SHIPPED': 'badge-primary',
    'COMPLETED': 'badge-success',
    'CANCELLED': 'badge-danger'
  }
  return map[order.value?.status] || 'badge-secondary'
})

onMounted(async () => {
  try {
    const orderId = route.params.id || route.query.orderId
    if (!orderId) {
      await router.push('/orders')
      return
    }

    const res = await getOrderById(orderId)
    order.value = res.data.result
  } catch (error) {
    console.error('Failed to load order:', error)
    await router.push('/orders')
  }
})
</script>

<style scoped src="./OrderComplete.css"></style>

