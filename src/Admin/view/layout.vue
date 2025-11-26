<template>
  <!-- Wrap toàn bộ Admin layout trong div với class admin-scope -->
  <div class="admin-scope" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <!-- Nội dung chính của layout -->
    <div class="left-side">
    </div>
    <sidebar
      :menu-items="sidebarMenu"
      @toggle-sidebar="toggleSidebar"
    />
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
import { ref, onMounted } from 'vue';
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
  setup() {
    const isSidebarCollapsed = ref(false);

    const toggleSidebar = () => {
      isSidebarCollapsed.value = !isSidebarCollapsed.value;
      // Save state to localStorage
      localStorage.setItem('sidebarCollapsed', isSidebarCollapsed.value);
    };

    // Load saved state on mount
    onMounted(() => {
      const savedState = localStorage.getItem('sidebarCollapsed');
      if (savedState !== null) {
        isSidebarCollapsed.value = savedState === 'true';
      }
    });

    return {
      isSidebarCollapsed,
      toggleSidebar
    };
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

<style>
/* Style cho admin-scope wrapper */
.admin-scope {
  display: flex;
  flex-direction: row;
  width: 100%;
  min-height: 100vh;
}

/* Sidebar collapsed state */
.admin-scope.sidebar-collapsed .main-sidebar {
  width: 55px !important;
  overflow: visible !important;
}

.admin-scope.sidebar-collapsed .main-header {
  width: 55px !important;
}


.admin-scope.sidebar-collapsed .sidebar-menu {
  overflow: visible !important;
}

.admin-scope.sidebar-collapsed .sidebar-menu > li > a {
  padding: 12px 5px !important;
  text-align: center;
}

.admin-scope.sidebar-collapsed .sidebar-menu > li > a > span {
  display: none !important;
}

.admin-scope.sidebar-collapsed .sidebar-menu > li > a > i {
  text-align: center;
  width: 100%;
  font-size: 18px;
  margin-right: 0 !important;
}

.admin-scope.sidebar-collapsed .sidebar-menu > li > a > .pull-right-container {
  display: none !important;
}

.admin-scope.sidebar-collapsed .sidebar-menu .treeview-menu {
  display: none !important;
}

/* Hover effect when collapsed - show full menu */
.admin-scope.sidebar-collapsed .sidebar-menu > li {
  position: relative;
}

.admin-scope.sidebar-collapsed .sidebar-menu > li:hover > a {
  background: #1e2229 !important;
}

/* Show text for NON-treeview items only */
.admin-scope.sidebar-collapsed .sidebar-menu > li:not(.treeview):hover > a > span {
  display: block !important;
  position: absolute;
  left: 55px;
  top: 0;
  padding: 12px 20px;
  background: #1e2229;
  width: 200px;
  border-radius: 0 4px 4px 0;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  white-space: normal;
  text-align: left;
}

.admin-scope.sidebar-collapsed .sidebar-menu > li:hover > a > i {
  position: relative;
  z-index: 1001;
}

/* For treeview items - ONLY show submenu, NO parent text */
.admin-scope.sidebar-collapsed .sidebar-menu > li.treeview:hover > a > span {
  display: none !important;
}

.admin-scope.sidebar-collapsed .sidebar-menu > li.treeview:hover .treeview-menu {
  display: block !important;
  position: absolute;
  left: 55px;
  top: 0;
  background: #1e2229;
  width: 200px;
  border-radius: 4px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 999;
  padding: 5px 0;
  border: none !important;
  border-left: none !important;
}

.admin-scope.sidebar-collapsed .sidebar-menu > li.treeview:hover .treeview-menu li {
  list-style: none;
}

.admin-scope.sidebar-collapsed .sidebar-menu > li.treeview:hover .treeview-menu li a {
  display: flex;
  align-items: center;
  padding: 10px 20px 10px 30px !important;
  text-align: left !important;
  color: #b8c7ce;
  text-decoration: none;
  gap: 10px;
  position: relative;
  border: none !important;
  border-left: none !important;
}

.admin-scope.sidebar-collapsed .sidebar-menu > li.treeview:hover .treeview-menu li a:hover {
  background: #1a1d24;
  color: #fff;
}

.admin-scope.sidebar-collapsed .sidebar-menu > li.treeview:hover .treeview-menu li a i {
  flex-shrink: 0;
  width: 16px;
  font-size: 14px;
  text-align: center;
}

.admin-scope.sidebar-collapsed .sidebar-menu > li.treeview:hover .treeview-menu li a span {
  flex: 1;
  white-space: nowrap;
}

/* Active submenu item with circle bullet */
.admin-scope.sidebar-collapsed .sidebar-menu > li.treeview:hover .treeview-menu li.active a::before {
  content: '';
  position: absolute;
  left: 17px;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  background: #475aff;
  border-radius: 50%;
  z-index: 10;
}

/* Active state when collapsed */
.admin-scope.sidebar-collapsed .sidebar-menu > li.active > a {
  background: #1e2229 !important;
  position: relative;
}

.admin-scope.sidebar-collapsed .sidebar-menu > li.active > a::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background: #475aff;
  border-radius: 0 3px 3px 0;
}

