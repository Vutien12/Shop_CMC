import { getCurrentInstance } from 'vue';

export function useNotification() {
  const instance = getCurrentInstance();
  const notification = instance?.appContext.config.globalProperties.$notification;

  if (!notification) {
    console.warn('Notification plugin not found. Please install it in main.js');
    return {
      success: (title, message) => {
        console.log('Success:', title, message);
        alert(`${title}\n\n${message}`);
      },
      error: (title, message) => {
        console.error('Error:', title, message);
        alert(`${title}\n\n${message}`);
      },
      warning: (title, message) => {
        console.warn('Warning:', title, message);
        alert(`${title}\n\n${message}`);
      },
      info: (title, message) => {
        console.info('Info:', title, message);
        alert(`${title}\n\n${message}`);
      },
      confirm: (title, message) => {
        return Promise.resolve(window.confirm(`${title}\n\n${message}`));
      }
    };
  }

  return {
    success: notification.success,
    error: notification.error,
    warning: notification.warning,
    info: notification.info,
    confirm: (title, message) => {
      // If notification.confirm returns a Promise, use it
      // Otherwise wrap window.confirm in a Promise
      const result = notification.confirm(title, message);
      if (result && typeof result.then === 'function') {
        return result;
      }
      return Promise.resolve(window.confirm(`${title}\n\n${message}`));
    }
  };
}
