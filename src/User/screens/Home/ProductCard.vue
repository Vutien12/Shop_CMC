<template>
  <router-link
    :to="`/productdetail/${product.id}`"
    class="product-card"
    v-if="product"
  >
    <div class="product-badges">
      <span v-if="!product.inStock" class="badge out-of-stock">Out of Stock</span>
      <span v-else-if="hasDiscount" class="badge discount">
        {{ discountText }}
      </span>
      <span v-else-if="isNew" class="badge new">New</span>
    </div>
    <div class="product-image1">
      <img
        :src="productImage"
        :alt="product.name"
        @error="handleImageError"
      />
    </div>
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <div class="product-footer">
        <div class="price-section">
          <span
            v-if="hasDiscount"
            class="original-price"
          >
            {{ formatPrice(originalPrice) }}
          </span>
          <span class="current-price" :class="{ 'sale-price': hasDiscount }">
            {{ formatPrice(sellingPrice) }}
          </span>
        </div>

        <!-- Action button: View/Add to cart/Out of stock -->
        <button class="action-btn" :disabled="!product.inStock" @click.prevent>
          <svg v-if="!product.inStock" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <g clip-path="url(#clip0_2055_61)">
              <path d="M1.3335 1.33325H2.20427C2.36828 1.33325 2.45029 1.33325 2.51628 1.36341C2.57444 1.38999 2.62373 1.43274 2.65826 1.48655C2.69745 1.54761 2.70905 1.6288 2.73225 1.79116L3.04778 3.99992M3.04778 3.99992L3.74904 9.15419C3.83803 9.80827 3.88253 10.1353 4.0389 10.3815C4.17668 10.5984 4.37422 10.7709 4.60773 10.8782C4.87274 10.9999 5.20279 10.9999 5.8629 10.9999H11.5682C12.1965 10.9999 12.5107 10.9999 12.7675 10.8869C12.9939 10.7872 13.1881 10.6265 13.3283 10.4227C13.4875 10.1917 13.5462 9.88303 13.6638 9.26576L14.5462 4.63305C14.5876 4.41579 14.6083 4.30716 14.5783 4.22225C14.552 4.14777 14.5001 4.08504 14.4319 4.04526C14.3541 3.99992 14.2435 3.99992 14.0223 3.99992H3.04778ZM6.66683 13.9999C6.66683 14.3681 6.36835 14.6666 6.00016 14.6666C5.63197 14.6666 5.3335 14.3681 5.3335 13.9999C5.3335 13.6317 5.63197 13.3333 6.00016 13.3333C6.36835 13.3333 6.66683 13.6317 6.66683 13.9999ZM12.0002 13.9999C12.0002 14.3681 11.7017 14.6666 11.3335 14.6666C10.9653 14.6666 10.6668 14.3681 10.6668 13.9999C10.6668 13.6317 10.9653 13.3333 11.3335 13.3333C11.7017 13.3333 12.0002 13.6317 12.0002 13.9999Z" stroke="#9ca3af" stroke-linecap="round" stroke-linejoin="round"></path>
            </g>
            <defs>
              <clipPath id="clip0_2055_61_gray">
                <rect width="16" height="16" fill="white"></rect>
              </clipPath>
            </defs>
          </svg>
          <svg v-else-if="hasDiscount" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <g clip-path="url(#clip0_2055_61)">
              <path d="M1.3335 1.33325H2.20427C2.36828 1.33325 2.45029 1.33325 2.51628 1.36341C2.57444 1.38999 2.62373 1.43274 2.65826 1.48655C2.69745 1.54761 2.70905 1.6288 2.73225 1.79116L3.04778 3.99992M3.04778 3.99992L3.74904 9.15419C3.83803 9.80827 3.88253 10.1353 4.0389 10.3815C4.17668 10.5984 4.37422 10.7709 4.60773 10.8782C4.87274 10.9999 5.20279 10.9999 5.8629 10.9999H11.5682C12.1965 10.9999 12.5107 10.9999 12.7675 10.8869C12.9939 10.7872 13.1881 10.6265 13.3283 10.4227C13.4875 10.1917 13.5462 9.88303 13.6638 9.26576L14.5462 4.63305C14.5876 4.41579 14.6083 4.30716 14.5783 4.22225C14.552 4.14777 14.5001 4.08504 14.4319 4.04526C14.3541 3.99992 14.2435 3.99992 14.0223 3.99992H3.04778ZM6.66683 13.9999C6.66683 14.3681 6.36835 14.6666 6.00016 14.6666C5.63197 14.6666 5.3335 14.3681 5.3335 13.9999C5.3335 13.6317 5.63197 13.3333 6.00016 13.3333C6.36835 13.3333 6.66683 13.6317 6.66683 13.9999ZM12.0002 13.9999C12.0002 14.3681 11.7017 14.6666 11.3335 14.6666C10.9653 14.6666 10.6668 14.3681 10.6668 13.9999C10.6668 13.6317 10.9653 13.3333 11.3335 13.3333C11.7017 13.3333 12.0002 13.6317 12.0002 13.9999Z" stroke="#0068e1" stroke-linecap="round" stroke-linejoin="round"></path>
            </g>
            <defs>
              <clipPath id="clip0_2055_61">
                <rect width="16" height="16" fill="white"></rect>
              </clipPath>
            </defs>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M14.3623 7.3635C14.565 7.6477 14.6663 7.78983 14.6663 8.00016C14.6663 8.2105 14.565 8.35263 14.3623 8.63683C13.4516 9.9139 11.1258 12.6668 7.99967 12.6668C4.87353 12.6668 2.54774 9.9139 1.63703 8.63683C1.43435 8.35263 1.33301 8.2105 1.33301 8.00016C1.33301 7.78983 1.43435 7.6477 1.63703 7.3635C2.54774 6.08646 4.87353 3.3335 7.99967 3.3335C11.1258 3.3335 13.4516 6.08646 14.3623 7.3635Z" stroke="#0068e1" stroke-width="1"></path>
            <path d="M10 8C10 6.8954 9.1046 6 8 6C6.8954 6 6 6.8954 6 8C6 9.1046 6.8954 10 8 10C9.1046 10 10 9.1046 10 8Z" stroke="#0068e1" stroke-width="1"></path>
          </svg>
        </button>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

