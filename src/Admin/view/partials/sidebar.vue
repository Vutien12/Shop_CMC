<template>
  <aside class="main-sidebar" :class="{ 'sidebar-open': isSidebarOpen }">
    <header class="main-header clearfix">
      <!-- Logo khi expanded - click vào logo cũng toggle sidebar -->
      <a class="logo logo-expanded" href="#" @click.prevent="$emit('toggle-sidebar')" title="Click to collapse sidebar">
        <img src="@/assets/sidebar-logo-mini copy.svg" alt="sidebar logo" />
        <span class="shop-name">CMC Shop</span>
      </a>

      <!-- Toggle button khi expanded -->
      <button class="sidebar-toggle toggle-expanded" @click="$emit('toggle-sidebar')" title="Collapse sidebar">
        <i class="fa fa-chevron-left toggle-icon"></i>
      </button>

      <!-- Toggle button khi collapsed (full width, có icon expand) -->
      <button class="sidebar-toggle toggle-collapsed" @click="$emit('toggle-sidebar')" title="Expand sidebar">
        <i class="fa fa-chevron-right toggle-icon"></i>
      </button>
    </header>
    <section class="sidebar">
      <ul class="sidebar-menu">
        <li :class="activeMenu('dashboard')">
          <router-link :to="{ name: 'admin.dashboard' }">
            <i class="fa fa-dashboard"></i>
            <span>Dashboard</span>
          </router-link>
        </li>

        <li
          class="treeview"
          :class="{
            'active': isAnyChildActive(['products', 'variations', 'options', 'brands', 'categories', 'reviews']),
            'menu-open': openMenus.includes('products')
          }"
        >
          <a href="#" @click.prevent="toggleMenu('products')">
            <i class="fa fa-cube"></i>
            <span>Products</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right" :class="{ 'rotate-down': openMenus.includes('products') }"></i>
            </span>
          </a>
          <ul class="treeview-menu" :style="{ display: openMenus.includes('products') ? 'block' : 'none' }">
            <li :class="activeMenu('products', 'create')">
              <router-link :to="{ name: 'admin.products.create' }" @click="closeSidebarOnMobile">
                <i class="fa fa-angle-double-right"></i>
                <span>Create Product</span>
              </router-link>
            </li>
            <li :class="activeMenu('products')">
              <router-link :to="{ name: 'admin.products.index' }" @click="closeSidebarOnMobile">
                <i class="fa fa-angle-double-right"></i>
                <span>All Products</span>
              </router-link>
            </li>
            <li :class="activeMenu('attributes')">
              <router-link :to="{ name: 'admin.attributes.index' }" @click="closeSidebarOnMobile">
                <i class="fa fa-angle-double-right"></i>
                <span>Attributes</span>
              </router-link>
            </li>
            <li :class="activeMenu('attribute-sets')">
              <router-link :to="{ name: 'admin.attribute-sets.index' }" @click="closeSidebarOnMobile">
                <i class="fa fa-angle-double-right"></i>
                <span>Attribute sets</span>
              </router-link>
            </li>
            <li :class="activeMenu('categories')">
              <router-link :to="{ name: 'admin.categories.index' }" @click="closeSidebarOnMobile">
                <i class="fa fa-angle-double-right"></i>
                <span>Categories</span>
              </router-link>
            </li>
            <li :class="activeMenu('brands')">
              <router-link :to="{ name: 'admin.brands.index' }" @click="closeSidebarOnMobile">
                <i class="fa fa-angle-double-right"></i>
                <span>Brands</span>
              </router-link>
            </li>
            <li :class="activeMenu('variations')">
              <router-link :to="{ name: 'admin.variations.index' }" @click="closeSidebarOnMobile">
                <i class="fa fa-angle-double-right"></i>
                <span>Variations</span>
              </router-link>
            </li>
            <li :class="activeMenu('options')">
              <router-link :to="{ name: 'admin.options.index' }" @click="closeSidebarOnMobile">
                <i class="fa fa-angle-double-right"></i>
                <span>Options</span>
              </router-link>
            </li>
            <li :class="activeMenu('reviews')">
              <router-link :to="{ name: 'admin.reviews.index' }" @click="closeSidebarOnMobile">
                <i class="fa fa-angle-double-right"></i>
                <span>Reviews</span>
              </router-link>
            </li>
          </ul>
        </li>

        <li class="treeview" :class="{ 'active': activeMenu('orders'), 'menu-open': openMenus.includes('orders') }">
          <a href="#" @click.prevent="toggleMenu('orders')">
            <i class="fa fa-dollar"></i>
            <span>{{ menuItems.sales }}</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right" :class="{ 'rotate-down': openMenus.includes('orders') }"></i>
            </span>
          </a>
          <ul class="treeview-menu" :style="{ display: openMenus.includes('orders') ? 'block' : 'none' }">
            <li :class="activeMenu('orders')">
              <router-link :to="{ name: 'admin.orders.index' }" @click="closeSidebarOnMobile">
                <i class="fa fa-angle-double-right"></i>
                <span>Orders</span>
              </router-link>
            </li>
            <li :class="activeMenu('cancellations')">
              <router-link :to="{ name: 'admin.cancellations.index' }" @click="closeSidebarOnMobile">
                <i class="fa fa-angle-double-right"></i>
                <span>Refund</span>
              </router-link>
            </li>
          </ul>
        </li>

        <li class="treeview" :class="{ 'active': activeMenu('users'), 'menu-open': openMenus.includes('users') }">
          <a href="#" @click.prevent="toggleMenu('users')">
            <i class="fa fa-users"></i>
            <span>Users</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right" :class="{ 'rotate-down': openMenus.includes('users') }"></i>
            </span>
          </a>
          <ul class="treeview-menu" :style="{ display: openMenus.includes('users') ? 'block' : 'none' }">
            <li :class="activeMenu('users')">
              <router-link :to="{ name: 'admin.users.index' }" @click="closeSidebarOnMobile">
                <i class="fa fa-angle-double-right"></i>
                <span>All Users</span>
              </router-link>
            </li>
          </ul>
        </li>

        <li class="treeview" :class="activeMenu('media')">
          <router-link :to="{ name: 'admin.media.index' }" @click="closeSidebarOnMobile">
            <i class="fa fa-camera"></i>
            <span>Media</span>
          </router-link>
        </li>
        <li class="treeview" :class="activeMenu('coupons')">
          <router-link :to="{ name: 'admin.coupons.index' }" @click="closeSidebarOnMobile">
            <i class="fa fa-tags"></i>
            <span>Coupons</span>
          </router-link>
        </li>
        <li class="treeview" :class="activeMenu('blogs')">
          <router-link :to="{ name: 'admin.blogs.index' }" @click="closeSidebarOnMobile">
            <i class="fa fa-pencil-square-o"></i>
            <span>Blogs</span>
          </router-link>
        </li>
        <li class="treeview" :class="activeMenu('flashsales')">
          <router-link :to="{ name: 'admin.flashsales.index' }" @click="closeSidebarOnMobile">
            <i class="fa fa-bolt"></i>
            <span>Flash Sales</span>
          </router-link>
        </li>
        <li class="treeview" :class="activeMenu('reports')">
          <router-link :to="{ name: 'admin.reports.index' }" @click="closeSidebarOnMobile">
            <i class="fa fa-file-text-o"></i>
            <span>Reports</span>
          </router-link>
        </li>
      </ul>
    </section>
  </aside>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'Sidebar',
  props: {
    menuItems: {
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
    baseUrl: {
      type: String,
      default: '/'
    },
    isSidebarOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggle-sidebar'],
  setup(props, { emit }) {
    const route = useRoute();
    const openMenus = ref([]);

    const activeMenu = (item, subItem = '') => {
      const routeName = route.name || '';

      // Nếu có subItem (như 'create'), check chính xác cả item và subItem
      if (subItem) {
        return routeName.includes(item) && routeName.includes(subItem) ? 'active' : '';
      }

      // Nếu là dashboard, check chính xác
      if (item === 'dashboard') {
        return routeName === 'admin.dashboard' ? 'active' : '';
      }

      // Với item khác (như 'products'), chỉ active khi là index route
      // Không active khi là create/edit để tránh conflict
      const isIndexRoute = routeName === `admin.${item}.index` || routeName === `admin.${item}`;

      return isIndexRoute ? 'active' : '';
    };

    const isAnyChildActive = (items) => {
      const routeName = route.name || '';
      return items.some(item => routeName.includes(item));
    };

    const toggleMenu = (menu) => {
      const index = openMenus.value.indexOf(menu);
      if (index > -1) {
        openMenus.value.splice(index, 1);
      } else {
        openMenus.value.push(menu);
      }
      // Save to localStorage
      localStorage.setItem('openMenus', JSON.stringify(openMenus.value));
    };

    const closeSidebarOnMobile = () => {
      // Close sidebar on mobile when clicking a link
      if (window.innerWidth < 768 && props.isSidebarOpen) {
        emit('toggle-sidebar');
      }
    };

    // Auto-open menu based on current route
    const autoOpenMenu = () => {
      const routeName = route.name || '';

      if (routeName.includes('products') || routeName.includes('variations') ||
          routeName.includes('options') || routeName.includes('brands') ||
          routeName.includes('categories') || routeName.includes('reviews')) {
        if (!openMenus.value.includes('products')) {
          openMenus.value.push('products');
        }
      }

      if (routeName.includes('orders')) {
        if (!openMenus.value.includes('orders')) {
          openMenus.value.push('orders');
        }
      }

      if (routeName.includes('users')) {
        if (!openMenus.value.includes('users')) {
          openMenus.value.push('users');
        }
      }
    };

    // Load saved state on mount
    onMounted(() => {
      const savedMenus = localStorage.getItem('openMenus');
      if (savedMenus) {
        try {
          openMenus.value = JSON.parse(savedMenus);
        } catch (e) {
          console.error('Failed to parse openMenus:', e);
        }
      }

      // Auto-open menu based on current route
      autoOpenMenu();
    });

    // Watch route changes to auto-open relevant menu
    watch(() => route.name, () => {
      autoOpenMenu();
    });

    return {
      activeMenu,
      isAnyChildActive,
      toggleMenu,
      openMenus,
      closeSidebarOnMobile
    };
  }
};
</script>
<style scoped>
/* Treeview menu animations */
.sidebar-menu .treeview-menu {
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  max-height: 0;
  opacity: 0;
}

.sidebar-menu .treeview.menu-open .treeview-menu {
  max-height: 1000px;
  opacity: 1;
}

/* Arrow rotation animation */
.pull-right-container .fa-angle-left {
  transition: transform 0.3s ease-in-out;
}

.pull-right-container .fa-angle-left.rotate-down {
  transform: rotate(-90deg) !important;
}

/* Logo and Shop Name */
.logo-expanded {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  text-decoration: none;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.logo-expanded:hover {
  background: rgba(255, 255, 255, 0.05);
}

.logo-expanded img {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.shop-name {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
}

/* Toggle Button - Expanded State */
.toggle-expanded {
  background: transparent !important;
  border: none !important;
  color: #b8c7ce !important;
  cursor: pointer !important;
  padding: 8px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 6px !important;
  width: 36px !important;
  height: 36px !important;
  min-width: 36px !important;
  max-width: 36px !important;
  flex-shrink: 0 !important;
  margin: 0 !important;
  transition: all 0.3s ease !important;
}

.toggle-expanded:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #ffffff !important;
}

/* Toggle Button - Collapsed State (full width) */
.toggle-collapsed {
  display: none !important;
  background: transparent !important;
  border: none !important;
  color: #b8c7ce !important;
  cursor: pointer !important;
  padding: 12px !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 6px !important;
  width: 100% !important;
  height: 56px !important;
  margin: 0 !important;
  transition: all 0.3s ease !important;
}

.toggle-collapsed:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #ffffff !important;
}

.toggle-icon {
  font-size: 18px !important;
  line-height: 1 !important;
}

/* Main Header Layout */
.main-header {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 8px !important;
  padding: 12px 15px !important;
}

/* Responsive styles for mobile */
@media (max-width: 767px) {
  .main-sidebar {
    position: fixed !important;
    left: -260px !important;
    top: 0 !important;
    width: 250px !important;
    max-width: 250px !important;
    height: 100vh !important;
    z-index: 9999 !important;
    transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
    overflow: hidden !important;
    background: #222530 !important;
    transform: translateZ(0);
  }

  .main-sidebar.sidebar-open {
    left: 0 !important;
  }

  .sidebar {
    height: calc(100vh - 56px) !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    width: 100% !important;
    padding: 10px 0;
  }

  /* Make sure sidebar menu items are clickable on mobile */
  .sidebar-menu {
    width: 100% !important;
  }

  .sidebar-menu li a {
    white-space: normal !important;
  }

  .sidebar-menu .treeview-menu {
    padding-left: 20px !important;
  }

  /* Show the sidebar header (logo) on mobile */
  .main-header {
    display: flex !important;
  }

  /* Prevent any content from showing outside sidebar */
  .main-sidebar * {
    max-width: 100%;
  }
}

/* Tablet and Desktop */
@media (min-width: 768px) {
  .main-sidebar {
    position: relative !important;
  }
}

.toggle-icon {
  font-size: 18px !important;
  line-height: 1 !important;
}

/* Main Header Layout */
.main-header {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 8px !important;
  padding: 12px 15px !important;
}
</style>
