<template>
    <div class="dashboard-panel latest-order">
        <div class="grid-header">
            <h5>Latest Orders</h5>
        </div>

        <div class="clearfix"></div>

        <div class="table-responsive anchor-table">
            <table class="table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Status</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="orders.length === 0">
                        <td class="empty" colspan="4">
                            <div class="empty-inner">
                                <div class="empty-icon">🗒️</div>
                                <div>
                                    <div class="empty-title">No orders yet</div>
                                    <div class="empty-sub">There are no recent orders to display.</div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-for="order in orders" :key="order.id">
                        <td>
                            <button class="link-like" @click.prevent="viewOrder(order.id)">
                                {{ order.id }}
                            </button>
                        </td>
                        <td>
                            <button class="link-like" @click.prevent="viewOrder(order.id)">
                                {{ order.customer ?? order.customerName ?? order.customerFullName ?? '—' }}
                            </button>
                        </td>
                        <td>
                            <span :class="['status-pill', getStatusClass(order.status)]">
                                {{ humanizeStatus(order.status) }}
                            </span>
                        </td>
                        <td>
                            <button class="link-like" @click.prevent="viewOrder(order.id)">
                                {{ formatCurrency(order.total) }}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
defineProps({
    orders: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['view-order']);

const viewOrder = (orderId) => {
    emit('view-order', orderId);
};

const getStatusClass = (status) => {
    if (!status) return 'status-unknown';
    const s = String(status).toLowerCase();
    switch (s) {
        case 'pending': return 'status-pending';
        case 'pending_payment': return 'status-pending-payment';
        case 'paid': return 'status-paid';
        case 'processing': return 'status-processing';
        case 'shipped': return 'status-shipped';
        case 'delivered': return 'status-delivered';
        case 'completed': return 'status-completed';
        case 'cancelled': return 'status-cancelled';
        case 'refunded': return 'status-refunded';
        default: return 'status-unknown';
    }
};

const humanizeStatus = (status) => {
    if (!status) return 'Unknown';
    const map = {
        PENDING: 'Pending',
        PENDING_PAYMENT: 'Pending Payment',
        PAID: 'Paid',
        PROCESSING: 'Processing',
        SHIPPED: 'Shipped',
        DELIVERED: 'Delivered',
        COMPLETED: 'Completed',
        CANCELLED: 'Cancelled',
        REFUNDED: 'Refunded'
    };
    return map[String(status).toUpperCase()] || String(status);
};

const formatCurrency = (value) => {
    const amount = Number(value ?? 0);
    // Format with thousands separator and the VND symbol (adjust if needed)
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
};
</script>

<style scoped>
.dashboard-panel {
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
}

.grid-header {
    margin-bottom: 20px;
    border-bottom: 1px solid #e8e8e8;
    padding-bottom: 15px;
}

.grid-header h5 { margin: 0; font-size: 18px; font-weight: 600; color: #333; }

.table-responsive { overflow-x: auto; }
.table { width: 100%; margin-bottom: 0; }
.table thead th { background: #f8f9fa; color: #333; font-weight: 600; font-size: 14px; padding: 12px 15px; border-bottom: 2px solid #e8e8e8; }
.table tbody td { padding: 12px 15px; border-bottom: 1px solid #e8e8e8; vertical-align: middle; }
.table tbody tr:hover { background: #f8f9fa; }

.link-like { background: none; border: none; color: inherit; padding: 0; cursor: pointer; font: inherit; }
.link-like:focus { outline: 2px solid rgba(0,123,255,0.25); }

.empty { text-align: center; color: #888; padding: 30px !important; }
.empty-inner { display:flex; align-items:center; gap:12px; justify-content:center; padding:18px; }
.empty-icon { font-size:28px; }
.empty-title { font-weight:700; margin-bottom:4px }
.empty-sub { color:#666 }

/* Status pill styles (use provided color tokens) */
.status-pill { padding:6px 10px; border-radius:999px; font-weight:600; font-size:12px; display:inline-block }
.status-completed,
.status-delivered { background: #d1fae5; color: #065f46; }

.status-pending { background: #fef3c7; color: #92400e; }

.status-pending-payment { background: #fed7aa; color: #c2410c; }

.status-paid { background: #d1fae5; color: #065f46; }

.status-processing { background: #dbeafe; color: #1e40af; }

.status-shipped { background: #e0e7ff; color: #4338ca; }

.status-cancelled { background: #fee2e2; color: #991b1b; }

.status-refunded { background: #f3f4f6; color: #374151; }

.status-unknown { background: #f3f4f6; color: #374151; }
</style>
