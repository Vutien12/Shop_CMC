// src/User/stores/profileStore.js
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getMyInfo } from '@/api/accountApi.js';

export const useProfileStore = defineStore('profile', () => {
  const profile = ref(null);
  const isLoading = ref(false);
  const lastFetched = ref(null);
  const CACHE_DURATION = 2 * 60 * 1000;

  const fetchProfile = async (force = false) => {
    const now = Date.now();
    if (!force && lastFetched.value && now - lastFetched.value < CACHE_DURATION && profile.value) {
      return profile.value;
    }

    isLoading.value = true;
    try {
      const res = await getMyInfo();
      const user = res.data.result;

      const data = {
        email: user.email || '',
        phone: user.phone || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        defaultAddress: user.defaultAddress || null
      };

      profile.value = data;
      lastFetched.value = now;
      return data;
    } catch (error) {
      console.error('Fetch profile failed:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  return { profile, isLoading, fetchProfile };
});
