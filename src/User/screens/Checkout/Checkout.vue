<template>
  <div class="checkout-wrapper">
    <Header />

    <Loading v-if="isLoading" />

    <div v-else class="checkout-page">
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
            <h2>Customer Information</h2>

            <!-- Phone Number Section -->
            <div class="info-section">
              <h3>Phone Number</h3>
              <div v-if="!usePhoneFromProfile" class="form-group">
                <label>Phone Number <span class="required">*</span></label>
                <input
                  type="tel"
                  v-model="manualPhone"
                  placeholder="Enter phone number"
                  required
                  class="form-input"
                />
              </div>
              <div class="checkbox-option">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="usePhoneFromProfile" />
                  <span>Use phone from profile{{ userProfile?.phone ? ': ' + userProfile.phone : '' }}</span>
                </label>
              </div>
            </div>

            <h2>Billing Details</h2>

            <!-- Billing Address Options -->
            <div class="info-section">

              <!-- Saved Addresses -->
              <div v-if="useSavedBillingAddress" class="saved-addresses">
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
                      {{ address.addressLine }}<br v-if="address.addressLine" />
                      <span v-if="address.addressLine2">{{ address.addressLine2 }}<br /></span>
                      {{ address.city }}, {{ address.stateOrProvince }} {{ address.postalCode }}<br />
                      {{ address.country }}
                    </p>
                  </div>
                  <span v-if="address.isDefault" class="default-badge">Default</span>
                </div>
              </div>

              <!-- Manual Billing Address Form -->
              <div v-if="!useSavedBillingAddress" class="manual-address-form">
                <div class="form-row">
                  <div class="form-group">
                    <label>First Name <span class="required">*</span></label>
                    <input type="text" v-model="manualBilling.firstName" required class="form-input" />
                  </div>
                  <div class="form-group">
                    <label>Last Name <span class="required">*</span></label>
                    <input type="text" v-model="manualBilling.lastName" required class="form-input" />
                  </div>
                </div>

                <div class="form-group">
                  <label>Street Address <span class="required">*</span></label>
                  <input
                    type="text"
                    v-model="manualBilling.address1"
                    placeholder="Address Line 1"
                    required
                    class="form-input"
                  />
                  <input
                    type="text"
                    v-model="manualBilling.address2"
                    placeholder="Address Line 2 (optional)"
                    class="form-input mt-2"
                  />
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>City <span class="required">*</span></label>
                    <input type="text" v-model="manualBilling.city" required class="form-input" />
                  </div>
                  <div class="form-group">
                    <label>Postcode / ZIP <span class="required">*</span></label>
                    <input type="text" v-model="manualBilling.zip" required class="form-input" />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Country <span class="required">*</span></label>
                    <select v-model="manualBilling.country" required class="form-select">
                      <option value="">Please Select</option>
                      <option value="Vietnam">Vietnam</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>State / Province <span class="required">*</span></label>
                    <select v-model="manualBilling.state" required class="form-select">
                      <option value="">Please Select</option>
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                      <option value="Đà Nẵng">Đà Nẵng</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="checkbox-option">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="useSavedBillingAddress" />
                  <span>Select from saved addresses</span>
                </label>
              </div>
            </div>

            <h2>Shipping Details</h2>

            <!-- Ship to Different Address -->
            <div class="info-section">
              <div class="checkbox-option">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="shipToDifferent" />
                  <span>Ship to a different address</span>
                </label>
              </div>

              <!-- Shipping Address Options (if different) -->
              <div v-if="shipToDifferent">
                <div class="checkbox-option">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="useSavedShippingAddress" />
                    <span>Select from saved addresses</span>
                  </label>
                </div>

                <!-- Saved Shipping Addresses -->
                <div v-if="useSavedShippingAddress" class="saved-addresses">
                  <div
                    v-for="address in addresses"
                    :key="'ship-' + address.id"
                    :class="['address-card', { selected: selectedShippingAddressId === address.id }]"
                    @click="selectShippingAddress(address.id)"
                  >
                    <input
                      type="radio"
                      class="address-radio"
                      :checked="selectedShippingAddressId === address.id"
                      @change="selectShippingAddress(address.id)"
                    />
                    <div class="address-content">
                      <h4>{{ address.firstName }} {{ address.lastName }}</h4>
                      <p class="address-text">
                        {{ address.addressLine }}<br v-if="address.addressLine" />
                        <span v-if="address.addressLine2">{{ address.addressLine2 }}<br /></span>
                        {{ address.city }}, {{ address.stateOrProvince }} {{ address.postalCode }}<br />
                        {{ address.country }}
                      </p>
                    </div>
                    <span v-if="address.isDefault" class="default-badge">Default</span>
                  </div>
                </div>

                <!-- Manual Shipping Address Form -->
                <div v-if="!useSavedShippingAddress" class="manual-address-form">
                  <div class="form-row">
                    <div class="form-group">
                      <label>First Name <span class="required">*</span></label>
                      <input type="text" v-model="manualShipping.firstName" required class="form-input" />
                    </div>
                    <div class="form-group">
                      <label>Last Name <span class="required">*</span></label>
                      <input type="text" v-model="manualShipping.lastName" required class="form-input" />
                    </div>
                  </div>

                  <div class="form-group">
                    <label>Street Address <span class="required">*</span></label>
                    <input
                      type="text"
                      v-model="manualShipping.address1"
                      placeholder="Address Line 1"
                      required
                      class="form-input"
                    />
                    <input
                      type="text"
                      v-model="manualShipping.address2"
                      placeholder="Address Line 2 (optional)"
                      class="form-input mt-2"
                    />
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label>City <span class="required">*</span></label>
                      <input type="text" v-model="manualShipping.city" required class="form-input" />
                    </div>
                    <div class="form-group">
                      <label>Postcode / ZIP <span class="required">*</span></label>
                      <input type="text" v-model="manualShipping.zip" required class="form-input" />
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label>Country <span class="required">*</span></label>
                      <select v-model="manualShipping.country" required class="form-select">
                        <option value="">Please Select</option>
                        <option value="Vietnam">Vietnam</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label>State / Province <span class="required">*</span></label>
                      <select v-model="manualShipping.state" required class="form-select">
                        <option value="">Please Select</option>
                        <option value="Hà Nội">Hà Nội</option>
                        <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                        <option value="Đà Nẵng">Đà Nẵng</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
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
                <label class="payment-option" :class="{ selected: selectedPayment === 'cod' }">
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    v-model="selectedPayment"
                  />
                  <div class="payment-info">
                    <h4>💵 Thanh toán khi nhận hàng (COD)</h4>
                    <p>Thanh toán bằng tiền mặt khi nhận hàng.</p>
                  </div>
                </label>

                <label class="payment-option" :class="{ selected: selectedPayment === 'bank_transfer' }">
                  <input
                    type="radio"
                    name="payment"
                    value="bank_transfer"
                    v-model="selectedPayment"
                  />
                  <div class="payment-info">
                    <h4>🏦 Chuyển khoản ngân hàng</h4>
                    <p>Chuyển khoản trực tiếp vào tài khoản ngân hàng.</p>
                  </div>
                </label>

                <label class="payment-option" :class="{ selected: selectedPayment === 'vnpay' }">
                  <input
                    type="radio"
                    name="payment"
                    value="vnpay"
                    v-model="selectedPayment"
                  />
                  <div class="payment-info">
                    <h4>💳 VNPay</h4>
                    <p>Thanh toán qua ví điện tử VNPay.</p>
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
                  <div class="shipping-price">{{ formatPrice(0) }}</div>
                </label>

                <label class="shipping-option" :class="{ selected: selectedShipping === 'express' }">
                  <input
                    type="radio"
                    name="shipping"
                    value="express"
                    v-model="selectedShipping"
                    @change="updateShippingCost(50000)"
                  />
                  <div class="shipping-info">
                    <h4>Express Shipping</h4>
                    <p class="shipping-desc">Delivery in 1-2 days</p>
                  </div>
                  <div class="shipping-price">{{ formatPrice(50000) }}</div>
                </label>

                <label class="shipping-option" :class="{ selected: selectedShipping === 'standard' }">
                  <input
                    type="radio"
                    name="shipping"
                    value="standard"
                    v-model="selectedShipping"
                    @change="updateShippingCost(30000)"
                  />
                  <div class="shipping-info">
                    <h4>Standard Shipping</h4>
                    <p class="shipping-desc">Delivery in 3-5 days</p>
                  </div>
                  <div class="shipping-price">{{ formatPrice(30000) }}</div>
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
                    <img :src="getThumb(item)" :alt="item.productName" />
                    <span class="item-quantity">{{ item.qty }}</span>
                  </div>
                  <div class="item-details">
                    <h4>{{ item.productName }}</h4>
                    <p class="item-variant">{{ item.variantName }}</p>
                  </div>
                  <div class="item-price">{{ formatPrice(item.lineTotal) }}</div>
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
                  <span>{{ formatPrice(subtotal) }}</span>
                </div>
                <div class="total-row">
                  <span>Shipping Cost</span>
                  <span>{{ formatPrice(shippingCost) }}</span>
                </div>
                <div class="total-row final">
                  <span>Total</span>
                  <span class="total-amount">{{ formatPrice(total) }}</span>
                </div>
              </div>

              <!-- Terms -->
              <div class="terms">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="agreeToTerms" />
                  <span>I agree to the <a href="#" class="terms-link">Terms & Conditions</a></span>
                </label>
              </div>

              <!-- Place Order Button -->
              <button
                class="btn-paypal"
                @click="processPayment"
                :disabled="isProcessing"
              >
                <i v-if="!isProcessing" class="fa-solid fa-check-circle"></i>
                <i v-else class="fa-solid fa-spinner fa-spin"></i>
                {{ isProcessing ? 'Đang xử lý...' : 'Đặt hàng' }}
              </button>
            </div>
          </div>
        </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/User/stores/cartStore.js'
