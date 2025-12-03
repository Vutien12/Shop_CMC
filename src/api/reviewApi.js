import api from './axiosInstance';

// Create review for a product
export const createReview = async (reviewData) => {
  try {
    const payload = {
      userId: reviewData.userId,
      productId: reviewData.productId, // include productId so backend validation succeeds
      orderId: reviewData.orderId,
      rating: reviewData.rating,
      title: reviewData.title,
      comment: reviewData.comment
    };

    if (reviewData.variantId) {
      payload.variantId = reviewData.variantId;
    }

    const response = await api.post('/reviews', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating review:', error);
    console.error('Error details:', error.response?.data);
    throw error;
  }
};

// Search reviews with advanced filter
export const searchReviews = async (searchRequest) => {
  try {
    const params = {
      page: searchRequest.page || 0,
      size: searchRequest.size || 10,
      sort: `${searchRequest.sortBy || 'createdAt'},${(searchRequest.direction || 'DESC').toLowerCase()}`
    };

    // Add optional filters
    if (searchRequest.productId) {
      params.productId = searchRequest.productId;
    }
    if (searchRequest.userId) {
      params.userId = searchRequest.userId;
    }
    if (searchRequest.rating) {
      params.rating = searchRequest.rating;
    }
    if (searchRequest.comment) {
      params.comment = searchRequest.comment;
    }

    const response = await api.get('/reviews/search', { params });
    return response.data; // Return unwrapped data like other APIs
  } catch (error) {
    console.error('Error searching reviews:', error);
    throw error;
  }
};


// Update review
export const updateReview = async (reviewId, reviewData) => {
  try {
    const payload = {
      productId: reviewData.productId,
      userId: reviewData.userId,
      orderId: reviewData.orderId,
      title: reviewData.title,
      comment: reviewData.comment,
      rating: reviewData.rating,
      isHidden: reviewData.isHidden
    };

    // Only add variantId if it exists
    if (reviewData.variantId) {
      payload.variantId = reviewData.variantId;
    }

    console.log('Updating review with payload:', payload);
    const response = await api.put(`/reviews/${reviewId}`, payload);
    return response.data;
  } catch (error) {
    console.error('Error updating review:', error);
    console.error('Error details:', error.response?.data);
    throw error;
  }
};

// Delete review
export const deleteReview = async (reviewId) => {
  try {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

// Get review by ID
export const getReview = async (reviewId) => {
  try {
    const response = await api.get(`/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting review:', error);
    throw error;
  }
};
