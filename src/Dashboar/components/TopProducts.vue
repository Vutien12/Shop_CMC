<template>
  <div class="dashboard-panel">
    <div class="panel-header">
      <h5 class="panel-title">Top Products</h5>
      <span class="panel-subtitle">Best selling items</span>
    </div>

    <div class="product-list">
      <div v-if="products.length === 0" class="empty-state">
        <div class="empty-icon">📦</div>
        <div class="empty-title">No Products Yet</div>
        <div class="empty-text">Top selling products will appear here</div>
      </div>

      <div v-else class="products-table">
        <div class="table-row table-header">
          <div class="col-rank">#</div>
          <div class="col-product">Product</div>
          <div class="col-qty">Sold</div>
        </div>

        <div
          v-for="(product, index) in products"
          :key="product.productId || index"
          class="table-row"
        >
          <div class="col-rank">
            <span class="rank-number" :class="getRankClass(index)">{{ index + 1 }}</span>
          </div>

          <div class="col-product">
            <div class="product-name" :title="product.productName">
              {{ product.productName }}
            </div>
          </div>

          <div class="col-qty">
            <span class="qty-badge">{{ product.totalQuantity }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  products: { type: Array, default: () => [] }
});

const getRankClass = (index) => {
  if (index === 0) return 'rank-first';
  if (index === 1) return 'rank-second';
  if (index === 2) return 'rank-third';
  return '';
};
</script>

<style scoped>
.dashboard-panel {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.panel-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e5e7eb;
}

.panel-title {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.panel-subtitle {
  font-size: 13px;
  color: #6b7280;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.empty-text {
  font-size: 14px;
  color: #6b7280;
}

/* Products Table */
.products-table {
  display: flex;
  flex-direction: column;
}

.table-row {
  display: grid;
  grid-template-columns: 50px 1fr 80px;
  gap: 12px;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.table-row:last-child {
  border-bottom: none;
}

.table-header {
  background: #f9fafb;
  border-radius: 6px;
  padding: 10px 12px;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: none;
}

/* Columns */
.col-rank {
  text-align: center;
}

.col-product {
  min-width: 0;
}

.col-qty {
  text-align: right;
}

/* Rank Number */
.rank-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  background: #f3f4f6;
  color: #6b7280;
}

.rank-number.rank-first {
  background: #fef3c7;
  color: #92400e;
}

.rank-number.rank-second {
  background: #e5e7eb;
  color: #374151;
}

.rank-number.rank-third {
  background: #fed7aa;
  color: #9a3412;
}

/* Product Name */
.product-name {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
}

/* Quantity Badge */
.qty-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  background: #eff6ff;
  color: #1e40af;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .table-row {
    grid-template-columns: 40px 1fr 70px;
    gap: 8px;
    padding: 10px 0;
  }

  .rank-number {
    width: 24px;
    height: 24px;
    font-size: 12px;
  }

  .product-name {
    font-size: 13px;
  }

  .qty-badge {
    padding: 3px 10px;
    font-size: 12px;
  }
}
</style>
