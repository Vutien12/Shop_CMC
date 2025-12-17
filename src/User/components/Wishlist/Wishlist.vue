<template>
  <div class="account-wrapper">
    <Header />

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
            <router-link to="/wishlist" class="nav-item">
              <i class="fa-regular fa-heart"></i>
              <span>My Wishlist</span>
            </router-link>
            <router-link to="/my-cases" @mouseenter="prefetch('/my-cases')" @mouseleave="cancel" class="nav-item">
              <i class="fa-solid fa-rotate-left"></i>
              <span>My Cases</span>
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
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item, i) in wishlistItems" :key="item.id" class="wishlist-row fade-in"
                      :style="{ animationDelay: `${i * 0.1}s` }">
                    <!-- Image -->
                    <td>
                      <div class="thumbnail">
                        <img :src="item.productImage" :alt="item.productName" />
                      </div>
                    </td>

                    <!-- Product Name -->
                    <td>
                      <div class="product-info">
                        <div class="product-name-main">{{ item.productName }}</div>
                        <div v-if="item.variantDisplay" class="product-variant">{{ item.variantDisplay }}</div>
                        <div v-if="item.status === 'INFO_CHANGED'" class="info-changed-banner">
                          <i class="fa-solid fa-exclamation-circle"></i>
                          <span>This product has changed since you last added it.</span>
                          <button @click="updateItem(item.id)" class="btn-sync-mini">
                            <i class="fa-solid fa-sync-alt"></i> Update
                          </button>
                        </div>
                      </div>
                    </td>

                    <!-- Price -->
                    <td>
                      <div class="price">
                        {{ formatPrice(item.rawPrice, item.currency) }}
                      </div>
                    </td>

                    <!-- Status -->
                    <td>
                      <div class="status-cell">
                        <span class="status-badge" :class="getStatusClass(item.status)">
                          {{ getStatusLabel(item.status) }}
                        </span>
                        <span v-if="item.status === 'OUT_OF_STOCK'" class="status-hint">Out of stock temporarily</span>
                        <span v-if="item.status === 'INACTIVE'" class="status-hint">Hidden</span>
                        <span v-if="item.status === 'DELETED'" class="status-hint">Deleted</span>
                      </div>
                    </td>

                    <!-- Actions -->
                    <td class="action-col">
                      <div class="action-buttons">
                        <button class="action-btn cart-btn"
                          @click="addToCart(item)"
                          :disabled="isCartDisabled(item.status)"
                          :title="getCartTooltip(item.status)"
                        >
                          <i class="fa-solid fa-cart-shopping"></i>
                        </button>
                        <button class="action-btn remove-btn" @click="removeItem(item.id)" title="Remove">
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
                    Page {{ currentPage + 1 }} / {{ totalPages }}
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
import { useWishlistStore } from '@/User/stores/wishlistStore.js';
import { useAuth } from '@/User/components/useAuth.js';
import { useToast } from '@/User/components/Toast/useToast.js';
import { useLazyLoad } from '@/User/components/LazyLoad/useLazyLoad.js';
import { usePrefetch } from '@/User/stores/usePrefetch.js';
import { removeFromWishlist, updateWishlistItem } from '@/api/accountApi.js';
import Chatbot from '@/User/components/Chatbot/Chatbot.vue'
import BottomNavBar from '@/User/components/BottomNavBar.vue'

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
    const data = await wishlistStore.fetchWishlist(0);
    wishlistItems.value = data.items;
    totalPages.value = data.totalPages;
    currentPage.value = 0;
  } catch {
    toast('Unable to load wishlist.', 'error');
  } finally {
    wishlistLoading.value = false;
  }
}, wishlistTarget);

