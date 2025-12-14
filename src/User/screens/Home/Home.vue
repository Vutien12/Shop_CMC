<template>
  <div class="home-page">
    <Header />
    <Main />
    <Footer />
    <Chatbot />
    <BottomNavBar />
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from "vue"
import Footer from '@/User/components/Footer/Footer.vue'
import Header from '@/User/components/Header1/Header.vue'
import homeCss from "@/User/screens/Home/Home.css?url"
import Chatbot from '@/User/components/Chatbot/Chatbot.vue'
import Main from './Main.vue'
import BottomNavBar from '@/User/components/BottomNavBar.vue'

let styleElement = null

onMounted(() => {
  styleElement = document.createElement("link")
  styleElement.rel = "stylesheet"
  styleElement.href = homeCss
  document.head.appendChild(styleElement)
})

onBeforeUnmount(() => {
  if (styleElement?.parentNode) {
    styleElement.parentNode.removeChild(styleElement)
  }
})
</script>


<style scoped>
.home-page {
  min-height: 100vh;
}
</style>
