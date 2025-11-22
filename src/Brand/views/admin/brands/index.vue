<template>
    <DataTable
        title="Brands"
        :data="brands"
        :columns="columns"
        :create-route="{ name: 'admin.brands.create' }"
        create-button-text="Create Brand"
        @delete="handleDelete"
    >
        <!-- Custom cell for Logo column with image -->
        <template #cell-logo="{ value }">
            <div v-if="value" class="logo-container">
                <img 
                    :src="value" 
                    :alt="'Brand logo'" 
                    class="brand-logo"
                />
            </div>
            <span v-else class="no-image">No image</span>
        </template>

        <!-- Custom cell for Name column with link -->
        <template #cell-name="{ row, value }">
            <router-link 
                :to="{ name: 'admin.brands.edit', params: { id: row.id } }"
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
    name: 'BrandPage',
    components: {
        DataTable
    },
    setup() {
        const brands = ref([]);
        
        const columns = [
            { key: 'id', label: 'ID', sortable: true, width: '80px' },
            { key: 'logo', label: 'Logo', sortable: false, width: '100px' },
            { key: 'name', label: 'Name', sortable: true },
            { key: 'updated_at', label: 'Updated', sortable: true, width: '150px' }
        ];

        const loadBrands = () => {
            // Mock data - replace with actual API call
            brands.value = [
                { id: 1, name: 'Nike', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/200px-Logo_NIKE.svg.png', updated_at: '2024-10-20T10:00:00' },
                { id: 2, name: 'Adidas', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/200px-Adidas_Logo.svg.png', updated_at: '2024-10-19T15:30:00' },
                { id: 3, name: 'Puma', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/da/Puma_complete_logo.svg/200px-Puma_complete_logo.svg.png', updated_at: '2024-10-18T08:45:00' }
            ];
        };

        const handleDelete = (selectedIds) => {
            if (confirm(`Are you sure you want to delete ${selectedIds.length} brand(s)?`)) {
                brands.value = brands.value.filter(
                    b => !selectedIds.includes(b.id)
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
            loadBrands();
        });

        return {
            brands,
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

.logo-container {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #fff;
    padding: 8px;
}

.brand-logo {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    display: block;
}

.no-image {
    color: #999;
    font-style: italic;
    font-size: 12px;
}
</style>

