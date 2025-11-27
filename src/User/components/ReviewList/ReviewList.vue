<!-- src/User/components/ReviewList/ReviewList.vue -->
<template>
  <div class="review-list-container">

    <!-- Header với filter -->
    <div class="review-header">
      <h2 class="review-title">Customer Reviews ({{ reviewStore.totalElements }})</h2>

      <div class="filter-section">
        <div class="sort-control">
          <label for="sortBy">Sort by:</label>
          <select id="sortBy" v-model="sortByValue" @change="updateSort">
            <option value="createdAt">Newest</option>
            <option value="rating">Highest Rating</option>
            <option value="rating-asc">Lowest Rating</option>
          </select>
        </div>

        <div class="rating-filter" v-if="showRatingFilter">
          <label>Filter by rating:</label>
          <div class="rating-buttons">
            <button
              v-for="rating in [5, 4, 3, 2, 1]"
              :key="rating"
              @click="filterByRating(rating)"
              :class="{ active: selectedRating === rating }"
              class="rating-btn"
            >
              {{ rating }} ★
            </button>
            <button
              @click="clearRatingFilter"
              :class="{ active: selectedRating === null }"
              class="rating-btn all"
            >
              All
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="reviewStore.isLoading" class="loading-spinner">
      <div class="spinner"></div>
      <p>Loading reviews...</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="!hasReviews" class="empty-state">
      <p>📝 No reviews yet</p>
      <p>Be the first to review this product!</p>
    </div>

    <!-- Reviews list -->
    <div v-else-if="hasReviews" class="reviews-grid">
      <div v-for="review in reviewStore.reviews" :key="review.id" class="review-card">
        <div class="review-header-card">
          <div class="reviewer-info">
            <div class="avatar">{{ getInitials(review.userFullName || review.userName || review.user?.name) }}</div>
            <div class="reviewer-details">
              <h4 class="reviewer-name">{{ review.userFullName || review.userName || review.user?.name || 'Anonymous' }}</h4>
              <p class="review-date">{{ formatDate(review.createdAt) }}</p>
            </div>
          </div>
          <div class="review-rating">
            <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= review.rating }">★</span>
          </div>
        </div>

        <div class="review-content">
          <h5 class="review-comment-title" v-if="review.title">{{ review.title }}</h5>
          <p class="review-comment">{{ review.comment }}</p>
        </div>

        <div v-if="review.variantName" class="review-variant">
          <small>Variant: {{ review.variantName }}</small>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="reviewStore.totalPages > 1" class="pagination">
      <button
        @click="previousPage"
        :disabled="!reviewStore.hasPrevPage"
        class="btn-pagination"
      >
        ← Previous
      </button>

      <div class="page-info">
        Page {{ reviewStore.currentPage + 1 }} of {{ reviewStore.totalPages }}
      </div>

      <button
        @click="nextPage"
        :disabled="!reviewStore.hasNextPage"
        class="btn-pagination"
      >
        Next →
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useReviewStore } from '@/User/stores/reviewStore.js';

const props = defineProps({
  productId: {
    type: Number,
    required: true
  },
  showRatingFilter: {
    type: Boolean,
    default: true
  }
});

const reviewStore = useReviewStore();
const sortByValue = ref('createdAt');
const selectedRating = ref(null);

// Computed để ensure reactivity
const hasReviews = computed(() => {
  console.log('🔄 hasReviews computed, length:', reviewStore.reviews.length);
  return reviewStore.reviews.length > 0;
});

// Load reviews on mount
onMounted(async () => {
  console.log('✅ ReviewList mounted with productId:', props.productId);
  console.log('Initial reviewStore state:', {
    reviews: reviewStore.reviews,
    totalElements: reviewStore.totalElements,
    isLoading: reviewStore.isLoading
  });

  reviewStore.setPageSize(10);
  await loadReviews();

  console.log('✅ After loadReviews completed, reviewStore state:', {
    reviews: reviewStore.reviews,
    totalElements: reviewStore.totalElements,
    isLoading: reviewStore.isLoading
  });
});

/**
 * Load reviews for the product
 */
const loadReviews = async () => {
  try {
    console.log('🔵 loadReviews START');
    console.log('🔵 Current reviewStore state BEFORE:', {
      reviews: reviewStore.reviews,
      totalElements: reviewStore.totalElements,
      isLoading: reviewStore.isLoading
    });

    const request = {
      productId: props.productId,
      page: reviewStore.currentPage,
      size: reviewStore.pageSize,
      sortBy: getSortByField(),
      direction: getSortDirection()
    };

    if (selectedRating.value) {
      request.rating = selectedRating.value;
    }

    console.log('🔵 Calling fetchReviews with:', request);
    await reviewStore.fetchReviews(request, true);

    console.log('🔵 loadReviews COMPLETED');
    console.log('🔵 Current reviewStore state AFTER:', {
      reviews: reviewStore.reviews,
      totalElements: reviewStore.totalElements,
      isLoading: reviewStore.isLoading
    });
  } catch (error) {
    console.error('❌ Error loading reviews:', error);
  }
};

/**
 * Get sort field from UI value
 */
const getSortByField = () => {
  if (sortByValue.value === 'rating') return 'rating';
  if (sortByValue.value === 'rating-asc') return 'rating';
  return 'createdAt';
};

