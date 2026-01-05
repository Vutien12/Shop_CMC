<template>
  <div class="cart-wrapper">
    <ConfirmDialog />

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
              <div class="item-header">
                <h4 class="item-name">{{ item.productName }}</h4>
              </div>

              <!-- Compact Variations - Single Line with dash separator -->
              <div v-if="item.cartItemVariations?.length" class="item-meta">
                <span v-for="(variation, idx) in item.cartItemVariations" :key="variation.id" class="meta-item">
                  <span v-if="variation.type === 'COLOR'" class="color-dot-mini" :style="{ backgroundColor: variation.cartItemVariationValues[0]?.value }"></span>
                  {{ variation.cartItemVariationValues[0]?.label }}<span v-if="idx < item.cartItemVariations.length - 1"> - </span>
                </span>
              </div>

              <!-- Compact Options - Single Line -->
              <div v-if="item.cartItemOptions?.length" class="item-options-compact">
                <span v-for="(option, idx) in item.cartItemOptions" :key="option.id" class="option-compact">
                  {{ option.optionName }}: {{ option.valueLabel }}<span v-if="idx < item.cartItemOptions.length - 1">; </span>
                </span>
              </div>

              <!-- Warning Icons Row -->
              <div v-if="isVariantDeleted(item) || isVariantChanged(item)" class="warning-row">
                <i v-if="isVariantDeleted(item)" class="warning-icon deleted fa-solid fa-exclamation-circle" title="No longer available"></i>
                <i v-else-if="isVariantChanged(item)" class="warning-icon changed fa-solid fa-info-circle" title="Product updated"></i>
              </div>

              <!-- Bottom Row: Price + Quantity -->
              <div class="item-footer">
                <div class="item-price">{{ formatPrice(item.unitPrice) }}</div>

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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useCartStore } from '@/User/stores/cartStore.js'
import { useToast } from '@/User/components/Toast/useToast.js'
import { useConfirm } from '@/User/components/ConfirmDialog/useConfirm.js'
import ConfirmDialog from '@/User/components/ConfirmDialog/ConfirmDialog.vue'

const cartStore = useCartStore()
const { add: toast } = useToast()
const { confirm } = useConfirm()

const isOpen = ref(false)

// DỮ LIỆU TỪ STORE – DÙNG COMPUTED
const cartItems = computed(() => cartStore.cartItems)
const total = computed(() => cartStore.total)
const itemCount = computed(() => cartStore.cartItems.reduce((sum, item) => sum + item.qty, 0))

const openCart = async () => {
  isOpen.value = true
  document.body.style.overflow = 'hidden'

  // Lazy load cart only when opening sidebar
  try {
    await cartStore.fetchCart(true)
  } catch (err) {
    console.error('[Cart] Failed to fetch cart:', err)
    toast('Unable to load shopping cart', 'error')
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

const getThumb = (item) => item.productThumbnail || '/images/placeholder.jpg'

// Check if variant is deleted
const isVariantDeleted = (item) => {
  return item.productVariantId === null && item.variantName === null && item.sku === null
}

// Check if variant has changed
const isVariantChanged = (item) => {
  if (!item.variantName || !item.cartItemVariations || item.cartItemVariations.length === 0) {
    return false
  }

  const expectedName = item.productName + ' - ' +
    item.cartItemVariations
      .map(v => v.cartItemVariationValues[0]?.label)
      .filter(Boolean)
      .join(' - ')

  return item.variantName !== expectedName
}

// Tăng/giảm số lượng
const increase = async (cartItemId, qty) => {
  try {
    await cartStore.updateQuantity(cartItemId, qty + 1)
    toast('Quantity increased', 'success')
  } catch {
    toast('Unable to update quantity', 'error')
  }
}

const decrease = async (cartItemId, qty) => {
  if (qty <= 1) return
  try {
    await cartStore.updateQuantity(cartItemId, qty - 1)
    toast('Quantity has been reduced', 'success')
  } catch {
    toast('Unable to update quantity', 'error')
  }
}

// Xóa item
const remove = async (cartItemId) => {
  const confirmed = await confirm('Are you sure you want to remove this product from your shopping cart?', { title: 'Confirm deletion' })
  if (!confirmed) return
  try {
    await cartStore.removeItem(cartItemId)
    toast('Product removed', 'success')
  } catch {
    toast('Cannot be deleted', 'error')
  }
}

// Xóa toàn bộ
const handleClear = async () => {
  const confirmed = await confirm('Are you sure you want to clear your entire shopping cart?', { title: 'Xác nhận xóa giỏ hàng' })
  if (!confirmed) return
  try {
    await cartStore.clear()
    toast('The shopping cart has been cleared.!', 'success')
  } catch {
    toast('Unable to delete shopping cart', 'error')
  }
}


onMounted(() => {
  window.addEventListener('openCart', openCart)
})

onUnmounted(() => {
  window.removeEventListener('openCart', openCart)
})

defineExpose({ openCart, closeCart })
</script>

<style src="./Cart.css" scoped></style>
