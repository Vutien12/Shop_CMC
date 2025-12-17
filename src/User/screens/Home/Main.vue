<template>
  <main class="main-content">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>

    <!-- Main Content -->
    <template v-else>
      <!-- Banner Section - Static -->
      <Menu />

      <!-- Banner Promotional -->
      <div class="promotional-banner">
        <div class="banner-container">
          <div
            v-for="(image, index) in bannerImages1"
            :key="index"
            class="banner-item"
          >
            <img :src="image" :alt="`Banner ${index + 1}`" class="banner-image" />
          </div>
        </div>
      </div>

      <!-- Best Deals Section (Flash Sale + Vertical Products) -->
      <BestDealsSection
        v-if="flashSales.length > 0"
        :flashSales="flashSales"
        :categoryProducts="categoryProducts"
      />
      <!-- Featured Brands Section -->
      <BrandsSection
        v-if="brands.length > 0"
        :brands="brands"
      />

      <!-- Featured Products Showcase Section -->
      <div class="containerx">
        <div class="product-showcase">
          <!-- Minimal Header with Tabs and Navigation -->
          <div class="showcase-header">
            <!-- Tabs on the left -->
            <div class="showcase-tabs">
              <button
                class="tab-btn"
                :class="{ active: activeProductTab === 'featured' }"
                @click="selectProductTab('featured')"
              >
                Featured
              </button>
              <button
                class="tab-btn"
                :class="{ active: activeProductTab === 'special' }"
                @click="selectProductTab('special')"
              >
                Special Offers
              </button>
              <button
                class="tab-btn"
                :class="{ active: activeProductTab === 'new-arrivals' }"
                @click="selectProductTab('new-arrivals')"
              >
                New Arrivals
              </button>
            </div>

            <!-- Navigation on the right -->
            <div class="showcase-nav">
              <button
                class="nav-btn"
                @click="scrollProducts('left')"
                :disabled="currentPage === 0"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="15 18 9 12 15 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                PREV
              </button>
              <button
                class="nav-btn"
                @click="scrollProducts('right')"
                :disabled="currentPage >= maxPages - 1"
              >
                NEXT
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="9 18 15 12 9 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Horizontal Line Separator -->
          <div class="showcase-divider"></div>

          <!-- Products Section - Horizontal Scrollable -->
          <div class="products-section-showcase">
            <!-- Loading State -->
            <div v-if="loadingProducts" class="loading-state">
              <div class="spinner"></div>
              <p>Loading products...</p>
            </div>

            <!-- Products Container - Horizontal Scroll -->
            <div v-else-if="filteredProducts().length > 0" class="products-scroll-wrapper">
              <div
                class="products-container-horizontal"
                ref="productsContainer"
                @mousedown="startDrag"
                @mousemove="onDrag"
                @mouseup="endDrag"
                @mouseleave="endDrag"
              >
                <div
                  class="menu-product-card"
                  v-for="product in filteredProducts()"
                  :key="product.id"
                >
                  <!-- Product Badges -->
                  <div class="product-badges">
                    <span v-if="!product.inStock" class="badge out-of-stock">Out of Stock</span>
                    <span v-else-if="product.minPrice < product.maxPrice" class="badge discount">Sale</span>
                    <span v-else-if="product.newFrom || product.newTo" class="badge new">New</span>
                  </div>

                  <!-- Product Image -->
                  <div class="product-image-wrapper" @click="navigateToProductDetail(product.id)">
                    <img
                      v-if="product.thumbnail"
                      :src="product.thumbnail"
                      :alt="product.name"
                      @error="handleImageError"
                      class="product-img"
                    />
                    <div v-else class="no-image">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </div>
                  </div>

                  <!-- Product Info -->
                  <div class="product-info-wrapper">
                    <!-- Brand -->
                    <div v-if="product.brand" class="product-brand">{{ product.brand.name || product.brand }}</div>

                    <!-- Product Name -->
                    <h5 class="product-title" @click="navigateToProductDetail(product.id)">{{ product.name }}</h5>

                    <!-- Price Section -->
                    <div class="product-pricing">
                      <div class="price-group">
                        <template v-if="product.minPrice === product.maxPrice">
                          <span class="price-current">{{ formatPrice(product.minPrice) }}</span>
                        </template>
                        <template v-else>
                          <span class="price-range">{{ formatPrice(product.minPrice) }} - {{ formatPrice(product.maxPrice) }}</span>
                        </template>
                      </div>

                      <!-- Quick View Button -->
                      <button class="quick-view-btn" @click="navigateToProductDetail(product.id)">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M14.3623 7.3635C14.565 7.6477 14.6663 7.78983 14.6663 8.00016C14.6663 8.2105 14.565 8.35263 14.3623 8.63683C13.4516 9.9139 11.1258 12.6668 7.99967 12.6668C4.87353 12.6668 2.54774 9.9139 1.63703 8.63683C1.43435 8.35263 1.33301 8.2105 1.33301 8.00016C1.33301 7.78983 1.43435 7.6477 1.63703 7.3635C2.54774 6.08646 4.87353 3.3335 7.99967 3.3335C11.1258 3.3335 13.4516 6.08646 14.3623 7.3635Z" stroke="currentColor" stroke-width="1.2"/>
                          <path d="M10 8C10 6.8954 9.1046 6 8 6C6.8954 6 6 6.8954 6 8C6 9.1046 6.8954 10 8 10C9.1046 10 10 9.1046 10 8Z" stroke="currentColor" stroke-width="1.2"/>
                        </svg>
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- No Products State -->
            <div v-else class="no-products-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p>No products found.</p>
            </div>
          </div>

          <!-- Pagination Dots -->
          <div v-if="filteredProducts().length > 0 && maxPages > 1" class="pagination-dots">
            <button
              v-for="page in maxPages"
              :key="page"
              class="dot"
              :class="{ active: currentPage === page - 1 }"
              @click="goToPage(page - 1)"
            ></button>
          </div>
        </div>
      </div>

      <!-- Banner Promotional 2 - two banners side-by-side (no extra background) -->
      <div class="containerx">
        <div class="two-banners-row">
          <div
            v-for="(image, index) in bannerImages2List"
            :key="index"
            class="banner-block"
          >
            <img :src="image" :alt="`Banner ${index + 1}`" class="banner-full" />
          </div>
        </div>
      </div>

      <!-- Category Products Showcase Section (2 Rows) -->
      <div class="containerx">
        <div class="product-showcase category-showcase">
          <!-- Minimal Header with Tabs and Navigation -->
          <div class="showcase-header">
            <!-- Tabs on the left -->
            <div class="showcase-tabs">
              <button
                class="tab-btn"
                :class="{ active: activeCategoryTab === 'mobiles' }"
                @click="selectCategoryTab('mobiles')"
              >
                Mobiles
              </button>
              <button
                class="tab-btn"
                :class="{ active: activeCategoryTab === 'fashion' }"
                @click="selectCategoryTab('fashion')"
              >
                Fashion
              </button>
              <button
                class="tab-btn"
                :class="{ active: activeCategoryTab === 'laptops' }"
                @click="selectCategoryTab('laptops')"
              >
                Laptops
              </button>
              <button
                class="tab-btn"
                :class="{ active: activeCategoryTab === 'tablets' }"
                @click="selectCategoryTab('tablets')"
              >
                Tablets
              </button>
            </div>

            <!-- Navigation on the right -->
            <div class="showcase-nav">
              <button
                class="nav-btn"
                @click="scrollCategoryProducts('left')"
                :disabled="currentCategoryPage === 0"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="15 18 9 12 15 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                PREV
              </button>
              <button
                class="nav-btn"
                @click="scrollCategoryProducts('right')"
                :disabled="currentCategoryPage >= maxCategoryPages - 1"
              >
                NEXT
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="9 18 15 12 9 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Horizontal Line Separator -->
          <div class="showcase-divider"></div>

          <!-- Products Section - Horizontal Scrollable with 2 Rows -->
          <div class="products-section-showcase">
            <!-- Loading State -->
            <div v-if="loadingCategoryProducts" class="loading-state">
              <div class="spinner"></div>
              <p>Loading products...</p>
            </div>

            <!-- Products Container - Horizontal Scroll with 2 Rows -->
            <div v-else-if="filteredCategoryProducts().length > 0" class="products-scroll-wrapper">
              <div
                class="products-container-horizontal two-rows"
                ref="categoryProductsContainer"
                @mousedown="startDragCategory"
                @mousemove="onDragCategory"
                @mouseup="endDragCategory"
                @mouseleave="endDragCategory"
              >
                <div
                  class="menu-product-card"
                  v-for="product in filteredCategoryProducts()"
                  :key="product.id"
                >
                  <!-- Product Badges -->
                  <div class="product-badges">
                    <span v-if="!product.inStock" class="badge out-of-stock">Out of Stock</span>
                    <span v-else-if="product.minPrice < product.maxPrice" class="badge discount">Sale</span>
                    <span v-else-if="product.newFrom || product.newTo" class="badge new">New</span>
                  </div>

                  <!-- Product Image -->
                  <div class="product-image-wrapper" @click="navigateToProductDetail(product.id)">
                    <img
                      v-if="product.thumbnail"
                      :src="product.thumbnail"
                      :alt="product.name"
                      @error="handleImageError"
                      class="product-img"
                    />
                    <div v-else class="no-image">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </div>
                  </div>

                  <!-- Product Info -->
                  <div class="product-info-wrapper">
                    <!-- Brand -->
                    <div v-if="product.brand" class="product-brand">{{ product.brand.name || product.brand }}</div>

                    <!-- Product Name -->
                    <h5 class="product-title" @click="navigateToProductDetail(product.id)">{{ product.name }}</h5>

                    <!-- Price Section -->
                    <div class="product-pricing">
                      <div class="price-group">
                        <template v-if="product.minPrice === product.maxPrice">
                          <span class="price-current">{{ formatPrice(product.minPrice) }}</span>
                        </template>
                        <template v-else>
                          <span class="price-range">{{ formatPrice(product.minPrice) }} - {{ formatPrice(product.maxPrice) }}</span>
                        </template>
                      </div>

                      <!-- Quick View Button -->
                      <button class="quick-view-btn" @click="navigateToProductDetail(product.id)">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M14.3623 7.3635C14.565 7.6477 14.6663 7.78983 14.6663 8.00016C14.6663 8.2105 14.565 8.35263 14.3623 8.63683C13.4516 9.9139 11.1258 12.6668 7.99967 12.6668C4.87353 12.6668 2.54774 9.9139 1.63703 8.63683C1.43435 8.35263 1.33301 8.2105 1.33301 8.00016C1.33301 7.78983 1.43435 7.6477 1.63703 7.3635C2.54774 6.08646 4.87353 3.3335 7.99967 3.3335C11.1258 3.3335 13.4516 6.08646 14.3623 7.3635Z" stroke="currentColor" stroke-width="1.2"/>
                          <path d="M10 8C10 6.8954 9.1046 6 8 6C6.8954 6 6 6.8954 6 8C6 9.1046 6.8954 10 8 10C9.1046 10 10 9.1046 10 8Z" stroke="currentColor" stroke-width="1.2"/>
                        </svg>
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- No Products State -->
            <div v-else class="no-products-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p>No products found.</p>
            </div>
          </div>

          <!-- Pagination Dots -->
          <div v-if="filteredCategoryProducts().length > 0 && maxCategoryPages > 1" class="pagination-dots">
            <button
              v-for="page in maxCategoryPages"
              :key="page"
              class="dot"
              :class="{ active: currentCategoryPage === page - 1 }"
              @click="goToCategoryPage(page - 1)"
            ></button>
          </div>
        </div>
      </div>

      <!-- Recent Blog Posts Section -->
      <RecentPosts />
    </template>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { searchProducts, getNewArrivals, getSpecialProducts, getFeaturedProducts } from '@/api/productApi'
