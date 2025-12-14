<template>
    <DataTable
        title="Brands"
        :breadcrumbs="[
            { label: 'Brands' }
        ]"
        :data="brands"
        :columns="columns"
        :create-route="{ name: 'admin.brands.create' }"
        create-button-text="Create Brand"
        :row-clickable="true"
        @delete="handleDelete"
        @row-click="handleRowClick"
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
import DataTable from '@/Admin/view/components/DataTable.vue';
import { getBrands, deleteBrand, deleteManyBrands } from '@/api/brandApi';

export default {
    name: 'BrandPage',
    components: {
        DataTable
    },
    setup() {
        const router = useRouter();
        const notification = useNotification();
        const brands = ref([]);
        const loading = ref(false);

        const columns = [
            { key: 'id', label: 'ID', sortable: true, width: '80px' },
            { key: 'logo', label: 'Logo', sortable: false, width: '100px' },
            { key: 'name', label: 'Name', sortable: true,width: '150px' },
            { key: 'updated_at', label: 'Updated', sortable: true, width: '130px' }
        ];

        const loadBrands = async () => {
            try {
                loading.value = true;
                const response = await getBrands();

                if (response.code === 200) {
                    brands.value = response.result.map(brand => ({
                        id: brand.id,
                        name: brand.name,
                        logo: brand.fileLogo?.url || null,
                        updated_at: brand.createdAt,
                        isActive: brand.isActive
                    }));
                }
            } catch (error) {
                console.error('Failed to load brands:', error);
                notification.error('Error!', 'Failed to load brands');
            } finally {
                loading.value = false;
            }
        };

        const handleRowClick = (row) => {
            router.push({ name: 'admin.brands.edit', params: { id: row.id } });
        };

        const handleDelete = async (selectedIds) => {
            const confirmed = await notification.confirm(
                'Confirm Delete',
                `Are you sure you want to delete ${selectedIds.length} brand(s)?`
            );

            if (confirmed) {
                try {
                    loading.value = true;

                    if (selectedIds.length === 1) {
                        await deleteBrand(selectedIds[0]);
                    } else {
                        await deleteManyBrands(selectedIds);
                    }

                    // Reload brands after deletion
                    await loadBrands();
                    notification.success('Success!', 'Brands deleted successfully');
                } catch (error) {
                    console.error('Failed to delete brands:', error);
                    notification.error('Error!', 'Failed to delete brands');
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
            loadBrands();
        });

        return {
            brands,
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
.name-text {
    font-weight: 500;
    color: #111827;
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