// Pagination
const changePage = async (page) => {
  if (page < 0 || page >= totalPages.value) return;
  wishlistLoading.value = true;
  try {
    const data = await wishlistStore.fetchWishlist(page, undefined, true);
    wishlistItems.value = data.items;
    totalPages.value = data.totalPages;
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch {
    toast('Unable to load page.', 'error');
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
    toast('Removed from wishlist', 'success');
    window.dispatchEvent(new Event('wishlistChanged'));
  } catch {
    toast('Remove failed', 'error');
  }
};

// Update
const updateItem = async (wishlistId) => {
  try {
    const res = await updateWishlistItem(wishlistId);
    const updated = res.data.result;

    const parts = updated.productName.split(' - ');
    const productName = parts[0];
    const variantDisplay = parts.length > 1 ? parts.slice(1).join(' - ') : '';

    const formatted = {
      id: updated.id,
      variantId: updated.variantId,
      productName,
      variantDisplay,
      productSku: updated.productSku,
      productPrice: updated.productPrice,
      currency: updated.currency || 'VND',
      productImage: updated.productImage || '/images/placeholder.jpg',
      status: 'AVAILABLE',
      addedAt: new Date(updated.addedAt).toLocaleDateString('vi-VN'),
      rawPrice: updated.productPrice,
    };

    wishlistStore.updateItemLocally(wishlistId, formatted);
    wishlistItems.value = wishlistStore.items;
    toast('Product information updated!', 'success');
  } catch {
    toast('Update failed', 'error');
  }
};

// Add to Cart
const addToCart = async (item) => {
  // Check if item is available
  if (isCartDisabled(item.status)) {
    toast(getCartTooltip(item.status), 'error');
    return;
  }

  try {
    // Use wishlistStore method to add to cart
    await wishlistStore.addToCart(item);

    toast(`"${item.productName}" added to cart!`, 'success');

    // Optionally remove from wishlist after adding to cart
    // Uncomment the line below if you want to auto-remove from wishlist
    // await removeItem(item.id);
  } catch (error) {
    console.error('❌ Failed to add to cart:', error);

    if (error.response?.status === 401) {
      toast('Please login to add to cart', 'error');
    } else if (error.response?.status === 400) {
      toast('Cannot add this product to cart', 'error');
    } else if (error.message?.includes('OUT_OF_STOCK')) {
      toast('Product is currently out of stock', 'error');
    } else if (error.message?.includes('INACTIVE')) {
      toast('Product is temporarily unavailable', 'error');
    } else if (error.message?.includes('DELETED')) {
      toast('Product is discontinued', 'error');
    } else {
      toast('Failed to add to cart. Please try again.', 'error');
    }
  }
};

// Logout
const handleLogout = async () => {
  await authLogout();
  await router.push('/login');
};

// Helpers
const formatPrice = (price, currency = 'VND') => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency }).format(price);
};

const getStatusLabel = (status) => {
  const map = {
    AVAILABLE: 'Available',
    OUT_OF_STOCK: 'Out of stock',
    INACTIVE: 'Inactive',
    DELETED: 'Discontinued',
    INFO_CHANGED: 'Changed'
  };
  return map[status] || 'Unknown';
};

const getStatusClass = (status) => {
  const map = {
    AVAILABLE: 'available',
    OUT_OF_STOCK: 'out-of-stock',
    INACTIVE: 'inactive',
    DELETED: 'deleted',
    INFO_CHANGED: 'info-changed'
  };
  return map[status] || '';
};

const isCartDisabled = (status) => {
  return ['OUT_OF_STOCK', 'INACTIVE', 'DELETED'].includes(status);
};

const getCartTooltip = (status) => {
  if (status === 'OUT_OF_STOCK') return 'Product is currently out of stock';
  if (status === 'INACTIVE') return 'Product is temporarily unavailable';
  if (status === 'DELETED') return 'Product is discontinued';
  return 'Add to cart';
};

// Initial load
onMounted(async () => {
  try {
    const cached = wishlistStore.items.length > 0;
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
      toast('Session expired.', 'error');
      await handleLogout();
    }
  } finally {
    setTimeout(() => { isLoading.value = false; }, 600);
  }
});
</script>

<style src="./Wishlist.css" scoped></style>
<style scoped>
/* === GIAO DIỆN CHUYÊN NGHIỆP, TRỰC QUAN === */

.wishlist-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
  font-size: 13px;
}

.wishlist-table thead th {
  padding: 12px 10px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  font-size: 12px;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #e0e0e0;
}

.wishlist-row {
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: all 0.2s;
}

