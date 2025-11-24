<template>
    <DataTable
        title="Options"
        :data="options"
        :columns="columns"
        :create-route="{ name: 'admin.options.create' }"
        create-button-text="Create Option"
        @delete="handleDelete"
    >
        <!-- Custom cell for Name column with link -->
        <template #cell-name="{ row, value }">
            <router-link 
                :to="{ name: 'admin.options.edit', params: { id: row.id } }"
                class="name-link"
            >
                {{ value }}
            </router-link>
        </template>

        <!-- Custom cell for Created column with formatted date -->
        <template #cell-updated_at="{ value }">
            {{ formatDate(value) }}
        </template>
    </DataTable>
</template>

<script>
import { ref, onMounted } from 'vue';
import DataTable from '@/Admin/view/components/DataTable.vue';
import { getOptions, deleteOption, deleteManyOptions } from '@/api/optionAPi';

export default {
    name: 'OptionPage',
    components: {
        DataTable
    },
    setup() {
        const options = ref([]);
        
        const columns = [
            { key: 'id', label: 'ID', sortable: true, width: '80px' },
            { key: 'name', label: 'Name', sortable: true },
            { key: 'type', label: 'Type', sortable: true, width: '150px' },
            { key: 'values_count', label: 'Values', sortable: true, width: '100px' },
            { key: 'updated_at', label: 'Updated', sortable: true, width: '150px' }
        ];

        const loadOptions = async () => {
            try {
                const response = await getOptions();
                if (response.code === 200 && response.result) {
                    options.value = response.result.map(opt => ({
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
        };

        const handleDelete = async (selectedIds) => {
            if (!confirm(`Are you sure you want to delete ${selectedIds.length} option(s)?`)) {
                return;
            }

            try {
                if (selectedIds.length === 1) {
                    await deleteOption(selectedIds[0]);
                } else {
                    await deleteManyOptions(selectedIds);
                }
                
                await loadOptions();
                alert('Option(s) deleted successfully!');
            } catch (error) {
                console.error('Error deleting options:', error);
                alert('Error deleting option(s). Please try again.');
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
            handleDelete,
            formatDate
        };
    }
};
</script>

<style scoped>
.name-link {
    color: #2563eb;
    text-decoration: none;
    font-weight: 500;
}

.name-link:hover {
    text-decoration: underline;
}
</style>

