<template>
  <div>
    <Header1 />
    <Loading v-if="isLoading" />
    <div v-else>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Footer from '../components/Footer/Footer.vue'
import Header1 from '../components/Header/Header1.vue'
import Loading from '../components/Loading/Loading.vue'

const isLoading = ref(true)

const products = [
  { id: 1, name: 'Sản phẩm A' },
  { id: 2, name: 'Sản phẩm B' },
  { id: 3, name: 'Sản phẩm C' }
]

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})
</script>

<style scoped>
h1 {
  text-align: center;
}
</style>
