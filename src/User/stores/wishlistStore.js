// src/User/stores/wishlistStore.js
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { searchWishlist, removeFromWishlist } from '@/api/accountApi.js';

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref([]);
  const totalPages = ref(0);
  const currentPage = ref(0);
  const pageSize = ref(10);
  const isLoading = ref(false);
  const lastFetched = ref(null);
  const loadedPages = ref(new Set());
  const CACHE_DURATION = 2 * 60 * 1000;

  const fetchWishlist = async (page = 0, size = 2, force = false) => {
    const cacheKey = `${page}-${size}`;
    const now = Date.now();

    // Đã load, còn trong cache trả về ngay
    if (
      !force &&
      loadedPages.value.has(cacheKey) &&
      lastFetched.value?.key === cacheKey &&
      now - lastFetched.value.ts < CACHE_DURATION
    ) {
      return { items: items.value, totalPages: totalPages.value };
    }

    isLoading.value = true;
    try {
      const res = await searchWishlist(page, size);
      const data = res.data.result;

      const formatted = data.content.map(item => ({
        id: item.id,
        productId: item.productId,
        name: item.productName,
        price: new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: item.currency || 'VND'
        }).format(item.productPrice),
        rawPrice: item.productPrice,
        image: item.productImage || '/images/placeholder.jpg',
        addedAt: new Date(item.addedAt).toLocaleDateString('vi-VN'),
        availability: '_',
        availabilityClass: '_'
      }));

      items.value = formatted;
      totalPages.value = data.totalPages;
      currentPage.value = page;
      pageSize.value = size;
      lastFetched.value = { key: cacheKey, ts: now };
      loadedPages.value.add(cacheKey);

      return { items: formatted, totalPages: data.totalPages };
    } catch (error) {
      console.error('Fetch wishlist failed:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const removeItemLocally = (id) => {
    items.value = items.value.filter(i => i.id !== id);
    if (items.value.length === 0 && currentPage.value > 0) {
      currentPage.value -= 1;
    }
  };

  return { items, totalPages, currentPage, pageSize, isLoading, fetchWishlist, removeItemLocally, loadedPages };
});
