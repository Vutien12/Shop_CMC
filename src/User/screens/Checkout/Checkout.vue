/* eslint-disable vue/multi-word-component-names */
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
                <label for="phoneNumber">Phone Number <span class="required">*</span></label>
                <input
                  type="tel"
                  v-model="phoneNumber"
                  placeholder="Enter phone number"
                  required
                  class="form-input"
                  id="phoneNumber"
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
                    <label for="billingFirstName">First Name <span class="required">*</span></label>
                    <input type="text" v-model="manualBilling.firstName" required class="form-input" id="billingFirstName" />
                  </div>
                  <div class="form-group">
                    <label for="billingLastName">Last Name <span class="required">*</span></label>
                    <input type="text" v-model="manualBilling.lastName" required class="form-input" id="billingLastName" />
                  </div>
                </div>

                <div class="form-group">
                  <label for="billingAddress1">Street Address <span class="required">*</span></label>
                  <input
                    type="text"
                    v-model="manualBilling.address1"
                    placeholder="Address Line 1"
                    required
                    class="form-input"
                    id="billingAddress1"
                  />
                  <input
                    type="text"
                    v-model="manualBilling.address2"
                    placeholder="Address Line 2 (optional)"
                    class="form-input mt-2"
                    id="billingAddress2"
                  />
                </div>

                <!-- Province / District / Ward for Vietnam -->
                <div class="form-row">
                  <div class="form-group">
                    <label for="billingProvince">Province / City <span class="required">*</span></label>
                    <VSelect
                      :options="provinces"
                      label="ProvinceName"
                      :reduce="p => p.ProvinceID"
                      v-model="manualBilling.provinceId"
                      placeholder="Select province/city"
                      @input="(val) => { const p = provinces.find(x => x.ProvinceID === val); if (p) selectBillingProvince(p); }"
                      class="form-select-vue"
                      inputId="billingProvince"
                    />
                  </div>
                  <div class="form-group">
                    <label for="billingDistrict">District <span class="required">*</span></label>
                    <VSelect
                      :options="billingDistricts"
                      label="DistrictName"
                      :reduce="d => d.DistrictID"
                      v-model="manualBilling.districtId"
                      placeholder="Select district"
                      :disabled="!manualBilling.provinceId"
                      @input="(val) => { const d = billingDistricts.find(x => x.DistrictID === val); if (d) selectBillingDistrict(d); }"
                      class="form-select-vue"
                      inputId="billingDistrict"
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="billingWard">Ward / Commune <span class="required">*</span></label>
                    <VSelect
                      :options="billingWards"
                      label="WardName"
                      :reduce="w => w.WardCode"
                      v-model="manualBilling.wardCode"
                      placeholder="Select ward/commune"
                      :disabled="!manualBilling.districtId"
                      @input="(val) => { const w = billingWards.find(x => x.WardCode === val); if (w) selectBillingWard(w); }"
                      class="form-select-vue"
                      inputId="billingWard"
                    />
                  </div>
                  <div class="form-group">
                    <label for="billingZip">Postcode / ZIP <span class="required">*</span></label>
                    <input type="text" v-model="manualBilling.zip" required class="form-input" placeholder="100000" id="billingZip" />
                  </div>
                </div>

                <div class="form-group">
                  <label for="billingCountry">Country <span class="required">*</span></label>
                  <select v-model="manualBilling.country" required class="form-select" id="billingCountry">
                    <option value="Vietnam">Vietnam</option>
                  </select>
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

            <!-- Shipping Note -->
            <div class="shipping-info-alert">
              <i class="fa-solid fa-info-circle"></i>
              <span>Please select your delivery address to calculate the exact shipping cost.</span>
            </div>

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
                      <label for="shippingFirstName">First Name <span class="required">*</span></label>
                      <input type="text" v-model="manualShipping.firstName" required class="form-input" id="shippingFirstName" />
                    </div>
                    <div class="form-group">
                      <label for="shippingLastName">Last Name <span class="required">*</span></label>
                      <input type="text" v-model="manualShipping.lastName" required class="form-input" id="shippingLastName" />
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="shippingAddress1">Street Address <span class="required">*</span></label>
                    <input
                      type="text"
                      v-model="manualShipping.address1"
                      placeholder="Address Line 1"
                      required
                      class="form-input"
                      id="shippingAddress1"
                    />
                    <input
                      type="text"
                      v-model="manualShipping.address2"
                      placeholder="Address Line 2 (optional)"
                      class="form-input mt-2"
                      id="shippingAddress2"
                    />
                  </div>

                  <!-- Province / District / Ward for Vietnam -->
                  <div class="form-row">
                    <div class="form-group">
                      <label for="shippingProvince">Province / City <span class="required">*</span></label>
                      <VSelect
                        :options="provinces"
                        label="ProvinceName"
                        :reduce="p => p.ProvinceID"
                        v-model="manualShipping.provinceId"
                        placeholder="Select province/city"
                        @input="(val) => { const p = provinces.find(x => x.ProvinceID === val); if (p) selectShippingProvince(p); }"
                        class="form-select-vue"
                        inputId="shippingProvince"
                      />
                    </div>
                    <div class="form-group">
                      <label for="shippingDistrict">District <span class="required">*</span></label>
                      <VSelect
                        :options="shippingDistricts"
                        label="DistrictName"
                        :reduce="d => d.DistrictID"
                        v-model="manualShipping.districtId"
                        placeholder="Select district"
                        :disabled="!manualShipping.provinceId"
                        @input="(val) => { const d = shippingDistricts.find(x => x.DistrictID === val); if (d) selectShippingDistrict(d); }"
                        class="form-select-vue"
                        inputId="shippingDistrict"
                      />
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label for="shippingWard">Ward / Commune <span class="required">*</span></label>
                      <VSelect
                        :options="shippingWards"
                        label="WardName"
                        :reduce="w => w.WardCode"
                        v-model="manualShipping.wardCode"
                        placeholder="Select ward/commune"
                        :disabled="!manualShipping.districtId"
                        @input="(val) => { const w = shippingWards.find(x => x.WardCode === val); if (w) selectShippingWard(w); }"
                        class="form-select-vue"
                        inputId="shippingWard"
                      />
                    </div>
                    <div class="form-group">
                      <label for="shippingZip">Postcode / ZIP <span class="required">*</span></label>
                      <input type="text" v-model="manualShipping.zip" required class="form-input" placeholder="100000" id="shippingZip" />
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="shippingCountry">Country <span class="required">*</span></label>
                    <select v-model="manualShipping.country" required class="form-select" id="shippingCountry">
                      <option value="Vietnam">Vietnam</option>
                    </select>
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
                  <span class="payment-info">
                    <strong>💵 Payment upon delivery (COD)</strong>
                    <span class="payment-desc">Payment in cash upon delivery.</span>
                  </span>
                </label>

                <label class="payment-option" :class="{ selected: selectedPayment === 'bank_transfer' }">
                  <input
                    type="radio"
                    name="payment"
                    value="bank_transfer"
                    v-model="selectedPayment"
                  />
                  <span class="payment-info">
                    <strong>🏦 Bank transfer</strong>
                    <span class="payment-desc">Direct transfer to bank account.</span>
                  </span>
                </label>

                <label class="payment-option" :class="{ selected: selectedPayment === 'card' }">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    v-model="selectedPayment"
                  />
                  <span class="payment-info">
                    <strong>💳 CARD</strong>
                    <span class="payment-desc">Payment via card.</span>
                  </span>
                </label>

                <label class="payment-option" :class="{ selected: selectedPayment === 'payos_qr' }">
                  <input
                    type="radio"
                    name="payment"
                    value="payos_qr"
                    v-model="selectedPayment"
                  />
                  <span class="payment-info">
                    <strong>📱 PayOS QR</strong>
                    <span class="payment-desc">Scan QR code to pay via PayOS.</span>
                  </span>
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
                <div v-for="item in cartItems" :key="item.id" class="summary-item">
                  <div class="summary-item-left">
                    <!-- Product Image with Quantity Badge -->
                    <div class="summary-image-wrapper">
                      <img :src="getThumb(item)" :alt="item.productName" class="summary-image" />
                      <span class="qty-badge">{{ item.qty }}×</span>
                    </div>

                    <!-- Product Info -->
                    <div class="summary-info">
                      <h4 class="summary-name">{{ item.productName }}</h4>

                      <!-- Compact Variations - Single Line -->
                      <div v-if="item.cartItemVariations?.length > 0" class="summary-meta">
                        <span v-for="(variation, idx) in item.cartItemVariations" :key="variation.id" class="meta-tag">
                          <span v-if="variation.type === 'COLOR'"
                            class="color-dot-tiny"
                            :style="{ backgroundColor: variation.cartItemVariationValues[0]?.value }">
                          </span>
                          {{ variation.cartItemVariationValues[0]?.label }}<span v-if="idx < item.cartItemVariations.length - 1">, </span>
                        </span>
                      </div>

                      <!-- Compact Options -->
                      <div v-if="item.cartItemOptions?.length > 0" class="summary-options">
                        <span v-for="(option, idx) in item.cartItemOptions" :key="option.id" class="option-tag">
                          {{ option.optionName }}: {{ option.valueLabel }}<span v-if="option.price > 0"> (+{{ formatPrice(option.price) }})</span><span v-if="idx < item.cartItemOptions.length - 1">; </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Price -->
                  <div class="summary-item-right">
                    <div class="summary-price">{{ formatPrice(item.lineTotal) }}</div>
                    <div class="summary-unit-price">{{ formatPrice(item.unitPrice) }}/ea</div>
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
                <div class="total-row shipping-row" :class="{ 'has-fee': shippingCost > 0, 'calculating': isCalculatingFee }">
                  <span class="shipping-label">
                    <i class="fa-solid fa-truck"></i>
                    Shipping Cost
                    <span v-if="!canCalculateShippingFee" class="shipping-note">
                      <i class="fa-solid fa-info-circle"></i>
                      Select delivery address
                    </span>
                    <span v-else-if="isCalculatingFee" class="shipping-note calculating">
                      <i class="fa-solid fa-spinner fa-spin"></i>
                      Charging...
                    </span>
                    <span v-else-if="shippingCost > 0" class="shipping-note success">
                      <i class="fa-solid fa-check-circle"></i>
                      Fees have been charged
                    </span>
                  </span>
                  <span class="shipping-price">
                    {{ formatPrice(shippingCost) }}
                  </span>
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
                {{ isProcessing ? 'Processing...' : 'Order' }}
              </button>
            </div>
          </div>
        </div>

    <!-- Payment QR Modal -->
    <div v-if="showQRModal" class="qr-modal-overlay" @click="closeQRModal">
      <div class="qr-modal" @click.stop>
        <div class="qr-modal-header">
          <h2>Scan the QR code to pay.</h2>
          <button class="btn-close" @click="closeQRModal">&times;</button>
        </div>

        <div class="qr-modal-body">
          <p class="qr-instruction">Please scan the QR code below using your banking app or e-wallet.</p>

          <div class="qr-code-container">
            <img v-if="qrCodeUrl" :src="qrCodeUrl" :alt="'QR Code for order ' + currentOrderId" class="qr-code-image" />
            <p v-else class="loading-text">Loading QR code...</p>
          </div>

          <div class="qr-modal-info">
            <p><strong>Order code:</strong> #{{ currentOrderId }}</p>
            <p><strong>Amount:</strong> {{ formatPrice(currentOrderTotal) }}</p>
          </div>

          <div class="qr-modal-footer">
            <button class="btn-primary" @click="completePayment">Paid</button>
            <button class="btn-secondary" @click="closeQRModal">Cancel</button>
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
import { getProvinces, getDistricts, getWards } from '@/api/accountApi.js'
import { calculateShippingFee as calculateShippingFeeApi } from '@/api/shippingApi.js'
import { SHIPPING_CONFIG } from '@/Config/shipping.js'
import Header from '@/User/components/Header1/Header.vue'
import Footer from '@/User/components/Footer/Footer.vue'
import Loading from '@/User/components/Loading/Loading.vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

