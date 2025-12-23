<template>
  <div>
    <Header />

    <!-- Overlay -->
    <div v-if="sidebarOpen" class="sidebar-overlay" @click="sidebarOpen = false"></div>

    <div class="shop-container">
      <!-- Sidebar -->
      <div class="sidebar" :class="{ 'sidebar-open': sidebarOpen }">
        <div class="sidebar-header">
          <h2 class="sidebar-title">Browse Categories</h2>
          <button class="sidebar-close-btn" @click="sidebarOpen = false">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Danh mục từ API -->
        <div v-if="isLoadingCategories" class="loading-categories">Loading categories...</div>
        <ul v-else class="category-list">
          <li v-for="cat in categories" :key="cat.id" class="category-item">
            <div class="category-header" @click="toggleCategoryOpen(cat.id)">
              <svg
                class="chevron-icon"
                :class="{ 'chevron-open': cat.isOpen }"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
              {{ cat.name }}
            </div>
            <ul v-if="cat.subcategories?.length && cat.isOpen" class="subcategory-list">
              <li
                v-for="sub in cat.subcategories"
                :key="sub.id"
                class="subcategory-item"
                @click.stop="toggleCategory(sub.id)"
                :class="{ active: selectedCategories.includes(sub.id) }"
              >
                <svg class="subcategory-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 6 15 12 9 18"></polyline>
                </svg>
                {{ sub.name }}
              </li>
            </ul>
          </li>
        </ul>

        <!-- Filters Section -->
        <div class="filters-section">
          <h3 class="section-title">Filters</h3>
          <div class="price-filter">
            <h4 class="filter-title">Price</h4>
            <div class="price-inputs">
              <input
                type="text"
                :value="formatPriceInput(priceRange[0])"
                @input="updateMinPrice($event.target.value)"
                class="price-input"
                placeholder="Min"
              />
              <span class="price-separator">-</span>
              <input
                type="text"
                :value="formatPriceInput(priceRange[1])"
                @input="updateMaxPrice($event.target.value)"
                class="price-input"
                placeholder="Max"
              />
            </div>
            <input
              type="range"
              min="0"
              :max="100000000"
              v-model.number="priceRange[1]"
              class="price-slider"
              @input="setPriceRange(priceRange[0], priceRange[1])"
            />
          </div>
        </div>

        <!-- Sorting Controls (Mobile/Tablet Only) -->
        <div class="sidebar-controls">
          <h3 class="section-title">Sorting & Display</h3>

          <div class="sidebar-control-group">
            <label class="control-label">Sort By</label>
            <select v-model="sortBy" @change="setSort(sortBy)" class="sidebar-select">
              <option value="updatedAt,desc">Latest</option>
              <option value="minPrice,asc">Price: Low to High</option>
              <option value="minPrice,desc">Price: High to Low</option>
            </select>
          </div>

          <div class="sidebar-control-group">
            <label class="control-label">Items Per Page</label>
            <select v-model.number="pageSize" @change="setPageSize(pageSize)" class="sidebar-select">
              <option value="20">20</option>
              <option value="40">40</option>
              <option value="60">60</option>
            </select>
          </div>

          <div class="sidebar-control-group">
            <label class="control-label">View Mode</label>
            <div class="sidebar-view-toggle">
              <button
                @click="viewMode = 'grid'"
                :class="['sidebar-view-btn', { active: viewMode === 'grid' }]"
              >
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                <span>Grid</span>
              </button>
              <button
                @click="viewMode = 'list'"
                :class="['sidebar-view-btn', { active: viewMode === 'list' }]"
              >
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
                <span>List</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Latest Products -->
        <div class="latest-products">
          <h3 class="section-title">Latest Products</h3>
          <div v-if="latestProducts.length" class="latest-products-list">
            <div v-for="p in latestProducts" :key="p.id" class="latest-product-item">
              <div class="latest-product-image">
                <img :src="p.image" :alt="p.name" />
              </div>
              <div class="latest-product-info">
                <p class="latest-product-name">{{ p.name }}</p>
                <div class="latest-product-price">
                  <span class="latest-product-price">
                    {{ formatPrice(p.price) }}
                    <template v-if="p.maxPrice && p.maxPrice > p.price">
                      - {{ formatPrice(p.maxPrice) }}
                    </template>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="no-latest-products">
            No new products at the moment.
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Header -->
        <div class="content-header">
          <button class="sidebar-toggle-btn" @click="sidebarOpen = true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            <span>Categories</span>
          </button>
          <div class="header-title-section">
            <h1 class="page-title">Shop</h1>
            <p v-if="keyword" class="search-info">
              Search results for: <strong>"{{ keyword }}"</strong>
              <button @click="clearSearch" class="clear-search-btn" title="Clear search">
                ×
              </button>
            </p>
          </div>
          <div class="header-controls">
            <!-- View Toggle -->
            <div class="view-toggle">
              <button
                @click="viewMode = 'grid'"
                :class="['view-btn', { active: viewMode === 'grid' }]"
              >
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </button>
              <button
                @click="viewMode = 'list'"
                :class="['view-btn', { active: viewMode === 'list' }]"
              >
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </button>
            </div>
            <!-- Sorting + Items per page -->
            <select v-model="sortBy" @change="setSort(sortBy)" class="control-select">
              <option value="updatedAt,desc">Latest</option>
              <option value="minPrice,asc">Price: Low to High</option>
              <option value="minPrice,desc">Price: High to Low</option>
            </select>
            <select v-model.number="pageSize" @change="setPageSize(pageSize)" class="control-select">
              <option value="20">20</option>
              <option value="40">40</option>
              <option value="60">60</option>
            </select>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="products-grid">
          <!-- Loading State -->
          <div v-if="isLoading" class="products-loading">
            <div class="loading-spinner"></div>
            <p class="loading-text">Loading products...</p>
          </div>

          <!-- Products -->
          <template v-else>
            <div v-for="p in products" :key="p.id" class="product-card">
              <div class="product-card-inner">
                <div class="product-badge-row">
                  <span v-if="p.discount" class="sale-badge">{{ p.discount }}</span>
                  <span v-else-if="p.badge" :class="['badge', p.badgeColor]">{{ p.badge }}</span>
                  <!-- wishlist button removed from product list: wishlist is variant-specific and should be managed on the Product Detail page -->
                </div>

                <div class="product-image" @click="goToProductDetail(p.id)" style="cursor: pointer;">
                  <img :src="p.image" :alt="p.name" />
                </div>

                <h3 class="product-name" @click="goToProductDetail(p.id)" style="cursor: pointer;">
                  {{ p.name }}
                </h3>
                <!--
                <div class="rating">
                  <span v-for="i in 5" :key="i" class="star">★</span>
                  <span class="review-count">0 Review</span>
                </div>
                 -->
                <div class="product-footer">
                  <div class="price-group">
                    <div class="price-group">
                      <span class="price-range">
                        {{ formatPrice(p.price) }}
                        <template v-if="p.maxPrice > p.price">
                          - {{ formatPrice(p.maxPrice) }}
                        </template>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Phân trang -->
        <div v-if="totalPages > 1" class="pagination">
          <button @click="changePage(currentPage - 1)" :disabled="!hasPrevPage" class="page-btn">Trước</button>
          <button
            v-for="n in Math.min(5, totalPages)"
            :key="n"
            @click="changePage(n - 1)"
            :class="['page-btn', { active: currentPage === n - 1 }]"
          >{{ n }}</button>
          <button @click="changePage(currentPage + 1)" :disabled="!hasNextPage" class="page-btn">Sau</button>
        </div>
      </div>
    </div>

    <Footer />

    <!--
    <div style="position: fixed; bottom: 10px; left: 10px; background: #000; color: lime; padding: 10px; font-size: 12px; z-index: 9999; font-family: monospace;">
      <div>Products: {{ products.length }}</div>
      <div>Categories: {{ categories.length }}</div>
      <div>Latest: {{ latestProducts.length }}</div>
      <div v-for="p in products.slice(0,1)" :key="p.id">
        ID: {{ p.id }} | Name: {{ p.name }}
      </div>
    </div>
    -->
    <Chatbot />
    <BottomNavBar />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import Header from '@/User/components/Header1/Header.vue';
