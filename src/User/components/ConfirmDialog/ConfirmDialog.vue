<template>
  <Teleport to="body">
    <Transition name="confirm-fade">
      <div v-if="isOpen" class="confirm-overlay" @click="handleCancel">
        <div class="confirm-dialog" @click.stop>
          <div class="confirm-header">
            <h3>{{ title }}</h3>
          </div>
          <div class="confirm-body">
            <div class="confirm-icon">
              <i class="fa-solid fa-circle-exclamation"></i>
            </div>
            <p>{{ message }}</p>
          </div>
          <div class="confirm-footer">
            <button class="btn-cancel" @click="handleCancel">
              Cancel
            </button>
            <button class="btn-confirm" @click="handleConfirm">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useConfirm } from './useConfirm.js'

const { isOpen, message, title, handleConfirm, handleCancel } = useConfirm()
</script>

<style scoped>
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  backdrop-filter: blur(4px);
}

.confirm-dialog {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.confirm-header {
  padding: 20px 24px 0;
}

.confirm-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
}

.confirm-body {
  padding: 20px 24px;
  text-align: center;
}

.confirm-icon {
  font-size: 48px;
  color: #ff9800;
  margin-bottom: 16px;
  animation: iconPulse 0.5s ease-out;
}

@keyframes iconPulse {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.confirm-body p {
  margin: 0;
  font-size: 15px;
  line-height: 1.5;
  color: #666;
}

.confirm-footer {
  padding: 16px 24px 20px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.confirm-footer button {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
}

.btn-cancel:hover {
  background: #e0e0e0;
  transform: translateY(-1px);
}

.btn-confirm {
  background: #ff4444;
  color: white;
}

.btn-confirm:hover {
  background: #e63939;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 68, 68, 0.3);
}

.confirm-fade-enter-active,
.confirm-fade-leave-active {
  transition: opacity 0.3s ease;
}

.confirm-fade-enter-from,
.confirm-fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 576px) {
  .confirm-dialog {
    width: 95%;
    max-width: 340px;
  }

  .confirm-header h3 {
    font-size: 18px;
  }

  .confirm-icon {
    font-size: 40px;
  }

  .confirm-body p {
    font-size: 14px;
  }

  .confirm-footer button {
    padding: 9px 20px;
    font-size: 13px;
  }
}
</style>

