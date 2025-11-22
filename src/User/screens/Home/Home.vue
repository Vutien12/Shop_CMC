<template>
  <div class="home-page">
    <Header1 />
    <Main :products="products" />
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Footer from '../../components/Footer/Footer.vue'
import Header1 from '../../components/Header1/Header.vue'
import Main from './Main.vue'

// Dynamic import CSS - chỉ load khi component mount
let styleElement = null

onMounted(() => {
  // Tạo style element và load CSS
  styleElement = document.createElement('link')
  styleElement.rel = 'stylesheet'
  styleElement.href = '/src/User/screens/Home/Home.css'
  styleElement.setAttribute('data-home-css', 'true')
  document.head.appendChild(styleElement)
})

onBeforeUnmount(() => {
  // Remove CSS khi component unmount
  if (styleElement && styleElement.parentNode) {
    styleElement.parentNode.removeChild(styleElement)
  }
})

// Sample products data
const products = ref([
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    price: 1199.99,
    originalPrice: 1299.99,
    discount: '10% OFF',
    rating: 4.8,
    reviewCount: 256,
    image: 'https://via.placeholder.com/300x300?text=iPhone+15+Pro+Max',
    isNew: true,
    isOutOfStock: false,
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24 Ultra',
    price: 999.99,
    originalPrice: null,
    discount: null,
    rating: 4.7,
    reviewCount: 189,
    image: 'https://via.placeholder.com/300x300?text=Galaxy+S24+Ultra',
    isNew: false,
    isOutOfStock: false,
  },
  {
    id: 3,
    name: 'MacBook Pro 16"',
    price: 2499.99,
    originalPrice: 2799.99,
    discount: '15% OFF',
    rating: 4.9,
    reviewCount: 124,
    image: 'https://via.placeholder.com/300x300?text=MacBook+Pro+16',
    isNew: false,
    isOutOfStock: false,
  },
  {
    id: 4,
    name: 'iPad Air 5th Gen',
    price: 599.99,
    originalPrice: null,
    discount: null,
    rating: 4.6,
    reviewCount: 87,
    image: 'https://via.placeholder.com/300x300?text=iPad+Air+5',
    isNew: true,
    isOutOfStock: false,
  },
  {
    id: 5,
    name: 'Sony WH-1000XM5',
    price: 399.99,
    originalPrice: 449.99,
    discount: '12% OFF',
    rating: 4.8,
    reviewCount: 312,
    image: 'https://via.placeholder.com/300x300?text=Sony+WH-1000XM5',
    isNew: false,
    isOutOfStock: false,
  },
  {
    id: 6,
    name: 'Nintendo Switch OLED',
    price: 349.99,
    originalPrice: null,
    discount: null,
    rating: 4.5,
    reviewCount: 156,
    image: 'https://via.placeholder.com/300x300?text=Nintendo+Switch+OLED',
    isNew: false,
    isOutOfStock: true,
  },
])
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}
</style>
