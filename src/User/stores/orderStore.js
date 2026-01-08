// src/User/stores/orderStore.js
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getRecentOrders } from '@/api/accountApi.js'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/Config/search.js'

export const useOrderStore = defineStore('order', () => {
  const orders = ref([]);
  const totalPages = ref(0);
  const currentPage = ref(0);
  const isLoading = ref(false);
  const lastFetched = ref(null);
  const loadedPages = ref(new Set());
  const CACHE_DURATION = 2 * 60 * 1000;
  const pageDefault = ref(DEFAULT_PAGE);
  const pageSize = ref(DEFAULT_PAGE_SIZE.orders);

  const fetchOrders = async (page = pageDefault.value, size = pageSize.value, force = false) => {
    const cacheKey = `${page}-${size}`;
    const now = Date.now();
    // Already loaded, still in cache, return immediately
    if (
      !force &&
      loadedPages.value.has(cacheKey) &&
      lastFetched.value?.key === cacheKey &&
      now - lastFetched.value.ts < CACHE_DURATION
    ) {
      return { orders: orders.value, totalPages: totalPages.value };
    }

    isLoading.value = true;
    try {
      const res = await getRecentOrders(page, size);
      const data = res.data.result;

      const formatted = data.content.map(order => ({
        id: order.id,
        date: new Date(order.createdAt).toLocaleDateString('en-GB', {
          day: '2-digit', month: 'short', year: 'numeric'
        }),
        status: (order.status || '').replace(/_/g, ' '),
        statusClass: getStatusClass(order.status),
        total: new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: order.currency || 'VND'
        }).format(order.total),
        transaction: order.transactions?.[0]?.transactionId
          ? `...${order.transactions[0].transactionId.slice(-8)}`
          : '-'
      }));

      // Update state
      orders.value = formatted;
      totalPages.value = data.totalPages;
      currentPage.value = page;
      pageSize.value = size;
      lastFetched.value = { key: cacheKey, ts: now };
      loadedPages.value.add(cacheKey);

      return { orders: formatted, totalPages: data.totalPages };
    } catch (error) {
      console.error('Fetch orders failed:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const getStatusClass = (status) => {
    const map = {
      PAID: 'status-paid',
      PENDING: 'status-pending',
      PENDING_PAYMENT: 'status-pending-payment',
      CANCELLED: 'status-cancelled'
    };
    return map[status] || 'status-pending';
  };

  return { orders, totalPages, currentPage, pageSize, isLoading, fetchOrders };
});
