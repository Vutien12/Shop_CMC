<template>
  <div class="product-detail-container">
    <Header1/>
    <div class="product-container">
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
              <!-- <span
                v-for="(star, index) in getStars(product.rating)"
                :key="index"
                class="star"
                :class="{ filled: star === 'star' }">
                ★
              </span> -->
            </div>
            <!-- <span class="review-count">{{ product.reviews }} Reviews</span> -->
          </div>

          <div class="stock-status" v-if="product.inStock">
            <span class="in-stock">In Stock</span>
          </div>

          <div class="product-description">
            <p>{{ product.description }}</p>
            <p class="warranty">{{ product.warranty }}</p>
          </div>

          <div class="price-section">
            <span class="price">${{ product.price }}</span>
          </div>

          <div class="purchase-section">
            <div class="quantity-selector">
              <label>Quantity:</label>
              <div class="quantity-controls">
                <button @click="changeQuantity(-1)" class="qty-btn">-</button>
                <input type="number" v-model.number="quantity" min="1" class="qty-input" />
                <button @click="changeQuantity(1)" class="qty-btn">+</button>
              </div>
            </div>
            <button class="add-to-cart-btn" @click="addToCart()">Add to Cart</button>
          </div>

          <div class="product-details">
            <div class="detail-item">
              <strong>SKU:</strong> {{ product.id }}
            </div>
            <div class="detail-item">
              <strong>Categories:</strong> {{ product.category }}
            </div>
            <div class="detail-item">
              <strong>Tags:</strong>
              <span v-for="(tag, index) in product.tags" :key="index">
                {{ tag }}<span v-if="index < product.tags.length - 1">, </span>
              </span>
            </div>
          </div>

          <div class="social-share">
            <span>Share:</span>
            <button @click="shareProduct('facebook')" class="share-btn facebook">f</button>
            <button @click="shareProduct('twitter')" class="share-btn twitter">t</button>
            <button @click="shareProduct('email')" class="share-btn email">✉</button>
            <button @click="shareProduct('link')" class="share-btn link">🔗</button>
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
            Reviews ({{ product.reviews }})
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
            <div class="review-summary">
              <div class="rating-overview">
                <div class="stars">
                  <span v-for="(star, index) in getStars(product.rating)" :key="index" class="star filled">★</span>
                </div>
                <span>{{ product.rating }}/5 based on {{ product.reviews }} reviews</span>
              </div>
            </div>
            <p>No reviews yet. Be the first to review this product!</p>
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
    <Footer />
  </div>
</template>

<script>
import Header1 from '../Header/Header1.vue';
import Footer from '../Footer/Footer.vue';

export default {
  name: 'ProductDetail',
  components: {
    Header1,
    Footer
  },
  data() {
    return {
      product: {
        id: 'VKGWT1MG',
        name: 'Men Embroidery Polo Giraffe Shirt',
        price: 8.66,
        rating: 5,
        reviews: 5,
        inStock: true,
        description: 'Brand Name: GuaGuanTa Sleeve Length (cm): Short Shirt Type: Slim Style. Casual Decoration: Embroidery',
        warranty: 'Warranty Compare',
        category: "Men's Fashion",
        tags: ['Fashion', 'New Arrivals', 'Casual', 'Outfit', 'Lifestyle'],
        images: [
          'assets/images/ao1.jpeg',
          'assets/images/ao2.webp',
          'assets/images/polo-white.jpg',
          'assets/images/polo-black.jpg',
          'assets/images/polo-navy.jpg',
          'assets/images/polo-green.jpg'
        ],
        features: [
          '24/7 SUPPORT - Support every time',
          'ACCEPT PAYMENT - Visa, Paypal, Master',
          'SECURED PAYMENT - 100% Secured',
          'FREE SHIPPING - Order over $100',
          '30 DAYS RETURN - 30 days guarantee'
        ] // Vẫn giữ data này phòng khi cần dùng lại cho phần khác
      },
      selectedImage: 0,
      quantity: 1,
      activeTab: 'description',
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
      showSizeChart: false
    };
  },
  methods: {
    selectImage(index) {
      this.selectedImage = index;
    },
    changeQuantity(change) {
      this.quantity = Math.max(1, this.quantity + change);
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
    }
  }
};
</script>

<style src="./ProductDetail.css"></style>