/**
 * Get sort direction
 */
const getSortDirection = () => {
  if (sortByValue.value === 'rating-asc') return 'ASC';
  return 'DESC';
};

/**
 * Update sort and reload
 */
const updateSort = async () => {
  reviewStore.setSortBy(getSortByField(), getSortDirection());
  reviewStore.setPage(0);
  await loadReviews();
};

/**
 * Filter by rating
 */
const filterByRating = async (rating) => {
  selectedRating.value = rating;
  reviewStore.setPage(0);
  await loadReviews();
};

/**
 * Clear rating filter
 */
const clearRatingFilter = async () => {
  selectedRating.value = null;
  reviewStore.setPage(0);
  await loadReviews();
};

/**
 * Navigation
 */
const nextPage = async () => {
  if (reviewStore.hasNextPage) {
    reviewStore.setPage(reviewStore.currentPage + 1);
    await loadReviews();
  }
};

const previousPage = async () => {
  if (reviewStore.hasPrevPage) {
    reviewStore.setPage(reviewStore.currentPage - 1);
    await loadReviews();
  }
};

/**
 * Utility functions
 */
const getInitials = (name) => {
  if (!name) return 'A';
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};
</script>

<style scoped>
/* Light & Clean Design System */
.review-list-container {
  width: 100%;
  background: #ffffff;
  padding: 24px 0;
  margin: 0;
}

/* Header Section */
.review-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.review-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 16px;
  letter-spacing: -0.3px;
}

.filter-section {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
}

.sort-control,
.rating-filter {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-control label,
.rating-filter label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
}

#sortBy {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #374151;
}

#sortBy:hover {
  border-color: #FFB800;
}

#sortBy:focus {
  outline: none;
  border-color: #FFB800;
  box-shadow: 0 0 0 3px rgba(255, 184, 0, 0.1);
}

.rating-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.rating-btn {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.rating-btn:hover {
  border-color: #FFB800;
  background: #fffbeb;
  color: #92400e;
}

.rating-btn.active {
  background: #FFB800;
  color: white;
  border-color: #FFB800;
}

.rating-btn.all {
  font-weight: 600;
}

.rating-btn.all.active {
  background: #6366f1;
  border-color: #6366f1;
}

/* Loading State */
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 12px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #FFB800;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-spinner p {
  font-size: 0.875rem;
  color: #6b7280;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.empty-state p:first-child {
  font-size: 1rem;
  color: #374151;
  font-weight: 600;
  margin-bottom: 4px;
}

.empty-state p:last-child {
  font-size: 0.875rem;
  color: #9ca3af;
}

/* Reviews Grid */
.reviews-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

/* Review Card - Clean Design */
.review-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.2s ease;
}

.review-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-color: #d1d5db;
}

.review-header-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
  gap: 12px;
}

.reviewer-info {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  flex: 1;
  min-width: 0;
}

/* Avatar */
.avatar {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
  flex-shrink: 0;
}

.reviewer-details {
  flex: 1;
  min-width: 0;
}

.reviewer-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
  word-wrap: break-word;
}

.review-date {
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0;
}

/* Rating Stars */
.review-rating {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}

.star {
  color: #e5e7eb;
  font-size: 1rem;
}

.star.filled {
  color: #FFB800;
}

/* Review Content */
.review-content {
  margin-bottom: 12px;
}

.review-comment-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.review-comment {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #4b5563;
  margin: 0;
  word-wrap: break-word;
}

/* Variant Badge */
.review-variant {
  display: inline-block;
  padding: 4px 10px;
  background: #f3f4f6;
  border-radius: 4px;
  font-size: 0.8125rem;
  color: #6b7280;
  font-weight: 500;
  border: 1px solid #e5e7eb;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.btn-pagination {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  color: #374151;
}

.btn-pagination:hover:not(:disabled) {
  background: #FFB800;
  color: white;
  border-color: #FFB800;
}

.btn-pagination:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: #f9fafb;
}

.page-info {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .review-list-container {
    padding: 16px 0;
  }

  .review-title {
    font-size: 1.25rem;
  }

  .filter-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .sort-control,
  .rating-filter {
    width: 100%;
  }

  .rating-buttons {
    width: 100%;
    justify-content: flex-start;
  }

  .review-card {
    padding: 16px;
  }

  .review-header-card {
    flex-wrap: wrap;
  }

  .reviewer-info {
    flex: 1;
    min-width: 0;
  }

  .review-rating {
    width: 100%;
    justify-content: flex-start;
  }

  .pagination {
    gap: 12px;
  }

  .btn-pagination {
    padding: 8px 12px;
    font-size: 0.8125rem;
  }

  .page-info {
    font-size: 0.8125rem;
  }
}

@media (max-width: 480px) {
  .avatar {
    width: 40px;
    height: 40px;
    font-size: 0.875rem;
  }

  .reviewer-name {
    font-size: 0.875rem;
  }

  .review-date {
    font-size: 0.75rem;
  }

  .review-comment {
    font-size: 0.875rem;
  }

  .rating-buttons {
    gap: 6px;
  }

  .rating-btn {
    padding: 5px 10px;
    font-size: 0.8125rem;
  }
}
</style>

