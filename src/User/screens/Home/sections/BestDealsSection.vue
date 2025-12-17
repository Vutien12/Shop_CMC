<template>
  <section class="best-deals-section">
    <div class="containerx">
      <div class="layout-grid">
        <div class="section-wrapper">
          <!-- Daily Deals - Title Outside -->
          <div v-if="allFlashItems.length > 0" class="daily-deals-column">
            <!-- Title Only -->
            <div class="deals-header">
              <h3 class="deals-title">Best <b>Deals</b></h3>
            </div>

            <!-- Separator Line -->
            <div class="deals-separator"></div>

            <!-- Card Frame (Only Flash Sale Products) -->
            <div class="card-wrap">
              <div class="card-body">
                <div
                  class="deals-container"
                  ref="dealsContainer"
                  @mousedown="startDragDeals"
                  @mousemove="onDragDeals"
                  @mouseup="endDragDeals"
                  @mouseleave="endDragDeals"
                >
                  <div
                    v-for="item in allFlashItems"
                    :key="item.id"
                    class="deal-item"
                  >
                    <div class="deal-content">
                      <router-link
                        :to="`/productdetail/${getProductId(item)}`"
                        class="deal-image-link"
                        @mousedown.stop
                        @click.stop
                      >
                        <img
                          :src="item.thumbnail"
                          :alt="item.variantName"
                          @error="handleImageError"
                          class="deal-image"
                        />
                      </router-link>

                      <router-link
                        :to="`/productdetail/${getProductId(item)}`"
                        class="deal-title"
                        @mousedown.stop
                        @click.stop
                      >
                        {{ item.variantName }}
                      </router-link>

                      <div class="deal-pricing">
                        <span class="price-sale">{{ formatPrice(item.flashPrice) }}</span>
                        <span class="price-old">{{ formatPrice(item.originalPrice) }}</span>
                      </div>

                      <CountdownTimer :endTime="item.flashSaleEndTime" />

                      <div class="deal-stock-info">
                        <div class="stock-numbers">
                          <span>Available: <strong>{{ item.remainingQty }}</strong></span>
                          <span>Sold: <strong>{{ item.soldQty }}</strong></span>
                        </div>
                        <div class="stock-bar">
                          <div class="bar-fill" :style="{ width: item.soldPercent + '%' }"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Navigation Buttons at Bottom Corners -->
                <div class="deals-navigation">
                  <button
                    class="deals-nav-btn deals-nav-prev"
                    @click="scrollDeals('prev')"
                    :disabled="dealsCurrentIndex === 0"
                  >
                    &lt; PREV
                  </button>
                  <button
                    class="deals-nav-btn deals-nav-next"
                    @click="scrollDeals('next')"
                    :disabled="dealsCurrentIndex >= allFlashItems.length - 1"
                  >
                    NEXT &gt;
                  </button>
                </div>
              </div><!-- Close card-body -->
            </div><!-- Close card-wrap -->
          </div><!-- Close daily-deals-column -->
        </div><!-- Close section-wrapper -->

        <!-- Vertical Products - Right Sidebar (No Card Frame) -->
        <div class="verticals-sidebar">
          <div
            v-for="(categoryData, index) in verticalCategories"
            :key="categoryData.category.id"
            class="vertical-column"
          >
            <!-- Header Row: Title + Navigation Buttons -->
            <div class="vertical-header">
              <h3 class="vertical-title">{{ categoryData.category.name }}</h3>
              <div v-if="categoryData.products && categoryData.products.length > 5" class="vertical-nav-buttons">
                <button
                  class="vertical-nav-btn vertical-nav-prev"
                  @click="scrollVertical(index, 'prev')"
                  :disabled="verticalIndexes[index] === 0"
                >
                  ‹
                </button>
                <button
                  class="vertical-nav-btn vertical-nav-next"
                  @click="scrollVertical(index, 'next')"
                  :disabled="verticalIndexes[index] >= Math.ceil(categoryData.products.length / 5) - 1"
                >
                  ›
                </button>
              </div>
            </div>

            <!-- Separator Line -->
            <div class="vertical-separator"></div>

            <!-- Products List -->
            <div v-if="!categoryData.products || categoryData.products.length === 0" class="no-products">
              No products available
            </div>

            <div v-else class="vertical-container" :ref="`verticalContainer${index}`">
              <div
                v-for="(chunk, chunkIndex) in chunkProducts(categoryData.products, 5)"
                :key="chunkIndex"
                class="vertical-page"
                :class="{ active: verticalIndexes[index] === chunkIndex }"
              >
                <router-link
                  v-for="product in chunk"
                  :key="product.id"
                  :to="`/productdetail/${product.id}`"
                  class="product-item"
                >
                  <div class="item-thumb">
                    <img :src="product.thumbnail" :alt="product.name" @error="handleImageError" />
                  </div>

                  <div class="item-details">
                    <div class="item-title">{{ product.name }}</div>
                    <div class="item-pricing">
                      <template v-if="hasDiscount(product)">
                        <span class="price-old">{{ formatPrice(getOriginalPrice(product)) }}</span>
                        <span class="price-sale">{{ formatPrice(getSellingPrice(product)) }}</span>
                      </template>
                      <span v-else class="price-regular">{{ formatPrice(getSellingPrice(product)) }}</span>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
          </div><!-- Close vertical-column -->
        </div><!-- Close verticals-sidebar -->
      </div><!-- Close layout-grid -->
    </div><!-- Close containerx -->
  </section>
