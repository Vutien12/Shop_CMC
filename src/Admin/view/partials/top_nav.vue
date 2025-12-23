<template>
  <nav class="navbar navbar-static-top clearfix">
    <div class="navbar-container">
      <!-- Mobile hamburger menu button -->
      <button class="mobile-menu-toggle" @click="$emit('toggle-sidebar')">
        <i class="fa fa-bars"></i>
      </button>

      <ul class="nav navbar-nav clearfix">
        <!-- Storefront button to go to home page -->
        <li class="visit-store hidden-sm hidden-xs">
          <a href="/" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-shop-window" viewBox="0 0 16 16">
              <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.37 2.37 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0M1.5 8.5A.5.5 0 0 1 2 9v6h12V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5m2 .5a.5.5 0 0 1 .5.5V13h8V9.5a.5.5 0 0 1 1 0V13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5a.5.5 0 0 1 .5-.5"></path>
            </svg>
            Storefront
          </a>
        </li>

        <li class="fullscreen-mode">
          <a class="fullscreen-mode-open" href="#" @click.prevent="toggleFullscreen">
            <svg class="fullscreen-one exit-full-screen" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z"/></svg>
            <svg class="fullscreen-two" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14,14H19V16H16V19H14V14M5,14H10V19H8V16H5V14M8,5H10V10H5V8H8V5M19,8V10H14V5H16V8H19Z"/></svg>
          </a>
        </li>
        <li class="user dropdown top-nav-menu pull-right" :class="{ open: isDropdownOpen }">
          <a href="#" class="dropdown-toggle" @click.prevent="toggleDropdown">
            <span class="user-avatar">{{ profileFirstLetter }}</span>
            <div class="dropdown-arrow-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="9" viewBox="0 0 18 9" fill="none">
                <path d="M16.9201 0.949951L10.4001 7.46995C9.63008 8.23995 8.37008 8.23995 7.60008 7.46995L1.08008 0.949951" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </a>

        <ul class="dropdown-menu" v-show="isDropdownOpen">
          <li class="profile-details">
            <span class="profile-first-letter">{{ profileFirstLetter }}</span>

            <div class="profile-info">
              <h4>
                <span>{{ displayName }}</span>
                <span>{{ displayRole }}</span>
              </h4>
              <span class="profile-email">{{ displayEmail }}</span>
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
</template>

<script>
import { logout as logoutApi } from '@/api/authApi'
import { getUserInfoFromToken, isTokenExpired } from '@/Utils/jwtUtils'

