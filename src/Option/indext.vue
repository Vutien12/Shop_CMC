<template>
    <DataTable
        title="Options"
        :breadcrumbs="[
            { label: 'Options' }
        ]"
        :data="options"
        :columns="columns"
        :create-route="{ name: 'admin.options.create' }"
        create-button-text="Create Option"
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
import { searchOptions, deleteOption, deleteManyOptions } from '@/api/optionApi.js';

export default {
    name: 'OptionPage',
    components: {
        DataTable
    },
    setup() {
        const router = useRouter();
        const notification = useNotification();
        const { isLoading, withLoading } = useLoading();
        const options = ref([]);

        const columns = [
            { key: 'id', label: 'ID', sortable: true, width: '80px' },
            { key: 'name', label: 'Name', sortable: true },
            { key: 'type', label: 'Type', sortable: true, width: '150px' },
            { key: 'values_count', label: 'Values', sortable: true, width: '100px' },
            { key: 'updated_at', label: 'Updated', sortable: true, width: '150px' }
        ];

        const loadOptions = async () => {
            await withLoading(async () => {
                try {
                    // Use search endpoint so backend's ModelAttribute binding receives isGlobal
                    const response = await searchOptions({ page: 0, size: 100, isGlobal: true });
                if (response.code === 200) {
                    const items = response.result?.content ?? response.result ?? [];
                    options.value = items.map(opt => ({
                        id: opt.id,
                        name: opt.name,
                        type: opt.type,
                        values_count: opt.optionValues?.length || 0,
                        updated_at: opt.updatedAt || opt.createdAt
                    }));
                }
                } catch (error) {
                console.error('Error loading options:', error);
            }
            });
        };

        const handleRowClick = (row) => {
            router.push({ name: 'admin.options.edit', params: { id: row.id } });
        };

        const handleDelete = async (selectedIds) => {
            const confirmed = await notification.confirm(
                'Xác nhận xóa',
                `Bạn có chắc chắn muốn xóa ${selectedIds.length} tùy chọn?`
            );
            
            if (!confirmed) {
                return;
            }

            try {
                if (selectedIds.length === 1) {
                    await deleteOption(selectedIds[0]);
                } else {
                    await deleteManyOptions(selectedIds);
                }

                await loadOptions();
                notification.success('Thành công!', 'Đã xóa tùy chọn thành công');
            } catch (error) {
                console.error('Error deleting options:', error);
                notification.error('Lỗi!', 'Không thể xóa tùy chọn');
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
            loadOptions();
        });

        return {
            options,
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
