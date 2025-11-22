<template>
  <div v-for="product in products" :key="product.id" class="product-item">
    <!-- Product image -->
    <img :src="product.image" :alt="product.name" class="product-image" />
    <!-- Product basic info -->
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <!-- Simple rating display -->
      <div class="product-rating">
        <div class="product-stars">
          <span v-for="star in [1, 2, 3, 4, 5]" :key="star" class="material-icons product-star">
            {{ star <= product.rating ? 'star' : 'star_border' }}
          </span>
        </div>
        <span class="product-review-count">{{ product.reviewCount }} Review</span>
      </div>
      <!-- Price display -->
      <div class="product-pricing">
        <span class="product-price">${{ product.price }}</span>
        <span v-if="product.originalPrice" class="product-original-price">
          ${{ product.originalPrice }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCard2',
  props: {
    products: {
      type: Array,
      required: true,
    },
  },
}
</script>


