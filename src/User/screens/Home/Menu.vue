<template>
  <div class="containerx">
    <div class="content-wrapper">
      <aside class="sidebar">
        <div class="category-menu">
          <div
            v-for="category in categoriesTree"
            :key="category.id"
            class="category-item-wrapper"
            @mouseenter="showMegaMenu(category, $event)"
            @mouseleave="hideMegaMenu"
          >
            <!-- Root Category -->
            <div
              class="category-item"
              :class="{ 'has-children': category.children && category.children.length > 0 }"
              @click="navigateToProducts(category.id)"
            >
              <div class="category-content">
                <font-awesome-icon :icon="getCategoryIcon(category.name)" />
                <span>{{ category.name }}</span>
              </div>
              <!-- Arrow Icon using SVG instead of FontAwesome -->
              <svg
                v-if="category.children && category.children.length > 0"
                class="expand-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>

            <!-- Mega Menu for Subcategories -->
            <div
              v-if="category.children && category.children.length > 0 && hoveredCategory === category.id"
              class="mega-menu"
              :style="megaMenuStyle"
              @mouseenter="keepMegaMenuOpen"
              @mouseleave="hideMegaMenu"
            >
              <div class="mega-menu-content">
                <div class="mega-menu-columns">
                  <div
                    v-for="child in category.children"
                    :key="child.id"
                    class="mega-menu-column"
                  >
                    <!-- Parent subcategory (bold) -->
                    <h5 class="mega-category-title" @click="navigateToProducts(child.id)">
                      {{ child.name }}
                    </h5>

                    <!-- Children of subcategory (if any) -->
                    <ul v-if="child.children && child.children.length > 0" class="mega-subcategory-list">
                      <li
                        v-for="grandchild in child.children"
                        :key="grandchild.id"
                        class="mega-subcategory-item"
                        @click="navigateToProducts(grandchild.id)"
                      >
                        {{ grandchild.name }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <section class="hero-section">
        <div class="hero-slide">
          <div class="hero-content">
            <h1 class="hero-title">DJI MAVIC PRO</h1>
            <p class="hero-subtitle">
              The creative's shop for flying cameras and flight controllers
            </p>
          </div>
          <div class="hero-image"></div>
        </div>
      </section>

      <section class="product-cards">
        <div class="product-card-1 leather-bags">
          <div class="card-content"></div>
        </div>

        <div class="product-card-1 iphone-card">
          <div class="card-content"></div>
        </div>
      </section>
    </div>

    <section class="features">
      <div class="features-grid">
        <div class="feature-item" v-for="feature in features" :key="feature.id">
          <font-awesome-icon v-if="feature.icon" :icon="feature.icon" class="feature-icon" />
          <div class="feature-content">
            <h4 class="feature-title">{{ feature.title }}</h4>
            <p class="feature-desc">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <div class="product-showcase">
      <div class="product-showcase-1">
        <!-- Header Section -->
        <div class="header-section">
          <h4 class="main-title">Top Categories in Sales and Trending</h4>
          <p class="subtitle">
            Last Month up to 1500+ Products Sales From this category. You can choose a product from
            here and save money.
          </p>
        </div>

        <!-- Categories Section -->
        <div class="categories-section">
          <div class="categories-grid">
            <div
              v-for="category in showcaseCategories"
              :key="category.id"
              class="category-card"
              :class="{ active: category.id === activeCategory }"
              @click="selectCategory(category.id)"
            >
              <div class="category-icon">
                <img v-if="category.icon" :src="category.icon" :alt="category.name" />
                <font-awesome-icon v-else :icon="getCategoryIcon(category.name)" />
              </div>
              <span class="category-name">{{ category.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Products Section - Always visible -->
      <div class="products-section">

        <!-- Loading State -->
        <div v-if="loadingProducts" class="loading-state">
          <div class="spinner"></div>
          <p>Loading products...</p>
        </div>

        <!-- Products Container Wrapper with Navigation -->
        <div v-else-if="filteredProducts.length > 0" class="products-wrapper">
          <!-- Left Navigation Button -->
          <button
            v-if="canScrollLeft"
            class="scroll-nav-btn scroll-left"
            @click="scrollProducts('left')"
            aria-label="Scroll left"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <!-- Products Container -->
          <div
            ref="productsContainer"
            class="products-container"
            @scroll="handleProductsScroll"
          >
            <div
              class="menu-product-card"
              v-for="product in filteredProducts"
              :key="product.id"
            >
              <!-- Product Badges -->
              <div class="product-badges">
                <span v-if="!product.inStock" class="badge out-of-stock">Out of Stock</span>
                <span v-else-if="product.discount" class="badge discount">{{ product.discount }}</span>
                <span v-else-if="product.isNew" class="badge new">New</span>
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
                <div v-if="product.brand" class="product-brand">{{ product.brand }}</div>

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

          <!-- Right Navigation Button -->
          <button
            v-if="canScrollRight"
            class="scroll-nav-btn scroll-right"
            @click="scrollProducts('right')"
            aria-label="Scroll right"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          <!-- Scroll Indicators (Dots) -->
          <div class="scroll-indicators">
            <span
              v-for="index in scrollDots"
              :key="index"
              class="dot"
              :class="{ active: index - 1 === currentDotIndex }"
              @click="scrollToPage(index - 1)"
            ></span>
          </div>
        </div>

        <!-- No Products State -->
        <div v-else class="no-products-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p>No products found in this category.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCategories, getTrendingCategories } from '@/api/categoryApi'
import { getProductsByCategory } from '@/api/productApi'

export default {
  name: 'CategoryMenu',
  data() {
    return {
      activeCategory: null,
      categories: [],
      categoriesTree: [],
      features: [],
      showcaseCategories: [],
      products: [],
      loadingCategories: false,
      loadingTrending: false,
      loadingProducts: false,
      hoveredCategory: null,
      hideMenuTimeout: null,
      megaMenuStyle: {}, // <-- added: inline style for positioning mega menu
      canScrollLeft: false,
      canScrollRight: false,
      currentDotIndex: 0,
      scrollDots: 0,
    }
  },
  computed: {
    filteredProducts() {
      return this.products
    },
  },
  methods: {
    // Navigate to Product page with category filter
    navigateToProducts(categoryId) {
      this.$router.push({
        name: 'Product',
        query: { category: categoryId }
      })
    },

    // Navigate to Product Detail page
    navigateToProductDetail(productId) {
      this.$router.push({
        name: 'ProductDetail',
        params: { id: productId }
      })
    },

    // Select category and load products
    async selectCategory(categoryId) {
      this.activeCategory = categoryId
      await this.loadProducts(categoryId)
    },

    // Get icon for category based on name
    getCategoryIcon(categoryName) {
      const iconMap = {
        'Electronics': 'laptop',
        'Mobiles': 'mobile-alt',
        'Mobile Accessories': 'headphones',
        'Hot Brands': 'fire',
        'Laptops': 'laptop',
        'Computer Accessories': 'keyboard',
        'Bluetooth': 'bluetooth',
        'Earbuds': 'headphones',
        'Wireless Headphones': 'headphones-alt',
        "Men's Fashion": 'tshirt',
        'Consumer Electronics': 'laptop',
        'Watches': 'clock',
        'Home Appliances': 'home',
        'Backpacks': 'bag-shopping',
        "Women's Fashion": 'female',
        'Television': 'tv',
        'Tablets': 'tablet',
      }
      return iconMap[categoryName] || 'th-large'
    },

    // Build category tree structure
    buildCategoryTree(categories) {
      // Create a map for quick lookup
      const categoryMap = {}
      categories.forEach(cat => {
        categoryMap[cat.id] = { ...cat, children: [], isExpanded: false }
      })

      // Build tree structure
      const tree = []
      categories.forEach(cat => {
        if (cat.parentId === null || cat.parentId === undefined) {
          // This is a root category
          tree.push(categoryMap[cat.id])
        } else {
          // This is a child category
          const parent = categoryMap[cat.parentId]
          if (parent) {
            parent.children.push(categoryMap[cat.id])
          }
        }
      })

      return tree
    },

    // Fetch categories from API
    async loadCategories() {
      try {
        this.loadingCategories = true
        const response = await getCategories()
        console.log('Categories response:', response)

        if (response.code === 200 && response.result) {
          const activeCategories = response.result.filter(cat => cat.isActive)
          this.categories = activeCategories

          // Build tree structure for sidebar menu
          this.categoriesTree = this.buildCategoryTree(activeCategories).slice(0, 10)
          console.log('Categories tree:', this.categoriesTree)
        }
      } catch (error) {
        console.error('Error loading categories:', error)
        // Fallback to default categories if API fails
        this.categories = [
          { id: 11, name: 'Consumer Electronics', parentId: null },
          { id: 10, name: "Men's Fashion", parentId: null },
          { id: 12, name: 'Watches', parentId: null },
          { id: 13, name: 'Home Appliances', parentId: null },
          { id: 14, name: 'Backpacks', parentId: null },
          { id: 15, name: "Women's Fashion", parentId: null },
        ]
        this.categoriesTree = this.buildCategoryTree(this.categories)
      } finally {
        this.loadingCategories = false
      }
    },

    // Show mega menu on hover
    showMegaMenu(category, event) {
      // Clear any pending hide timeout
      if (this.hideMenuTimeout) {
        clearTimeout(this.hideMenuTimeout)
        this.hideMenuTimeout = null
      }

      if (category.children && category.children.length > 0) {
        // First set hoveredCategory so the menu mounts
        this.hoveredCategory = category.id

        // If we have the hovered wrapper element, compute position after the menu renders
        if (event && event.currentTarget) {
          const wrapperRect = event.currentTarget.getBoundingClientRect()

          // Set a temporary style so the menu mounts visibly (will be adjusted shortly)
          this.megaMenuStyle = {
            position: 'fixed',
            left: `${wrapperRect.right + 12}px`,
            top: `${wrapperRect.top}px`,
            zIndex: 2000,
            minWidth: '900px',
            maxWidth: '1100px'
          }

          // Wait for DOM update so the specific menu element exists, then measure that element
          this.$nextTick(() => {
            // Use the wrapper element to find the nested menu (more reliable than document.querySelector)
            const wrapper = event.currentTarget
            const menuEl = wrapper.querySelector('.mega-menu')
            if (!menuEl) return

            const menuRect = menuEl.getBoundingClientRect()
            const vw = window.innerWidth || document.documentElement.clientWidth
            const vh = window.innerHeight || document.documentElement.clientHeight

            let left = wrapperRect.right + 12
            let top = wrapperRect.top

            // debug logs for position troubleshooting
            console.debug('[mega-menu] wrapperRect:', wrapperRect)
            console.debug('[mega-menu] initial menuRect:', menuRect)

            // If menu overflows right edge, place it to the left of the wrapper
            if (menuRect.right > vw) {
              left = Math.max(12, wrapperRect.left - menuRect.width - 12)
              console.debug('[mega-menu] overflow right -> placing left at', left)
            }

            // If menu overflows bottom, move it up so it fits
            if (menuRect.bottom > vh) {
              top = Math.max(12, vh - menuRect.height - 12)
              console.debug('[mega-menu] overflow bottom -> adjusting top to', top)
            }

            // Apply adjusted coordinates
            this.megaMenuStyle = Object.assign({}, this.megaMenuStyle, {
              left: `${left}px`,
              top: `${top}px`
            })
            console.debug('[mega-menu] applied style', this.megaMenuStyle)
          })
        }
      }
    },

    // Hide mega menu with delay
    hideMegaMenu() {
      // Add delay before hiding to allow mouse movement to mega menu
      this.hideMenuTimeout = setTimeout(() => {
        this.hoveredCategory = null
        this.megaMenuStyle = {}
      }, 300) // 300ms delay
    },

    // Keep mega menu open when hovering over it
    keepMegaMenuOpen() {
      // Clear the hide timeout when mouse enters mega menu
      if (this.hideMenuTimeout) {
        clearTimeout(this.hideMenuTimeout)
        this.hideMenuTimeout = null
      }
    },

    // Fetch trending categories from API
    async loadTrendingCategories() {
      try {
        this.loadingTrending = true
        const response = await getTrendingCategories()

        if (response.code === 200 && response.result) {
          this.showcaseCategories = response.result.slice(0, 6).map(cat => ({
            ...cat,
            icon: cat.thumbnail?.url || cat.thumbnail || null
          }))
        }
      } catch (error) {
        console.error('Error loading trending categories:', error)
        this.showcaseCategories = this.categories.slice(0, 6).map(cat => ({
          ...cat,
          icon: cat.thumbnail?.url || cat.thumbnail || null
        }))
      } finally {
        this.loadingTrending = false
      }
    },

    // Load products by category
    async loadProducts(categoryId) {
      try {
        console.log('Loading products for category:', categoryId)
        this.loadingProducts = true
        this.products = []

        const response = await getProductsByCategory(categoryId)
        console.log('Products API response:', response)

        if (response.code === 200 && response.result && response.result.content) {
          console.log('Products content:', response.result.content)
          // Map API response to product display format
          this.products = response.result.content.map(item => ({
            id: item.id,
            name: item.name,
            thumbnail: item.thumbnail?.url || item.thumbnail || '/placeholder.png',
            minPrice: item.minPrice,
            maxPrice: item.maxPrice,
            inStock: item.inStock,
            brand: item.brand,
            categories: item.categories,
            isNew: item.newFrom && item.newTo ? this.isProductNew(item.newFrom, item.newTo) : false,
            discount: this.calculateDiscount(item),
            hasVariants: item.variants && item.variants.length > 0
          }))
          console.log('Mapped products:', this.products)
          console.log('filteredProducts:', this.filteredProducts)
        } else {
          console.warn('Invalid response structure:', response)
        }
      } catch (error) {
        console.error('Error loading products:', error)
        this.products = []
      } finally {
        this.loadingProducts = false
        this.updateScrollDots()
      }
    },

    // Check if product is new
    isProductNew(newFrom, newTo) {
      const today = new Date().toISOString().split('T')[0]
      return today >= newFrom && today <= newTo
    },

    // Calculate discount percentage
    calculateDiscount(product) {
      if (!product.variants || product.variants.length === 0) return null

      // Find variant with selling price (discount applied)
      const variantWithDiscount = product.variants.find(v =>
        v.sellingPrice && v.price && v.sellingPrice < v.price
      )

      if (!variantWithDiscount) return null

      const discountPercent = Math.round(
        ((variantWithDiscount.price - variantWithDiscount.sellingPrice) / variantWithDiscount.price) * 100
      )
      return discountPercent > 0 ? `-${discountPercent}%` : null
    },

    // Format price for display
    formatPrice(price) {
      if (!price) return '0đ'
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price)
    },

    // Handle image error
    handleImageError(event) {
      event.target.src = '/placeholder.png'
    },

    // Scroll products left or right
    scrollProducts(direction) {
      const container = this.$refs.productsContainer
      if (!container) return

      const scrollAmount = container.clientWidth * 0.8 // Scroll 80% of visible width
      const targetScroll = direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount

      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      })
    },

    // Handle scroll event to update buttons and indicators
    handleProductsScroll() {
      const container = this.$refs.productsContainer
      if (!container) return

      // Update scroll button visibility
      this.canScrollLeft = container.scrollLeft > 10
      this.canScrollRight = container.scrollLeft < (container.scrollWidth - container.clientWidth - 10)

      // Update current dot index
      const scrollPercentage = container.scrollLeft / (container.scrollWidth - container.clientWidth)
      this.currentDotIndex = Math.round(scrollPercentage * (this.scrollDots - 1))
    },

    // Scroll to specific page
    scrollToPage(index) {
      const container = this.$refs.productsContainer
      if (!container) return

      const scrollPerPage = (container.scrollWidth - container.clientWidth) / (this.scrollDots - 1)
      container.scrollTo({
        left: scrollPerPage * index,
        behavior: 'smooth'
      })
    },

    // Update scroll dots count
    updateScrollDots() {
      this.$nextTick(() => {
        const container = this.$refs.productsContainer
        if (!container) return

        const visibleWidth = container.clientWidth
        const totalWidth = container.scrollWidth

        // Calculate number of pages (dots)
        this.scrollDots = Math.max(1, Math.ceil(totalWidth / visibleWidth))

        // Update initial scroll state
        this.handleProductsScroll()
      })
    },
  },
  async mounted() {
    // Initialize features
    this.features = [
      { id: 1,
        icon: ['fas', 'headset'],
        title: '24/7 SUPPORT',
        description: 'Support every time',
      },
      { id: 2,
        icon: ['fas', 'credit-card'],
        title: 'ACCEPT PAYMENT',
        description: 'Visa, Paypal, Master',
      },
      { id: 3,
        icon: ['fas', 'shield-alt'],
        title: 'SECURED PAYMENT',
        description: '100% secured',
      },
      { id: 4,
        icon: ['fas', 'truck'],
        title: 'FREE SHIPPING',
        description: 'Order over $100',
      },
      { id: 5,
        icon: null, // intentionally no icon for this feature
        title: '30 DAYS RETURN',
        description: '30 days guarantee',
      },
    ]
    // Load data from APIs
    await this.loadCategories()
    await this.loadTrendingCategories()

    if (this.showcaseCategories.length > 0) {
      this.activeCategory = this.showcaseCategories[0].id
      await this.loadProducts(this.activeCategory)
    }
  },
}
</script>