// Provide an explicit multi-word component name to satisfy eslint
defineOptions({ name: 'CheckoutPage' })

const VSelect = vSelect

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

// Billing Address (extended to support GHN fields)
const manualBilling = ref({
  firstName: '',
  lastName: '',
  address1: '',
  address2: '',
  city: '',
  state: '', // legacy field kept for compatibility
  stateOrProvince: '',
  zip: '',
  postalCode: '', // GHN postal code
  country: 'Vietnam',
  provinceId: null,
  districtId: null,
  districtName: '',
  wardCode: '',
  wardName: ''
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
  stateOrProvince: '',
  zip: '',
  postalCode: '',
  country: 'Vietnam',
  provinceId: null,
  districtId: null,
  districtName: '',
  wardCode: '',
  wardName: ''
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

// Shipping fee calculation
const isCalculatingFee = ref(false)
const fromDistrictId = ref(null)

// Location data
const provinces = ref([])
const billingDistricts = ref([])
const billingWards = ref([])
const shippingDistricts = ref([])
const shippingWards = ref([])

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

// Location Methods
const loadProvinces = async () => {
  try {
    const response = await getProvinces()
    provinces.value = response.data?.result || response.data || []
  } catch (error) {
    console.error('Failed to load provinces:', error)
    toast('Unable to load the list of provinces/cities', 'error')
  }
}

const loadBillingDistricts = async (provinceId) => {
  if (!provinceId) {
    billingDistricts.value = []
    billingWards.value = []
    return
  }
  try {
    const response = await getDistricts(provinceId)
    billingDistricts.value = response.data?.result || response.data || []
  } catch (error) {
    console.error('Failed to load districts:', error)
    toast('Unable to load the list of districts/counties', 'error')
  }
}

const loadBillingWards = async (districtId) => {
  if (!districtId) {
    billingWards.value = []
    return
  }
  try {
    const response = await getWards(districtId)
    billingWards.value = response.data?.result || response.data || []
  } catch (error) {
    console.error('Failed to load wards:', error)
    toast('Unable to load the list of wards/communes', 'error')
  }
}

const loadShippingDistricts = async (provinceId) => {
  if (!provinceId) {
    shippingDistricts.value = []
    shippingWards.value = []
    return
  }
  try {
    const response = await getDistricts(provinceId)
    shippingDistricts.value = response.data?.result || response.data || []
  } catch (error) {
    console.error('Failed to load districts:', error)
    toast('Không thể tải danh sách quận/huyện', 'error')
  }
}

const loadShippingWards = async (districtId) => {
  if (!districtId) {
    shippingWards.value = []
    return
  }
  try {
    const response = await getWards(districtId)
    shippingWards.value = response.data?.result || response.data || []
  } catch (error) {
    console.error('Failed to load wards:', error)
    toast('Không thể tải danh sách phường/xã', 'error')
  }
}

const selectBillingProvince = async (province) => {
  manualBilling.value.provinceId = province.ProvinceID
  manualBilling.value.stateOrProvince = province.ProvinceName
  manualBilling.value.state = province.ProvinceName
  manualBilling.value.districtId = null
  manualBilling.value.districtName = ''
  manualBilling.value.wardCode = ''
  manualBilling.value.wardName = ''
  await loadBillingDistricts(province.ProvinceID)
}

const selectBillingDistrict = async (district) => {
  manualBilling.value.districtId = district.DistrictID
  manualBilling.value.districtName = district.DistrictName
  manualBilling.value.wardCode = ''
  manualBilling.value.wardName = ''
  await loadBillingWards(district.DistrictID)
}

const selectBillingWard = (ward) => {
  manualBilling.value.wardCode = ward.WardCode
  manualBilling.value.wardName = ward.WardName
}

const selectShippingProvince = async (province) => {
  manualShipping.value.provinceId = province.ProvinceID
  manualShipping.value.stateOrProvince = province.ProvinceName
  manualShipping.value.state = province.ProvinceName
  manualShipping.value.districtId = null
  manualShipping.value.districtName = ''
  manualShipping.value.wardCode = ''
  manualShipping.value.wardName = ''
  await loadShippingDistricts(province.ProvinceID)
}

const selectShippingDistrict = async (district) => {
  manualShipping.value.districtId = district.DistrictID
  manualShipping.value.districtName = district.DistrictName
  manualShipping.value.wardCode = ''
  manualShipping.value.wardName = ''
  await loadShippingWards(district.DistrictID)
}

const selectShippingWard = async (ward) => {
  manualShipping.value.wardCode = ward.WardCode
  manualShipping.value.wardName = ward.WardName

  // Tính phí vận chuyển khi đã có đủ thông tin
  await calculateShippingFee()
}

// Shipping Fee Calculation
const canCalculateShippingFee = computed(() => {
  return fromDistrictId.value &&
         manualShipping.value.districtId &&
         manualShipping.value.wardCode &&
         cartItems.value.length > 0
})

const calculateShippingFee = async () => {
  // Chỉ tính phí khi có đủ thông tin
  if (!canCalculateShippingFee.value) {
    shippingCost.value = 0
    return
  }

  isCalculatingFee.value = true
  try {
    // Prepare items from cart
    const items = cartItems.value.map(item => ({
      name: item.productName || 'Product',
      code: item.productId?.toString() || '',
      quantity: item.qty || 1,
      length: item.length || SHIPPING_CONFIG.DEFAULT_LENGTH,
      width: item.width || SHIPPING_CONFIG.DEFAULT_WIDTH,
      height: item.height || SHIPPING_CONFIG.DEFAULT_HEIGHT,
      weight: item.weight || SHIPPING_CONFIG.DEFAULT_WEIGHT
    }))

    // Calculate total weight
    const totalWeight = items.reduce((sum, item) => sum + (item.weight * item.quantity), 0)

    // Build fee request - sử dụng service_type_id cố định
    const feeRequest = {
      service_type_id: SHIPPING_CONFIG.DEFAULT_SERVICE_TYPE_ID, // Luôn dùng service type 2 (hàng nhẹ)
      from_district_id: fromDistrictId.value,
      from_ward_code: SHIPPING_CONFIG.SHOP_WARD_CODE || '',
      to_district_id: manualShipping.value.districtId,
      to_ward_code: manualShipping.value.wardCode,
      insurance_value: Math.round(subtotal.value),
      cod_value: selectedPayment.value === 'cod' ? Math.round(total.value) : 0,
      weight: totalWeight,
      length: items[0]?.length || SHIPPING_CONFIG.DEFAULT_LENGTH,
      width: items[0]?.width || SHIPPING_CONFIG.DEFAULT_WIDTH,
      height: items[0]?.height || SHIPPING_CONFIG.DEFAULT_HEIGHT,
    }

    const response = await calculateShippingFeeApi(feeRequest)
    const feeData = response.data?.result || response.data

    if (feeData) {
      // GHN response không có field "total", phải tính tổng
      const totalFee = (feeData.total || 0) +
                       (feeData.service_fee || 0) +
                       (feeData.insurance_fee || 0) +
                       (feeData.pick_station_fee || 0) +
                       (feeData.cod_fee || 0) +
                       (feeData.pick_remote_areas_fee || 0) +
                       (feeData.deliver_remote_areas_fee || 0) +
                       (feeData.r2s_fee || 0)

      shippingCost.value = totalFee
      console.log('[Checkout] Shipping fee calculated:', {
        service_fee: feeData.service_fee,
        total: totalFee,
        breakdown: feeData
      })

      if (totalFee > 0) {
        toast(`Phí vận chuyển: ${formatPrice(totalFee)}`, 'success')
      }
    }
  } catch (error) {
    console.error('[Checkout] Failed to calculate shipping fee:', error)
    toast('Không thể tính phí vận chuyển', 'error')
    shippingCost.value = 0
  } finally {
    isCalculatingFee.value = false
  }
}


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
      stateOrProvince: addr.stateOrProvince || '',
      zip: addr.postalCode || '',
      postalCode: addr.postalCode || '',
      country: addr.country || 'Vietnam',
      provinceId: addr.provinceId ?? addr.province_id ?? null,
      districtId: addr.districtId ?? addr.district_id ?? null,
      districtName: addr.districtName || addr.district_name || '',
      wardCode: addr.wardCode || addr.ward_code || '',
      wardName: addr.wardName || addr.ward_name || ''
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
      stateOrProvince: addr.stateOrProvince || '',
      zip: addr.postalCode || '',
      postalCode: addr.postalCode || '',
      country: addr.country || 'Vietnam',
      provinceId: addr.provinceId ?? addr.province_id ?? null,
      districtId: addr.districtId ?? addr.district_id ?? null,
      districtName: addr.districtName || addr.district_name || '',
      wardCode: addr.wardCode || addr.ward_code || '',
      wardName: addr.wardName || addr.ward_name || ''
    }
  }
}

