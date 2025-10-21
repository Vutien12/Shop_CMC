<template>
  <div>
    <Header1 />
    <!-- Overlay -->
    <div
      v-if="sidebarOpen"
      class="sidebar-overlay"
      @click="sidebarOpen = false"
    ></div>
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
        <ul class="category-list">
          <li
            v-for="cat in categories"
            :key="cat.id"
            class="category-item"
          >
            <div
              class="category-header"
              @click="toggleCategory(cat.id)"
            >
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

            <!-- Subcategories -->
            <ul
              v-if="cat.subcategories && cat.isOpen"
              class="subcategory-list"
            >
              <li
                v-for="subcat in cat.subcategories"
                :key="subcat.id"
                class="subcategory-item"
              >
                <svg
                  class="subcategory-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <polyline points="9 6 15 12 9 18"></polyline>
                </svg>
                {{ subcat.name }}
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
                type="number"
                v-model.number="priceRange[0]"
                class="price-input"
              />
              <span class="price-separator">-</span>
              <input
                type="number"
                v-model.number="priceRange[1]"
                class="price-input"
              />
            </div>
            <input
              type="range"
              min="2"
              max="7499"
              v-model.number="priceRange[1]"
              class="price-slider"
            />
          </div>
        </div>

        <!-- Sorting Controls (Mobile/Tablet Only) -->
        <div class="sidebar-controls">
          <h3 class="section-title">Sorting & Display</h3>

          <div class="sidebar-control-group">
            <label class="control-label">Sort By</label>
            <select v-model="sortBy" class="sidebar-select">
              <option value="latest">Latest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          <div class="sidebar-control-group">
            <label class="control-label">Items Per Page</label>
            <select v-model.number="itemsPerPage" class="sidebar-select">
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
                <svg
                  class="icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
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
                <svg
                  class="icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
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
          <div class="latest-products-list">
            <div
              v-for="product in latestProducts"
              :key="product.id"
              class="latest-product-item"
            >
              <div class="latest-product-image">
                <img :src="product.image" :alt="product.name" />
              </div>
              <div class="latest-product-info">
                <p class="latest-product-name">{{ product.name }}</p>
                <div class="rating">
                  <span v-for="i in 5" :key="i" class="star">★</span>
                  <span class="review-count">{{ product.reviews }} Review</span>
                </div>
                <div class="latest-product-price">
                  <span
                    :class="['price', { 'discounted': product.originalPrice }]"
                  >${{ product.price.toFixed(2) }}</span>
                  <span
                    v-if="product.originalPrice"
                    class="original-price"
                  >${{ product.originalPrice.toFixed(2) }}</span>
                </div>
              </div>
            </div>
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
          <h1 class="page-title">Shop</h1>
          <div class="header-controls">
            <!-- View Toggle -->
            <div class="view-toggle">
              <button
                @click="viewMode = 'grid'"
                :class="['view-btn', { active: viewMode === 'grid' }]"
              >
                <svg
                  class="icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
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
                <svg
                  class="icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
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
            <select v-model="sortBy" class="control-select">
              <option value="latest">Latest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            <select v-model.number="itemsPerPage" class="control-select">
              <option value="20">20</option>
              <option value="40">40</option>
              <option value="60">60</option>
            </select>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="products-grid">
          <div
            v-for="product in products"
            :key="product.id"
            class="product-card"
          >
            <div class="product-card-inner">
              <div class="product-badge-row">
                <span
                  v-if="product.badge"
                  :class="['badge', product.badgeColor]"
                >
                  {{ product.badge }}
                </span>
                <button
                  @click="toggleLike(product.id)"
                  :class="['like-btn', { liked: product.isLiked }]"
                >
                  <svg
                    class="heart-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5
                      5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78
                      1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                    ></path>
                  </svg>
                </button>
              </div>

              <div class="product-image">
                <img :src="product.image" :alt="product.name" />
              </div>
              <h3 class="product-name">{{ product.name }}</h3>

              <div class="rating">
                <span v-for="i in 5" :key="i" class="star">★</span>
                <span class="review-count">{{ product.reviews }} Review</span>
              </div>

              <div class="product-footer">
                <div class="price-group">
                  <span
                    :class="['price', { 'discounted': product.originalPrice }]"
                  >${{ product.price.toFixed(2) }}</span>
                  <span
                    v-if="product.originalPrice"
                    class="original-price"
                  >${{ product.originalPrice.toFixed(2) }}</span>
                </div>
                <button class="cart-btn" @click="addToCart(product)">
                  <svg
                    class="icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path
                      d="M1 1h4l2.68 13.39a2 2 0 0
                      0 2 1.61h9.72a2 2 0 0 0
                      2-1.61L23 6H6"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header1 from "../Header/Header1.vue";
import Footer from "../Footer/Footer.vue";

