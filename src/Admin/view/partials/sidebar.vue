<template>
  <aside class="main-sidebar">
    <header class="main-header clearfix">
      <a class="logo" href="#" @click.prevent="$emit('go-to-dashboard')">
        <img :src="asset('build/assets/sidebar-logo-ltr.svg')" alt="sidebar logo" />
      </a>

      <a class="sidebar-logo-mini" href="#" @click.prevent="$emit('go-to-dashboard')">
        <img :src="asset('build/assets/sidebar-logo-mini.svg')" alt="sidebar logo mini" />
      </a>

      <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button" @click.prevent="$emit('toggle-sidebar')">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M15.0001 19.92L8.48009 13.4C7.71009 12.63 7.71009 11.37 8.48009 10.6L15.0001 4.07996"
            stroke="#292D32"
            stroke-width="3"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="150px" height="150px">
          <path
            d="M 3 9 A 1.0001 1.0001 0 1 0 3 11 L 47 11 A 1.0001 1.0001 0 1 0 47 9 L 3 9 z M 3 24 A 1.0001 1.0001 0 1 0 3 26 L 47 26 A 1.0001 1.0001 0 1 0 47 24 L 3 24 z M 3 39 A 1.0001 1.0001 0 1 0 3 41 L 47 41 A 1.0001 1.0001 0 1 0 47 39 L 3 39 z"
          />
        </svg>
      </a>
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
  },
  methods: {
    asset(path) {
      return `${this.baseUrl}${path}`;
    }
  }
};
</script>
<style scoped>
.sidebar-menu .treeview-menu {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

</style>
