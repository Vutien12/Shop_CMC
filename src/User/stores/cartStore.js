// src/User/stores/cartStore.js
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import {
  getCart,
  addToCart,
  clearCart,
  updateCartItemQty,
  removeCartItem
} from '@/api/cartApi.js';

const CACHE_DURATION = 5 * 60 * 1000;

export const useCartStore = defineStore('cart', () => {
  const cart = ref(null);
  const isLoading = ref(false);
  const isLoaded = ref(false);
  const lastFetched = ref(null);

  // 1. fetchCart: CẦN try/catch → fallback an toàn
  const fetchCart = async (force = false) => {
    const now = Date.now();
    if (!force && isLoaded.value && lastFetched.value && now - lastFetched.value < CACHE_DURATION) {
      return cart.value;
    }

    isLoading.value = true;
    try {
      const res = await getCart();
      // res is now {code: 200, message: 'Success', result: {...}}
      if (res.code === 200) {
        cart.value = res.result;
        isLoaded.value = true;
        lastFetched.value = now;
      }
      return cart.value;
    } catch (error) {
      // Xử lý lỗi: reset cart, log
      cart.value = null;
      isLoaded.value = false;

      // If 401 (unauthorized), silently fail - user is not logged in
      if (error.response?.status === 401) {
        if (import.meta.env.DEV) {
          console.warn('[CartStore] User not authenticated, skipping cart fetch');
        }
        return null;
      }

      if (import.meta.env.DEV) {
        console.error('[CartStore] Fetch failed:', error);
      }
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // 2. addItem: CẦN try/catch → cập nhật state dù lỗi
  const addItem = async (payload) => {
    isLoading.value = true;
    try {
      const res = await addToCart(payload);
      // res is now {code: 200, message: 'Success', result: {...}}
      if (res.code === 200) {
        cart.value = res.result;
        lastFetched.value = Date.now();
        window.dispatchEvent(new Event('cartUpdated'));
      }
      return cart.value;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('[CartStore] Add item failed:', error);
      }
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // 3. updateQuantity: KHÔNG cần try/catch → component xử lý
  const updateQuantity = async (cartItemId, qty) => {
    if (qty < 1) return;
    const res = await updateCartItemQty(cartItemId, qty);
    // res is now {code: 200, message: 'Success', result: {...}}
    if (res.code === 200) {
      cart.value = res.result;
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const updateItemQuantity = async (cartItemId, qty) => {
    await updateQuantity(cartItemId, qty);
  };

  const removeItem = async (cartItemId) => {
    const res = await removeCartItem(cartItemId);
    if (res.code === 200) {
      cart.value = res.result;
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const clear = async () => {
    const res = await clearCart();
    if (res.code === 200) {
      cart.value = { cartItems: [], total: 0 };
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  // Computed
  const cartItems = computed(() => cart.value?.cartItems || []);
  const total = computed(() => cart.value?.total || 0);
  const itemCount = computed(() => cartItems.value.length);

  return {
    cart,
    cartItems,
    total,
    itemCount,
    isLoading,
    isLoaded,
    fetchCart,
    addItem,
    updateQuantity,
    updateItemQuantity,
    removeItem,
    clear,
  };
});
