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
            <span>{{ contactInfo.phone }}</span>
          </div>

          <div class="contact-item">
            <i class="fa-solid fa-envelope"></i>
            <span>{{ contactInfo.email }}</span>
          </div>

          <div class="contact-item">
            <i class="fa-solid fa-map-marker-alt"></i>
            <span>{{ contactInfo.address }}</span>
          </div>
        </div>

        <div class="social-links">
          <a :href="contactInfo.facebook" class="social-icon" target="_blank" rel="noopener noreferrer">
            <i class="fa-brands fa-facebook-f"></i>
          </a>
          <a :href="contactInfo.twitter" class="social-icon" target="_blank" rel="noopener noreferrer">
            <i class="fa-brands fa-x-twitter"></i>
          </a>
          <a :href="contactInfo.instagram" class="social-icon" target="_blank" rel="noopener noreferrer">
            <i class="fa-brands fa-instagram"></i>
          </a>
          <a :href="contactInfo.youtube" class="social-icon" target="_blank" rel="noopener noreferrer">
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
    <BottomNavBar />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Header from '@/User/components/Header1/Header.vue';
import Footer from '@/User/components/Footer/Footer.vue';
import BottomNavBar from '@/User/components/BottomNavBar.vue'
import { useToast } from '@/User/components/Toast/useToast.js';
import { sendContactSupport, getContactInfo } from '@/api/contactApi.js';

const { add: toast } = useToast();

const formData = ref({
  email: '',
  subject: '',
  message: ''
});

const contactInfo = ref({
  phone: '+990123456789',
  email: 'admin@email.com',
  address: 'Dhaka, Mohammadpur',
  facebook: '#',
  twitter: '#',
  instagram: '#',
  youtube: '#'
});

const isSubmitting = ref(false);
const isLoadingInfo = ref(false);

const isFormValid = computed(() => {
  return formData.value.email &&
         formData.value.subject &&
         formData.value.message;
});

const fetchContactInfo = async () => {
  isLoadingInfo.value = true;
  try {
    const response = await getContactInfo();
    if (response.code === 200 && response.result) {
      contactInfo.value = {
        phone: response.result.phone || contactInfo.value.phone,
        email: response.result.email || contactInfo.value.email,
        address: response.result.address?.fullAddress || response.result.address || contactInfo.value.address,
        facebook: response.result.facebook || contactInfo.value.facebook,
        twitter: response.result.twitter || contactInfo.value.twitter,
        instagram: response.result.instagram || contactInfo.value.instagram,
        youtube: response.result.youtube || contactInfo.value.youtube
      };
    }
  } catch (error) {
    console.error('Error fetching contact info:', error);
    // Keep default values if API fails
  } finally {
    isLoadingInfo.value = false;
  }
};

const handleSubmit = async () => {
  if (isFormValid.value && !isSubmitting.value) {
    isSubmitting.value = true;

    try {
      const response = await sendContactSupport(formData.value);

      toast(response.message || 'Your support request has been sent successfully!', 'success');

      // Reset form
      formData.value = {
        email: '',
        subject: '',
        message: ''
      };
    } catch (error) {
      console.error('Error submitting contact form:', error);
      const errorMessage = error.response?.data?.message || 'Unable to send request. Please try again later!';
      toast(errorMessage, 'error');
    } finally {
      isSubmitting.value = false;
    }
  }
};

onMounted(() => {
  fetchContactInfo();
});
</script>

<style src="./Contact.css" scoped></style>