// Tính toán giá bán (sử dụng sellingPrice từ backend)
const sellingPrice = computed(() => {
  if (!props.product.variants || props.product.variants.length === 0) {
    return props.product.minPrice || 0
  }

  // Lấy giá bán thấp nhất từ các variants (backend đã tính sẵn sellingPrice)
  const sellingPrices = props.product.variants
    .map(v => v.sellingPrice || v.price)
    .filter(price => price !== null && price !== undefined)

  return sellingPrices.length > 0 ? Math.min(...sellingPrices) : props.product.minPrice || 0
})

// Tính toán giá gốc (để hiển thị giá gạch ngang)
const originalPrice = computed(() => {
  if (!props.product.variants || props.product.variants.length === 0) {
    return props.product.minPrice || 0
  }

  // Lấy giá gốc thấp nhất từ các variants
  const prices = props.product.variants
    .map(v => v.price)
    .filter(price => price !== null && price !== undefined)

  return prices.length > 0 ? Math.min(...prices) : props.product.minPrice || 0
})

// Kiểm tra có giảm giá không
const hasDiscount = computed(() => {
  return props.product.variants?.some(v => v.sellingPrice && v.sellingPrice < v.price)
})

// Tính text hiển thị giảm giá
const discountText = computed(() => {
  if (!hasDiscount.value || !props.product.variants) {
    return ''
  }

  // Tính % giảm giá cho từng variant
  const discounts = props.product.variants
    .filter(v => v.sellingPrice && v.sellingPrice < v.price)
    .map(v => {
      const discount = ((v.price - v.sellingPrice) / v.price) * 100
      return Math.round(discount)
    })

  if (discounts.length === 0) {
    return ''
  }

  const minDiscount = Math.min(...discounts)
  const maxDiscount = Math.max(...discounts)

  if (minDiscount === maxDiscount) {
    return `-${minDiscount}%`
  }

  return `-${minDiscount}% to -${maxDiscount}%`
})

// Kiểm tra sản phẩm mới
const isNew = computed(() => {
  const now = new Date()
  const newFrom = props.product.newFrom ? new Date(props.product.newFrom) : null
  const newTo = props.product.newTo ? new Date(props.product.newTo) : null

  if (newFrom && now < newFrom) return false
  if (newTo && now > newTo) return false

  return !!(newFrom || newTo)
})

// Lấy URL ảnh
const productImage = computed(() => {
  if (!props.product.thumbnail) {
    return 'https://via.placeholder.com/300x300?text=No+Image'
  }

  // Xử lý cả trường hợp thumbnail là object hoặc string
  return props.product.thumbnail.url || props.product.thumbnail
})

// Format giá
const formatPrice = (value) => {
  if (value === null || value === undefined || value === '') return '0₫'
  const num = Number(value)
  if (!Number.isFinite(num)) return '0₫'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(num)
}

// Xử lý lỗi ảnh
const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'
}
</script>