.admin-scope.sidebar-collapsed .sidebar-menu > li.active > a > i {
  color: #475aff !important;
}

/* Toggle button base styling */
.admin-scope .toggle-expanded {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 36px !important;
  height: 36px !important;
  padding: 8px !important;
  background: transparent !important;
  border: none !important;
  border-radius: 6px !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  flex-shrink: 0 !important;
}

.admin-scope .toggle-expanded:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}

.admin-scope .toggle-expanded .toggle-icon {
  font-size: 16px !important;
  color: #b8c7ce !important;
}

.admin-scope .toggle-expanded:hover .toggle-icon {
  color: #ffffff !important;
}

/* Toggle button collapsed (full width) */
.admin-scope .toggle-collapsed {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 100% !important;
  height: 56px !important;
  padding: 12px !important;
  background: transparent !important;
  border: none !important;
  border-radius: 6px !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
}

.admin-scope .toggle-collapsed:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}

.admin-scope .toggle-collapsed .toggle-icon {
  font-size: 18px !important;
  color: #b8c7ce !important;
}

.admin-scope .toggle-collapsed:hover .toggle-icon {
  color: #ffffff !important;
}


/* Smooth transitions */
.admin-scope .main-sidebar,
.admin-scope .main-header,
.admin-scope .wrapper,
.admin-scope .content-wrapper {
  transition: all 0.3s ease;
}

/* Ensure header is inside sidebar container */
.admin-scope .main-sidebar {
  display: flex;
  flex-direction: column;
}

.admin-scope .main-header {
  flex-shrink: 0;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 12px 15px !important;
  gap: 8px !important;
}

/* Expanded State - Show logo + small toggle button */
.admin-scope:not(.sidebar-collapsed) .main-header .logo-expanded {
  display: flex !important;
  visibility: visible !important;
}

.admin-scope:not(.sidebar-collapsed) .main-header .toggle-expanded {
  display: flex !important;
  visibility: visible !important;
}

.admin-scope:not(.sidebar-collapsed) .main-header .toggle-collapsed {
  display: none !important;
  visibility: hidden !important;
}

/* Collapsed State - Hide logo and small toggle, show full-width toggle button */
.admin-scope.sidebar-collapsed .main-header .logo-expanded {
  display: none !important;
  visibility: hidden !important;
}

.admin-scope.sidebar-collapsed .main-header .toggle-expanded {
  display: none !important;
  visibility: hidden !important;
}

.admin-scope.sidebar-collapsed .main-header .toggle-collapsed {
  display: flex !important;
  visibility: visible !important;
  width: 100% !important;
  height: 56px !important;
}

.admin-scope.sidebar-collapsed .main-header {
  padding: 0 !important;
  justify-content: center !important;
}

/* Fix submenu icon spacing in all states */
.admin-scope .sidebar-menu .treeview-menu {
  border: none !important;
  border-left: none !important;
}

.admin-scope .sidebar-menu .treeview-menu li a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 50px !important;
  position: relative;
  border: none !important;
  border-left: none !important;
}

.admin-scope .sidebar-menu .treeview-menu li a i {
  flex-shrink: 0;
  width: 16px;
  text-align: center;
}

.admin-scope .sidebar-menu .treeview-menu li a span {
  flex: 1;
}

/* Active submenu item indicator (expanded state) */
.admin-scope .sidebar-menu .treeview-menu li.active > a::before {
  content: '';
  position: absolute;
  left: 17px;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  background: #475aff;
  border-radius: 50%;
  z-index: 10;
}
</style>
