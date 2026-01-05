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

        <!-- Action button: View icon -->
        <button class="action-btn" @click.prevent>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
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

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  box-sizing: border-box;
  width: 100%;
  min-height: 340px; /* ensures uniform card height in a grid/row */
  background: transparent;
  border-radius: 8px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  padding: 8px;
  position: relative; /* required for absolute-positioned badges */
  border: 1px solid #e5e7eb;
}

.product-card:hover {
  border-color: #0068e1;
}

.product-badges {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 2;
  display: flex;
  gap: 6px;
}

.product-card .product-image1 {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 6px;
  background: transparent;
}

.product-card .product-image1 img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image1 img {
  transform: scale(1.08);
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 4px 4px 4px;
  flex: 1 1 auto; /* allow info area to expand so footer sticks to bottom */
}

.product-name {
  font-size: 14px;
  line-height: 1.25;
  margin: 0;
  color: #222;
  /* clamp to 2 lines to avoid very tall titles */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2.5em; /* reserve space for 2 lines */
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto; /* push footer to bottom of card */
}

.price-section {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-height: 44px; /* reserve space so price area doesn't change card height */
  justify-content: center;
}

.original-price {
  color: #868e96;
  text-decoration: line-through;
  font-size: 12px;
}

.current-price {
  font-weight: 700;
  color: #111;
  font-size: 15px;
}

.action-btn {
  background: transparent;
  border: none;
  padding: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Ensure card fills the container height when used in related-products scroller */
.pd-related-product-card {
  height: 100%;
}
</style>
