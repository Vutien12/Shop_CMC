<template>
  <!-- Modal Overlay -->
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <!-- Close Button -->
      <button class="btn-close" @click="closeModal">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <!-- Modal Header -->
      <h2 class="modal-title">{{ existingReview ? 'Update Review' : 'Add a Review' }}</h2>

      <!-- Review Form -->
      <form @submit.prevent="handleSubmit" class="review-form">
        <!-- Product Selection (if order has multiple products and no direct product passed) -->
        <div v-if="!product && availableProducts.length > 1" class="form-group">
          <label> Select Product <span class="required">*</span> </label>
          <select v-model="selectedProductId" class="form-input">
            <option value="" disabled>Choose a product</option>
            <option v-for="prod in availableProducts" :key="prod.id" :value="prod.id">
              {{ prod.productName }}
            </option>
          </select>
        </div>

        <!-- Selected Product Display -->
        <div v-if="selectedProduct" class="selected-product">
          <strong>Product:</strong> {{ selectedProduct.productName }}
          <span v-if="existingReview" class="review-status">(Already Reviewed)</span>
        </div>

        <!-- Rating -->
        <div class="form-group">
          <label> Your Rating <span class="required">*</span> </label>
          <div class="star-rating">
            <i
              v-for="star in 5"
              :key="star"
              :class="['fa-star', star <= rating ? 'fa-solid' : 'fa-regular']"
              @click="setRating(star)"
              @mouseover="hoverRating = star"
              @mouseleave="hoverRating = 0"
              :style="{ color: hoverRating >= star || rating >= star ? '#ffc107' : '#dee2e6' }"
            ></i>
          </div>
          <span v-if="errors.rating" class="error-message">{{ errors.rating }}</span>
        </div>

        <!-- Name -->
        <div class="form-group">
          <label> Name <span class="required">*</span> </label>
          <input type="text" v-model="name" class="form-input" :class="{ 'input-error': errors.title }"/>
          <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
        </div>

        <!-- Comment -->
        <div class="form-group">
          <label> Comment <span class="required">*</span> </label>
          <textarea v-model="comment" class="form-textarea" rows="4" :class="{ 'input-error': errors.comment }"></textarea>
          <span v-if="errors.comment" class="error-message">{{ errors.comment }}</span>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="btn-submit">
          {{ existingReview ? 'Update Review' : 'Submit Review' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { createReview, updateReview } from '@/api/reviewApi.js'
import { getMyInfo } from '@/api/accountApi.js'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  productId: {
    type: [String, Number],
    default: null,
  },
  order: {
    type: Object,
    default: null,
  },
  product: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'submit'])

const rating = ref(0)
const hoverRating = ref(0)
const name = ref('')
const comment = ref('')
const selectedProductId = ref('')

// Validation errors from backend
const errors = ref({
  rating: '',
  title: '',
  comment: ''
})

// Get all products from order
const products = computed(() => {
  if (!props.order || !props.order.orderProducts) {
    return []
  }
  return props.order.orderProducts
})

// Filter products that haven't been reviewed yet (only for selection, not for direct product prop)
const availableProducts = computed(() => {
  if (props.product) return [props.product] // If specific product passed, only show that one
  return products.value.filter((p) => !p.review) // Only show products without reviews
})

// Get selected product - prioritize direct product prop, then from products array
const selectedProduct = computed(() => {
  if (props.product) {
    return props.product
  }

  if (!selectedProductId.value && availableProducts.value.length === 1) {
    return availableProducts.value[0]
  }
  return products.value.find((p) => p.id === selectedProductId.value)
})

// Check if selected product has existing review
const existingReview = computed(() => {
  return selectedProduct.value?.review || null
})

const isFormValid = computed(() => {
  return (
    rating.value > 0 &&
    name.value.trim() !== '' &&
    comment.value.trim() !== '' &&
    selectedProduct.value
  )
})

// Auto-select first available product if only one, and load existing review if present
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      // Auto-select if only one available product
      if (!props.product && availableProducts.value.length === 1 && !selectedProductId.value) {
        selectedProductId.value = availableProducts.value[0].id
      }
    }
  },
)

// Watch for selected product changes to load existing review data
watch(
  () => selectedProduct.value,
  (product) => {
    if (product && props.isOpen) {
      // Load existing review data if product already reviewed
      if (product.review) {
        rating.value = product.review.rating || 0
        name.value = product.review.title || ''
        comment.value = product.review.comment || product.review.content || ''
        console.log('Loaded existing review:', product.review)
      } else {
        // Reset form if no review exists
        rating.value = 0
        name.value = ''
        comment.value = ''
      }
    }
  },
  { immediate: true }
)

const setRating = (star) => {
  rating.value = star
}

const closeModal = () => {
  emit('close')
  resetForm()
}

const resetForm = () => {
  rating.value = 0
  name.value = ''
  comment.value = ''
  selectedProductId.value = ''
  errors.value = { rating: '', title: '', comment: '' }
}

const handleSubmit = async () => {
  try {
    // Get userId from API first to satisfy backend validation
    const userInfoResponse = await getMyInfo()
    const userId = userInfoResponse.data?.result?.id

    if (!userId) {
      alert('Unable to get user information. Please try again.')
      return
    }

    // Backend validates with @Valid, just send the data
    const reviewData = {
      userId: parseInt(userId),
      productId: parseInt(selectedProduct.value.productId),
      orderId: parseInt(props.order?.id),
      variantId: selectedProduct.value.productVariantId ? parseInt(selectedProduct.value.productVariantId) : null,
      rating: parseInt(rating.value) || 0,
      title: name.value.trim(),
      comment: comment.value.trim(),
    }

    console.log('Submitting review:', reviewData)

    let response

    if (existingReview.value) {
      // Update existing review
      response = await updateReview(existingReview.value.id, reviewData)
      console.log('Review updated:', response)
    } else {
      // Create new review
      response = await createReview(reviewData)
      console.log('Review created:', response)
    }

    // Emit success event with additional info
    emit('submit', {
      ...reviewData,
      productName: selectedProduct.value.productName,
      isUpdate: !!existingReview.value,
      date: new Date().toISOString(),
    })
    resetForm()
    closeModal()
  } catch (error) {
    console.error('Error submitting review:', error)
    console.error('Error response:', error.response?.data)

    // Parse backend validation errors from result object
    if (error.response?.data?.message === 'Validation failed' && error.response.data.result) {
      const fieldErrors = error.response.data.result

      // Clear previous errors
      errors.value = { rating: '', title: '', comment: '' }

      // Map backend field errors to form errors
      if (fieldErrors.rating) {
        errors.value.rating = fieldErrors.rating
      }
      if (fieldErrors.title) {
        errors.value.title = fieldErrors.title
      }
      if (fieldErrors.comment) {
        errors.value.comment = fieldErrors.comment
      }
    } else {
      // Other errors
      alert(error.response?.data?.message || 'Failed to submit review.')
    }
  }
}
</script>

<style src="./Review.css"></style>
