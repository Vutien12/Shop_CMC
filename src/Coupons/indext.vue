<template>
    <DataTable
        title="Coupons"
        :breadcrumbs="[
            { label: 'Coupons' }
        ]"
        :data="coupons"
        :columns="columns"
        :create-route="{ name: 'admin.coupons.create' }"
        create-button-text="Create Coupon"
        :loading="isLoading"
        :row-clickable="true"
        @delete="handleDelete"
        @row-click="handleRowClick"
    >
        <!-- Custom cell for Description column -->
        <template #cell-description="{ value }">
            <span class="description-text">{{ value }}</span>
        </template>

        <!-- Custom cell for Created column with formatted date -->
        <template #cell-createdAt="{ value }">
            {{ formatDate(value) }}
        </template>

        <!-- Custom cell for Discount to show value and type -->
        <template #cell-discountValue="{ row }">
            <span>{{ formatDiscount(row) }}</span>
        </template>

        <!-- Custom cell for Status -->
        <template #cell-isActive="{ value }">
            <span :class="value ? 'text-success' : 'text-muted'">{{ value ? 'Active' : 'Disabled' }}</span>
        </template>
    </DataTable>
</template>

<script>
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { useNotification } from '@/Admin/composables/useNotification.js';
import { useLoading } from '@/Admin/composables/useLoading.js';
import DataTable from '@/Admin/view/components/DataTable.vue';
import { getCoupons, deleteCoupon, deleteCoupons } from '@/api/couponsApi';

export default {
    name: 'CouponsPage',
    components: {
        DataTable
    },
    setup() {
        const router = useRouter();
        const notification = useNotification();
        const { isLoading, withLoading } = useLoading();
        const coupons = ref([]);

        const columns = [
            { key: 'id', label: 'ID', sortable: true, width: '80px' },
            { key: 'description', label: 'Description', sortable: true },
            { key: 'code', label: 'Code', sortable: true },
            { key: 'discountValue', label: 'Discount Value', sortable: true, width: '140px' },
            { key: 'isActive', label: 'Status', sortable: true, width: '120px' },
            { key: 'createdAt', label: 'Created', sortable: true, width: '180px' }
        ];

        const loadCoupons = async () => {
            await withLoading(async () => {
                try {
                    const response = await getCoupons();
                    console.log('API Response:', response);

                    // Handle different response structures
                    const data = Array.isArray(response) ? response : (response.data || response.result || []);

                    coupons.value = data.map(coupon => ({
                        id: coupon.id,
                        description: coupon.description,
                        code: coupon.code,
                        discountValue: coupon.discountValue,
                        discountType: coupon.discountType,
                        isActive: coupon.isActive,
                        createdAt: coupon.createdAt
                    }));
                } catch (error) {
                    console.error('Failed to load coupons:', error);
                    // Fallback to empty array if API fails
                    coupons.value = [];
                }
            });
        };

        const route = useRoute()

        const handleRowClick = (row) => {
            router.push({ name: 'admin.coupons.edit', params: { id: row.id } });
        };

        const handleDelete = async (selectedIds) => {
            const confirmed = await notification.confirm(
                'Xác nhận xóa',
                `Bạn có chắc chắn muốn xóa ${selectedIds.length} mã giảm giá?`
            );
            
            if (confirmed) {
                try {
                    if (selectedIds.length === 1) {
                        await deleteCoupon(selectedIds[0]);
                    } else {
                        await deleteCoupons(selectedIds);
                    }
                    // Reload after successful delete
                    await loadCoupons();
                    notification.success('Thành công!', 'Đã xóa mã giảm giá thành công');
                } catch (error) {
                    console.error('Failed to delete coupons:', error);
                    notification.error('Lỗi!', 'Không thể xóa mã giảm giá');
                }
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
            const num = Number(row.discountValue) || 0;
            if (row.discountType === 'PERCENT') {
                return `${num}%`;
            }
            // fixed amount
            return `${num.toLocaleString('vi-VN')}₫`;
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
            } catch {
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
            isLoading,
            handleRowClick,
            handleDelete,
            formatDate,
            formatDiscount
        };
    }
};
</script>

<style scoped>
.description-text {
    font-weight: 500;
    color: #111827;
}

.text-success { color: #16a34a }
.text-muted { color: #6b7280 }
</style>

