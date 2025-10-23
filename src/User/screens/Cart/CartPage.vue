<template>
  <div class="cart-page-wrapper">
    <Header1 />

    <Loading v-if="isLoading" />

    <div v-else class="cart-page">
      <div class="container">
        <!-- Progress Steps -->
        <div class="checkout-steps">
          <div class="step active">
            <span class="step-number">1</span>
            <span class="step-title">My Cart</span>
          </div>
          <div class="step">
            <span class="step-number">2</span>
            <span class="step-title">Checkout</span>
          </div>
          <div class="step">
            <span class="step-number">3</span>
            <span class="step-title">Order Complete</span>
          </div>
        </div>

        <!-- Empty Cart -->
        <div v-if="cartItems.length === 0" class="empty-cart-state">
          <div class="empty-icon">
            <i class="fa-solid fa-cart-shopping"></i>
          </div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet</p>
          <router-link to="/product" class="btn-continue">Continue Shopping</router-link>
        </div>

        <!-- Cart Content -->
        <div v-else class="cart-content">
          <!-- Cart Table -->
          <div class="cart-table-section">
            <table class="cart-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Unit Price</th>
                  <th>Quantity</th>
                  <th>Line Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in cartItems" :key="item.id">
                  <td data-label="Image">
                    <div class="product-image">
                      <img :src="item.image" :alt="item.name" />
                    </div>
                  </td>
                  <td data-label="Product">
                    <div class="product-name">
                      <h3>{{ item.name }}</h3>
                      <p class="product-color">Color: White</p>
                    </div>
                  </td>
                  <td data-label="Unit Price">
                    <div class="unit-price">${{ item.price }}</div>
                  </td>
                  <td data-label="Quantity">
                    <div class="quantity-controls">
                      <button @click="decreaseQuantity(item.id)" class="qty-btn">
                        <i class="fa-solid fa-minus"></i>
                      </button>
                      <input type="text" :value="item.quantity" readonly class="qty-input" />
                      <button @click="increaseQuantity(item.id)" class="qty-btn">
                        <i class="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  </td>
                  <td data-label="Line Total">
                    <div class="line-total">
                      ${{ (parseFloat(item.price) * item.quantity).toFixed(2) }}
                    </div>
                  </td>
                  <td>
                    <button class="remove-btn" @click="removeItem(item.id)">
                      <i class="fa-solid fa-xmark"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Cart Summary -->
          <div class="cart-summary">
            <h3>Cart Summary</h3>
            <div class="summary-row total">
              <span>Total</span>
              <span class="total-amount">${{ total.toFixed(2) }}</span>
            </div>
            <button class="btn-checkout" @click="proceedToCheckout">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Header1 from '@/User/components/Header/Header1.vue';
import Footer from '@/User/components/Footer/Footer.vue';
import Loading from '@/User/components/Loading/Loading.vue';

const router = useRouter();

const isLoading = ref(true);
const cartItems = ref([]);

// Load cart
const loadCart = () => {
  const saved = localStorage.getItem('userCart');
  if (saved) {
    cartItems.value = JSON.parse(saved);
  }
};

// Save cart
const saveCart = () => {
  localStorage.setItem('userCart', JSON.stringify(cartItems.value));
  window.dispatchEvent(new Event('cartChanged'));
};

// Calculations
const subtotal = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + (parseFloat(item.price) * item.quantity);
  }, 0);
});

const total = computed(() => subtotal.value);

// Quantity controls
const increaseQuantity = (id) => {
  const item = cartItems.value.find(item => item.id === id);
  if (item) {
    item.quantity++;
    saveCart();
  }
};

const decreaseQuantity = (id) => {
  const item = cartItems.value.find(item => item.id === id);
  if (item && item.quantity > 1) {
    item.quantity--;
    saveCart();
  }
};

// Remove item
const removeItem = (id) => {
  cartItems.value = cartItems.value.filter(item => item.id !== id);
  saveCart();
};

// Proceed to checkout
const proceedToCheckout = () => {
  if (cartItems.value.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  router.push('/checkout');
};

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
  loadCart();
  window.addEventListener('cartChanged', loadCart);
});
</script>

<style src="./CartPage.css" scoped></style>
