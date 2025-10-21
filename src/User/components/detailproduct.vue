<template>
  <div>
    <h2>Chi tiết sản phẩm {{ id }}</h2>
    <!-- có thể fetch API lấy thông tin sản phẩm theo id -->
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id
</script>
