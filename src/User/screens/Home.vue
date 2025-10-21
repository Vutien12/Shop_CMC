<template>
  <Header1 />
  <div>
    <h1>Page Home</h1>
    <ul>
      <li v-for="product in products" :key="product.id">
        <router-link :to="`/detail/${product.id}`">
          {{ product.name }}
        </router-link>
      </li>
    </ul>
  </div>
  <Footer />
</template>

<script setup>
import Footer from '../components/Footer/Footer.vue'
import Header1 from '../components/Header/Header1.vue'

const products = [
  { id: 1, name: 'Sản phẩm A' },
  { id: 2, name: 'Sản phẩm B' },
  { id: 3, name: 'Sản phẩm C' }
]
</script>

<style scoped>
h1 {
  text-align: center;
}
</style>
