<template>
  <div>
    <Header />
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

          <!-- Price Filter -->
          <div class="price-filter">
            <h4 class="filter-title">Price</h4>
            <div class="price-inputs">
              <input
                type="text"
                :value="formatPriceInput(priceRange[0])"
                @input="updateMinPrice($event.target.value)"
                class="price-input"
              />
              <span class="price-separator">-</span>
              <input
                type="text"
                :value="formatPriceInput(priceRange[1])"
                @input="updateMaxPrice($event.target.value)"
                class="price-input"
              />
            </div>
            <input
              type="range"
              min="0"
              max="100000000"
              v-model.number="priceRange[1]"
              class="price-slider"
            />
          </div>

          <!-- Brand Filter -->
          <div class="brand-filter">
            <h4 class="filter-title">Brand</h4>
            <div class="filter-options">
              <label
                v-for="brand in brands"
                :key="brand.id"
                class="filter-checkbox"
              >
                <input
                  type="checkbox"
                  v-model="selectedBrands"
                  :value="brand.id"
                />
                <span class="checkbox-label">{{ brand.name }}</span>
              </label>
            </div>
          </div>

          <!-- RAM Filter -->
          <div class="ram-filter">
            <h4 class="filter-title">RAM</h4>
            <div class="filter-options">
              <label
                v-for="ram in ramOptions"
                :key="ram.id"
                class="filter-checkbox"
              >
                <input
                  type="checkbox"
                  v-model="selectedRam"
                  :value="ram.id"
                />
                <span class="checkbox-label">{{ ram.name }}</span>
              </label>
            </div>
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
          <h3 class="section-title">Latest Smartphones</h3>
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
                  >{{ formatPrice(product.price) }}</span>
                  <span
                    v-if="product.originalPrice"
                    class="original-price"
                  >{{ formatPrice(product.originalPrice) }}</span>
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
          <h1 class="page-title">Smartphones</h1>
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

        <!-- Loading State -->
        <Loading v-if="isLoading" text="Loading smartphones..." />

        <!-- Products Grid -->
        <div v-else class="products-grid-wrapper">
          <!-- Filter Loading Overlay -->
          <div v-if="isFiltering" class="filter-loading-overlay">
            <div class="filter-spinner"></div>
            <p class="filter-loading-text">Đang lọc sản phẩm...</p>
          </div>

          <div class="products-grid">
            <div
              v-for="product in products"
              :key="product.id"
              class="product-card"
            >
            <div class="product-card-inner">
              <div class="product-badge-row">
                <span
                  v-if="product.originalPrice"
                  class="sale-badge"
                >
                  🔥 Sale
                </span>
                <span
                  v-else-if="product.badge"
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

              <div class="product-image" @click="goToProductDetail(product.id)" style="cursor: pointer;">
                <img :src="product.image" :alt="product.name" />
              </div>
              <h3 class="product-name" @click="goToProductDetail(product.id)" style="cursor: pointer;">{{ product.name }}</h3>

              <div class="rating">
                <span v-for="i in 5" :key="i" class="star">★</span>
                <span class="review-count">{{ product.reviews }} Review</span>
              </div>

              <div class="product-footer">
                <div class="price-group">
                  <span
                    :class="['price', { 'discounted': product.originalPrice }]"
                  >{{ formatPrice(product.price) }}</span>
                  <span
                    v-if="product.originalPrice"
                    class="original-price"
                  >{{ formatPrice(product.originalPrice) }}</span>
                </div>
              </div>
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
import Header from "../Header1/Header.vue";
import Footer from "../Footer/Footer.vue";
import Loading from "../Loading/Loading.vue";
import axios from 'axios';

