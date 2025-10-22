<template>
  <div class="checkout-wrapper">
    <Header1 />

    <div class="checkout-page">
      <!-- Checkout Steps -->
      <div class="checkout-steps">
        <div class="step">
          <span class="step-number">1</span>
          <span class="step-title">My Cart</span>
        </div>
        <div class="step active">
          <span class="step-number">2</span>
          <span class="step-title">Checkout</span>
        </div>
        <div class="step">
          <span class="step-number">3</span>
          <span class="step-title">Order Complete</span>
        </div>
      </div>

      <!-- Checkout Content -->
      <div class="checkout-content">
        <!-- Left Side - Billing Details -->
        <div class="checkout-left">
            <h2>Billing Details</h2>

            <!-- Saved Addresses -->
            <div class="saved-addresses">
              <div
                v-for="address in addresses"
                :key="address.id"
                :class="['address-card', { selected: selectedAddressId === address.id }]"
                @click="selectAddress(address.id)"
              >
                <input
                  type="radio"
                  class="address-radio"
                  :checked="selectedAddressId === address.id"
                  @change="selectAddress(address.id)"
                />
                <div class="address-content">
                  <h4>{{ address.firstName }} {{ address.lastName }}</h4>
                  <p class="address-text">
                    {{ address.address1 }}<br v-if="address.address1" />
                    <span v-if="address.address2">{{ address.address2 }}<br /></span>
                    {{ address.city }}, {{ address.state }} {{ address.postcode }}<br />
                    {{ address.country }}
                  </p>
                </div>
                <span v-if="address.isDefault" class="default-badge">Default</span>
              </div>
            </div>

            <!-- Add New Address Button -->
            <button class="btn-add-address" @click="toggleNewAddressForm">
              <i class="fa-solid fa-plus"></i>
              Add New Address
            </button>

            <!-- New Address Form -->
            <div v-if="showNewAddressForm" class="new-address-form">
              <h3>New Address</h3>
              <form @submit.prevent="saveNewAddress" class="address-form">
                <div class="form-row">
                  <div class="form-group">
                    <label>First Name <span class="required">*</span></label>
                    <input type="text" v-model="newAddress.firstName" required class="form-input" />
                  </div>
                  <div class="form-group">
                    <label>Last Name <span class="required">*</span></label>
                    <input type="text" v-model="newAddress.lastName" required class="form-input" />
                  </div>
                </div>

                <div class="form-group">
                  <label>Street Address <span class="required">*</span></label>
                  <input
                    type="text"
                    v-model="newAddress.address1"
                    placeholder="Address Line 1"
                    required
                    class="form-input"
                  />
                  <input
                    type="text"
                    v-model="newAddress.address2"
                    placeholder="Address Line 2 (optional)"
                    class="form-input mt-2"
                  />
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>City <span class="required">*</span></label>
                    <input type="text" v-model="newAddress.city" required class="form-input" />
                  </div>
                  <div class="form-group">
                    <label>Postcode / ZIP <span class="required">*</span></label>
                    <input type="text" v-model="newAddress.postcode" required class="form-input" />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Country <span class="required">*</span></label>
                    <select v-model="newAddress.country" required class="form-select">
                      <option value="">Please Select</option>
                      <option value="Bangladesh">Bangladesh</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Vietnam">Vietnam</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>State / Province <span class="required">*</span></label>
                    <select v-model="newAddress.state" required class="form-select">
                      <option value="">Please Select</option>
                      <option value="State 1">Hà Nội</option>
                      <option value="State 2">Hồ Chí Minh</option>
                      <option value="State 3">Đà Nẵng</option>
                    </select>
                  </div>
                </div>

                <div class="form-actions">
                  <button type="button" class="btn-cancel" @click="cancelNewAddress">Cancel</button>
                  <button type="submit" class="btn-save">Save Address</button>
                </div>
              </form>
            </div>

            <!-- Ship to Different Address -->
            <div class="ship-different">
              <label class="checkbox-label">
                <input type="checkbox" v-model="shipToDifferent" />
                <span>Ship to a different address</span>
              </label>
            </div>

            <!-- Order Note -->
            <div class="order-note">
              <h3>Order Note</h3>
              <textarea
                v-model="orderNote"
                placeholder="Special note for delivery"
                class="order-note-textarea"
              ></textarea>
            </div>

            <!-- Payment Method -->
            <div class="payment-method">
              <h3>Payment Method</h3>
              <div class="payment-options">
                <label class="payment-option" :class="{ selected: selectedPayment === 'paypal' }">
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    v-model="selectedPayment"
                  />
                  <div class="payment-info">
                    <h4>PayPal</h4>
                    <p>Pay via your PayPal account.</p>
                  </div>
                </label>

                <label class="payment-option" :class="{ selected: selectedPayment === 'cod' }">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    v-model="selectedPayment"
                  />
                  <div class="payment-info">
                    <h4>Cash on Delivery</h4>
                    <p>Pay with cash upon delivery.</p>
                  </div>
                </label>
              </div>
            </div>

            <!-- Shipping Method -->
            <div class="shipping-method">
              <h3>Shipping Method</h3>
              <div class="shipping-options">
                <label class="shipping-option" :class="{ selected: selectedShipping === 'free' }">
                  <input
                    type="radio"
                    name="shipping"
                    value="free"
                    v-model="selectedShipping"
                    @change="updateShippingCost(0)"
                  />
                  <div class="shipping-info">
                    <h4>Free Shipping</h4>
                  </div>
                  <div class="shipping-price">$0.00</div>
                </label>

                <label class="shipping-option" :class="{ selected: selectedShipping === 'local' }">
                  <input
                    type="radio"
                    name="shipping"
                    value="local"
                    v-model="selectedShipping"
                    @change="updateShippingCost(20)"
                  />
                  <div class="shipping-info">
                    <h4>Local Pickup</h4>
                  </div>
                  <div class="shipping-price">$20.00</div>
                </label>

                <label class="shipping-option" :class="{ selected: selectedShipping === 'flat' }">
                  <input
                    type="radio"
                    name="shipping"
                    value="flat"
                    v-model="selectedShipping"
                    @change="updateShippingCost(25)"
                  />
                  <div class="shipping-info">
                    <h4>Flat Rate</h4>
                  </div>
                  <div class="shipping-price">$25.00</div>
                </label>
              </div>
            </div>
          </div>

          <!-- Right Side - Order Summary -->
          <div class="checkout-right">
            <div class="order-summary">
              <h2>Order Summary</h2>

              <!-- Cart Items -->
              <div class="cart-items">
                <div v-for="item in cartItems" :key="item.id" class="cart-item">
                  <div class="item-image">
                    <img :src="item.image" :alt="item.name" />
                    <span class="item-quantity">{{ item.quantity }}</span>
                  </div>
                  <div class="item-details">
                    <h4>{{ item.name }}</h4>
                    <p class="item-color">Color: {{ item.color || 'Black' }}</p>
                  </div>
                  <div class="item-price">${{ (parseFloat(item.price) * item.quantity).toFixed(2) }}</div>
                </div>
              </div>

              <!-- Coupon Code -->
              <div class="coupon-section">
                <input
                  type="text"
                  v-model="couponCode"
                  placeholder="Enter coupon code"
                  class="coupon-input"
                />
                <button class="btn-apply" @click="applyCoupon">Apply</button>
              </div>

              <!-- Totals -->
              <div class="order-totals">
                <div class="total-row">
                  <span>Subtotal</span>
                  <span>${{ subtotal.toFixed(2) }}</span>
                </div>
                <div class="total-row">
                  <span>Shipping Cost</span>
                  <span>${{ shippingCost.toFixed(2) }}</span>
                </div>
                <div class="total-row final">
                  <span>Total</span>
                  <span class="total-amount">${{ total.toFixed(2) }}</span>
                </div>
              </div>

              <!-- Terms -->
              <div class="terms">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="agreeToTerms" />
                  <span>I agree to the <a href="#" class="terms-link">Terms & Conditions</a></span>
                </label>
              </div>

              <!-- PayPal Button -->
              <button class="btn-paypal" @click="processPayment">
                <i class="fab fa-paypal"></i>
                PayPal
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

