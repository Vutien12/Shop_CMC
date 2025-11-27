<template>
    <DataTable
        title="Orders"
        :data="orders"
        :columns="columns"
        :create-route="null"
        create-button-text="Create Order"
        :row-clickable="true"
        @delete="handleDelete"
        @row-click="handleRowClick"
    >
        <!-- Custom cell for Customer Name column with link -->
        <template #cell-customer_name="{ value }">
            <span class="customer-name">
                {{ value }}
            </span>
        </template>

        <!-- Custom cell for Status column with badge -->
        <template #cell-status="{ value }">
            <span :class="['status-badge', `status-${value.toLowerCase().replace(/\s+/g, '-')}`]">
                {{ value }}
            </span>
        </template>

        <!-- Custom cell for Total column with currency format -->
        <template #cell-total="{ value }">
            {{ formatCurrency(value) }}
        </template>

        <!-- Custom cell for Created column with formatted date -->
        <template #cell-created_at="{ value }">
            {{ formatDate(value) }}
        </template>
    </DataTable>
</template>

<script>
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import DataTable from '@/Admin/view/components/DataTable.vue';
import { useAdminOrderStore } from '@/Order/stores/adminOrderStore.js';
import { deleteOrders } from '@/api/orderApi.js';

export default {
    name: 'OrderPage',
    components: {
        DataTable
    },
    setup() {
        const router = useRouter();
        const orderStore = useAdminOrderStore();
        const orders = computed(() => orderStore.orders);
        const isLoading = computed(() => orderStore.isLoading);

        const columns = [
            { key: 'id', label: 'ID', sortable: true, width: '60px' },
            { key: 'customer_name', label: 'Customer Name', sortable: true, width: '170px' },
            { key: 'customer_email', label: 'Customer Email', sortable: true, width: '200px' },
            { key: 'status', label: 'Status', sortable: true, width: '140px' },
            { key: 'total', label: 'Total', sortable: true, width: '100px' },
            { key: 'created_at', label: 'Created', sortable: true, width: '150px' }
        ];

        const loadOrders = async () => {
            try {
                await orderStore.fetchOrders();
            } catch (error) {
                console.error('Failed to load orders:', error);
                alert('Failed to load orders. Please try again.');
            }
        };

        const handleDelete = async (selectedIds) => {
            if (!confirm(`Are you sure you want to delete ${selectedIds.length} order(s)?`)) {
                return;
            }

            try {
                await deleteOrders(selectedIds);
                orderStore.removeOrders(selectedIds);
                alert(`Successfully deleted ${selectedIds.length} order(s)`);
            } catch (error) {
                console.error('Failed to delete orders:', error);
                alert('Failed to delete orders. Please try again.');
            }
        };

        const handleRowClick = (row) => {
            router.push({ name: 'admin.orders.detail', params: { id: row.id } });
        };

        const formatCurrency = (amount) => {
            // Check if VND currency by looking at amount size (VND amounts are typically large)
            if (amount >= 10000) {
                return `${amount.toLocaleString('vi-VN')}₫`;
            }
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(amount);
        };

        const formatDate = (date) => {
            const d = new Date(date);
            const now = new Date();
            const diffMs = now - d;
            const diffDays = Math.floor(diffMs / 86400000);
            const diffMonths = Math.floor(diffDays / 30);
            const diffYears = Math.floor(diffDays / 365);

            if (diffYears >= 1) return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
            if (diffMonths >= 1) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
            if (diffDays >= 1) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

            const diffHours = Math.floor(diffMs / 3600000);
            if (diffHours >= 1) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

            const diffMins = Math.floor(diffMs / 60000);
            return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        };

        onMounted(async () => {
            await loadOrders();
        });

        return {
            orders,
            columns,
            isLoading,
            handleDelete,
            handleRowClick,
            formatCurrency,
            formatDate
        };
    }
};
</script>

<style scoped>
.customer-name {
    color: #374151;
    font-weight: 500;
}

.status-badge {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 500;
    display: inline-block;
    white-space: nowrap;
    text-align: center;
    min-width: fit-content;
}

.status-completed,
.status-delivered {
    background: #d1fae5;
    color: #065f46;
}

.status-pending {
    background: #fef3c7;
    color: #92400e;
}

.status-pending-payment {
    background: #fed7aa;
    color: #c2410c;
}

.status-paid {
    background: #d1fae5;
    color: #065f46;
}

.status-processing {
    background: #dbeafe;
    color: #1e40af;
}

.status-shipped {
    background: #e0e7ff;
    color: #4338ca;
}

.status-cancelled {
    background: #fee2e2;
    color: #991b1b;
}

.status-refunded {
    background: #f3f4f6;
    color: #374151;
}
</style>

