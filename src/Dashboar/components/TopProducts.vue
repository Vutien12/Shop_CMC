<template>
  <div class="dashboard-panel">
    <div class="grid-header">
      <h5>Top Products</h5>
    </div>

    <div class="product-list">
      <div v-if="products.length === 0" class="empty">No top-selling products yet</div>
      <ul v-else>
        <li v-for="(p, idx) in products" :key="p.productId || p.id || idx" class="product-item">
          <div class="left">
            <div class="thumb">
              <img :src="p.image || p.thumbnail || ''" alt="" v-if="p.image || p.thumbnail" />
            </div>
            <div class="meta">
              <div class="name">{{ p.productName || p.name || p.title || 'Unnamed' }}</div>
              <div class="meta-line">Sold: {{ p.totalQuantity ?? p.sold ?? p.count ?? 0 }}</div>
            </div>
          </div>
          <div class="right">
            <div class="price">{{ p.price ? (new Intl.NumberFormat('vi-VN', { minimumFractionDigits: 0 }).format(Number(p.price)) + ' đ') : '' }}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
defineProps({
  products: { type: Array, default: () => [] }
})
</script>

<style scoped>
.dashboard-panel { background: #fff; border: 1px solid #e8e8e8; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
.grid-header { margin-bottom: 10px; border-bottom: 1px solid #e8e8e8; padding-bottom: 10px }
.grid-header h5 { margin: 0; font-size: 18px; font-weight: 600 }
.product-list ul { list-style: none; padding: 0; margin: 0 }
.product-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #f0f0f0 }
.product-item .left { display: flex; gap: 10px; align-items: center }
.thumb img { width: 48px; height: 48px; object-fit: cover; border-radius: 6px }
.meta .name { font-weight: 600 }
.meta .meta-line { font-size: 12px; color: #666 }
.price { font-weight: 700 }
.empty { text-align: center; color: #888; padding: 12px 0 }
</style>
