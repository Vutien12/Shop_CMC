<script setup>
import { ref, onMounted } from 'vue';
import Notification from '@/Admin/view/components/Notification.vue';
import { notificationRef } from './main.js';

const notificationComponent = ref(null);

onMounted(() => {
  notificationRef.current = notificationComponent.value;
});
</script>

<template>
  <router-view></router-view>
  <ToastContainer />
  <Notification ref="notificationComponent" />
</template>
<style></style>
