<template>
  <div class="account-wrapper">
    <Header1 />

    <Loading v-if="isLoading" />

    <div v-else class="account-page">
      <!-- Sidebar -->
      <aside class="account-sidebar">
        <nav class="sidebar-nav">
          <router-link to="/account" class="nav-item">
            <i class="fa-solid fa-gauge"></i>
            <span>Dashboard</span>
          </router-link>
          <router-link to="/orders" class="nav-item">
            <i class="fa-solid fa-cart-shopping"></i>
            <span>My Orders</span>
          </router-link>
          <router-link to="/wishlist" class="nav-item">
            <i class="fa-regular fa-heart"></i>
            <span>My Wishlist</span>
          </router-link>
          <router-link to="/addresses" class="nav-item">
            <i class="fa-regular fa-address-book"></i>
            <span>My Addresses</span>
          </router-link>
          <router-link to="/profile" class="nav-item">
            <i class="fa-regular fa-user"></i>
            <span>My Profile</span>
          </router-link>
          <a href="#" class="nav-item" @click.prevent="handleLogout">
            <i class="fa-solid fa-right-from-bracket"></i>
            <span>Logout</span>
          </a>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="account-main">
        <!-- Breadcrumb -->
        <div class="breadcrumb">
          <router-link to="/">Home</router-link>
          <i class="fa-solid fa-chevron-right"></i>
          <router-link to="/account">My Account</router-link>
          <i class="fa-solid fa-chevron-right"></i>
          <span>My Orders</span>
        </div>

        <!-- Orders Section -->
        <section class="orders-section">
          <h2>My Orders</h2>

          <!-- Empty state -->
          <div v-if="orders.length === 0" class="empty-orders">
            <i class="fa-solid fa-cart-shopping"></i>
            <p>You haven't placed any orders yet</p>
            <router-link to="/product" class="btn-shop">Start Shopping</router-link>
          </div>

          <!-- Orders table -->
          <div v-else class="orders-table-wrapper">
            <table class="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Review</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in orders" :key="order.id">
                  <td data-label="Order ID">
                    <div class="order-id">{{ order.id }}</div>
                  </td>
                  <td data-label="Date">
                    <div class="order-date">{{ order.date }}</div>
                  </td>
                  <td data-label="Status">
                    <span class="status-badge" :class="order.statusClass">
                      {{ order.status }}
                    </span>
                  </td>
                  <td data-label="Total">
                    <div class="order-total">{{ order.total }}</div>
                  </td>
                  <td data-label="Review">
                    <button class="btn-review" @click="openReviewModal(order)">
                      <i class="fa-solid fa-pen"></i>
                    </button>
                  </td>
                  <td data-label="Action">
                    <button class="btn-view" @click="viewOrder(order.id)">
                      <i class="fa-regular fa-eye"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>

    <!-- Review Modal -->
    <Review
      :isOpen="isReviewModalOpen"
      :productId="selectedProductForReview?.id"
      :productName="selectedProductForReview?.name"
      @close="closeReviewModal"
      @submit="handleReviewSubmit"
    />

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, defineOptions } from 'vue';
import { useRouter } from 'vue-router';
import Header1 from '@/User/components/Header/Header1.vue';
import Footer from '@/User/components/Footer/Footer.vue';
import Loading from '@/User/components/Loading/Loading.vue';
import Review from '@/User/components/Review/Review.vue';

defineOptions({
  name: 'MyOrderPage'
});

const router = useRouter();
const isLoading = ref(true);
const orders = ref([]);
const isReviewModalOpen = ref(false);
const selectedOrder = ref(null);
const selectedProductForReview = ref(null);

const loadOrders = () => {
  const savedOrders = localStorage.getItem('userOrders');
  if (savedOrders) {
    try {
      orders.value = JSON.parse(savedOrders);
      console.log('Loaded orders:', orders.value);
    } catch (error) {
      console.error('Error loading orders:', error);
      orders.value = [];
    }
  }
};

const openReviewModal = (order) => {
  selectedOrder.value = order;

  // Get the first product from the order to review
  if (order.items && order.items.length > 0) {
    selectedProductForReview.value = order.items[0];
    isReviewModalOpen.value = true;
  } else {
    alert('No products found in this order');
  }
};

const closeReviewModal = () => {
  isReviewModalOpen.value = false;
  selectedOrder.value = null;
  selectedProductForReview.value = null;
};

const handleReviewSubmit = (reviewData) => {
  console.log('Review submitted:', reviewData);

  // Add product information to review
  const completeReviewData = {
    ...reviewData,
    productId: selectedProductForReview.value.id,
    productName: selectedProductForReview.value.name,
    orderId: selectedOrder.value.id,
    userName: reviewData.name,
    userRating: reviewData.rating,
    userComment: reviewData.comment,
    date: new Date().toISOString()
  };

  // Save review to localStorage
  const reviews = JSON.parse(localStorage.getItem('productReviews') || '[]');
  reviews.push(completeReviewData);
  localStorage.setItem('productReviews', JSON.stringify(reviews));

  console.log('Review saved:', completeReviewData);

  // Show success message
  alert('Thank you for your review!');
};

const viewOrder = (orderId) => {
  console.log('View order:', orderId);
  // Navigate to order detail page
  // router.push(`/order/${orderId}`);
};

const handleLogout = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userEmail');
  window.dispatchEvent(new Event('loginStatusChanged'));
  router.push('/login');
};

onMounted(() => {
  loadOrders();
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
});
</script>

<style src="./MyOrder.css" scoped></style>
