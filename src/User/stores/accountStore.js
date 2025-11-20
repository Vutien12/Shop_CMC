// src/User/stores/accountStore.js
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getMyInfo, getRecentOrders } from '@/api/accountApi.js'

export const useAccountStore = defineStore('account', () => {
  const recentOrders = ref([]);
  const userInfo = ref(null);
  const isLoading = ref(false);
  const lastFetched = ref(null);
  const CACHE_DURATION = 2 * 60 * 1000; // 2 phút
  const loadedPages = ref(new Set());

  const fetchData = async (force = false, includeOrders = true) => {
    const now = Date.now();
    const PAGE_KEY = includeOrders ? 'dashboard' : 'checkout';

    if (
      !force &&
      loadedPages.value.has(PAGE_KEY) &&
      lastFetched.value?.key === PAGE_KEY &&
      now - lastFetched.value.ts < CACHE_DURATION
    ) {
      return { recentOrders: recentOrders.value, userInfo: userInfo.value };
    }

    isLoading.value = true;
    try {
      const userRes = await getMyInfo();

      let ordersRes = null;
      if (includeOrders) {
        ordersRes = await getRecentOrders();
      }

      const orders = includeOrders && ordersRes
        ? (ordersRes.data.result.content || []).map(order => ({
            id: order.id ?? 'N/A',
            date: order.createdAt
              ? new Date(order.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric'
              })
              : 'N/A',
            status: (order.status || '').replace(/_/g, ' '),
            statusClass: getStatusClass(order.status),
            total: order.total != null
              ? new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: order.currency || 'VND'
              }).format(order.total)
              : '0 ₫',
            tracking: Array.isArray(order.transactions) && order.transactions[0]?.transactionId
              ? `...${order.transactions[0].transactionId.slice(-8)}`
              : '-'
          }))
        : [];

      const user = userRes.data.result || {};
      const addr = user.defaultAddress || {};

      const userData = {
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Chưa cập nhật',
        email: user.email || 'Chưa có email',
        phone: user.phone || 'Chưa cập nhật',
        address: addr.addressLine
          ? `${addr.addressLine}${addr.addressLine2 ? ', ' + addr.addressLine2 : ''}, ${addr.ward || ''}, ${addr.district || ''}, ${addr.city || ''}, ${addr.country || ''}`
            .replace(/^,\s*/, '').trim()
          : 'Chưa có địa chỉ mặc định',
        defaultAddress: user.defaultAddress || null
      };

      // Cập nhật state + cache
      recentOrders.value = orders;
      userInfo.value = userData;
      lastFetched.value = { key: PAGE_KEY, ts: now };
      loadedPages.value.add(PAGE_KEY);

      return { recentOrders: orders, userInfo: userData };
    } catch (error) {
      console.error('Fetch account data failed:', error);
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

  return { recentOrders, userInfo, isLoading, fetchData, loadedPages };
});
