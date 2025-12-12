<template>
  <!-- Toast Notifications -->
  <Teleport to="body">
    <div class="notification-container">
      <transition-group name="notification">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="['notification', `notification-${notification.type}`]"
        >
          <div class="notification-icon">
            <i v-if="notification.type === 'success'" class="fa fa-check-circle"></i>
            <i v-else-if="notification.type === 'error'" class="fa fa-times-circle"></i>
            <i v-else-if="notification.type === 'warning'" class="fa fa-exclamation-triangle"></i>
            <i v-else class="fa fa-info-circle"></i>
          </div>
          <div class="notification-content">
            <div class="notification-title">{{ notification.title }}</div>
            <div v-if="notification.message" class="notification-message">{{ notification.message }}</div>
          </div>
          <button class="notification-close" @click="removeNotification(notification.id)">
            <i class="fa fa-times"></i>
          </button>
        </div>
      </transition-group>
    </div>

    <!-- Confirm Dialog -->
    <transition name="modal">
      <div v-if="confirmDialog.show" class="modal-overlay" @click="cancelConfirm">
        <div class="modal-dialog confirm-dialog" @click.stop>
          <div class="modal-icon-wrapper">
            <div class="modal-icon">
              <i class="fa fa-exclamation-circle"></i>
            </div>
          </div>
          <div class="modal-header">
            <h3 class="modal-title">{{ confirmDialog.title }}</h3>
          </div>
          <div class="modal-body">
            <p>{{ confirmDialog.message }}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-cancel" @click="cancelConfirm">
              <i class="fa fa-times"></i>
              Cancel
            </button>
            <button class="btn btn-confirm" @click="confirmAction">
              <i class="fa fa-check"></i>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { reactive } from 'vue';

const notifications = reactive([]);
const confirmDialog = reactive({
  show: false,
  title: '',
  message: '',
  onConfirm: null,
  onCancel: null
});

let notificationId = 0;

// Show notification
const showNotification = (type, title, message = '', duration = 3000) => {
  const id = ++notificationId;
  const notification = {
    id,
    type,
    title,
    message
  };

  notifications.push(notification);

  if (duration > 0) {
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }

  return id;
};

// Remove notification
const removeNotification = (id) => {
  const index = notifications.findIndex(n => n.id === id);
  if (index > -1) {
    notifications.splice(index, 1);
  }
};

// Success notification
const success = (title, message = '') => {
  return showNotification('success', title, message);
};

// Error notification
const error = (title, message = '') => {
  return showNotification('error', title, message, 4000);
};

// Warning notification
const warning = (title, message = '') => {
  return showNotification('warning', title, message);
};

// Info notification
const info = (title, message = '') => {
  return showNotification('info', title, message);
};

// Confirm dialog
const confirm = (title, message) => {
  return new Promise((resolve, reject) => {
    confirmDialog.show = true;
    confirmDialog.title = title;
    confirmDialog.message = message;
    confirmDialog.onConfirm = () => {
      confirmDialog.show = false;
      resolve(true);
    };
    confirmDialog.onCancel = () => {
      confirmDialog.show = false;
      reject(false);
    };
  });
};

// Confirm action
const confirmAction = () => {
  if (confirmDialog.onConfirm) {
    confirmDialog.onConfirm();
  }
};

// Cancel confirm
const cancelConfirm = () => {
  if (confirmDialog.onCancel) {
    confirmDialog.onCancel();
  }
};

// Expose methods
defineExpose({
  success,
  error,
  warning,
  info,
  confirm
});
</script>

<style scoped>
/* Notification Container */
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
}

/* Notification */
.notification {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-left: 4px solid;
  min-width: 320px;
  animation: slideIn 0.3s ease-out;
}

.notification-success {
  border-left-color: #10b981;
}

.notification-error {
  border-left-color: #ef4444;
}

.notification-warning {
  border-left-color: #f59e0b;
}

.notification-info {
  border-left-color: #3b82f6;
}

/* Notification Icon */
.notification-icon {
  font-size: 24px;
  flex-shrink: 0;
  margin-top: 2px;
}

.notification-success .notification-icon {
  color: #10b981;
}

.notification-error .notification-icon {
  color: #ef4444;
}

.notification-warning .notification-icon {
  color: #f59e0b;
}

.notification-info .notification-icon {
  color: #3b82f6;
}

/* Notification Content */
.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.notification-message {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
}

/* Close Button */
.notification-close {
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 16px;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: color 0.2s;
}

.notification-close:hover {
  color: #4b5563;
}

/* Notification Animations */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

/* Confirm Dialog */
.confirm-dialog {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 440px;
  width: 100%;
  overflow: hidden;
  position: relative;
}

/* Modal Icon */
.modal-icon-wrapper {
  display: flex;
  justify-content: center;
  padding: 32px 24px 16px;
}

.modal-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(251, 191, 36, 0.3);
}

.modal-icon i {
  font-size: 32px;
  color: #f59e0b;
}

.modal-header {
  padding: 8px 32px 16px;
  text-align: center;
}

.modal-title {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1.3;
}

.modal-body {
  padding: 0 32px 32px;
  text-align: center;
}

.modal-body p {
  margin: 0;
  color: #6b7280;
  font-size: 15px;
  line-height: 1.6;
}

.modal-footer {
  padding: 20px 24px;
  background: #f9fafb;
  display: flex;
  justify-content: center;
  gap: 12px;
}

.btn {
  padding: 11px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
  justify-content: center;
}

.btn i {
  font-size: 14px;
}

.btn-cancel {
  background: #fff;
  color: #6b7280;
  border: 2px solid #e5e7eb;
}

.btn-cancel:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #374151;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.btn-confirm {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: #fff;
  box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.3);
}

.btn-confirm:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 10px -1px rgba(239, 68, 68, 0.4);
}

/* Modal Animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .confirm-dialog,
.modal-leave-active .confirm-dialog {
  transition: transform 0.3s ease;
}

.modal-enter-from .confirm-dialog,
.modal-leave-to .confirm-dialog {
  transform: scale(0.9);
}

/* Responsive */
@media (max-width: 768px) {
  .notification-container {
    left: 10px;
    right: 10px;
    top: 10px;
    max-width: none;
  }

  .notification {
    min-width: auto;
  }

  .confirm-dialog {
    width: 95%;
  }

  .modal-header,
  .modal-body {
    padding: 16px 20px;
  }

  .modal-footer {
    padding: 12px 20px;
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
  }
}
</style>
