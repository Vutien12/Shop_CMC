import { ref } from 'vue';
import { defineStore } from 'pinia';
import { searchOrders } from '@/api/orderApi.js';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/Config/search.js';

export const useAdminOrderStore = defineStore('adminOrder', () => {
  const orders = ref([]);
  const totalPages = ref(0);
  const totalElements = ref(0);
  const currentPage = ref(0);
  const isLoading = ref(false);
  const lastFetched = ref(null);
  const loadedPages = ref(new Set());
  const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes
  const pageDefault = ref(DEFAULT_PAGE);
  const pageSize = ref(DEFAULT_PAGE_SIZE.orders);

  const fetchOrders = async (page = pageDefault.value, size = pageSize.value, force = false) => {
    const cacheKey = `${page}-${size}`;
    const now = Date.now();

    // Return cached data if available and not forced
    if (
      !force &&
      loadedPages.value.has(cacheKey) &&
      lastFetched.value?.key === cacheKey &&
      now - lastFetched.value.ts < CACHE_DURATION
    ) {
      return { orders: orders.value, totalPages: totalPages.value, totalElements: totalElements.value };
    }

    isLoading.value = true;
    try {
      const res = await searchOrders(page, size);
      const data = res.data.result;

      const formatted = data.content.map(order => {
        // Combine first and last name
        const customerName = [order.customerFirstName, order.customerLastName]
          .filter(Boolean)
          .join(' ') || 'N/A';

        return {
          id: order.id,
          customer_name: customerName,
          customer_email: order.customerEmail || 'N/A',
          status: formatStatus(order.status),
          statusValue: order.status,
          total: order.total || 0,
          currency: order.currency || 'VND',
          created_at: order.createdAt,
          payment_method: order.paymentMethod || 'N/A',
          shipping_method: order.shippingMethod || 'N/A'
        };
      });

      // Update state
      orders.value = formatted;
      totalPages.value = data.totalPages;
      totalElements.value = data.totalElements;
      currentPage.value = page;
      pageSize.value = size;
      lastFetched.value = { key: cacheKey, ts: now };
      loadedPages.value.add(cacheKey);

      return { orders: formatted, totalPages: data.totalPages, totalElements: data.totalElements };
    } catch (error) {
      console.error('Fetch orders failed:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const formatStatus = (status) => {
    if (!status) return 'Pending';

    // Convert snake_case to Title Case
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const clearCache = () => {
    loadedPages.value.clear();
    lastFetched.value = null;
  };

  const removeOrders = (orderIds) => {
    orders.value = orders.value.filter(order => !orderIds.includes(order.id));
    totalElements.value -= orderIds.length;
  };

  return {
    orders,
    totalPages,
    totalElements,
    currentPage,
    pageSize,
    isLoading,
    fetchOrders,
    clearCache,
    removeOrders
  };
});