import { getCategories } from '@/api/categoryApi'
import { getBrands } from '@/api/brandApi'
import { getActiveFlashSales } from '@/api/flashsaleApi'

import Menu from './Menu.vue'
import BestDealsSection from './sections/BestDealsSection.vue'
import BrandsSection from './sections/BrandsSection.vue'
import RecentPosts from './RecentPosts.vue'

// State
const loading = ref(true)
const flashSales = ref([])
const brands = ref([])
const categories = ref([])
const newArrivals = ref([])
const specialProducts = ref([])
const featuredProducts = ref([])
const latestProducts = ref([])
const categoryProducts = ref([])
const activeProductTab = ref('featured')
const loadingProducts = ref(false)
const currentPage = ref(0)
const itemsPerPage = ref(6)
const productsContainer = ref(null)
const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)

// Category Showcase Section State
const categoryShowcaseProducts = ref({
  mobiles: [],
  fashion: [],
  laptops: [],
  tablets: []
})
const activeCategoryTab = ref('mobiles')
const loadingCategoryProducts = ref(false)
const currentCategoryPage = ref(0)
const categoryProductsContainer = ref(null)
const isDraggingCategory = ref(false)
const startXCategory = ref(0)
const scrollLeftCategory = ref(0)

// Banner images
const bannerImages1 = ref([
  'https://asia.fleetcart.envaysoft.com/storage/media/SnNz5B0YIEGCw1OdLhFJbqF7hfCNc80adaLCdqOE.png',
  'https://asia.fleetcart.envaysoft.com/storage/media/3YFgcINuEaLyLvy6QjxKwKVDMALI9qzmXEN7Vqx3.png',
  'https://asia.fleetcart.envaysoft.com/storage/media/pmQxhyWNznFCMZvc4KTv4HNk4RfG3eBlNqR0xsCt.png',
])

