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
      const res = await getCategories();
      if (res.data.code !== 200) throw new Error(res.data.message);

      const tree = buildCategoryTree(res.data.result || []);
      categories.value.splice(0, categories.value.length, ...tree);
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
      if (selectedCategories.value.length > 0) {
        params.categoryIds = selectedCategories.value;
      }
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

      totalPages.value = data.totalPages || 0;
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

  const buildCategoryTree = (flat = []) => {
    const map = new Map();
    flat.forEach((cat) => {
      map.set(cat.id, {
        id: cat.id,
        parentId: cat.parentId,
        name: cat.name,
        isActive: cat.isActive,
        isOpen: false,
        subcategories: []
      });
    });

    const roots = [];
    map.forEach((cat) => {
      if (cat.parentId && map.has(cat.parentId)) {
        map.get(cat.parentId).subcategories.push(cat);
      } else if (!cat.parentId) {
        roots.push(cat);
      }
    });

    return roots;
  };

  const findCategoryNode = (id, nodes = []) => {
    for (const node of nodes) {
      if (node.id === id) return node;
      const found = findCategoryNode(id, node.subcategories || []);
      if (found) return found;
    }
    return null;
  };

  const toggleCategoryOpen = (catId) => {
    const node = findCategoryNode(catId, categories.value);
    if (node) {
      node.isOpen = !node.isOpen;
    }
  };

  const getDescendantIds = (node) => {
    if (!node) return [];
    const ids = [node.id];
    (node.subcategories || []).forEach((child) => {
      ids.push(...getDescendantIds(child));
    });
    return ids;
  };

  const toggleCategory = (catId) => {
    const node = findCategoryNode(catId, categories.value);
    const idsToSelect = node ? getDescendantIds(node) : [catId];
    const current = [...selectedCategories.value].sort().join(',');
    const incoming = [...idsToSelect].sort().join(',');

    if (current === incoming) {
      selectedCategories.value = [];
    } else {
      selectedCategories.value = idsToSelect;
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
    toggleCategory, toggleCategoryOpen, changePage, toggleLike
  };
});
