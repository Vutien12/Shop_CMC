import { ref } from 'vue';

/**
 * Composable để quản lý trạng thái loading
 * @param {boolean} initialState - Trạng thái loading ban đầu
 * @returns {Object} - Object chứa loading state và các hàm điều khiển
 */
export function useLoading(initialState = false) {
  const isLoading = ref(initialState);

  /**
   * Bắt đầu loading
   */
  const startLoading = () => {
    isLoading.value = true;
  };

  /**
   * Dừng loading
   */
  const stopLoading = () => {
    isLoading.value = false;
  };

  /**
   * Toggle loading state
   */
  const toggleLoading = () => {
    isLoading.value = !isLoading.value;
  };

  /**
   * Thực hiện một async function với loading state
   * @param {Function} asyncFn - Async function cần thực hiện
   * @returns {Promise} - Kết quả của async function
   */
  const withLoading = async (asyncFn) => {
    startLoading();
    try {
      const result = await asyncFn();
      return result;
    } catch (error) {
      throw error;
    } finally {
      stopLoading();
    }
  };

  return {
    isLoading,
    startLoading,
    stopLoading,
    toggleLoading,
    withLoading
  };
}
