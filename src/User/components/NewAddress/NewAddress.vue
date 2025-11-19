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

                <!-- State/Province & City & Postal Code & Country -->
                <div class="form-row">
                  <div class="form-group">
                    <label>State / Province <span class="required">*</span></label>
                    <div class="input-wrapper">
                      <input v-model="form.stateOrProvince" class="form-input" :class="{ 'error': errors.stateOrProvince }" placeholder="Hanoi" />
                      <div v-if="errors.stateOrProvince" class="error-tooltip">{{ errors.stateOrProvince }}</div>
                    </div>
                    <span v-if="errors.stateOrProvince" class="error-text">{{ errors.stateOrProvince }}</span>
                  </div>
                  <div class="form-group">
                    <label>City <span class="required">*</span></label>
                    <div class="input-wrapper">
                      <input v-model="form.city" class="form-input" :class="{ 'error': errors.city }" placeholder="Hanoi City" />
                      <div v-if="errors.city" class="error-tooltip">{{ errors.city }}</div>
                    </div>
                    <span v-if="errors.city" class="error-text">{{ errors.city }}</span>
                  </div>
                  <div class="form-group">
                    <label>Postal Code / ZIP <span class="required">*</span></label>
                    <div class="input-wrapper">
                      <input v-model="form.postalCode" class="form-input" :class="{ 'error': errors.postalCode }" placeholder="100000" />
                      <div v-if="errors.postalCode" class="error-tooltip">{{ errors.postalCode }}</div>
                    </div>
                    <span v-if="errors.postalCode" class="error-text">{{ errors.postalCode }}</span>
                  </div>
                  <div class="form-group">
                    <label>Country <span class="required">*</span></label>
                    <div class="input-wrapper">
                      <select v-model="form.country" class="form-select" :class="{ 'error': errors.country }">
                        <option value=""> Chọn quốc gia </option>
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
import { ref, onMounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Header from '@/User/components/Header1/Header.vue';
import Footer from '@/User/components/Footer/Footer.vue';
import Loading from '@/User/components/Loading/Loading.vue';
import { useAddressStore } from '@/User/stores/addressesStore.js';
import { useToast } from '@/User/components/Toast/useToast.js';
import { useAuth } from '@/User/components/useAuth.js';
import { usePrefetch } from '@/User/stores/usePrefetch.js';
import { getAddressById, createAddress, updateAddress } from '@/api/accountApi.js';
import Chatbot from '@/User/components/Chatbot/Chatbot.vue'

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

const form = ref({
  firstName: '',
  lastName: '',
  phone: '',
  addressLine: '',
  addressLine2: '',
  stateOrProvince: '',
  city: '',
  postalCode: '',
  country: '',
  isDefault: false
});

const errors = ref({});

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
      isDefault: addr.isDefault || false
    });
  } catch {
    toast('Không tải được địa chỉ.', 'error');
    await router.push('/addresses');
  } finally {
    formLoading.value = false;
  }
};

// Save
// Save
const saveAddress = async () => {
  errors.value = {};
  saving.value = true;

  try {
    const payload = { ...form.value };

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

.error-text {
  color: #f44336;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.error-tooltip {
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  background: #f44336;
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 10;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s;
}

.input-wrapper:hover .error-tooltip {
  opacity: 1;
  visibility: visible;
}

.error-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: #f44336;
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
</style>
