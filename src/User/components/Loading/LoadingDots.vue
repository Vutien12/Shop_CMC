<template>
  <div class="loading-wrapper">
    <!-- Loading State with 3 Dots -->
    <div v-if="isLoading" class="loading-dots-container">
      <div class="dots-wrapper">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
      <p v-if="message" class="loading-message">{{ message }}</p>
    </div>

    <!-- Content when loaded -->
    <div v-else class="content-wrapper">
      <slot></slot>
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
    default: 'Đang tải dữ liệu'
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
.loading-wrapper {
  width: 100%;
}

.loading-dots-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: v-bind(minHeight);
  padding: 40px 20px;
}

.loading-dots-container.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.95);
  z-index: 9999;
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
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

.dot:nth-child(3) {
  animation-delay: 0s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.loading-message {
  font-size: 15px;
  color: #6b7280;
  font-weight: 500;
  text-align: center;
  margin: 0;
}

.content-wrapper {
  width: 100%;
  animation: fadeIn 0.3s ease-in;
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

/* Responsive */
@media (max-width: 640px) {
  .dot {
    width: 12px;
    height: 12px;
  }

  .loading-message {
    font-size: 14px;
  }

  .loading-dots-container {
    min-height: 150px;
    padding: 30px 15px;
  }
}
</style>
