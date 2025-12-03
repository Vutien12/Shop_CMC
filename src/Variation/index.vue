<template>
    <DataTable
        title="Variations"
        :data="variations"
        :columns="columns"
        :create-route="{ name: 'admin.variations.create' }"
        create-button-text="Create Variation"
        :row-clickable="true"
        @delete="handleDelete"
        @row-click="handleRowClick"
    >
        <!-- Custom cell for Name column -->
        <template #cell-name="{ value }">
            <span class="name-text">{{ value }}</span>
        </template>

        <!-- Custom cell for Updated column with formatted date -->
        <template #cell-updated_at="{ value }">
            {{ formatDate(value) }}
        </template>
    </DataTable>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DataTable from '@/Admin/view/components/DataTable.vue';
import { getVariations, deleteVariation, deleteManyVariations } from '@/api/variationApi';

export default {
    name: 'VariationPage',
    components: {
        DataTable
    },
    setup() {
        const router = useRouter();
        const variations = ref([]);
        const loading = ref(false);

        const columns = [
            { key: 'id', label: 'ID', sortable: true, width: '80px' },
            { key: 'name', label: 'Name', sortable: true },
            { key: 'type', label: 'Type', sortable: true, width: '150px' },
            { key: 'values_count', label: 'Values', sortable: false, width: '100px' },
            { key: 'updated_at', label: 'Updated', sortable: true, width: '150px' }
        ];

        const loadVariations = async () => {
            try {
                loading.value = true;
                const response = await getVariations({ page: 1, size: 100 });

                if (response.code === 200) {
                    // Map API response to component format
                    variations.value = response.result.map(variation => ({
                        id: variation.id,
                        name: variation.name,
                        type: variation.type,
                        values_count: variation.variationValues?.length || 0,
                        updated_at: variation.createdAt || variation.updatedAt,
                        isGlobal: variation.isGlobal
                    }));
                }
            } catch (error) {
                console.error('Failed to load variations:', error);
                alert('Failed to load variations. Please try again.');
            } finally {
                loading.value = false;
            }
        };

        const handleRowClick = (row) => {
            router.push({ name: 'admin.variations.edit', params: { id: row.id } });
        };

        const handleDelete = async (selectedIds) => {
            if (confirm(`Are you sure you want to delete ${selectedIds.length} variation(s)?`)) {
                try {
                    loading.value = true;

                    if (selectedIds.length === 1) {
                        await deleteVariation(selectedIds[0]);
                    } else {
                        await deleteManyVariations(selectedIds);
                    }

                    // Reload variations after deletion
                    await loadVariations();
                    alert('Variation(s) deleted successfully!');
                } catch (error) {
                    console.error('Failed to delete variations:', error);
                    alert('Failed to delete variations. Please try again.');
                } finally {
                    loading.value = false;
                }
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
            loadVariations();
        });

        return {
            variations,
            columns,
            loading,
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