export default {
  name: 'Topnav',
  emits: ['toggle-sidebar', 'toggle-fullscreen', 'logout-requested'],
  data() {
    return {
      isDropdownOpen: false,
      isFullscreen: false,
      currentUser: null,
      isLoading: false,
      tokenCheckInterval: null,
      lastToken: null
    }
  },
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
    profileFirstLetter() {
      if (this.currentUser?.firstName) {
        return this.currentUser.firstName.charAt(0).toUpperCase();
      }
      return this.adminLabel.charAt(0).toUpperCase();
    },

    displayName() {
      if (this.currentUser) {
        return `${this.currentUser.firstName} ${this.currentUser.lastName}`.trim();
      }
      return this.adminLabel;
    },

    displayRole() {
      return this.currentUser?.role || this.userRole;
    },

    displayEmail() {
      return this.currentUser?.email || this.userEmail;
    }
  },
  watch: {
    // Watch for token changes by monitoring localStorage
    // This runs periodically to detect token updates or removal
  },
  methods: {
    async loadUserData() {
      this.isLoading = true;
      try {
        // Check if token is expired
        if (isTokenExpired()) {
          console.warn('Token expired, logging out...');
          await this.logout();
          return;
        }

        // Get user info directly from JWT payload
        const userInfo = getUserInfoFromToken();
        console.log('User Info from JWT:', userInfo);

        if (userInfo.isValid) {
          this.currentUser = {
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email,
            role: userInfo.role,
            userId: userInfo.userId
          };

          // Log display values
          this.$nextTick(() => {
            console.log('Display Values:');
            console.log('  - displayName:', this.displayName);
            console.log('  - displayRole:', this.displayRole);
            console.log('  - displayEmail:', this.displayEmail);
          });
        } else {
          console.warn('No valid token found');
          this.currentUser = null;
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
        this.currentUser = null;
      } finally {
        this.isLoading = false;
      }
    },

    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },

    handleClickOutside(event) {
      const dropdown = this.$el.querySelector('.top-nav-menu');
      if (dropdown && !dropdown.contains(event.target)) {
        this.isDropdownOpen = false;
      }
    },

    async logout() {
      try {
        this.isDropdownOpen = false;
        // Clear user data immediately before logout call
        this.currentUser = null;

        // Ensure client-side token and related flags are cleared
        localStorage.removeItem('accessToken');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        this.lastToken = null;

        // Call API to invalidate session (best-effort)
        await logoutApi();

        // Navigate to login after clearing
        if (this.$router) this.$router.push('/login');
      } catch (error) {
        console.error('Logout error:', error);
        // Ensure user data is cleared even if API fails
        this.currentUser = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        this.lastToken = null;
        if (this.$router) this.$router.push('/login');
      }
    },

    toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
          this.isFullscreen = true;
        }).catch(err => {
          console.error('Error attempting to enable fullscreen:', err);
        });
      } else {
        document.exitFullscreen().then(() => {
          this.isFullscreen = false;
        }).catch(err => {
          console.error('Error attempting to exit fullscreen:', err);
        });
      }
    },

    handleFullscreenChange() {
      this.isFullscreen = !!document.fullscreenElement;
    },

    handleStorageChange(event) {
      // Listen for changes to accessToken in localStorage
      if (event.key === 'accessToken') {
        if (!event.newValue) {
          // Token was removed (logout)
          this.currentUser = null;
        } else {
          // Token was updated (login), reload user data
          this.loadUserData();
        }
      }
    },

    checkTokenValidity() {
      // Check if token exists and if it changed
      const currentToken = localStorage.getItem('accessToken');

      // If token was removed
      if (!currentToken && this.lastToken) {
        this.currentUser = null;
        this.lastToken = null;
        return;
      }

      // If token changed (new login)
      if (currentToken && currentToken !== this.lastToken) {
        this.lastToken = currentToken;
        this.loadUserData();
        return;
      }

      // If token exists, verify it's not expired
      if (currentToken && isTokenExpired()) {
        this.currentUser = null;
        this.lastToken = null;
      }
    },

    startTokenMonitoring() {
      // Store initial token
      this.lastToken = localStorage.getItem('accessToken');

      // Check token validity every 5 seconds
      this.tokenCheckInterval = setInterval(() => {
        this.checkTokenValidity();
      }, 5000);
    },

    stopTokenMonitoring() {
      if (this.tokenCheckInterval) {
        clearInterval(this.tokenCheckInterval);
        this.tokenCheckInterval = null;
      }
    }
  },
  mounted() {
    this.loadUserData();
    this.startTokenMonitoring();
    document.addEventListener('click', this.handleClickOutside);
    document.addEventListener('fullscreenchange', this.handleFullscreenChange);
    window.addEventListener('storage', this.handleStorageChange);
  },
  beforeUnmount() {
    this.stopTokenMonitoring();
    document.removeEventListener('click', this.handleClickOutside);
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
    window.removeEventListener('storage', this.handleStorageChange);
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

/* Dropdown menu styles */
.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
  min-width: 200px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  margin-top: 8px;
}

/* Visit store / Storefront button styles */
.visit-store {
  margin-right: auto;
}

.visit-store a {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  color: #333;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.visit-store a:hover {
  background: #f5f5f5;
  border-color: #475aff;
  color: #475aff;
}

.visit-store svg {
  flex-shrink: 0;
}

/* User avatar in top navbar */
.user-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: #475aff;
  color: #fff;
  border-radius: 50%;
  font-weight: 600;
  font-size: 16px;
  flex-shrink: 0;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dropdown.open .dropdown-menu {
  display: block;
}

.dropdown-menu li {
  list-style: none;
  margin: 0;
}

.dropdown-menu li a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  color: #333;
  text-decoration: none;
  transition: background 0.2s;
}

.dropdown-menu li a:hover {
  background: #f5f5f5;
}

.dropdown-menu li a svg {
  flex-shrink: 0;
}

/* Profile details in dropdown */
.profile-details {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  border-bottom: 1px solid #eee;
  background: #f9f9f9;
}

.profile-first-letter {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #475aff;
  color: #fff;
  border-radius: 50%;
  font-weight: 600;
  font-size: 18px;
  flex-shrink: 0;
}

.profile-info {
  flex: 1;
  min-width: 0;
}

.profile-info h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.profile-info h4 span:first-child {
  display: block;
}

.profile-info h4 span:last-child {
  display: block;
  font-size: 12px;
  font-weight: normal;
  color: #666;
  margin-top: 2px;
}

.profile-email {
  display: block;
  font-size: 12px;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
