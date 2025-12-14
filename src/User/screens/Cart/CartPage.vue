<template>
  <div class="cart-page-wrapper">
    <Header />
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

                    <!-- Variant Name (if exists) -->
                    <p v-if="item.variantName" class="variant-name">{{ item.variantName }}</p>

                    <!-- SKU (if exists) -->
                    <p v-if="item.sku" class="product-sku">
                      <i class="fa-solid fa-barcode"></i> SKU: <code>{{ item.sku }}</code>
                    </p>

                    <!-- Deleted Variant Warning -->
                    <div v-if="isVariantDeleted(item)" class="variant-deleted-banner">
                      <i class="fa-solid fa-exclamation-triangle"></i>
                      <span>This variant is no longer available. Displaying saved information.</span>
                    </div>

                    <!-- Changed Variant Warning -->
                    <div v-if="isVariantChanged(item)" class="variant-changed-banner">
                      <i class="fa-solid fa-info-circle"></i>
                      <span>Product details have been updated since you added it to cart.</span>
                      <router-link :to="`/productdetail/${item.productId}`" class="btn-check-link">
                        <i class="fa-solid fa-external-link-alt"></i> View Updates
                      </router-link>
                    </div>

                    <!-- Variations -->
                    <div class="variations-list" v-if="item.cartItemVariations?.length">
                      <div v-for="variation in item.cartItemVariations" :key="variation.id" class="variation-item">
                        <span class="variation-label">{{ variation.variationName }}:</span>
                        <span v-if="variation.type === 'COLOR'" class="variation-color">
                          <span class="color-swatch" :style="{ backgroundColor: variation.cartItemVariationValues[0]?.value }"></span>
                          {{ variation.cartItemVariationValues[0]?.label }}
                        </span>
                        <span v-else class="variation-value">
                          {{ variation.cartItemVariationValues[0]?.label }}
                        </span>
                      </div>
                    </div>

                    <!-- Options -->
                    <div class="options-list" v-if="item.cartItemOptions?.length">
                      <div v-for="opt in item.cartItemOptions" :key="opt.id" class="option-item">
                        <span class="option-label">{{ opt.optionName }}:</span>
                        <strong class="option-value">{{ opt.valueLabel }}</strong>
                        <span v-if="opt.price > 0" class="option-price">
                          (+{{ formatPrice(opt.price) }})
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td data-label="Price">
                  <div class="unit-price">{{ formatPrice(item.unitPrice) }}</div>
                </td>
                <td data-label="Qty">
                  <div class="quantity-controls">
                    <button
                      class="qty-btn"
                      type="button"
                      @click="changeQuantity(item, -1)"
                      :disabled="item.qty <= 1 || isItemUpdating(item.id)"
                    >
                      <i class="fa-solid fa-minus"></i>
                    </button>
                    <div class="qty-input">{{ item.qty }}</div>
                    <button
                      class="qty-btn"
                      type="button"
                      @click="changeQuantity(item, 1)"
                      :disabled="isItemUpdating(item.id)"
                    >
                      <i class="fa-solid fa-plus"></i>
                    </button>
                  </div>
                </td>
                <td data-label="Total">
                  <div class="line-total">{{ formatPrice(item.lineTotal) }}</div>
                </td>
                <td>
                  <button
                    class="remove-btn"
                    type="button"
                    @click="removeItem(item)"
                    :disabled="isItemRemoving(item.id)"
                    title="Remove item"
                  >
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
    <Chatbot />
    <BottomNavBar />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/User/stores/cartStore.js';
import { useToast } from '@/User/components/Toast/useToast.js';
import Header from '@/User/components/Header1/Header.vue';
import Footer from '@/User/components/Footer/Footer.vue';
import Loading from '@/User/components/Loading/Loading.vue';
import Chatbot from '@/User/components/Chatbot/Chatbot.vue'
import BottomNavBar from '@/User/components/BottomNavBar.vue'

const router = useRouter();
const cartStore = useCartStore();
const { add: toast } = useToast();

const isLoading = ref(true);
const cartItems = ref([]);
const total = ref(0);
const updatingItemId = ref(null);
const removingItemId = ref(null);

const isItemUpdating = (id) => updatingItemId.value === id;
const isItemRemoving = (id) => removingItemId.value === id;

// Format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
    .format(price || 0)
    .replace('₫', 'đ');
};

const getThumb = (item) => item.productThumbnail || '/images/placeholder.jpg';

// Check if variant is deleted (all variant info is null)
const isVariantDeleted = (item) => {
  return item.productVariantId === null && item.variantName === null && item.sku === null;
};

// Check if variant has changed (variantName differs from generated name from variations)
const isVariantChanged = (item) => {
  if (!item.variantName || !item.cartItemVariations || item.cartItemVariations.length === 0) {
    return false;
  }

  // Generate expected variant name: productName - label1 - label2 - ...
  const expectedName = item.productName + ' - ' +
    item.cartItemVariations
      .map(v => v.cartItemVariationValues[0]?.label)
      .filter(Boolean)
      .join(' - ');

  return item.variantName !== expectedName;
};

const proceed = () => {
  if (cartItems.value.length === 0) {
    toast('Giỏ hàng trống!', 'error');
    return;
  }
  router.push('/checkout');
};

const handleClear = async () => {
  if (!confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) return;
  try {
    await cartStore.clear();
    toast('Giỏ hàng đã được xóa!', 'success');
  } catch {
    toast('Không thể xóa giỏ hàng', 'error');
  }
};

const changeQuantity = async (item, delta) => {
  const newQty = item.qty + delta;
  if (newQty < 1 || isItemUpdating(item.id)) return;
  updatingItemId.value = item.id;
  try {
    await cartStore.updateQuantity(item.id, newQty);
    toast('Cập nhật số lượng thành công!', 'success');
  } catch (err) {
    toast(err.response?.data?.message || 'Không thể cập nhật số lượng', 'error');
  } finally {
    updatingItemId.value = null;
  }
};

const removeItem = async (item) => {
  if (isItemRemoving(item.id)) return;
  if (!confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) return;
  removingItemId.value = item.id;
  try {
    await cartStore.removeItem(item.id);
    toast('Sản phẩm đã được xóa khỏi giỏ hàng!', 'success');
  } catch (err) {
    toast(err.response?.data?.message || 'Không thể xóa sản phẩm', 'error');
  } finally {
    removingItemId.value = null;
  }
};

const updateCart = () => {
  cartItems.value = cartStore.cartItems;
  total.value = cartStore.total;
};

onMounted(async () => {
  try {
    const data = await cartStore.fetchCart();
    cartItems.value = data.cartItems || [];
    total.value = data.total || 0;
  } catch {
    toast('Không thể tải giỏ hàng', 'error');
  } finally {
    setTimeout(() => (isLoading.value = false), 600);
  }

  window.addEventListener('cartUpdated', updateCart);
});

onUnmounted(() => {
  window.removeEventListener('cartUpdated', updateCart);
});
</script>

<style src="./CartPage.css" scoped></style>
