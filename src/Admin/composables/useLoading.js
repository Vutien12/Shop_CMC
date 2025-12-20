import { ref } from 'vue';

/**
 * Composable để quản lý trạng thái loading cho Admin
 * @param {boolean} initialState - Trạng thái loading ban đầu
 * @returns {Object} - Object chứa loading state và các hàm điều khiển
 */
export function useLoading(initialState = false) {
  const isLoading = ref(initialState);
  const error = ref(null);

  /**
   * Bắt đầu loading
   */
  const startLoading = () => {
    isLoading.value = true;
    error.value = null;
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
   * Set error state
   * @param {Error|string} err - Error object hoặc error message
   */
  const setError = (err) => {
    error.value = err;
    isLoading.value = false;
  };

  /**
   * Clear error
   */
  const clearError = () => {
    error.value = null;
  };

  /**
   * Thực hiện một async function với loading state (minimum 1 giây)
   * @param {Function} asyncFn - Async function cần thực hiện
   * @param {Object} options - Options { showError: boolean, errorHandler: Function }
   * @returns {Promise} - Kết quả của async function
   */
  const withLoading = async (asyncFn, options = {}) => {
    const { showError = true, errorHandler = null } = options;
    
    startLoading();
    const startTime = Date.now();
    
    try {
      const result = await asyncFn();
      
      // Đảm bảo loading hiển thị ít nhất 1 giây
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 1000 - elapsedTime);
      
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      
      return result;
    } catch (err) {
      if (showError) {
        setError(err);
      }
      if (errorHandler && typeof errorHandler === 'function') {
        errorHandler(err);
      }
      throw err;
    } finally {
      if (!error.value) {
        stopLoading();
      }
    }
  };

  /**
   * Thực hiện nhiều async functions song song với loading state (minimum 1 giây)
   * @param {Array<Function>} asyncFns - Mảng các async functions
   * @returns {Promise<Array>} - Mảng kết quả
   */
  const withLoadingAll = async (asyncFns) => {
    startLoading();
    const startTime = Date.now();
    
    try {
      const results = await Promise.all(asyncFns.map(fn => fn()));
      
      // Đảm bảo loading hiển thị ít nhất 1 giây
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 1000 - elapsedTime);
      
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      
      return results;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      if (!error.value) {
        stopLoading();
      }
    }
  };

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    toggleLoading,
    setError,
    clearError,
    withLoading,
    withLoadingAll
  };
}
