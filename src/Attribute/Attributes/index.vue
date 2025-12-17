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
        :server-side="true"
        :pagination="pagination"
        @delete="handleDelete"
        @row-click="handleRowClick"
        @search="handleSearch"
        @page-change="handlePageChange"
        @per-page-change="handlePerPageChange"
        @sort="handleSort"
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
import { getAttributes, searchAttributes, deleteAttribute, deleteManyAttributes } from '@/api/attributeApi.js';

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

        // Search and pagination state
        const searchQuery = ref('');
        const pagination = ref({
            currentPage: 1,
            pageSize: 20,
            totalElements: 0,
            totalPages: 0
        });
        const sortBy = ref('createdAt');
        const sortDirection = ref('DESC');

        const columns = [
            { key: 'id', label: 'Id', sortable: true, width: '80px' },
            { key: 'name', label: 'Name', sortable: true, width: '150px' },
            { key: 'attributeSet', label: 'Attribute set', sortable: true, width: '200px' },
            { key: 'filterable', label: 'Filterable', sortable: true, width: '120px' },
            { key: 'createdAt', label: 'Created', sortable: true, width: '150px' }
        ];

        const loadAttributes = async () => {
            loading.value = true;
            try {
                const params = {
                    page: pagination.value.currentPage - 1, // API uses 0-based page
                    size: pagination.value.pageSize,
                    sortBy: sortBy.value,
                    direction: sortDirection.value
                };

                // Add search keyword if exists
                if (searchQuery.value) {
                    params.keyword = searchQuery.value;
                }

                console.log('Loading attributes with params:', params);
                const response = await searchAttributes(params);
                console.log('Attributes response:', response);

                // Map API response to table format
                const result = response.data.result;

                if (result.content) {
                    // Paginated response
                    attributes.value = result.content.map(attr => ({
                        id: attr.id,
                        name: attr.name,
                        attributeSet: attr.attributeSet?.name || 'N/A',
                        filterable: attr.filterable || false,
                        createdAt: attr.createdAt
                    }));

                    pagination.value.totalElements = result.totalElements || 0;
                    pagination.value.totalPages = result.totalPages || 0;
                } else {
                    // Non-paginated response
                    attributes.value = (result || []).map(attr => ({
                        id: attr.id,
                        name: attr.name,
                        attributeSet: attr.attributeSet?.name || 'N/A',
                        filterable: attr.filterable || false,
                        createdAt: attr.createdAt
                    }));
                }
            } catch (error) {
                console.error('Failed to load attributes:', error);
                notification.error('Lỗi!', 'Không thể tải danh sách attributes');
            } finally {
                loading.value = false;
            }
        };

        const handleSearch = (query) => {
            searchQuery.value = query;
            pagination.value.currentPage = 1; // Reset to first page
            loadAttributes();
        };

        const handlePageChange = (page) => {
            pagination.value.currentPage = page;
            loadAttributes();
        };

        const handlePerPageChange = (perPage) => {
            pagination.value.pageSize = perPage;
            pagination.value.currentPage = 1; // Reset to first page
            loadAttributes();
        };

        const handleSort = ({ sortBy: newSortBy, direction }) => {
            sortBy.value = newSortBy;
            sortDirection.value = direction.toUpperCase();
            loadAttributes();
        };

        const handleRowClick = (row) => {
            router.push({ name: 'admin.attributes.edit', params: { id: row.id } });
        };

        const handleDelete = async (selectedIds) => {
            const confirmed = await notification.confirm(
                'Xác nhận xóa',
                `Bạn có chắc chắn muốn xóa ${selectedIds.length} attribute(s)?`
            );
            
            if (confirmed) {
                try {
                    loading.value = true;

                    if (selectedIds.length === 1) {
                        await deleteAttribute(selectedIds[0]);
                    } else {
                        await deleteManyAttributes(selectedIds);
                    }

                    // Reload the list
                    await loadAttributes();
                    notification.success('Thành công!', 'Đã xóa attributes thành công');
                } catch (error) {
                    console.error('Failed to delete attributes:', error);
                    notification.error('Lỗi!', 'Không thể xóa attributes');
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
            loadAttributes();
        });

        return {
            attributes,
            columns,
            loading,
            pagination,
            handleRowClick,
            handleDelete,
            handleSearch,
            handlePageChange,
            handlePerPageChange,
            handleSort,
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
