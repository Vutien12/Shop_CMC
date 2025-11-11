<template>
  <div class="toast-container">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="['toast', toast.type, { removed: toast.removing }]"
      @click="remove(toast.id)"
    >
      <span class="toast-message">{{ toast.message }}</span>
      <span class="toast-close">×</span>
    </div>
  </div>
</template>

<script setup>
import { useToast } from './useToast.js';
const { toasts, remove } = useToast();
</script>

<style src="./ToastContainer.css" scoped></style>