const bannerImages2 = ref([
  'https://asia.fleetcart.envaysoft.com/storage/media/kSSkGodUfAKYy1UVZ8CicO8oay5PKO4L3DdEE9Tw.png',
  'https://asia.fleetcart.envaysoft.com/storage/media/VVyvSfw4dAZI57qelPofORurzNNc7rDlsxVbTO5m.png',
])

// Prepare first two banners for display to avoid mixing v-for and v-if
const bannerImages2List = computed(() => bannerImages2.value.slice(0, 2))


// Fetch all data on mount
onMounted(async () => {
  try {
    await Promise.all([
      fetchFlashSales(),
      fetchBrands(),
      fetchCategories(),
      fetchNewArrivals(),
      fetchSpecialProducts(),
      fetchFeaturedProducts(),
      fetchLatestProducts(),
    ])

    // Fetch products by categories after categories are loaded
    await Promise.all([
      fetchProductsByCategories(),
      fetchCategoryShowcaseProducts()
    ])
  } catch (error) {
    console.error('Error loading home page data:', error)
  } finally {
    loading.value = false
  }
})

// Computed property to get filtered products based on active tab
const filteredProducts = () => {
  switch (activeProductTab.value) {
    case 'new-arrivals':
      return newArrivals.value
    case 'special':
      return specialProducts.value
    case 'featured':
      return featuredProducts.value
    default:
      return featuredProducts.value
  }
}

