<template>
  <div class="product-card" v-if="product">
    <div class="product-badges">
      <span v-if="product.isOutOfStock" class="badge out-of-stock">Out of Stock</span>
      <span v-else-if="product.discount" class="badge discount">
        {{ product.discount }}
      </span>
      <span v-else-if="product.isNew" class="badge new">New</span>
    </div>
    <div class="product-image1">
      <img :src="product.image" :alt="product.name" />
    </div>
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <div class="product-rating">
        <div class="stars">
          <span
            v-for="star in getStarArray()"
            :key="star"
            class="star material-icons"
            :class="{ filled: star <= product.rating }"
          >
            {{ star <= product.rating ? 'star' : 'star_border' }}
          </span>
        </div>
        <span class="review-count">{{ product.reviewCount }} Review</span>
      </div>
      <div class="product-footer">
        <div class="price-section">
          <span
            class="original-price"
            :style="{ visibility: Number(product.originalPrice) > 0 ? 'visible' : 'hidden' }"
          >
            ${{ formatCurrency(product.originalPrice) }}
          </span>
          <span class="current-price">${{ formatCurrency(product.price) }}</span>
        </div>

        <!-- Action button: View/Add to cart/Out of stock -->
        <button class="action-btn" :disabled="product.isOutOfStock">
          <span class="material-icons">
            {{
              product.isOutOfStock
                ? 'visibility_off'
                : product.discount
                  ? 'shopping_cart'
                  : 'remove_red_eye'
            }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getStarArray() {
      return Array.from({ length: 5 }, (_, i) => i + 1)
    },
    formatCurrency(value) {
      if (value === null || value === undefined || value === '') return '0.00'
      const num = Number(value)
      return Number.isFinite(num) ? num.toFixed(2) : '0.00'
    },
  },
}
</script>