import Footer from '@/User/components/Footer/Footer.vue';
import { useProductStore } from '@/User/stores/productStore.js';
import Chatbot from '@/User/components/Chatbot/Chatbot.vue'
import BottomNavBar from '@/User/components/BottomNavBar.vue'

const router = useRouter();
const route = useRoute();
const store = useProductStore();
const {
  products,
  latestProducts,
  categories,
  isLoading,
  isLoadingCategories,
  totalPages,
  currentPage,
  pageSize,
  sortBy,
  priceRange,
  selectedCategories,
  keyword,
  hasPrevPage,
  hasNextPage
} = storeToRefs(store);

const {
  fetchCategories,
  fetchProducts,
  setSort,
  setPageSize,
  setPriceRange,
  setKeyword,
  toggleCategory,
  toggleCategoryOpen,
  changePage,
} = store;

const sidebarOpen = ref(false);
const viewMode = ref('grid');

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
const formatPriceInput = (price) => new Intl.NumberFormat('vi-VN').format(price);

const updateMinPrice = (val) => {
  const num = parseInt(val.replace(/\./g, '') || '0', 10);
  setPriceRange(num, priceRange.value[1]);
};
const updateMaxPrice = (val) => {
  const num = parseInt(val.replace(/\./g, '') || '0', 10);
  setPriceRange(priceRange.value[0], num);
};

