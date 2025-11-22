<template>
  <!-- Wrap toàn bộ Admin layout trong div với class admin-scope -->
  <div class="admin-scope">
    <!-- Nội dung chính của layout -->
    <div class="left-side">
    </div>
    <sidebar :menu-items="sidebarMenu" />
    <div class="wrapper">
      <div class="content-wrapper">
        <!-- Topnav component -->
      <topnav/>
        
        <!-- Main content area -->
        <router-view></router-view>
      </div>
    </div>
    <!-- Footer component -->
    <main-footer
      :version="version"
      @show-keyboard-shortcuts="$emit('show-keyboard-shortcuts')"
    />

    <!-- Delete confirmation modal component -->
    <delete-confirmation-modal
      :message="deleteMessage"
      :resource="resource"
      @confirm="$emit('confirm-delete')"
    />

    <!-- Custom scripts slot -->
    <slot name="scripts"></slot>
  </div>
</template>

<script>
import Footer from './partials/footer.vue';
import Sidebar from './partials/sidebar.vue'; 
import Topnav from './partials/top_nav.vue';

export default {
  name: 'AppLayout',
  components: {
    Footer,
    Sidebar,
    Topnav,
  },
  mounted() {
    // Dynamically import CSS chỉ khi component này được mount (tức là đang ở /admin)
    if (!document.getElementById('admin-css')) {
      const link = document.createElement('link');
      link.id = 'admin-css';
      link.rel = 'stylesheet';
      link.href = new URL('../assets/sass/main.css', import.meta.url).href;
      document.head.appendChild(link);
    }
    
    // Override App.vue styles cho Admin
    document.body.style.maxWidth = 'none';
    document.body.style.margin = '0';
    
    // Override #app inline style
    const app = document.getElementById('app');
    if (app) {
      app.style.display = 'block';
      app.style.width = '100%';
    }
  },
  beforeUnmount() {
    // Remove CSS khi rời khỏi admin
    const adminCss = document.getElementById('admin-css');
    if (adminCss) {
      adminCss.remove();
    }
    
    // Restore lại styles cho User
    document.body.style.maxWidth = '1400px';
    document.body.style.margin = '0 auto';
    
    const app = document.getElementById('app');
    if (app) {
      app.style.display = 'flex';
      app.style.width = '100%';
    }
  },
  props: {
    adminLabel: {
      type: String,
      default: 'Admin Panel'
    },
    userRole: {
      type: String,
      default: 'Admin'
    },
    userEmail: {
      type: String,
      default: 'admin@gmail.com'
    },
    version: {
      type: String,
      default: '1.0.0'
    },
    deleteMessage: {
      type: String,
      default: ''
    },
    resource: {
      type: String,
      default: ''
    },
    sidebarMenu: {
      type: Object,
      default: () => ({
        content: 'Content',
        sales: 'Sales',
        system: 'System',
        localization: 'Localization',
        appearance: 'Appearance',
        tools: 'Tools',
        update: 'Update'
      })
    },
    csrfToken: {
      type: String,
      default: ''
    }
  }
};
</script>

<style scoped>
/* Style cho admin-scope wrapper */
.admin-scope {
  display: flex;
  flex-direction: row;
  width: 100%;
  min-height: 100vh;
}
</style>