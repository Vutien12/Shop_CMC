<template>
  <div class="containerx">
    <div class="content-wrapper">
      <aside class="sidebar">
        <div class="category-menu">
          <div class="category-item" v-for="category in categories" :key="category.id">
            <font-awesome-icon :icon="category.icon" />
            <span>{{ category.name }}</span>
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
          <font-awesome-icon :icon="feature.icon" class="feature-icon" />
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
                <img :src="category.icon" :alt="category.name" />
              </div>
              <span class="category-name">{{ category.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Menu',
  data() {
    return {
      activeCategory: null,
      categories: [],
      features: [],
      showcaseCategories: [],
      products: [],
    }
  },
  computed: {
    filteredProducts() {
      if (!this.activeCategory) {
        return this.products
      }
      return this.products.filter((product) => product.categoryId === this.activeCategory)
    },
  },
  methods: {
    selectCategory(categoryId) {
      this.activeCategory = categoryId
    },
    getStarArray(rating) {
      return [1, 2, 3, 4, 5]
    },
    trackByCategory(index, category) {
      return category.id
    },
    trackByProduct(index, product) {
      return product.id
    },
  },
  mounted() {
    this.categories = [
      { id: '1', name: 'Consumer Electronics', icon: 'laptop' },
      { id: '2', name: 'Television', icon: 'tv' },
      { id: '3', name: 'Watches', icon: 'clock' },
      { id: '4', name: 'Fashion', icon: 'tshirt' },
      { id: '5', name: 'Backpacks', icon: 'bag-shopping' },
      { id: '6', name: 'Tablets', icon: 'tablet' },
      { id: '7', name: 'Headphones', icon: 'headphones' },
      { id: '8', name: 'Hot Sale', icon: 'fire' },
      { id: '9', name: 'Shoe', icon: 'running' },
      { id: '10', name: 'All Categories', icon: 'th-large' },
    ]
    this.features = [
      {
        icon: 'headset',
        title: '24/7 SUPPORT',
        description: 'Support every time',
      },
      {
        icon: 'credit-card',
        title: 'ACCEPT PAYMENT',
        description: 'Visa, Paypal, Master',
      },
      {
        icon: 'shield-alt',
        title: 'SECURED PAYMENT',
        description: '100% secured',
      },
      {
        icon: 'truck',
        title: 'FREE SHIPPING',
        description: 'Order over $100',
      },
      {
        icon: 'undo',
        title: '30 DAYS RETURN',
        description: '30 days guarantee',
      },
    ]
    this.showcaseCategories = [
      {
        id: 'laptops',
        name: 'Laptops',
        icon: 'https://asia.fleetcart.envaysoft.com/storage/media/2cZfkz85nXxlSTySz6R8m34u5UQLfiRQVyKjF8hm.png',
      },
      {
        id: 'mobiles',
        name: 'Mobiles',
        icon: 'https://asia.fleetcart.envaysoft.com/storage/media/UAP07Ygha9iXNfG1Rh6DYWrwVQ3HfkuqetLaLc6M.jpeg',
      },
      {
        id: 'tablets',
        name: 'Tablets',
        icon: 'https://asia.fleetcart.envaysoft.com/storage/media/dzeszBwEcUnjWoixHvGYJD7uD2j6BWsy7TBK7tcJ.jpeg',
      },
      {
        id: 'watches',
        name: 'Watches',
        icon: 'https://asia.fleetcart.envaysoft.com/storage/media/0Ae4WkaGunLTgTDf24i2ui0hhGB2kZPRVS5k7rn8.jpeg',
      },
      {
        id: 'fashion',
        name: "Men's Fashion",
        icon: 'https://asia.fleetcart.envaysoft.com/storage/media/4vy12UtugCqB76AoWvy0cAHlzKb1HZsklmkOQ6hK.jpeg',
      },
      {
        id: 'televisions',
        name: 'Televisions',
        icon: 'https://asia.fleetcart.envaysoft.com/storage/media/sjBHD1SNqe4BgkqmvqmWAB7U759HOZPVJRvV1Qbr.png',
      },
    ]
    this.products = []
  },
}
</script>


