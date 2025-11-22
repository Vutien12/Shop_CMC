<template>
    <DataTable
        title="Coupons"
        :data="coupons"
        :columns="columns"
        :create-route="{ name: 'admin.coupons.create' }"
        create-button-text="Create Coupon"
        @delete="handleDelete"
    >
        <!-- Custom cell for Name column with link to edit (route optional) -->
        <template #cell-name="{ row, value }">
            <router-link 
                :to="{ name: 'admin.coupons.edit', params: { id: row.id } }"
                class="name-link"
            >
                {{ value }}
            </router-link>
        </template>

        <!-- Custom cell for Created column with formatted date -->
        <template #cell-created_at="{ value }">
            {{ formatDate(value) }}
        </template>

        <!-- Custom cell for Discount to show value and type -->
        <template #cell-value="{ row }">
            <span>{{ formatDiscount(row) }}</span>
        </template>

        <!-- Custom cell for Status -->
        <template #cell-is_active="{ value }">
            <span :class="value ? 'text-success' : 'text-muted'">{{ value ? 'Active' : 'Disabled' }}</span>
        </template>
    </DataTable>
</template>

<script>
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { useRoute } from 'vue-router'
import DataTable from '@/Admin/view/components/DataTable.vue';

export default {
    name: 'CouponsPage',
    components: {
        DataTable
    },
    setup() {
        const coupons = ref([]);
        
        const columns = [
            { key: 'id', label: 'ID', sortable: true, width: '80px' },
            { key: 'name', label: 'Name', sortable: true },
            { key: 'code', label: 'Code', sortable: true },
            { key: 'value', label: 'Discount', sortable: true, width: '140px' },
            { key: 'is_active', label: 'Status', sortable: true, width: '120px' },
            { key: 'created_at', label: 'Created', sortable: true, width: '180px' }
        ];

        const loadCoupons = () => {
            // Mock data matching screenshot (relative dates will show as years ago)
            coupons.value = [
                { id: 2, name: 'Percent Discount', code: '10PERCENT', value: 10, is_percent: 1, is_active: true, created_at: '2020-10-01T09:12:00' },
                { id: 1, name: 'Anniversary', code: 'HAPPY2020', value: 20, is_percent: 0, is_active: true, created_at: '2020-10-01T09:12:00' }
            ];
        };

        const route = useRoute()

        const handleDelete = (selectedIds) => {
            if (confirm(`Are you sure you want to delete ${selectedIds.length} coupon(s)?`)) {
                coupons.value = coupons.value.filter(
                    c => !selectedIds.includes(c.id)
                );
            }
        };

        const formatDate = (date) => {
            if (!date) return '';
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

        const formatDiscount = (row) => {
            if (!row) return '';
            if (row.is_percent) {
                // show percentage with 4 decimal places like the screenshot (e.g. 10.0000%)
                const num = Number(row.value) || 0;
                return `${num.toFixed(4)}%`;
            }
            // fixed amount with 2 decimals
            const amt = Number(row.value) || 0;
            return `$${amt.toFixed(2)}`;
        };

        onMounted(() => {
            loadCoupons();
        });

        // Reload list when route changes (useful after navigating back from create/edit)
        watch([
            () => route.fullPath,
            () => route.query.refreshed
        ], () => {
            loadCoupons()
        })

        // Also listen for a global event dispatched after create so we update immediately.
        // If event.detail is present we insert the new coupon locally (no API call required).
        const onCreated = (evt) => {
            try {
                const newCoupon = evt && evt.detail ? evt.detail : null
                if (newCoupon) {
                    // add to the top of the list
                    coupons.value = [newCoupon, ...coupons.value]
                    return
                }
            } catch (e) {
                // fall back to reload
            }
            loadCoupons()
        }
        window.addEventListener('coupons:created', onCreated)
        onUnmounted(() => {
            window.removeEventListener('coupons:created', onCreated)
        })

        return {
            coupons,
            columns,
                handleDelete,
                formatDate,
                formatDiscount
        };
    }
};
</script>

<style scoped>
.name-link {
    color: #2563eb;
    text-decoration: none;
    font-weight: 500;
}

.name-link:hover {
    text-decoration: underline;
}

.text-success { color: #16a34a }
.text-muted { color: #6b7280 }
</style>

