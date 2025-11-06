<template>
  <div class="product-detail-container">
    <Header/>

    <Loading v-if="isLoading" text="Loading product..." />

    <div v-else-if="product" class="product-container">
      <div class="product-content">
        <div class="product-images">
          <div class="main-image">
            <img :src="product.images[selectedImage]" :alt="product.name" />
          </div>
          <div class="thumbnail-images">
            <div
              v-for="(image, i) in product.images"
              :key="i"
              class="thumbnail"
              :class="{ active: selectedImage === i }"
              @click="selectImage(i)">
              <img :src="image" :alt="'Product image ' + (i + 1)" />
            </div>
          </div>
        </div>

        <div class="product-info">
          <h1 class="product-title">{{ product.name }}</h1>

          <div class="rating-section">
            <div class="stars">
              <span v-for="star in 5" :key="star" class="star">☆</span>
            </div>
            <span class="review-count">{{ productReviews.length }} Review</span>
          </div>

          <div class="stock-status" v-if="product.inStock">
            <span class="in-stock">In stock</span>
          </div>

          <div class="action-buttons">
            <button class="btn-wishlist">
              <i class="fa-regular fa-heart"></i> Wishlist
            </button>
            <button class="btn-compare">
              <i class="fa-solid fa-code-compare"></i> Compare
            </button>
          </div>

          <div class="price-section">
            <span class="price">{{ formatPrice(product.price) }}</span>
            <span v-if="product.originalPrice" class="original-price">{{ formatPrice(product.originalPrice) }}</span>
          </div>

          <div class="color-section" v-if="product.colors && product.colors.length > 0">
            <div class="color-label">Color: <span class="selected-color">{{ selectedColor }}</span></div>
            <div class="color-options">
              <div
                v-for="color in product.colors"
                :key="color.id"
                class="color-option"
                :class="{ active: selectedColor === color.name }"
                @click="changeColor(color)"
              >
                <div class="color-swatch" :style="{ backgroundColor: color.value }"></div>
                <span class="color-name">{{ color.name }}</span>
              </div>
            </div>
          </div>

          <div class="storage-section" v-if="product.storages && product.storages.length > 0">
            <div class="storage-label">Size: <span class="selected-storage">{{ selectedStorage }}</span></div>
            <div class="storage-options">
              <button
                v-for="storage in product.storages"
                :key="storage.id"
                class="storage-option"
                :class="{ active: selectedStorage === storage.label }"
                @click="changeStorage(storage)"
              >
                {{ storage.label }}
              </button>
            </div>
          </div>

          <div class="purchase-section">
            <div class="quantity-and-cart">
              <div class="quantity-selector">
                <label>Quantity</label>
                <div class="quantity-controls">
                  <button @click="changeQuantity(-1)" class="qty-btn">-</button>
                  <input type="number" v-model.number="quantity" min="1" class="qty-input" />
                  <button @click="changeQuantity(1)" class="qty-btn">+</button>
                </div>
              </div>
              <button class="add-to-cart-btn" @click="addToCart()">Add to Cart</button>
            </div>
          </div>

          <div class="product-meta">
            <div class="meta-item">
              <strong>Categories:</strong>
              <a href="#" class="meta-link">{{ product.category }}</a>
            </div>
            <div class="meta-item">
              <strong>Tags:</strong>
              <span v-for="(tag, index) in product.tags" :key="index">
                <a href="#" class="meta-link">{{ tag }}</a><span v-if="index < product.tags.length - 1">, </span>
              </span>
            </div>
          </div>

          <div class="social-share">
            <strong>Share:</strong>
            <button @click="shareProduct('facebook')" class="share-btn">
              <i class="fa-brands fa-facebook-f"></i>
            </button>
            <button @click="shareProduct('twitter')" class="share-btn">
              <i class="fa-brands fa-x-twitter"></i>
            </button>
            <button @click="shareProduct('linkedin')" class="share-btn">
              <i class="fa-brands fa-linkedin-in"></i>
            </button>
            <button @click="shareProduct('tumblr')" class="share-btn">
              <i class="fa-brands fa-tumblr"></i>
            </button>
          </div>
        </div>

        </div>

      <div class="product-tabs">
        <div class="tab-navigation">
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'description' }"
            @click="setActiveTab('description')">
            Description
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'specification' }"
            @click="setActiveTab('specification')">
            Specification
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'reviews' }"
            @click="setActiveTab('reviews')">
            Reviews ({{ productReviews.length }})
          </button>
        </div>

        <div class="tab-content">
          <div v-if="activeTab === 'description'" class="tab-panel">
            <h3>{{ product.name }}</h3>
            <p>{{ product.description }}</p>

            <div class="size-chart-section">
              <h4>SIZE CHART</h4>
              <p><em>Size information: unit cm (hand measured, actual size may have discrepancy about 1-3cm)</em></p>

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

          <div v-if="activeTab === 'specification'" class="tab-panel">
            <h3>Specification</h3>
            <ul>
              <li><strong>Brand:</strong> GuaGuanTa</li>
              <li><strong>Sleeve Length:</strong> Short</li>
              <li><strong>Shirt Type:</strong> Slim Style</li>
              <li><strong>Style:</strong> Casual</li>
              <li><strong>Decoration:</strong> Embroidery</li>
              <li><strong>Material:</strong> Cotton blend</li>
            </ul>
          </div>

          <div v-if="activeTab === 'reviews'" class="tab-panel">
            <h3>Customer Reviews</h3>

            <div v-if="productReviews.length > 0">
              <div class="review-summary">
                <div class="rating-overview">
                  <div class="stars">
                    <span v-for="(star, index) in getStars(averageRating)" :key="index" class="star filled">★</span>
                  </div>
                  <span>{{ averageRating.toFixed(1) }}/5 based on {{ productReviews.length }} review{{ productReviews.length > 1 ? 's' : '' }}</span>
                </div>
              </div>

              <div class="reviews-list">
                <div v-for="review in productReviews" :key="review.date" class="review-item">
                  <div class="review-header">
                    <div class="reviewer-info">
                      <strong>{{ review.userName }}</strong>
                      <div class="review-stars">
                        <span v-for="star in review.userRating" :key="star" class="star filled">★</span>
                        <span v-for="star in (5 - review.userRating)" :key="'empty-' + star" class="star">☆</span>
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

      <div class="related-products">
        <h3>You might also like</h3>
        <div class="related-grid">
          <div class="related-item" v-for="item in relatedProducts" :key="item.name">
            <img :src="item.image" :alt="item.name" />
            <h4>{{ item.name }}</h4>
            <div class="item-rating">
              <span v-for="(star, index) in getStars(item.rating)" :key="index" class="star">★</span>
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
import Header from '../../components/Header1/Header.vue';
import Footer from '../../components/Footer/Footer.vue';
import Loading from '../../components/Loading/Loading.vue';
import axios from 'axios';

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
      productData: null, // Raw data from API
      allProducts: [
        {
          id: 1,
          name: "Sennheiser Momentum 4",
          price: 255,
          originalPrice: 299,
          badge: "15%",
          badgeColor: "green",
          reviews: 0,
          image: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=400&h=400&fit=crop",
          inStock: true,
          description: "Premium wireless headphones with exceptional sound quality and active noise cancellation.",
          category: "Electronics",
          tags: ['Electronics', 'Gadgets', 'Gear'],
          images: ["https://images.unsplash.com/photo-1545127398-14699f92334b?w=400&h=400&fit=crop", "https://images.unsplash.com/photo-1545127398-14699f92334b?w=400&h=400&fit=crop", "https://images.unsplash.com/photo-1545127398-14699f92334b?w=400&h=400&fit=crop"],
          colors: [
            {
              name: 'White',
              image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=80&h=80&fit=crop',
              images: [
                'https://images.unsplash.com/photo-1545127398-14699f92334b?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1545127398-14699f92334b?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1545127398-14699f92334b?w=400&h=400&fit=crop'
              ]
            },
            {
              name: 'Black',
              image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=80&h=80&fit=crop',
              images: [
                'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop'
              ]
            }
          ]
        },
        { id: 2, name: "Bose QuietComfort", price: 349, badge: "Out of Stock", badgeColor: "red", reviews: 0, image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop", inStock: false, description: "Industry-leading noise cancellation with premium comfort.", category: "Electronics", tags: ['Audio', 'Wireless', 'Noise Cancelling'], images: ["https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop", "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop"] },
        { id: 3, name: "Beats Studio Buds +", price: 170, reviews: 0, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop", inStock: true, description: "True wireless earbuds with powerful sound and active noise cancellation.", category: "Electronics", tags: ['Audio', 'Wireless', 'Earbuds'], images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop", "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop"] },
        { id: 4, name: "Beats Fit Pro", price: 155, reviews: 0, image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop", inStock: true, description: "Secure-fit wireless earbuds designed for workouts and active lifestyle.", category: "Electronics", tags: ['Audio', 'Wireless', 'Sports'], images: ["https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop", "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop"] },
        { id: 5, name: "Apple AirPods Pro", price: 299, reviews: 0, image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&h=400&fit=crop", inStock: true, description: "Active noise cancellation with adaptive transparency mode.", category: "Electronics", tags: ['Audio', 'Wireless', 'Apple'], images: ["https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&h=400&fit=crop", "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&h=400&fit=crop"] },
        { id: 6, name: "OnePlus 11 5G", price: 759.99, reviews: 0, image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop", inStock: true, description: "Flagship smartphone with powerful performance and stunning display.", category: "Smartphones", tags: ['Mobile', '5G', 'Android'], images: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop", "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop"] },
        { id: 7, name: "Samsung Galaxy S24 Ultra", price: 799, reviews: 0, image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop", inStock: true, description: "Premium smartphone with advanced camera system and S Pen.", category: "Smartphones", tags: ['Mobile', '5G', 'Samsung'], images: ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop", "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop"] },
        { id: 8, name: "Apple iMac 2023", price: 1349, reviews: 0, image: "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?w=400&h=400&fit=crop", inStock: true, description: "All-in-one desktop with stunning 24-inch 4.5K Retina display.", category: "Computers", tags: ['Desktop', 'Apple', 'All-in-One'], images: ["https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?w=400&h=400&fit=crop", "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?w=400&h=400&fit=crop"] },
        { id: 9, name: "MacBook Pro 2023", price: 1499, reviews: 0, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop", inStock: true, description: "Professional laptop with M3 chip and exceptional performance.", category: "Computers", tags: ['Laptop', 'Apple', 'Professional'], images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop", "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop"] },
        { id: 10, name: "JYX Jeans for Men", price: 68, reviews: 0, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop", inStock: true, description: "Comfortable and stylish jeans for everyday wear.", category: "Fashion", tags: ['Clothing', 'Men', 'Casual'], images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop", "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop"] },
      ],
      selectedImage: 0,
      productReviews: [],
      relatedProducts: [
        {
          name: 'DUDUALISS Men Long Sleeve Shirt Men...',
          price: 17.30,
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
      selectedColor: null,
      selectedStorage: null,
      selectedVariant: null,
      variations: [],
      quantity: 1,
      activeTab: 'description'
    };
  },
  async mounted() {
    await this.fetchProductDetail();
  },
  methods: {
    async fetchProductDetail() {
      try {
        this.isLoading = true;
        const productId = parseInt(this.$route.query.id);

        if (!productId) {
          console.error('No product ID provided');
          alert('No product ID provided! Redirecting to shop...');
          this.$router.push('/product');
          return;
        }

        const response = await axios.get('/elec/api/v1/products', {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwaHVuZ3ZhbnZ1MEBnbWFpbC5jb20iLCJzY29wZSI6IlJPTEVfQURNSU4iLCJpc3MiOiJlbGVjIiwibmFtZSI6IkFkbWluIEFkbWluIiwiZXhwIjoxNzYyNDE1NjgzLCJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzYyMzk0MDgzLCJqdGkiOiI5Y2Y4NDlhYS1jMDI5LTRhZDYtODBkNS1kMDIxMjZkMjUyNDMifQ.e8a_xw0NPix2obE5x4KU8wMKQSABC7RybwYVwPtsl5U'
          }
        });

        if (response.data.code === 200 && response.data.result) {
          const foundProduct = response.data.result.find(p => p.id === productId);

          if (foundProduct) {
            this.productData = foundProduct;
            this.processProductData(foundProduct);
            this.loadProductReviews(productId);
          } else {
            console.error('Product not found with ID:', productId);
            alert('Product not found! Redirecting to shop...');
            this.$router.push('/product');
          }
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
      // Process variations
      const colorVariation = data.variations.find(v => v.type === 'COLOR');
      const storageVariation = data.variations.find(v => v.type === 'TEXT');

      // Create color options with images
      const colors = colorVariation ? colorVariation.variationValues.map(color => ({
        id: color.id,
        name: color.label,
        value: color.value,
        image: data.thumbnail // Use product thumbnail for color preview
      })) : [];

      // Create storage options
      const storages = storageVariation ? storageVariation.variationValues.map(storage => ({
        id: storage.id,
        label: storage.label,
        value: storage.value
      })) : [];

      // Set default selections
      if (colors.length > 0) {
        this.selectedColor = colors[0].name;
      }
      if (storages.length > 0) {
        this.selectedStorage = storages[0].label;
      }

      // Build product object
      this.product = {
        id: data.id,
        name: data.name,
        description: data.description,
        shortDescription: data.shortDescription,
        price: data.minPrice,
        originalPrice: data.maxPrice !== data.minPrice ? data.maxPrice : null,
        inStock: data.inStock,
        qty: data.qty,
        sku: data.sku,
        brand: data.brand,
        category: data.categories.join(', '),
        tags: data.categories,
        images: [data.thumbnail, ...data.gallery],
        colors: colors,
        storages: storages,
        variants: data.variants
      };

      this.variations = data.variations;

      // Select initial variant
      this.updateSelectedVariant();
    },
    updateSelectedVariant() {
      if (!this.product || !this.product.variants) return;

      // Find variant matching selected color and storage
      const selectedColorObj = this.product.colors.find(c => c.name === this.selectedColor);
      const selectedStorageObj = this.product.storages.find(s => s.label === this.selectedStorage);

      if (selectedColorObj && selectedStorageObj) {
        // Match variant by name pattern
        const variant = this.product.variants.find(v =>
          v.name.includes(this.selectedColor) && v.name.includes(this.selectedStorage)
        );

        if (variant) {
          this.selectedVariant = variant;
          // Update price based on variant
          this.product.price = variant.sellingPrice;
          this.product.inStock = variant.inStock;
          this.product.qty = variant.qty;
        }
      }
    },
    selectImage(index) {
      this.selectedImage = index;
    },
    changeColor(color) {
      this.selectedColor = color.name;
      this.updateSelectedVariant();
    },
    changeStorage(storage) {
      this.selectedStorage = storage.label;
      this.updateSelectedVariant();
    },
    changeQuantity(change) {
      this.quantity = Math.max(1, this.quantity + change);
    },
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price);
    },
    addToCart() {
      console.log('Added to cart:', {
        product: this.product,
        quantity: this.quantity
      });
      alert(`Added ${this.quantity} ${this.product.name} to cart!`);
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
      return Array(5).fill('').map((_, i) => i < rating ? 'star' : 'star_border');
    },
    loadProductReviews(productId) {
      // Load reviews from localStorage
      const allReviews = JSON.parse(localStorage.getItem('productReviews') || '[]');

      // Filter reviews for this specific product
      this.productReviews = allReviews.filter(review => review.productId === productId);

      console.log('Loaded reviews for product', productId, ':', this.productReviews);
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  },
  computed: {
    averageRating() {
      if (this.productReviews.length === 0) return 0;
      const sum = this.productReviews.reduce((acc, review) => acc + review.userRating, 0);
      return sum / this.productReviews.length;
    }
  }
};
</script>

<style src="./ProductDetail.css"></style>
