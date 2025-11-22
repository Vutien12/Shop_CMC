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
        <template #cell-created_at="{ value }">
            {{ formatDate(value) }}
        </template>
    </DataTable>
</template>

<script>
import { ref, onMounted } from 'vue';
import DataTable from '@/Admin/view/components/DataTable.vue';

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
            { key: 'created_at', label: 'Created', sortable: true, width: '150px' }
        ];

        const loadOptions = () => {
            // Mock data - replace with actual API call
            options.value = [
                { id: 1, name: 'Size', type: 'Dropdown', created_at: '2024-10-18T08:45:00' },
                { id: 2, name: 'Color', type: 'Radio', created_at: '2024-10-19T15:30:00' },
                { id: 3, name: 'Material', type: 'Checkbox', created_at: '2024-10-20T10:00:00' }
            ];
        };

        const handleDelete = (selectedIds) => {
            if (confirm(`Are you sure you want to delete ${selectedIds.length} option(s)?`)) {
                options.value = options.value.filter(
                    opt => !selectedIds.includes(opt.id)
                );
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

