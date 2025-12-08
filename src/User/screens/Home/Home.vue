<template>
  <div class="home-page">
    <Header />
    <Main />
    <Footer />
    <Chatbot />
  </div>
</template>

<script setup>
import "@/User/screens/Home/Home.css"
import Footer from '@/User/components/Footer/Footer.vue'
import Header from '@/User/components/Header1/Header.vue'
import Chatbot from '@/User/components/Chatbot/Chatbot.vue'
import Main from '@/User/screens/Home/Main.vue'
</script>


<style scoped>
.home-page {
  min-height: 100vh;
}
</style>
