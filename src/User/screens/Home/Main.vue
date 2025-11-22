<template>
  <main class="main-content">
    <Menu />
    <Laptop />
    <div class="product-clock">
      <div class="containerx">
        <Phone />
        <div class="categories-container">
          <div
            v-for="category in ['watches', 'backpacks', 'shirts']"
            :key="category"
            class="category-section"
          >
            <div class="category-header">
              <h2 class="category-title">{{ titleCase(category) }}</h2>
              <span class="material-icons category-arrow">chevron_right</span>
            </div>
            <div class="products-list">
              <ProductCard2 :products="getProductsByCategory(category)" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <ProductCard3
      :listProducts="allProducts"
      :category="mobiles"
      :bannerClass="'banner-container-2'"
      :bannerImages="[
        'https://asia.fleetcart.envaysoft.com/storage/media/kSSkGodUfAKYy1UVZ8CicO8oay5PKO4L3DdEE9Tw.png',
        'https://asia.fleetcart.envaysoft.com/storage/media/VVyvSfw4dAZI57qelPofORurzNNc7rDlsxVbTO5m.png',
      ]"
    />
    <ProductCard3
      :listProducts="allProducts"
      :category="headphones"
      :bannerClass="'banner-container-3'"
      :bannerImages="[
        'https://asia.fleetcart.envaysoft.com/storage/media/QXeAdEOGLNAIj5Ntx7prAuuHRJmqNebRckNhV5WS.png',
        'https://asia.fleetcart.envaysoft.com/storage/media/tUZc6W65OryxcoIDT1umT0irIynod8t904Q7bRbG.png',
        'https://asia.fleetcart.envaysoft.com/storage/media/32Z48wigiMEXJZLDUN20Ea0f7NTMKZHf93qHFtLg.png',
      ]"
    />
    <RecentPosts />
  </main>
</template>

<script>
import Menu from './Menu.vue'
import Laptop from './Laptop.vue'
import Phone from './Phone.vue'
import ProductCard2 from './ProductCard2.vue'
import ProductCard3 from './ProductCard3.vue'
import RecentPosts from './RecentPosts.vue'

