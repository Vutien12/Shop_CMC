// src/User/composables/LazyLoad/useLazyLoad.js
import { ref } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';

export function useLazyLoad(loadFn, targetRef) {
  const isVisible = ref(false);

  const load = async () => {
    if (isVisible.value) return;
    isVisible.value = true;
    await loadFn();
  };

  useIntersectionObserver(
    targetRef,
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        load();
      }
    },
    { threshold: 0.1 }
  );

  return { isVisible };
}
