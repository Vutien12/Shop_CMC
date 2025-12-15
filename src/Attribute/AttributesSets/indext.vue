<template>
    <DataTable
        title="Attribute Sets"
        :breadcrumbs="[
            { label: 'Attribute Sets' }
        ]"
        :data="attributeSets"
        :columns="columns"
        :create-route="{ name: 'admin.attribute-sets.create' }"
        create-button-text="Create Attribute Set"
        :row-clickable="true"
        @delete="handleDelete"
        @row-click="handleRowClick"
    >
        <!-- Custom cell for Created column with formatted date -->
        <template #cell-createdAt="{ value }">
            {{ formatDate(value) }}
        </template>
    </DataTable>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useNotification } from '@/Admin/composables/useNotification.js';
import DataTable from '@/Admin/view/components/DataTable.vue';
import { searchAttributeSets, deleteManyAttributeSets } from '@/api/attributeSetApi.js';

export default {
    name: 'AttributeSetIndex',
    components: {
        DataTable
    },
    setup() {
        const router = useRouter();
        const notification = useNotification();
        const attributeSets = ref([]);
        const loading = ref(false);

        const columns = [
            { key: 'id', label: 'Id', sortable: true, width: '80px' },
            { key: 'name', label: 'Name', sortable: true },
            { key: 'createdAt', label: 'Created', sortable: true, width: '150px' }
        ];

        const loadAttributeSets = async () => {
            loading.value = true;
            try {
                const response = await searchAttributeSets({
                    page: 0,
                    size: 100,
                    sortBy: 'createdAt',
                    direction: 'DESC'
                });

                // Map API response to table format
                const result = response.data.result;
                attributeSets.value = (result.content || result).map(set => ({
                    id: set.id,
                    name: set.name,
                    createdAt: set.createdAt
                }));
            } catch (error) {
                console.error('Error loading attribute sets:', error);
                notification.error('Error', 'Failed to load attribute sets: ' + (error.response?.data?.message || error.message));
            } finally {
                loading.value = false;
            }
        };

        const handleRowClick = (row) => {
            router.push({ name: 'admin.attribute-sets.edit', params: { id: row.id } });
        };

        const handleDelete = async (selectedIds) => {
            const confirmed = await notification.confirm(
                'Confirm delete',
                `Are you sure you want to delete ${selectedIds.length} attribute set(s)?`
            );

            if (!confirmed) {
                return;
            }

            loading.value = true;
            try {
                await deleteManyAttributeSets(selectedIds);
                notification.success('Success', 'Attribute sets deleted successfully');
                // Reload the list
                await loadAttributeSets();
            } catch (error) {
                console.error('Error deleting attribute sets:', error);
                notification.error('Error', 'Failed to delete attribute sets: ' + (error.response?.data?.message || error.message));
            } finally {
                loading.value = false;
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
            loadAttributeSets();
        });

        return {
            attributeSets,
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
/* Minimal styles - most styling comes from DataTable component */
</style>