import { useAddressStore } from '@/User/stores/addressesStore.js'
import { useProfileStore } from '@/User/stores/profileStore.js'
import { useToast } from '@/User/components/Toast/useToast.js'
import { createOrder } from '@/api/orderApi.js'
import Header from '@/User/components/Header1/Header.vue'
import Footer from '@/User/components/Footer/Footer.vue'
import Loading from '@/User/components/Loading/Loading.vue'

const router = useRouter()
const cartStore = useCartStore()
const addressStore = useAddressStore()
const profileStore = useProfileStore() // Used in loadData
const { add: toast } = useToast()

// Data
const isLoading = ref(true)
const cartItems = ref([])
const cartTotal = ref(0)
const addresses = ref([])

// Phone
const usePhoneFromProfile = ref(true)
const manualPhone = ref('')

// Billing Address
const useSavedBillingAddress = ref(true)
const selectedAddressId = ref(null)
const manualBilling = ref({
  firstName: '',
  lastName: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
  country: 'Vietnam'
})

// Shipping Address
const shipToDifferent = ref(false)
const useSavedShippingAddress = ref(true)
const selectedShippingAddressId = ref(null)
const manualShipping = ref({
  firstName: '',
  lastName: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
  country: 'Vietnam'
})

const orderNote = ref('')
const couponCode = ref('')
const couponId = ref(null)
const agreeToTerms = ref(false)
const shippingCost = ref(0)
const selectedPayment = ref('cod')
const selectedShipping = ref('free')
const isProcessing = ref(false)
const userProfile = ref(null)


