<template>
  <div class="modal fade" id="confirmation-modal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4.00073 11.9996L12 4.00037" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M12 11.9996L4.00073 4.00037" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>
          <h4 class="modal-title">{{ admin.delete.confirmation }}</h4>
        </div>
        <div class="modal-body">
          <div class="default-message">
            {{ message || admin.delete.confirmation_message }}
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">
            {{ admin.buttons.cancel }}
          </button>
          <button type="button" class="btn btn-danger" @click="confirm">
            {{ admin.buttons.delete }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeleteConfirmationModal',
  props: {
    message: {
      type: String,
      default: ''
    },
    resource: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      admin: {
        delete: {
          confirmation: 'Confirmation',
          confirmation_message: 'Are you sure you want to delete?'
        },
        buttons: {
          cancel: 'Cancel',
          delete: 'Delete'
        }
      }
    };
  },
  methods: {
    confirm() {
      // Phát sự kiện để component cha xử lý
      this.$emit('confirm');
      // Đóng modal
      $('#confirmation-modal').modal('hide');
    }
  },
  mounted() {
    // Khởi tạo modal Bootstrap
    $('#confirmation-modal').modal({ show: false });
  }
};
</script>

<style scoped>
.modal-dialog {
  max-width: 500px;
  margin: 1.75rem auto;
}
</style>