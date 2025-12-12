<template>
  <section class="brands-section">
    <div class="containerx">
      <div class="section-header" style="display: none;">
        <h2 class="section-title">Featured Brands</h2>
      </div>

      <div class="brands-container">
        <div class="brands-slider-wrapper">
          <div class="brands-track">
            <router-link
              v-for="brand in duplicatedBrands"
              :key="`${brand.id}-${brand.duplicateIndex}`"
              :to="`/products?brand=${brand.id}`"
              class="brand-card"
            >
              <img
                :src="brand.fileLogo"
                :alt="brand.name"
                class="brand-logo"
                @error="handleImageError"
              />
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  brands: {
    type: Array,
    required: true
  }
})

// Duplicate brands 3 times for seamless loop
const duplicatedBrands = computed(() => {
  const result = []
  for (let i = 0; i < 3; i++) {
    props.brands.forEach((brand, index) => {
      result.push({
        ...brand,
        duplicateIndex: `${i}-${index}`
      })
    })
  }
  return result
})

const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/80x80?text=Brand'
}
</script>

<style scoped>
.brands-container {
  position: relative;
  width: 100%;
}

.brands-slider-wrapper {
  position: relative;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  padding: 0;
  width: 100%;
}

.brands-track {
  display: flex;
  width: max-content;
  animation: scroll-brands 20s linear infinite;
}

.brands-track:hover {
  animation-play-state: paused;
}

@keyframes scroll-brands {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-33.333%);
  }
}

.brand-card {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
  cursor: pointer;
  text-decoration: none;
  background: transparent;
  height: 120px;
  overflow: visible;
  position: relative;
  min-width: 200px;
  flex-shrink: 0;
}
.brands-section{
  margin-top: 40px;
}
.brand-logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
  position: relative;
  z-index: 1;
}

.brand-card:hover .brand-logo {
  transform: scale(1.15);
}

@media (max-width: 1024px) {
  .brand-card {
    padding: 24px 16px;
    height: 100px;
    min-width: 180px;
  }
}

@media (max-width: 768px) {
  .brand-card {
    padding: 20px 12px;
    height: 80px;
    min-width: 150px;
  }
  
  .brands-track {
    animation-duration: 15s;
  }
}

@media (max-width: 480px) {
  .brand-card {
    height: 70px;
    padding: 16px 10px;
    min-width: 120px;
  }
  
  .brands-track {
    animation-duration: 12s;
  }
}
</style>