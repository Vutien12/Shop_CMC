<template>
  <div class="cart-wrapper">
    <!-- Overlay -->
    <div
      v-if="isOpen"
      class="cart-overlay"
      @click="closeCart"
    ></div>

    <!-- Cart Sidebar -->
    <div :class="['cart-sidebar', { 'cart-open': isOpen }]">
    <!-- Cart Header -->
    <div class="cart-header">
      <div class="cart-title">
        <h2>My Cart</h2>
        <span class="cart-count">{{ cartItems.length }}</span>
      </div>
      <button class="cart-close-btn" @click="closeCart">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <!-- Cart Body -->
    <div class="cart-body">
      <!-- Empty Cart State -->
      <div v-if="cartItems.length === 0" class="empty-cart">
        <div class="empty-cart-icon">
          <i class="fa-solid fa-cart-shopping"></i>
        </div>
        <h3>Your cart is empty</h3>
        <p>Add items to get started</p>
        <router-link to="/product" class="btn-browse" @click="closeCart">
          Browse Products
        </router-link>
      </div>

      <!-- Cart Items -->
      <div v-else class="cart-items">
        <div
          v-for="item in cartItems"
          :key="item.id"
          class="cart-item"
        >
          <div class="item-image">
            <img :src="item.image" :alt="item.name" />
          </div>
          <div class="item-details">
            <h4 class="item-name">{{ item.name }}</h4>
            <div class="item-price">${{ item.price }}</div>
            <div class="item-quantity">
              <button
                class="qty-btn"
                @click="decreaseQuantity(item.id)"
              >
                <i class="fa-solid fa-minus"></i>
              </button>
              <span class="qty-value">{{ item.quantity }}</span>
              <button
                class="qty-btn"
                @click="increaseQuantity(item.id)"
              >
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
          <button
            class="item-remove"
            @click="removeItem(item.id)"
            title="Remove"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Cart Footer -->
    <div v-if="cartItems.length > 0" class="cart-footer">
      <div class="cart-subtotal">
        <span>Subtotal</span>
        <span class="subtotal-amount">${{ subtotal.toFixed(2) }}</span>
      </div>
      <div class="cart-footer-buttons">
        <button class="btn-clear-cart" @click="clearCart">
          Clear Cart
        </button>
        <router-link to="/cart" class="btn-view-cart" @click="closeCart">
          View Cart
        </router-link>
        <router-link to="/checkout" class="btn-checkout" @click="closeCart">
          Checkout
        </router-link>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

defineOptions({
  name: 'UserCart'
});

const isOpen = ref(false);
const cartItems = ref([]);

// Load cart from localStorage
const loadCart = () => {
  const saved = localStorage.getItem('userCart');
  if (saved) {
    cartItems.value = JSON.parse(saved);
  }
};

// Calculate subtotal
const subtotal = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + (parseFloat(item.price) * item.quantity);
  }, 0);
});

// Open cart
const openCart = () => {
  isOpen.value = true;
  document.body.style.overflow = 'hidden';
};

// Close cart
const closeCart = () => {
  isOpen.value = false;
  document.body.style.overflow = '';
};

// Increase quantity
const increaseQuantity = (id) => {
  const item = cartItems.value.find(item => item.id === id);
  if (item) {
    item.quantity++;
    saveCart();
  }
};

// Decrease quantity
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

// Clear cart
const clearCart = () => {
  if (confirm('Are you sure you want to clear your cart?')) {
    cartItems.value = [];
    saveCart();
  }
};

// Save cart to localStorage
const saveCart = () => {
  localStorage.setItem('userCart', JSON.stringify(cartItems.value));
  window.dispatchEvent(new Event('cartChanged'));
};

// Load cart on mount
onMounted(() => {
  loadCart();

  // Listen for cart changes
  window.addEventListener('cartChanged', loadCart);

  // Listen for open cart event
  window.addEventListener('openCart', openCart);
});

// Expose methods
defineExpose({
  openCart,
  closeCart
});
</script>

<style src="./Cart.css" scoped></style>
