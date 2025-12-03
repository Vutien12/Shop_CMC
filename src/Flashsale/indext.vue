<template>
    <DataTable
        title="Flash Sales"
        :data="flashSales"
        :columns="columns"
        :create-route="{ name: 'admin.flashsales.create' }"
        create-button-text="Create Flash Sale"
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
import DataTable from '@/Admin/view/components/DataTable.vue';

export default {
    name: 'FlashSalePage',
    components: {
        DataTable
    },
    setup() {
        const router = useRouter();
        const flashSales = ref([]);

        const columns = [
            { key: 'id', label: 'ID', sortable: true, width: '80px' },
            { key: 'name', label: 'Name', sortable: true },
            { key: 'created', label: 'Created', sortable: true, width: '200px' }
        ];

        const loadFlashSales = async () => {
            try {
                // TODO: Replace with actual API call
                // const response = await getFlashSales();
                // Mock data for now
                flashSales.value = [
                    { id: 1, name: 'Summer Sale 2024', created: new Date('2024-06-01') },
                    { id: 2, name: 'Black Friday Sale', created: new Date('2024-11-15') },
                    { id: 3, name: 'Christmas Sale', created: new Date('2024-12-01') }
                ];
            } catch (error) {
                console.error('Error loading flash sales:', error);
            }
        };

        const handleRowClick = (row) => {
            router.push({ name: 'admin.flashsales.edit', params: { id: row.id } });
        };

        const handleDelete = async (selectedIds) => {
            if (!confirm(`Are you sure you want to delete ${selectedIds.length} flash sale(s)?`)) {
                return;
            }

            try {
                // TODO: Replace with actual API call
                // if (selectedIds.length === 1) {
                //     await deleteFlashSale(selectedIds[0]);
                // } else {
                //     await deleteManyFlashSales(selectedIds);
                // }

                await loadFlashSales();
                alert('Flash sale(s) deleted successfully!');
            } catch (error) {
                console.error('Error deleting flash sales:', error);
                alert('Error deleting flash sale(s). Please try again.');
            }
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

        onMounted(() => {
            loadFlashSales();
        });

        return {
            flashSales,
            columns,
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

