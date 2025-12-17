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
        :server-side="true"
        :pagination="pagination"
        @delete="handleDelete"
        @row-click="handleRowClick"
        @search="handleSearch"
        @page-change="handlePageChange"
        @per-page-change="handlePerPageChange"
        @sort="handleSort"
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
import { searchAttributeSets, deleteAttributeSet, deleteManyAttributeSets } from '@/api/attributeSetApi.js';

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
            { key: 'id', label: 'Id', sortable: true, width: '300px' },
            { key: 'name', label: 'Name', sortable: true },
            { key: 'createdAt', label: 'Created', sortable: true, width: '300px' }
        ];

        const loadAttributeSets = async () => {
            loading.value = true;
            try {
                const params = {
                    page: pagination.value.currentPage - 1,
                    size: pagination.value.pageSize,
                    sortBy: sortBy.value,
                    direction: sortDirection.value
                };

                if (searchQuery.value) {
                    params.keyword = searchQuery.value;
                }

                const response = await searchAttributeSets(params);
                // searchAttributeSets already returns response.data
                const result = response.result;

                if (result?.content) {
                    attributeSets.value = result.content.map(set => ({
                        id: set.id,
                        name: set.name,
                        createdAt: set.createdAt
                    }));

                    pagination.value.totalElements = result.totalElements || 0;
                    pagination.value.totalPages = result.totalPages || 0;
                } else if (Array.isArray(result)) {
                    attributeSets.value = result.map(set => ({
                        id: set.id,
                        name: set.name,
                        createdAt: set.createdAt
                    }));
                } else {
                    attributeSets.value = [];
                }
            } catch (error) {
                console.error('Failed to load attribute sets:', error);
                notification.error('Lỗi!', 'Không thể tải danh sách attribute sets');
            } finally {
                loading.value = false;
            }
        };

        const handleSearch = (query) => {
            searchQuery.value = query;
            pagination.value.currentPage = 1;
            loadAttributeSets();
        };

        const handlePageChange = (page) => {
            pagination.value.currentPage = page;
            loadAttributeSets();
        };

        const handlePerPageChange = (perPage) => {
            pagination.value.pageSize = perPage;
            pagination.value.currentPage = 1;
            loadAttributeSets();
        };

        const handleSort = ({ sortBy: newSortBy, direction }) => {
            sortBy.value = newSortBy;
            sortDirection.value = direction.toUpperCase();
            loadAttributeSets();
        };

        const handleRowClick = (row) => {
            router.push({ name: 'admin.attribute-sets.edit', params: { id: row.id } });
        };

        const handleDelete = async (selectedIds) => {
            const confirmed = await notification.confirm(
                'Xác nhận xóa',
                `Bạn có chắc chắn muốn xóa ${selectedIds.length} attribute set(s)?`
            );

            if (confirmed) {
                try {
                    loading.value = true;

                    if (selectedIds.length === 1) {
                        await deleteAttributeSet(selectedIds[0]);
                    } else {
                        await deleteManyAttributeSets(selectedIds);
                    }

                    // Reload the list
                    await loadAttributeSets();
                    notification.success('Thành công!', 'Đã xóa attribute sets thành công');
                } catch (error) {
                    console.error('Failed to delete attribute sets:', error);
                    notification.error('Lỗi!', 'Không thể xóa attribute sets');
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
            loadAttributeSets();
        });

        return {
            attributeSets,
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
/* Minimal styles - most styling comes from DataTable component */
</style>