// Computed property for max pages
const maxPages = computed(() => {
  const total = filteredProducts().length
  return Math.ceil(total / itemsPerPage.value)
})

// Method to change active tab
const selectProductTab = (tab) => {
  activeProductTab.value = tab
  currentPage.value = 0
  if (productsContainer.value) {
    productsContainer.value.scrollLeft = 0
  }
}

// Navigate to product detail
const navigateToProductDetail = (productId) => {
  window.location.href = `/productdetail/${productId}`
}

// Format price helper
const formatPrice = (value) => {
  if (value === null || value === undefined || value === '') return '0đ'
  const num = Number(value)
  if (!Number.isFinite(num)) return '0đ'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(num)
}

// Handle image error
const handleImageError = (event) => {
  event.target.style.display = 'none'
  event.target.parentElement.classList.add('error')
}

// Scroll products left/right
const scrollProducts = (direction) => {
  if (!productsContainer.value) return

  const container = productsContainer.value
  const cardWidth = 260 // card width + gap
  const scrollAmount = cardWidth * itemsPerPage.value

  if (direction === 'left') {
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
    if (currentPage.value > 0) currentPage.value--
  } else {
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    if (currentPage.value < maxPages.value - 1) currentPage.value++
  }
}

// Go to specific page
const goToPage = (page) => {
  if (!productsContainer.value) return

  const container = productsContainer.value
  const cardWidth = 260
  const scrollAmount = cardWidth * itemsPerPage.value * page

  container.scrollTo({ left: scrollAmount, behavior: 'smooth' })
  currentPage.value = page
}

