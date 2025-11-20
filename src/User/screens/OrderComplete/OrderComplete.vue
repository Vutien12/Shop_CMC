<template>
  <div class="order-complete-wrapper">
    <Header />

    <div class="order-complete-container">
      <!-- Loading State -->
      <div v-if="!order" class="loading-state">
        <div class="spinner"></div>
        <p>Đang tải chi tiết đơn hàng...</p>
      </div>

      <!-- Success Message -->
      <div v-else class="success-section">
        <div class="success-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>

        <h1>Đặt hàng thành công!</h1>
        <p class="order-number">Mã đơn hàng: <strong>#{{ order.id }}</strong></p>
        <p class="order-message">Cảm ơn bạn đã mua hàng. Chúng tôi sẽ liên hệ với bạn sớm nhất.</p>
      </div>

      <!-- Order Summary -->
      <div v-if="order" class="order-summary">
        <h2>Tóm tắt đơn hàng</h2>

        <div class="summary-grid">
          <!-- Customer Info -->
          <div class="summary-card">
            <h3>Thông tin khách hàng</h3>
            <div class="info-item">
              <span class="label">Tên:</span>
              <span class="value">{{ order.customerFirstName }} {{ order.customerLastName }}</span>
            </div>
            <div class="info-item">
              <span class="label">Email:</span>
              <span class="value">{{ order.customerEmail }}</span>
            </div>
            <div class="info-item">
              <span class="label">Điện thoại:</span>
              <span class="value">{{ order.customerPhone }}</span>
            </div>
          </div>

          <!-- Shipping Address -->
          <div class="summary-card">
            <h3>Địa chỉ giao hàng</h3>
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
            <h3>Thông tin thanh toán</h3>
            <div class="info-item">
              <span class="label">Phương thức:</span>
              <span class="value badge" :class="paymentMethodClass">{{ paymentMethodText }}</span>
            </div>
            <div class="info-item">
              <span class="label">Vận chuyển:</span>
              <span class="value">{{ order.shippingMethod }}</span>
            </div>
            <div class="info-item">
              <span class="label">Trạng thái:</span>
              <span class="value badge" :class="statusClass">{{ statusText }}</span>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="order-items">
          <h3>Sản phẩm đã đặt</h3>
          <div class="items-table">
            <div class="table-header">
              <div class="col-product">Sản phẩm</div>
              <div class="col-sku">SKU</div>
              <div class="col-qty">Số lượng</div>
              <div class="col-price">Đơn giá</div>
              <div class="col-total">Thành tiền</div>
            </div>

            <div v-for="item in order.orderProducts" :key="item.id" class="table-row">
              <div class="col-product">
                <div class="product-info">
                  <img :src="item.productThumbnail || '/images/placeholder.jpg'" :alt="item.productName" class="product-thumb">
                  <div class="product-text">
                    <div class="product-name">{{ item.productName }}</div>
                    <div class="variant-name">{{ item.variantName }}</div>
                    <div v-if="item.options.length > 0" class="options-text">
                      <span v-for="opt in item.options" :key="opt.id" class="option-tag">
                        {{ opt.optionName }}: {{ opt.valueLabel }}
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
            <span>Tạm tính:</span>
            <span>{{ formatPrice(order.subTotal) }}</span>
          </div>
          <div v-if="order.discount > 0" class="total-row discount">
            <span>Giảm giá:</span>
            <span>-{{ formatPrice(order.discount) }}</span>
          </div>
          <div class="total-row">
            <span>Vận chuyển:</span>
            <span>{{ formatPrice(order.shippingCost) }}</span>
          </div>
          <div class="total-row grand-total">
            <span>Tổng cộng:</span>
            <span>{{ formatPrice(order.total) }}</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div v-if="order" class="action-buttons">
        <router-link to="/orders" class="btn btn-primary">
          Xem đơn hàng của tôi
        </router-link>
        <router-link to="/" class="btn btn-secondary">
          Tiếp tục mua sắm
        </router-link>
      </div>

      <!-- Note -->
      <div v-if="order && order.note" class="order-note">
        <h3>Ghi chú đơn hàng</h3>
        <p>{{ order.note }}</p>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getOrderById } from '@/api/orderApi.js'
import Header from '@/User/components/Header1/Header.vue'
import Footer from '@/User/components/Footer/Footer.vue'

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
    'COD': 'Thanh toán khi nhận hàng',
    'DEBIT_CARD': 'Thẻ ghi nợ',
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
    'PENDING': 'Chờ xác nhận',
    'CONFIRMED': 'Đã xác nhận',
    'PROCESSING': 'Đang xử lý',
    'SHIPPED': 'Đã gửi',
    'DELIVERED': 'Đã giao',
    'CANCELLED': 'Đã hủy'
  }
  return map[order.value?.status] || order.value?.status
})

const statusClass = computed(() => {
  const map = {
    'PENDING': 'badge-warning',
    'CONFIRMED': 'badge-info',
    'PROCESSING': 'badge-info',
    'SHIPPED': 'badge-primary',
    'DELIVERED': 'badge-success',
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

