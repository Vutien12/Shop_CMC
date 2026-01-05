import { ref } from 'vue'

const isOpen = ref(false)
const message = ref('')
const title = ref('')
const confirmCallback = ref(null)
const cancelCallback = ref(null)

export function useConfirm() {
  const confirm = (msg, options = {}) => {
    return new Promise((resolve) => {
      message.value = msg
      title.value = options.title || 'Confirm'
      isOpen.value = true

      confirmCallback.value = () => {
        isOpen.value = false
        resolve(true)
      }

      cancelCallback.value = () => {
        isOpen.value = false
        resolve(false)
      }
    })
  }

  const handleConfirm = () => {
    if (confirmCallback.value) {
      confirmCallback.value()
    }
  }

  const handleCancel = () => {
    if (cancelCallback.value) {
      cancelCallback.value()
    }
  }

  return {
    isOpen,
    message,
    title,
    confirm,
    handleConfirm,
    handleCancel
  }
}