export default {
  name: 'Main',
  components: {
    Menu,
    Laptop,
    Phone,
    ProductCard2,
    ProductCard3,
    RecentPosts,
  },
  props: {
    products: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      categories: ['watches', 'backpacks', 'shirts'],
      mobiles: 'mobiles',
      headphones: 'headphones',
      allProducts: [
        {
          id: '1',
          name: 'MacBook Air M3 (13-inch, 256GB)',
          image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=300&fit=crop',
          price: 1099.0,
          originalPrice: 1199.0,
          discount: '-8%',
          rating: 4.7,
          reviewCount: 1823,
          category: 'laptops',
          isNew: true,
        },
        {
          id: '2',
          name: 'MacBook Pro M3 Pro (14-inch, 512GB)',
          image:
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop',
          price: 1999.0,
          rating: 4.8,
          reviewCount: 1456,
          category: 'laptops',
        },
        {
          id: '3',
          name: 'Dell XPS 13 Plus (Intel i7, 512GB SSD)',
          image:
            'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300&h=300&fit=crop',
          price: 1299.0,
          originalPrice: 1599.0,
          discount: '-19%',
          rating: 4.4,
          reviewCount: 892,
          category: 'laptops',
        },
        {
          id: '4',
          name: 'ASUS ROG Zephyrus G14 (AMD Ryzen 9, RTX 4060)',
          image:
            'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300&h=300&fit=crop',
          price: 1399.0,
          rating: 4.5,
          reviewCount: 734,
          category: 'laptops',
          isOutOfStock: true,
        },
        {
          id: '5',
          name: 'HP Spectre x360 (Intel i7, 1TB SSD)',
          image:
            'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&h=300&fit=crop',
          price: 1199.0,
          originalPrice: 1499.0,
          discount: '-20%',
          rating: 4.3,
          reviewCount: 567,
          category: 'laptops',
        },
        {
          id: '6',
          name: 'Lenovo ThinkPad X1 Carbon Gen 11',
          image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=300&fit=crop',
          price: 1599.0,
          rating: 4.6,
          reviewCount: 445,
          category: 'laptops',
          isNew: true,
        },
        {
          id: '7',
          name: 'Microsoft Surface Laptop 5 (Intel i7, 256GB)',
          image:
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop',
          price: 999.0,
          originalPrice: 1299.0,
          discount: '-23%',
          rating: 4.2,
          reviewCount: 623,
          category: 'laptops',
        },
        {
          id: '8',
          name: 'iPhone 15 Pro Max (256GB)',
          image:
            'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
          price: 1199.0,
          originalPrice: 1299.0,
          discount: '-8%',
          rating: 4.8,
          reviewCount: 2340,
          category: 'mobiles',
          isNew: true,
        },
        {
          id: '9',
          name: 'Samsung Galaxy S24 Ultra (512GB)',
          image:
            'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&h=300&fit=crop',
          price: 1099.99,
          rating: 4.7,
          reviewCount: 1890,
          category: 'mobiles',
        },
        {
          id: '10',
          name: 'Google Pixel 8 Pro (128GB)',
          image:
            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop',
          price: 699.0,
          originalPrice: 899.0,
          discount: '-22%',
          rating: 4.5,
          reviewCount: 1245,
          category: 'mobiles',
        },
        {
          id: '11',
          name: 'OnePlus 12 (256GB)',
          image:
            'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=300&h=300&fit=crop',
          price: 799.0,
          rating: 4.4,
          reviewCount: 876,
          category: 'mobiles',
          isOutOfStock: true,
        },
        {
          id: '12',
          name: 'Xiaomi 14 Pro (512GB)',
          image:
            'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=300&fit=crop',
          price: 649.99,
          originalPrice: 799.99,
          discount: '-19%',
          rating: 4.3,
          reviewCount: 654,
          category: 'mobiles',
        },
        {
          id: '13',
          name: 'iPhone 14 (128GB)',
          image:
            'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&h=300&fit=crop',
          price: 599.0,
          originalPrice: 799.0,
          discount: '-25%',
          rating: 4.6,
          reviewCount: 3210,
          category: 'mobiles',
        },
        {
          id: '14',
          name: 'Samsung Galaxy Z Fold 5 (256GB)',
          image:
            'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=300&h=300&fit=crop',
          price: 1399.99,
          originalPrice: 1799.99,
          discount: '-22%',
          rating: 4.2,
          reviewCount: 567,
          category: 'mobiles',
          isNew: true,
        },
        {
          id: '15',
          name: 'Apple AirPods Pro (2nd Generation)',
          image:
            'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=300&h=300&fit=crop',
          price: 249.0,
          originalPrice: 279.0,
          discount: '-11%',
          rating: 4.5,
          reviewCount: 1250,
          category: 'headphones',
          isNew: true,
        },
        {
          id: '16',
          name: 'Sony WH-1000XM5 Wireless Headphones',
          image:
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop',
          price: 349.99,
          rating: 4.8,
          reviewCount: 890,
          category: 'headphones',
        },
        {
          id: '17',
          name: 'Bose QuietComfort Earbuds',
          image:
            'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop',
          price: 199.0,
          originalPrice: 279.0,
          discount: '-29%',
          rating: 4.3,
          reviewCount: 567,
          category: 'headphones',
        },
        {
          id: '18',
          name: 'Samsung Galaxy Buds2 Pro',
          image:
            'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=300&fit=crop',
          price: 149.99,
          rating: 4.2,
          reviewCount: 423,
          category: 'headphones',
          isOutOfStock: true,
        },
        {
          id: '19',
          name: 'JBL Live 660NC Wireless Headphones',
          image:
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=300&fit=crop',
          price: 89.95,
          originalPrice: 149.95,
          discount: '-40%',
          rating: 4.1,
          reviewCount: 312,
          category: 'headphones',
        },
        {
          id: '20',
          name: 'Audio-Technica ATH-M50xBT2',
          image:
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
          price: 179.0,
          rating: 4.6,
          reviewCount: 756,
          category: 'headphones',
        },
        {
          id: '21',
          name: 'Sennheiser Momentum 4 Wireless',
          image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=300&h=300&fit=crop',
          price: 299.95,
          originalPrice: 379.95,
          discount: '-21%',
          rating: 4.7,
          reviewCount: 445,
          category: 'headphones',
        },
        {
          id: '22',
          name: "Fanmis Men's Luxury Analog Quartz Gold Wrist Watches",
          image:
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
          price: 15.92,
          originalPrice: 17.99,
          rating: 4.0,
          reviewCount: 125,
          category: 'watches',
        },
        {
          id: '23',
          name: "Fossil Women's Gen 4 Venture HR Stainless Steel Touchscreen",
          image:
            'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=300&h=300&fit=crop',
          price: 299.0,
          rating: 4.2,
          reviewCount: 234,
          category: 'watches',
        },
        {
          id: '24',
          name: "Fossil Men's Sport Metal and Silicone Touchscreen",
          image:
            'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=300&h=300&fit=crop',
          price: 99.0,
          originalPrice: 275.0,
          rating: 4.1,
          reviewCount: 156,
          category: 'watches',
        },
        {
          id: '25',
          name: 'Michael Kors Access Gen 3 Sofie Touchscreen Smartwatch',
          image:
            'https://images.unsplash.com/photo-1617043983671-adaadcaa2460?w=300&h=300&fit=crop',
          price: 299.0,
          rating: 4.3,
          reviewCount: 189,
          category: 'watches',
        },
        {
          id: '26',
          name: 'Apple Watch Series 5 (GPS, 40mm) - Gold Aluminum',
          image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=300&h=300&fit=crop',
          price: 650.0,
          rating: 4.6,
          reviewCount: 1456,
          category: 'watches',
        },
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
          id: '34',
          name: 'Backpack / School Bag For Teenagers',
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
          price: 11.99,
          rating: 4.0,
          reviewCount: 89,
          category: 'backpacks',
        },
        {
          id: '35',
          name: 'Puimentiua Men Backpack Laptop Bag Brand',
          image:
            'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=300&h=300&fit=crop',
          price: 10.99,
          originalPrice: 14.79,
          rating: 4.2,
          reviewCount: 134,
          category: 'backpacks',
        },
        {
          id: '36',
          name: 'WENYUJH 2019 New Large-capacity Student Schoolbag',
          image:
            'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=300&h=300&fit=crop',
          price: 12.62,
          rating: 3.9,
          reviewCount: 67,
          category: 'backpacks',
        },
        {
          id: '37',
          name: 'Fashion Woman Bag Female Hand Tote Bag',
          image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=300&fit=crop',
          price: 12.73,
          originalPrice: 14.98,
          rating: 4.1,
          reviewCount: 98,
          category: 'backpacks',
        },
        {
          id: '38',
          name: 'Women Oxford Backpack For Girls',
          image:
            'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=300&h=300&fit=crop',
          price: 13.99,
          rating: 4.3,
          reviewCount: 156,
          category: 'backpacks',
        },
        {
          id: '39',
          name: 'iPad Pro 12.9-inch (256GB)',
          image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop',
          price: 1099.0,
          originalPrice: 1199.0,
          discount: '-8%',
          rating: 4.7,
          reviewCount: 1234,
          category: 'tablets',
          isNew: true,
        },
        {
          id: '40',
          name: 'Samsung Galaxy Tab S9 (128GB)',
          image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=300&h=300&fit=crop',
          price: 799.99,
          rating: 4.5,
          reviewCount: 567,
          category: 'tablets',
        },
      ],
    }
  },
  methods: {
    getProductsByCategory(category) {
      return this.allProducts.filter((product) => product.category === category)
    },
    titleCase(str) {
      return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      })
    },
  },
}
</script>


