<template>
  <div class="contact-wrapper">
    <Header />

    <div class="contact-page">
      <!-- Left Side - Contact Info with Map Background -->
      <div class="contact-info-section">
        <h1 class="contact-title">Contact</h1>

        <div class="contact-details">
          <div class="contact-item">
            <i class="fa-solid fa-phone"></i>
            <span>+990123456789</span>
          </div>

          <div class="contact-item">
            <i class="fa-solid fa-envelope"></i>
            <span>admin@email.com</span>
          </div>

          <div class="contact-item">
            <i class="fa-solid fa-map-marker-alt"></i>
            <span>Dhaka, Mohammadpur</span>
          </div>
        </div>

        <div class="social-links">
          <a href="#" class="social-icon">
            <i class="fa-brands fa-facebook-f"></i>
          </a>
          <a href="#" class="social-icon">
            <i class="fa-brands fa-x-twitter"></i>
          </a>
          <a href="#" class="social-icon">
            <i class="fa-brands fa-instagram"></i>
          </a>
          <a href="#" class="social-icon">
            <i class="fa-brands fa-youtube"></i>
          </a>
        </div>
      </div>

      <!-- Right Side - Contact Form -->
      <div class="contact-form-section">
        <h2 class="form-title">Leave a Message</h2>

        <form @submit.prevent="handleSubmit" class="contact-form">
          <div class="form-row">
            <div class="form-group">
              <label>
                Email <span class="required">*</span>
              </label>
              <input
                type="email"
                v-model="formData.email"
                placeholder="admin@email.com"
                required
              />
            </div>

            <div class="form-group">
              <label>
                Subject <span class="required">*</span>
              </label>
              <input
                type="text"
                v-model="formData.subject"
                placeholder="Fix"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label>
              Message <span class="required">*</span>
            </label>
            <textarea
              v-model="formData.message"
              rows="6"
              required
            ></textarea>
          </div>

          <button type="submit" class="btn-submit" :disabled="!isFormValid || isSubmitting">
            {{ isSubmitting ? 'SENDING...' : 'SEND MESSAGE' }}
          </button>
        </form>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Header from '@/User/components/Header1/Header.vue';
import Footer from '@/User/components/Footer/Footer.vue';
import { useToast } from '@/User/components/Toast/useToast.js';
import { sendContactSupport } from '@/api/contactApi.js';

const { add: toast } = useToast();

const formData = ref({
  email: '',
  subject: '',
  message: ''
});

const isSubmitting = ref(false);

const isFormValid = computed(() => {
  return formData.value.email &&
         formData.value.subject &&
         formData.value.message;
});

const handleSubmit = async () => {
  if (isFormValid.value && !isSubmitting.value) {
    isSubmitting.value = true;

    try {
      const response = await sendContactSupport(formData.value);

      toast(response.message || 'Yêu cầu hỗ trợ của bạn đã được gửi thành công!', 'success');

      // Reset form
      formData.value = {
        email: '',
        subject: '',
        message: ''
      };
    } catch (error) {
      console.error('Error submitting contact form:', error);
      const errorMessage = error.response?.data?.message || 'Không thể gửi yêu cầu. Vui lòng thử lại sau!';
      toast(errorMessage, 'error');
    } finally {
      isSubmitting.value = false;
    }
  }
};
</script>

<style src="./Contact.css" scoped></style>
