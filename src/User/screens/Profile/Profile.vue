<template>
  <div class="account-wrapper">
    <Header />

    <!-- Transition toàn trang -->
    <transition name="fade" mode="out-in">
      <div v-if="isLoading" class="loading-wrapper">
        <Loading />
      </div>

      <div v-else class="account-page">
        <!-- Sidebar -->
        <aside class="account-sidebar">
          <nav class="sidebar-nav">
            <router-link to="/account" @mouseenter="prefetch('/account')" @mouseleave="cancel" class="nav-item">
              <i class="fa-solid fa-gauge"></i><span>Dashboard</span>
            </router-link>
            <router-link to="/orders" @mouseenter="prefetch('/orders')" @mouseleave="cancel" class="nav-item">
              <i class="fa-solid fa-cart-shopping"></i><span>My Orders</span>
            </router-link>
            <router-link to="/my-cases" @mouseenter="prefetch('/my-cases')" @mouseleave="cancel" class="nav-item">
              <i class="fa-solid fa-rotate-left"></i>
              <span>My Cases</span>
            </router-link>
            <router-link to="/wishlist" @mouseenter="prefetch('/wishlist')" @mouseleave="cancel" class="nav-item">
              <i class="fa-regular fa-heart"></i><span>My Wishlist</span>
            </router-link>
            <router-link to="/addresses" @mouseenter="prefetch('/addresses')" @mouseleave="cancel" class="nav-item">
              <i class="fa-regular fa-address-book"></i><span>My Addresses</span>
            </router-link>
            <router-link to="/profile" class="nav-item active">
              <i class="fa-regular fa-user"></i><span>My Profile</span>
            </router-link>
            <a href="#" class="nav-item" @click.prevent="handleLogout">
              <i class="fa-solid fa-right-from-bracket"></i><span>Logout</span>
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
            <span>My Profile</span>
          </div>

          <!-- Lazy Load Section -->
          <div ref="profileTarget">
            <section v-if="profileVisible" class="profile-section">
              <h2>My Profile</h2>

              <!-- Skeleton -->
              <div v-if="profileLoading" class="skeleton-form">
                <div class="skeleton-card">
                  <div class="skeleton-line title"></div>
                  <div class="form-row">
                    <div class="form-group"><div class="skeleton-line"></div></div>
                    <div class="form-group"><div class="skeleton-line"></div></div>
                  </div>
                  <div class="form-row">
                    <div class="form-group"><div class="skeleton-line"></div></div>
                    <div class="form-group"><div class="skeleton-line"></div></div>
                  </div>
                </div>
                <div class="skeleton-card mt-30">
                  <div class="skeleton-line title"></div>
                  <div class="form-row">
                    <div class="form-group"><div class="skeleton-line"></div></div>
                    <div class="form-group"><div class="skeleton-line"></div></div>
                  </div>
                  <div class="form-row">
                    <div class="form-group"><div class="skeleton-line"></div></div>
                    <div class="form-group"></div>
                  </div>
                </div>
              </div>

              <!-- Real Form -->
              <div v-else>
                <!-- Personal Information -->
                <div class="profile-form-card fade-in">
                  <h3 class="form-title">Personal Information</h3>
                  <form @submit.prevent="updateProfileHandler" class="profile-form">
                    <!-- Form nội dung giữ nguyên -->
                    <div class="form-row">
                      <div class="form-group">
                        <label>Email <span class="required">*</span></label>
                        <div class="input-wrapper">
                          <input type="email" v-model="infoForm.email" class="form-input" :class="{ 'error': errors.email }" />
                          <div v-if="errors.email" class="error-tooltip">{{ errors.email }}</div>
                        </div>
                        <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
                      </div>
                      <div class="form-group">
                        <label>Phone <span class="required">*</span></label>
                        <div class="input-wrapper">
                          <input type="tel" v-model="infoForm.phone" class="form-input" :class="{ 'error': errors.phone }" />
                          <div v-if="errors.phone" class="error-tooltip">{{ errors.phone }}</div>
                        </div>
                        <span v-if="errors.phone" class="error-text">{{ errors.phone }}</span>
                      </div>
                    </div>

                    <div class="form-row">
                      <div class="form-group">
                        <label>First Name <span class="required">*</span></label>
                        <div class="input-wrapper">
                          <input type="text" v-model="infoForm.firstName" class="form-input" :class="{ 'error': errors.firstName }" />
                          <div v-if="errors.firstName" class="error-tooltip">{{ errors.firstName }}</div>
                        </div>
                        <span v-if="errors.firstName" class="error-text">{{ errors.firstName }}</span>
                      </div>
                      <div class="form-group">
                        <label>Last Name <span class="required">*</span></label>
                        <div class="input-wrapper">
                          <input type="text" v-model="infoForm.lastName" class="form-input" :class="{ 'error': errors.lastName }" />
                          <div v-if="errors.lastName" class="error-tooltip">{{ errors.lastName }}</div>
                        </div>
                        <span v-if="errors.lastName" class="error-text">{{ errors.lastName }}</span>
                      </div>
                    </div>

                    <div class="form-actions">
                      <button type="submit" class="btn-save" :disabled="isSavingInfo">
                        <span v-if="isSavingInfo">Saving...</span>
                        <span v-else>Save Changes</span>
                      </button>
                    </div>

                    <div v-if="infoMessage" :class="['status-message', infoMessage.type]">
                      {{ infoMessage.text }}
                    </div>
                  </form>
                </div>

                <!-- Change Password -->
                <div class="profile-form-card mt-30 fade-in" :style="{ animationDelay: '0.1s' }">
                  <h3 class="form-title">Change Password</h3>
                  <form @submit.prevent="changePasswordHandler" class="profile-form">
                    <!-- Giữ nguyên -->
                    <div class="form-row">
                      <div class="form-group">
                        <label>Current Password <span class="required">*</span></label>
                        <div class="input-wrapper">
                          <input type="password" placeholder="••••••" v-model="passForm.oldPassword" class="form-input" :class="{ 'error': errors.oldPassword }" />
                          <div v-if="errors.oldPassword" class="error-tooltip">{{ errors.oldPassword }}</div>
                        </div>
                        <span v-if="errors.oldPassword" class="error-text">{{ errors.oldPassword }}</span>
                      </div>
                      <div class="form-group">
                        <label>New Password <span class="required">*</span></label>
                        <div class="input-wrapper">
                          <input type="password" placeholder="••••••" v-model="passForm.newPassword" class="form-input" :class="{ 'error': errors.newPassword }" />
                          <div v-if="errors.newPassword" class="error-tooltip">{{ errors.newPassword }}</div>
                        </div>
                        <span v-if="errors.newPassword" class="error-text">{{ errors.newPassword }}</span>
                      </div>
                    </div>

                    <div class="form-row">
                      <div class="form-group">
                        <label>Confirm New Password <span class="required">*</span></label>
                        <div class="input-wrapper">
                          <input type="password" placeholder="••••••" v-model="passForm.confirmPassword" class="form-input" :class="{ 'error': errors.confirmPassword }" />
                          <div v-if="errors.confirmPassword" class="error-tooltip">{{ errors.confirmPassword }}</div>
                        </div>
                        <span v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</span>
                      </div>
                    </div>

                    <div class="form-actions">
                      <button type="submit" class="btn-save" :disabled="isSavingPass">
                        <span v-if="isSavingPass">Changing...</span>
                        <span v-else>Change Password</span>
                      </button>
                    </div>

                    <div v-if="passMessage" :class="['status-message', passMessage.type]">
                      {{ passMessage.text }}
                    </div>
                  </form>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </transition>

    <Footer />
    <Chatbot />
    <BottomNavBar />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import Header from '@/User/components/Header1/Header.vue';
