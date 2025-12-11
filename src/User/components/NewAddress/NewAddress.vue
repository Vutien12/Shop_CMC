<template>
  <div class="account-wrapper">
    <Header />

    <!-- Transition toàn trang -->
    <transition name="fade" mode="out-in">
      <div v-if="isLoading" key="loading" class="loading-wrapper">
        <Loading />
      </div>

      <div v-else key="content" class="account-page">
        <!-- Sidebar -->
        <aside class="account-sidebar">
          <nav class="sidebar-nav">
            <router-link to="/account" @mouseenter="prefetch('/account')" @mouseleave="cancel" class="nav-item">
              <i class="fa-solid fa-gauge"></i>
              <span>Dashboard</span>
            </router-link>
            <router-link to="/orders" @mouseenter="prefetch('/orders')" @mouseleave="cancel" class="nav-item">
              <i class="fa-solid fa-cart-shopping"></i>
              <span>My Orders</span>
            </router-link>
            <router-link to="/my-cases" @mouseenter="prefetch('/my-cases')" @mouseleave="cancel" class="nav-item">
              <i class="fa-solid fa-rotate-left"></i>
              <span>My Cases</span>
            </router-link>
            <router-link to="/wishlist" @mouseenter="prefetch('/wishlist')" @mouseleave="cancel" class="nav-item">
              <i class="fa-regular fa-heart"></i>
              <span>My Wishlist</span>
            </router-link>
            <router-link to="/addresses" class="nav-item active">
              <i class="fa-regular fa-address-book"></i>
              <span>My Addresses</span>
            </router-link>
            <router-link to="/profile" @mouseenter="prefetch('/profile')" @mouseleave="cancel" class="nav-item">
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
          <div class="breadcrumb">
            <router-link to="/">Home</router-link>
            <i class="fa-solid fa-chevron-right"></i>
            <router-link to="/account">My Account</router-link>
            <i class="fa-solid fa-chevron-right"></i>
            <router-link to="/addresses">My Addresses</router-link>
            <i class="fa-solid fa-chevron-right"></i>
            <span>{{ isEditMode ? 'Edit address' : 'Add new address' }}</span>
          </div>

          <!-- Form Section -->
          <section class="address-section">
            <div class="address-form-card">
              <h3>{{ isEditMode ? 'Edit address' : 'Add new address' }}</h3>

              <!-- Skeleton khi loading -->
              <div v-if="formLoading" class="skeleton-form">
                <div class="skeleton-card">
                  <div class="skeleton-line title"></div>
                  <div class="form-row">
                    <div class="form-group"><div class="skeleton-line"></div></div>
                    <div class="form-group"><div class="skeleton-line"></div></div>
                  </div>
                  <div class="form-row">
                    <div class="form-group"><div class="skeleton-line"></div></div>
                  </div>
                  <div class="form-row">
                    <div class="form-group"><div class="skeleton-line"></div></div>
                    <div class="form-group"><div class="skeleton-line"></div></div>
                    <div class="form-group"><div class="skeleton-line"></div></div>
                    <div class="form-group"><div class="skeleton-line"></div></div>
                  </div>
                </div>
              </div>

              <!-- Real Form -->
              <form v-else @submit.prevent="saveAddress" class="address-form">
                <!-- First & Last Name -->
                <div class="form-row">
                  <div class="form-group">
                    <label>First Name <span class="required">*</span></label>
                    <div class="input-wrapper">
                      <input v-model="form.firstName" class="form-input" :class="{ 'error': errors.firstName }" placeholder="Phung" />
                      <div v-if="errors.firstName" class="error-tooltip">{{ errors.firstName }}</div>
                    </div>
                    <span v-if="errors.firstName" class="error-text">{{ errors.firstName }}</span>
                  </div>
                  <div class="form-group">
                    <label>Last Name <span class="required">*</span></label>
                    <div class="input-wrapper">
                      <input v-model="form.lastName" class="form-input" :class="{ 'error': errors.lastName }" placeholder="Van Vu" />
                      <div v-if="errors.lastName" class="error-tooltip">{{ errors.lastName }}</div>
                    </div>
                    <span v-if="errors.lastName" class="error-text">{{ errors.lastName }}</span>
                  </div>
                </div>

                <!-- Phone -->
                <div class="form-group">
                  <label>Phone <span class="required">*</span></label>
                  <div class="input-wrapper">
                    <input v-model="form.phone" class="form-input" :class="{ 'error': errors.phone }" placeholder="0332182284" />
                    <div v-if="errors.phone" class="error-tooltip">{{ errors.phone }}</div>
                  </div>
                  <span v-if="errors.phone" class="error-text">{{ errors.phone }}</span>
                </div>

                <!-- Address Line 1 & 2 -->
                <!-- Address Line 1 -->
                <div class="form-group">
                  <label>Address Line 1 <span class="required">*</span></label>
                  <div class="input-wrapper">
                    <input
                      v-model="form.addressLine"
                      class="form-input"
                      :class="{ error: errors.addressLine }"
                      placeholder="House 96, Bac Lam"
                    />
                    <div v-if="errors.addressLine" class="error-tooltip">
                      {{ errors.addressLine }}
                    </div>
                  </div>
                  <span v-if="errors.addressLine" class="error-text">
                    {{ errors.addressLine }}
                  </span>
                </div>

                <!-- Address Line 2 -->
                <div class="form-group">
                  <label>Address Line 2</label>
                  <div class="input-wrapper">
                    <input
                      v-model="form.addressLine2"
                      class="form-input"
                      :class="{ error: errors.addressLine2 }"
                      placeholder="Phu Luong Ward, Ha Dong District"
                    />
                    <div v-if="errors.addressLine2" class="error-tooltip">
                      {{ errors.addressLine2 }}
                    </div>
                  </div>
                  <span v-if="errors.addressLine2" class="error-text">
                    {{ errors.addressLine2 }}
                  </span>
                </div>

                <!-- Province & District & Ward -->
                <div class="form-row">
                  <!-- Province -->
                  <div class="form-group">
                    <label for="newAddressProvince">Province / City <span class="required">*</span></label>
                    <div class="input-wrapper">
                      <VSelect
                        :options="filteredProvinces"
                        label="ProvinceName"
                        :reduce="p => p.ProvinceID"
                        v-model="form.provinceId"
                        :class="{ 'vselect-error': errors.provinceId }"
                        placeholder="Find or select a province/city"
                        @input="(val) => { const p = provinces.find(x => x.ProvinceID === val); if (p) selectProvince(p); }"
                        inputId="newAddressProvince"
                      />
                      <div v-if="errors.provinceId" class="error-tooltip">{{ errors.provinceId }}</div>
                    </div>
                    <span v-if="errors.provinceId" class="error-text">{{ errors.provinceId }}</span>
                  </div>

                  <!-- District -->
                  <div class="form-group">
                    <label for="newAddressDistrict">District / County <span class="required">*</span></label>
                    <div class="input-wrapper">
                      <VSelect
                        :options="filteredDistricts"
                        label="DistrictName"
                        :reduce="d => d.DistrictID"
                        v-model="form.districtId"
                        :class="{ 'vselect-error': errors.districtId }"
                        placeholder="Find or select a district"
                        :disabled="!form.provinceId"
                        @input="(val) => { const d = districts.find(x => x.DistrictID === val); if (d) selectDistrict(d); }"
                        inputId="newAddressDistrict"
                      />
                      <div v-if="errors.districtId" class="error-tooltip">{{ errors.districtId }}</div>
                    </div>
                    <span v-if="errors.districtId" class="error-text">{{ errors.districtId }}</span>
                  </div>

                  <!-- Ward -->
                  <div class="form-group">
                    <label for="newAddressWard">Ward / Commune <span class="required">*</span></label>
                    <div class="input-wrapper">
                      <VSelect
                        :options="filteredWards"
                        label="WardName"
                        :reduce="w => w.WardCode"
                        v-model="form.wardCode"
                        :class="{ 'vselect-error': errors.wardCode }"
                        placeholder="Find or select a commune/ward"
                        :disabled="!form.districtId"
                        @input="(val) => { const w = wards.find(x => x.WardCode === val); if (w) selectWard(w); }"
                        inputId="newAddressWard"
                      />
                      <div v-if="errors.wardCode" class="error-tooltip">{{ errors.wardCode }}</div>
                    </div>
                    <span v-if="errors.wardCode" class="error-text">{{ errors.wardCode }}</span>
                  </div>
                </div>

                <!-- Postal Code & Country -->
                <div class="form-row">
                  <div class="form-group">
                    <label>Postal Code / ZIP <span class="required">*</span></label>
                    <div class="input-wrapper">
                      <input v-model="form.postalCode" class="form-input" :class="{ 'error': errors.postalCode }" placeholder="100000" />
                      <div v-if="errors.postalCode" class="error-tooltip">{{ errors.postalCode }}</div>
                    </div>
                    <span v-if="errors.postalCode" class="error-text">{{ errors.postalCode }}</span>
                  </div>
                  <div class="form-group has-select">
                    <label>Country <span class="required">*</span></label>
                    <div class="input-wrapper">
                      <select v-model="form.country" class="form-select" :class="{ 'error': errors.country }">
                        <option value=""> Select country </option>
                        <option value="Vietnam">Vietnam</option>
                      </select>
                      <div v-if="errors.country" class="error-tooltip">{{ errors.country }}</div>
                    </div>
                    <span v-if="errors.country" class="error-text">{{ errors.country }}</span>
                  </div>
                </div>

                <!-- Default Address -->
                <div class="form-group checkbox-group">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="form.isDefault" />
                    <span>Set as default address</span>
                  </label>
                </div>

                <!-- Actions -->
                <div class="form-actions">
                  <button type="button" class="btn-cancel" @click="cancel">Cancel</button>
                  <button type="submit" class="btn-save" :disabled="saving">
                    <span v-if="saving">Saving...</span>
                    <span v-else>Save Address</span>
                  </button>
                </div>
              </form>
            </div>
          </section>

        </main>
      </div>
    </transition>

    <Footer />
    <Chatbot />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Header from '@/User/components/Header1/Header.vue';