.wishlist-row:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.wishlist-row td {
  padding: 14px 10px;
  vertical-align: middle;
}

/* Thumbnail */
.thumbnail {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e0e0e0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.thumbnail:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 4px;
}

/* Product Info */
.product-info {
  display: inline-block;
}

.product-name-main {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 14px;
  line-height: 1.5;
}

.product-variant {
  font-size: 12px;
  color: #7f8c8d;
  line-height: 1.4;
}

.info-changed-banner {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #d97706;
  background: #fffbeb;
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #fde68a;
  margin-top: 6px;
}

.info-changed-banner i {
  font-size: 12px;
}

.btn-sync-mini {
  background: #f59e0b;
  color: white;
  border: none;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 3px;
}

.btn-sync-mini:hover {
  background: #d97706;
}

/* Price */
.price {
  font-weight: 600;
  color: #e74c3c;
  font-size: 14px;
  white-space: nowrap;
  line-height: 1.5;
}

/* SKU */
.sku-wrapper {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 130px;
}

.sku {
  font-family: 'Courier New', monospace;
  background: #f1f3f4;
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 11.5px;
  color: #5f6368;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Status */
.status-cell {
  display: inline-block;
}

.status-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.3px;
  width: fit-content;
  white-space: nowrap;
}

.status-badge.available { background: #d4edda; color: #155724; }
.status-badge.out-of-stock { background: #f8d7da; color: #721c24; }
.status-badge.inactive { background: #ffd8b1; color: #e65100; }
.status-badge.deleted { background: #e2e3e5; color: #6c757d; }
.status-badge.info-changed { background: #fff3cd; color: #856404; }

.status-hint {
  font-size: 11px;
  color: #999;
  font-style: italic;
}

/* Added At */
.added-at {
  font-size: 13px;
  color: #7f8c8d;
  display: flex;
  align-items: center;
  gap: 4px;
}

.added-at i {
  font-size: 12px;
  color: #95a5a6;
}

/* Action */
.action-col {
  text-align: left;
  vertical-align: middle;
  padding-left: 0 !important;
}

.action-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
  padding-left: 0;
}

.action-btn {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  transition: all 0.2s;
  flex-shrink: 0;
}

.cart-btn {
  background: #e3f2fd;
  color: #1976d2;
}

.cart-btn:hover:not(:disabled) {
  background: #1976d2;
  color: white;
}

.remove-btn {
  background: #ffebee;
  color: #c62828;
}

.remove-btn:hover {
  background: #c62828;
  color: white;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 32px;
  font-size: 14px;
}

.page-btn {
  width: 38px;
  height: 38px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  background: #0066ff;
  color: white;
  border-color: #0066ff;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-weight: 500;
  color: #555;
}

/* Responsive - Tablet/iPad */
@media (max-width: 992px) {
  .wishlist-table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .wishlist-table {
    min-width: 800px;
  }

  .thumbnail {
    width: 60px;
    height: 60px;
  }

  .wishlist-row td {
    padding: 12px 8px;
  }

  .product-name-main {
    font-size: 13px;
  }

  .price {
    font-size: 13px;
  }

  .action-btn {
    width: 38px;
    height: 38px;
  }
}

/* Responsive - Mobile */
@media (max-width: 768px) {
  .wishlist-table-wrapper {
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
  }

  .wishlist-table {
    min-width: 700px !important;
  }

  .wishlist-table th {
    font-size: 12px !important;
    padding: 10px 8px !important;
    white-space: nowrap !important;
  }

  .wishlist-row td {
    padding: 12px 8px !important;
    font-size: 13px !important;
  }

  .thumbnail {
    width: 60px !important;
    height: 60px !important;
  }

  .product-name-main {
    font-size: 13px !important;
    line-height: 1.4 !important;
  }

  .product-variant {
    font-size: 11px !important;
  }

  .price {
    font-size: 14px !important;
  }

  .status-badge {
    padding: 5px 12px !important;
    font-size: 11px !important;
  }

  .action-buttons {
    gap: 8px !important;
  }

  .action-btn {
    width: 38px !important;
    height: 38px !important;
    font-size: 14px !important;
  }
}

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
