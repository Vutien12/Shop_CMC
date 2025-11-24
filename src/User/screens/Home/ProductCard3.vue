<template>
  <div class="containerx" style="margin-top: 40px">
    <div :class="bannerClass">
      <div
        v-for="image in bannerImages"
        :key="image"
        class="banner-item"
        :style="{
          backgroundImage: 'url(' + image + ')',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }"
      ></div>
    </div>
    <div class="products-section" style="margin-top: 40px">
      <div class="products-grid">
        <product-card
          v-for="product in getProductsByCategory(category)"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ProductCard from './ProductCard.vue'

export default {
  name: 'ProductCard3',
  components: {
    ProductCard,
  },
  props: {
    listProducts: {
      type: Array,
      required: true,
    },
    bannerClass: {
      type: String,
      required: true,
    },
    bannerImages: {
      type: Array,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  methods: {
    getProductsByCategory(category) {
      return this.listProducts.filter((product) => product.category === category)
    },
  },
}
</script>