</template>

<script setup>
import { ref, computed, reactive, defineProps, onMounted, onUnmounted } from 'vue'
import CountdownTimer from '../components/CountdownTimer.vue'

const props = defineProps({
  flashSales: {
    type: Array,
    required: true
  },
  categoryProducts: {
    type: Array,
    default: () => []
  }
})

// Refs for containers
const dealsContainer = ref(null)

// Current indexes
const dealsCurrentIndex = ref(0)
const verticalIndexes = reactive({
  0: 0,
  1: 0,
  2: 0
})

// Drag scroll state
const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)

// Auto-play timer
let autoPlayInterval = null

// Flatten all flash sale items with variant names
const allFlashItems = computed(() => {
  return props.flashSales.flatMap(sale =>
    sale.items.map(item => ({
      ...item,
      flashSaleEndTime: sale.endTime
    }))
  )
})

// Get first 3 categories for vertical products (wider columns for better display)
const verticalCategories = computed(() => {
  return props.categoryProducts.slice(0, 3)
})

const formatPrice = (value) => {
  if (!value) return '0₫'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value)
}

const hasDiscount = (product) => {
  // Kiểm tra nếu có variant nào có giá bán (sellingPrice) khác giá gốc (price)
  return product.variants?.some(v => v.sellingPrice && v.sellingPrice < v.price)
}

const getSellingPrice = (product) => {
  // Lấy giá bán thấp nhất từ các variants
  if (!product.variants || product.variants.length === 0) {
    return product.minPrice || 0
  }

  const sellingPrices = product.variants
    .map(v => v.sellingPrice || v.price)
    .filter(price => price !== null && price !== undefined)

  return sellingPrices.length > 0 ? Math.min(...sellingPrices) : product.minPrice || 0
}

const getOriginalPrice = (product) => {
  // Lấy giá gốc thấp nhất từ các variants (để hiển thị giá gạch ngang)
  if (!product.variants || product.variants.length === 0) {
    return product.minPrice || 0
  }

  const prices = product.variants
    .map(v => v.price)
    .filter(price => price !== null && price !== undefined)

  return prices.length > 0 ? Math.min(...prices) : product.minPrice || 0
}

const chunkProducts = (products, size) => {
  const chunks = []
  for (let i = 0; i < products.length; i += size) {
    chunks.push(products.slice(i, i + size))
  }
  return chunks
}

const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'
}

// Resolve product id from flash sale item (fallbacks included)
const getProductId = (item) => {
  if (!item) return ''
  if (item.productId) return item.productId
  if (item.product && (item.product.id || item.product.productId)) return item.product.id || item.product.productId
  if (typeof item.product === 'number') return item.product
  if (item.id) return item.id
  return ''
}

