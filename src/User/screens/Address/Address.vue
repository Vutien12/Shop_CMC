<template>
  <div class="account-wrapper">
    <Header1 />
    <Loading v-if="isLoading" />

    <div v-else class="account-page">
      <!-- Sidebar -->
      <aside class="account-sidebar">
        <nav class="sidebar-nav">
          <router-link to="/account" class="nav-item">
            <i class="fa-solid fa-gauge"></i>
            <span>Dashboard</span>
          </router-link>
          <router-link to="/orders" class="nav-item">
            <i class="fa-solid fa-cart-shopping"></i>
            <span>My Orders</span>
          </router-link>
          <router-link to="/wishlist" class="nav-item">
            <i class="fa-regular fa-heart"></i>
            <span>My Wishlist</span>
          </router-link>
          <router-link to="/addresses" class="nav-item router-link-active">
            <i class="fa-regular fa-address-book"></i>
            <span>My Addresses</span>
          </router-link>
          <router-link to="/profile" class="nav-item">
            <i class="fa-regular fa-user"></i>
            <span>My Profile</span>
          </router-link>
          <a href="#" class="nav-item" @click.prevent="handleLogout">
            <i class="fa-solid fa-right-from-bracket"></i>
            <span>Logout</span>
          </a>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="account-main">
        <div class="breadcrumb">
          <router-link to="/">Home</router-link>
          <i class="fa-solid fa-chevron-right"></i>
          <router-link to="/account">My Account</router-link>
          <i class="fa-solid fa-chevron-right"></i>
          <span>My Addresses</span>
        </div>

        <section class="address-section">
          <h2>My Addresses</h2>

          <button class="btn-add-address" @click="goToNewAddress">
            <i class="fa-solid fa-plus"></i>
            Add New Address
          </button>

          <div class="address-list">
            <!-- Address Cards -->
            <div v-if="addresses.length > 0" class="address-grid">
              <div v-for="address in addresses" :key="address.id" class="address-card">
                <div class="address-content">
                  <h4>
                    {{ address.firstName }} {{ address.lastName }}
                    <span v-if="address.isDefault" class="default-badge">Default</span>
                  </h4>
                  <p class="address-text">
                    {{ address.addressLine }}<br />
                    <span v-if="address.addressLine2">{{ address.addressLine2 }}<br /></span>
                    {{ address.city }}, {{ address.stateOrProvince }} {{ address.postalCode }}<br />
                    {{ address.country }}
                  </p>
                  <div class="address-actions">
                    <button class="action-btn edit-btn" @click="editAddress(address.id)" title="Edit">
                      <i class="fa-solid fa-pen-to-square"></i>
                      <span>Edit</span>
                    </button>
                    <button class="action-btn delete-btn" @click="handleDelete(address.id)" title="Delete">
                      <i class="fa-solid fa-trash"></i>
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="empty-state">
              <i class="fa-regular fa-address-book"></i>
              <h3>No addresses found</h3>
              <p>Add your first address to get started</p>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="pagination">
            <button @click="changePage(currentPage - 1)" :disabled="currentPage === 0" class="page-btn prev">
              <i class="fa-solid fa-chevron-left"></i>
            </button>

            <span class="page-info">
              Page {{ currentPage + 1 }} of {{ totalPages }}
            </span>

            <button @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages - 1" class="page-btn next">
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </section>
      </main>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Header1 from '@/User/components/Header/Header1.vue';
import Footer from '@/User/components/Footer/Footer.vue';
import Loading from '@/User/components/Loading/Loading.vue';
import { getAddresses, deleteAddress } from '@/api/accountApi.js';

defineOptions({ name: 'UserAddress' });

const router = useRouter();
const isLoading = ref(true);
const addresses = ref([]);
const currentPage = ref(0);
const totalPages = ref(0);
const pageSize = 6;

// Load addresses
const loadAddresses = async (page = 0) => {
  isLoading.value = true;
  try {
    const res = await getAddresses(page, pageSize);
    if (res.data.code === 200) {
      addresses.value = res.data.result.content;
      totalPages.value = res.data.result.totalPages;
      currentPage.value = res.data.result.number;
    } else {
      addresses.value = [];
      totalPages.value = 0;
    }
  } catch (err) {
    console.error('Load addresses failed:', err);
    addresses.value = [];
    totalPages.value = 0;
    alert('Failed to load addresses. Please try again later.');
  } finally {
    isLoading.value = false;
  }
};

// Change page
const changePage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    loadAddresses(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// Delete address
const handleDelete = async (id) => {
  if (!confirm('Are you sure you want to delete this address?')) return;

  try {
    await deleteAddress(id);
    // Reload current page
    loadAddresses(currentPage.value);
  } catch (err) {
    console.error('Delete failed:', err);
    alert('Cannot delete this address. Please try again.');
  }
};

// Navigation
const goToNewAddress = () => router.push('/new-address');
const editAddress = (id) => router.push(`/edit-address/${id}`);

const handleLogout = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userEmail');
  window.dispatchEvent(new Event('loginStatusChanged'));
  router.push('/login');
};

onMounted(() => {
  loadAddresses(0);
});
</script>

<style src="./Address.css" scoped></style>

<style scoped>
/* Default Badge */
.default-badge {
  display: inline-block;
  background-color: #0066FF;
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
  margin-left: 8px;
  vertical-align: middle;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-top: 40px;
  padding: 20px 0;
}

.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid #e0e0e0;
  background-color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  color: #666;
}

.page-btn:hover:not(:disabled) {
  background-color: #0066FF;
  color: white;
  border-color: #0066FF;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f5f5f5;
}

.page-info {
  font-size: 14px;
  color: #555;
  font-weight: 500;
}
</style>
