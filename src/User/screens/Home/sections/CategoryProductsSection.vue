<template>
  <section class="category-products-section">
    <div class="containerx">
      <div
        v-for="categoryData in categoryProducts"
        :key="categoryData.category.id"
        class="category-block"
      >
        <div class="category-header">
          <h2 class="category-title">{{ categoryData.category.name }}</h2>
          <router-link
            :to="`/products?category=${categoryData.category.id}`"
            class="view-all-link"
          >
            View All
            <span class="material-icons">chevron_right</span>
          </router-link>
        </div>

        <div class="category-products-grid">
          <ProductCard
            v-for="product in categoryData.products"
            :key="product.id"
            :product="transformProduct(product)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { defineProps } from 'vue'
import ProductCard from '../ProductCard.vue'

defineProps({
  categoryProducts: {
    type: Array,
    required: true
  }
})

// Transform API product to match ProductCard format
const transformProduct = (apiProduct) => {
  const firstVariant = apiProduct.variants && apiProduct.variants.length > 0 ? apiProduct.variants[0] : null

  // Calculate discount
  let discount = null
  let originalPrice = null
  if (firstVariant && firstVariant.specialPrice) {
    originalPrice = firstVariant.price
    const discountPercent = ((firstVariant.price - firstVariant.specialPrice) / firstVariant.price) * 100
    discount = `-${Math.round(discountPercent)}%`
  }

  return {
    id: apiProduct.id,
    name: apiProduct.name,
    image: apiProduct.thumbnail?.url || apiProduct.thumbnail,
    price: apiProduct.minPrice,
    originalPrice: originalPrice,
    discount: discount,
    isNew: !!(apiProduct.newFrom || apiProduct.newTo),
    isOutOfStock: !apiProduct.inStock,
  }
}
</script>

<style scoped>
.category-products-section {
  margin: 40px 0;
}

.category-block {
  margin-bottom: 48px;
}

.category-block:last-child {
  margin-bottom: 0;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.category-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.view-all-link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #3373dc;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.view-all-link:hover {
  color: #2557b8;
}

.view-all-link .material-icons {
  font-size: 20px;
}

.category-products-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
}

@media (max-width: 1400px) {
  .category-products-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 1024px) {
  .category-products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .category-products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}
</style>

