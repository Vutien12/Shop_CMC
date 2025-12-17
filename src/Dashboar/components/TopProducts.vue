<template>
  <div class="dashboard-panel">
    <div class="grid-header">
      <div class="header-content">
        <div class="header-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <h5>Top Products</h5>
      </div>
      <span class="subtitle">Best selling items this period</span>
    </div>

    <div class="product-list">
      <div v-if="products.length === 0" class="empty-state">
        <div class="empty-icon">📦</div>
        <div class="empty-title">No Products Yet</div>
        <div class="empty-text">Top selling products will appear here</div>
      </div>
      <ul v-else>
        <li v-for="(p, idx) in products" :key="p.productId || p.id || idx" class="product-item">
          <div class="rank-badge" :class="getRankClass(idx)">
            <span class="rank-number">{{ idx + 1 }}</span>
            <svg v-if="idx < 3" class="crown-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15 8.5L21 9L16 14L18 21L12 17L6 21L8 14L3 9L9 8.5L12 2Z"/>
            </svg>
          </div>
          
          <div class="product-content">
            <div class="product-left">
              <div class="thumb-wrapper">
                <div class="thumb">
                  <img :src="p.image || p.thumbnail || 'https://via.placeholder.com/80'" :alt="p.productName || 'Product'" />
                  <div class="thumb-overlay"></div>
                </div>
                <div v-if="idx < 3" class="trending-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
                </div>
              </div>
              
              <div class="product-meta">
                <div class="product-name">{{ p.productName || p.name || p.title || 'Unnamed Product' }}</div>
                <div class="product-stats">
                  <span class="stat-item sold">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M9 11l3 3L22 4"/>
                      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                    </svg>
                    {{ p.totalQuantity ?? p.sold ?? p.count ?? 0 }} sold
                  </span>
                </div>
              </div>
            </div>
            
            <div class="product-right">
              <div class="price-tag">{{ formatPrice(p.price) }}</div>
              <div class="revenue-badge">
                Revenue: {{ formatPrice((p.price || 0) * (p.totalQuantity ?? p.sold ?? 0)) }}
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
defineProps({
  products: { type: Array, default: () => [] }
});

const getRankClass = (index) => {
  if (index === 0) return 'rank-gold';
  if (index === 1) return 'rank-silver';
  if (index === 2) return 'rank-bronze';
  return 'rank-default';
};

const formatPrice = (price) => {
  if (!price) return '—';
  return new Intl.NumberFormat('vi-VN', { minimumFractionDigits: 0 }).format(Number(price)) + ' đ';
};
</script>

<style scoped>
/* Dashboard Panel */
.dashboard-panel {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  border: 1px solid #e5e7ff;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.08);
  transition: all 0.3s ease;
}

.dashboard-panel:hover {
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.12);
  transform: translateY(-2px);
}

/* Header */
.grid-header {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid transparent;
  background: linear-gradient(to right, #667eea, #764ba2) bottom / 100% 2px no-repeat;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}

.header-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.header-icon svg {
  width: 22px;
  height: 22px;
  color: white;
}

.grid-header h5 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
  margin-left: 52px;
  display: block;
}

/* Product List */
.product-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Product Item */
.product-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 14px;
  border: 2px solid #f1f5f9;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.product-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-item:hover {
  border-color: #667eea;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
  transform: translateX(4px);
}

.product-item:hover::before {
  opacity: 1;
}

/* Rank Badge */
.rank-badge {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 16px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.product-item:hover .rank-badge {
  transform: scale(1.1) rotate(5deg);
}

.rank-number {
  position: relative;
  z-index: 2;
}

.crown-icon {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  animation: float 2s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(-15deg); }
  50% { transform: translateY(-4px) rotate(-15deg); }
}

.rank-gold {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #b8860b;
  box-shadow: 0 4px 20px rgba(255, 215, 0, 0.4);
}

.rank-silver {
  background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%);
  color: #696969;
  box-shadow: 0 4px 20px rgba(192, 192, 192, 0.4);
}

.rank-bronze {
  background: linear-gradient(135deg, #cd7f32 0%, #e6a055 100%);
  color: #8b4513;
  box-shadow: 0 4px 20px rgba(205, 127, 50, 0.4);
}

.rank-default {
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  color: #475569;
}

/* Product Content */
.product-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  gap: 16px;
  position: relative;
  z-index: 1;
}

.product-left {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  min-width: 0;
}

/* Thumbnail */
.thumb-wrapper {
  position: relative;
  flex-shrink: 0;
}

.thumb {
  position: relative;
  width: 72px;
  height: 72px;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.product-item:hover .thumb {
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.25);
  transform: scale(1.05);
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-item:hover .thumb img {
  transform: scale(1.1);
}

.thumb-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-item:hover .thumb-overlay {
  opacity: 1;
}

.trending-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px rgba(245, 87, 108, 0.4);
  animation: pulse 2s ease-in-out infinite;
  z-index: 2;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 3px 10px rgba(245, 87, 108, 0.4);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 4px 15px rgba(245, 87, 108, 0.6);
  }
}

.trending-badge svg {
  width: 14px;
  height: 14px;
  color: white;
}

/* Product Meta */
.product-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  flex: 1;
}

.product-name {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: color 0.3s ease;
}

.product-item:hover .product-name {
  color: #667eea;
}

.product-stats {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.stat-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.stat-item svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.stat-item.sold {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
}

.product-item:hover .stat-item.sold {
  background: linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 100%);
  transform: scale(1.05);
}

/* Product Right */
.product-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;
}

.price-tag {
  font-size: 18px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  white-space: nowrap;
}

.revenue-badge {
  padding: 5px 12px;
  border-radius: 8px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(252, 211, 77, 0.3);
  transition: all 0.3s ease;
}

.product-item:hover .revenue-badge {
  background: linear-gradient(135deg, #fde68a 0%, #fcd34d 100%);
  transform: scale(1.05);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.6;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.empty-title {
  font-size: 18px;
  font-weight: 700;
  color: #334155;
  margin-bottom: 8px;
}

.empty-text {
  font-size: 14px;
  color: #64748b;
  max-width: 280px;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-panel {
    padding: 16px;
  }

  .product-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .product-content {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
  }

  .product-right {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .rank-badge {
    position: absolute;
    top: 12px;
    right: 12px;
  }
}

@media (max-width: 480px) {
  .thumb {
    width: 64px;
    height: 64px;
  }

  .product-name {
    font-size: 14px;
  }

  .price-tag {
    font-size: 16px;
  }

  .subtitle {
    margin-left: 0;
    margin-top: 8px;
  }
}
</style>
