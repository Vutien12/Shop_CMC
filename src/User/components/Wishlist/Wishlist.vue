<template>
  <div class="account-wrapper">
    <Header1 />

    <!-- Loading toàn trang -->
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
            <router-link to="/orders" @mouseenter="prefetch('orders')" @mouseleave="cancel" class="nav-item">
              <i class="fa-solid fa-cart-shopping"></i>
              <span>My Orders</span>
            </router-link>
            <router-link to="/wishlist" @mouseenter="prefetch('/wishlist')" @mouseleave="cancel" class="nav-item">
              <i class="fa-regular fa-heart"></i>
              <span>My Wishlist</span>
            </router-link>
            <router-link to="/addresses" @mouseenter="prefetch('/addresses')" @mouseleave="cancel" class="nav-item">
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
        <!-- Main -->
        <main class="account-main">
          <div class="breadcrumb">
            <router-link to="/">Home</router-link>
            <i class="fa-solid fa-chevron-right"></i>
            <router-link to="/account">My Account</router-link>
            <i class="fa-solid fa-chevron-right"></i>
            <span>My Wishlist</span>
          </div>

          <!-- Lazy Load Wishlist -->
          <div ref="wishlistTarget">
            <section v-if="wishlistVisible" class="wishlist-section">
              <div class="section-header">
                <h2>My Wishlist</h2>
              </div>

              <!-- Skeleton -->
              <div v-if="wishlistLoading" class="skeleton-table">
                <div class="skeleton-row" v-for="n in 5" :key="n">
                  <div class="skeleton-cell img"></div>
                  <div class="skeleton-cell"></div>
                  <div class="skeleton-cell short"></div>
                  <div class="skeleton-cell short"></div>
                  <div class="skeleton-cell action"></div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-if="wishlistItems.length === 0" class="empty-state">
                <i class="fa-regular fa-heart" style="font-size:48px;color:#ff0000;"></i>
                <h3>Your wishlist is empty</h3>
                <p>Add items you love to your wishlist!</p>
                <router-link to="/product" class="btn-browse">Browse Products</router-link>
              </div>

              <!-- Table -->
              <div v-else class="wishlist-table-wrapper">
                <table class="wishlist-table">
                  <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Availability</th>
                    <th>Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item, i) in wishlistItems" :key="item.id" class="fade-in"
                      :style="{ animationDelay: `${i * 0.1}s` }">
                    <td>
                      <div class="product-image">
                        <img :src="item.image" :alt="item.name" />
                      </div>
                    </td>
                    <td><div class="product-name">{{ item.name }}</div></td>
                    <td><div class="product-price">{{ item.price }}</div></td>
                    <td>
                        <span class="availability-badge" :class="item.availabilityClass">
                          {{ item.availability }}
                        </span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button class="action-btn cart-btn" @click="addToCart(item)">
                          <i class="fa-solid fa-cart-shopping"></i>
                        </button>
                        <button class="action-btn remove-btn" @click="removeItem(item.id)">
                          <i class="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>

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

              </div>
            </section>
          </div>
        </main>
      </div>
    </transition>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Header1 from '@/User/components/Header/Header1.vue';
import Footer from '@/User/components/Footer/Footer.vue';
import Loading from '@/User/components/Loading/Loading.vue';
import { useWishlistStore } from '@/User/stores/wishlistStore.js';
import { useAuth } from '@/User/components/useAuth.js';
import { useToast } from '@/User/components/Toast/useToast.js';
import { useLazyLoad } from '@/User/components/LazyLoad/useLazyLoad.js';
import { usePrefetch } from '@/User/stores/usePrefetch.js';
import { removeFromWishlist } from '@/api/accountApi.js';

const router = useRouter();
const { handleLogout: authLogout } = useAuth();
const { add: toast } = useToast();
const wishlistStore = useWishlistStore();
const { prefetch, cancel } = usePrefetch();

// State
const isLoading = ref(true);
const wishlistItems = ref([]);
const totalPages = ref(0);
const currentPage = ref(0);
const wishlistLoading = ref(false);

// Lazy load
const wishlistTarget = ref(null);
const { isVisible: wishlistVisible } = useLazyLoad(async () => {
  if (wishlistItems.value.length) return;
  wishlistLoading.value = true;
  try {
    const data = await wishlistStore.fetchWishlist(0, 2);
    wishlistItems.value = data.items;
    totalPages.value = data.totalPages;
    currentPage.value = 0;
  } catch {
    toast('Không thể tải wishlist.', 'error');
  } finally {
    wishlistLoading.value = false;
  }
}, wishlistTarget);

// Pagination
const changePage = async (page) => {
  if (page < 0 || page >= totalPages.value) return;
  wishlistLoading.value = true;
  try {
    const data = await wishlistStore.fetchWishlist(page, 2, true);
    wishlistItems.value = data.items;
    totalPages.value = data.totalPages;
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch {
    toast('Không thể tải trang.', 'error');
  } finally {
    wishlistLoading.value = false;
  }
};

// Remove
const removeItem = async (wishlistId) => {
  try {
    await removeFromWishlist(wishlistId);
    wishlistStore.removeItemLocally(wishlistId);
    wishlistItems.value = wishlistStore.items;
    toast('Đã xóa khỏi wishlist', 'success');
    window.dispatchEvent(new Event('wishlistChanged'));
  } catch {
    toast('Xóa thất bại', 'error');
  }
};

// Logout
const handleLogout = async () => {
  await authLogout();
  await router.push('/login');
};

// Initial load
onMounted(async () => {
  try {
    const cached = wishlistStore.items.length > 0
    if (cached) {
      wishlistItems.value = wishlistStore.items;
      totalPages.value = wishlistStore.totalPages;
      currentPage.value = wishlistStore.currentPage;
    } else {
      const data = await wishlistStore.fetchWishlist();
      wishlistItems.value = data.items;
      totalPages.value = data.totalPages;
    }
  } catch (error) {
    if (error.response?.status === 401) {
      toast('Phiên đăng nhập hết hạn.', 'error');
      await handleLogout();
    }
  } finally {
    setTimeout(() => { isLoading.value = false; }, 600);
  }
});
</script>

<style src="./Wishlist.css" scoped></style>
<style scoped>
/* Reuse từ /account */
.fade-enter-active, .fade-leave-active { transition: all 0.5s ease; }
.fade-enter-from { opacity: 0; transform: translateY(10px); }

.loading-wrapper { min-height: 60vh; display: flex; align-items: center; justify-content: center; }

/* Skeleton */
.skeleton-table { pointer-events: none; }
.skeleton-row { display: flex; gap: 12px; margin-bottom: 12px; }
.skeleton-cell {
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  flex: 1;
}
.skeleton-cell.short { flex: 0.5; }
.skeleton-cell.action { flex: 0.3; }

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Row animation */
.fade-in {
  animation: fadeInRow 0.5s ease forwards;
  opacity: 0;
  transform: translateY(10px);
}

@keyframes fadeInRow {
  to { opacity: 1; transform: translateY(0); }
}
</style>
