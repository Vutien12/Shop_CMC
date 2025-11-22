<template>
  <div class="loading-container">
    <div class="spinner"></div>
    <p class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: 'Loading...'
  }
})
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  height: 100vh;
  width: 100%;
  padding: 40px;
  position: fixed;
  top: 0;
  left: 0;
  background: white;
  z-index: 9999;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  position: relative;
}

.spinner::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top: 3px solid #0068e1;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  margin-top: 20px;
  font-size: 16px;
  color: #6b7280;
  font-weight: 500;
}
</style>