import Footer from '@/User/components/Footer/Footer.vue';
import Loading from '@/User/components/Loading/Loading.vue';
import { useProfileStore } from '@/User/stores/profileStore.js';
import { useAuth } from '@/User/components/useAuth.js';
import { useToast } from '@/User/components/Toast/useToast.js';
import { useLazyLoad } from '@/User/components/LazyLoad/useLazyLoad.js';
import { usePrefetch } from '@/User/stores/usePrefetch.js';
import { updateProfile, changePassword } from '@/api/accountApi.js';
import Chatbot from '@/User/components/Chatbot/Chatbot.vue'
import BottomNavBar from '@/User/components/BottomNavBar.vue'

const router = useRouter();
const { handleLogout: authLogout } = useAuth();
const { add: toast } = useToast();
const profileStore = useProfileStore();
const { prefetch, cancel } = usePrefetch();

// State
const isLoading = ref(true);
const profileLoading = ref(false);
const infoForm = ref({ email: '', phone: '', firstName: '', lastName: '' });
const passForm = ref({ oldPassword: '', newPassword: '', confirmPassword: '' });
const errors = ref({});
const infoMessage = ref(null);
const passMessage = ref(null);
const isSavingInfo = ref(false);
const isSavingPass = ref(false);

// Lazy load
const profileTarget = ref(null);
const { isVisible: profileVisible } = useLazyLoad(async () => {
  if (infoForm.value.email) return;
  profileLoading.value = true;
  try {
    const data = await profileStore.fetchProfile();
    infoForm.value = { ...data };
  } catch {
    toast('Unable to load profile information.', 'error');
  } finally {
    profileLoading.value = false;
  }
}, profileTarget);

