<template>
  <div class="home-page">
    <Header />
    <Main />
    <Footer />
    <Chatbot />
  </div>
</template>

<script setup>
import "./Home.css"
import { onMounted, onBeforeUnmount } from 'vue'
import Footer from '../../components/Footer/Footer.vue'
import Header from '../../components/Header1/Header.vue'
import Chatbot from '@/User/components/Chatbot/Chatbot.vue'
import Main from './Main.vue'

// Dynamic import CSS - chỉ load khi component mount
let styleElement = null

onMounted(() => {
  styleElement = document.createElement('link')
  styleElement.rel = 'stylesheet'
  styleElement.href = new URL('./Home.css', import.meta.url).href;
  styleElement.setAttribute('data-home-css', 'true')
  document.head.appendChild(styleElement)
})

onBeforeUnmount(() => {
  // Remove CSS khi component unmount
  if (styleElement && styleElement.parentNode) {
    styleElement.parentNode.removeChild(styleElement)
  }
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}
</style>
