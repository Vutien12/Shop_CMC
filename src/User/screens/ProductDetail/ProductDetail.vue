<template>
  <div class="product-detail-container">
    <Header/>

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

          <div class="rating-section">
            <div class="stars">
              <span
                v-for="star in 5"
                :key="star"
                class="star"
                :class="{ filled: star <= Math.round(reviewStore.averageRating) }"
              >
                {{ star <= Math.round(reviewStore.averageRating) ? '★' : '☆' }}
              </span>
            </div>
            <span class="review-count" v-if="reviewStore.totalElements > 0">
              {{ reviewStore.averageRating }} ({{ reviewStore.totalElements }} Review{{ reviewStore.totalElements > 1 ? 's' : '' }})
            </span>
          </div>

          <div class="stock-status" :class="{ 'out-stock': !product.inStock }">
            <span class="in-stock" v-if="product.inStock">In Stock ({{ product.qty }} pcs)</span>
            <span class="out-stock" v-else>Out of Stock</span>
          </div>

          <div class="action-buttons">
            <button
              class="btn-wishlist"
              :class="{ liked: product?.isWishlisted }"
              type="button"
              @click="toggleWishlist"
              :aria-pressed="product?.isWishlisted ? 'true' : 'false'"
            >
              <i :class="product?.isWishlisted ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
              Wishlist
            </button>
            <button class="btn-compare" type="button">
              <i class="fa-solid fa-code-compare"></i> Compare
            </button>
          </div>

          <hr class="divider" />

          <div class="price-section">
            <div class="price-row">
              <span class="price">{{ formatPrice(currentPrice) }}</span>
              <span v-if="currentOriginalPrice" class="original-price">
                {{ formatPrice(currentOriginalPrice) }}
              </span>
            </div>
          </div>

          <div v-if="colorVariation" class="variation-section color-block">
            <div class="variation-label">
              Color:
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
                  disabled: !isColorAvailable(value.label),
                }"
                :disabled="!isColorAvailable(value.label)"
                @click="handleColorSelect(value.label)"
                :title="value.label"
              >
                <div class="color-swatch" :style="{ backgroundColor: value.value }"></div>
              </button>
            </div>
          </div>

          <div v-if="storageVariation" class="variation-section storage-block">
            <div class="variation-label">
              Storage:
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
                  disabled: !isStorageAvailable(value.label),
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
            <h4 class="options-title">Additional Options</h4>

            <div class="options-content">
              <!-- Price Breakdown - Left Side -->
              <div class="price-breakdown">
                <div class="price-line base">
                  <span>Product Price</span>
                  <strong>{{ formatPrice(currentPrice) }}</strong>
                </div>
                <template v-for="option in options" :key="'price-' + option.id">
                  <div v-if="getSelectedOptionPrice(option) > 0" class="price-line option-line">
                    <span>+ {{ option.name }}: {{ getSelectedOptionLabel(option) }}</span>
                    <strong>{{ formatPrice(getSelectedOptionPrice(option)) }}</strong>
                  </div>
                </template>
                <div class="price-line total">
                  <span>Total</span>
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
                      <option v-if="!option.isRequired" value="">Select {{ option.name }}</option>
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
                      :placeholder="`Enter ${option.name}`"
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
            Reviews<span v-if="reviewStore.totalElements > 0"> ({{ reviewStore.totalElements }})</span>
          </button>
        </div>

        <div class="tab-content">
          <!-- Description Tab -->
          <div v-if="activeTab === 'description'" class="tab-panel">
            <h3>{{ product.name }}</h3>
            <div
              v-html="isDescriptionLong && !showFullDescription ? truncatedDescription : product.description"
              class="product-description-html"
              :class="{ 'description-collapsed': isDescriptionLong && !showFullDescription }"
            ></div>

            <div v-if="isDescriptionLong" class="description-toggle">
              <button @click="toggleDescription()" class="show-more-btn">
                {{ showFullDescription ? 'Show Less' : 'Show More' }}
              </button>
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
              <li>
                <strong>Stock Status:</strong> {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
              </li>
              <li><strong>Available Quantity:</strong> {{ product.qty }}</li>
              <li><strong>Current Price:</strong> {{ formatPrice(currentPrice) }}</li>
              <li v-if="optionsTotal > 0">
                <strong>Option Add-ons:</strong> {{ formatPrice(optionsTotal) }}
              </li>
              <li><strong>Total After Options:</strong> {{ formatPrice(displayTotalPrice) }}</li>
              <li v-if="currentOriginalPrice">
                <strong>Original Price:</strong> {{ formatPrice(currentOriginalPrice) }}
              </li>
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
            <ReviewList :productId="product.id" :showRatingFilter="true" />
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
    <Chatbot />
  </div>
</template>

<script>
import Header from '@/User/components/Header1/Header.vue'
import Footer from '@/User/components/Footer/Footer.vue'
import Loading from '@/User/components/Loading/Loading.vue'
import ReviewList from '@/User/components/ReviewList/ReviewList.vue'
import { getProductById } from '@/api/productApi.js'
import Chatbot from '@/User/components/Chatbot/Chatbot.vue'
import { useReviewStore } from '@/User/stores/reviewStore.js'
import { useCartStore } from '@/User/stores/cartStore.js'

export default {
  name: 'ProductDetail',
  components: {
    Chatbot,
    Header,
    Footer,
    Loading,
    ReviewList,
  },
  setup() {
    const reviewStore = useReviewStore()
    const cartStore = useCartStore()
    return {
      reviewStore,
      cartStore
    }
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
          rating: 5,
        },
        {
          name: 'S-5XL Plus Size Brand Clothing Cotton Mens...',
          price: 7.47,
          image: 'assets/images/related2.jpg',
          rating: 4,
        },
        {
          name: '2019 brand casual spring luxury plaid lon...',
          price: 5.24,
          image: 'assets/images/related3.jpg',
          rating: 4,
        },
        {
          name: 'Long-sleeved Camisa Masculina Chamise...',
          price: 9.69,
          image: 'assets/images/related4.jpg',
          rating: 5,
        },
        {
          name: 'Europe size Summer Short Sleeve Solid Polo...',
          price: 8.35,
          image: 'assets/images/related5.jpg',
          rating: 4,
        },
      ],
      showFullDescription: false,
      descriptionMaxLength: 500,
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
      submitError: '',
    }
  },
  async mounted() {
    await this.fetchProductDetail()
  },
  methods: {
    async fetchProductDetail() {
      try {
        this.isLoading = true
        const productId = parseInt(this.$route.params.id)

        console.log('🔍 fetchProductDetail START, productId:', productId);

        if (!productId || isNaN(productId)) {
          console.error('❌ No product ID provided or invalid ID');
          alert('No product ID provided! Redirecting to shop...')
          this.$router.push('/product')
          return
        }

        console.log('🔍 Calling getProductById API...');
        const response = await getProductById(productId)
        console.log('✅ Product detail API response:', response)

        if (response.code === 200 && response.result) {
          this.productData = response.result
          this.processProductData(response.result)

          // Load reviews count for display (ReviewList will load full data when tab is clicked)
          this.reviewStore.fetchProductReviews(productId, 0, 1).catch(err => {
            console.warn('Failed to load reviews count:', err);
          });
        } else {
          console.error('❌ Failed to fetch product:', response.message)
          alert('Product not found! Redirecting to shop...')
          this.$router.push('/product')
        }
      } catch (error) {
        console.error('❌ Error fetching product:', error)
        console.error('❌ Error details:', error.message, error.stack)
        alert('Error loading product! Redirecting to shop...')
        this.$router.push('/product')
      } finally {
        this.isLoading = false
      }
    },
    processProductData(data) {
      this.variations = data.variations || []
      this.options = data.options || []

      this.colorVariation = this.variations.find(
        (variation) => variation.type === 'COLOR' || /color/i.test(variation.name),
      )
      this.storageVariation = this.variations.find(
        (variation) => variation.type === 'TEXT' && /storage|capacity/i.test(variation.name),
      )
      this.otherVariations = this.variations.filter(
        (variation) => variation !== this.colorVariation && variation !== this.storageVariation,
      )

      this.selectedVariations = {}
      this.otherVariations.forEach((variation) => {
        if (variation.variationValues && variation.variationValues.length > 0) {
          this.selectedVariations[variation.id] = variation.variationValues[0].label
        }
      })

      this.selectedOptions = {}
      this.options.forEach((option) => {
        if (option.isRequired && option.type === 'SELECT' && option.optionValues?.length > 0) {
          this.selectedOptions[option.id] = option.optionValues[0].id
        } else {
          this.selectedOptions[option.id] = ''
        }
      })

      const imagePool = [
        data.thumbnail,
        ...(Array.isArray(data.gallery) ? data.gallery : []),
      ].filter(Boolean)
      this.mediaImages = imagePool.length ? Array.from(new Set(imagePool)) : [this.placeholderImage]
      this.selectedImage = 0

      const variants = data.variants || []
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
        baseOriginalPrice: variants[0]?.price || null,
        // reflect API-provided wishlisted flag
        isWishlisted: (data.isWishlisted !== undefined) ? data.isWishlisted : false
      }

      this.buildVariantLookup(variants)
      this.initializeSelections()
      // this.loadProductReviews(data.id) // Commented - now using ReviewList component
    },
    buildVariantLookup(variants) {
      this.variantLookup = {}
      this.availableStoragesByColor = {}

      variants.forEach((variant) => {
        // Extract all variation labels from variant name
        const variantLabels = {}
        this.variations.forEach((variation) => {
          const label = this.extractVariationLabel(variation, variant.name)
          if (label) {
            variantLabels[variation.id] = label
          }
        })

        // Build comprehensive key from all variations (sorted by variation ID)
        const key = this.buildVariantKeyFromAllVariations(variantLabels)
        if (key) {
          this.variantLookup[key] = variant
        }

        // Maintain backward compatibility for color/storage filtering
        if (this.colorVariation && this.storageVariation) {
          const colorLabel = this.extractVariationLabel(this.colorVariation, variant.name)
          const storageLabel = this.extractVariationLabel(this.storageVariation, variant.name)
          if (colorLabel && storageLabel) {
            if (!this.availableStoragesByColor[colorLabel]) {
              this.availableStoragesByColor[colorLabel] = new Set()
            }
            this.availableStoragesByColor[colorLabel].add(storageLabel)
          }
        }
      })
    },
    buildVariantKeyFromAllVariations(variantLabels) {
      const keys = Object.entries(variantLabels)
        .sort(([aId], [bId]) => aId - bId) // Sort by variation ID for consistency
        .map(([_, label]) => (label || '').toLowerCase())
        .filter(k => k)

      return keys.length > 0 ? keys.join('::') : null
    },
    buildVariantKey(colorLabel, storageLabel) {
      if (!colorLabel && !storageLabel) return null
      return `${(colorLabel || '').toLowerCase()}::${(storageLabel || '').toLowerCase()}`
    },
    extractVariationLabel(variation, variantName) {
      if (!variation || !variantName) return null
      const match = variation.variationValues.find((value) =>
        variantName.toLowerCase().includes(value.label.toLowerCase()),
      )
      return match ? match.label : null
    },
    initializeSelections() {
      const initialVariant =
        this.product.variants.find((variant) => variant.inStock) || this.product.variants[0]

      // Extract all variation labels from initial variant
      this.variations.forEach((variation) => {
        const label = this.extractVariationLabel(variation, initialVariant?.name)
        this.selectedVariations[variation.id] = label || variation.variationValues?.[0]?.label || null
      })

      // Also set color and storage for backward compatibility
      const initialColor = this.extractVariationLabel(this.colorVariation, initialVariant?.name)
      const initialStorage = this.extractVariationLabel(this.storageVariation, initialVariant?.name)

      this.selectedColor = initialColor || this.colorVariation?.variationValues?.[0]?.label || null
      this.selectedStorage =
        initialStorage || this.storageVariation?.variationValues?.[0]?.label || null

      if (this.colorVariation) {
        this.selectedVariations[this.colorVariation.id] = this.selectedColor
      }
      if (this.storageVariation) {
        this.selectedVariations[this.storageVariation.id] = this.selectedStorage
      }

      this.ensureValidStorageSelection()
      this.updateVariantFromSelection()
    },
    ensureValidStorageSelection() {
      if (!this.storageVariation || !this.selectedColor) return
      const availableStorages = this.getAvailableStoragesForColor(this.selectedColor)
      if (!availableStorages.length) {
        this.selectedStorage = null
        this.selectedVariations[this.storageVariation.id] = null
        return
      }
      if (!this.selectedStorage || !availableStorages.includes(this.selectedStorage)) {
        this.selectedStorage = availableStorages[0]
      }
      this.selectedVariations[this.storageVariation.id] = this.selectedStorage
    },
    handleColorSelect(label) {
      if (this.selectedColor === label || !this.isColorAvailable(label)) return
      this.selectedColor = label
      if (this.colorVariation) {
        this.selectedVariations[this.colorVariation.id] = label
      }
      this.ensureValidStorageSelection()
      this.updateVariantFromSelection()
    },
    handleStorageSelect(label) {
      if (!this.isStorageAvailable(label)) return
      this.selectedStorage = label
      if (this.storageVariation) {
        this.selectedVariations[this.storageVariation.id] = label
      }
      this.updateVariantFromSelection()
    },
    getAvailableStoragesForColor(colorLabel) {
      if (!colorLabel) return []
      const storagesSet = this.availableStoragesByColor[colorLabel] || new Set()
      return Array.from(storagesSet)
    },
    isColorAvailable(colorLabel) {
      if (!this.storageVariation) return true
      const storages = this.availableStoragesByColor[colorLabel]
      return storages ? storages.size > 0 : false
    },
    isStorageAvailable(storageLabel) {
      if (!this.storageVariation || !this.selectedColor) return true
      return this.getAvailableStoragesForColor(this.selectedColor).includes(storageLabel)
    },
    updateVariantFromSelection() {
      if (!this.product || !this.product.variants.length) return

      // Build key from all selected variations
      const variantLabels = {}
      this.variations.forEach((variation) => {
        // Check both selectedVariations and specific color/storage selections
        const label = this.selectedVariations[variation.id] ||
                      (variation === this.colorVariation ? this.selectedColor : null) ||
                      (variation === this.storageVariation ? this.selectedStorage : null)
        if (label) {
          variantLabels[variation.id] = label
        }
      })

      const key = this.buildVariantKeyFromAllVariations(variantLabels)
      let variant = key ? this.variantLookup[key] : null

      if (!variant) {
        // Fallback: use first available variant or first variant
        variant = this.product.variants.find((v) => v.inStock) || this.product.variants[0]
      }

      this.selectedVariant = variant || null
      if (variant) {
        this.product.inStock = variant.inStock
        this.product.qty = variant.qty
      }
    },
    selectVariation(variationId, valueItem) {
      this.selectedVariations[variationId] = valueItem.label
      this.updateVariantFromSelection()
    },
    selectImage(index) {
      this.selectedImage = index
    },
    changeQuantity(change) {
      this.quantity = Math.max(1, this.quantity + change)
    },
    formatPrice(price) {
      if (!price && price !== 0) return '—'
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(price)
    },
    optionLabelWithPrice(optionValue) {
      if (!optionValue || !optionValue.price) return optionValue.label
      if (Number(optionValue.price) === 0) return optionValue.label
      return `${optionValue.label} (+${this.formatPrice(optionValue.price)})`
    },
    selectedOptionsTotal() {
      return this.options.reduce((sum, option) => {
        const selectedId = this.selectedOptions[option.id]
        if (selectedId === undefined || selectedId === null || selectedId === '') return sum
        if (option.type === 'TEXT') {
          const value = this.selectedOptions[option.id]
          if (!value) return sum
          const valueDef = option.optionValues?.[0]
          return sum + (valueDef?.price || 0)
        }
        const selectedOptionValue = option.optionValues?.find(
          (ov) => `${ov.id}` === `${selectedId}`,
        )
        return sum + (selectedOptionValue?.price || 0)
      }, 0)
    },
    async addToCart() {
      if (!this.selectedVariant) return
      if (this.isSubmitting) return

      const requiredOptions = this.options.filter((o) => o.isRequired)
      const missingRequired = requiredOptions.find((o) => {
        const value = this.selectedOptions[o.id]
        return value === null || value === undefined || value === ''
      })

      if (missingRequired) {
        alert(`Please select: ${missingRequired.name}`)
        return
      }

      const cartPayload = this.buildCartPayload()
      this.isSubmitting = true
      this.submitError = ''

      try {
        // Use cartStore instead of calling API directly
        await this.cartStore.addItem(cartPayload)
        console.log('Added to cart successfully')
        alert('Added to cart!')
      } catch (error) {
        console.error('Failed to add to cart', error)
        this.submitError = error.response?.data?.message || 'Failed to add to cart'
        alert(this.submitError)
      } finally {
        this.isSubmitting = false
      }
    },
    async toggleWishlist() {
      if (!this.product) return;

      const currentlyWishlisted = !!this.product.isWishlisted;
      try {
        const api = await import('@/api/accountApi.js');
        const { getProductById } = await import('@/api/productApi.js');

        // Determine variant id to operate on
        const variantId = this.selectedVariant?.id || this.product.variants?.[0]?.id;
        if (!variantId) {
          alert('Cannot update wishlist: No variant available');
          return;
        }

        if (!currentlyWishlisted) {
          if (typeof api.addToWishlist === 'function') {
            await api.addToWishlist(variantId);
            this.product.isWishlisted = true;
            alert('Added to wishlist!');
            window.dispatchEvent(new Event('wishlistChanged'));
          } else {
            alert('Add to wishlist API not available.');
          }
        } else {
          if (typeof api.removeFromWishlist === 'function') {
            await api.removeFromWishlist(variantId);
            this.product.isWishlisted = false;
            alert('Removed from wishlist!');
            window.dispatchEvent(new Event('wishlistChanged'));
          } else {
            // Fallback: inform user removal may be managed elsewhere
            alert('Remove from wishlist not implemented. Please manage wishlist from the Wishlist page.');
          }
        }
      } catch (error) {
        console.error('Wishlist toggle failed', error);
        if (error.response?.status === 401) {
          alert('Please login to manage wishlist');
        } else {
          alert('Failed to update wishlist. Please try again.');
        }
      }
    },
    buildCartPayload() {
      const cartItemVariations = []

      if (this.colorVariation && this.selectedColor) {
        const colorValue = this.colorVariation.variationValues.find(
          (value) => value.label === this.selectedColor,
        )
        cartItemVariations.push({
          variationId: this.colorVariation.id,
          type: this.colorVariation.type,
          value: colorValue?.value,
          cartItemVariationValues: [
            {
              variationValueId: colorValue.id,
            },
          ],
        })
      }

      if (this.storageVariation && this.selectedStorage) {
        const storageValue = this.storageVariation.variationValues.find(
          (value) => value.label === this.selectedStorage,
        )
        cartItemVariations.push({
          variationId: this.storageVariation.id,
          type: this.storageVariation.type,
          value: storageValue?.value,
          cartItemVariationValues: [
            {
              variationValueId: storageValue.id,
            },
          ],
        })
      }

      this.otherVariations.forEach((variation) => {
        const selectedLabel = this.selectedVariations[variation.id]
        const valueObj = variation.variationValues.find((val) => val.label === selectedLabel)
        if (valueObj) {
          cartItemVariations.push({
            variationId: variation.id,
            type: variation.type,
            value: valueObj.value,
            cartItemVariationValues: [
              {
                variationValueId: valueObj.id,
              },
            ],
          })
        }
      })

      const cartItemOptions = this.options
        .map((option) => {
          if (option.type === 'TEXT') {
            const textValue = this.selectedOptions[option.id]
            const textConfig = option.optionValues?.[0]

            // For optional TEXT options, only include if user entered value
            if (!option.isRequired && !textValue) {
              return null  // Skip optional empty options
            }

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
                  priceType: textConfig?.priceType || 'FIXED',
                },
              ],
            }
          }

          const selectedId = this.selectedOptions[option.id]
          const optionValue = option.optionValues.find((ov) => `${ov.id}` === `${selectedId}`)

          // For optional SELECT options, only include if user selected value
          if (!option.isRequired && !selectedId) {
            return null  // Skip optional unselected options
          }

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
                    priceType: optionValue.priceType || 'FIXED',
                  },
                ]
              : [],
          }
        })
        .filter((option) => option !== null)  // Remove null entries (skipped optional options)

      return {
        cartItems: [
          {
            productId: this.product.id,
            productVariantId: this.selectedVariant?.id,
            qty: this.quantity,
            cartItemVariations,
            cartItemOptions,
          },
        ],
      }
    },
    setActiveTab(tab) {
      this.activeTab = tab
    },
    toggleDescription() {
      this.showFullDescription = !this.showFullDescription
    },
    shareProduct(platform) {
      console.log('Sharing on', platform)
      alert(`Sharing on ${platform}`)
    },
    getStars(rating) {
      return Array(5)
        .fill('')
        .map((_, i) => (i < rating ? 'star' : 'star_border'))
    },
    // DEPRECATED: Now using ReviewList component with reviewStore
    // loadProductReviews(productId) {
    //   const allReviews = JSON.parse(localStorage.getItem('productReviews') || '[]')
    //   this.productReviews = allReviews.filter((review) => review.productId === productId)
    //   console.log('Loaded reviews for product', productId, ':', this.productReviews)
    // },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    },
    getSelectedOptionLabel(option) {
      if (option.type === 'TEXT') {
        const textValue = this.selectedOptions[option.id]
        return textValue || '—'
      }
      const selectedId = this.selectedOptions[option.id]
      if (!selectedId) return '—'
      const optionValue = option.optionValues?.find((ov) => `${ov.id}` === `${selectedId}`)
      return optionValue?.label || '—'
    },
    getSelectedOptionPrice(option) {
      if (option.type === 'TEXT') {
        const textValue = this.selectedOptions[option.id]
        if (!textValue) return 0
        const valueDef = option.optionValues?.[0]
        return valueDef?.price || 0
      }
      const selectedId = this.selectedOptions[option.id]
      if (!selectedId) return 0
      const optionValue = option.optionValues?.find((ov) => `${ov.id}` === `${selectedId}`)
      return optionValue?.price || 0
    },
  },
  computed: {
    averageRating() {
      if (this.productReviews.length === 0) return 0
      const sum = this.productReviews.reduce((acc, review) => acc + review.userRating, 0)
      return sum / this.productReviews.length
    },
    displayImages() {
      return this.mediaImages.length ? this.mediaImages : [this.placeholderImage]
    },
    currentPrice() {
      if (this.selectedVariant && this.selectedVariant.sellingPrice != null) {
        return this.selectedVariant.sellingPrice
      }
      return this.product?.basePrice || 0
    },
    currentOriginalPrice() {
      if (this.selectedVariant && this.selectedVariant.price != null) {
        return this.selectedVariant.price !== this.currentPrice ? this.selectedVariant.price : null
      }
      if (this.product?.baseOriginalPrice && this.product.baseOriginalPrice !== this.currentPrice) {
        return this.product.baseOriginalPrice
      }
      return null
    },
    optionsTotal() {
      return this.selectedOptionsTotal()
    },
    displayTotalPrice() {
      return this.currentPrice + this.optionsTotal
    },
    // Kiểm tra description có dài không (dựa vào plain text length)
    isDescriptionLong() {
      if (!this.product?.description) return false
      const plainText = this.product.description.replace(/<[^>]*>/g, '')
      return plainText.length > this.descriptionMaxLength
    },
    // Tạo version rút gọn của description
    truncatedDescription() {
      if (!this.product?.description) return ''
      const plainText = this.product.description.replace(/<[^>]*>/g, '')
      if (plainText.length <= this.descriptionMaxLength) {
        return this.product.description
      }
      // Lấy khoảng 500 ký tự đầu của HTML
      let tempDiv = document.createElement('div')
      tempDiv.innerHTML = this.product.description
      let text = tempDiv.textContent || tempDiv.innerText || ''
      let truncated = text.substring(0, this.descriptionMaxLength) + '...'
      return `<div>${truncated}</div>`
    },
  },
}
</script>

<style src="./ProductDetail.css"></style>

<!-- new localized style to make the liked heart red -->
<style scoped>
/* filepath: D:\PVVU\Test\Shop_CMC\Shop_CMC\src\User\screens\ProductDetail\ProductDetail.vue */
.btn-wishlist {
  /* keep base button color as-is (inherited) */
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

/* Make the heart icon red when the product is wishlisted */
.btn-wishlist.liked i.fa-heart,
.btn-wishlist.liked .fa-heart {
  color: #e0245e; /* red - adjust if you prefer a different shade */
}

/* Optional: slightly emphasize the button when liked */
.btn-wishlist.liked {
  font-weight: 600;
}
</style>