import Footer from '@/User/components/Footer/Footer.vue';
import Loading from '@/User/components/Loading/Loading.vue';
import { useAddressStore } from '@/User/stores/addressesStore.js';
import { useToast } from '@/User/components/Toast/useToast.js';
import { useAuth } from '@/User/components/useAuth.js';
import { usePrefetch } from '@/User/stores/usePrefetch.js';
import { getAddressById, createAddress, updateAddress, getProvinces, getDistricts, getWards } from '@/api/accountApi.js';
import Chatbot from '@/User/components/Chatbot/Chatbot.vue'
import 'vue-select/dist/vue-select.css';

const router = useRouter();
const route = useRoute();
const { add: toast } = useToast();
const { handleLogout } = useAuth();
const { prefetch } = usePrefetch();
const addressStore = useAddressStore();

// State
const isLoading = ref(true);
const formLoading = ref(false);
const isEditMode = ref(false);
const saving = ref(false);

const provinces = ref([]);
const districts = ref([]);
const wards = ref([]);

// Searchable dropdown: using vue-select component; no separate query refs needed
const filteredProvinces = computed(() => provinces.value || []);
const filteredDistricts = computed(() => districts.value || []);
const filteredWards = computed(() => wards.value || []);

const form = ref({
  firstName: '',
  lastName: '',
  phone: '',
  addressLine: '',
  addressLine2: '',
  // new fields to match AddressRequest
  provinceId: null,
  stateOrProvince: '',
  city: '',
  postalCode: '',
  districtId: null,
  districtName: '',
  wardCode: '',
  wardName: '',
  country: '',
  isDefault: false
});

