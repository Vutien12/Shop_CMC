// src/User/composables/Toast/useToast.js
import { reactive } from 'vue';

const state = reactive({
  toasts: []
});

export function useToast() {
  const add = (message, type = 'success', duration = 5000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, removing: false };

    state.toasts.push(toast);

    toast.timeoutId = setTimeout(() => remove(id), duration);

    return id;
  };

  const remove = (id) => {
    const index = state.toasts.findIndex(t => t.id === id);
    if (index === -1) return;

    const toast = state.toasts[index];
    if (toast.timeoutId) clearTimeout(toast.timeoutId);

    // Animation fade out
    toast.removing = true;

    setTimeout(() => {
      state.toasts.splice(index, 1);
    }, 400);
  };

  return {
    toasts: state.toasts,
    add,
    remove
  };
}
