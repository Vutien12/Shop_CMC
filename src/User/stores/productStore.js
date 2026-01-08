// src/User/stores/productStore.js
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { searchProducts } from '@/api/productApi';
import { getCategories } from '@/api/categoryApi';
import { calculateProductDiscount, getBestSellingPrice } from '@/Utils/discountUtils';

export const useProductStore = defineStore('productStore', () => {
  // === STATE ===
  const products = ref([]);
  const latestProducts = ref([]);
  const latestProductsExpanded = ref(false); // Track if showing all latest products
  const categories = ref([]);
  const isLoading = ref(false);
  const isLoadingCategories = ref(false);
  const isLoadingLatest = ref(false);
  const totalPages = ref(0);
  const totalElements = ref(0);
  const currentPage = ref(0);
  const pageSize = ref(20);
  const sortBy = ref('updatedAt,desc');
  const priceRange = ref([0, 100000000]);
  const selectedCategories = ref([]);
  const keyword = ref('');
  const lastFetched = ref(null);
  const CACHE_DURATION = 3 * 60 * 1000;

  // === COMPUTED ===
  const hasNextPage = computed(() => currentPage.value < totalPages.value - 1);
  const hasPrevPage = computed(() => currentPage.value > 0);
  const displayedLatestProducts = computed(() => {
    return latestProductsExpanded.value ? latestProducts.value : latestProducts.value.slice(0, 5);
  });
  const hasMoreLatestProducts = computed(() => latestProducts.value.length > 5);

  // === FETCH LATEST PRODUCTS (INDEPENDENT) ===
  const fetchLatestProducts = async () => {
    isLoadingLatest.value = true;
    try {
      const now = new Date();
      const formatLocalDateTime = (date) => {
        const pad = (n) => String(n).padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
      };

      const params = {
        page: 0,
        size: 20,
        sort: 'updatedAt,desc',
        newFrom: '2000-01-01T00:00:00',
        newTo: formatLocalDateTime(now) // Format without Z
      };

      const res = await searchProducts(params);
      if (res.code !== 200) throw new Error(res.message);

      const data = res.result;
      const today = new Date().toISOString().split('T')[0];

      // Map and filter products that are currently "new"
      const mapped = data.content
        .filter(p => {
          // Double check: product must have newFrom/newTo and today must be within range
          if (!p.newFrom || !p.newTo) return false;
          return today >= p.newFrom && today <= p.newTo;
        })
        .map(p => {
          const bestSellingPrice = getBestSellingPrice(p);
          return {
            id: p.id,
            name: p.name,
            price: bestSellingPrice || p.minPrice,
            maxPrice: p.maxPrice,
            image: p.thumbnail?.url || p.thumbnail || '/placeholder.png'
          };
        });

      latestProducts.value = mapped;
      console.log('Latest products loaded:', latestProducts.value.length);
    } catch (error) {
      console.error('Error loading latest products:', error);
      latestProducts.value = [];
    } finally {
      isLoadingLatest.value = false;
    }
  };

  const toggleLatestProductsExpanded = () => {
    latestProductsExpanded.value = !latestProductsExpanded.value;
  };

  // === ACTIONS ===
  const fetchCategories = async () => {
    if (categories.value.length > 0 || isLoadingCategories.value) {
      console.log('[fetchCategories] Skipped - already loaded or loading');
      return;
    }

    isLoadingCategories.value = true;
    try {
      const res = await getCategories();
      console.log('Categories API response:', res);
      if (res.code !== 200) throw new Error(res.message);

      const tree = buildCategoryTree(res.result || []);
      categories.value.splice(0, categories.value.length, ...tree);
      console.log('Categories loaded:', categories.value.length);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      isLoadingCategories.value = false;
    }
  };

  const fetchProducts = async (page = 0, size = pageSize.value, force = false) => {
    const cacheKey = `${page}-${size}-${sortBy.value}-${selectedCategories.value.join(',')}-${priceRange.value.join(',')}-${keyword.value}`;
    const now = Date.now();

    if (!force && lastFetched.value?.key === cacheKey && now - lastFetched.value.ts < CACHE_DURATION) {
      console.log('Using cache');
      return;
    }

    isLoading.value = true;
    try {
      console.log('Fetching products:', { page, size, sortBy: sortBy.value, keyword: keyword.value });
      const params = { page, size, sort: sortBy.value };
      if (keyword.value) {
        params.keyword = keyword.value;
      }
      if (selectedCategories.value.length > 0) {
        params.categoryIds = selectedCategories.value;
      }
      if (priceRange.value[0] > 0) params.minPrice = priceRange.value[0];
      if (priceRange.value[1] < 100000000) params.maxPrice = priceRange.value[1];

      const res = await searchProducts(params);
      console.log('Products API response:', res);
      if (res.code !== 200) throw new Error(res.message);

      const data = res.result;
      const today = new Date().toISOString().split('T')[0];

      const mapped = data.content.map(p => {
        const isNew = p.newFrom && p.newTo
          ? today >= p.newFrom && today <= p.newTo
          : false;

        // Calculate discount using utility function that matches backend
        const discount = calculateProductDiscount(p);

        // Get best selling price if available
        const bestSellingPrice = getBestSellingPrice(p);
        const originalPrice = bestSellingPrice ? p.minPrice : null;

        return {
          id: p.id,
          name: p.name,
          price: bestSellingPrice || p.minPrice,
          maxPrice: p.maxPrice,
          originalPrice: originalPrice,
          discount: discount,
          badge: !p.inStock ? 'Out of Stock' : (discount ? null : (isNew ? 'New' : null)),
          badgeColor: !p.inStock ? 'red' : (isNew ? 'green' : null),
          image: p.thumbnail?.url || p.thumbnail || '/placeholder.png',
          // Use API flag if provided, otherwise fallback to localStorage-based check
          isWishlisted: (p.isWishlisted !== undefined) ? p.isWishlisted : isInWishlist(p.id)
        };
      });

      products.value.splice(0, products.value.length, ...mapped);
      console.log('Products assigned:', products.value.length);

      totalPages.value = data.totalPages || 0;
      totalElements.value = data.totalElements;
      currentPage.value = page;
      pageSize.value = size;
      lastFetched.value = { key: cacheKey, ts: now };
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      isLoading.value = false;
    }
  };


  // === FUNCTIONS ===
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

  const setKeyword = (searchKeyword) => {
    keyword.value = searchKeyword;
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

  const toggleLike = async (product) => {
    const wasWishlisted = product.isWishlisted;
    product.isWishlisted = !product.isWishlisted;

    try {
      if (product.isWishlisted) {
        const { addToWishlist } = await import('@/api/accountApi.js');
        const { getProductById } = await import('@/api/productApi.js');

        const productDetail = await getProductById(product.id);
        if (productDetail.code !== 200 || !productDetail.result) {
          throw new Error('Failed to fetch product detail');
        }

        const variants = productDetail.result.variants || [];
        const firstVariantId = variants[0]?.id;
        if (!firstVariantId) {
          alert('This product has no variants available for wishlist');
          product.isWishlisted = wasWishlisted;
          return;
        }

        await addToWishlist(firstVariantId);
        console.log('Added to wishlist:', product.name);
        alert('Added to wishlist!');
        window.dispatchEvent(new Event('wishlistChanged'));
      } else {
        // Try to call removeFromWishlist if available; otherwise revert and inform user
        try {
          const { removeFromWishlist } = await import('@/api/accountApi.js');
          if (typeof removeFromWishlist === 'function') {
            const { getProductById } = await import('@/api/productApi.js');
            const productDetail = await getProductById(product.id);
            const variants = productDetail.result?.variants || [];
            const firstVariantId = variants[0]?.id;
            if (!firstVariantId) {
              throw new Error('No variant id available to identify wishlist entry');
            }

            // Import wishlist store and ensure it's loaded so we can find the wishlist entry id
            const { useWishlistStore } = await import('@/User/stores/wishlistStore.js');
            const wishlistStore = useWishlistStore();
            if (!wishlistStore.items || wishlistStore.items.length === 0) {
              try {
                await wishlistStore.fetchWishlist(0);
              } catch (e) {
                // ignore - we'll handle not-found below
                console.debug('Failed to prefetch wishlist for lookup:', e);
              }
            }

            const match = (wishlistStore.items || []).find(i => i.variantId === firstVariantId || i.productVariantId === firstVariantId);
            if (match && match.id) {
              await removeFromWishlist(match.id);
              window.dispatchEvent(new Event('wishlistChanged'));
              console.log('Removed from wishlist:', product.name);
              alert('Removed from wishlist!');
            } else {
              // Could not find wishlist entry id for this variant
              throw new Error('Wishlist entry not found for this variant');
            }
          } else {
            throw new Error('removeFromWishlist not implemented');
          }
        } catch (err) {
          // If removal not implemented or failed, revert and notify
          product.isWishlisted = wasWishlisted;
          alert('Remove from wishlist is not available. Please manage wishlist from the Wishlist page.');
          console.warn('Remove from wishlist failed or not implemented', err);
        }
      }
    } catch (error) {
      product.isWishlisted = wasWishlisted;
      console.error('Failed to toggle wishlist:', error);

      if (error.response?.status === 401) {
        alert('Please login to add items to wishlist');
      } else {
        alert('Failed to update wishlist: ' + (error.message || 'Unknown error'));
      }
    }
  };

  return {
    products, latestProducts, displayedLatestProducts,
    latestProductsExpanded, hasMoreLatestProducts,
    categories,
    isLoading, isLoadingCategories, isLoadingLatest,
    totalPages, totalElements, currentPage,
    pageSize, sortBy, priceRange, selectedCategories, keyword,
    hasNextPage, hasPrevPage,
    fetchCategories, fetchProducts, fetchLatestProducts,
    toggleLatestProductsExpanded,
    setSort, setPageSize, setPriceRange, setKeyword,
    toggleCategory, toggleCategoryOpen, changePage, toggleLike
  };
});