// Validation errors container
const errors = ref({});

// Helper to normalize boolean-like values from API
const normalizeBoolean = (v) => {
  if (v === true || v === 1 || v === '1' || v === 'true') return true;
  return false;
};

// Focus vào lỗi đầu tiên
const focusFirstError = () => {
  nextTick(() => {
    const firstErrorKey = Object.keys(errors.value)[0];
    if (firstErrorKey) {
      const selector = `input[v-model="form.${firstErrorKey}"], select[v-model="form.${firstErrorKey}"]`;
      const el = document.querySelector(selector);
      el?.focus();
    }
  });
};

// Xử lý lỗi validation từ backend
const handleValidationError = (err) => {
  if (err.response?.data?.code === 400 && err.response?.data?.result) {
    errors.value = { ...err.response.data.result };
    focusFirstError();
    return true;
  }
  return false;
};

// Location loaders
const loadProvinces = async () => {
  try {
    const res = await getProvinces();
    provinces.value = res.data.result || res.data || [];
  } catch (e) {
    console.error('loadProvinces error', e);
    provinces.value = [];
  }
};

const loadDistricts = async (provinceId) => {
  districts.value = [];
  wards.value = [];
  if (!provinceId) return;
  try {
    const res = await getDistricts(provinceId);
    districts.value = res.data.result || res.data || [];
  } catch (e) {
    console.error('loadDistricts error', e);
    districts.value = [];
  }
};

