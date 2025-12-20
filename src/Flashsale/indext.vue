<template>
    <DataTable
        title="Flash Sales"
        :data="flashSales"
        :columns="columns"
        :create-route="{ name: 'admin.flashsales.create' }"
        create-button-text="Create Flash Sale"
        :loading="isLoading"
        :row-clickable="true"
        @delete="handleDelete"
        @row-click="handleRowClick"
    >
        <!-- Custom cell for Name column -->
        <template #cell-name="{ value }">
            <span class="name-text">{{ value }}</span>
        </template>

        <!-- Custom cell for Created column with formatted date -->
        <template #cell-created="{ value }">
            {{ formatDate(value) }}
        </template>
    </DataTable>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useLoading } from '@/Admin/composables/useLoading.js';
import DataTable from '@/Admin/view/components/DataTable.vue';
import { getAllFlashSales, deleteFlashSale } from '@/api/flashsaleApi.js';

export default {
    name: 'FlashSalePage',
    components: {
        DataTable
    },
    setup() {
        const router = useRouter();
        const { isLoading, withLoading } = useLoading();
        const flashSales = ref([]);

        const columns = [
            { key: 'id', label: 'ID', sortable: true, width: '80px' },
            { key: 'name', label: 'Name', sortable: true },
            { key: 'status', label: 'Status', sortable: true, width: '150px' },
            { key: 'startTime', label: 'Start Time', sortable: true, width: '200px' },
            { key: 'endTime', label: 'End Time', sortable: true, width: '200px' },
            { key: 'totalItems', label: 'Total Items', sortable: true, width: '120px' }
        ];

        const loadFlashSales = async () => {
            await withLoading(async () => {
                try {
                    const response = await getAllFlashSales();
                    if (response && response.code === 200) {
                        flashSales.value = response.result || [];
                    }
                } catch (error) {
                    console.error('Error loading flash sales:', error);
                    alert('Error loading flash sales. Please try again.');
                }
            });
        };

        const handleRowClick = (row) => {
            router.push({ name: 'admin.flashsales.edit', params: { id: row.id } });
        };

        const handleDelete = async (selectedIds) => {
            if (!confirm(`Are you sure you want to delete ${selectedIds.length} flash sale(s)?`)) {
                return;
            }

            try {
                // Delete each flash sale
                for (const id of selectedIds) {
                    await deleteFlashSale(id);
                }

                await loadFlashSales();
                alert('Flash sale(s) deleted successfully!');
            } catch (error) {
                console.error('Error deleting flash sales:', error);
                alert('Error deleting flash sale(s). Please try again.');
            }
        };

        const formatDate = (date) => {
            if (!date) return 'N/A';
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

        onMounted(() => {
            loadFlashSales();
        });

        return {
            flashSales,
            columns,
            isLoading,
            handleRowClick,
            handleDelete,
            formatDate
        };
    }
};
</script>

<style scoped>
.name-text {
    font-weight: 500;
    color: #111827;
}
</style>

