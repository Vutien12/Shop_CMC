<template>
  <div class="home-page">
    <Header />
    <Loading v-if="isLoading" />
    <div v-else class="home-container">
      <!-- Hero Slider -->
      <section class="hero-section">
        <div class="hero-slider">
          <div class="slider-container">
            <div class="slide active">
              <img src="https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&h=600&fit=crop" alt="VR Headset">
              <div class="slide-content">
                <h2>3D Virtual Reality</h2>
                <p>VR 3D glasses with remote control gamepad<br>at best price</p>
                <div class="slider-dots">
                  <span class="dot"></span>
                  <span class="dot active"></span>
                  <span class="dot"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="hero-banners">
          <div class="banner-card">
            <div class="banner-content">
              <span class="banner-price">Starting: <strong>$79</strong></span>
              <h3>Unio <strong>Leather</strong><br>Bags</h3>
              <button class="banner-btn">Shop Now</button>
            </div>
            <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop" alt="Leather Bags">
            <div class="banner-circle"></div>
          </div>
          <div class="banner-card">
            <div class="banner-content">
              <span class="banner-discount">Upto 50% Off</span>
              <h3>I Phone <strong>6+</strong><br><strong>32</strong> GB</h3>
              <button class="banner-btn">Shop Now</button>
            </div>
            <img src="https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&h=300&fit=crop" alt="iPhone">
            <div class="banner-circle"></div>
          </div>
        </div>
      </section>

      <!-- Features Banner -->
      <section class="features-banner">
        <div class="feature-item">
          <div class="feature-icon">
            <span class="material-icons">support_agent</span>
          </div>
          <div class="feature-text">
            <h4>24/7 SUPPORT</h4>
            <p>Support every time</p>
          </div>
        </div>
        <div class="feature-divider"></div>
        <div class="feature-item">
          <div class="feature-icon">
            <span class="material-icons">payment</span>
          </div>
          <div class="feature-text">
            <h4>ACCEPT PAYMENT</h4>
            <p>Visa, Paypal, Master</p>
          </div>
        </div>
        <div class="feature-divider"></div>
        <div class="feature-item">
          <div class="feature-icon">
            <span class="material-icons">lock</span>
          </div>
          <div class="feature-text">
            <h4>SECURED PAYMENT</h4>
            <p>100% secured</p>
          </div>
        </div>
        <div class="feature-divider"></div>
        <div class="feature-item">
          <div class="feature-icon">
            <span class="material-icons">local_shipping</span>
          </div>
          <div class="feature-text">
            <h4>FREE SHIPPING</h4>
            <p>Order over $100</p>
          </div>
        </div>
        <div class="feature-divider"></div>
        <div class="feature-item">
          <div class="feature-icon">
            <span class="material-icons">keyboard_return</span>
          </div>
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
        <div class="categories-tabs">
          <div class="category-tab" :class="{ active: activeCategory === 'laptops' }" @click="activeCategory = 'laptops'">
            <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=80&h=80&fit=crop" alt="Laptops">
            <h3>Laptops</h3>
          </div>
          <div class="category-tab" :class="{ active: activeCategory === 'mobiles' }" @click="activeCategory = 'mobiles'">
            <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=80&h=80&fit=crop" alt="Mobiles">
            <h3>Mobiles</h3>
          </div>
          <div class="category-tab" :class="{ active: activeCategory === 'tablets' }" @click="activeCategory = 'tablets'">
            <img src="https://images.unsplash.com/photo-1561154464-82e9adf32764?w=80&h=80&fit=crop" alt="Tablets">
            <h3>Tablets</h3>
          </div>
          <div class="category-tab" :class="{ active: activeCategory === 'watches' }" @click="activeCategory = 'watches'">
            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop" alt="Watches">
            <h3>Watches</h3>
          </div>
          <div class="category-tab" :class="{ active: activeCategory === 'fashion' }" @click="activeCategory = 'fashion'">
            <img src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=80&h=80&fit=crop" alt="Men's Fashion">
            <h3>Men's Fashion</h3>
          </div>
          <div class="category-tab" :class="{ active: activeCategory === 'televisions' }" @click="activeCategory = 'televisions'">
            <img src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=80&h=80&fit=crop" alt="Televisions">
            <h3>Televisions</h3>
          </div>
        </div>

        <div class="category-products">
          <div class="products-scroll">
            <div class="product-card" v-for="product in categoryProducts" :key="product.id">
              <div class="product-image">
                <img :src="product.image" :alt="product.name">
                <span class="badge badge-red" v-if="product.outOfStock">Out of Stock</span>
                <span class="badge badge-green" v-if="product.discount">{{ product.discount }}</span>
                <span class="badge badge-blue" v-if="product.isNew">New</span>
                <div class="product-actions">
                  <button class="action-btn" @click.stop="addToCart(product)" title="Add to cart">
                    <span class="material-icons">shopping_cart</span>
                  </button>
                  <button class="action-btn" @click.stop="goToProduct(product.id)" title="Quick view">
                    <span class="material-icons">visibility</span>
                  </button>
                </div>
              </div>
              <div class="product-info">
                <h3>{{ product.name }}</h3>
                <div class="rating">
                  <span class="stars">★★★★★</span>
                  <span class="reviews">{{ product.reviews }} Review</span>
                </div>
                <div class="price">
                  <span class="original-price" v-if="product.originalPrice">${{ product.originalPrice }}</span>
                  <span class="current-price">${{ product.price }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="carousel-dots">
            <span class="dot active"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      </section>

      <!-- Promotional Banners -->
      <section class="promo-banners">
        <div class="promo-card">
          <img src="https://asia.fleetcart.envaysoft.com/storage/media/SnNz5B0YIEGCw1OdLhFJbqF7hfCNc80adaLCdqOE.png" alt="Comfort Chair">
        </div>
        <div class="promo-card">
          <img src="https://asia.fleetcart.envaysoft.com/storage/media/3YFgcINuEaLyLvy6QjxKwKVDMALI9qzmXEN7Vqx3.png" alt="Bedroom Products">
        </div>
        <div class="promo-card">
          <img src="https://asia.fleetcart.envaysoft.com/storage/media/pmQxhyWNznFCMZvc4KTv4HNk4RfG3eBlNqR0xsCt.png" alt="Galaxy S9">
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
    <Chatbot />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import Footer from '@/User/components/Footer/Footer.vue'
import Header from '@/User/components/Header1/Header.vue';
import Loading from '@/User/components/Loading/Loading.vue'
import Chatbot from '@/User/components/Chatbot/Chatbot.vue'

const router = useRouter()
const isLoading = ref(true)
const activeTab = ref('mobiles')
const sellersTab = ref('latest')
const activeCategory = ref('laptops')

const categoryProducts = computed(() => {
  return [
    {
      id: 1,
      name: 'Apple 2023 iMac (24-Inch)',
      price: 1349.00,
      image: 'https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?w=300&h=300&fit=crop',
      reviews: 0
    },
    {
      id: 2,
      name: 'Apple 2023 MacBook Pro (14-inch)',
      price: 1499.00,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop',
      reviews: 0
    },
    {
      id: 3,
      name: 'MSI Gaming Core i7 8Th Gen 15.6-Inch',
      price: 760.00,
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300&h=300&fit=crop',
      reviews: 0
    },
    {
      id: 4,
      name: 'New Apple Mac Mini (3.6GHz Quad-core...',
      price: 759.00,
      image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=300&h=300&fit=crop',
      reviews: 0,
      outOfStock: true
    },
    {
      id: 5,
      name: 'LG gram Laptop - 13.3" Full HD Display, Intel...',
      price: 2135.54,
      originalPrice: 2426.75,
      discount: '-12%',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop',
      reviews: 0
    },
    {
      id: 6,
      name: 'Razer Blade Stealth 13.3" QHD+ Intel Quad...',
      price: 1199.77,
      image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=300&h=300&fit=crop',
      reviews: 0,
      isNew: true
    },
    {
      id: 7,
      name: 'Razer Blade - Worlds Smallest 15.6in...',
      price: 1500.00,
      originalPrice: 1699.99,
      discount: '-12%',
      image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&h=300&fit=crop',
      reviews: 0
    }
  ]
})

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

const addToCart = (product) => {
  console.log('Added to cart:', product)
  // Add your cart logic here
}

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})
</script>

<style scoped src="./Home.css"></style>


