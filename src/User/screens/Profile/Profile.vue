<template>
  <div class="account-wrapper">
    <Header1 />
    <Loading v-if="isLoading" />

    <div v-else class="account-page">
      <!-- Sidebar -->
      <aside class="account-sidebar">
        <nav class="sidebar-nav">
          <router-link to="/account" class="nav-item"><i class="fa-solid fa-gauge"></i><span>Dashboard</span></router-link>
          <router-link to="/orders" class="nav-item"><i class="fa-solid fa-cart-shopping"></i><span>My Orders</span></router-link>
          <router-link to="/wishlist" class="nav-item"><i class="fa-regular fa-heart"></i><span>My Wishlist</span></router-link>
          <router-link to="/addresses" class="nav-item"><i class="fa-regular fa-address-book"></i><span>My Addresses</span></router-link>
          <router-link to="/profile" class="nav-item router-link-active"><i class="fa-regular fa-user"></i><span>My Profile</span></router-link>
          <a href="#" class="nav-item" @click.prevent="handleLogout"><i class="fa-solid fa-right-from-bracket"></i><span>Logout</span></a>
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

        <section class="profile-section">
          <h2>My Profile</h2>

          <!-- Personal Information -->
          <div class="profile-form-card">
            <h3 class="form-title">Personal Information</h3>
            <form @submit.prevent="updateProfileHandler" class="profile-form">
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

              <!-- THÔNG BÁO FORM INFO -->
              <div v-if="infoMessage" :class="['status-message', infoMessage.type]">
                {{ infoMessage.text }}
              </div>
            </form>
          </div>

          <!-- Change Password -->
          <div class="profile-form-card mt-30">
            <h3 class="form-title">Change Password</h3>
            <form @submit.prevent="changePasswordHandler" class="profile-form">
              <div class="form-row">
                <div class="form-group">
                  <label>Current Password <span class="required">*</span></label>
                  <div class="input-wrapper">
                    <input type="password" v-model="passForm.oldPassword" class="form-input" :class="{ 'error': errors.oldPassword }" />
                    <div v-if="errors.oldPassword" class="error-tooltip">{{ errors.oldPassword }}</div>
                  </div>
                  <span v-if="errors.oldPassword" class="error-text">{{ errors.oldPassword }}</span>
                </div>
                <div class="form-group">
                  <label>New Password <span class="required">*</span></label>
                  <div class="input-wrapper">
                    <input type="password" v-model="passForm.newPassword" class="form-input" :class="{ 'error': errors.newPassword }" />
                    <div v-if="errors.newPassword" class="error-tooltip">{{ errors.newPassword }}</div>
                  </div>
                  <span v-if="errors.newPassword" class="error-text">{{ errors.newPassword }}</span>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Confirm New Password <span class="required">*</span></label>
                  <div class="input-wrapper">
                    <input type="password" v-model="passForm.confirmPassword" class="form-input" :class="{ 'error': errors.confirmPassword }" />
                    <div v-if="errors.confirmPassword" class="error-tooltip">{{ errors.confirmPassword }}</div>
                  </div>
                  <span v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</span>
                </div>
                <div class="form-group"></div>
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
        </section>
      </main>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import Header1 from '@/User/components/Header/Header1.vue';
import Footer from '@/User/components/Footer/Footer.vue';
import Loading from '@/User/components/Loading/Loading.vue';
import { getMyInfo, updateProfile, changePassword } from '@/api/accountApi.js';

const router = useRouter();
const isLoading = ref(true);
const isSavingInfo = ref(false);
const isSavingPass = ref(false);
const infoMessage = ref(null);
const passMessage = ref(null);

// Dữ liệu form
const infoForm = ref({ email: '', phone: '', firstName: '', lastName: '' });
const passForm = ref({ oldPassword: '', newPassword: '', confirmPassword: '' });

// Lỗi validate
const errors = ref({});

// Focus vào input lỗi đầu tiên
const focusFirstError = () => {
  nextTick(() => {
    const firstErrorKey = Object.keys(errors.value)[0];
    if (firstErrorKey) {
      const el = document.querySelector(`input[name="${firstErrorKey}"], input[v-model="${firstErrorKey}"]`);
      el?.focus();
    }
  });
};

// Xử lý lỗi từ API
const handleValidationError = (err, formType = 'info') => {
  if (err.response?.data?.code === 400 && err.response?.data?.result) {
    const validationErrors = err.response.data.result;
    errors.value = { ...errors.value, ...validationErrors };

    // Xóa lỗi không liên quan
    if (formType === 'info') {
      delete errors.value.oldPassword;
      delete errors.value.newPassword;
      delete errors.value.confirmPassword;
    } else {
      delete errors.value.email;
      delete errors.value.phone;
      delete errors.value.firstName;
      delete errors.value.lastName;
    }

    focusFirstError();
    return true;
  }
  return false;
};

// Load profile
const loadProfile = async () => {
  try {
    const res = await getMyInfo();
    if (res.data.code === 200) {
      const user = res.data.result;
      infoForm.value = {
        email: user.email || '',
        phone: user.phone || '',
        firstName: user.firstName || '',
        lastName: user.lastName || ''
      };
    }
  } catch {
    showInfoMessage('Failed to load profile.', 'error');
  } finally {
    isLoading.value = false;
  }
};

// Update profile
const updateProfileHandler = async () => {
  errors.value = {};
  isSavingInfo.value = true;
  try {
    const payload = { ...infoForm.value };
    await updateProfile(payload);
    showInfoMessage('Profile updated successfully!', 'success');
  } catch (err) {
    if (!handleValidationError(err, 'info')) {
      showInfoMessage(err.response?.data?.message || 'Update failed.', 'error');
    }
  } finally {
    isSavingInfo.value = false;
  }
};

// Change password
const changePasswordHandler = async () => {
  errors.value = {};
  if (passForm.value.newPassword !== passForm.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match!';
    focusFirstError();
    return;
  }

  isSavingPass.value = true;
  try {
    await changePassword({
      oldPassword: passForm.value.oldPassword,
      newPassword: passForm.value.newPassword
    });
    showPassMessage('Password changed successfully!', 'success');
    passForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' };
  } catch (err) {
    if (!handleValidationError(err, 'pass')) {
      showPassMessage(err.response?.data?.message || 'Wrong current password.', 'error');
    }
  } finally {
    isSavingPass.value = false;
  }
};

// Show message
const showInfoMessage = (text, type = 'success') => {
  infoMessage.value = { text, type };
  setTimeout(() => (infoMessage.value = null), 5000);
};

const showPassMessage = (text, type = 'success') => {
  passMessage.value = { text, type };
  setTimeout(() => (passMessage.value = null), 5000);
};

// Logout
const handleLogout = () => {
  localStorage.clear();
  window.dispatchEvent(new Event('loginStatusChanged'));
  router.push('/login');
};

onMounted(loadProfile);
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

/* Status Message */
.status-message {
  margin-top: 20px;
  padding: 14px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  animation: slideDown 0.4s ease;
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

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