<style scoped>
/* Products Section */
.products-section {
  margin-top: 30px;
  width: 100%;
  background: #fff;
}

/* Products Wrapper with Navigation */
.products-wrapper {
  position: relative;
  width: 100%;
}

.products-container {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 20px 0;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.products-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

/* Navigation Buttons */
.scroll-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.scroll-nav-btn:hover {
  background: #fff;
  border-color: #ff6b35;
  box-shadow: 0 4px 16px rgba(0, 104, 225, 0.2);
}

.scroll-nav-btn svg {
  color: #4b5563;
  transition: color 0.3s ease;
}

.scroll-nav-btn:hover svg {
  color: #ff6b35;
}

.scroll-left {
  left: -24px;
}

.scroll-right {
  right: -24px;
}

/* Scroll Indicators (Dots) */
.scroll-indicators {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  padding-bottom: 10px;
}

.scroll-indicators .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d1d5db;
  cursor: pointer;
  transition: all 0.3s ease;
}

.scroll-indicators .dot:hover {
  background: #9ca3af;
  transform: scale(1.2);
}

.scroll-indicators .dot.active {
  background: #ff6b35;
  width: 24px;
  border-radius: 4px;
}


/* Product Card - Modern Design */
.menu-product-card {
  position: relative;
  min-width: 220px;
  max-width: 220px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.3s;
  background: #fff;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.menu-product-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* Product Badges */
.product-badges {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
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

.badge.out-of-stock {
  background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
  color: white;
}

.badge.discount {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  color: white;
}

.badge.new {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: white;
}

/* Product Image */
.product-image-wrapper {
  width: 100%;
  height: 192px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  overflow: hidden;
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
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d1d5db;
}

/* Product Info */
.product-info-wrapper {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.product-brand {
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.product-title {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  line-height: 1.4;
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  height: 40px;
  cursor: pointer;
  transition: color 0.2s;
}

.product-title:hover {
  color: #ff6b35;
}

/* Pricing */
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
  align-items: baseline;
  gap: 6px;
  flex-wrap: wrap;
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

/* Quick View Button */
.quick-view-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 8px;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  color: #0068e1;
  font-size: 0;
  cursor: pointer;
  transition: all 0.3s ease;
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
  color: #6b7280;
  font-size: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top-color: #ff6b35;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* No Products State */
.no-products-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #9ca3af;
  text-align: center;
}

.no-products-state svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.no-products-state p {
  font-size: 16px;
  margin: 0;
}

/* Category Menu */
/* Ensure sidebar allows overflow for mega menu */
.sidebar {
  position: relative;
  overflow: visible !important;
}

.category-menu {
  position: relative;
  overflow: visible !important;
}

/* Category Menu */
.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 15px;
  cursor: pointer;
  transition: all 0.18s ease;
  border-radius: 6px;
  position: relative; /* needed for left bar pseudo */
  background: transparent; /* ensure no bg on default */
}

.category-item:hover {
  background: transparent;
  transform: none;
}

.category-item::before {
  content: '';
  position: absolute;
  left: 0; /* flush to the very left */
  top: 0;
  bottom: 0;
  width: 0; /* default hidden */
  background: #ff6b35;
  border-radius: 0; /* straight edge */
  transition: width 0.18s ease;
}

.category-item:hover::before {
  width: 3px; /* reveal thin straight bar */
}

/* Ensure category-content aligns correctly */
.category-content {
  padding-left: 8px; /* space between indicator and icon/text */
}

/* Remove any left padding/margin on icons that could look like a line */
.category-content svg, .category-content .fa-icon {
  margin: 0;
  padding: 0;
}

/* Remove any list-style markers in sidebar that might appear as vertical lines */
.category-menu, .category-item-wrapper, .category-item, .mega-menu-column, .mega-subcategory-list {
  list-style: none !important;
}

/* Only change the category text color on hover, keep icons subtle */
.category-item:hover .category-content span {
  color: #ff6b35;
}

/* Remove bullet before subcategory items to keep menu minimal (only single left bar) */
.mega-subcategory-item:before {
  display: none;
  content: none;
}

/* Remove heavy hover motion for expand icon */
.expand-icon {
  width: 16px;
  height: 16px;
  color: #6b7280;
  stroke: #6b7280;
  transition: color 0.18s ease, transform 0.18s ease;
  flex-shrink: 0;
}

.category-item:hover .expand-icon {
  color: #94baf0;
  stroke: #94baf0;
  transform: none;
}

/* Keep icon neutral by default; only text turns blue on hover */
.category-content svg,
.category-content .fa-icon {
  font-size: 18px;
  color: #6b7280 !important; /* neutral gray */
  background: transparent !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}

/* Ensure icon does NOT change to blue on hover */
.category-item:hover .category-content svg,
.category-item:hover .category-content .fa-icon {
  color: #6b7280 !important;
}

/* Keep expand icon subtle on hover */
.category-item:hover .expand-icon {
  color: #94baf0; /* light subtle */
  stroke: #94baf0;
  transform: none;
}

/* Ensure each category-item wrapper is a positioned ancestor so its mega-menu can be positioned next to the hovered root */
.category-item-wrapper {
  position: relative; /* <-- added: makes .mega-menu position relative to this wrapper */
  background: transparent !important;
}

/* Mega Menu - larger, more spacious, slightly less bold titles */
.mega-menu {
  position: absolute;
  left: 100%;
  top: 0;
  margin-left: 12px;
  min-width: 900px; /* increased width */
  max-width: 1100px; /* increased max */
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 14px 50px rgba(0, 0, 0, 0.12);
  z-index: 1000;
  animation: fadeInRight 0.22s ease;
}

.mega-menu-content {
  padding: 22px 28px; /* a bit more padding */
}

.mega-menu-columns {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* more columns on wider menu */
  gap: 28px;
  column-gap: 32px;
}

.mega-menu-column {
  display: flex;
  flex-direction: column;
  overflow-x: auto; /* allow horizontal scroll if long texts */
  -webkit-overflow-scrolling: touch;
}

/* Hide horizontal scrollbar but allow scrolling */
.mega-menu-column::-webkit-scrollbar { display: none; }
.mega-menu-column { -ms-overflow-style: none; scrollbar-width: none; }

/* Parent subcategory title - slightly lighter bold */
.mega-category-title {
  font-size: 15px;
  font-weight: 600; /* slightly less bold */
  color: #1f2937;
  margin: 0 0 12px 0;
  padding-bottom: 0;
  cursor: pointer;
  transition: color 0.18s ease;
  white-space: nowrap; /* keep on one line */
}

.mega-category-title:hover {
  color: #0068e1;
}

/* Children list - single-line items, no extra padding shift on hover */
.mega-subcategory-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* Align children directly under the parent title (remove extra left indent) */
.mega-subcategory-item {
  font-size: 14px;
  color: #4b5563;
  padding: 6px 0;
  cursor: pointer;
  transition: color 0.12s ease;
  position: relative;
  white-space: nowrap; /* prevent wrapping */
  overflow: visible; /* allow overflow horizontally (user can scroll) */
}

/* On hover only change color - no padding change */
.mega-subcategory-item:hover {
  color: #0068e1;
}

/* Ensure the mega menu text that overflows can be read: allow horizontal scroll inside column */
.mega-menu-column .mega-subcategory-list,
.mega-menu-column .mega-category-title {
  display: block;
}

/* Make sure no other element draws a left border or pseudo-element in the sidebar */
.category-item, .category-item-wrapper, .category-item * {
  border-left: none !important;
  box-shadow: none !important;
}

/* Remove any other pseudo elements that might show a vertical line */
.category-item::after,
.category-item-wrapper::before,
.category-item-wrapper::after,
.category-item *::before,
.category-item *::after {
  content: none !important;
  display: none !important;
}

/* Keep only the intended thin straight bar via ::before */
.category-item::before {
  /* already defined above - ensure it sits above any leftover artifacts */
  z-index: 2;
}

/* Ensure mega-menu doesn't inherit any left border from parent */
.mega-menu {
  border-left: none !important;
}

/* Force-disable any icon backgrounds or pseudo elements inside category menu */
.category-menu .svg-inline--fa,
.category-menu .fa,
.category-menu .fas,
.category-menu .far,
.category-menu .fal,
.category-menu .fad,
.category-menu svg {
  background-image: none !important;
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
  color: #6b7280 !important;
  padding: 0 !important;
  margin: 0 !important;
  border-radius: 0 !important;
}

/* Remove pseudo elements from FontAwesome-generated elements */
.category-menu .svg-inline--fa::before,
.category-menu .fa::before,
.category-menu svg::before,
.category-menu svg::after {
  content: none !important;
  display: none !important;
}

/* Also ensure the font-awesome wrapper (if any) doesn't add background */
.category-menu .fa-stack,
.category-menu .fa-stack-1x,
.category-menu .fa-stack-2x {
  background: transparent !important;
  box-shadow: none !important;
}

/* Ensure no rounded marker exists on the left from other rules */
.category-item-wrapper {
  background: transparent !important;
}

/* Force svg icons to use stroke/currentColor and no fill */
.category-content svg,
.category-content svg * {
  background: transparent !important;
  fill: none !important;
  stroke: currentColor !important;
  color: #6b7280 !important;
}

/* If fontawesome provides <svg><circle> shapes, hide fill on circles */
.category-content svg circle,
.category-content svg rect,
.category-content svg ellipse {
  fill: none !important;
  stroke: currentColor !important;
}

/* Prevent hover from adding background to any descendant */
.category-item:hover * {
  background-color: transparent !important;
}

/* Ensure the left bar stays the only visible indicator and sits above icons */
.category-item::before {
  z-index: 10;
}
.category-content {
  position: relative;
  z-index: 5; /* below the ::before so the bar is visible */
}

/* Remove any accidental circular pseudo added by icon wrappers */
.category-content .fa-stack,
.category-content .fa-stack * {
  background: transparent !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}

/* Responsive */
@media (max-width: 768px) {
  .menu-product-card {
    min-width: 200px;
    max-width: 200px;
  }

  .product-image-wrapper {
    height: 180px;
  }

  .products-title {
    font-size: 20px;
  }

  .view-all-btn {
    padding: 6px 12px;
    font-size: 12px;
  }

  .scroll-nav-btn {
    width: 40px;
    height: 40px;
  }

  .scroll-left {
    left: -20px;
  }

  .scroll-right {
    right: -20px;
  }

  .scroll-indicators {
    margin-top: 12px;
  }

  .scroll-indicators .dot {
    width: 6px;
    height: 6px;
  }

  .scroll-indicators .dot.active {
    width: 18px;
  }
}
</style>