// Scroll deals navigation
const scrollDeals = (direction) => {
  if (!dealsContainer.value) {
    console.log('Container not found')
    return
  }

  // Stop auto-play when user manually navigates
  stopAutoPlay()

  const container = dealsContainer.value
  const containerWidth = container.offsetWidth

  if (direction === 'next' && dealsCurrentIndex.value < allFlashItems.value.length - 1) {
    dealsCurrentIndex.value++
  } else if (direction === 'prev' && dealsCurrentIndex.value > 0) {
    dealsCurrentIndex.value--
  }

  // Scroll to the current index
  container.scrollTo({
    left: containerWidth * dealsCurrentIndex.value,
    behavior: 'smooth'
  })

  // Restart auto-play after 3 seconds
  setTimeout(() => {
    startAutoPlay()
  }, 3000)
}

// Scroll vertical products navigation
const scrollVertical = (categoryIndex, direction) => {
  const maxPages = Math.ceil(verticalCategories.value[categoryIndex]?.products?.length / 5) || 0

  if (direction === 'next' && verticalIndexes[categoryIndex] < maxPages - 1) {
    verticalIndexes[categoryIndex]++
  } else if (direction === 'prev' && verticalIndexes[categoryIndex] > 0) {
    verticalIndexes[categoryIndex]--
  }
}

// Drag scroll for deals
const startDragDeals = (e) => {
  if (!dealsContainer.value) return

  stopAutoPlay()

  isDragging.value = true
  startX.value = e.pageX - dealsContainer.value.offsetLeft
  scrollLeft.value = dealsContainer.value.scrollLeft
}

const onDragDeals = (e) => {
  if (!isDragging.value || !dealsContainer.value) return
  e.preventDefault()
  const x = e.pageX - dealsContainer.value.offsetLeft
  const walk = (x - startX.value) * 2
  dealsContainer.value.scrollLeft = scrollLeft.value - walk
}

const endDragDeals = () => {
  if (!dealsContainer.value) return
  isDragging.value = false

  // Update current index based on scroll position
  const containerWidth = dealsContainer.value.offsetWidth
  const scrollPosition = dealsContainer.value.scrollLeft
  dealsCurrentIndex.value = Math.round(scrollPosition / containerWidth)

  // Restart auto-play after 3 seconds
  setTimeout(() => {
    startAutoPlay()
  }, 3000)
}

// Auto-play functionality
const startAutoPlay = () => {
  if (autoPlayInterval) return

  autoPlayInterval = setInterval(() => {
    if (dealsCurrentIndex.value < allFlashItems.value.length - 1) {
      scrollDeals('next')
    } else {
      dealsCurrentIndex.value = 0
      if (dealsContainer.value) {
        dealsContainer.value.scrollTo({
          left: 0,
          behavior: 'smooth'
        })
      }
    }
  }, 5000) // Auto next every 5 seconds
}

const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style scoped>

/* ===== SECTION ===== */
.best-deals-section {
  padding: 40px 0;
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  box-sizing: border-box !important;
}

/* Use default containerx styles - no override needed */



/* ===== LAYOUT GRID - Split 30/70 ===== */
.best-deals-section .layout-grid {
  display: flex !important;
  gap: 20px !important;
  width: 100% !important;
  max-width: none !important;
}

/* ===== LEFT SIDE - Best Deals (30%) ===== */
.best-deals-section .section-wrapper {
  flex: 0 0 30% !important;
  min-width: 0 !important;
  max-width: 30% !important;
}

/* ===== RIGHT SIDE - Verticals (70% with 3 wider columns) ===== */
.best-deals-section .verticals-sidebar {
  flex: 1 !important;
  display: grid !important;
  grid-template-columns: repeat(3, 1fr) !important;
  gap: 24px !important;
  min-width: 0 !important;
  max-width: none !important;
}

/* Mobile - single column */
@media (max-width: 767px) {
  .best-deals-section .layout-grid {
    flex-direction: column !important;
  }

  .best-deals-section .verticals-sidebar {
    grid-template-columns: 1fr !important;
  }
}

