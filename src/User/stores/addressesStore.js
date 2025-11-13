// src/User/stores/addressStore.js
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getAddresses} from '@/api/accountApi.js';

export const useAddressStore = defineStore('address', () => {
  const addresses = ref([]);
  const totalPages = ref(0);
  const currentPage = ref(0);
  const pageSize = ref(6);
  const isLoading = ref(false);
  const lastFetched = ref(null);
  const loadedPages = ref(new Set());
  const CACHE_DURATION = 2 * 60 * 1000;

  const fetchAddresses = async (page = 0, size = 6, force = false) => {
    const cacheKey = `${page}-${size}`;
    const now = Date.now();

    if (
      !force &&
      loadedPages.value.has(cacheKey) &&
      lastFetched.value?.key === cacheKey &&
      now - lastFetched.value.ts < CACHE_DURATION
    ) {
      return { addresses: addresses.value, totalPages: totalPages.value };
    }

    isLoading.value = true;
    try {
      const res = await getAddresses(page, size);
      const data = res.data.result;

      const formatted = data.content.map(addr => ({
        id: addr.id,
        firstName: addr.firstName || '',
        lastName: addr.lastName || '',
        phone: addr.phone || '',
        addressLine: addr.addressLine || '',
        addressLine2: addr.addressLine2 || '',
        city: addr.city || '',
        stateOrProvince: addr.stateOrProvince || '',
        postalCode: addr.postalCode || '',
        country: addr.country || 'Vietnam',
        isDefault: addr.isDefault || false,
      }));

      addresses.value = formatted;
      totalPages.value = data.totalPages;
      currentPage.value = page;
      pageSize.value = size;
      lastFetched.value = { key: cacheKey, ts: now };
      loadedPages.value.add(cacheKey);

      return { addresses: formatted, totalPages: data.totalPages };
    } catch (error) {
      console.error('Fetch addresses failed:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const addAddressLocally = (newAddr) => {
    addresses.value.unshift(newAddr);
    if (addresses.value.length > pageSize.value && currentPage.value === 0) {
      addresses.value.pop();
    }
  };

  const updateAddressLocally = (id, updatedAddr) => {
    const index = addresses.value.findIndex(a => a.id === id);
    if (index !== -1) {
      addresses.value[index] = updatedAddr;
    }
  };

  const removeAddressLocally = (id) => {
    addresses.value = addresses.value.filter(addr => addr.id !== id);
    if (addresses.value.length === 0 && currentPage.value > 0) {
      currentPage.value -= 1;
    }
  };

  return { addresses, totalPages, currentPage, pageSize, isLoading, fetchAddresses, addAddressLocally, updateAddressLocally, removeAddressLocally, loadedPages };
});
