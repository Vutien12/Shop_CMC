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

import Footer from '../../components/Footer/Footer.vue'
import Header from '../../components/Header1/Header.vue'
import Chatbot from '@/User/components/Chatbot/Chatbot.vue'
import Main from './Main.vue'
</script>


<style scoped>
.home-page {
  min-height: 100vh;
}
</style>
