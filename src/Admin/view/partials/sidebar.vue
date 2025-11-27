<template>
  <aside class="main-sidebar">
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
            [activeMenu('products')]: true,
            [activeMenu('variations')]: true,
            [activeMenu('options')]: true,
            [activeMenu('brands')]: true,
            [activeMenu('categories')]: true
          }"
        >
          <a href="#" @click.prevent="toggleMenu('products')">
            <i class="fa fa-cube"></i>
            <span>Products</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li :class="activeMenu('products', 'create')">
              <router-link :to="{ name: 'admin.products.create' }">
                <i class="fa fa-angle-double-right"></i>
                <span>Create Product</span>
              </router-link>
            </li>
            <li :class="activeMenu('products')">
              <router-link :to="{ name: 'admin.products.index' }">
                <i class="fa fa-angle-double-right"></i>
                <span>All Products</span>
              </router-link>
            </li>
            <li :class="activeMenu('categories')">
              <router-link :to="{ name: 'admin.categories.index' }">
                <i class="fa fa-angle-double-right"></i>
                <span>Categories</span>
              </router-link>
            </li>
            <li :class="activeMenu('brands')">
              <router-link :to="{ name: 'admin.brands.index' }">
                <i class="fa fa-angle-double-right"></i>
                <span>Brands</span>
              </router-link>
            </li>
            <li :class="activeMenu('variations')">
              <router-link :to="{ name: 'admin.variations.index' }">
                <i class="fa fa-angle-double-right"></i>
                <span>Variations</span>
              </router-link>
            </li>
            <li :class="activeMenu('options')">
              <router-link :to="{ name: 'admin.options.index' }">
                <i class="fa fa-angle-double-right"></i>
                <span>Options</span>
              </router-link>
            </li>
          </ul>
        </li>

        <li class="treeview" :class="activeMenu('orders')">
          <a href="#" @click.prevent="toggleMenu('orders')">
            <i class="fa fa-dollar"></i>
            <span>{{ menuItems.sales }}</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li :class="activeMenu('orders')">
              <router-link :to="{ name: 'admin.orders.index' }">
                <i class="fa fa-angle-double-right"></i>
                <span>Orders</span>
              </router-link>
            </li>
          </ul>
        </li>

        <li class="treeview" :class="activeMenu('users')">
          <a href="#" @click.prevent="toggleMenu('users')">
            <i class="fa fa-users"></i>
            <span>Users</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li :class="activeMenu('users')">
              <a href="#" @click.prevent>
                <i class="fa fa-angle-double-right"></i>
                <span>All Users</span>
              </a>
            </li>
          </ul>
        </li>

        <li class="treeview" :class="activeMenu('media')">
          <router-link :to="{ name: 'admin.media.index' }">
            <i class="fa fa-camera"></i>
            <span>Media</span>
          </router-link>
        </li>
        <li class="treeview" :class="activeMenu('coupons')">
          <router-link :to="{ name: 'admin.coupons.index' }">
            <i class="fa fa-tags"></i>
            <span>Coupons</span>
          </router-link>
        </li>
        <li class="treeview" :class="activeMenu('blogs')">
          <router-link :to="{ name: 'admin.blogs.index' }">
            <i class="fa fa-pencil-square-o"></i>
            <span>Blogs</span>
          </router-link>
        </li>
      </ul>
    </section>
  </aside>
</template>

<script>
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
    }
  },
  setup() {
    const route = useRoute();

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

    const toggleMenu = (menu) => {
      // Toggle submenu visibility (optional)
      console.log('Toggle menu:', menu);
    };

    return {
      activeMenu,
      toggleMenu
    };
  }
};
</script>
<style scoped>
.sidebar-menu .treeview-menu {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
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

</style>
