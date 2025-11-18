<template>
  <div class="cart-wrapper">
    <!-- Overlay -->
    <div v-if="isOpen" class="cart-overlay" @click="closeCart"></div>

    <!-- Cart Sidebar -->
    <div :class="['cart-sidebar', { 'cart-open': isOpen }]">
      <!-- Header -->
      <div class="cart-header">
        <div class="cart-title">
          <h2>My Cart</h2>
          <span class="cart-count">{{ itemCount }}</span>
        </div>
        <button class="cart-close-btn" @click="closeCart">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Body -->
      <div class="cart-body">
        <!-- Empty State -->
        <div v-if="itemCount === 0" class="empty-cart">
          <div class="empty-cart-icon">
            <i class="fa-solid fa-cart-shopping"></i>
          </div>
          <h3>Your cart is empty</h3>
          <p>Add items to get started</p>
          <router-link to="/product" class="btn-browse" @click="closeCart">
            Browse Products
          </router-link>
        </div>

        <!-- Cart Items -->
        <div v-else class="cart-items">
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <!-- Image -->
            <div class="item-image">
              <img :src="getThumb(item)" :alt="item.productName" />
            </div>

            <!-- Details -->
            <div class="item-details">
              <h4 class="item-name">{{ item.productName }}</h4>
              <p class="variant-name">{{ getShortVariantName(item.variantName) }}</p>

              <!-- Options -->
              <div class="options-list" v-if="item.cartItemOptions?.length">
                <small v-for="opt in item.cartItemOptions" :key="opt.id">
                  {{ opt.optionName }}: <strong>{{ opt.valueLabel }}</strong>
                </small>
              </div>

              <!-- Price -->
              <div class="item-price">{{ formatPrice(item.unitPrice) }}</div>

              <!-- Quantity -->
              <div class="item-quantity">
                <button class="qty-btn" @click="decrease(item.id, item.qty)">
                  <i class="fa-solid fa-minus"></i>
                </button>
                <span class="qty-value">{{ item.qty }}</span>
                <button class="qty-btn" @click="increase(item.id, item.qty)">
                  <i class="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>

            <!-- Remove -->
            <button class="item-remove" @click="remove(item.id)" title="Remove">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="itemCount > 0" class="cart-footer">
        <div class="cart-subtotal">
          <span>Subtotal</span>
          <span class="subtotal-amount">{{ formatPrice(total) }}</span>
        </div>
        <div class="cart-footer-buttons">
          <button class="btn-clear-cart" @click="handleClear">
            <i class="fa-solid fa-trash-can"></i> Clear
          </button>
          <router-link to="/cart" class="btn-view-cart" @click="closeCart"> View Cart </router-link>
          <router-link to="/checkout" class="btn-checkout" @click="closeCart">
            Checkout
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/User/stores/cartStore.js'
import { useToast } from '@/User/components/Toast/useToast.js'

const router = useRouter()
const cartStore = useCartStore()
const { add: toast } = useToast()

const isOpen = ref(false)

// DỮ LIỆU TỪ STORE – DÙNG COMPUTED
const cartItems = computed(() => cartStore.cartItems)
const total = computed(() => cartStore.total)
const itemCount = computed(() => cartStore.cartItems.reduce((sum, item) => sum + item.qty, 0))

const openCart = async () => {
  isOpen.value = true
  document.body.style.overflow = 'hidden'
  try {
    await cartStore.fetchCart(true)
  } catch (err) {
    toast('Không thể tải giỏ hàng', 'error')
  }
}

const closeCart = () => {
  isOpen.value = false
  document.body.style.overflow = ''
}

// Format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
    .format(price || 0)
    .replace('₫', 'đ')
}

// Rút gọn tên biến thể
const getShortVariantName = (fullName) => {
  if (!fullName) return ''
  const productName = cartStore.cart?.cartItems[0]?.productName || ''
  return fullName
    .replace(productName, '')
    .trim()
    .replace(/^[-–—]\s*/, '')
}

const getThumb = (item) => item.productThumbnail || '/images/placeholder.jpg'

// Tăng/giảm số lượng
const increase = async (cartItemId, qty) => {
  try {
    await cartStore.updateQuantity(cartItemId, qty + 1)
    toast('Đã tăng số lượng', 'success')
  } catch {
    toast('Không thể cập nhật số lượng', 'error')
  }
}

const decrease = async (cartItemId, qty) => {
  if (qty <= 1) return
  try {
    await cartStore.updateQuantity(cartItemId, qty - 1)
    toast('Đã giảm số lượng', 'success')
  } catch {
    toast('Không thể cập nhật số lượng', 'error')
  }
}

// Xóa item
const remove = async (cartItemId) => {
  if (!confirm('Xóa sản phẩm này?')) return
  try {
    await cartStore.removeItem(cartItemId)
    toast('Đã xóa sản phẩm', 'success')
  } catch {
    toast('Không thể xóa', 'error')
  }
}

// Xóa toàn bộ
const handleClear = async () => {
  if (!confirm('Xóa toàn bộ giỏ hàng?')) return
  try {
    await cartStore.clear()
    toast('Giỏ hàng đã được xóa!', 'success')
  } catch {
    toast('Không thể xóa giỏ hàng', 'error')
  }
}

// Chỉ cần lắng nghe openCart
onMounted(() => {
  window.addEventListener('openCart', openCart)
})

onUnmounted(() => {
  window.removeEventListener('openCart', openCart)
})

defineExpose({ openCart, closeCart })
</script>

<style src="./Cart.css" scoped></style>
