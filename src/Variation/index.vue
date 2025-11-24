<template>
    <DataTable
        title="Variations"
        :data="variations"
        :columns="columns"
        :create-route="{ name: 'admin.variations.create' }"
        create-button-text="Create Variation"
        @delete="handleDelete"
    >
        <!-- Custom cell for Name column with link -->
        <template #cell-name="{ row, value }">
            <router-link 
                :to="{ name: 'admin.variations.edit', params: { id: row.id } }"
                class="name-link"
            >
                {{ value }}
            </router-link>
        </template>

        <!-- Custom cell for Updated column with formatted date -->
        <template #cell-updated_at="{ value }">
            {{ formatDate(value) }}
        </template>
    </DataTable>
</template>

<script>
import { ref, onMounted } from 'vue';
import DataTable from '@/Admin/view/components/DataTable.vue';

export default {
    name: 'VariationPage',
    components: {
        DataTable
    },
    setup() {
        const variations = ref([]);
        
        const columns = [
            { key: 'id', label: 'ID', sortable: true, width: '80px' },
            { key: 'name', label: 'Name', sortable: true },
            { key: 'type', label: 'Type', sortable: true, width: '150px' },
            { key: 'updated_at', label: 'Updated', sortable: true, width: '150px' }
        ];

        const loadVariations = () => {
            // Mock data - replace with actual API call
            variations.value = [
                { id: 2, name: 'Color 1', type: 'Color', updated_at: '2024-10-20T10:00:00' },
                { id: 3, name: 'Color 2', type: 'Image', updated_at: '2024-10-19T15:30:00' },
                { id: 1, name: 'Size', type: 'Text', updated_at: '2024-10-18T08:45:00' }
            ];
        };

        const handleDelete = (selectedIds) => {
            if (confirm(`Are you sure you want to delete ${selectedIds.length} variation(s)?`)) {
                variations.value = variations.value.filter(
                    v => !selectedIds.includes(v.id)
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
            loadVariations();
        });

        return {
            variations,
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

