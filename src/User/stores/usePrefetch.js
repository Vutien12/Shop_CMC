// src/User/composables/usePrefetch.js
import { useAccountStore } from '@/User/stores/accountStore.js';
import { useOrderStore } from '@/User/stores/orderStore.js';
import { useWishlistStore } from '@/User/stores/wishlistStore.js';
import { useAddressStore } from '@/User/stores/addressesStore.js';
import { useProfileStore } from '@/User/stores/profileStore.js';
import { useCartStore } from '@/User/stores/cartStore.js';

const stores = {
  '/account': useAccountStore,
  '/orders': useOrderStore,
  '/wishlist': useWishlistStore,
  '/addresses': useAddressStore,
  '/profile': useProfileStore,
  '/cart': useCartStore,
};

let prefetchTimeout = null;

export const usePrefetch = () => {
  const prefetch = (path) => {
    if (prefetchTimeout) clearTimeout(prefetchTimeout);

    prefetchTimeout = setTimeout(() => {
      const storeFn = stores[path];
      if (storeFn) {
        const store = storeFn();
        if (store && !store.isLoaded) {
          store.fetchData?.();
        }
      }
    }, 300); // chờ 300ms hover → mới tải
  };

  const cancel = () => {
    if (prefetchTimeout) clearTimeout(prefetchTimeout);
  };

  return { prefetch, cancel };
};