export default {
  name: "MobilePage",
  components: { Header, Footer, Loading },
  async mounted() {
    await this.fetchProducts();
  },
  data() {
    return {
      isLoading: true,
      isFiltering: false,
      sidebarOpen: false,
      viewMode: "grid",
      sortBy: "latest",
      itemsPerPage: 20,
      priceRange: [0, 100000000],
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
      allProducts: [],
      latestProducts: [],
      brands: [
        { id: "Apple", name: "Apple" },
        { id: "OnePlus", name: "OnePlus" },
        { id: "Huawei", name: "Huawei" },
        { id: "Samsung", name: "Samsung" },
        { id: "Xiaomi", name: "Xiaomi" },
        { id: "ZTE", name: "ZTE" },
        { id: "ASUS", name: "ASUS" },
        { id: "GOOGLE", name: "GOOGLE" },
        { id: "LG", name: "LG" },
        { id: "TCL", name: "TCL" },
        { id: "Nokia", name: "Nokia" },
        { id: "OPPO", name: "OPPO" },
        { id: "Vivo", name: "Vivo" },
        { id: "Realme", name: "Realme" },
        { id: "Sony", name: "Sony" },
        { id: "Motorola", name: "Motorola" },
        { id: "Honor", name: "Honor" }
      ],
      ramOptions: [
        { id: "2gb", name: "2GB" },
        { id: "4gb", name: "4GB" },
        { id: "6gb", name: "6GB" },
        { id: "8gb", name: "8GB" },
        { id: "12gb", name: "12GB" },
        { id: "16gb", name: "16GB" },
        { id: "32gb", name: "32GB" }
      ],
      selectedBrands: [],
      selectedRam: []
    };
  },
  computed: {
    filteredProducts() {
      // Lọc sản phẩm theo price range, brand và RAM
      return this.allProducts.filter(product => {
        // Lọc theo giá
        const priceMatch = product.price >= this.priceRange[0] && product.price <= this.priceRange[1];

        // Lọc theo brand (nếu có brand được chọn)
        const brandMatch = this.selectedBrands.length === 0 ||
          this.selectedBrands.some(selectedBrand =>
            product.brand && product.brand.toLowerCase() === selectedBrand.toLowerCase()
          );

        // Lọc theo RAM (nếu có RAM được chọn) - để sau này implement
        const ramMatch = this.selectedRam.length === 0 || true; // Tạm thời chấp nhận tất cả

        return priceMatch && brandMatch && ramMatch;
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
  watch: {
    selectedBrands() {
      this.triggerFilterLoading();
    },
    selectedRam() {
      this.triggerFilterLoading();
    },
    priceRange: {
      handler() {
        this.triggerFilterLoading();
      },
      deep: true
    }
  },
  methods: {
    triggerFilterLoading() {
      this.isFiltering = true;
      setTimeout(() => {
        this.isFiltering = false;
      }, 500); // 500ms loading effect
    },
    async fetchProducts() {
      try {
        this.isLoading = true;
        const response = await axios.get('/elec/api/v1/products', {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwaHVuZ3ZhbnZ1MEBnbWFpbC5jb20iLCJzY29wZSI6IlJPTEVfQURNSU4iLCJpc3MiOiJlbGVjIiwibmFtZSI6IkFkbWluIEFkbWluIiwiZXhwIjoxNzYyODQ4NTg4LCJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzYyODI2OTg4LCJqdGkiOiJkZGRkZjdjNy1kNTI3LTRmMWMtYjY5Mi03Y2U2MmY0ZDFiZmMifQ.iAut2XXzq5rvSSWH77Ncn4b337jzUjou5ltKD5ad0qU'
          }
        });

        if (response.data.code === 200 && response.data.result) {
          // Lọc chỉ lấy sản phẩm có category là "Smartphones"
          const smartphoneProducts = response.data.result.filter(product =>
            product.categories && product.categories.includes("Smartphones")
          );

          // Chuyển đổi dữ liệu từ API sang format cần thiết
          this.allProducts = smartphoneProducts.map(product => ({
            id: product.id,
            name: product.name,
            price: product.minPrice,
            originalPrice: product.maxPrice !== product.minPrice ? product.maxPrice : null,
            badge: !product.inStock ? "Out of Stock" : null,
            badgeColor: !product.inStock ? "red" : null,
            reviews: 0,
            image: product.thumbnail,
            isLiked: false,
            brand: product.brand || ""
          }));

          // Lấy 4 sản phẩm mới nhất cho Latest Products
          this.latestProducts = this.allProducts.slice(0, 4);

          // Initialize liked state from localStorage
          const wishlist = JSON.parse(localStorage.getItem('userWishlist') || '[]');
          const wishlistIds = wishlist.map(item => item.id);

          this.allProducts.forEach(product => {
            product.isLiked = wishlistIds.includes(product.id);
          });
        }
      } catch (error) {
        console.error('Error fetching smartphones:', error);
      } finally {
        this.isLoading = false;
      }
    },
    goToProductDetail(productId) {
      // Navigate to product detail page with only product ID
      this.$router.push({
        path: '/productdetail',
        query: { id: productId }
      });
    },
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
    formatPrice(price) {
      // Format giá theo định dạng VND: 27.990.000 đ
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price);
    },
    formatPriceInput(price) {
      // Format giá cho input với dấu chấm phân cách
      return new Intl.NumberFormat('vi-VN').format(price);
    },
    updateMinPrice(value) {
      // Xóa tất cả dấu chấm và chuyển về số
      const numValue = parseInt(value.replace(/\./g, '') || '0');
      this.priceRange[0] = numValue;
    },
    updateMaxPrice(value) {
      // Xóa tất cả dấu chấm và chuyển về số
      const numValue = parseInt(value.replace(/\./g, '') || '0');
      this.priceRange[1] = numValue;
    }
  },
};
</script>

<style src="./Mobile.css" scoped></style>
