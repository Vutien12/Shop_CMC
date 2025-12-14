<template>
  <div class="product-detail-container">
    <Header />
    <Loading v-if="isLoading" text="Loading product..." />

    <div v-else-if="product" class="product-container">
      <div class="product-content">
        <!-- Images -->
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

          <!-- Rating -->
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

          <!-- Stock Status -->
          <div class="stock-status" :class="{ 'out-stock': !product.inStock }">
            <span class="in-stock" v-if="product.inStock">In Stock ({{ product.qty }} pcs)</span>
            <span class="out-stock" v-else>Out of Stock</span>
          </div>

          <!-- Wishlist & Compare -->
          <div class="action-buttons">
            <button
              class="btn-wishlist"
              :class="{ liked: (selectedVariant?.isWishlisted ?? product?.isWishlisted) }"
              type="button"
              @click="toggleWishlist"
            >
              <i :class="(selectedVariant?.isWishlisted ?? product?.isWishlisted) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
              Wishlist
            </button>
            <button class="btn-compare" type="button">
              <i class="fa-solid fa-code-compare"></i> Compare
            </button>
          </div>

          <hr class="divider" />

          <!-- Price -->
          <div class="price-section">
            <div class="price-row">
              <span class="price">{{ formatPrice(currentPrice) }}</span>
              <span v-if="currentOriginalPrice" class="original-price">
                {{ formatPrice(currentOriginalPrice) }}
              </span>
            </div>
          </div>

          <!-- Color Variation -->
          <div v-if="colorVariation" class="variation-section color-block">
            <div class="variation-label">
              Color:
              <span v-if="selectedColor" class="selected-value">{{ selectedColor }}</span>
            </div>
            <div class="variation-options color-options">
              <button
                v-for="value in colorVariation.variationValues"
                :key="value.id"
                class="color-option"
                :class="{ active: selectedColor === value.label, disabled: !isColorAvailable(value) }"
                :disabled="!isColorAvailable(value)"
                @click="selectColor(value)"
                :title="value.label"
              >
                <span class="color-swatch" :style="{ backgroundColor: value.value }"></span>
              </button>
            </div>
          </div>

          <!-- Other Variations (Storage, Size, etc.) -->
          <div
            v-for="variation in otherVariations"
            :key="variation.id"
            class="variation-section"
            :class="variation.type.toLowerCase()"
          >
            <div class="variation-label">
              {{ variation.name }}:
              <span class="selected-value">{{ selectedVariations[variation.id]?.value?.label || '—' }}</span>
            </div>
            <div class="variation-options">
              <button
                v-for="value in variation.variationValues"
                :key="value.id"
                class="storage-option"
                :class="{ active: selectedVariations[variation.id]?.value?.id === value.id }"
                @click="selectVariation(variation.id, value)"
              >
                {{ value.label }}
              </button>
            </div>
          </div>

          <!-- Additional Options -->
          <div v-if="options.length" class="options">
            <h4 class="options-title">Additional Options</h4>
            <div class="options-content">
              <div class="price-breakdown">
                <div class="price-line base">
                  <span>Product Price</span>
                  <strong>{{ formatPrice(currentPrice) }}</strong>
                </div>
                <template v-for="option in options" :key="option.id">
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

              <div class="options-controls">
                <div v-for="option in options" :key="option.id" class="option-section">
                  <div class="option-label">
                    {{ option.name }}
                    <span class="option-badge" :class="option.isRequired ? 'required' : 'optional'">
                      {{ option.isRequired ? 'required' : 'optional' }}
                    </span>
                  </div>

                  <!-- SELECT -->
                  <template v-if="option.type === 'SELECT'">
                    <select v-model="selectedOptions[option.id]" class="option-select" @change="clearOptionError(option.id)">
                      <!-- placeholder always present; use null value so v-model stays null until user chooses -->
                      <option :value="null">Select {{ option.name }}</option>
                      <option v-for="optValue in option.optionValues" :key="optValue.id" :value="optValue.id">
                        {{ optionLabelWithPrice(optValue) }}
                      </option>
                    </select>
                  </template>

                  <!-- RADIO / RADIO_CUSTOM -->
                  <template v-else-if="option.type === 'RADIO' || option.type === 'RADIO_CUSTOM'">
                    <div class="radio-group">
                      <label v-for="optValue in option.optionValues" :key="optValue.id" class="radio-item">
                        <input
                          type="radio"
                          :name="`option-${option.id}`"
                          :value="optValue.id"
                          v-model="selectedOptions[option.id]"
                          @change="clearOptionError(option.id)"
                        />
                        {{ optionLabelWithPrice(optValue) }}
                      </label>
                    </div>
                  </template>

                  <!-- MULTIPLE_SELECT -->
                  <template v-else-if="option.type === 'MULTIPLE_SELECT'">
                    <select v-model="selectedOptions[option.id]" multiple class="option-multi-select" @change="clearOptionError(option.id)">
                      <option v-for="optValue in option.optionValues" :key="optValue.id" :value="optValue.id">
                        {{ optionLabelWithPrice(optValue) }}
                      </option>
                    </select>
                  </template>

                  <!-- CHECKBOX / CHECKBOX_CUSTOM -->
                  <template v-else-if="option.type === 'CHECKBOX' || option.type === 'CHECKBOX_CUSTOM'">
                    <div class="checkbox-group">
                      <label v-for="optValue in option.optionValues" :key="optValue.id" class="checkbox-item">
                        <input
                          type="checkbox"
                          :value="optValue.id"
                          :checked="isOptionSelected(option.id, optValue.id)"
                          @change="toggleOptionValue(option.id, optValue.id)"
                        />
                        {{ optionLabelWithPrice(optValue) }}
                      </label>
                    </div>
                  </template>

                  <!-- TEXTAREA -->
                  <template v-else-if="option.type === 'TEXTAREA'">
                    <textarea v-model="selectedOptions[option.id]" class="option-textarea" :placeholder="`Enter ${option.name}`" @input="clearOptionError(option.id)"></textarea>
                  </template>

                  <!-- DATE / TIME / DATETIME -->
                  <template v-else-if="option.type === 'DATE'">
                    <input v-model="selectedOptions[option.id]" type="date" class="option-input" @change="clearOptionError(option.id)" />
                  </template>
                  <template v-else-if="option.type === 'TIME'">
                    <input v-model="selectedOptions[option.id]" type="time" class="option-input" @change="clearOptionError(option.id)" />
                  </template>
                  <template v-else-if="option.type === 'DATETIME'">
                    <input v-model="selectedOptions[option.id]" type="datetime-local" class="option-input" @change="clearOptionError(option.id)" />
                  </template>

                  <!-- Fallback to TEXT -->
                  <template v-else>
                    <input v-model="selectedOptions[option.id]" type="text" class="option-input" :placeholder="`Enter ${option.name}`" @input="clearOptionError(option.id)" />
                  </template>

                  <!-- Error message -->
                  <div v-if="optionErrors[option.id]" class="error-message">Vui lòng hoàn thành tuỳ chọn bắt buộc</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quantity + Add to Cart -->
          <div class="purchase-section">
            <div class="quantity-and-cart">
              <div class="quantity-selector">
                <label for="qty-input">Quantity</label>
                <div class="quantity-controls">
                  <button @click="changeQuantity(-1)" class="qty-btn" type="button">-</button>
                  <input id="qty-input" v-model.number="quantity" type="number" min="1" class="qty-input" />
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

      <!-- Tabs -->
      <div class="product-tabs">
        <div class="tab-navigation">
          <button class="tab-btn" :class="{ active: activeTab === 'description' }" @click="setActiveTab('description')">
            Description
          </button>
          <button class="tab-btn" :class="{ active: activeTab === 'specification' }" @click="setActiveTab('specification')">
            Specification
          </button>
          <button class="tab-btn" :class="{ active: activeTab === 'reviews' }" @click="setActiveTab('reviews')">
            Reviews<span v-if="reviewStore.totalElements > 0"> ({{ reviewStore.totalElements }})</span>
          </button>
        </div>

        <div class="tab-content">
          <div v-if="activeTab === 'description'" class="tab-panel">
            <h3>{{ product.name }}</h3>
            <div v-html="isDescriptionLong && !showFullDescription ? truncatedDescription : product.description"
                 class="product-description-html"
                 :class="{ 'description-collapsed': isDescriptionLong && !showFullDescription }"></div>
            <div v-if="isDescriptionLong" class="description-toggle">
              <button @click="toggleDescription()" class="show-more-btn">
                {{ showFullDescription ? 'Show Less' : 'Show More' }}
              </button>
            </div>
          </div>

          <div v-if="activeTab === 'specification'" class="tab-panel">
            <h3>Specification</h3>
            <ul>
              <li><strong>Product Name:</strong> {{ product.name }}</li>
              <li><strong>Brand:</strong> {{ product.brand }}</li>
              <li><strong>SKU:</strong> {{ product.sku }}</li>
              <li v-if="product.categories?.length"><strong>Category:</strong> {{ product.categories.join(', ') }}</li>
              <li><strong>Stock Status:</strong> {{ product.inStock ? 'In Stock' : 'Out of Stock' }}</li>
              <li><strong>Available Quantity:</strong> {{ product.qty }}</li>
              <li><strong>Current Price:</strong> {{ formatPrice(currentPrice) }}</li>
              <li v-if="currentOriginalPrice"><strong>Original Price:</strong> {{ formatPrice(currentOriginalPrice) }}</li>
              <li v-if="selectedVariant"><strong>Current Variant:</strong> {{ selectedVariant.name }}</li>
              <li v-if="selectedVariant"><strong>Variant SKU:</strong> {{ selectedVariant.sku }}</li>
            </ul>
          </div>

          <div v-if="activeTab === 'reviews'" class="tab-panel">
            <ReviewList :productId="product.id" :showRatingFilter="true" />
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <div v-if="relatedProducts.length > 0" class="pd-related-products">
        <h3 class="pd-related-products__title">You might also like</h3>
        <div class="pd-related-products__grid">
          <div
            v-for="item in relatedProducts"
            :key="item.id"
            @click="navigateToProduct(item.id)"
            style="cursor: pointer;"
          >
            <ProductCard :product="transformRelatedProduct(item)" />
          </div>
        </div>
      </div>
    </div>

    <Footer v-if="product" />
    <Chatbot />
    <BottomNavBar />
  </div>
