<template>
  <!-- Modal Overlay -->
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <!-- Close Button -->
      <button class="btn-close" @click="closeModal">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <!-- Modal Header -->
      <h2 class="modal-title">Add a review</h2>

      <!-- Review Form -->
      <form @submit.prevent="handleSubmit" class="review-form">
        <!-- Rating -->
        <div class="form-group">
          <label>
            Your Rating <span class="required">*</span>
          </label>
          <div class="star-rating">
            <i
              v-for="star in 5"
              :key="star"
              :class="['fa-star', star <= rating ? 'fa-solid' : 'fa-regular']"
              @click="setRating(star)"
              @mouseover="hoverRating = star"
              @mouseleave="hoverRating = 0"
              :style="{ color: (hoverRating >= star || rating >= star) ? '#ffc107' : '#dee2e6' }"
            ></i>
          </div>
        </div>

        <!-- Name -->
        <div class="form-group">
          <label>
            Name <span class="required">*</span>
          </label>
          <input
            type="text"
            v-model="name"
            class="form-input"
            required
          />
        </div>

        <!-- Comment -->
        <div class="form-group">
          <label>
            Comment <span class="required">*</span>
          </label>
          <textarea
            v-model="comment"
            class="form-textarea"
            rows="4"
            required
          ></textarea>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="btn-submit"
          :disabled="!isFormValid"
        >
          Submit Review
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  productId: {
    type: [String, Number],
    default: null
  }
});

const emit = defineEmits(['close', 'submit']);

const rating = ref(0);
const hoverRating = ref(0);
const name = ref('');
const comment = ref('');

const isFormValid = computed(() => {
  return rating.value > 0 && name.value.trim() !== '' && comment.value.trim() !== '';
});

const setRating = (star) => {
  rating.value = star;
};

const closeModal = () => {
  emit('close');
};

const handleSubmit = () => {
  if (isFormValid.value) {
    const reviewData = {
      productId: props.productId,
      rating: rating.value,
      name: name.value,
      comment: comment.value,
      date: new Date().toISOString()
    };

    emit('submit', reviewData);

    // Reset form
    rating.value = 0;
    name.value = '';
    comment.value = '';

    closeModal();
  }
};
</script>

<style src="./Review.css"></style>