const goToProductDetail = (id) => {
  router.push({ name: 'ProductDetail', params: { id } });
};

const clearSearch = () => {
  setKeyword('');
  router.push({ path: '/product' });
};

// Watch viewMode để thay đổi class grid/list nếu cần
watch(viewMode, (newMode) => {
  document.body.classList.toggle('list-view', newMode === 'list');
  document.body.classList.toggle('grid-view', newMode === 'grid');
}, { immediate: true });

// Watch for category query parameter changes
watch(() => route.query.category, async (categoryId) => {
  if (categoryId) {
    // Select the category if it's not already selected
    const categoryIdNum = parseInt(categoryId);
    if (!selectedCategories.value.includes(categoryIdNum)) {
      // Clear existing selections and select the new category
      selectedCategories.value = [categoryIdNum];
      // Find and open parent category if this is a subcategory
      const category = categories.value.find(cat => cat.id === categoryIdNum);
      if (category && category.parentId) {
        toggleCategoryOpen(category.parentId);
      }
      await fetchProducts();
    }
  }
}, { immediate: false });

// Watch for keyword query parameter changes
watch(() => route.query.keyword, async (searchKeyword) => {
  if (searchKeyword !== undefined) {
    const keywordStr = searchKeyword || '';
    if (keyword.value !== keywordStr) {
      setKeyword(keywordStr);
    }
  }
}, { immediate: false });

onMounted(async () => {
  console.log('Store instance:', store);
  await fetchCategories();

  // Check if there's a keyword query parameter
  const searchKeyword = route.query.keyword;
  if (searchKeyword) {
    setKeyword(searchKeyword);
  }

  // Check if there's a category query parameter
  const categoryId = route.query.category;
  if (categoryId) {
    const categoryIdNum = parseInt(categoryId);
    selectedCategories.value = [categoryIdNum];

    // Wait for categories to be loaded before opening parent
    await nextTick();
    const category = categories.value.find(cat => cat.id === categoryIdNum);
    if (category && category.parentId) {
      toggleCategoryOpen(category.parentId);
    }
  }

  await fetchProducts();
  await nextTick();
  console.log('After render - Products:', products.value.length);
});
</script>

<style src="./product.css" scoped></style>
