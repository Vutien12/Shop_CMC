import { getCurrentInstance } from 'vue';

export function useNotification() {
  const instance = getCurrentInstance();
  const notification = instance?.appContext.config.globalProperties.$notification;

  if (!notification) {
    console.warn('Notification plugin not found. Please install it in main.js');
    return {
      success: (title, message) => console.log('Success:', title, message),
      error: (title, message) => console.error('Error:', title, message),
      warning: (title, message) => console.warn('Warning:', title, message),
      info: (title, message) => console.info('Info:', title, message),
      confirm: (title, message, onConfirm) => {
        if (window.confirm(`${title}\n\n${message}`)) {
          onConfirm();
        }
      }
    };
  }

  return {
    success: notification.success,
    error: notification.error,
    warning: notification.warning,
    info: notification.info,
    confirm: notification.confirm
  };
}