const loadWards = async (districtId) => {
  wards.value = [];
  if (!districtId) return;
  try {
    const res = await getWards(districtId);
    wards.value = res.data.result || res.data || [];
  } catch (e) {
    console.error('loadWards error', e);
    wards.value = [];
  }
};

// Load địa chỉ khi edit
const loadAddress = async (id) => {
  formLoading.value = true;
  try {
    const res = await getAddressById(id);
    const addr = res.data.result;
    Object.assign(form.value, {
      firstName: addr.firstName || '',
      lastName: addr.lastName || '',
      phone: addr.phone || '',
      addressLine: addr.addressLine || '',
      addressLine2: addr.addressLine2 || '',
      city: addr.city || '',
      stateOrProvince: addr.stateOrProvince || '',
      postalCode: addr.postalCode || '',
      country: addr.country || '',
      // normalize isDefault explicitly to boolean (handles 'true'/'1'/1/true)
      isDefault: normalizeBoolean(addr.isDefault),
      // new fields
      provinceId: addr.provinceId ?? addr.province_id ?? null,
      districtId: addr.districtId ?? addr.district_id ?? null,
      districtName: addr.districtName || addr.district_name || '',
      wardCode: addr.wardCode || addr.ward_code || '',
      wardName: addr.wardName || addr.ward_name || ''
    });

    // load locations to populate selects
    await loadProvinces();
    // if provinceId exists in address, try to set the province name from loaded list
    if (form.value.provinceId) {
      const p = provinces.value.find(p => p.ProvinceID === form.value.provinceId || p.ProvinceID == form.value.provinceId);
      if (p) {
        form.value.stateOrProvince = p.ProvinceName || form.value.stateOrProvince;
      }
      await loadDistricts(form.value.provinceId);
    }
    if (form.value.districtId) {
      const d = districts.value.find(d => d.DistrictID === form.value.districtId || d.DistrictID == form.value.districtId);
      if (d) {
        form.value.districtName = d.DistrictName || form.value.districtName;
      }
      await loadWards(form.value.districtId);
    }
    if (form.value.wardCode) {
      const w = wards.value.find(w => w.WardCode === form.value.wardCode || w.WardCode == form.value.wardCode);
      if (w) {
        form.value.wardName = w.WardName || form.value.wardName;
      }
    }
  } catch (e) {
    console.error(e);
    toast('Không tải được địa chỉ.', 'error');
    await router.push('/addresses');
  } finally {
    formLoading.value = false;
  }
};

// Save
const saveAddress = async () => {
  errors.value = {};
  saving.value = true;

  try {
    // prepare payload matching AddressRequest
    const payload = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      phone: form.value.phone,
      addressLine: form.value.addressLine,
      addressLine2: form.value.addressLine2,
      districtId: form.value.districtId ? Number(form.value.districtId) : null,
      districtName: form.value.districtName || '',
      wardCode: form.value.wardCode || '',
      wardName: form.value.wardName || '',
      provinceId: form.value.provinceId ? Number(form.value.provinceId) : null,
      stateOrProvince: form.value.stateOrProvince || '',
      city: form.value.city || '',
      postalCode: form.value.postalCode || '',
      country: form.value.country || '',
      isDefault: !!form.value.isDefault
    };

    if (isEditMode.value) {
      await updateAddress(route.params.id, payload);
      addressStore.updateAddressLocally(+route.params.id, { id: +route.params.id, ...payload });
      toast('Cập nhật địa chỉ thành công!', 'success');
    } else {
      const res = await createAddress(payload);
      addressStore.addAddressLocally(res.data.result);
      toast('Thêm địa chỉ thành công!', 'success');
    }

    // Chuyển hướng ngay
    await router.push('/addresses');
  } catch (err) {
    if (!handleValidationError(err)) {
      toast(err.response?.data?.message || 'Lưu địa chỉ thất bại.', 'error');
    }
  } finally {
    saving.value = false;
  }
};

const cancel = () => router.push('/addresses');

// onMounted
onMounted(async () => {
  await loadProvinces();
  const id = route.params.id;
  if (id) {
    isEditMode.value = true;
    await loadAddress(id);
  }
  setTimeout(() => { isLoading.value = false; }, 300);
});
</script>

<style src="./NewAddress.css" scoped></style>
<style scoped>
/* Input wrapper để tooltip */
.input-wrapper {
  position: relative;
}

