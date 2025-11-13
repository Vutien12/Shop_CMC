// src/User/stores/wishlistStore.js
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { searchWishlist } from '@/api/accountApi.js';

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref([]);
  const totalPages = ref(0);
  const currentPage = ref(0);
  const pageSize = ref(10);
  const isLoading = ref(false);
  const lastFetched = ref(null);
  const loadedPages = ref(new Set());
  const CACHE_DURATION = 2 * 60 * 1000;

  const fetchWishlist = async (page = 0, size = 5, force = false) => {
    const cacheKey = `${page}-${size}`;
    const now = Date.now();

    // Cache kiểm tra
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

      const formatted = data.content.map(item => {
        // Tách tên sản phẩm và biến thể
        let productName = item.productName;
        let variantDisplay = '';

        if (item.productName) {
          const parts = item.productName.split(' - ');
          if (parts.length > 1) {
            productName = parts[0];
            variantDisplay = parts.slice(1).join(' - ');
          }
        }

        return {
          id: item.id,
          variantId: item.variantId,
          productName,           // Tên chính
          variantDisplay,        // Biến thể
          productSku: item.productSku,
          productPrice: item.productPrice,
          currency: item.currency || 'VND',
          productImage: item.productImage || '/images/placeholder.jpg',
          status: item.status,
          addedAt: new Date(item.addedAt).toLocaleDateString('vi-VN'),
          rawPrice: item.productPrice,
        };
      });

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

  const updateItemLocally = (id, updatedData) => {
    const index = items.value.findIndex(i => i.id === id);
    if (index !== -1) {
      items.value[index] = { ...items.value[index], ...updatedData, status: 'AVAILABLE' };
    }
  };

  return { items, totalPages, currentPage, pageSize, isLoading, fetchWishlist, removeItemLocally, updateItemLocally, loadedPages
  };
});
