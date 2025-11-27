// src/User/stores/reviewStore.js
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { searchReviews } from '@/api/reviewApi.js';

export const useReviewStore = defineStore('review', () => {
  // === STATE ===
  const reviews = ref([]);
  const isLoading = ref(false);
  const totalPages = ref(0);
  const totalElements = ref(0);
  const currentPage = ref(0);
  const pageSize = ref(10);
  const sortBy = ref('createdAt');
  const sortDirection = ref('DESC');
  const lastFetched = ref(null);
  const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

  // === COMPUTED ===
  const hasNextPage = computed(() => currentPage.value < totalPages.value - 1);
  const hasPrevPage = computed(() => currentPage.value > 0);
  const averageRating = computed(() => {
    if (reviews.value.length === 0) return 0;
    const sum = reviews.value.reduce((acc, review) => acc + (review.rating || 0), 0);
    return (sum / reviews.value.length).toFixed(1);
  });

  // === ACTIONS ===
  /**
   * Search reviews with advanced filter
   * @param {Object} searchRequest - Search request object
   * @param {number} [searchRequest.productId] - Filter by product ID
   * @param {number} [searchRequest.userId] - Filter by user ID
   * @param {number} [searchRequest.rating] - Filter by rating
   * @param {string} [searchRequest.comment] - Filter by comment
   * @param {number} [searchRequest.page=0] - Page number (0-indexed)
   * @param {number} [searchRequest.size=10] - Page size
   * @param {string} [searchRequest.sortBy='createdAt'] - Sort field
   * @param {string} [searchRequest.direction='DESC'] - Sort direction (ASC or DESC)
   * @param {boolean} [force=false] - Force refresh from server
   */
  const fetchReviews = async (searchRequest = {}, force = false) => {
    console.log('fetchReviews called with:', searchRequest, 'force:', force);
    const cacheKey = JSON.stringify(searchRequest);
    const now = Date.now();

    if (!force && lastFetched.value?.key === cacheKey && now - lastFetched.value.ts < CACHE_DURATION) {
      console.log('Using cached reviews');
      return;
    }

    isLoading.value = true;
    console.log('isLoading set to true');
    try {
      // Build request object with proper precedence
      const request = {
        page: searchRequest.page !== undefined ? searchRequest.page : 0,
        size: searchRequest.size !== undefined ? searchRequest.size : pageSize.value,
        sortBy: searchRequest.sortBy || sortBy.value,
        direction: searchRequest.direction || sortDirection.value
      };

      // Add optional filters from searchRequest
      if (searchRequest.productId) request.productId = searchRequest.productId;
      if (searchRequest.userId) request.userId = searchRequest.userId;
      if (searchRequest.rating) request.rating = searchRequest.rating;
      if (searchRequest.comment) request.comment = searchRequest.comment;

      console.log('Fetching reviews with request:', request);
      const response = await searchReviews(request);
      console.log('Reviews API response:', response);

      if (response.code !== 200) {
        throw new Error(response.message || 'Failed to fetch reviews');
      }

      const data = response.result || response.data;
      console.log('🟢 Mapped data:', data);
      console.log('🟢 Data type:', typeof data);
      console.log('🟢 Data.content:', data?.content);
      console.log('🟢 Data.content type:', typeof data?.content);
      console.log('🟢 Before update - reviews.value:', reviews.value);

      // Validate and assign
      if (Array.isArray(data?.content)) {
        reviews.value = data.content;
        console.log('✅ Assigned array with', data.content.length, 'items');
      } else {
        console.warn('⚠️ data.content is not an array:', data?.content);
        reviews.value = [];
      }

      totalPages.value = data.totalPages || 0;
      totalElements.value = data.totalElements || 0;
      currentPage.value = data.number !== undefined ? data.number : (data.page || 0);

      console.log('🟢 After update - reviews.value:', reviews.value);
      console.log('🟢 After update - totalElements:', totalElements.value);
      console.log('🟢 After update - reviews.value.length:', reviews.value.length);

      lastFetched.value = { key: cacheKey, ts: now };
      console.log('Reviews loaded:', reviews.value.length, 'reviews');
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    } finally {
      isLoading.value = false;
      console.log('isLoading set to false');
    }
  };

  /**
   * Get reviews for a specific product
   * @param {number} productId - Product ID
   * @param {number} [page=0] - Page number
   * @param {number} [size=10] - Page size
   * @param {boolean} [force=false] - Force refresh
   */
  const fetchProductReviews = async (productId, page = 0, size = 10, force = false) => {
    isLoading.value = true;
    try {
      const request = {
        productId,
        page,
        size,
        sortBy: 'createdAt',
        direction: 'DESC'
      };

      console.log('Fetching product reviews with request:', request);
      const response = await searchReviews(request);
      console.log('Product reviews response:', response);

      if (response.code !== 200) {
        throw new Error(response.message || 'Failed to fetch product reviews');
      }

      const data = response.result || response.data;
      reviews.value = data.content || [];
      totalPages.value = data.totalPages || 0;
      totalElements.value = data.totalElements || 0;
      currentPage.value = data.number !== undefined ? data.number : (data.page || 0);

      lastFetched.value = { key: `product-${productId}`, ts: Date.now() };
      console.log('Product reviews loaded:', reviews.value.length, 'reviews');
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Update pagination
   */
  const setPage = (page) => {
    currentPage.value = page;
  };

  const setPageSize = (size) => {
    pageSize.value = size;
    currentPage.value = 0;
  };

  const setSortBy = (field, direction = 'DESC') => {
    sortBy.value = field;
    sortDirection.value = direction;
    currentPage.value = 0;
  };

  /**
   * Clear reviews cache
   */
  const clearCache = () => {
    reviews.value = [];
    currentPage.value = 0;
    totalPages.value = 0;
    lastFetched.value = null;
  };

  return {
    // State
    reviews,
    isLoading,
    totalPages,
    totalElements,
    currentPage,
    pageSize,
    sortBy,
    sortDirection,

    // Computed
    hasNextPage,
    hasPrevPage,
    averageRating,

    // Actions
    fetchReviews,
    fetchProductReviews,
    setPage,
    setPageSize,
    setSortBy,
    clearCache
  };
});