const handleUseSameBilling = async () => {
  if (useSameBilling.value) {
    // Copy billing address to shipping including new fields
    manualShipping.value = JSON.parse(JSON.stringify(manualBilling.value))

    // If we have complete address info, calculate shipping fee
    if (manualShipping.value.districtId && manualShipping.value.wardCode) {
      await loadShippingDistricts(manualShipping.value.provinceId)
      await loadShippingWards(manualShipping.value.districtId)
      await calculateShippingFee()
    }
  }
}

const applyCoupon = async () => {
  if (!couponCode.value.trim()) {
    toast('Please enter the discount code.', 'error')
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
      !manualBilling.value.address1 ||
      !manualBilling.value.provinceId || !manualBilling.value.districtId || !manualBilling.value.wardCode ||
      !(manualBilling.value.zip || manualBilling.value.postalCode) || !manualBilling.value.country) {
    toast('Please fill in your complete billing address information (including province/city, district/county, ward/commune).', 'error')
    return
  }

  // Validate shipping address if NOT using same billing
  if (!useSameBilling.value) {
    if (!manualShipping.value.firstName || !manualShipping.value.lastName ||
        !manualShipping.value.address1 ||
        !manualShipping.value.provinceId || !manualShipping.value.districtId || !manualShipping.value.wardCode ||
        !(manualShipping.value.zip || manualShipping.value.postalCode) || !manualShipping.value.country) {
      toast('Please fill in your complete delivery address information (including province/city, district/county, ward/commune).', 'error')
      return
    }
  }

  // Validate phone
  if (!phoneNumber.value) {
    toast('Please enter phone number', 'error')
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
      'cod': 'COD',
      'bank_transfer': 'VIETQR',
      'card': 'DEBIT_CARD',
      'payos_qr': 'PAYOS_QR'
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
      billingState: billingData.state || billingData.stateOrProvince || '',
      billingStateOrProvince: billingData.stateOrProvince || billingData.state || '',
      billingZip: billingData.zip || billingData.postalCode || '',
      billingPostalCode: billingData.postalCode || billingData.zip || '',
      billingCountry: billingData.country === 'Vietnam' ? 'VN' : billingData.country,
      billingProvinceId: billingData.provinceId ? Number(billingData.provinceId) : null,
      billingDistrictId: billingData.districtId ? Number(billingData.districtId) : null,
      billingDistrictName: billingData.districtName || '',
      billingWardCode: billingData.wardCode || '',
      billingWardName: billingData.wardName || '',
      shippingFirstName: shippingData.firstName,
      shippingLastName: shippingData.lastName,
      shippingAddress1: shippingData.address1,
      shippingAddress2: shippingData.address2,
      shippingCity: shippingData.city,
      shippingState: shippingData.state || shippingData.stateOrProvince || '',
      shippingStateOrProvince: shippingData.stateOrProvince || shippingData.state || '',
      shippingZip: shippingData.zip || shippingData.postalCode || '',
      shippingPostalCode: shippingData.postalCode || shippingData.zip || '',
      shippingCountry: shippingData.country === 'Vietnam' ? 'VN' : shippingData.country,
      shippingProvinceId: shippingData.provinceId ? Number(shippingData.provinceId) : null,
      shippingDistrictId: shippingData.districtId ? Number(shippingData.districtId) : null,
      shippingDistrictName: shippingData.districtName || '',
      shippingWardCode: shippingData.wardCode || '',
      shippingWardName: shippingData.wardName || '',
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

    toast('Order successful!', 'success')

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
          toast('Unable to create a payment session. Please try again.!', 'error')
          setTimeout(() => {
            router.push(`/order-complete/${orderId}`)
          }, 500)
        }
      }
    } else if (paymentMethod === 'PAYOS_QR') {
      // Redirect to PayOS checkout using checkoutUrl (with webhook support)
      if (orderData.checkoutUrl) {
        console.log('[Checkout] PAYOS_QR redirecting to PayOS:', {
          orderId: orderData.id,
          paymentProvider: orderData.paymentProvider
        })
        window.location.href = orderData.checkoutUrl
      } else {
        console.warn('[Checkout] No checkoutUrl in response for PAYOS_QR')
        toast('Unable to create PayOS payment session. Please try again!', 'error')
        setTimeout(() => {
          router.push(`/order-complete/${orderId}`)
        }, 500)
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
      toast('The shopping cart is empty! Go back to the shopping cart page...', 'info')
      await router.push('/cart')
      return
    }
    cartItems.value = cart.cartItems
    cartTotal.value = cart.total

  } catch (error) {
    console.error('[Checkout] Load data failed:', error)
    toast('Unable to load data. Please try again!', 'error')
  } finally {
    isLoading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  // Set shop district ID from config
  fromDistrictId.value = SHIPPING_CONFIG.SHOP_DISTRICT_ID

  await loadProvinces()
  await loadData()

  // If default address has location data, restore it FOR BILLING ONLY
  if (userProfile.value?.defaultAddress) {
    const addr = userProfile.value.defaultAddress
    if (addr.provinceId) {
      await loadBillingDistricts(addr.provinceId)
      if (addr.districtId) {
        await loadBillingWards(addr.districtId)
      }
    }
    // Note: Shipping address phải để user tự chọn hoặc dùng "Use default address"
  }
})
</script>

<style src="./Checkout.css" scoped></style>