// Focus lỗi
const focusFirstError = () => {
  nextTick(() => {
    const firstErrorKey = Object.keys(errors.value)[0];
    if (firstErrorKey) {
      const el = document.querySelector(`input[v-model*="${firstErrorKey}"]`);
      el?.focus();
    }
  });
};

// Xử lý lỗi validate
const handleValidationError = (err) => {
  if (err.response?.data?.code === 400 && err.response?.data?.result) {
    errors.value = { ...err.response.data.result };
    focusFirstError();
    return true;
  }
  return false;
};

// Update profile
const updateProfileHandler = async () => {
  errors.value = {};
  isSavingInfo.value = true;
  try {
    await updateProfile(infoForm.value);
    toast('Update successful!', 'success');
    await profileStore.fetchProfile(true); // refresh cache
  } catch (err) {
    if (!handleValidationError(err, 'info')) {
      toast(err.response?.data?.message || 'Update failed.', 'error');
    }
  } finally {
    isSavingInfo.value = false;
  }
};

// Change password
const changePasswordHandler = async () => {
  errors.value = {};
  if (passForm.value.newPassword !== passForm.value.confirmPassword) {
    errors.value.confirmPassword = 'Mật khẩu không khớp!';
    focusFirstError();
    return;
  }

  isSavingPass.value = true;
  try {
    await changePassword({
      oldPassword: passForm.value.oldPassword,
      newPassword: passForm.value.newPassword
    });
    toast('Đổi mật khẩu thành công!', 'success');
    passForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' };
  } catch (err) {
    if (!handleValidationError(err, 'pass')) {
      toast(err.response?.data?.message || 'Mật khẩu cũ sai.', 'error');
    }
  } finally {
    isSavingPass.value = false;
  }
};

// Logout
const handleLogout = async () => {
  await authLogout();
  await router.push('/login');
};

// Initial load
onMounted(async () => {
  try {
    const cached = profileStore.profile;
    if (cached) {
      infoForm.value = { ...cached };
    } else {
      const data = await profileStore.fetchProfile();
      infoForm.value = { ...data };
    }
  } catch (error) {
    if (error.response?.status === 401) {
      toast('Session expired.', 'error');
      await handleLogout();
    }
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 600);
  }
});
</script>

<style src="./Profile.css" scoped></style>
<style scoped>
/* Input wrapper để tooltip */
.input-wrapper {
  position: relative;
}

.form-input.error {
  border-color: #f44336;
  box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
}

.error-text {
  color: #f44336;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

/* Tooltip khi hover */
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
/* Form Title */
.form-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #0066FF;
}

/* Margin top cho form thứ 2 */
.mt-30 {
  margin-top: 30px;
}

.fade-enter-active, .fade-leave-active { transition: all 0.5s ease; }
.fade-enter-from { opacity: 0; transform: translateY(10px); }

.loading-wrapper { min-height: 60vh; display: flex; align-items: center; justify-content: center; }

/* Skeleton Form */
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
.mt-30 { margin-top: 30px; }

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Form animation */
.fade-in {
  opacity: 0;
  animation: fadeInForm 0.5s ease forwards;
}
@keyframes fadeInForm {
  to { opacity: 1; transform: translateY(0); }
}

/* Active nav */
.sidebar-nav .nav-item.active {
  background: #f0f7ff;
  color: #007bff;
  font-weight: 600;
}
</style>
