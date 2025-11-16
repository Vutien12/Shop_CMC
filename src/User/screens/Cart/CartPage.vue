<template>
  <div class="cart-page-wrapper">
    <Header1 />
    <Loading v-if="isLoading" />

    <div v-else class="cart-page">
      <div class="container">
        <!-- Checkout Steps -->
        <div class="checkout-steps">
          <div class="step active"><span class="step-number">1</span><span class="step-title">My Cart</span></div>
          <div class="step"><span class="step-number">2</span><span class="step-title">Checkout</span></div>
          <div class="step"><span class="step-number">3</span><span class="step-title">Order Complete</span></div>
        </div>

        <!-- Empty State -->
        <div v-if="cartItems.length === 0" class="empty-cart-state">
          <div class="empty-icon"><i class="fa-solid fa-cart-shopping"></i></div>
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
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in cartItems" :key="item.id" class="cart-row">
                <td data-label="Image">
                  <div class="product-image">
                    <img :src="getThumb(item)" :alt="item.productName" />
                  </div>
                </td>
                <td data-label="Product">
                  <div class="product-info">
                    <h3 class="product-name">{{ item.productName }}</h3>
                    <p class="variant-name">{{ getShortVariantName(item.variantName) }}</p>
                    <div class="options-list" v-if="item.cartItemOptions?.length">
                      <small v-for="opt in item.cartItemOptions" :key="opt.id">
                        {{ opt.optionName }}: <strong>{{ opt.valueLabel }}</strong>
                      </small>
                    </div>
                  </div>
                </td>
                <td data-label="Price">
                  <div class="unit-price">{{ formatPrice(item.unitPrice) }}</div>
                </td>
                <td data-label="Qty">
                  <div class="quantity-display">{{ item.qty }}</div>
                </td>
                <td data-label="Total">
                  <div class="line-total">{{ formatPrice(item.lineTotal) }}</div>
                </td>
                <td>
                  <!-- Placeholder cho tương lai (xóa item) -->
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
              <span class="total-amount">{{ formatPrice(total) }}</span>
            </div>
            <div class="summary-actions">
              <button class="btn-clear-cart" @click="handleClear">
                <i class="fa-solid fa-trash-can"></i> Clear Cart
              </button>
              <button class="btn-checkout" @click="proceed">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/User/stores/cartStore.js';
import { useToast } from '@/User/components/Toast/useToast.js';
import Header1 from '@/User/components/Header/Header1.vue';
import Footer from '@/User/components/Footer/Footer.vue';
import Loading from '@/User/components/Loading/Loading.vue';

const router = useRouter();
const cartStore = useCartStore();
const { add: toast } = useToast();

const isLoading = ref(true);
const cartItems = ref([]);
const total = ref(0);

// Format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
    .format(price || 0)
    .replace('₫', 'đ');
};

// Rút gọn tên biến thể: bỏ tên sản phẩm
const getShortVariantName = (fullName) => {
  if (!fullName) return '';
  const productName = cartStore.cartItems[0]?.productName || '';
  return fullName.replace(productName, '').trim().replace(/^[-–—]\s*/, '');
};

const getThumb = (item) => item.productThumbnail || '/images/placeholder.jpg';

const proceed = () => router.push('/checkout');

const handleClear = async () => {
  if (!confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) return;
  try {
    await cartStore.clear();
    toast('Giỏ hàng đã được xóa!', 'success');
  } catch (err) {
    toast('Không thể xóa giỏ hàng', 'error');
  }
};

onMounted(async () => {
  try {
    const data = await cartStore.fetchCart();
    cartItems.value = data.cartItems || [];
    total.value = data.total || 0;
  } catch (err) {
    toast('Không thể tải giỏ hàng', 'error');
  } finally {
    setTimeout(() => isLoading.value = false, 600);
  }

  const updateCart = () => {
    cartItems.value = cartStore.cartItems;
    total.value = cartStore.total;
  };
  window.addEventListener('cartUpdated', updateCart);
});
</script>

<style src="./CartPage.css" scoped></style>
