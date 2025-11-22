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
                        <td class="empty" colspan="4">No data available!</td>
                    </tr>
                    <tr v-for="order in orders" :key="order.id">
                        <td>
                            <a href="#" @click.prevent="viewOrder(order.id)">
                                {{ order.id }}
                            </a>
                        </td>
                        <td>
                            <a href="#" @click.prevent="viewOrder(order.id)">
                                {{ order.customer }}
                            </a>
                        </td>
                        <td>
                            <a href="#" @click.prevent="viewOrder(order.id)">
                                <span class="badge" :class="getStatusClass(order.status)">
                                    {{ order.status }}
                                </span>
                            </a>
                        </td>
                        <td>
                            <a href="#" @click.prevent="viewOrder(order.id)">
                                ${{ order.total.toFixed(2) }}
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
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
    const statusMap = {
        'Pending': 'badge-info',
        'Processing': 'badge-warning',
        'Completed': 'badge-success',
        'Cancelled': 'badge-danger'
    };
    return statusMap[status] || 'badge-secondary';
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

.grid-header h5 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
}

.table-responsive {
    overflow-x: auto;
}

.table {
    width: 100%;
    margin-bottom: 0;
}

.table thead th {
    background: #f8f9fa;
    color: #333;
    font-weight: 600;
    font-size: 14px;
    padding: 12px 15px;
    border-bottom: 2px solid #e8e8e8;
}

.table tbody td {
    padding: 12px 15px;
    border-bottom: 1px solid #e8e8e8;
    vertical-align: middle;
}

.table tbody tr:hover {
    background: #f8f9fa;
}

.table a {
    color: #333;
    text-decoration: none;
}

.table a:hover {
    color: #0087F7;
}

.badge {
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
}

.badge-info {
    background: #17a2b8;
    color: #fff;
}

.badge-warning {
    background: #ffc107;
    color: #333;
}

.badge-success {
    background: #28a745;
    color: #fff;
}

.badge-danger {
    background: #dc3545;
    color: #fff;
}

.badge-secondary {
    background: #6c757d;
    color: #fff;
}

.empty {
    text-align: center;
    color: #888;
    padding: 30px !important;
}
</style>
