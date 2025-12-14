<template>
  <div class="account-wrapper">
    <Header />

    <!-- Transition toàn trang -->
    <transition name="fade" mode="out-in">
      <div v-if="isLoading" class="loading-wrapper">
        <Loading />
      </div>

      <div v-else class="account-page">
        <!-- Sidebar -->
        <aside class="account-sidebar">
          <nav class="sidebar-nav">
            <router-link to="/account" @mouseenter="prefetch('/account')" @mouseleave="cancel" class="nav-item">
              <i class="fa-solid fa-gauge"></i>
              <span>Dashboard</span>
            </router-link>
            <router-link to="/orders" @mouseenter="prefetch('/orders')" @mouseleave="cancel" class="nav-item">
              <i class="fa-solid fa-cart-shopping"></i>
              <span>My Orders</span>
            </router-link>
            <router-link to="/my-cases" @mouseenter="prefetch('/my-cases')" @mouseleave="cancel" class="nav-item">
              <i class="fa-solid fa-rotate-left"></i>
              <span>My Cases</span>
            </router-link>
            <router-link to="/wishlist" @mouseenter="prefetch('/wishlist')" @mouseleave="cancel" class="nav-item">
              <i class="fa-regular fa-heart"></i>
              <span>My Wishlist</span>
            </router-link>
            <router-link to="/addresses" class="nav-item active">
              <i class="fa-regular fa-address-book"></i>
              <span>My Addresses</span>
            </router-link>
            <router-link to="/profile" @mouseenter="prefetch('/profile')" @mouseleave="cancel" class="nav-item">
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

          <!-- Lazy Load Section -->
          <div ref="addressTarget">
            <section v-if="addressVisible" class="address-section">
              <div class="section-header">
                <h2>My Addresses</h2>
                <button class="btn-add-address" @click="goToNewAddress">
                  <i class="fa-solid fa-plus"></i> Add New Address
                </button>
              </div>

              <!-- Skeleton -->
              <div v-if="addressLoading" class="skeleton-grid">
                <div v-for="n in 3" :key="n" class="skeleton-card">
                  <div class="skeleton-line title"></div>
                  <div class="skeleton-line"></div>
                  <div class="skeleton-line"></div>
                  <div class="skeleton-line short"></div>
                  <div class="skeleton-line short"></div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-else-if="!addresses.length" class="empty-state">
                <i class="fa-regular fa-address-book" style="font-size: 48px; color: #ccc;"></i>
                <p>No addresses yet</p>
                <button class="btn-primary" @click="goToNewAddress">Add your first address</button>
              </div>

              <!-- Address Grid -->
              <div v-else class="address-grid">
                <div
                  v-for="(addr, i) in addresses"
                  :key="addr.id"
                  class="address-card fade-in"
                  :style="{ animationDelay: `${i * 0.1}s` }"
                >
                  <div class="address-content">
                    <h4>
                      {{ addr.firstName }} {{ addr.lastName }}
                      <span v-if="addr.isDefault" class="default-badge">Default</span>
                    </h4>
                    <p class="address-text">
                      {{ addr.addressLine }}<br />
                      <span v-if="addr.addressLine2">{{ addr.addressLine2 }}<br /></span>
                      {{ addr.wardName || addr.ward || addr.wardName }}{{ (addr.wardName || addr.ward) ? ', ' : '' }}{{ addr.districtName || addr.district || addr.districtName }}{{ (addr.districtName || addr.district) ? ', ' : '' }}{{ addr.stateOrProvince || addr.city || addr.provinceName || '' }} {{ addr.postalCode || '' }}<br />
                      {{ addr.country }}
                    </p>
                    <div class="address-actions">
                      <button class="action-btn edit-btn" @click="editAddress(addr.id)" title="Edit">
                        <i class="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button class="action-btn delete-btn" @click="handleDelete(addr.id)" title="Delete">
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
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
          </div>
        </main>
      </div>
    </transition>

    <Footer />
    <Chatbot />
    <BottomNavBar />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Header from '@/User/components/Header1/Header.vue';