// Drag scroll functionality
const startDrag = (e) => {
  if (!productsContainer.value) return
  isDragging.value = true
  startX.value = e.pageX - productsContainer.value.offsetLeft
  scrollLeft.value = productsContainer.value.scrollLeft
  productsContainer.value.style.cursor = 'grabbing'
}

const onDrag = (e) => {
  if (!isDragging.value || !productsContainer.value) return
  e.preventDefault()
  const x = e.pageX - productsContainer.value.offsetLeft
  const walk = (x - startX.value) * 2
  productsContainer.value.scrollLeft = scrollLeft.value - walk
}

const endDrag = () => {
  if (!productsContainer.value) return
  isDragging.value = false
  productsContainer.value.style.cursor = 'grab'

  // Update current page based on scroll position
  const container = productsContainer.value
  const cardWidth = 260
  const scrollAmount = cardWidth * itemsPerPage.value
  currentPage.value = Math.round(container.scrollLeft / scrollAmount)
}

// Category Showcase Section Methods
const filteredCategoryProducts = () => {
  return categoryShowcaseProducts.value[activeCategoryTab.value] || []
}

const maxCategoryPages = computed(() => {
  const total = filteredCategoryProducts().length
  return Math.ceil(total / itemsPerPage.value)
})

const selectCategoryTab = (tab) => {
  activeCategoryTab.value = tab
  currentCategoryPage.value = 0
  if (categoryProductsContainer.value) {
    categoryProductsContainer.value.scrollLeft = 0
  }
}

const scrollCategoryProducts = (direction) => {
  if (!categoryProductsContainer.value) return

  const container = categoryProductsContainer.value
  const cardWidth = 260
  const scrollAmount = cardWidth * itemsPerPage.value

  if (direction === 'left') {
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
    if (currentCategoryPage.value > 0) currentCategoryPage.value--
  } else {
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    if (currentCategoryPage.value < maxCategoryPages.value - 1) currentCategoryPage.value++
  }
}

const goToCategoryPage = (page) => {
  if (!categoryProductsContainer.value) return

  const container = categoryProductsContainer.value
  const cardWidth = 260
  const scrollAmount = cardWidth * itemsPerPage.value * page

  container.scrollTo({ left: scrollAmount, behavior: 'smooth' })
  currentCategoryPage.value = page
}

const startDragCategory = (e) => {
  if (!categoryProductsContainer.value) return
  isDraggingCategory.value = true
  startXCategory.value = e.pageX - categoryProductsContainer.value.offsetLeft
  scrollLeftCategory.value = categoryProductsContainer.value.scrollLeft
  categoryProductsContainer.value.style.cursor = 'grabbing'
}

const onDragCategory = (e) => {
  if (!isDraggingCategory.value || !categoryProductsContainer.value) return
  e.preventDefault()
  const x = e.pageX - categoryProductsContainer.value.offsetLeft
  const walk = (x - startXCategory.value) * 2
  categoryProductsContainer.value.scrollLeft = scrollLeftCategory.value - walk
}

