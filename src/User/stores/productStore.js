// src/User/stores/productStore.js
import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { searchProducts } from '@/api/productApi.js';
import { getCategories } from '@/api/categoryApi.js';

export const useProductStore = defineStore('product', () => {
  // === STATE ===
  const products = ref([]);
  const latestProducts = ref([]);
  const categories = ref([]);
  const isLoading = ref(false);
  const isLoadingCategories = ref(false);
  const totalPages = ref(0);
  const totalElements = ref(0);
  const currentPage = ref(0);
  const pageSize = ref(20);
  const sortBy = ref('updatedAt,desc');
  const priceRange = ref([0, 100000000]);
  const selectedCategories = ref([]);
  const lastFetched = ref(null);
  const CACHE_DURATION = 3 * 60 * 1000;

  // === COMPUTED ===
  const hasNextPage = computed(() => currentPage.value < totalPages.value - 1);
  const hasPrevPage = computed(() => currentPage.value > 0);

  // === HÀM CẬP NHẬT LATEST ===
  const updateLatestProducts = () => {
    const newOnes = products.value.filter(p => p.badge === 'New').map(p => ({...p,
        price: p.price, maxPrice: p.maxPrice })).slice(0, 4);
    latestProducts.value.splice(0, latestProducts.value.length, ...newOnes);
  };

  // === ACTIONS ===
  const fetchCategories = async () => {
    if (categories.value.length > 0) return;
    isLoadingCategories.value = true;
    try {
      console.log('Fetching categories...');
      const res = await getCategories();
      console.log('Categories API response:', res.data);
      if (res.data.code !== 200) throw new Error(res.data.message);

      const raw = res.data.result;
      const map = {};
      raw.forEach(cat => {
        map[cat.id] = { ...cat, isOpen: false, subcategories: [] };
      });
      raw.forEach(cat => {
        if (cat.parent && map[cat.parent]) {
          map[cat.parent].subcategories.push({ id: cat.id, name: cat.name });
        }
      });

      const built = Object.values(map)
        .filter(cat => !cat.parent)
        .map(cat => ({
          id: cat.id,
          name: cat.name,
          isOpen: false,
          subcategories: cat.subcategories
        }));

      categories.value.splice(0, categories.value.length, ...built);
      console.log('Categories assigned:', categories.value.length);
    } catch (error) {
      console.error('Lỗi tải danh mục:', error);
    } finally {
      isLoadingCategories.value = false;
    }
  };

  const fetchProducts = async (page = 0, size = pageSize.value, force = false) => {
    const cacheKey = `${page}-${size}-${sortBy.value}-${selectedCategories.value.join(',')}-${priceRange.value.join(',')}`;
    const now = Date.now();

    if (!force && lastFetched.value?.key === cacheKey && now - lastFetched.value.ts < CACHE_DURATION) {
      console.log('Using cache');
      return;
    }

    isLoading.value = true;
    try {
      console.log('Fetching products:', { page, size, sortBy: sortBy.value });
      const params = { page, size, sort: sortBy.value };
      if (selectedCategories.value.length > 0) params.categories = selectedCategories.value.join(',');
      if (priceRange.value[0] > 0) params.minPrice = priceRange.value[0];
      if (priceRange.value[1] < 100000000) params.maxPrice = priceRange.value[1];

      const res = await searchProducts(params);
      console.log('Products API response:', res.data);
      if (res.data.code !== 200) throw new Error(res.data.message);

      const data = res.data.result;
      const today = new Date().toISOString().split('T')[0];

      const mapped = data.content.map(p => {
        const isNew = p.newFrom && p.newTo
          ? today >= p.newFrom && today <= p.newTo
          : false;

        return {
          id: p.id,
          name: p.name,
          price: p.minPrice,
          maxPrice: p.maxPrice,
          originalPrice: null,
          badge: !p.inStock ? 'Out of Stock' : (isNew ? 'New' : null),
          badgeColor: !p.inStock ? 'red' : (isNew ? 'green' : null),
          image: p.thumbnail || '/placeholder.png',
          isLiked: isInWishlist(p.id)
        };
      });

      products.value.splice(0, products.value.length, ...mapped);
      console.log('Products assigned:', products.value.length);

      updateLatestProducts();

      totalPages.value = data.totalPages;
      totalElements.value = data.totalElements;
      currentPage.value = page;
      pageSize.value = size;
      lastFetched.value = { key: cacheKey, ts: now };
    } catch (error) {
      console.error('Lỗi tải sản phẩm:', error);
    } finally {
      isLoading.value = false;
    }
  };

  // === TỰ ĐỘNG CẬP NHẬT KHI LỌC ===
  watch([priceRange, selectedCategories, sortBy, currentPage], () => {
    updateLatestProducts();
  }, { deep: true });

  // === CÁC HÀM ===
  const setSort = (sort) => {
    sortBy.value = sort;
    currentPage.value = 0;
    fetchProducts(0, pageSize.value, true);
  };

  const setPageSize = (size) => {
    pageSize.value = size;
    currentPage.value = 0;
    fetchProducts(0, size, true);
  };

  const setPriceRange = (min, max) => {
    priceRange.value = [min, max];
    currentPage.value = 0;
    fetchProducts(0, pageSize.value, true);
  };

  const toggleCategory = (catId) => {
    const idx = selectedCategories.value.indexOf(catId);
    if (idx > -1) {
      selectedCategories.value.splice(idx, 1);
    } else {
      selectedCategories.value.push(catId);
    }
    currentPage.value = 0;
    fetchProducts(0, pageSize.value, true);
  };

  const changePage = (page) => {
    if (page >= 0 && page < totalPages.value) {
      fetchProducts(page, pageSize.value);
    }
  };

  // === WISHLIST ===
  const isInWishlist = (id) => {
    const wishlist = JSON.parse(localStorage.getItem('userWishlist') || '[]');
    return wishlist.some(i => i.id === id);
  };

  const toggleLike = (product) => {
    product.isLiked = !product.isLiked;
    let wishlist = JSON.parse(localStorage.getItem('userWishlist') || '[]');

    if (product.isLiked) {
      const item = {
        id: product.id,
        name: product.name,
        price: product.price.toFixed(2),
        image: product.image,
        availability: product.badge === 'Out of Stock' ? 'Out of Stock' : 'In Stock',
        availabilityClass: product.badge === 'Out of Stock' ? 'out-of-stock' : 'in-stock'
      };
      if (!wishlist.some(i => i.id === item.id)) wishlist.push(item);
    } else {
      wishlist = wishlist.filter(i => i.id !== product.id);
    }

    localStorage.setItem('userWishlist', JSON.stringify(wishlist));
    window.dispatchEvent(new Event('wishlistChanged'));
  };

  return {
    products, latestProducts, categories,
    isLoading, isLoadingCategories,
    totalPages, totalElements, currentPage,
    pageSize, sortBy, priceRange, selectedCategories,
    hasNextPage, hasPrevPage,
    fetchCategories, fetchProducts,
    setSort, setPageSize, setPriceRange,
    toggleCategory, changePage, toggleLike
  };
});
