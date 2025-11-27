import api from './axiosInstance';

// Create review for a product
export const createReview = async (reviewData) => {
  try {
    // Backend expects: userId, productId, orderId, variantId?, rating, title, comment
    const payload = {
      userId: reviewData.userId,
      productId: reviewData.productId,
      orderId: reviewData.orderId,
      rating: reviewData.rating,
      title: reviewData.title,
      comment: reviewData.comment
    };

    // Only add variantId if it exists
    if (reviewData.variantId) {
      payload.variantId = reviewData.variantId;
    }

    console.log('Creating review with payload:', payload);
    return await api.post('/reviews', payload);
  } catch (error) {
    console.error('Error creating review:', error);
    console.error('Error details:', error.response?.data);
    throw error;
  }
};

// Get reviews for a product
export const getProductReviews = async (productId, page = 0, size = 10) => {
  try {
    return await api.get('/reviews/search', {
      params: {
        productId,
        page,
        size,
        sort: 'createdAt,desc'
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

// Update review
export const updateReview = async (reviewId, reviewData) => {
  try {
    const payload = {
      userId: reviewData.userId,
      productId: reviewData.productId,
      orderId: reviewData.orderId,
      rating: reviewData.rating,
      title: reviewData.title,
      comment: reviewData.comment
    };

    // Only add variantId if it exists
    if (reviewData.variantId) {
      payload.variantId = reviewData.variantId;
    }

    console.log('Updating review with payload:', payload);
    return await api.put(`/reviews/${reviewId}`, payload);
  } catch (error) {
    console.error('Error updating review:', error);
    console.error('Error details:', error.response?.data);
    throw error;
  }
};

// Delete review
export const deleteReview = async (reviewId) => {
  try {
    return await api.delete(`/reviews/${reviewId}`);
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

// Get all reviews for current user
export const getMyReviews = async (page = 0, size = 10) => {
  try {
    return await api.get('/reviews/my-reviews', {
      params: {
        page,
        size
      }
    });
  } catch (error) {
    console.error('Error fetching my reviews:', error);
    throw error;
  }
};