export default {
  name: "Product",
  components: { Header1, Footer },
  mounted() {
    // Initialize liked state from localStorage
    const wishlist = JSON.parse(localStorage.getItem('userWishlist') || '[]');
    const wishlistIds = wishlist.map(item => item.id);

    this.allProducts.forEach(product => {
      product.isLiked = wishlistIds.includes(product.id);
    });
  },
  data() {
    return {
      sidebarOpen: false,
      viewMode: "grid",
      sortBy: "latest",
      itemsPerPage: 20,
      priceRange: [2, 7499],
      categories: [
        {
          id: "electronics",
          name: "Electronics",
          isOpen: false,
          subcategories: [
            { id: "mobiles", name: "Mobiles" },
            { id: "mobile-accessories", name: "Mobile Accessories" },
            { id: "hot-brands", name: "Hot Brands" },
            { id: "laptops", name: "Laptops" },
            { id: "computer-accessories", name: "Computer Accessories" }
          ]
        },
        { id: "mens-fashion", name: "Men's Fashion", isOpen: false },
        { id: "consumer-electronics", name: "Consumer Electronics", isOpen: false },
        { id: "watches", name: "Watches", isOpen: false },
        { id: "home-appliances", name: "Home Appliances", isOpen: false },
        { id: "backpacks", name: "Backpacks", isOpen: false },
        { id: "womens-fashion", name: "Women's Fashion", isOpen: false },
      ],
      allProducts: [
        { id: 1, name: "Sennheiser Momentum 4", price: 255, originalPrice: 299, badge: "15%", badgeColor: "green", reviews: 0, image: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=400&h=400&fit=crop" },
        { id: 2, name: "Bose QuietComfort", price: 349, badge: "Out of Stock", badgeColor: "red", reviews: 0, image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop" },
        { id: 3, name: "Beats Studio Buds +", price: 170, reviews: 0, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop" },
        { id: 4, name: "Beats Fit Pro", price: 155, reviews: 0, image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop" },
        { id: 5, name: "Apple AirPods Pro", price: 299, reviews: 0, image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&h=400&fit=crop" },
        { id: 6, name: "OnePlus 11 5G", price: 759.99, reviews: 0, image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop" },
        { id: 7, name: "Samsung Galaxy S24 Ultra", price: 799, reviews: 0, image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop" },
        { id: 8, name: "Apple iMac 2023", price: 1349, reviews: 0, image: "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?w=400&h=400&fit=crop" },
        { id: 9, name: "MacBook Pro 2023", price: 1499, reviews: 0, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop" },
        { id: 10, name: "JYX Jeans for Men", price: 68, reviews: 0, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop" },
      ],
      latestProducts: [
        { id: 1, name: "Sennheiser Momentum 4", price: 255, originalPrice: 299, reviews: 0, image: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=400&h=400&fit=crop" },
        { id: 2, name: "Bose QuietComfort", price: 349, reviews: 0, image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop" },
        { id: 3, name: "Beats Studio Buds +", price: 170, reviews: 0, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop" },
        { id: 4, name: "Beats Fit Pro", price: 155, reviews: 0, image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop" },
      ],
    };
  },
  computed: {
    filteredProducts() {
      // Lọc sản phẩm theo price range
      return this.allProducts.filter(product => {
        return product.price >= this.priceRange[0] && product.price <= this.priceRange[1];
      });
    },
    sortedProducts() {
      // Sắp xếp sản phẩm theo lựa chọn
      let sorted = [...this.filteredProducts];

      switch(this.sortBy) {
        case 'latest':
          // Giữ nguyên thứ tự mặc định
          break;
        case 'price-low':
          sorted.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          sorted.sort((a, b) => b.price - a.price);
          break;
      }

      return sorted;
    },
    products() {
      // Phân trang sản phẩm
      return this.sortedProducts.slice(0, this.itemsPerPage);
    },
    totalProducts() {
      return this.filteredProducts.length;
    }
  },
  methods: {
    toggleLike(id) {
      const product = this.allProducts.find((p) => p.id === id);
      if (!product) return;

      // Toggle liked state
      product.isLiked = !product.isLiked;

      // Get current wishlist from localStorage
      let wishlist = JSON.parse(localStorage.getItem('userWishlist') || '[]');

      if (product.isLiked) {
        // Add to wishlist
        const wishlistItem = {
          id: product.id,
          name: product.name,
          price: product.price.toFixed(2),
          image: product.image,
          availability: product.badge === 'Out of Stock' ? 'Out of Stock' : 'In Stock',
          availabilityClass: product.badge === 'Out of Stock' ? 'out-of-stock' : 'in-stock'
        };

        // Check if item already exists
        const exists = wishlist.some(item => item.id === product.id);
        if (!exists) {
          wishlist.push(wishlistItem);
          localStorage.setItem('userWishlist', JSON.stringify(wishlist));
        }
      } else {
        // Remove from wishlist
        wishlist = wishlist.filter(item => item.id !== product.id);
        localStorage.setItem('userWishlist', JSON.stringify(wishlist));
      }

      // Dispatch event để cập nhật số lượng wishlist trong header
      window.dispatchEvent(new Event('wishlistChanged'));
    },
    toggleCategory(categoryId) {
      const category = this.categories.find(cat => cat.id === categoryId);
      if (category) {
        category.isOpen = !category.isOpen;
      }
    },
    addToCart(product) {
      // Get current cart from localStorage
      let cart = JSON.parse(localStorage.getItem('userCart') || '[]');

      // Check if product already exists in cart
      const existingItem = cart.find(item => item.id === product.id);

      if (existingItem) {
        // Increase quantity
        existingItem.quantity++;
      } else {
        // Add new item to cart
        const cartItem = {
          id: product.id,
          name: product.name,
          price: product.price.toFixed(2),
          image: product.image,
          quantity: 1
        };
        cart.push(cartItem);
      }

      // Save to localStorage
      localStorage.setItem('userCart', JSON.stringify(cart));

      // Dispatch event để cập nhật số lượng cart trong header
      window.dispatchEvent(new Event('cartChanged'));

      // Open cart sidebar
      window.dispatchEvent(new Event('openCart'));
    },
  },
};
</script>

<style src="./product.css" scoped></style>