.form-input.error,
.form-select.error {
  border-color: #f44336;
  box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
}

/* Make native select match text inputs visually and be full width */
.form-select {
  display: block;
  width: 100%;
  min-height: 44px;
  padding: 6px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  font-size: 14px;
  color: #111827;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

/* align select caret to the right and ensure it doesn't overlap text */
.form-group { position: relative; }
.form-group .form-select { padding-right: 36px; }
.form-group .form-select::-ms-expand { display: none; }

/* Error visuals for native select */
.form-select.error {
  border-color: #f44336;
  box-shadow: 0 0 0 3px rgba(244,67,54,0.08);
}

/* caret for native select: small chevron using inline SVG */
.form-group.has-select::after {
  content: '';
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path fill='%236b7280' d='M5.5 7.5l4.5 4.5 4.5-4.5' stroke='%236b7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/></svg>");
  background-repeat: no-repeat;
  background-size: 12px 12px;
  pointer-events: none;
  opacity: 0.9;
}

/* Checkbox group */
.checkbox-group {
  flex-direction: row;
  gap: 8px;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin: 0;
  font-weight: normal;
}

.checkbox-label input {
  width: auto;
}

/* Status Message */
.status-message {
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 14px;
  margin: 16px 0;
  font-weight: 500;
}

.status-message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* Skeleton */
.skeleton-form { pointer-events: none; }
.skeleton-card {
  padding: 24px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fafafa;
}
.skeleton-line {
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 16px;
}
.skeleton-line.title { height: 20px; margin-bottom: 24px; }

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Override for vue-select error state */
.vselect-error {
  border-color: #f44336 !important;
  box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1) !important;
}

/* Modern styling for vue-select (v4) to match project inputs */
/* VSelect Styling - Modern Design */
.vue-select,
.v-select {
  width: 100%;
}

.vue-select .vs__dropdown-toggle {
  width: 100%;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  padding: 8px 12px;
  min-height: 46px;
  align-items: center;
  display: flex;
  background: #fff;
  transition: all 0.2s ease;
}

.vue-select .vs__dropdown-toggle:hover {
  border-color: #9ca3af;
}

.vue-select.vs--open .vs__dropdown-toggle {
  border-color: #0068e1;
  box-shadow: 0 0 0 3px rgba(0, 104, 225, 0.1);
}

.vue-select .vs__selected {
  color: #111827;
  font-size: 14px;
  font-weight: 500;
  margin: 2px 0;
  padding: 0;
}

.vue-select .vs__search {
  color: #111827;
  font-size: 14px;
  margin: 2px 0;
  padding: 0;
}

.vue-select .vs__search::placeholder {
  color: #9ca3af;
}

.vue-select .vs__actions {
  padding: 0 6px 0 3px;
}

.vue-select .vs__clear,
.vue-select .vs__open-indicator {
  fill: #6b7280;
  transition: fill 0.2s;
}

.vue-select:hover .vs__clear,
.vue-select:hover .vs__open-indicator {
  fill: #374151;
}

.vue-select .vs__dropdown-menu {
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  max-height: 280px;
  overflow: auto;
  margin-top: 4px;
  background: #fff;
  z-index: 60;
}

.vue-select .vs__dropdown-option {
  padding: 12px 14px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  transition: background 0.15s;
}

.vue-select .vs__dropdown-option--highlight {
  background: #f0f7ff;
  color: #0068e1;
}

.vue-select .vs__dropdown-option--selected {
  background: #0068e1;
  color: white;
  font-weight: 600;
}

.vue-select .vs__no-options {
  padding: 14px;
  color: #9ca3af;
  font-size: 13px;
  text-align: center;
}

/* Disabled state */
.vue-select.vs--disabled .vs__dropdown-toggle {
  background: #f3f4f6;
  cursor: not-allowed;
  border-color: #e5e7eb;
}

.vue-select.vs--disabled .vs__search,
.vue-select.vs--disabled .vs__selected {
  color: #9ca3af;
}

/* Error state */
.vselect-error .vs__dropdown-toggle {
  border-color: #dc2626 !important;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
}

/* Small responsiveness */
@media (max-width: 640px) {
  .vue-select .vs__dropdown-toggle {
    min-height: 42px;
    padding: 6px 10px;
  }
  .vue-select .vs__dropdown-option {
    padding: 10px 12px;
    font-size: 13px;
  }
}
</style>
