<template>
  <div class="home-page">
    <Header1 />
    <Loading v-if="isLoading" />
    <div v-else class="home-container">
      <!-- Hero Slider -->
      <section class="hero-slider">
        <div class="slider-container">
          <div class="slide active">
            <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=500&fit=crop" alt="Xiaomi Speaker">
            <div class="slide-content">
              <h2>XIAOMI SPEAKER</h2>
              <p>There are a upgrade for the quality and control in the home</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Banner -->
      <section class="features-banner">
        <div class="feature-item">
          <span class="material-icons">support_agent</span>
          <div class="feature-text">
            <h4>24/7 SUPPORT</h4>
            <p>Support every time</p>
          </div>
        </div>
        <div class="feature-item">
          <span class="material-icons">payment</span>
          <div class="feature-text">
            <h4>ACCEPT PAYMENT</h4>
            <p>Visa, Paypal, Master</p>
          </div>
        </div>
        <div class="feature-item">
          <span class="material-icons">lock</span>
          <div class="feature-text">
            <h4>SECURED PAYMENT</h4>
            <p>100% secured</p>
          </div>
        </div>
        <div class="feature-item">
          <span class="material-icons">local_shipping</span>
          <div class="feature-text">
            <h4>FREE SHIPPING</h4>
            <p>Order over $100</p>
          </div>
        </div>
        <div class="feature-item">
          <span class="material-icons">keyboard_return</span>
          <div class="feature-text">
            <h4>30 DAYS RETURN</h4>
            <p>30 days guarantee</p>
          </div>
        </div>
      </section>

      <!-- Top Categories -->
      <section class="top-categories">
        <div class="section-header">
          <h2>Top Categories in Sales and Trending</h2>
          <p>Last Month up to 1500+ Products Sales From this category. You can choose a product from here and save money.</p>
        </div>
        <div class="categories-grid">
          <div class="category-card" @click="goToCategory('laptops')">
            <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop" alt="Laptops">
            <h3>Laptops</h3>
          </div>
          <div class="category-card" @click="goToCategory('mobiles')">
            <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop" alt="Mobiles">
            <h3>Mobiles</h3>
          </div>
          <div class="category-card" @click="goToCategory('tablets')">
            <img src="https://images.unsplash.com/photo-1561154464-82e9adf32764?w=200&h=200&fit=crop" alt="Tablets">
            <h3>Tablets</h3>
          </div>
          <div class="category-card" @click="goToCategory('watches')">
            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop" alt="Watches">
            <h3>Watches</h3>
          </div>
          <div class="category-card" @click="goToCategory('fashion')">
            <img src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=200&h=200&fit=crop" alt="Men's Fashion">
            <h3>Men's Fashion</h3>
          </div>
          <div class="category-card" @click="goToCategory('televisions')">
            <img src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200&h=200&fit=crop" alt="Televisions">
            <h3>Televisions</h3>
          </div>
        </div>
      </section>

      <!-- Best Deals Section -->
      <section class="best-deals">
        <h2>Best Deals</h2>
        <div class="products-carousel">
          <div class="product-card" v-for="product in bestDeals" :key="product.id" @click="goToProduct(product.id)">
            <div class="product-image">
              <img :src="product.image" :alt="product.name">
              <span class="badge" v-if="product.badge">{{ product.badge }}</span>
            </div>
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <div class="rating">
                <span class="stars">★★★★★</span>
                <span class="reviews">{{ product.reviews }} Review</span>
              </div>
              <div class="price">
                <span class="current-price">${{ product.price }}</span>
                <span class="original-price" v-if="product.originalPrice">${{ product.originalPrice }}</span>
              </div>
              <div class="countdown" v-if="product.countdown">
                <span>00:00:00:00</span>
              </div>
              <div class="stock-info">
                <span>Available: {{ product.available }}</span>
                <span>Sold: {{ product.sold }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Tab Products Section -->
      <section class="tab-products">
        <div class="tabs">
          <button :class="{ active: activeTab === 'mobiles' }" @click="activeTab = 'mobiles'">Mobiles</button>
          <button :class="{ active: activeTab === 'fashion' }" @click="activeTab = 'fashion'">Fashion</button>
          <button :class="{ active: activeTab === 'laptops' }" @click="activeTab = 'laptops'">Laptops</button>
          <button :class="{ active: activeTab === 'tablets' }" @click="activeTab = 'tablets'">Tablets</button>
        </div>
        <div class="tab-content">
          <div class="products-grid">
            <div class="product-card" v-for="product in tabProducts" :key="product.id" @click="goToProduct(product.id)">
              <div class="product-image">
                <img :src="product.image" :alt="product.name">
                <span class="badge badge-red" v-if="product.outOfStock">Out of Stock</span>
                <span class="badge badge-discount" v-if="product.discount">{{ product.discount }}</span>
                <span class="badge badge-new" v-if="product.isNew">New</span>
              </div>
              <div class="product-info">
                <h3>{{ product.name }}</h3>
                <div class="rating">
                  <span class="stars">★★★★★</span>
                  <span class="reviews">{{ product.reviews }} Review</span>
                </div>
                <div class="price">
                  <span class="current-price">${{ product.price }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Hot Best Sellers -->
      <section class="hot-sellers">
        <div class="section-tabs">
          <button :class="{ active: sellersTab === 'latest' }" @click="sellersTab = 'latest'">Latest Products</button>
          <button :class="{ active: sellersTab === 'recent' }" @click="sellersTab = 'recent'">Recently Viewed</button>
          <button :class="{ active: sellersTab === 'sale' }" @click="sellersTab = 'sale'">On Sale</button>
          <button :class="{ active: sellersTab === 'top' }" @click="sellersTab = 'top'">Top Selling</button>
        </div>
        <div class="products-grid">
          <div class="product-card" v-for="product in hotSellers" :key="product.id" @click="goToProduct(product.id)">
            <div class="product-image">
              <img :src="product.image" :alt="product.name">
              <span class="badge badge-discount" v-if="product.discount">{{ product.discount }}</span>
              <span class="badge badge-red" v-if="product.outOfStock">Out of Stock</span>
            </div>
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <div class="rating">
                <span class="stars">★★★★★</span>
                <span class="reviews">0 Review</span>
              </div>
              <div class="price">
                <span class="current-price">${{ product.price }}</span>
                <span class="original-price" v-if="product.originalPrice">${{ product.originalPrice }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Brands Carousel -->
      <section class="brands-section">
        <div class="brands-carousel">
          <img src="https://via.placeholder.com/150x80?text=ASUS" alt="ASUS">
          <img src="https://via.placeholder.com/150x80?text=Acer" alt="Acer">
          <img src="https://via.placeholder.com/150x80?text=Adidas" alt="Adidas">
          <img src="https://via.placeholder.com/150x80?text=Apple" alt="Apple">
          <img src="https://via.placeholder.com/150x80?text=Beats" alt="Beats">
          <img src="https://via.placeholder.com/150x80?text=Dell" alt="Dell">
          <img src="https://via.placeholder.com/150x80?text=HP" alt="HP">
          <img src="https://via.placeholder.com/150x80?text=Huawei" alt="Huawei">
        </div>
      </section>

      <!-- Recent Blog Posts -->
      <section class="blog-posts">
        <div class="section-header">
          <h2>Recent Posts</h2>
          <a href="#" class="view-all">View All</a>
        </div>
        <div class="blog-grid">
          <div class="blog-card" v-for="post in blogPosts" :key="post.id">
            <img :src="post.image" :alt="post.title">
            <div class="blog-content">
              <span class="blog-author">{{ post.author }}</span>
              <span class="blog-date">{{ post.date }}</span>
              <h3>{{ post.title }}</h3>
              <a href="#" class="read-more">Read Post →</a>
            </div>
          </div>
        </div>
      </section>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import Footer from '../../components/Footer/Footer.vue'
import Header1 from '../../components/Header/Header1.vue'
import Loading from '../../components/Loading/Loading.vue'

const router = useRouter()
const isLoading = ref(true)
const activeTab = ref('mobiles')
const sellersTab = ref('latest')

const bestDeals = ref([
  {
    id: 1,
    name: 'Oneplus 7 Pro GM1910 256GB, 8GB, Dual Sim',
    price: 450,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop',
    reviews: 0,
    badge: '',
    available: 15,
    sold: 15,
    countdown: true
  },
  {
    id: 2,
    name: 'Powerbeats3 Wireless In-Ear Headphones - Black',
    price: 49,
    originalPrice: 58,
    image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=300&h=300&fit=crop',
    reviews: 0,
    available: 55,
    sold: 22,
    countdown: true
  },
  {
    id: 3,
    name: 'Beats Solo3 Wireless On-Ear Headphones',
    price: 155,
    originalPrice: 199.95,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300&h=300&fit=crop',
    reviews: 0,
    available: 22,
    sold: 10,
    countdown: true
  },
  {
    id: 4,
    name: 'Huawei Bluetooth Subwoofer Speakers',
    price: 15.20,
    originalPrice: 21.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop',
    reviews: 0,
    available: 34,
    sold: 15,
    countdown: true
  }
])

const tabProducts = computed(() => {
  if (activeTab.value === 'mobiles') {
    return [
      { id: 1, name: 'OnePlus 11 5G', price: 759.99, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop', reviews: 0 },
      { id: 2, name: 'Samsung Galaxy S24 Ultra', price: 799, image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&h=300&fit=crop', reviews: 0 },
      { id: 3, name: 'Oneplus Open', price: 1699, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&h=300&fit=crop', reviews: 0 },
      { id: 4, name: 'OnePlus 12', price: 699.99, image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=300&h=300&fit=crop', reviews: 0 },
      { id: 5, name: 'Apple iPhone 14', price: 799, image: 'https://images.unsplash.com/photo-1592286927505-2c64f6eb2792?w=300&h=300&fit=crop', reviews: 0 },
      { id: 6, name: 'Apple iPhone 15 Pro Max', price: 1499, image: 'https://images.unsplash.com/photo-1678652197950-14c70c80ad96?w=300&h=300&fit=crop', reviews: 0 }
    ]
  }
  return []
})

const hotSellers = ref([
  { id: 1, name: 'Sennheiser Consumer Audio Momentum 4', price: 255, originalPrice: 300, discount: '-15%', image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=300&h=300&fit=crop' },
  { id: 2, name: 'Bose QuietComfort Bluetooth Headphones', price: 349, outOfStock: true, image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300&h=300&fit=crop' },
  { id: 3, name: 'Beats Studio Buds +', price: 170, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop' },
  { id: 4, name: 'Beats Fit Pro', price: 155, image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=300&fit=crop' },
  { id: 5, name: 'Apple AirPods Pro', price: 299, image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=300&h=300&fit=crop' },
  { id: 6, name: 'OnePlus 11 5G', price: 759.99, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop' },
  { id: 7, name: 'Samsung Galaxy S24 Ultra', price: 799, image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&h=300&fit=crop' },
  { id: 8, name: 'Apple iMac 2023', price: 1349, image: 'https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?w=300&h=300&fit=crop' },
  { id: 9, name: 'MacBook Pro 2023', price: 1499, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop' },
  { id: 10, name: 'JYX Jeans for Men', price: 68, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop' }
])

const blogPosts = ref([
  {
    id: 1,
    title: 'Stories of Satisfaction and Success',
    author: 'Demo Admin',
    date: '29 Oct, 2025',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop'
  },
  {
    id: 2,
    title: 'Hear What Our Customers Have to Say',
    author: 'Demo Admin',
    date: '29 Oct, 2025',
    image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=400&h=300&fit=crop'
  },
  {
    id: 3,
    title: 'Real-Life Testimonials from Satisfied Buyers',
    author: 'Demo Admin',
    date: '29 Oct, 2025',
    image: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=400&h=300&fit=crop'
  },
  {
    id: 4,
    title: 'Key Trends Set to Dominate the E-commerce Landscape',
    author: 'Demo Admin',
    date: '29 Oct, 2025',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'
  },
  {
    id: 5,
    title: "What's Driving the Evolution of E-commerce?",
    author: 'Demo Admin',
    date: '29 Oct, 2025',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop'
  }
])

const goToProduct = (id) => {
  router.push(`/productdetail?id=${id}`)
}

const goToCategory = (category) => {
  router.push(`/product?category=${category}`)
}

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})
</script>

<style scoped>
.home-page {
  background: #f9fafb;
  min-height: 100vh;
}

.home-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

/* Hero Slider */
.hero-slider {
  margin-bottom: 30px;
  border-radius: 8px;
  overflow: hidden;
}

.slider-container {
  position: relative;
  height: 450px;
}

.slide {
  position: relative;
  width: 100%;
  height: 100%;
}

.slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-content {
  position: absolute;
  bottom: 50px;
  left: 50px;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.slide-content h2 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.slide-content p {
  font-size: 1.2rem;
}

/* Features Banner */
.features-banner {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow-x: auto;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 15px;
  min-width: 200px;
}

.feature-item .material-icons {
  font-size: 3rem;
  color: #0068e1;
}

.feature-text h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.feature-text p {
  font-size: 0.85rem;
  color: #666;
  margin: 0;
}

/* Top Categories */
.top-categories {
  margin-bottom: 50px;
}

.section-header {
  text-align: center;
  margin-bottom: 30px;
}

.section-header h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 10px;
}

.section-header p {
  color: #666;
  max-width: 800px;
  margin: 0 auto;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
}

.category-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.category-card img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 15px;
}

.category-card h3 {
  font-size: 1rem;
  color: #333;
}

/* Best Deals */
.best-deals {
  margin-bottom: 50px;
}

.best-deals h2 {
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #333;
}

.products-carousel {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

/* Product Card */
.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.product-image {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #28a745;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.badge-discount {
  background: #28a745;
}

.badge-red {
  background: #dc3545;
}

.badge-new {
  background: #ffc107;
  color: #333;
}

.product-info {
  padding: 15px;
}

.product-info h3 {
  font-size: 0.95rem;
  margin-bottom: 10px;
  color: #333;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.stars {
  color: #ffc107;
  font-size: 0.9rem;
}

.reviews {
  font-size: 0.85rem;
  color: #666;
}

.price {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.current-price {
  font-size: 1.3rem;
  font-weight: 700;
  color: #0068e1;
}

.original-price {
  font-size: 1rem;
  color: #999;
  text-decoration: line-through;
}

.countdown {
  background: #f8f9fa;
  padding: 8px;
  border-radius: 4px;
  text-align: center;
  margin-bottom: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
}

.stock-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #666;
}

/* Tabs */
.tab-products {
  margin-bottom: 50px;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 2px solid #e5e7eb;
}

.tabs button {
  padding: 12px 24px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: #666;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
}

.tabs button.active {
  color: #0068e1;
  border-bottom-color: #0068e1;
}

.tabs button:hover {
  color: #0068e1;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

/* Hot Sellers */
.hot-sellers {
  margin-bottom: 50px;
}

.section-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 2px solid #e5e7eb;
}

.section-tabs button {
  padding: 12px 24px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: #666;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
}

.section-tabs button.active {
  color: #0068e1;
  border-bottom-color: #0068e1;
}

/* Brands */
.brands-section {
  margin-bottom: 50px;
  padding: 30px;
  background: white;
  border-radius: 8px;
}

.brands-carousel {
  display: flex;
  gap: 30px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.brands-carousel img {
  height: 60px;
  object-fit: contain;
  opacity: 0.6;
  transition: opacity 0.3s;
  cursor: pointer;
}

.brands-carousel img:hover {
  opacity: 1;
}

/* Blog Posts */
.blog-posts {
  margin-bottom: 50px;
}

.blog-posts .section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.blog-posts .section-header h2 {
  margin: 0;
}

.view-all {
  color: #0068e1;
  text-decoration: none;
  font-weight: 500;
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.blog-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s;
}

.blog-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.blog-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.blog-content {
  padding: 15px;
}

.blog-author,
.blog-date {
  font-size: 0.8rem;
  color: #666;
  margin-right: 10px;
}

.blog-content h3 {
  font-size: 0.95rem;
  color: #333;
  margin: 10px 0;
  height: 45px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.read-more {
  color: #0068e1;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 1200px) {
  .categories-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .products-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .blog-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .categories-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .products-carousel,
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .blog-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .features-banner {
    flex-direction: column;
  }

  .slide-content h2 {
    font-size: 1.5rem;
  }

  .tabs,
  .section-tabs {
    overflow-x: auto;
  }
}

@media (max-width: 480px) {
  .categories-grid,
  .products-carousel,
  .products-grid,
  .blog-grid {
    grid-template-columns: 1fr;
  }
}
</style>
