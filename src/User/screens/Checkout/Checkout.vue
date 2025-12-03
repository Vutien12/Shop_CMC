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
              <div class="form-group">
                <label>Phone Number <span class="required">*</span></label>
                <input
                  type="tel"
                  v-model="phoneNumber"
                  placeholder="Enter phone number"
                  required
                  class="form-input"
                />
              </div>
              <div v-if="userProfile?.phone" class="use-default-text">
                <a href="#" @click.prevent="useDefaultPhone" class="use-default-link">
                  Use default phone number: {{ userProfile.phone }}
                </a>
              </div>
            </div>

            <h2>Billing Details</h2>

            <!-- Billing Address Options -->
            <div class="info-section">

              <!-- Manual Billing Address Form -->
              <div class="manual-address-form">
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
                    <input
                      type="text"
                      v-model="manualBilling.state"
                      placeholder="Enter state or province"
                      required
                      class="form-input"
                    />
                  </div>
                </div>
              </div>

              <!-- Use Default Address Link -->
              <div v-if="userProfile?.defaultAddress" class="use-default-text">
                <a href="#" @click.prevent="useDefaultBillingAddress" class="use-default-link">
                  Use default address
                </a>
              </div>
            </div>

            <h2>Shipping Details</h2>

            <!-- Shipping Address Section -->
            <div class="info-section">
              <!-- Checkbox: Use Same Billing Details -->
              <div class="checkbox-option">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="useSameBilling" @change="handleUseSameBilling" />
                  <span>Use same billing details</span>
                </label>
              </div>

              <!-- Form only shows when NOT using same billing -->
              <div v-if="!useSameBilling">
                <div class="manual-address-form">
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
                      <input
                        type="text"
                        v-model="manualShipping.state"
                        placeholder="Enter state or province"
                        required
                        class="form-input"
                      />
                    </div>
                  </div>
                </div>

                <!-- Use Default Address Link -->
                <div v-if="userProfile?.defaultAddress" class="use-default-text">
                  <a href="#" @click.prevent="useDefaultShippingAddress" class="use-default-link">
                    Use default address
                  </a>
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
                    value="cod"
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
                    value="card"
                    v-model="selectedPayment"
                  />
                  <div class="payment-info">
                    <h4>💳 CARD</h4>
                    <p>Thanh toán qua thẻ.</p>
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
                  <!-- Product Image & Info -->
                  <div class="item-main">
                    <div class="item-image">
                      <img :src="getThumb(item)" :alt="item.productName" />
                      <span class="item-qty-badge">{{ item.qty }}</span>
                    </div>

                    <div class="item-details">
                      <h4 class="item-name">{{ item.productName }}</h4>

                      <!-- Variations -->
                      <div v-if="item.cartItemVariations?.length > 0" class="item-specs">
                        <div v-for="variation in item.cartItemVariations" :key="variation.id" class="spec-row">
                          <span class="spec-label">{{ variation.variationName }}:</span>
                          <span class="spec-value">
                            <span v-if="variation.type === 'COLOR'"
                              class="color-swatch"
                              :style="{ backgroundColor: variation.value }"
                              :title="variation.cartItemVariationValues[0]?.label">
                            </span>
                            <span>{{ variation.cartItemVariationValues[0]?.label }}</span>
                          </span>
                        </div>
                      </div>

                      <!-- Options -->
                      <div v-if="item.cartItemOptions?.length > 0" class="item-options">
                        <div v-for="option in item.cartItemOptions" :key="option.id" class="option-row">
                          <span class="option-label">{{ option.optionName }}:</span>
                          <span class="option-value">
                            {{ option.valueLabel || option.cartItemOptionValues?.[0]?.optionValue?.label || option.cartItemOptionValues?.[0]?.valueLabel || '-' }}
                          </span>
                          <span v-if="option.price > 0" class="option-price">+{{ formatPrice(option.price) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Price -->
                  <div class="item-pricing">
                    <div class="unit-price">
                      <span class="price-label">Unit:</span>
                      <span class="price-value">{{ formatPrice(item.unitPrice) }}</span>
                    </div>
                    <div class="line-total">
                      <span class="price-label">Total:</span>
                      <span class="price-value">{{ formatPrice(item.lineTotal) }}</span>
                    </div>
                  </div>
                </div>

                <!-- Divider -->
                <div class="items-divider"></div>
              </div>

              <!-- Coupon Code -->
              <div class="coupon-section">
                <div v-if="!appliedCoupon" class="coupon-input-wrapper">
                  <input
                    type="text"
                    v-model="couponCode"
                    placeholder="Enter coupon code"
                    class="coupon-input"
                    :disabled="isApplyingCoupon"
                    @keyup.enter="applyCoupon"
                  />
                  <button
                    class="btn-apply"
                    @click="applyCoupon"
                    :disabled="isApplyingCoupon || !couponCode.trim()"
                  >
                    <i v-if="isApplyingCoupon" class="fa-solid fa-spinner fa-spin"></i>
                    <span v-else>Apply</span>
                  </button>
                </div>

                <!-- Applied Coupon Display -->
                <div v-else class="applied-coupon">
                  <div class="coupon-info">
                    <i class="fa-solid fa-tag"></i>
                    <div class="coupon-details">
                      <strong>{{ appliedCoupon.code }}</strong>
                      <p class="coupon-desc">{{ appliedCoupon.description }}</p>
                    </div>
                  </div>
                  <button class="btn-remove" @click="removeCoupon" title="Remove coupon">
                    <i class="fa-solid fa-times"></i>
                  </button>
                </div>

                <!-- Error Message -->
                <div v-if="couponError && !appliedCoupon" class="coupon-error">
                  <i class="fa-solid fa-exclamation-circle"></i>
                  <span>{{ couponError }}</span>
                </div>
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
                <div v-if="couponDiscount > 0" class="total-row discount">
                  <span>
                    <i class="fa-solid fa-tag"></i>
                    Discount
                  </span>
                  <span class="discount-amount">-{{ formatPrice(couponDiscount) }}</span>
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

    <!-- Payment QR Modal -->
    <div v-if="showQRModal" class="qr-modal-overlay" @click="closeQRModal">
      <div class="qr-modal" @click.stop>
        <div class="qr-modal-header">
          <h2>Quét mã QR để thanh toán</h2>
          <button class="btn-close" @click="closeQRModal">&times;</button>
        </div>

        <div class="qr-modal-body">
          <p class="qr-instruction">Vui lòng quét mã QR bên dưới bằng ứng dụng ngân hàng hoặc ví điện tử của bạn</p>

          <div class="qr-code-container">
            <img v-if="qrCodeUrl" :src="qrCodeUrl" :alt="'QR Code for order ' + currentOrderId" class="qr-code-image" />
            <p v-else class="loading-text">Đang tải mã QR...</p>
          </div>

          <div class="qr-modal-info">
            <p><strong>Mã đơn hàng:</strong> #{{ currentOrderId }}</p>
            <p><strong>Số tiền:</strong> {{ formatPrice(currentOrderTotal) }}</p>
          </div>

          <div class="qr-modal-footer">
            <button class="btn-primary" @click="completePayment">Đã thanh toán</button>
            <button class="btn-secondary" @click="closeQRModal">Hủy</button>
          </div>
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
import { useAccountStore } from '@/User/stores/accountStore.js'
import { useToast } from '@/User/components/Toast/useToast.js'
import { createOrder } from '@/api/orderApi.js'
import { getCouponByCode } from '@/api/couponsApi.js'
import { getCouponDisplayInfo } from '@/Utils/couponUtils.js'
import Header from '@/User/components/Header1/Header.vue'
import Footer from '@/User/components/Footer/Footer.vue'
import Loading from '@/User/components/Loading/Loading.vue'

const router = useRouter()
const cartStore = useCartStore()
const accountStore = useAccountStore()
const { add: toast } = useToast()

// Data
const isLoading = ref(true)
const cartItems = ref([])
const cartTotal = ref(0)

// Phone
const phoneNumber = ref('')

// Billing Address
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
const useSameBilling = ref(false)
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
const appliedCoupon = ref(null)
const couponDiscount = ref(0)
const couponError = ref('')
const isApplyingCoupon = ref(false)
const agreeToTerms = ref(false)
const shippingCost = ref(0)
const selectedPayment = ref('cod')
const selectedShipping = ref('free')
const isProcessing = ref(false)
const userProfile = ref(null)

// QR Modal
const showQRModal = ref(false)
const qrCodeUrl = ref('')
const currentOrderId = ref(null)
const currentOrderTotal = ref(0)

// Computed
const subtotal = computed(() => cartTotal.value || 0)
const total = computed(() => {
  const totalBeforeDiscount = subtotal.value + shippingCost.value
  return totalBeforeDiscount - couponDiscount.value
})

// Format price VND
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
    .format(price || 0)
    .replace('₫', 'đ')
}

// Get thumbnail
const getThumb = (item) => item.productThumbnail || '/images/placeholder.jpg'

// Methods
const useDefaultPhone = () => {
  if (userProfile.value?.phone) {
    phoneNumber.value = userProfile.value.phone
  }
}

const useDefaultBillingAddress = () => {
  if (userProfile.value?.defaultAddress) {
    const addr = userProfile.value.defaultAddress
    manualBilling.value = {
      firstName: addr.firstName || '',
      lastName: addr.lastName || '',
      address1: addr.addressLine || '',
      address2: addr.addressLine2 || '',
      city: addr.city || '',
      state: addr.stateOrProvince || '',
      zip: addr.postalCode || '',
      country: addr.country || 'Vietnam'
    }
  }
}

const useDefaultShippingAddress = () => {
  if (userProfile.value?.defaultAddress) {
    const addr = userProfile.value.defaultAddress
    manualShipping.value = {
      firstName: addr.firstName || '',
      lastName: addr.lastName || '',
      address1: addr.addressLine || '',
      address2: addr.addressLine2 || '',
      city: addr.city || '',
      state: addr.stateOrProvince || '',
      zip: addr.postalCode || '',
      country: addr.country || 'Vietnam'
    }
  }
}

const handleUseSameBilling = () => {
  if (useSameBilling.value) {
    // Copy billing address to shipping
    manualShipping.value = { ...manualBilling.value }
  }
}

const updateShippingCost = (cost) => {
  shippingCost.value = cost
}


const applyCoupon = async () => {
  if (!couponCode.value.trim()) {
    toast('Vui lòng nhập mã giảm giá', 'error')
    return
  }

  isApplyingCoupon.value = true
  couponError.value = ''

  try {
    // Fetch coupon by code from API
    const response = await getCouponByCode(couponCode.value.trim())
    const coupon = response.result

    // Validate and calculate discount using utility function
    const couponInfo = getCouponDisplayInfo(coupon, subtotal.value)

    if (!couponInfo.isValid) {
      // Invalid coupon - show error
      couponError.value = couponInfo.error
      toast(couponInfo.error, 'error')
      appliedCoupon.value = null
      couponDiscount.value = 0
      couponId.value = null
    } else {
      // Valid coupon - apply discount
      appliedCoupon.value = coupon
      couponDiscount.value = couponInfo.discount
      couponId.value = coupon.id
      couponError.value = ''
      toast(`Áp dụng mã giảm giá thành công! Giảm ${formatPrice(couponInfo.discount)}`, 'success')
    }
  } catch (error) {
    console.error('[Checkout] Apply coupon failed:', error)
    const errorMsg = error.response?.data?.message || 'Mã giảm giá không hợp lệ'
    couponError.value = errorMsg
    toast(errorMsg, 'error')
    appliedCoupon.value = null
    couponDiscount.value = 0
    couponId.value = null
  } finally {
    isApplyingCoupon.value = false
  }
}

const removeCoupon = () => {
  appliedCoupon.value = null
  couponDiscount.value = 0
  couponId.value = null
  couponCode.value = ''
  couponError.value = ''
  toast('Đã xóa mã giảm giá', 'info')
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
  if (!manualBilling.value.firstName || !manualBilling.value.lastName ||
      !manualBilling.value.address1 || !manualBilling.value.city ||
      !manualBilling.value.zip || !manualBilling.value.country || !manualBilling.value.state) {
    toast('Vui lòng điền đầy đủ thông tin địa chỉ thanh toán', 'error')
    return
  }

  // Validate shipping address if NOT using same billing
  if (!useSameBilling.value) {
    if (!manualShipping.value.firstName || !manualShipping.value.lastName ||
        !manualShipping.value.address1 || !manualShipping.value.city ||
        !manualShipping.value.zip || !manualShipping.value.country || !manualShipping.value.state) {
      toast('Vui lòng điền đầy đủ thông tin địa chỉ giao hàng', 'error')
      return
    }
  }

  // Validate phone
  if (!phoneNumber.value) {
    toast('Vui lòng nhập số điện thoại', 'error')
    return
  }

  isProcessing.value = true

  try {
    // Get phone number
    const customerPhone = phoneNumber.value

    // Get billing address
    const billingData = { ...manualBilling.value }

    // Get shipping address
    let shippingData
    if (useSameBilling.value) {
      // Shipping same as billing
      shippingData = { ...billingData }
    } else {
      // Use manual shipping address
      shippingData = { ...manualShipping.value }
    }

    // Map payment method
    const paymentMethodMap = {
      'cod': 'COD',  // Changed from 'CASH' to 'COD' - backend expects COD
      'bank_transfer': 'VIETQR',
      'card': 'DEBIT_CARD'
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
    const response = await createOrder(orderPayload)
    const orderData = response.data.result
    const orderId = orderData.id
    const paymentMethod = orderData.paymentMethod

    // Clear cart after successful order
    await cartStore.fetchCart(true)

    toast('Đặt hàng thành công!', 'success')

    // Handle payment based on method
    if (paymentMethod === 'VIETQR') {
      // Show QR code modal
      showPaymentQR(orderData)
    } else if (paymentMethod === 'DEBIT_CARD') {
      // Redirect to Stripe checkout using checkoutUrl
      if (orderData.checkoutUrl) {
        console.log('[Checkout] DEBIT_CARD redirecting to Stripe:', {
          orderId: orderData.id,
          paymentProvider: orderData.paymentProvider
        })
        window.location.href = orderData.checkoutUrl
      } else {
        // Fallback: build from sessionId if available
        if (orderData.sessionId) {
          console.log('[Checkout] Using sessionId fallback')
          window.location.href = `https://checkout.stripe.com/pay/${orderData.sessionId}`
        } else {
          console.warn('[Checkout] No checkoutUrl or sessionId in response')
          toast('Không thể tạo phiên thanh toán. Vui lòng thử lại!', 'error')
          setTimeout(() => {
            router.push(`/order-complete/${orderId}`)
          }, 500)
        }
      }
    } else {
      // COD - direct to order complete
      setTimeout(() => {
        router.push(`/order-complete/${orderId}`)
      }, 500)
    }

  } catch (error) {
    console.error('[Checkout] Order failed:', error)
    toast(error.response?.data?.message || 'Không thể đặt hàng. Vui lòng thử lại!', 'error')
  } finally {
    isProcessing.value = false
  }
}

// QR Modal Functions
const showPaymentQR = (orderData) => {
  qrCodeUrl.value = orderData.checkoutUrl
  currentOrderId.value = orderData.id
  currentOrderTotal.value = orderData.total
  showQRModal.value = true
}

const closeQRModal = () => {
  showQRModal.value = false
  qrCodeUrl.value = ''
  currentOrderId.value = null
  currentOrderTotal.value = 0
}

const completePayment = () => {
  const orderId = currentOrderId.value
  closeQRModal()
  setTimeout(() => {
    router.push(`/order-complete/${orderId}`)
  }, 300)
}


// Load data
const loadData = async () => {
  isLoading.value = true
  try {
    // Load only user data, skip orders (not needed in checkout)
    const { userInfo } = await accountStore.fetchData(true, false)

    // Map userInfo to userProfile format
    userProfile.value = {
      email: userInfo?.email || '',
      phone: userInfo?.phone || '',
      firstName: userInfo?.name?.split(' ')[0] || '',
      lastName: userInfo?.name?.split(' ').slice(1).join(' ') || '',
      defaultAddress: userInfo?.defaultAddress || null
    }
    console.log('[Checkout] User profile loaded:', userProfile.value)
    console.log('[Checkout] Default address:', userProfile.value?.defaultAddress)

    // Load cart
    const cart = await cartStore.fetchCart(true)
    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
      toast('Giỏ hàng trống! Chuyển về trang giỏ hàng...', 'info')
      await router.push('/cart')
      return
    }
    cartItems.value = cart.cartItems
    cartTotal.value = cart.total

    // Do NOT auto-fill - let forms stay empty
    // User can click links/checkboxes to fill if needed
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