/* Tablet - stack vertically, 2 columns for categories */
@media (min-width: 768px) and (max-width: 1199px) {
  .best-deals-section .layout-grid {
    flex-direction: column !important;
  }

  .best-deals-section .section-wrapper {
    margin-bottom: 20px !important;
  }

  .best-deals-section .verticals-sidebar {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

/* Desktop - side by side 30/70 with 3 wide columns on right */
@media (min-width: 1200px) {
  .best-deals-section .layout-grid {
    flex-direction: row !important;
    flex-wrap: nowrap !important;
  }

  .best-deals-section .section-wrapper {
    flex: 0 0 30% !important;
    max-width: 30% !important;
  }

  .best-deals-section .verticals-sidebar {
    grid-template-columns: repeat(3, 1fr) !important;
  }
}

/* Large Desktop - 3 columns with more gap */
@media (min-width: 1600px) {
  .best-deals-section .verticals-sidebar {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 28px !important;
  }
}


/* ===== CARD WRAPPER ===== */
.card-wrap {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  height: 100%;
  display: flex;
  flex-direction: column;
  min-width: 0;
  transition: box-shadow 0.3s ease, transform 0.2s ease;
}

.card-wrap:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}


.card-body {
  padding: 20px 15px 60px;
  flex: 1;
  position: relative;
  overflow: hidden;
}

/* ===== DAILY DEALS ===== */
.daily-deals-column {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

/* Header Row: Title + Navigation Buttons */
.deals-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.deals-title {
  font-size: 22px;
  font-weight: 600;
  color: #292b2c;
  margin: 0;
}

.deals-title b {
  font-weight: 700;
  color: #ff6b35;
}

/* Navigation Text at Bottom Corners */
.deals-navigation {
  position: absolute;
  bottom: 15px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
  z-index: 10;
}

.deals-nav-btn {
  position: relative;
  width: auto;
  height: auto;
  margin: 0;
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  color: #292b2c;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
  letter-spacing: 0.5px;
  pointer-events: auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.deals-nav-btn:hover:not(:disabled) {
  color: #ff6b35;
  background: #ffffff;
  border-color: #ff6b35;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.deals-nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

/* Separator Line with Orange Segment */
.deals-separator {
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, #ff6b35 0%, #ff8c61 30%, #e0e0e0 30%, #f5f5f5 100%);
  margin-bottom: 20px;
}

/* Deals Container */
.deals-container {
  position: relative;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  display: flex;
  scrollbar-width: none;
  -ms-overflow-style: none;
  cursor: grab !important;
  user-select: none;
}

.deals-container:active {
  cursor: grabbing !important;
}

.deals-container::-webkit-scrollbar {
  display: none;
}

.deals-container * {
  cursor: inherit;
}

.deal-item {
  flex: 0 0 100%;
  scroll-snap-align: start;
}

.deal-content {
  text-align: center;
  padding: 20px 15px;
  overflow: hidden;
}

.deal-image-link {
  display: block;
  margin: 0 auto 20px;
  max-width: 100%;
  transition: transform 0.3s ease;
  cursor: pointer !important;
}

.deal-image-link:hover {
  transform: scale(1.05);
}

.deal-image {
  width: 100%;
  height: 220px;
  object-fit: contain;
  background: #ffffff;
  border-radius: 8px;
  padding: 15px;
  transition: transform 0.3s ease;
}

.deal-image:hover {
  transform: scale(1.05);
}

.deal-title {
  display: -webkit-box;
  font-size: 16px;
  font-weight: 500;
  color: #292b2c;
  text-decoration: none;
  margin: 15px auto 20px;
  line-height: 1.5;
  min-height: 48px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  cursor: pointer !important;
  transition: color 0.2s ease;
}

.deal-title:hover {
  color: #ff6b35;
}

.deal-pricing {
  margin: 15px 0 20px;
}

.price-sale {
  font-size: 26px;
  font-weight: 700;
  color: #ff4757;
  margin-right: 12px;
  text-shadow: 0 1px 2px rgba(255, 71, 87, 0.1);
}

.price-old {
  font-size: 18px;
  color: #999;
  text-decoration: line-through;
  font-weight: 400;
}

.deal-stock-info {
  margin-top: 20px;
}

.stock-numbers {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 13px;
  color: #666;
}

.stock-numbers strong {
  color: #292b2c;
  font-weight: 600;
}

.stock-bar {
  height: 8px;
  background: #e8e8e8;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #4893c9 0%, #1a8bbc 50%, #1652a0 100%);
  transition: width 0.6s ease;
  border-radius: 6px;
  position: relative;
}

.bar-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255,255,255,0.3) 50%,
    transparent 100%
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}


/* ===== VERTICAL PRODUCTS (No Card Frame) ===== */
.vertical-column {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

/* Header Row: Title + Navigation Buttons */
.vertical-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.vertical-title {
  font-size: 16px;
  font-weight: 600;
  color: #292b2c;
  margin: 0;
  padding: 0;
}

/* Navigation Buttons */
.vertical-nav-buttons {
  display: flex;
  gap: 6px;
}

.vertical-nav-btn {
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  margin: 0;
  padding: 0;
  font-size: 20px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vertical-nav-btn:hover:not(:disabled) {
  color: #ff6b35;
}

.vertical-nav-btn:disabled {
  opacity: 0.25;
  cursor: not-allowed;
}

/* Separator Line with Orange Segment */
.vertical-separator {
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, #ff6b35 0%, #ff8c61 30%, #e0e0e0 30%, #f5f5f5 100%);
  margin-bottom: 20px;
}

/* No Products Message */
.no-products {
  padding: 40px 20px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

/* Vertical Container */
.vertical-container {
  position: relative;
  min-height: 450px;
}

.vertical-page {
  display: none;
}

.vertical-page.active {
  display: block;
}

.product-item {
  display: flex;
  gap: 14px;
  padding: 14px 10px;
  border-bottom: 1px solid #f0f0f0;
  text-decoration: none;
  transition: none;
  transform: none;
  box-shadow: none;
}

.product-item:hover {
  background: transparent;
  transform: none;
  box-shadow: none;
}

.product-item:last-child {
  border-bottom: none;
}

.item-thumb {
  flex: 0 0 90px;
  width: 90px;
  height: 90px;
  background: #ffffff;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  padding: 8px;
}

.product-item:hover .item-thumb {
  transform: none;
  border-color: #f0f0f0;
}

.item-thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: none;
  transform: none;
}

.product-item:hover .item-thumb img {
  transform: none;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  transition: none;
}

.item-title {
  font-size: 14px;
  font-weight: 500;
  color: #292b2c;
  line-height: 1.5;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  min-height: 42px;
  transition: color 0.2s ease;
  text-decoration: none;
  cursor: pointer;
}

.product-item:hover .item-title {
  color: #ff6b35;
}

.item-pricing {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.price-regular {
  font-size: 15px;
  font-weight: 700;
  color: #ef4444;
}

.price-old {
  font-size: 14px;
  font-weight: 400;
  color: #9ca3af;
  text-decoration: line-through;
  text-decoration-thickness: 1.5px;
}

.price-sale {
  font-size: 16px;
  font-weight: 700;
  color: #ef4444;
}



/* ===== RESPONSIVE ===== */
@media (max-width: 767px) {
  .best-deals-section .containerx {
    padding: 0 20px !important;
  }

  .card-body {
    padding: 20px 15px;
  }

  .deal-image {
    height: 220px;
  }


  .item-thumb {
    flex: 0 0 70px;
    width: 70px;
    height: 70px;
  }

  .item-title {
    font-size: 13px;
  }
}
</style>

<style>
/* ===== GLOBAL OVERRIDES - NOT SCOPED ===== */
/* Force full width for parent containers */
.home-page {
  width: 100% !important;
  max-width: none !important;
}

.main-content {
  width: 100% !important;
  max-width: none !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.best-deals-section {
  width: 100% !important;
  max-width: none !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.best-deals-section .containerx {
  width: 100% !important;
  max-width: none !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}
</style>
