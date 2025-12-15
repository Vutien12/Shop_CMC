<template>
    <DataTable
        title="Attributes"
        :breadcrumbs="[
            { label: 'Attributes' }
        ]"
        :data="attributes"
        :columns="columns"
        :create-route="{ name: 'admin.attributes.create' }"
        create-button-text="Create Attribute"
        :row-clickable="true"
        @delete="handleDelete"
        @row-click="handleRowClick"
    >
        <!-- Custom cell for Filterable column with badge -->
        <template #cell-filterable="{ value }">
            <span :class="['status-badge', value ? 'status-yes' : 'status-no']">
                {{ value ? 'Yes' : 'No' }}
            </span>
        </template>

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
import { searchAttributes, deleteManyAttributes } from '@/api/attributeApi.js';

export default {
    name: 'AttributeIndex',
    components: {
        DataTable
    },
    setup() {
        const router = useRouter();
        const notification = useNotification();
        const attributes = ref([]);
        const loading = ref(false);

        const columns = [
            { key: 'id', label: 'Id', sortable: true, width: '80px' },
            { key: 'name', label: 'Name', sortable: true },
            { key: 'attributeSet', label: 'Attribute set', sortable: true, width: '200px' },
            { key: 'filterable', label: 'Filterable', sortable: true, width: '120px' },
            { key: 'createdAt', label: 'Created', sortable: true, width: '150px' }
        ];

        const loadAttributes = async () => {
            loading.value = true;
            try {
                const response = await searchAttributes({
                    page: 0,
                    size: 100,
                    sortBy: 'createdAt',
                    direction: 'DESC'
                });

                // Map API response to table format
                const result = response.data.result;
                attributes.value = (result.content || result).map(attr => ({
                    id: attr.id,
                    name: attr.name,
                    attributeSet: attr.attributeSet?.name || 'N/A',
                    filterable: attr.filterable || false,
                    createdAt: attr.createdAt
                }));
            } catch (error) {
                console.error('Error loading attributes:', error);
                notification.error('Error', 'Failed to load attributes: ' + (error.response?.data?.message || error.message));
            } finally {
                loading.value = false;
            }
        };

        const handleRowClick = (row) => {
            router.push({ name: 'admin.attributes.edit', params: { id: row.id } });
        };

        const handleDelete = async (selectedIds) => {
            const confirmed = await notification.confirm(
                'Confirm delete',
                `Are you sure you want to delete ${selectedIds.length} attribute(s)?`
            );

            if (!confirmed) {
                return;
            }

            loading.value = true;
            try {
                await deleteManyAttributes(selectedIds);
                notification.success('Success', 'Attributes deleted successfully');
                // Reload the list
                await loadAttributes();
            } catch (error) {
                console.error('Error deleting attributes:', error);
                notification.error('Error', 'Failed to delete attributes: ' + (error.response?.data?.message || error.message));
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
            loadAttributes();
        });

        return {
            attributes,
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

.status-yes {
    background: #d1fae5;
    color: #065f46;
}

.status-no {
    background: #fee2e2;
    color: #991b1b;
}
</style>