</template>

<script>
import Header from '@/User/components/Header1/Header.vue'
import Footer from '@/User/components/Footer/Footer.vue'
import Loading from '@/User/components/Loading/Loading.vue'
import ReviewList from '@/User/components/ReviewList/ReviewList.vue'
import Chatbot from '@/User/components/Chatbot/Chatbot.vue'
import BottomNavBar from '@/User/components/BottomNavBar.vue'
import ProductCard from '@/User/screens/Home/ProductCard.vue'
import { getProductById, getRelatedProducts } from '@/api/productApi.js'
import { useReviewStore } from '@/User/stores/reviewStore.js'
import { useCartStore } from '@/User/stores/cartStore.js'
import { useToast } from '@/User/components/Toast/useToast.js'

export default {
  name: 'ProductDetail',
  components: { Header, Footer, Loading, ReviewList, Chatbot, ProductCard, BottomNavBar },
  setup() {
    const reviewStore = useReviewStore()
    const cartStore = useCartStore()
    const { add: toast } = useToast()
    return { reviewStore, cartStore, toast }
  },
  data() {
    return {
      isLoading: true,
      product: null,
      selectedImage: 0,
      quantity: 1,
      activeTab: 'description',
      showFullDescription: false,
      descriptionMaxLength: 500,
      isSubmitting: false,

      // Dữ liệu variation
      variations: [],
      options: [],
      selectedVariations: {},   // { variationId: valueObject }
      selectedOptions: {},
      optionErrors: {},
      selectedVariant: null,
      colorVariation: null,
      otherVariations: [],
      selectedColor: null,

      // Images
      mediaImages: [],
      placeholderImage: 'https://via.placeholder.com/500x500?text=No+Image',

      // Lookup
      variantLookup: {},

      // Related products
      relatedProducts: [],
    }
  },
  async mounted() {
    await this.fetchProductDetail()
  },
  watch: {
    // Watch route params để reload product khi navigate từ related products
    '$route.params.id': {
      handler(newId, oldId) {
        if (newId && newId !== oldId) {
          // Reset state và fetch lại
          this.selectedImage = 0;
          this.quantity = 1;
          this.activeTab = 'description';
          this.showFullDescription = false;
          this.fetchProductDetail();
        }
      }
    }
  },
  methods: {
    async fetchProductDetail() {
      console.log('Route params:', this.$route.params)
      console.log('Product ID:', this.$route.params.id)

      try {
        this.isLoading = true
        const id = parseInt(this.$route.params.id)
        if (!id || isNaN(id)) {
          this.toast('Invalid product ID!', 'error')
          return this.$router.push('/product')
        }

        const res = await getProductById(id)

        this.processProductData(res.result)

        await Promise.all([
          this.reviewStore.fetchProductReviews(id, 0, 1).catch(() => {}),
          this.fetchRelatedProducts(id)
        ])
      } catch (err) {
        this.toast('Unable to load the product.!', 'error')
        this.$router.push('/product')
      } finally {
        this.isLoading = false
      }
    },

    async fetchRelatedProducts(productId) {
      try {
        const response = await getRelatedProducts(productId, 10);
        if (response.code === 200 && response.result) {
          this.relatedProducts = response.result;
          console.log('Related products loaded:', this.relatedProducts.length);
        }
      } catch (error) {
        console.error('Error loading related products:', error);
        this.relatedProducts = [];
      }
    },

    processProductData(data) {
      this.variations = data.variations || []
      this.options = data.options || []

      // Initialize selectedOptions defaults for different option types
      this.options.forEach(opt => {
        if (this.selectedOptions[opt.id] !== undefined) return // don't overwrite existing
        if (['MULTIPLE_SELECT', 'CHECKBOX', 'CHECKBOX_CUSTOM'].includes(opt.type)) {
          this.selectedOptions[opt.id] = []
        } else if (['SELECT', 'RADIO', 'RADIO_CUSTOM'].includes(opt.type)) {
          // use null for single-choice to avoid browser auto-selecting first option
          this.selectedOptions[opt.id] = null
        } else {
          this.selectedOptions[opt.id] = ''
        }
        // initialize error flag for option
        this.optionErrors[opt.id] = false
      })

      this.colorVariation = this.variations.find(v => v.type === 'COLOR' || /color/i.test(v.name))
      this.otherVariations = this.variations.filter(v => v !== this.colorVariation)

      const galleryUrls = (data.gallery || []).map(item => {
        if (typeof item === 'object' && item.url) {
          return item.url;
        }
        return typeof item === 'string' ? item : null;
      }).filter(Boolean);

      // Handle thumbnail as object or string
      const thumbnailUrl = data.thumbnail?.url || data.thumbnail || null;
      const pool = [thumbnailUrl, ...galleryUrls].filter(Boolean)
      this.mediaImages = pool.length ? [...new Set(pool)] : [this.placeholderImage]

      // Product base info
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
        tags: data.tags || [],
        variants,
        basePrice: variants[0]?.sellingPrice || data.minPrice || 0,
        baseOriginalPrice: variants[0]?.price || null,
        // Compute product-level wishlisted if any variant is wishlisted; fall back to top-level flag
        isWishlisted: (variants.some(v => v.isWishlisted === true) || !!data.isWishlisted),
      }

      this.buildVariantLookup(variants)
      this.initializeSelections()
    },

    buildVariantLookup(variants) {
      this.variantLookup = {}

      // If no variations, store the first variant with empty key
      if (this.variations.length === 0) {
        if (variants.length > 0) {
          this.variantLookup[''] = variants[0]
        }
        console.log('variantLookup (no variations):', this.variantLookup)
        return
      }

      variants.forEach(variant => {
        let parts = (variant.name || '').split(' - ')
        if (parts[0] === this.product.name) parts.shift()

        const keyParts = this.variations.map((variation, index) => {
          const label = parts[index]
          const value = variation.variationValues.find(vv => vv.label === label)
          return value ? `v${variation.id}_val${value.id}` : ''
        }).filter(Boolean)

        const key = keyParts.join('::')
        if (key) this.variantLookup[key] = variant
      })

      console.log('variantLookup:', this.variantLookup)
    },

    initializeSelections() {
      const first = this.product.variants.find(v => v.inStock && v.isActive) || this.product.variants[0] || {}

      // If no variations exist, directly select the first variant
      if (this.variations.length === 0) {
        this.selectedVariant = first
        if (this.selectedVariant) {
          this.product.inStock = this.selectedVariant.inStock
          this.product.qty = this.selectedVariant.qty
        }
        return
      }

      let parts = (first.name || '').split(' - ')
      if (parts[0] === this.product.name) parts.shift()

      this.variations.forEach((variation, index) => {
        const label = parts[index]
        const val = variation.variationValues.find(vv => vv.label === label) || variation.variationValues[0]
        if (val) {
          // LƯU CẢ variation VÀ value
          this.selectedVariations[variation.id] = {
            variation: variation,
            value: val
          }
          if (variation === this.colorVariation) this.selectedColor = val.label
        }
      })
      this.updateVariantFromSelection()
    },

    selectColor(value) {
      this.selectedVariations[this.colorVariation.id] = {
        variation: this.colorVariation,
        value: value
      }
      this.selectedColor = value.label
      this.updateVariantFromSelection()
    },

    selectVariation(variationId, value) {
      const variation = this.variations.find(v => v.id === variationId)
      this.selectedVariations[variationId] = {
        variation: variation,
        value: value
      }
      this.updateVariantFromSelection()
    },

    updateVariantFromSelection() {
      const key = this.variations
        .map(v => this.selectedVariations[v.id]?.value?.id ? `v${v.id}_val${this.selectedVariations[v.id].value.id}` : '')
        .filter(Boolean)
        .join('::')

      this.selectedVariant = this.variantLookup[key] || null
      if (this.selectedVariant) {
        this.product.inStock = this.selectedVariant.inStock
        this.product.qty = this.selectedVariant.qty
      }
    },

    isColorAvailable(value) {
      const testKey = this.variations
        .map(v => v.id === this.colorVariation.id ? `v${v.id}_val${value.id}` :
          this.selectedVariations[v.id]?.value?.id ? `v${v.id}_val${this.selectedVariations[v.id].value.id}` : '')
        .filter(Boolean)
        .join('::')
      const variant = this.variantLookup[testKey]
      if (!variant || variant.isActive === false) return false
      return true
    },

    async addToCart() {
      if (!this.selectedVariant) return

      if (!this.selectedVariant.isActive) {
        this.toast('This product has now been discontinued!', 'warning')
        return
      }
      if (!this.selectedVariant.inStock) {
        this.toast('This variant is out of stock!', 'warning')
        return
      }
      if (this.isSubmitting) return

      // Validate required options and show error messages
      if (!this.validateOptions()) {
        // scroll to first option section with error message
        this.$nextTick(() => {
          const el = this.$el.querySelector('.option-section .error-message')
          if (el) el.closest('.option-section').scrollIntoView({ behavior: 'smooth', block: 'center' })
        })
        return this.toast('Please complete the required options.', 'warning')
      }

      const payload = this.buildCartPayload()
      this.isSubmitting = true
      try {
        await this.cartStore.addItem(payload)
        this.toast('Added to cart!', 'success')
      } catch (err) {
        this.toast(err.response?.data?.message || 'Add to cart - failure', 'error')
      } finally {
        this.isSubmitting = false
      }
    },

    async toggleWishlist() {
      const variant = this.selectedVariant || this.product.variants[0]
      const variantId = variant?.id
      if (!variantId) return this.toast('No variants found', 'error')

      const api = await import('@/api/accountApi.js')
      try {
        const currentlyWishlisted = !!(variant?.isWishlisted ?? this.product?.isWishlisted)

        if (currentlyWishlisted) {
          // Removal: find wishlist entry id (wishlistId) corresponding to this variant
          const { useWishlistStore } = await import('@/User/stores/wishlistStore.js')
          const wishlistStore = useWishlistStore()

          if (!wishlistStore.items || wishlistStore.items.length === 0) {
            await wishlistStore.fetchWishlist(0).catch(err => console.debug('Failed to prefetch wishlist for lookup:', err))
          }

          const match = (wishlistStore.items || []).find(i => String(i.variantId) === String(variantId) || String(i.productVariantId) === String(variantId))

          if (match && match.id) {
            await api.removeFromWishlist(match.id)
          } else {
            // fallback: try deleting by variant id (older backend)
            await api.removeFromWishlist(variantId)
          }

          // Update UI state for that variant and recompute product-level flag
          if (variant) variant.isWishlisted = false
          if (this.product?.variants && Array.isArray(this.product.variants)) {
            const any = this.product.variants.some(v => v.isWishlisted === true)
            this.product.isWishlisted = any
          } else {
            this.product.isWishlisted = false
          }

          this.toast('Đã xóa khỏi wishlist', 'success')
        } else {
          // Add to wishlist by variant id
          await api.addToWishlist(variantId)

          // Update UI state
          if (variant) variant.isWishlisted = true
          if (this.product?.variants && Array.isArray(this.product.variants)) {
            const any = this.product.variants.some(v => v.isWishlisted === true)
            this.product.isWishlisted = any
          } else {
            this.product.isWishlisted = true
          }

          this.toast('Added to wishlist', 'success')
        }

        window.dispatchEvent(new Event('wishlistChanged'))
      } catch (err) {
        this.toast(err.response?.status === 401 ? 'Please log in' : 'Error wishlist', 'error')
      }
    },

    buildCartPayload() {
      const unitPrice = this.selectedVariant?.sellingPrice || 0

      // variations
      const cartItemVariations = Object.values(this.selectedVariations).map(item => ({
        variationId: item.variation.id,
        type: item.variation.type,
        value: item.value.value ?? item.value.label,
        cartItemVariationValues: [{ variationValueId: item.value.id }]
      }))

      // options
      const cartItemOptions = this.options.map(option => {
        const type = option.type

        // Text-like types (TEXT, TEXTAREA, DATE, TIME, DATETIME)
        if (['TEXT', 'TEXTAREA', 'DATE', 'TIME', 'DATETIME'].includes(type)) {
          const val = this.selectedOptions[option.id] || ''
          if (!option.isRequired && !val) return null
          const base = option.optionValues[0] || {}
          return {
            optionId: option.id,
            optionName: option.name,
            type,
            isRequired: option.isRequired,
            valueLabel: val,
            price: base.price || 0,
            priceType: base.priceType || 'FIXED',
            cartItemOptionValues: [{
              optionValueId: base.id,
              valueLabel: val,
              price: base.price || 0,
              priceType: base.priceType || 'FIXED'
            }]
          }
        }

        // Single choice types (SELECT, RADIO, RADIO_CUSTOM)
        if (['SELECT', 'RADIO', 'RADIO_CUSTOM'].includes(type)) {
          const selId = this.selectedOptions[option.id]
          if (!option.isRequired && (selId === '' || selId === undefined || selId === null)) return null
          const sel = option.optionValues.find(ov => String(ov.id) === String(selId))
          if (!sel) return null
          return {
            optionId: option.id,
            optionName: option.name,
            type,
            isRequired: option.isRequired,
            valueLabel: sel.label,
            price: sel.price || 0,
            priceType: sel.priceType || 'FIXED',
            cartItemOptionValues: [{
              optionValueId: sel.id,
              valueLabel: sel.label,
              price: sel.price || 0,
              priceType: sel.priceType || 'FIXED'
            }]
          }
        }

        // Multi choice types (MULTIPLE_SELECT, CHECKBOX, CHECKBOX_CUSTOM)
        if (['MULTIPLE_SELECT', 'CHECKBOX', 'CHECKBOX_CUSTOM'].includes(type)) {
          const selArr = this.selectedOptions[option.id] || []
          if (!Array.isArray(selArr) || selArr.length === 0) return null
          const vals = option.optionValues.filter(ov => selArr.includes(ov.id))
          if (!vals.length) return null
          const totalPrice = vals.reduce((s, v) => s + (v.price || 0), 0)
          return {
            optionId: option.id,
            optionName: option.name,
            type,
            isRequired: option.isRequired,
            valueLabel: vals.map(v => v.label).join(', '),
            price: totalPrice,
            priceType: vals[0]?.priceType || 'FIXED',
            cartItemOptionValues: vals.map(v => ({
              optionValueId: v.id,
              valueLabel: v.label,
              price: v.price || 0,
              priceType: v.priceType || 'FIXED'
            }))
          }
        }

        return null
      }).filter(Boolean)

      return {
        cartItems: [{
          productId: this.product.id,
          productVariantId: this.selectedVariant.id,
          qty: this.quantity,
          unitPrice,
          cartItemVariations,
          cartItemOptions
        }]
      }
    },

    // Helper to check and toggle multi/select options
    isOptionSelected(optionId, valueId) {
      const arr = this.selectedOptions[optionId]
      return Array.isArray(arr) ? arr.includes(valueId) : String(arr) === String(valueId)
    },
    toggleOptionValue(optionId, valueId) {
      const cur = this.selectedOptions[optionId]
      if (!Array.isArray(cur)) {
        // if not an array, convert to array with single value toggled
        this.selectedOptions[optionId] = cur === valueId ? [] : [valueId]
        this.clearOptionError(optionId)
        return
      }
      const idx = cur.indexOf(valueId)
      if (idx === -1) cur.push(valueId)
      else cur.splice(idx, 1)
      // ensure reactivity (assignment not strictly required but safe)
      this.selectedOptions[optionId] = [...cur]
      this.clearOptionError(optionId)
    },

    // Validation helpers
    validateOptions() {
      let ok = true
      this.options.forEach(opt => {
        if (!opt.isRequired) {
          this.optionErrors[opt.id] = false
          return
        }

        const type = opt.type
        const val = this.selectedOptions[opt.id]
        let satisfied = true

        if (['TEXT', 'TEXTAREA', 'DATE', 'TIME', 'DATETIME'].includes(type)) {
          satisfied = String(val || '').trim().length > 0
        } else if (['SELECT', 'RADIO', 'RADIO_CUSTOM'].includes(type)) {
          satisfied = val !== '' && val !== undefined && val !== null
        } else if (['MULTIPLE_SELECT', 'CHECKBOX', 'CHECKBOX_CUSTOM'].includes(type)) {
          satisfied = Array.isArray(val) && val.length > 0
        } else {
          satisfied = String(val || '').trim().length > 0
        }

        this.optionErrors[opt.id] = !satisfied
        if (!satisfied) ok = false
      })
      return ok
    },

    clearOptionError(optionId) {
      if (this.optionErrors && this.optionErrors[optionId]) this.optionErrors[optionId] = false
    },

    // UI Helpers
    selectImage(i) { this.selectedImage = i },
    changeQuantity(delta) { this.quantity = Math.max(1, this.quantity + delta) },
    setActiveTab(tab) { this.activeTab = tab },
    toggleDescription() { this.showFullDescription = !this.showFullDescription },
    shareProduct() { },
    getStars(rating) {
      return Array.from({ length: rating }, (_, i) => i + 1);
    },

    navigateToProduct(productId) {
      // Navigate to product detail page
      this.$router.push({ name: 'ProductDetail', params: { id: productId } });
    },

    transformRelatedProduct(apiProduct) {
      // Transform API product to match ProductCard format
      const firstVariant = apiProduct.variants && apiProduct.variants.length > 0 ? apiProduct.variants[0] : null;

      // Calculate discount
      let discount = null;
      let originalPrice = null;
      if (firstVariant && firstVariant.specialPrice) {
        originalPrice = firstVariant.price;
        const discountPercent = ((firstVariant.price - firstVariant.specialPrice) / firstVariant.price) * 100;
        discount = `-${Math.round(discountPercent)}%`;
      }

      return {
        id: apiProduct.id,
        name: apiProduct.name,
        image: apiProduct.thumbnail?.url || apiProduct.thumbnail || this.placeholderImage,
        price: apiProduct.minPrice || 0,
        originalPrice: originalPrice,
        discount: discount,
        isNew: !!(apiProduct.newFrom || apiProduct.newTo),
        isOutOfStock: !apiProduct.inStock,
      };
    },

    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
    },

    getSelectedOptionPrice(option) {
      const type = option.type;
      const val = this.selectedOptions[option.id];

      if (['TEXT', 'TEXTAREA', 'DATE', 'TIME', 'DATETIME'].includes(type)) {
        const base = option.optionValues[0];
        return base?.price || 0;
      }

      if (['SELECT', 'RADIO', 'RADIO_CUSTOM'].includes(type)) {
        const sel = option.optionValues.find(ov => String(ov.id) === String(val));
        return sel?.price || 0;
      }

      if (['MULTIPLE_SELECT', 'CHECKBOX', 'CHECKBOX_CUSTOM'].includes(type)) {
        const selArr = val || [];
        if (!Array.isArray(selArr)) return 0;
        const vals = option.optionValues.filter(ov => selArr.includes(ov.id));
        return vals.reduce((sum, v) => sum + (v.price || 0), 0);
      }

      return 0;
    },

    getSelectedOptionLabel(option) {
      const type = option.type;
      const val = this.selectedOptions[option.id];

      if (['TEXT', 'TEXTAREA', 'DATE', 'TIME', 'DATETIME'].includes(type)) {
        return val || '';
      }

      if (['SELECT', 'RADIO', 'RADIO_CUSTOM'].includes(type)) {
        const sel = option.optionValues.find(ov => String(ov.id) === String(val));
        return sel?.label || '';
      }

      if (['MULTIPLE_SELECT', 'CHECKBOX', 'CHECKBOX_CUSTOM'].includes(type)) {
        const selArr = val || [];
        if (!Array.isArray(selArr)) return '';
        const vals = option.optionValues.filter(ov => selArr.includes(ov.id));
        return vals.map(v => v.label).join(', ');
      }

      return '';
    },

    optionLabelWithPrice(optValue) {
      if (!optValue.price || optValue.price === 0) return optValue.label;
      const sign = optValue.priceType === 'PERCENT' ? '%' : '';
      return `${optValue.label} (+${this.formatPrice(optValue.price)}${sign})`;
    },
  },

  computed: {
    displayImages() { return this.mediaImages.length ? this.mediaImages : [this.placeholderImage] },
    currentPrice() { return this.selectedVariant?.sellingPrice ?? this.product?.basePrice ?? 0 },
    currentOriginalPrice() {
      if (!this.selectedVariant) return null
      return this.selectedVariant.price !== this.currentPrice ? this.selectedVariant.price : null
    },
    optionsTotal() {
      return this.options.reduce((sum, o) => sum + this.getSelectedOptionPrice(o), 0)
    },
    displayTotalPrice() { return this.currentPrice + this.optionsTotal },
    isDescriptionLong() {
      if (!this.product?.description) return false
      return this.product.description.replace(/<[^>]*>/g, '').length > this.descriptionMaxLength
    },
    truncatedDescription() {
      if (!this.product?.description) return ''
      const div = document.createElement('div')
      div.innerHTML = this.product.description
      const text = div.textContent || div.innerText || ''
      return `<div>${text.substring(0, this.descriptionMaxLength)}...</div>`
    }
  }
}
</script>

<style src="./ProductDetail.css"></style>
<style src="./RelatedProducts.css"></style>

<!-- new localized style to make the liked heart red -->
<style scoped>
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

/* Simple validation error message */
.error-message {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #e00;
}
</style>
