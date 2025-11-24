<template>
  <div class="containerx">
    <div class="products-section" style="margin-top: 40px">
      <div class="products-grid">
        <ProductCard v-for="p in shirts.slice(0, 6)" :key="p.id" :product="p" />
      </div>
    </div>
  </div>
  <div class="promotional-banner">
    <div class="banner-container">
      <div
        v-for="item in bannerItems"
        :key="trackByItem(item)"
        class="banner-item"
        :style="{ backgroundImage: 'url(' + item.image + ')' }"
      ></div>
    </div>
  </div>
  <div class="containerx">
    <div class="products-section" style="margin-top: 40px">
      <div class="products-grid">
        <ProductCard v-for="p in shirts.slice(0, 6)" :key="p.id" :product="p" />
      </div>
    </div>

    <section class="features" style="margin-top: 40px">
      <div class="features-grid">
        <div class="feature-item" v-for="feature in features" :key="feature.id">
          <span class="material-icons feature-icon">{{ feature.icon }}</span>
          <div class="feature-content">
            <h4 class="feature-title">{{ feature.title }}</h4>
            <p class="feature-desc">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ProductCard from './ProductCard.vue'

export default {
  name: 'Laptop',
  components: {
    ProductCard,
  },
  data() {
    return {
      bannerItems: [
        {
          id: '1',
          title: 'Comfort',
          highlightText: 'Chair',
          description: 'Official Chair',
          image:
            'https://asia.fleetcart.envaysoft.com/storage/media/SnNz5B0YIEGCw1OdLhFJbqF7hfCNc80adaLCdqOE.png',
          backgroundColor: '#f8f9fa',
          textColor: '#6c757d',
          titleColor: '#2c3e50',
        },
        {
          id: '2',
          title: 'Adjust your bedroom with',
          highlightText: 'comfortable',
          description: 'products',
          image:
            'https://asia.fleetcart.envaysoft.com/storage/media/3YFgcINuEaLyLvy6QjxKwKVDMALI9qzmXEN7Vqx3.png',
          backgroundColor: '#ffffff',
          textColor: '#5a6c7d',
          titleColor: '#2c3e50',
        },
        {
          id: '3',
          title: 'Galaxy',
          highlightText: 'S9 | S9+',
          description: 'The reimagined',
          image:
            'https://asia.fleetcart.envaysoft.com/storage/media/pmQxhyWNznFCMZvc4KTv4HNk4RfG3eBlNqR0xsCt.png',
          backgroundColor: '#667eea',
          textColor: '#ffffff',
          titleColor: '#ffffff',
        },
      ],
      shirts: [
        {
          id: '27',
          name: 'Uniqlo Airism Cotton Crew Neck T-Shirt',
          image:
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
          price: 12.9,
          originalPrice: 14.9,
          discount: '-13%',
          rating: 4.3,
          reviewCount: 892,
          category: 'shirts',
        },
        {
          id: '28',
          name: 'Nike Dri-FIT Training T-Shirt',
          image:
            'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=300&h=300&fit=crop',
          price: 25.0,
          rating: 4.5,
          reviewCount: 634,
          category: 'shirts',
          isNew: true,
        },
        {
          id: '29',
          name: 'Adidas 3-Stripes Essential T-Shirt',
          image:
            'https://images.unsplash.com/photo-1583743814966-8936f37f13fa?w=300&h=300&fit=crop',
          price: 18.99,
          originalPrice: 24.99,
          discount: '-24%',
          rating: 4.2,
          reviewCount: 456,
          category: 'shirts',
        },
        {
          id: '30',
          name: 'H&M Premium Cotton Polo Shirt',
          image:
            'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=300&h=300&fit=crop',
          price: 19.99,
          rating: 4.0,
          reviewCount: 278,
          category: 'shirts',
          isOutOfStock: true,
        },
        {
          id: '31',
          name: 'Zara Oversized Cotton T-Shirt',
          image:
            'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=300&h=300&fit=crop',
          price: 15.95,
          originalPrice: 19.95,
          discount: '-20%',
          rating: 4.1,
          reviewCount: 345,
          category: 'shirts',
        },
        {
          id: '32',
          name: 'Champion Classic Logo T-Shirt',
          image:
            'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=300&h=300&fit=crop',
          price: 22.0,
          rating: 4.4,
          reviewCount: 567,
          category: 'shirts',
        },
        {
          id: '33',
          name: 'Ralph Lauren Classic Fit Polo',
          image:
            'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=300&fit=crop',
          price: 89.5,
          originalPrice: 125.0,
          discount: '-28%',
          rating: 4.6,
          reviewCount: 789,
          category: 'shirts',
          isNew: true,
        },
      ],
      features: [
        {
          icon: 'support_agent',
          title: '24/7 SUPPORT',
          description: 'Support every time',
        },
        {
          icon: 'payment',
          title: 'ACCEPT PAYMENT',
          description: 'Visa, Paypal, Master',
        },
        {
          icon: 'security',
          title: 'SECURED PAYMENT',
          description: '100% secured',
        },
        {
          icon: 'local_shipping',
          title: 'FREE SHIPPING',
          description: 'Order over $100',
        },
        {
          icon: 'keyboard_return',
          title: '30 DAYS RETURN',
          description: '30 days guarantee',
        },
      ],
    }
  },
  methods: {
    trackByItem(item) {
      return item.id
    },
  },
}
</script>


