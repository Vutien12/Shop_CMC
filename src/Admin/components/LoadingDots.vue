<template>
  <div class="admin-loading-wrapper">
    <!-- Loading State with 3 Dots -->
    <div v-if="isLoading" class="admin-loading-dots-container" :class="{ 'fullscreen': fullScreen }">
      <div class="dots-wrapper">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
      <p v-if="message" class="loading-message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  isLoading: {
    type: Boolean,
    default: true,
    required: true
  },
  message: {
    type: String,
    default: 'Loading data...'
  },
  minHeight: {
    type: String,
    default: '200px'
  },
  fullScreen: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.admin-loading-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
}

.admin-loading-dots-container {
  position: absolute;
  top: 30px;
  left: 0;
  width: 100%;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(4px);
  z-index: 100;
  padding: 20px;
}

.admin-loading-dots-container.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.97);
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.dots-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.dot {
  width: 14px;
  height: 14px;
  background-color: #0068e1;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
  box-shadow: 0 2px 4px rgba(0, 104, 225, 0.3);
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
  background-color: #0068e1;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
  background-color: #0080ff;
}

.dot:nth-child(3) {
  animation-delay: 0s;
  background-color: #0098ff;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0.6) translateY(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1) translateY(-10px);
    opacity: 1;
  }
}

.loading-message {
  font-size: 15px;
  color: #4b5563;
  font-weight: 500;
  text-align: center;
  margin: 0;
  letter-spacing: 0.3px;
}

.content-wrapper {
  width: 100%;
  animation: fadeIn 0.4s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Admin specific styles */
.admin-loading-dots-container:not(.fullscreen) {
  border-radius: 8px;
}

/* Responsive */
@media (max-width: 768px) {
  .dot {
    width: 12px;
    height: 12px;
  }

  .loading-message {
    font-size: 14px;
  }

  .admin-loading-dots-container {
    min-height: 150px;
    padding: 30px 15px;
  }
}

@media (max-width: 480px) {
  .dots-wrapper {
    gap: 10px;
  }

  .dot {
    width: 10px;
    height: 10px;
  }

  .loading-message {
    font-size: 13px;
  }
}
</style>
