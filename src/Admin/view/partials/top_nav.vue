<template>
  <nav class="navbar navbar-static-top clearfix">
    <div class="navbar-container">
      <!-- Mobile hamburger menu button -->
      <button class="mobile-menu-toggle" @click="$emit('toggle-sidebar')">
        <i class="fa fa-bars"></i>
      </button>

      <ul class="nav navbar-nav clearfix">
        <li class="fullscreen-mode">
          <a class="fullscreen-mode-open" href="#" @click.prevent="toggleFullscreen">
            <svg class="fullscreen-one exit-full-screen" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z"/></svg>
            <svg class="fullscreen-two" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14,14H19V16H16V19H14V14M5,14H10V19H8V16H5V14M8,5H10V10H5V8H8V5M19,8V10H14V5H16V8H19Z"/></svg>
          </a>
        </li>
        <li class="user dropdown top-nav-menu pull-right">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown">
            <span>{{ adminLabel }}</span>
            <div class="dropdown-arrow-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="9" viewBox="0 0 18 9" fill="none">
                <path d="M16.9201 0.949951L10.4001 7.46995C9.63008 8.23995 8.37008 8.23995 7.60008 7.46995L1.08008 0.949951" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </a>

        <ul class="dropdown-menu">
          <li class="profile-details">
            <span class="profile-first-letter">{{ profileFirstLetter }}</span>

            <div class="profile-info">
              <h4>
                <span>{{ adminLabel }}</span>
                <span>{{ userRole }}</span>
              </h4>
              <span class="profile-email">{{ userEmail }}</span>
            </div>
          </li>

          <li>
            <a :href="profileRoute">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Profile
            </a>
          </li>

          <li>
            <a href="#" @click.prevent="logout">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M17.4399 14.62L19.9999 12.06L17.4399 9.5" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9.76001 12.0601H19.93" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M11.76 20C7.34001 20 3.76001 17 3.76001 12C3.76001 7 7.34001 4 11.76 4" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Logout
            </a>
          </li>
        </ul>
      </li>
    </ul>
    </div>
  </nav>

  <form
    v-if="logoutRoute"
    id="logout-form"
    :action="logoutRoute"
    method="POST"
    style="display: none;"
  >
    <input type="hidden" name="_token" :value="csrfToken">
    <input type="hidden" name="_method" value="GET"> </form>
</template>

<script>
export default {
  name: 'Topnav',
  emits: ['toggle-sidebar', 'toggle-fullscreen', 'logout-requested'],
  props: {
    // Label cho bảng điều khiển (vd: 'Admin Panel')
    adminLabel: {
      type: String,
      default: 'Admin Panel'
    },
    // Vai trò của người dùng (vd: 'Admin')
    userRole: {
      type: String,
      default: 'Admin'
    },
    // Email người dùng
    userEmail: {
      type: String,
      default: 'admin@gmail.com'
    },
    // Đường dẫn đến trang profile
    profileRoute: {
      type: String,
      required: true // Yêu cầu phải truyền route
    },
    // Đường dẫn đăng xuất
    logoutRoute: {
      type: String,
      required: true
    },
    // Token CSRF (nếu cần POST/GET form submit)
    csrfToken: {
      type: String,
      default: '' // Chỉ cần nếu dùng form submit
    }
  },
  computed: {
    // Tính toán chữ cái đầu tiên cho biểu tượng hồ sơ
    profileFirstLetter() {
      if (this.adminLabel) {
        return this.adminLabel.charAt(0).toUpperCase();
      }
      return 'A';
    }
  },
  methods: {
    // Phương thức xử lý đăng xuất
    logout() {
      // Tùy chọn 1: Kích hoạt form submit (giống code gốc)
      document.getElementById('logout-form').submit();

      /* Tùy chọn 2 (Hiện đại hơn): Gửi request POST/GET bằng Axios/Fetch

      this.$emit('logout-requested'); // Phát ra sự kiện để component cha xử lý đăng xuất AJAX

      */
    },

    // Phương thức xử lý toàn màn hình (Placeholder)
    toggleFullscreen() {
        // Cần triển khai logic JS để chuyển đổi toàn màn hình (dùng Fullscreen API)
        console.log('Toggle Fullscreen clicked');
        // Thường phát ra một sự kiện để component cha xử lý chức năng này
        this.$emit('toggle-fullscreen');
    }
  }
};
</script>

<style scoped>
/* Navbar container */
.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  gap: 10px;
}

.navbar .nav.navbar-nav {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin: 0;
  padding: 0;
  flex: 1;
}

/* Mobile menu toggle button */
.mobile-menu-toggle {
  display: none;
  background: transparent;
  border: none;
  color: #333;
  font-size: 24px;
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 6px;
  margin: 0;
  flex-shrink: 0;
}

.mobile-menu-toggle:hover {
  color: #475aff;
  background: rgba(71, 90, 255, 0.1);
}

.mobile-menu-toggle:active {
  background: rgba(71, 90, 255, 0.2);
  transform: scale(0.95);
}

/* Desktop: hide hamburger menu */
@media (min-width: 768px) {
  .mobile-menu-toggle {
    display: none !important;
  }
}

/* Mobile: show hamburger menu and adjust layout */
@media (max-width: 767px) {
  .mobile-menu-toggle {
    display: flex !important;
    align-items: center;
    justify-content: center;
  }

  .navbar {
    padding: 0 10px !important;
    position: fixed !important;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10001 !important;
    background: #ffffff;
    border-bottom: 1px solid #d5dce6;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .navbar-container {
    width: 100%;
    justify-content: space-between;
  }

  /* Adjust navbar items spacing on mobile */
  .navbar .nav.navbar-nav {
    flex: 1;
    justify-content: flex-end;
    gap: 5px;
  }

  .navbar .nav.navbar-nav li {
    margin: 0;
  }

  /* Make sure fullscreen and profile icons are visible */
  .navbar .nav.navbar-nav .fullscreen-mode,
  .navbar .nav.navbar-nav .top-nav-menu {
    display: flex !important;
  }

  /* Adjust dropdown positioning on mobile */
  .navbar .dropdown-menu {
    right: 0;
    left: auto;
  }

  /* Hide admin label text on very small screens */
  @media (max-width: 360px) {
    .navbar .top-nav-menu span:first-child {
      display: none;
    }
  }
}
</style>
