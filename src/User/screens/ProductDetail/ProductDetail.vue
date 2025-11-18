<template>
  <div class="product-detail-container">
    <Header />

    <Loading v-if="isLoading" text="Loading product..." />

    <div v-else-if="product" class="product-container">
      <div class="product-content">
        <div class="product-images">
          <div class="main-image">
            <img :src="displayImages[selectedImage]" :alt="product.name" />
          </div>
          <div v-if="displayImages.length > 1" class="thumbnail-images">
            <button
              v-for="(image, i) in displayImages"
              :key="i"
              class="thumbnail"
              :class="{ active: selectedImage === i }"
              type="button"
              @click="selectImage(i)"
            >
              <img :src="image" :alt="`Thumbnail ${i + 1}`" />
            </button>
          </div>
        </div>

        <div class="product-info">
          <h1 class="product-title">{{ product.name }}</h1>
          <p v-if="product.shortDescription" class="product-subtitle">
            {{ product.shortDescription }}
          </p>

          <div class="rating-section">
            <div class="stars">
              <span v-for="star in 5" :key="star" class="star">☆</span>
            </div>
            <span class="review-count">{{ productReviews.length }} Review</span>
          </div>

          <div class="stock-status" :class="{ 'out-stock': !product.inStock }">
            <span class="in-stock" v-if="product.inStock">In Stock ({{ product.qty }} pcs)</span>
            <span class="out-stock" v-else>Out of Stock</span>
          </div>

          <div class="action-buttons">
            <button class="btn-wishlist" type="button">
              <i class="fa-regular fa-heart"></i> Wishlist
            </button>
            <button class="btn-compare" type="button">
              <i class="fa-solid fa-code-compare"></i> Compare
            </button>
          </div>

          <div class="price-section">
            <div class="price-row">
              <span class="price">{{ formatPrice(currentPrice) }}</span>
              <span v-if="currentOriginalPrice" class="original-price">
                {{ formatPrice(currentOriginalPrice) }}
              </span>
            </div>
          </div>
          <div v-if="selectedVariant" class="variant-sku">SKU: {{ selectedVariant.sku }}</div>

          <div v-if="colorVariation" class="variation-section color-block">
            <div class="variation-label">
              Color
              <span v-if="selectedColor" class="selected-value">{{ selectedColor }}</span>
            </div>
            <div class="variation-options color-options">
              <button
                v-for="value in colorVariation.variationValues"
                :key="value.id"
                type="button"
                class="color-option"
                :class="{
                  active: selectedColor === value.label,
                  disabled: !isColorAvailable(value.label)
                }"
                :disabled="!isColorAvailable(value.label)"
                @click="handleColorSelect(value.label)"
                :title="value.label"
              >
                <div class="color-swatch" :style="{ backgroundColor: value.value }"></div>
                <span class="color-name">{{ value.label }}</span>
              </button>
            </div>
          </div>

          <div v-if="storageVariation" class="variation-section storage-block">
            <div class="variation-label">
              Storage
              <span v-if="selectedStorage" class="selected-value">{{ selectedStorage }}</span>
            </div>
            <div class="variation-options storage-options">
              <button
                v-for="value in storageVariation.variationValues"
                :key="value.id"
                type="button"
                class="storage-option"
                :class="{
                  active: selectedStorage === value.label,
                  disabled: !isStorageAvailable(value.label)
                }"
                :disabled="!isStorageAvailable(value.label)"
                @click="handleStorageSelect(value.label)"
              >
                {{ value.label }}
              </button>
            </div>
          </div>

          <div
            v-for="variation in otherVariations"
            :key="variation.id"
            class="variation-section"
            :class="variation.type.toLowerCase()"
          >
            <div class="variation-label">
              {{ variation.name }}:
              <span class="selected-value">{{ selectedVariations[variation.id] }}</span>
            </div>
            <div class="variation-options" :class="{ 'color-options': variation.type === 'COLOR' }">
              <template v-if="variation.type === 'COLOR'">
                <button
                  v-for="valueItem in variation.variationValues"
                  :key="valueItem.id"
                  type="button"
                  class="color-option"
                  :class="{ active: selectedVariations[variation.id] === valueItem.label }"
                  @click="selectVariation(variation.id, valueItem)"
                  :title="valueItem.label"
                >
                  <div class="color-swatch" :style="{ backgroundColor: valueItem.value }"></div>
                  <span class="color-name">{{ valueItem.label }}</span>
                </button>
              </template>
              <template v-else>
                <button
                  v-for="valueItem in variation.variationValues"
                  :key="valueItem.id"
                  type="button"
                  class="storage-option"
                  :class="{ active: selectedVariations[variation.id] === valueItem.label }"
                  @click="selectVariation(variation.id, valueItem)"
                >
                  {{ valueItem.label }}
                </button>
              </template>
            </div>
          </div>

            <div v-if="options.length" class="options">
              <h4 class="options-title">Tùy chọn thêm</h4>

              <div class="options-content">
                <!-- Price Breakdown - Left Side -->
                <div class="price-breakdown">
                  <div class="price-line base">
                    <span>Giá sản phẩm</span>
                    <strong>{{ formatPrice(currentPrice) }}</strong>
                  </div>
                  <template v-for="option in options" :key="'price-' + option.id">
                    <div
                      v-if="getSelectedOptionPrice(option) > 0"
                      class="price-line option-line"
                    >
                      <span>+ {{ option.name }}: {{ getSelectedOptionLabel(option) }}</span>
                      <strong>{{ formatPrice(getSelectedOptionPrice(option)) }}</strong>
                    </div>
                  </template>
                  <div class="price-line total">
                    <span>Tổng cộng</span>
                    <strong>{{ formatPrice(displayTotalPrice) }}</strong>
                  </div>
                </div>

                <!-- Option Controls - Right Side -->
                <div class="options-controls">
                  <div v-for="option in options" :key="option.id" class="option-section">
                    <div class="option-label">
                      {{ option.name }}
                      <span class="option-badge" :class="option.isRequired ? 'required' : 'optional'">
                        {{ option.isRequired ? 'required' : 'optional' }}
                      </span>
                    </div>
                    <template v-if="option.type === 'SELECT'">
                      <select v-model="selectedOptions[option.id]" class="option-select">
                        <option v-if="!option.isRequired" value="">Chọn {{ option.name }}</option>
                        <option
                          v-for="optValue in option.optionValues"
                          :key="optValue.id"
                          :value="optValue.id"
                        >
                          {{ optionLabelWithPrice(optValue) }}
                        </option>
                      </select>
                    </template>
                    <template v-else-if="option.type === 'TEXT'">
                      <input
                        v-model="selectedOptions[option.id]"
                        type="text"
                        class="option-input"
                        :placeholder="`Nhập ${option.name}`"
                      />
                    </template>
                  </div>
                </div>
              </div>
            </div>

          <div class="purchase-section">
            <div class="quantity-and-cart">
              <div class="quantity-selector">
                <label>Quantity</label>
                <div class="quantity-controls">
                  <button @click="changeQuantity(-1)" class="qty-btn" type="button">-</button>
                  <input v-model.number="quantity" type="number" min="1" class="qty-input" />
                  <button @click="changeQuantity(1)" class="qty-btn" type="button">+</button>
                </div>
              </div>
              <button
                class="add-to-cart-btn"
                type="button"
                @click="addToCart"
                :disabled="!selectedVariant || isSubmitting"
              >
                <span>{{ isSubmitting ? 'Adding…' : 'Add to Cart' }}</span>
                <span class="btn-total-price"></span>
              </button>
            </div>
          </div>

          <div class="product-meta">
            <div class="meta-item">
              <strong>Categories:</strong>
              <template v-if="product.categories && product.categories.length">
                <span v-for="(category, index) in product.categories" :key="category">
                  <a href="#" class="meta-link">{{ category }}</a>
                  <span v-if="index < product.categories.length - 1">, </span>
                </span>
              </template>
              <span v-else>Updating...</span>
            </div>
            <div class="meta-item" v-if="product.tags && product.tags.length">
              <strong>Tags:</strong>
              <span v-for="(tag, index) in product.tags" :key="tag">
                <a href="#" class="meta-link">{{ tag }}</a>
                <span v-if="index < product.tags.length - 1">, </span>
              </span>
            </div>
          </div>

          <div class="social-share">
            <strong>Share:</strong>
            <button @click="shareProduct('facebook')" class="share-btn" type="button">
              <i class="fa-brands fa-facebook-f"></i>
            </button>
            <button @click="shareProduct('twitter')" class="share-btn" type="button">
              <i class="fa-brands fa-x-twitter"></i>
            </button>
            <button @click="shareProduct('linkedin')" class="share-btn" type="button">
              <i class="fa-brands fa-linkedin-in"></i>
            </button>
            <button @click="shareProduct('tumblr')" class="share-btn" type="button">
              <i class="fa-brands fa-tumblr"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Product Tabs -->
      <div class="product-tabs">
        <div class="tab-navigation">
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'description' }"
            @click="setActiveTab('description')"
          >
            Description
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'specification' }"
            @click="setActiveTab('specification')"
          >
            Specification
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'reviews' }"
            @click="setActiveTab('reviews')"
          >
            Reviews ({{ productReviews.length }})
          </button>
        </div>

        <div class="tab-content">
          <!-- Description Tab -->
          <div v-if="activeTab === 'description'" class="tab-panel">
            <h3>{{ product.name }}</h3>
            <p>{{ product.description }}</p>

            <div class="size-chart-section">
              <h4>SIZE CHART</h4>
              <p>
                <em
                  >Size information: unit cm (hand measured, actual size may have discrepancy
                  about 1-3cm)</em
                >
              </p>

              <div class="size-chart-toggle">
                <button @click="toggleSizeChart()" class="show-more-btn">
                  {{ showSizeChart ? 'Show Less' : 'Show More' }}
                </button>
              </div>

              <table class="size-chart-table" v-if="showSizeChart">
                <thead>
                  <tr>
                    <th>US SIZE</th>
                    <th>SHOULDER</th>
                    <th>CHEST</th>
                    <th>LENGTH</th>
                    <th>SLEEVE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="size in sizeChart" :key="size.size">
                    <td>{{ size.size }}</td>
                    <td>{{ size.shoulder }}</td>
                    <td>{{ size.chest }}</td>
                    <td>{{ size.length }}</td>
                    <td>{{ size.sleeve }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Specification Tab -->
          <div v-if="activeTab === 'specification'" class="tab-panel">
            <h3>Specification</h3>
            <ul>
              <li><strong>Product Name:</strong> {{ product.name }}</li>
              <li><strong>Brand:</strong> {{ product.brand }}</li>
              <li><strong>SKU:</strong> {{ product.sku }}</li>
              <li v-if="product.categories && product.categories.length">
                <strong>Category:</strong> {{ product.categories.join(', ') }}
              </li>
              <li><strong>Stock Status:</strong> {{ product.inStock ? 'In Stock' : 'Out of Stock' }}</li>
              <li><strong>Available Quantity:</strong> {{ product.qty }}</li>
              <li><strong>Current Price:</strong> {{ formatPrice(currentPrice) }}</li>
              <li v-if="optionsTotal > 0"><strong>Option Add-ons:</strong> {{ formatPrice(optionsTotal) }}</li>
              <li><strong>Total After Options:</strong> {{ formatPrice(displayTotalPrice) }}</li>
              <li v-if="currentOriginalPrice"><strong>Original Price:</strong> {{ formatPrice(currentOriginalPrice) }}</li>
              <li v-if="selectedVariant">
                <strong>Current Variant:</strong> {{ selectedVariant.name }}
              </li>
              <li v-if="selectedVariant">
                <strong>Variant SKU:</strong> {{ selectedVariant.sku }}
              </li>
            </ul>

            <h4 v-if="variations.length > 0">Available Variations:</h4>
            <ul v-if="variations.length > 0">
              <li v-for="variation in variations" :key="variation.id">
                <strong>{{ variation.name }}:</strong>
                {{ variation.variationValues.map((v) => v.label).join(', ') }}
              </li>
            </ul>

            <h4 v-if="options.length > 0">Available Options:</h4>
            <ul v-if="options.length > 0">
              <li v-for="option in options" :key="option.id">
                <strong>{{ option.name }}{{ option.isRequired ? ' *' : '' }}:</strong>
                <span v-for="(optValue, idx) in option.optionValues" :key="optValue.id">
                  {{ optValue.label }}
                  <span v-if="optValue.price > 0">(+{{ formatPrice(optValue.price) }})</span>
                  <span v-if="idx < option.optionValues.length - 1">, </span>
                </span>
              </li>
            </ul>
          </div>

          <!-- Reviews Tab -->
          <div v-if="activeTab === 'reviews'" class="tab-panel">
            <h3>Customer Reviews</h3>

            <div v-if="productReviews.length > 0">
              <div class="review-summary">
                <div class="rating-overview">
                  <div class="stars">
                    <span v-for="star in getStars(averageRating)" :key="star" class="star filled"
                      >★</span
                    >
                  </div>
                  <span>
                    {{ averageRating.toFixed(1) }}/5 based on {{ productReviews.length }} review{{
                      productReviews.length > 1 ? 's' : ''
                    }}
                  </span>
                </div>
              </div>

              <div class="reviews-list">
                <div v-for="review in productReviews" :key="review.date" class="review-item">
                  <div class="review-header">
                    <div class="reviewer-info">
                      <strong>{{ review.userName }}</strong>
                      <div class="review-stars">
                        <span v-for="star in review.userRating" :key="star" class="star filled"
                          >★</span
                        >
                        <span
                          v-for="star in 5 - review.userRating"
                          :key="'empty-' + star"
                          class="star"
                          >☆</span
                        >
                      </div>
                    </div>
                    <span class="review-date">{{ formatDate(review.date) }}</span>
                  </div>
                  <p class="review-comment">{{ review.userComment }}</p>
                </div>
              </div>
            </div>

            <p v-else class="no-reviews">No reviews yet. Be the first to review this product!</p>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <div class="related-products">
        <h3>You might also like</h3>
        <div class="related-grid">
          <div v-for="item in relatedProducts" :key="item.name" class="related-item">
            <img :src="item.image" :alt="item.name" />
            <h4>{{ item.name }}</h4>
            <div class="item-rating">
              <span v-for="star in getStars(item.rating)" :key="star" class="star">★</span>
            </div>
            <div class="item-price">${{ item.price }}</div>
          </div>
        </div>
      </div>
    </div>

    <Footer v-if="product" />
  </div>
</template>

<script>
import Header from '@/User/components/Header1/Header.vue';
import Footer from '@/User/components/Footer/Footer.vue';
import Loading from '@/User/components/Loading/Loading.vue';
import { getProductById } from '@/api/productApi.js';
import { addToCart as addCartItems } from '@/api/cartApi.js';

export default {
  name: 'ProductDetail',
  components: {
    Header,
    Footer,
    Loading
  },
  data() {
    return {
      isLoading: true,
      product: null,
      productData: null,
      selectedImage: 0,
      productReviews: [],
      relatedProducts: [
        {
          name: 'DUDUALISS Men Long Sleeve Shirt Men...',
          price: 17.3,
          image: 'assets/images/related1.jpg',
          rating: 5
        },
        {
          name: 'S-5XL Plus Size Brand Clothing Cotton Mens...',
          price: 7.47,
          image: 'assets/images/related2.jpg',
          rating: 4
        },
        {
          name: '2019 brand casual spring luxury plaid lon...',
          price: 5.24,
          image: 'assets/images/related3.jpg',
          rating: 4
        },
        {
          name: 'Long-sleeved Camisa Masculina Chamise...',
          price: 9.69,
          image: 'assets/images/related4.jpg',
          rating: 5
        },
        {
          name: 'Europe size Summer Short Sleeve Solid Polo...',
          price: 8.35,
          image: 'assets/images/related5.jpg',
          rating: 4
        }
      ],
      sizeChart: [
        { size: 'S', shoulder: 44, chest: 100, length: 65, sleeve: 19 },
        { size: 'M', shoulder: 46, chest: 104, length: 67, sleeve: 20 },
        { size: 'L', shoulder: 48, chest: 108, length: 69, sleeve: 21 },
        { size: 'XL', shoulder: 50, chest: 112, length: 71, sleeve: 22 },
        { size: 'XXL', shoulder: 52, chest: 116, length: 73, sleeve: 23 }
      ],
      showSizeChart: false,
      quantity: 1,
      activeTab: 'description',
      variations: [],
      options: [],
      selectedVariations: {},
      selectedOptions: {},
      selectedVariant: null,
      colorVariation: null,
      storageVariation: null,
      otherVariations: [],
      selectedColor: null,
      selectedStorage: null,
      mediaImages: [],
      placeholderImage: 'https://via.placeholder.com/500x500?text=No+Image',
      variantLookup: {},
      availableStoragesByColor: {},
      isSubmitting: false,
      submitError: ''
    };
  },
  async mounted() {
    await this.fetchProductDetail();
  },
  methods: {
    async fetchProductDetail() {
      try {
        this.isLoading = true;
        const productId = parseInt(this.$route.params.id);

        if (!productId) {
          console.error('No product ID provided');
          alert('No product ID provided! Redirecting to shop...');
          this.$router.push('/product');
          return;
        }

        const response = await getProductById(productId);

        if (response.data.code === 200 && response.data.result) {
          this.productData = response.data.result;
          this.processProductData(response.data.result);
          this.loadProductReviews(productId);
        } else {
          console.error('Failed to fetch product:', response.data.message);
          alert('Product not found! Redirecting to shop...');
          this.$router.push('/product');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        alert('Error loading product! Redirecting to shop...');
        this.$router.push('/product');
      } finally {
        this.isLoading = false;
      }
    },
    processProductData(data) {
      this.variations = data.variations || [];
      this.options = data.options || [];

      this.colorVariation = this.variations.find(
        (variation) => variation.type === 'COLOR' || /color/i.test(variation.name)
      );
      this.storageVariation = this.variations.find(
        (variation) => variation.type === 'TEXT' && /storage|capacity/i.test(variation.name)
      );
      this.otherVariations = this.variations.filter(
        (variation) => variation !== this.colorVariation && variation !== this.storageVariation
      );

      this.selectedVariations = {};
      this.otherVariations.forEach((variation) => {
        if (variation.variationValues && variation.variationValues.length > 0) {
          this.selectedVariations[variation.id] = variation.variationValues[0].label;
        }
      });

      this.selectedOptions = {};
      this.options.forEach((option) => {
        if (option.isRequired && option.type === 'SELECT' && option.optionValues?.length > 0) {
          this.selectedOptions[option.id] = option.optionValues[0].id;
        } else {
          this.selectedOptions[option.id] = '';
        }
      });

      const imagePool = [data.thumbnail, ...(Array.isArray(data.gallery) ? data.gallery : [])].filter(
        Boolean
      );
      this.mediaImages = imagePool.length ? Array.from(new Set(imagePool)) : [this.placeholderImage];
      this.selectedImage = 0;

      const variants = data.variants || [];
      this.product = {
        id: data.id,
        name: data.name,
        description: data.description,
        shortDescription: data.shortDescription,
        inStock: data.inStock,
        qty: data.qty,
        sku: data.sku,
        brand: data.brand,
        categories: data.categories || [],
        tags: data.categories || [],
        variants,
        basePrice: variants[0]?.sellingPrice || data.minPrice || 0,
        baseOriginalPrice: variants[0]?.price || null
      };

      this.buildVariantLookup(variants);
      this.initializeSelections();
      this.loadProductReviews(data.id);
    },
    buildVariantLookup(variants) {
      this.variantLookup = {};
      this.availableStoragesByColor = {};
      variants.forEach((variant) => {
        const colorLabel = this.extractVariationLabel(this.colorVariation, variant.name);
        const storageLabel = this.extractVariationLabel(this.storageVariation, variant.name);
        const key = this.buildVariantKey(colorLabel, storageLabel);
        if (key) {
          this.variantLookup[key] = variant;
        }
        if (colorLabel && storageLabel) {
          if (!this.availableStoragesByColor[colorLabel]) {
            this.availableStoragesByColor[colorLabel] = new Set();
          }
          this.availableStoragesByColor[colorLabel].add(storageLabel);
        }
      });
    },
    buildVariantKey(colorLabel, storageLabel) {
      if (!colorLabel && !storageLabel) return null;
      return `${(colorLabel || '').toLowerCase()}::${(storageLabel || '').toLowerCase()}`;
    },
    extractVariationLabel(variation, variantName) {
      if (!variation || !variantName) return null;
      const match = variation.variationValues.find((value) =>
        variantName.toLowerCase().includes(value.label.toLowerCase())
      );
      return match ? match.label : null;
    },
    initializeSelections() {
      const initialVariant = this.product.variants.find((variant) => variant.inStock) || this.product.variants[0];
      const initialColor = this.extractVariationLabel(this.colorVariation, initialVariant?.name);
      const initialStorage = this.extractVariationLabel(this.storageVariation, initialVariant?.name);

      this.selectedColor = initialColor || this.colorVariation?.variationValues?.[0]?.label || null;
      this.selectedStorage = initialStorage || this.storageVariation?.variationValues?.[0]?.label || null;

      if (this.colorVariation) {
        this.selectedVariations[this.colorVariation.id] = this.selectedColor;
      }
      if (this.storageVariation) {
        this.selectedVariations[this.storageVariation.id] = this.selectedStorage;
      }

      this.ensureValidStorageSelection();
      this.updateVariantFromSelection();
    },
    ensureValidStorageSelection() {
      if (!this.storageVariation || !this.selectedColor) return;
      const availableStorages = this.getAvailableStoragesForColor(this.selectedColor);
      if (!availableStorages.length) {
        this.selectedStorage = null;
        this.selectedVariations[this.storageVariation.id] = null;
        return;
      }
      if (!this.selectedStorage || !availableStorages.includes(this.selectedStorage)) {
        this.selectedStorage = availableStorages[0];
      }
      this.selectedVariations[this.storageVariation.id] = this.selectedStorage;
    },
    handleColorSelect(label) {
      if (this.selectedColor === label || !this.isColorAvailable(label)) return;
      this.selectedColor = label;
      if (this.colorVariation) {
        this.selectedVariations[this.colorVariation.id] = label;
      }
      this.ensureValidStorageSelection();
      this.updateVariantFromSelection();
    },
    handleStorageSelect(label) {
      if (!this.isStorageAvailable(label)) return;
      this.selectedStorage = label;
      if (this.storageVariation) {
        this.selectedVariations[this.storageVariation.id] = label;
      }
      this.updateVariantFromSelection();
    },
    getAvailableStoragesForColor(colorLabel) {
      if (!colorLabel) return [];
      const storagesSet = this.availableStoragesByColor[colorLabel] || new Set();
      return Array.from(storagesSet);
    },
    isColorAvailable(colorLabel) {
      if (!this.storageVariation) return true;
      const storages = this.availableStoragesByColor[colorLabel];
      return storages ? storages.size > 0 : false;
    },
    isStorageAvailable(storageLabel) {
      if (!this.storageVariation || !this.selectedColor) return true;
      return this.getAvailableStoragesForColor(this.selectedColor).includes(storageLabel);
    },
    updateVariantFromSelection() {
      if (!this.product || !this.product.variants.length) return;
      const key = this.buildVariantKey(this.selectedColor, this.selectedStorage);
      let variant = key ? this.variantLookup[key] : null;
      if (!variant) {
        variant = this.product.variants.find((v) => v.inStock) || this.product.variants[0];
      }
      this.selectedVariant = variant || null;
      if (variant) {
        this.product.inStock = variant.inStock;
        this.product.qty = variant.qty;
      }
    },
    selectVariation(variationId, valueItem) {
      this.selectedVariations[variationId] = valueItem.label;
      this.updateVariantFromSelection();
    },
    selectImage(index) {
      this.selectedImage = index;
    },
    changeQuantity(change) {
      this.quantity = Math.max(1, this.quantity + change);
    },
    formatPrice(price) {
      if (!price && price !== 0) return '—';
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price);
    },
    optionLabelWithPrice(optionValue) {
      if (!optionValue || !optionValue.price) return optionValue.label;
      if (Number(optionValue.price) === 0) return optionValue.label;
      return `${optionValue.label} (+${this.formatPrice(optionValue.price)})`;
    },
    selectedOptionsTotal() {
      return this.options.reduce((sum, option) => {
        const selectedId = this.selectedOptions[option.id];
        if (selectedId === undefined || selectedId === null || selectedId === '') return sum;
        if (option.type === 'TEXT') {
          const value = this.selectedOptions[option.id];
          if (!value) return sum;
          const valueDef = option.optionValues?.[0];
          return sum + (valueDef?.price || 0);
        }
        const selectedOptionValue = option.optionValues?.find((ov) => `${ov.id}` === `${selectedId}`);
        return sum + (selectedOptionValue?.price || 0);
      }, 0);
    },
    async addToCart() {
      if (!this.selectedVariant) return;
      if (this.isSubmitting) return;

      const requiredOptions = this.options.filter((o) => o.isRequired);
      const missingRequired = requiredOptions.find((o) => {
        const value = this.selectedOptions[o.id];
        return value === null || value === undefined || value === '';
      });

      if (missingRequired) {
        alert(`Please select: ${missingRequired.name}`);
        return;
      }

      const cartPayload = this.buildCartPayload();
      this.isSubmitting = true;
      this.submitError = '';

      try {
        const response = await addCartItems(cartPayload.cartItems);
        console.log('Cart response:', response.data);
        alert('Đã thêm vào giỏ hàng!');
      } catch (error) {
        console.error('Failed to add to cart', error);
        this.submitError = error.response?.data?.message || 'Failed to add to cart';
        alert(this.submitError);
      } finally {
        this.isSubmitting = false;
      }
    },
    buildCartPayload() {
      const cartItemVariations = [];

      if (this.colorVariation && this.selectedColor) {
        const colorValue = this.colorVariation.variationValues.find(
          (value) => value.label === this.selectedColor
        );
        cartItemVariations.push({
          variationId: this.colorVariation.id,
          type: this.colorVariation.type,
          value: colorValue?.value,
          cartItemVariationValues: [
            {
              variationValueId: colorValue.id
            }
          ]
        });
      }

      if (this.storageVariation && this.selectedStorage) {
        const storageValue = this.storageVariation.variationValues.find(
          (value) => value.label === this.selectedStorage
        );
        cartItemVariations.push({
          variationId: this.storageVariation.id,
          type: this.storageVariation.type,
          value: storageValue?.value,
          cartItemVariationValues: [
            {
              variationValueId: storageValue.id
            }
          ]
        });
      }

      this.otherVariations.forEach((variation) => {
        const selectedLabel = this.selectedVariations[variation.id];
        const valueObj = variation.variationValues.find((val) => val.label === selectedLabel);
        if (valueObj) {
          cartItemVariations.push({
            variationId: variation.id,
            type: variation.type,
            value: valueObj.value,
            cartItemVariationValues: [
              {
                variationValueId: valueObj.id
              }
            ]
          });
        }
      });

      const cartItemOptions = this.options.map((option) => {
        if (option.type === 'TEXT') {
          const textValue = this.selectedOptions[option.id];
          const textConfig = option.optionValues?.[0];
          return {
            optionId: option.id,
            optionName: option.name,
            type: option.type,
            isRequired: option.isRequired,
            valueLabel: textValue || '',
            price: textConfig?.price || 0,
            priceType: textConfig?.priceType || 'FIXED',
            cartItemOptionValues: [
              {
                optionValueId: textConfig?.id,
                valueLabel: textValue || '',
                price: textConfig?.price || 0,
                priceType: textConfig?.priceType || 'FIXED'
              }
            ]
          };
        }
        const selectedId = this.selectedOptions[option.id];
        const optionValue = option.optionValues.find((ov) => `${ov.id}` === `${selectedId}`);
        return {
          optionId: option.id,
          optionName: option.name,
          type: option.type,
          isRequired: option.isRequired,
          valueLabel: optionValue?.label || '',
          price: optionValue?.price || 0,
          priceType: optionValue?.priceType || 'FIXED',
          cartItemOptionValues: optionValue
            ? [
                {
                  optionValueId: optionValue.id,
                  valueLabel: optionValue.label,
                  price: optionValue.price || 0,
                  priceType: optionValue.priceType || 'FIXED'
                }
              ]
            : []
        };
      });

      return {
        cartItems: [
          {
            productId: this.product.id,
            productVariantId: this.selectedVariant?.id,
            qty: this.quantity,
            cartItemVariations,
            cartItemOptions
          }
        ]
      };
    },
    setActiveTab(tab) {
      this.activeTab = tab;
    },
    toggleSizeChart() {
      this.showSizeChart = !this.showSizeChart;
    },
    shareProduct(platform) {
      console.log('Sharing on', platform);
      alert(`Sharing on ${platform}`);
    },
    getStars(rating) {
      return Array(5)
        .fill('')
        .map((_, i) => (i < rating ? 'star' : 'star_border'));
    },
    loadProductReviews(productId) {
      // Load reviews from localStorage
      const allReviews = JSON.parse(localStorage.getItem('productReviews') || '[]');

      // Filter reviews for this specific product
      this.productReviews = allReviews.filter((review) => review.productId === productId);

      console.log('Loaded reviews for product', productId, ':', this.productReviews);
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    getSelectedOptionLabel(option) {
      if (option.type === 'TEXT') {
        const textValue = this.selectedOptions[option.id];
        return textValue || '—';
      }
      const selectedId = this.selectedOptions[option.id];
      if (!selectedId) return '—';
      const optionValue = option.optionValues?.find((ov) => `${ov.id}` === `${selectedId}`);
      return optionValue?.label || '—';
    },
    getSelectedOptionPrice(option) {
      if (option.type === 'TEXT') {
        const textValue = this.selectedOptions[option.id];
        if (!textValue) return 0;
        const valueDef = option.optionValues?.[0];
        return valueDef?.price || 0;
      }
      const selectedId = this.selectedOptions[option.id];
      if (!selectedId) return 0;
      const optionValue = option.optionValues?.find((ov) => `${ov.id}` === `${selectedId}`);
      return optionValue?.price || 0;
    }
  },
  computed: {
    averageRating() {
      if (this.productReviews.length === 0) return 0;
      const sum = this.productReviews.reduce((acc, review) => acc + review.userRating, 0);
      return sum / this.productReviews.length;
    },
    displayImages() {
      return this.mediaImages.length ? this.mediaImages : [this.placeholderImage];
    },
    currentPrice() {
      if (this.selectedVariant && this.selectedVariant.sellingPrice != null) {
        return this.selectedVariant.sellingPrice;
      }
      return this.product?.basePrice || 0;
    },
    currentOriginalPrice() {
      if (this.selectedVariant && this.selectedVariant.price != null) {
        return this.selectedVariant.price !== this.currentPrice ? this.selectedVariant.price : null;
      }
      if (this.product?.baseOriginalPrice && this.product.baseOriginalPrice !== this.currentPrice) {
        return this.product.baseOriginalPrice;
      }
      return null;
    },
    optionsTotal() {
      return this.selectedOptionsTotal();
    },
    displayTotalPrice() {
      return this.currentPrice + this.optionsTotal;
    }
  }
};
</script>

<style src="./ProductDetail.css"></style>