// Computed
const subtotal = computed(() => cartTotal.value || 0)
const total = computed(() => subtotal.value + shippingCost.value)

// Format price VND
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
    .format(price || 0)
    .replace('₫', 'đ')
}

// Get thumbnail
const getThumb = (item) => item.productThumbnail || '/images/placeholder.jpg'

// Methods
const selectAddress = (id) => {
  selectedAddressId.value = id
}

const selectShippingAddress = (id) => {
  selectedShippingAddressId.value = id
}

const updateShippingCost = (cost) => {
  shippingCost.value = cost
}


const applyCoupon = () => {
  if (couponCode.value) {
    // TODO: Implement coupon validation API call
    // After validation, set: couponId.value = validatedCouponId
    toast('Tính năng mã giảm giá đang phát triển!', 'info')
  }
}

const processPayment = async () => {
  // Validation
  if (!agreeToTerms.value) {
    toast('Vui lòng đồng ý với Điều khoản & Điều kiện', 'error')
    return
  }

  if (cartItems.value.length === 0) {
    toast('Giỏ hàng trống!', 'error')
    return
  }

  if (!userProfile.value) {
    toast('Không tìm thấy thông tin người dùng', 'error')
    return
  }

  // Validate billing address
  if (useSavedBillingAddress.value && !selectedAddressId.value) {
    toast('Vui lòng chọn địa chỉ thanh toán', 'error')
    return
  }

  if (!useSavedBillingAddress.value) {
    if (!manualBilling.value.firstName || !manualBilling.value.lastName ||
        !manualBilling.value.address1 || !manualBilling.value.city ||
        !manualBilling.value.zip || !manualBilling.value.country || !manualBilling.value.state) {
      toast('Vui lòng điền đầy đủ thông tin địa chỉ thanh toán', 'error')
      return
    }
  }

  // Validate shipping address if different
  if (shipToDifferent.value) {
    if (useSavedShippingAddress.value && !selectedShippingAddressId.value) {
      toast('Vui lòng chọn địa chỉ giao hàng', 'error')
      return
    }
    if (!useSavedShippingAddress.value) {
      if (!manualShipping.value.firstName || !manualShipping.value.lastName ||
          !manualShipping.value.address1 || !manualShipping.value.city ||
          !manualShipping.value.zip || !manualShipping.value.country || !manualShipping.value.state) {
        toast('Vui lòng điền đầy đủ thông tin địa chỉ giao hàng', 'error')
        return
      }
    }
  }

  // Validate phone
  if (!usePhoneFromProfile.value && !manualPhone.value) {
    toast('Vui lòng nhập số điện thoại', 'error')
    return
  }

  isProcessing.value = true

  try {
    // Get phone number
    const customerPhone = usePhoneFromProfile.value ? userProfile.value.phone : manualPhone.value

    // Get billing address
    let billingData
    if (useSavedBillingAddress.value) {
      const savedBilling = addresses.value.find(addr => addr.id === selectedAddressId.value)
      if (!savedBilling) {
        toast('Không tìm thấy địa chỉ thanh toán', 'error')
        return
      }
      billingData = {
        firstName: savedBilling.firstName,
        lastName: savedBilling.lastName,
        address1: savedBilling.addressLine,
        address2: savedBilling.addressLine2 || '',
        city: savedBilling.city,
        state: savedBilling.stateOrProvince,
        zip: savedBilling.postalCode,
        country: savedBilling.country
      }
    } else {
      billingData = { ...manualBilling.value }
    }

    // Get shipping address
    let shippingData
    if (shipToDifferent.value) {
      if (useSavedShippingAddress.value) {
        const savedShipping = addresses.value.find(addr => addr.id === selectedShippingAddressId.value)
        if (!savedShipping) {
          toast('Không tìm thấy địa chỉ giao hàng', 'error')
          return
        }
        shippingData = {
          firstName: savedShipping.firstName,
          lastName: savedShipping.lastName,
          address1: savedShipping.addressLine,
          address2: savedShipping.addressLine2 || '',
          city: savedShipping.city,
          state: savedShipping.stateOrProvince,
          zip: savedShipping.postalCode,
          country: savedShipping.country
        }
      } else {
        shippingData = { ...manualShipping.value }
      }
    } else {
      // Shipping same as billing
      shippingData = { ...billingData }
    }

    // Map payment method
    const paymentMethodMap = {
      'cod': 'CASH',
      'bank_transfer': 'BANK_TRANSFER',
      'vnpay': 'DEBIT_CARD'
    }

    // Map shipping method
    const shippingMethodMap = {
      'free': 'Standard',
      'express': 'Express',
      'standard': 'Standard'
    }

    // Build order payload
    const orderPayload = {
      customerEmail: userProfile.value.email,
      customerPhone: customerPhone || '',
      billingFirstName: billingData.firstName,
      billingLastName: billingData.lastName,
      billingAddress1: billingData.address1,
      billingAddress2: billingData.address2,
      billingCity: billingData.city,
      billingState: billingData.state,
      billingZip: billingData.zip,
      billingCountry: billingData.country === 'Vietnam' ? 'VN' : billingData.country,
      shippingFirstName: shippingData.firstName,
      shippingLastName: shippingData.lastName,
      shippingAddress1: shippingData.address1,
      shippingAddress2: shippingData.address2,
      shippingCity: shippingData.city,
      shippingState: shippingData.state,
      shippingZip: shippingData.zip,
      shippingCountry: shippingData.country === 'Vietnam' ? 'VN' : shippingData.country,
      shippingMethod: shippingMethodMap[selectedShipping.value] || 'Standard',
      shippingCost: shippingCost.value,
      couponId: couponId.value,
      paymentMethod: paymentMethodMap[selectedPayment.value] || 'CASH',
      currency: 'VND',
      currencyRate: 1,
      locale: 'vi_VN',
      note: orderNote.value || ''
    }

    // Place order via API
    await createOrder(orderPayload)

    // Clear cart after successful order
    await cartStore.fetchCart(true)

    toast('Đặt hàng thành công!', 'success')

    // Redirect to orders list
    router.push('/profile/orders')
  } catch (error) {
    console.error('[Checkout] Order failed:', error)
    toast(error.response?.data?.message || 'Không thể đặt hàng. Vui lòng thử lại!', 'error')
  } finally {
    isProcessing.value = false
  }
}

// Load data
const loadData = async () => {
  isLoading.value = true
  try {
    // Load user profile
    userProfile.value = await profileStore.fetchProfile(true)

    // Load cart
    const cart = await cartStore.fetchCart(true)
    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
      toast('Giỏ hàng trống! Chuyển về trang giỏ hàng...', 'info')
      router.push('/cart')
      return
    }
    cartItems.value = cart.cartItems
    cartTotal.value = cart.total

    // Load addresses
    await addressStore.fetchAddresses(0, 20, true) // page=0, size=20, force=true
    addresses.value = addressStore.addresses
  } catch (error) {
    console.error('[Checkout] Load data failed:', error)
    toast('Không thể tải dữ liệu. Vui lòng thử lại!', 'error')
  } finally {
    isLoading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadData()
})
</script>

<style src="./Checkout.css" scoped></style>
