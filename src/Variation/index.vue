<template>
    <DataTable
        title="Variations"
        :breadcrumbs="[{ label: 'Variations' }]"
        :data="variations"
        :columns="columns"
        :create-route="{ name: 'admin.variations.create' }"
        create-button-text="Create Variation"
        :loading="isLoading"
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
import { useNotification } from '@/Admin/composables/useNotification.js';
import { useLoading } from '@/Admin/composables/useLoading.js';
import DataTable from '@/Admin/view/components/DataTable.vue';
import { searchVariations, deleteVariation, deleteManyVariations } from '@/api/variationApi';

export default {
    name: 'VariationPage',
    components: {
        DataTable
    },
    setup() {
        const router = useRouter();
        const notification = useNotification();
        const { isLoading, withLoading } = useLoading();
        const variations = ref([]);

        const columns = [
            { key: 'id', label: 'ID', sortable: true, width: '80px' },
            { key: 'name', label: 'Name', sortable: true },
            { key: 'type', label: 'Type', sortable: true, width: '150px' },
            { key: 'values_count', label: 'Values', sortable: false, width: '100px' },
            { key: 'updated_at', label: 'Updated', sortable: true, width: '150px' }
        ];

        const loadVariations = async () => {
            await withLoading(async () => {
                try {
                    // Use searchVariations so the backend's /search mapping receives ModelAttribute fields like isGlobal
                    // Spring pageable is 0-based — request page 0 for the first page
                    const response = await searchVariations({ page: 0, size: 100, isGlobal: true });

                    if (response.code === 200) {
                        // Backend may return a Page object: result.content contains items
                        const items = response.result?.content ?? response.result ?? [];
                        // Map API response to component format
                        variations.value = items.map(variation => ({
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
                    notification.error('Error!', 'Failed to load variations list');
                }
            });
        };

        const handleRowClick = (row) => {
            router.push({ name: 'admin.variations.edit', params: { id: row.id } });
        };

        const handleDelete = async (selectedIds) => {
            const confirmed = await notification.confirm(
                'Confirm Delete',
                `Are you sure you want to delete ${selectedIds.length} variation(s)?`
            );

            if (confirmed) {
                try {
                    if (selectedIds.length === 1) {
                        await deleteVariation(selectedIds[0]);
                    } else {
                        await deleteManyVariations(selectedIds);
                    }

                    // Reload variations after deletion
                    await loadVariations();
                    notification.success('Success!', 'Variation(s) deleted successfully');
                } catch (error) {
                    console.error('Failed to delete variations:', error);
                    notification.error('Error!', 'Failed to delete variation(s)');
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