const endDragCategory = () => {
  if (!categoryProductsContainer.value) return
  isDraggingCategory.value = false
  categoryProductsContainer.value.style.cursor = 'grab'

  const container = categoryProductsContainer.value
  const cardWidth = 260
  const scrollAmount = cardWidth * itemsPerPage.value
  currentCategoryPage.value = Math.round(container.scrollLeft / scrollAmount)
}

// Fetch Flash Sales
const fetchFlashSales = async () => {
  try {
    const response = await getActiveFlashSales()
    if (response.code === 200) {
      // Filter only ONGOING flash sales
      flashSales.value = response.result.filter(sale => sale.status === 'ONGOING')
    }
  } catch (error) {
    console.error('Error fetching flash sales:', error)
  }
}

// Fetch Brands
const fetchBrands = async () => {
  try {
    const response = await getBrands()
    if (response.code === 200) {
      // Filter only active brands and extract logo URLs from objects
      brands.value = response.result
        .filter(brand => brand.isActive)
        .map(brand => ({
          ...brand,
          fileLogo: brand.fileLogo?.url || brand.fileLogo || '/placeholder.png'
        }))
    }
  } catch (error) {
    console.error('Error fetching brands:', error)
  }
}

// Fetch Categories
const fetchCategories = async () => {
  try {
    const response = await getCategories()
    if (response.code === 200) {
      categories.value = response.result.filter(cat => cat.isActive)
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

// Fetch New Arrivals using new API
const fetchNewArrivals = async () => {
  try {
    const response = await getNewArrivals(12)
    if (response.code === 200) {
      newArrivals.value = response.result.map(product => ({
        ...product,
        thumbnail: product.thumbnail?.url || product.thumbnail
      }))
    }
  } catch (error) {
    console.error('Error fetching new arrivals:', error)
  }
}

// Fetch Special Products
const fetchSpecialProducts = async () => {
  try {
    const response = await getSpecialProducts(12)
    if (response.code === 200) {
      specialProducts.value = response.result.map(product => ({
        ...product,
        thumbnail: product.thumbnail?.url || product.thumbnail
      }))
    }
  } catch (error) {
    console.error('Error fetching special products:', error)
  }
}

// Fetch Featured Products
const fetchFeaturedProducts = async () => {
  try {
    const response = await getFeaturedProducts(12)
    if (response.code === 200) {
      featuredProducts.value = response.result.map(product => ({
        ...product,
        thumbnail: product.thumbnail?.url || product.thumbnail
      }))
    }
  } catch (error) {
    console.error('Error fetching featured products:', error)
  }
}

// Fetch products by specific category name
const fetchProductsByCategoryName = async (categoryName, limit = 12) => {
  try {
    // First, find the category by name
    const category = categories.value.find(cat =>
      cat.name.toLowerCase() === categoryName.toLowerCase()
    )

    if (!category) {
      console.warn(`Category ${categoryName} not found`)
      return []
    }

    // Fetch products for this category
    const response = await searchProducts({
      page: 0,
      size: limit,
      sort: 'updatedAt,desc',
      categoryIds: [category.id]
    })

    if (response.code === 200) {
      return response.result.content.map(product => ({
        ...product,
        thumbnail: product.thumbnail?.url || product.thumbnail
      }))
    }
    return []
  } catch (error) {
    console.error(`Error fetching products for ${categoryName}:`, error)
    return []
  }
}

// Fetch all category showcase products
const fetchCategoryShowcaseProducts = async () => {
  try {
    loadingCategoryProducts.value = true

    // Fetch products for each category in parallel
    const [mobiles, fashion, laptops, tablets] = await Promise.all([
      fetchProductsByCategoryName('Mobiles', 12),
      fetchProductsByCategoryName('Fashion', 12),
      fetchProductsByCategoryName('Laptops', 12),
      fetchProductsByCategoryName('Tablets', 12)
    ])

    categoryShowcaseProducts.value = {
      mobiles,
      fashion,
      laptops,
      tablets
    }
  } catch (error) {
    console.error('Error fetching category showcase products:', error)
  } finally {
    loadingCategoryProducts.value = false
  }
}

// Fetch Latest Products (sorted by updatedAt)
const fetchLatestProducts = async () => {
  try {
    const response = await searchProducts({
      page: 0,
      size: 8,
      sort: 'updatedAt,desc'
    })
    if (response.code === 200) {
      latestProducts.value = response.result.content.map(product => ({
        ...product,
        thumbnail: product.thumbnail?.url || product.thumbnail
      }))
    }
  } catch (error) {
    console.error('Error fetching latest products:', error)
  }
}

// Fetch Products by Top Categories
const fetchProductsByCategories = async () => {
  try {
    // Get top level categories (parentId is null)
    const topCategories = categories.value
      .filter(cat => cat.parentId === null)
      .slice(0, 3) // Get first 3 main categories

    const categoryProductsPromises = topCategories.map(async (category) => {
      try {
        const response = await searchProducts({
          page: 0,
          size: 6,
          categoryIds: [category.id],
          sort: 'updatedAt,desc'
        })

        return {
          category: category,
          products: response.code === 200
            ? response.result.content.map(product => ({
                ...product,
                thumbnail: product.thumbnail?.url || product.thumbnail
              }))
            : []
        }
      } catch (error) {
        console.error(`Error fetching products for category ${category.name}:`, error)
        return {
          category: category,
          products: []
        }
      }
    })

    categoryProducts.value = await Promise.all(categoryProductsPromises)
    // Filter out categories with no products
    categoryProducts.value = categoryProducts.value.filter(cp => cp.products.length > 0)
  } catch (error) {
    console.error('Error fetching products by categories:', error)
  }
}
</script>

<style scoped>
.main-content {
  width: 100%;
  padding: 20px 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.promotional-banner {
  width: 100%;
  margin-top: 50px;
}

.banner-container {
  display: grid;
  grid-template-columns: 1fr 2.5fr 1fr;
  gap: 20px;
}

/* For 2-banner layout (second promotional banner) */
.promotional-banner:last-of-type .banner-container {
  grid-template-columns: 1fr 1fr;
}

.banner-item {
  display: block;
  line-height: 0;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  background: none !important;
  padding: 0 !important;
  margin: 0 !important;
}

.banner-image {
  width: 100%;
  height: auto;
  display: block;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  border-radius: 8px;
}

.products-section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.view-all-link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #3373dc;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.view-all-link:hover {
  color: #2557b8;
}

.view-all-link .material-icons {
  font-size: 20px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
}

@media (max-width: 1400px) {
  .products-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  .banner-container {
    grid-template-columns: 1fr 2.5fr 1fr;
  }
}

@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .banner-container {
    grid-template-columns: 1fr 2fr 1fr;
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .banner-container {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .promotional-banner {
    margin-top: 30px;
  }
}

/* Product Showcase Section - Minimal Design */
.product-showcase {
  margin: 40px 0;
  width: 100%;
}

/* Showcase Header - Tabs and Navigation */
.showcase-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
  padding: 0;
}

/* Tabs on the left */
.showcase-tabs {
  display: flex;
  gap: 0;
}

.tab-btn {
  padding: 12px 24px;
  background: transparent;
  border: none;
  font-size: 16px;
  font-weight: 600;
  color: #565959;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  border-bottom: 3px solid transparent;
}

.tab-btn:hover {
  color: #0f1111;
}

.tab-btn.active {
  color: #ff6b35;
  border-bottom-color: #ff6b35;
}

/* Navigation on the right */
.showcase-nav {
  display: flex;
  gap: 12px;
}

.nav-btn {
  padding: 8px 16px;
  background: #ffffff;
  border: 1px solid #e3e6e6;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #0f1111;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-btn:hover:not(:disabled) {
  background: #ff6b35;
  color: #ffffff;
  border-color: #ff6b35;
}

.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.nav-btn svg {
  width: 16px;
  height: 16px;
}

/* Divider Line */
.showcase-divider {
  height: 1px;
  background: #e3e6e6;
  margin: 0 0 24px 0;
}

/* Products Section - Horizontal Scroll */
.products-section-showcase {
  margin-top: 0;
}

.products-scroll-wrapper {
  width: 100%;
  overflow: hidden;
}

.products-container-horizontal {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 20px 0;
  cursor: grab;
  user-select: none;

  /* Hide scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.products-container-horizontal::-webkit-scrollbar {
  display: none;
}

.products-container-horizontal:active {
  cursor: grabbing;
}

/* Two Rows Layout for Category Showcase */
.products-container-horizontal.two-rows {
  display: grid;
  grid-template-columns: repeat(auto-fill, 240px);
  grid-template-rows: repeat(2, auto);
  grid-auto-flow: column;
  gap: 20px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 20px 0;
}

/* Spacing for Category Showcase */
.category-showcase {
  margin-top: 40px;
}

.menu-product-card {
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.3s;
  border: 1px solid #e5e7eb;
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 220px;
  max-width: 220px;
  flex-shrink: 0;
  padding: 16px;
}

.menu-product-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.product-badges {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.badge.new {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: #ffffff;
}

.badge.discount {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  color: #ffffff;
}

.badge.out-of-stock {
  background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
  color: #ffffff;
}

.product-image-wrapper {
  width: 100%;
  height: 192px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  padding: 0;
  margin-bottom: 16px;
  border-radius: 4px;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.menu-product-card:hover .product-img {
  transform: none;
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
}

.no-image svg {
  color: #ccc;
}

.product-info-wrapper {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.product-brand {
  font-size: 11px;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.product-title {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  line-height: 1.4;
  margin: 0 0 8px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 40px;
  cursor: pointer;
  transition: color 0.2s;
}

.product-title:hover {
  color: #ff6b35;
}

.product-pricing {
  margin-top: auto;
  padding-top: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.price-group {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.price-current {
  font-size: 18px;
  font-weight: 700;
  color: #2563eb;
}

.price-range {
  font-size: 18px;
  font-weight: 700;
  color: #2563eb;
}

.quick-view-btn {
  width: 36px;
  height: 36px;
  padding: 8px;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0;
  color: #0068e1;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
  flex-shrink: 0;
}

.quick-view-btn:hover {
  background: #f3f4f6;
  border-color: #0068e1;
}

.quick-view-btn svg {
  width: 20px;
  height: 20px;
  stroke: #0068e1;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #ff6b35;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  font-size: 15px;
  color: #565959;
}

/* No Products State */
.no-products-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
}

.no-products-state svg {
  color: #ccc;
}

.no-products-state p {
  font-size: 15px;
  color: #565959;
}

/* Pagination Dots */
.pagination-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
  padding-bottom: 20px;
}

.pagination-dots .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e3e6e6;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.pagination-dots .dot:hover {
  background: #ff6b35;
  transform: scale(1.2);
}

.pagination-dots .dot.active {
  background: #ff6b35;
  width: 24px;
  border-radius: 4px;
}

/* Two banners row */
.two-banners-row {
  display: flex;
  gap: 20px;
  align-items: stretch;
  margin-top: 40px;
}

.banner-block {
  flex: 1 1 50%;
  overflow: hidden;
  border-radius: 12px;
  position: relative;
}

.banner-full {
  width: 100%;
  object-fit: cover; /* fill the block like RecentPosts background */
  display: block;
}

@media (max-width: 768px) {
  .two-banners-row {
    flex-direction: column;
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .showcase-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .showcase-nav {
    width: 100%;
    justify-content: flex-end;
  }
}

@media (max-width: 768px) {
  .showcase-tabs {
    flex-wrap: wrap;
  }

  .tab-btn {
    padding: 10px 16px;
    font-size: 14px;
  }

  .nav-btn {
    padding: 6px 12px;
    font-size: 12px;
  }

  .menu-product-card {
    min-width: 200px;
    max-width: 200px;
  }

  .product-image-wrapper {
    height: 180px;
  }

  .product-title {
    font-size: 13px;
  }

  .price-current {
    font-size: 16px;
  }
}
</style>