const router = useRouter();

// Data
const cartItems = ref([]);
const addresses = ref([]);
const selectedAddressId = ref(null);
const showNewAddressForm = ref(false);
const shipToDifferent = ref(false);
const orderNote = ref('');
const couponCode = ref('');
const agreeToTerms = ref(false);
const shippingCost = ref(0);
const selectedPayment = ref('paypal');
const selectedShipping = ref('free');

const newAddress = ref({
  firstName: '',
  lastName: '',
  address1: '',
  address2: '',
  city: '',
  postcode: '',
  country: '',
  state: ''
});

// Load cart items
const loadCart = () => {
  const saved = localStorage.getItem('userCart');
  if (saved) {
    cartItems.value = JSON.parse(saved);
  }

  // If cart is empty, redirect back to cart page
  if (cartItems.value.length === 0) {
    router.push('/cart');
  }
};

// Load addresses
const loadAddresses = () => {
  const saved = localStorage.getItem('userAddresses');
  if (saved) {
    addresses.value = JSON.parse(saved);
    // Auto-select first address
    if (addresses.value.length > 0 && !selectedAddressId.value) {
      selectedAddressId.value = addresses.value[0].id;
    }
  }
};

// Computed
const subtotal = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + (parseFloat(item.price) * item.quantity);
  }, 0);
});

const total = computed(() => subtotal.value + shippingCost.value);

// Methods
const selectAddress = (id) => {
  selectedAddressId.value = id;
};

const toggleNewAddressForm = () => {
  showNewAddressForm.value = !showNewAddressForm.value;
};

const updateShippingCost = (cost) => {
  shippingCost.value = cost;
};

const saveNewAddress = () => {
  // Add new address to list
  const address = {
    ...newAddress.value,
    id: Date.now()
  };

  addresses.value.push(address);
  localStorage.setItem('userAddresses', JSON.stringify(addresses.value));

  // Select the new address
  selectedAddressId.value = address.id;

  // Reset form
  cancelNewAddress();
};

const cancelNewAddress = () => {
  showNewAddressForm.value = false;
  newAddress.value = {
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    postcode: '',
    country: '',
    state: ''
  };
};

const applyCoupon = () => {
  if (couponCode.value) {
    alert('Coupon functionality coming soon!');
  }
};

const processPayment = () => {
  if (!agreeToTerms.value) {
    alert('Please agree to the Terms & Conditions');
    return;
  }

  if (!selectedAddressId.value) {
    alert('Please select a billing address');
    return;
  }

  // Process payment logic here
  alert('Processing payment...');
  // Redirect to order complete page
  // router.push('/order-complete');
};

// Lifecycle
onMounted(() => {
  loadCart();
  loadAddresses();
});
</script>

<style src="./Checkout.css" scoped></style>
