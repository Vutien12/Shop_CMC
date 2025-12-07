<template>
  <section class="brands-section">
    <div class="containerx">
      <div class="section-header" style="display: none;">
        <h2 class="section-title">Featured Brands</h2>
      </div>

      <div class="brands-container">
        <div class="brands-slider-wrapper">
          <div ref="brandsSwiper" class="brands-swiper swiper">
            <div class="swiper-wrapper">
              <router-link
                v-for="brand in brands"
                :key="brand.id"
                :to="`/products?brand=${brand.id}`"
                class="swiper-slide brand-card"
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

          <button class="brands-nav-button brands-nav-prev" type="button">
            <span class="nav-arrow">‹</span>
          </button>
          <button class="brands-nav-button brands-nav-next" type="button">
            <span class="nav-arrow">›</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { defineProps, ref, onMounted, nextTick } from 'vue'
import Swiper from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

defineProps({
  brands: {
    type: Array,
    required: true
  }
})

const brandsSwiper = ref(null)

const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/80x80?text=Brand'
}

onMounted(async () => {
  await nextTick()

  if (brandsSwiper.value) {
    new Swiper(brandsSwiper.value, {
      modules: [Navigation],
      slidesPerView: 8,
      spaceBetween: 0,
      loop: false,
      navigation: {
        nextEl: '.brands-nav-next',
        prevEl: '.brands-nav-prev',
      },
      breakpoints: {
        320: {
          slidesPerView: 2,
          spaceBetween: 0,
        },
        480: {
          slidesPerView: 3,
          spaceBetween: 0,
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 0,
        },
        1024: {
          slidesPerView: 6,
          spaceBetween: 0,
        },
        1400: {
          slidesPerView: 8,
          spaceBetween: 0,
        },
      },
    })
  }
})
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

.brands-swiper {
  overflow: hidden;
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

/* Navigation Buttons */
.brands-nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 26px;
  height: 26px;
  background: #0066cc;
  border: none;
  border-radius: 50%;
  z-index: 10;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 102, 204, 0.25);
  cursor: pointer;
  outline: none;
  opacity: 0;
  visibility: hidden;
}

.brands-slider-wrapper:hover .brands-nav-button {
  opacity: 1;
  visibility: visible;
}

.brands-nav-prev {
  left: 10px;
}

.brands-nav-next {
  right: 10px;
}

.nav-arrow {
  font-size: 12px;
  font-weight: 600;
  color: white;
  line-height: 1;
}

.brands-nav-button:hover {
  background: #0052a3;
  box-shadow: 0 3px 10px rgba(0, 102, 204, 0.35);
  transform: translateY(-50%) scale(1.08);
}

.brands-nav-button:disabled {
  opacity: 0;
  cursor: not-allowed;
  pointer-events: none;
}

@media (max-width: 1024px) {
  .brand-card {
    padding: 24px 16px;
    height: 100px;
  }

  .brands-nav-button {
    width: 24px;
    height: 24px;
  }

  .nav-arrow {
    font-size: 11px;
  }
}

@media (max-width: 768px) {
  .brand-card {
    padding: 20px 12px;
    height: 80px;
  }


  .brands-nav-button {
    width: 22px;
    height: 22px;
  }

  .nav-arrow {
    font-size: 10px;
  }
}

@media (max-width: 480px) {
  .brand-card {
    height: 70px;
    padding: 16px 10px;
  }

  .brands-nav-button {
    width: 20px;
    height: 20px;
  }

  .nav-arrow {
    font-size: 9px;
  }

  .brands-nav-prev {
    left: 8px;
  }

  .brands-nav-next {
    right: 8px;
  }
}
</style>