import Footer from '@/User/components/Footer/Footer.vue';
import Loading from '@/User/components/Loading/Loading.vue';
import { useAddressStore } from '@/User/stores/addressesStore.js';
import { useAuth } from '@/User/components/useAuth.js';
import { useToast } from '@/User/components/Toast/useToast.js';
import { useLazyLoad } from '@/User/components/LazyLoad/useLazyLoad.js';
import { usePrefetch } from '@/User/stores/usePrefetch.js';
import { deleteAddress } from '@/api/accountApi.js';
import Chatbot from '@/User/components/Chatbot/Chatbot.vue'
import BottomNavBar from '@/User/components/BottomNavBar.vue'

const router = useRouter();
const { handleLogout: authLogout } = useAuth();
const { add: toast } = useToast();
const addressStore = useAddressStore();
const { prefetch, cancel } = usePrefetch();

// State
const isLoading = ref(true);
const addresses = ref([]);
const totalPages = ref(0);
const currentPage = ref(0);
const addressLoading = ref(false);

// Lazy load
const addressTarget = ref(null);
const { isVisible: addressVisible } = useLazyLoad(async () => {
  if (addresses.value.length) return;
  addressLoading.value = true;
  try {
    const data = await addressStore.fetchAddresses(0);
    addresses.value = data.addresses;
    totalPages.value = data.totalPages;
    currentPage.value = 0;
  } catch {
    toast('Unable to load addresses.', 'error');
  } finally {
    addressLoading.value = false;
  }
}, addressTarget);

// Pagination
const changePage = async (page) => {
  if (page < 0 || page >= totalPages.value) return;
  addressLoading.value = true;
  try {
    const data = await addressStore.fetchAddresses(page, undefined, true);
    addresses.value = data.addresses;
    totalPages.value = data.totalPages;
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch {
    toast('Unable to load page.', 'error');
  } finally {
    addressLoading.value = false;
  }
};

// Actions
const goToNewAddress = () => router.push('/new-address');
const editAddress = (id) => router.push(`/edit-address/${id}`);

const handleDelete = async (id) => {
  if (!confirm('Are you sure you want to delete this address?')) return;
  try {
    await deleteAddress(id);
    toast('Address deleted successfully!', 'success');
    await addressStore.fetchAddresses(currentPage.value, 6, true);
    addresses.value = addressStore.addresses;
    totalPages.value = addressStore.totalPages;
  } catch {
    toast('Unable to delete address.', 'error');
  }
};

const handleLogout = async () => {
  await authLogout();
  await router.push('/login');
};

// Initial load
onMounted(async () => {
  try {
    const cached = addressStore.addresses.length > 0;
    if (cached) {
      addresses.value = addressStore.addresses;
      totalPages.value = addressStore.totalPages;
      currentPage.value = addressStore.currentPage;
    } else {
      const data = await addressStore.fetchAddresses();
      addresses.value = data.addresses;
      totalPages.value = data.totalPages;
    }
  } catch (error) {
    if (error.response?.status === 401) {
      toast('Session expired.', 'error');
      await handleLogout();
    }
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 600);
  }
});
</script>

<style src="./Address.css" scoped></style>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.5s ease; }
.fade-enter-from { opacity: 0; transform: translateY(10px); }

.loading-wrapper { min-height: 60vh; display: flex; align-items: center; justify-content: center; }

/* Skeleton */
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
.skeleton-card {
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fafafa;
}
.skeleton-line {
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 12px;
}
.skeleton-line.title { height: 20px; }
.skeleton-line.short { width: 60%; }

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}
.empty-state p { margin: 16px 0; font-size: 1.1rem; }
.btn-primary {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.btn-primary:hover { background: #0056b3; }

/* Card animation */
.fade-in {
  opacity: 0;
  animation: fadeInCard 0.5s ease forwards;
}
@keyframes fadeInCard {
  to { opacity: 1; transform: translateY(0); }
}

/* Active nav */
.sidebar-nav .nav-item.active {
  background: #f0f7ff;
  color: #007bff;
  font-weight: 600;
}
</style>
