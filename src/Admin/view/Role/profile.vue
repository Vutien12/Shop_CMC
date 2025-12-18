<template>
  <div class="profile-page">
    <!-- Page header -->
    <div class="page-header">
      <h1 class="page-title">Hồ sơ người dùng</h1>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="loading-container">
      <div class="spinner"></div>
      <p>Đang tải thông tin...</p>
    </div>

    <!-- Profile content -->
    <div v-else class="profile-content">
      <!-- Profile Header Card -->
      <div class="profile-header-card">
        <div class="profile-banner">
          <div class="banner-gradient"></div>
        </div>
        <div class="profile-header-content">
          <div class="profile-avatar-container">
            <div class="profile-avatar">
              <span class="avatar-letter">{{ profileFirstLetter }}</span>
              <div class="avatar-ring"></div>
            </div>
            <div class="online-indicator"></div>
          </div>
          <div class="profile-header-info">
            <h1 class="profile-name">{{ userData.firstName }} {{ userData.lastName }}</h1>
            <p class="profile-email-header">{{ userData.email }}</p>
            <span class="role-badge-large" :class="getRoleBadgeClass(userData.role)">
              <i class="fa fa-crown" v-if="userData.role === 'ADMIN'"></i>
              <i class="fa fa-user" v-else></i>
              {{ userData.role || 'USER' }}
            </span>
          </div>
          <button class="btn-edit-profile" @click="openEditModal">
            <i class="fa fa-edit"></i>
            <span>Chỉnh sửa hồ sơ</span>
          </button>
        </div>
      </div>

      <!-- Info Grid -->
      <div class="info-cards-grid">
        <!-- Personal Info Card -->
        <div class="info-card">
          <div class="info-card-header">
            <div class="info-card-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <i class="fa fa-user"></i>
            </div>
            <h3 class="info-card-title">Thông tin cá nhân</h3>
          </div>
          <div class="info-card-body">
            <div class="info-row">
              <div class="info-icon">
                <i class="fa fa-id-card"></i>
              </div>
              <div class="info-content">
                <label>Họ và tên</label>
                <p>{{ userData.firstName }} {{ userData.lastName }}</p>
              </div>
            </div>
            <div class="info-row">
              <div class="info-icon">
                <i class="fa fa-envelope"></i>
              </div>
              <div class="info-content">
                <label>Email</label>
                <p>{{ userData.email || 'Chưa có' }}</p>
              </div>
            </div>
            <div class="info-row">
              <div class="info-icon">
                <i class="fa fa-phone"></i>
              </div>
              <div class="info-content">
                <label>Số điện thoại</label>
                <p>{{ userData.phone || 'Chưa cập nhật' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Info Card -->
        <div class="info-card">
          <div class="info-card-header">
            <div class="info-card-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
              <i class="fa fa-briefcase"></i>
            </div>
            <h3 class="info-card-title">Thông tin tài khoản</h3>
          </div>
          <div class="info-card-body">
            <div class="info-row">
              <div class="info-icon">
                <i class="fa fa-shield-alt"></i>
              </div>
              <div class="info-content">
                <label>Vai trò</label>
                <p>
                  <span class="role-badge" :class="getRoleBadgeClass(userData.role)">
                    {{ userData.role || 'USER' }}
                  </span>
                </p>
              </div>
            </div>
            <div class="info-row">
              <div class="info-icon">
                <i class="fa fa-calendar-alt"></i>
              </div>
              <div class="info-content">
                <label>Ngày tạo tài khoản</label>
                <p>{{ formatDate(userData.createdAt) }}</p>
              </div>
            </div>
            <div class="info-row">
              <div class="info-icon">
                <i class="fa fa-clock"></i>
              </div>
              <div class="info-content">
                <label>Trạng thái</label>
                <p>
                  <span class="status-badge status-active">
                    <span class="status-dot"></span>
                    Đang hoạt động
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Security Card -->
        <div class="info-card security-card">
          <div class="info-card-header">
            <div class="info-card-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
              <i class="fa fa-lock"></i>
            </div>
            <h3 class="info-card-title">Bảo mật</h3>
          </div>
          <div class="info-card-body">
            <div class="security-feature">
              <div class="security-icon">
                <i class="fa fa-key"></i>
              </div>
              <div class="security-content">
                <h4>Mật khẩu</h4>
                <p>Bảo vệ tài khoản của bạn với mật khẩu mạnh</p>
              </div>
              <button class="btn-security-action" @click="openPasswordModal">
                <i class="fa fa-edit"></i>
                Đổi mật khẩu
              </button>
            </div>
            <div class="security-tips">
              <p class="security-tip">
                <i class="fa fa-info-circle"></i>
                Thay đổi mật khẩu định kỳ để đảm bảo an toàn
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <transition name="modal">
      <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
        <div class="modal-container">
          <div class="modal-header">
            <h2>Chỉnh sửa thông tin</h2>
            <button class="btn-close" @click="closeEditModal">
              <i class="fa fa-times"></i>
            </button>
          </div>

          <div class="modal-body">
            <form @submit.prevent="saveProfile">
              <div class="form-group">
                <label for="firstName">Họ <span class="required">*</span></label>
                <input
                  type="text"
                  id="firstName"
                  v-model="editForm.firstName"
                  class="form-control"
                  :class="{ 'is-invalid': editErrors.firstName }"
                  placeholder="Nhập họ"
                />
                <span v-if="editErrors.firstName" class="error-message">{{ editErrors.firstName }}</span>
              </div>

              <div class="form-group">
                <label for="lastName">Tên <span class="required">*</span></label>
                <input
                  type="text"
                  id="lastName"
                  v-model="editForm.lastName"
                  class="form-control"
                  :class="{ 'is-invalid': editErrors.lastName }"
                  placeholder="Nhập tên"
                />
                <span v-if="editErrors.lastName" class="error-message">{{ editErrors.lastName }}</span>
              </div>

              <div class="form-group">
                <label for="email">Email <span class="required">*</span></label>
                <input
                  type="email"
                  id="email"
                  v-model="editForm.email"
                  class="form-control"
                  :class="{ 'is-invalid': editErrors.email }"
                  placeholder="Nhập email"
                />
                <span v-if="editErrors.email" class="error-message">{{ editErrors.email }}</span>
              </div>

              <div class="form-group">
                <label for="phone">Số điện thoại</label>
                <input
                  type="tel"
                  id="phone"
                  v-model="editForm.phone"
                  class="form-control"
                  :class="{ 'is-invalid': editErrors.phone }"
                  placeholder="Nhập số điện thoại"
                />
                <span v-if="editErrors.phone" class="error-message">{{ editErrors.phone }}</span>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-cancel" @click="closeEditModal">
                  Hủy
                </button>
                <button type="submit" class="btn btn-save" :disabled="isSaving">
                  <i class="fa fa-spinner fa-spin" v-if="isSaving"></i>
                  {{ isSaving ? 'Đang lưu...' : 'Lưu thay đổi' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </transition>

    <!-- Change Password Modal -->
    <transition name="modal">
      <div v-if="showPasswordModal" class="modal-overlay" @click.self="closePasswordModal">
        <div class="modal-container modal-password">
          <div class="modal-header">
            <h2>Đổi mật khẩu</h2>
            <button class="btn-close" @click="closePasswordModal">
              <i class="fa fa-times"></i>
            </button>
          </div>

          <div class="modal-body">
            <form @submit.prevent="changePassword">
              <div class="form-group">
                <label for="currentPassword">Mật khẩu hiện tại <span class="required">*</span></label>
                <div class="password-input-wrapper">
                  <input
                    :type="showCurrentPassword ? 'text' : 'password'"
                    id="currentPassword"
                    v-model="passwordForm.currentPassword"
                    class="form-control"
                    :class="{ 'is-invalid': passwordErrors.currentPassword }"
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                  <button
                    type="button"
                    class="btn-toggle-password"
                    @click="showCurrentPassword = !showCurrentPassword"
                  >
                    <i :class="showCurrentPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
                  </button>
                </div>
                <span v-if="passwordErrors.currentPassword" class="error-message">{{ passwordErrors.currentPassword }}</span>
              </div>

              <div class="form-group">
                <label for="newPassword">Mật khẩu mới <span class="required">*</span></label>
                <div class="password-input-wrapper">
                  <input
                    :type="showNewPassword ? 'text' : 'password'"
                    id="newPassword"
                    v-model="passwordForm.newPassword"
                    class="form-control"
                    :class="{ 'is-invalid': passwordErrors.newPassword }"
                    placeholder="Nhập mật khẩu mới"
                  />
                  <button
                    type="button"
                    class="btn-toggle-password"
                    @click="showNewPassword = !showNewPassword"
                  >
                    <i :class="showNewPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
                  </button>
                </div>
                <span v-if="passwordErrors.newPassword" class="error-message">{{ passwordErrors.newPassword }}</span>
                <small class="form-hint">Mật khẩu phải có ít nhất 8 ký tự</small>
              </div>

              <div class="form-group">
                <label for="confirmPassword">Xác nhận mật khẩu mới <span class="required">*</span></label>
                <div class="password-input-wrapper">
                  <input
                    :type="showConfirmPassword ? 'text' : 'password'"
                    id="confirmPassword"
                    v-model="passwordForm.confirmPassword"
                    class="form-control"
                    :class="{ 'is-invalid': passwordErrors.confirmPassword }"
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  <button
                    type="button"
                    class="btn-toggle-password"
                    @click="showConfirmPassword = !showConfirmPassword"
                  >
                    <i :class="showConfirmPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
                  </button>
                </div>
                <span v-if="passwordErrors.confirmPassword" class="error-message">{{ passwordErrors.confirmPassword }}</span>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-cancel" @click="closePasswordModal">
                  Hủy
                </button>
                <button type="submit" class="btn btn-save" :disabled="isSaving">
                  <i class="fa fa-spinner fa-spin" v-if="isSaving"></i>
                  {{ isSaving ? 'Đang lưu...' : 'Đổi mật khẩu' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </transition>

    <!-- Toast Notification -->
    <transition name="toast">
      <div v-if="toast.show" class="toast" :class="toast.type">
        <i class="fa" :class="toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'"></i>
        <span>{{ toast.message }}</span>
      </div>
    </transition>
  </div>
</template>

<script>
import { getMyInfo, updateProfile, changePassword } from '@/api/accountApi';

export default {
  name: 'ProfilePage',
  data() {
    return {
      isLoading: true,
      isSaving: false,
      userData: {
        id: null,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
        createdAt: null,
        defaultAddress: null
      },

      showEditModal: false,
      editForm: {
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      },
      editErrors: {},

      showPasswordModal: false,
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordErrors: {},
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,

      toast: {
        show: false,
        message: '',
        type: 'success'
      }
    };
  },

  computed: {
    profileFirstLetter() {
      if (this.userData?.firstName) {
        return this.userData.firstName.charAt(0).toUpperCase();
      }
      return 'U';
    }
  },

  async mounted() {
    await this.loadUserData();
  },

  methods: {
    async loadUserData() {
      this.isLoading = true;
      try {
        const response = await getMyInfo();
        // Response structure: { data: { code, message, result } }
        const userData = response.data?.result || response.data || response;

        this.userData = {
          id: userData.id,
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          role: userData.role || '',
          createdAt: userData.createdAt,
          defaultAddress: userData.defaultAddress || null
        };

        console.log('Loaded user data:', this.userData);
      } catch (error) {
        console.error('Failed to load user:', error);
        this.showToast('Không thể tải thông tin người dùng', 'error');

        // Nếu lỗi 401, redirect về login
        if (error.response?.status === 401) {
          this.$router.push('/login');
        }
      } finally {
        this.isLoading = false;
      }
    },

    openEditModal() {
      this.editForm = {
        firstName: this.userData.firstName,
        lastName: this.userData.lastName,
        email: this.userData.email,
        phone: this.userData.phone
      };
      this.editErrors = {};
      this.showEditModal = true;
    },

    closeEditModal() {
      this.showEditModal = false;
      this.editForm = {
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      };
      this.editErrors = {};
    },

    validateEditForm() {
      this.editErrors = {};
      let isValid = true;

      if (!this.editForm.firstName.trim()) {
        this.editErrors.firstName = 'Họ không được để trống';
        isValid = false;
      }

      if (!this.editForm.lastName.trim()) {
        this.editErrors.lastName = 'Tên không được để trống';
        isValid = false;
      }

      if (!this.editForm.email.trim()) {
        this.editErrors.email = 'Email không được để trống';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.editForm.email)) {
        this.editErrors.email = 'Email không hợp lệ';
        isValid = false;
      }

      return isValid;
    },

    async saveProfile() {
      if (!this.validateEditForm()) {
        return;
      }

      this.isSaving = true;
      this.editErrors = {};

      try {
        const updateData = {
          firstName: this.editForm.firstName.trim(),
          lastName: this.editForm.lastName.trim(),
          email: this.editForm.email.trim(),
          phone: this.editForm.phone.trim()
        };

        await updateProfile(updateData);

        // Cập nhật lại userData sau khi save thành công
        this.userData.firstName = updateData.firstName;
        this.userData.lastName = updateData.lastName;
        this.userData.email = updateData.email;
        this.userData.phone = updateData.phone;

        this.showToast('Cập nhật thông tin thành công', 'success');
        this.closeEditModal();
      } catch (error) {
        console.error('Failed to update profile:', error);

        // Xử lý lỗi validation 400
        if (error.response?.status === 400 && error.response?.data?.result) {
          this.editErrors = { ...error.response.data.result };
          this.showToast('Vui lòng kiểm tra lại thông tin', 'error');
        } else {
          const message = error.response?.data?.message || 'Cập nhật thông tin thất bại';
          this.showToast(message, 'error');
        }
      } finally {
        this.isSaving = false;
      }
    },

    openPasswordModal() {
      this.passwordForm = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
      this.passwordErrors = {};
      this.showCurrentPassword = false;
      this.showNewPassword = false;
      this.showConfirmPassword = false;
      this.showPasswordModal = true;
    },

    closePasswordModal() {
      this.showPasswordModal = false;
      this.passwordForm = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
      this.passwordErrors = {};
    },

    validatePasswordForm() {
      this.passwordErrors = {};
      let isValid = true;

      if (!this.passwordForm.currentPassword) {
        this.passwordErrors.currentPassword = 'Mật khẩu hiện tại không được để trống';
        isValid = false;
      }

      if (!this.passwordForm.newPassword) {
        this.passwordErrors.newPassword = 'Mật khẩu mới không được để trống';
        isValid = false;
      } else if (this.passwordForm.newPassword.length < 8) {
        this.passwordErrors.newPassword = 'Mật khẩu phải có ít nhất 8 ký tự';
        isValid = false;
      }

      if (!this.passwordForm.confirmPassword) {
        this.passwordErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
        isValid = false;
      } else if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        this.passwordErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        isValid = false;
      }

      return isValid;
    },

    async changePassword() {
      if (!this.validatePasswordForm()) {
        return;
      }

      this.isSaving = true;
      this.passwordErrors = {};

      try {
        await changePassword({
          oldPassword: this.passwordForm.currentPassword,
          newPassword: this.passwordForm.newPassword
        });

        this.showToast('Đổi mật khẩu thành công', 'success');
        this.closePasswordModal();
      } catch (error) {
        console.error('Failed to change password:', error);

        // Xử lý lỗi validation 400
        if (error.response?.status === 400 && error.response?.data?.result) {
          const backendErrors = error.response.data.result;

          // Map field name từ backend sang frontend
          // Backend: oldPassword, newPassword
          // Frontend: currentPassword, newPassword
          this.passwordErrors = {
            currentPassword: backendErrors.oldPassword,
            newPassword: backendErrors.newPassword
          };

          this.showToast('Vui lòng kiểm tra lại thông tin', 'error');
        } else {
          const message = error.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại';
          this.showToast(message, 'error');
        }
      } finally {
        this.isSaving = false;
      }
    },

    getRoleBadgeClass(role) {
      const roleMap = {
        'ADMIN': 'badge-admin',
        'USER': 'badge-user',
        'MANAGER': 'badge-manager'
      };
      return roleMap[role] || 'badge-default';
    },

    formatDate(date) {
      if (!date) return 'Chưa có';
      return new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    showToast(message, type = 'success') {
      this.toast = {
        show: true,
        message,
        type
      };

      setTimeout(() => {
        this.toast.show = false;
      }, 3000);
    }
  }
};
</script>

<style scoped>
.profile-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.page-description {
  color: #6c757d;
  margin: 0;
  font-size: 14px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.profile-header-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.profile-header-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.profile-banner {
  height: 80px;
  position: relative;
  overflow: hidden;
}

.banner-gradient {
  width: 100%;
  height: 100%;
  background: #000000;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.profile-header-content {
  padding: 0 32px 32px;
  display: flex;
  align-items: flex-end;
  gap: 24px;
  position: relative;
}

.profile-avatar-container {
  position: relative;
  margin-top: -60px;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 5px solid white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 2;
}

.avatar-letter {
  font-size: 48px;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
}

.avatar-ring {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  background: #000000;
  opacity: 0.2;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.2; }
  50% { transform: scale(1.1); opacity: 0.3; }
}

.online-indicator {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  background: #27ae60;
  border: 3px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(39, 174, 96, 0.4);
  z-index: 3;
  animation: blink 2s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.profile-header-info {
  flex: 1;
  padding-top: 12px;
}

.profile-name {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.profile-email-header {
  font-size: 15px;
  color: #6c757d;
  margin: 0 0 12px 0;
}

.role-badge-large {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.role-badge-large i {
  font-size: 14px;
}

.btn-edit-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: #000000;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  margin-top: 12px;
}

.btn-edit-profile:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  background: #333333;
}

.btn-edit-profile i {
  font-size: 16px;
}

.info-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.info-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.info-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.info-card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.info-card-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000000 !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.info-card-icon i {
  font-size: 22px;
  color: white;
}

.info-card-title {
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.info-card-body {
  padding: 24px;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  border-radius: 10px;
  transition: background 0.3s;
  margin-bottom: 12px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-row:hover {
  background: #f8f9fa;
}

.info-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-icon i {
  font-size: 18px;
  color: #000000;
}

.info-content {
  flex: 1;
}

.info-content label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.info-content p {
  font-size: 15px;
  color: #2c3e50;
  font-weight: 500;
  margin: 0;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.status-active {
  background: #d4edda;
  color: #155724;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #28a745;
  border-radius: 50%;
  animation: blink 2s ease-in-out infinite;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-admin {
  background: #000000;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.badge-user {
  background: #333333;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.badge-manager {
  background: #666666;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.badge-default {
  background: #f5f5f5;
  color: #757575;
}

.security-card {
  grid-column: span 1;
}

.security-feature {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 16px;
  border: 1px solid #e9ecef;
}

.security-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

.security-icon i {
  font-size: 22px;
  color: white;
}

.security-content {
  flex: 1;
}

.security-content h4 {
  font-size: 16px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 4px 0;
}

.security-content p {
  font-size: 13px;
  color: #6c757d;
  margin: 0;
}

.btn-security-action {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: #000000;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

.btn-security-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  background: #333333;
}

.security-tips {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #000000;
}

.security-tip {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #6c757d;
  margin: 0;
}

.security-tip i {
  color: #000000;
  font-size: 16px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-password {
  max-width: 450px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.btn-close {
  width: 32px;
  height: 32px;
  border: none;
  background: #f8f9fa;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  transition: all 0.3s;
}

.btn-close:hover {
  background: #e9ecef;
  color: #2c3e50;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
}

.required {
  color: #e74c3c;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.form-control.is-invalid {
  border-color: #e74c3c;
}

.form-control.is-invalid:focus {
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.error-message {
  display: block;
  margin-top: 6px;
  font-size: 13px;
  color: #e74c3c;
}

.form-hint {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #6c757d;
}

.password-input-wrapper {
  position: relative;
}

.btn-toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: #6c757d;
  cursor: pointer;
  padding: 4px 8px;
  transition: color 0.3s;
}

.btn-toggle-password:hover {
  color: #2c3e50;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
  margin-top: 24px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-cancel {
  background: #f8f9fa;
  color: #6c757d;
}

.btn-cancel:hover {
  background: #e9ecef;
}

.btn-save {
  background: #000000;
  color: white;
}

.btn-save:hover:not(:disabled) {
  background: #333333;
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 10000;
  min-width: 300px;
}

.toast.success {
  border-left: 4px solid #27ae60;
}

.toast.success i {
  color: #27ae60;
}

.toast.error {
  border-left: 4px solid #e74c3c;
}

.toast.error i {
  color: #e74c3c;
}

.toast i {
  font-size: 20px;
}

.toast span {
  font-size: 14px;
  color: #2c3e50;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

@media (max-width: 1024px) {
  .info-cards-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .profile-page {
    padding: 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .profile-header-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 0 20px 24px;
  }

  .profile-avatar-container {
    margin-top: -60px;
  }

  .profile-avatar {
    width: 100px;
    height: 100px;
  }

  .avatar-letter {
    font-size: 40px;
  }

  .profile-name {
    font-size: 24px;
  }

  .btn-edit-profile {
    width: 100%;
    justify-content: center;
  }

  .info-cards-grid {
    grid-template-columns: 1fr;
  }

  .info-card-header {
    padding: 20px;
  }

  .info-card-body {
    padding: 20px;
  }

  .security-feature {
    flex-direction: column;
    text-align: center;
  }

  .btn-security-action {
    width: 100%;
    justify-content: center;
  }

  .modal-container {
    max-width: 100%;
    margin: 0 16px;
  }

  .toast {
    right: 16px;
    left: 16px;
    min-width: auto;
  }
}
</style>
