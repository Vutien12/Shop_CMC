<template>
    <DataTable
        title="Products"
        :data="products"
        :columns="columns"
        :create-route="{ name: 'admin.products.create' }"
        create-button-text="Create Product"
        @delete="handleDelete"
    >
        <!-- Custom cell for Thumbnail column -->
        <template #cell-thumbnail="{ value }">
            <div v-if="value" class="thumbnail-container">
                <img 
                    :src="value" 
                    :alt="'Product thumbnail'" 
                    class="product-thumbnail"
                />
            </div>
            <span v-else class="no-image">No image</span>
        </template>

        <!-- Custom cell for Name column with link -->
        <template #cell-name="{ row, value }">
            <router-link 
                :to="{ name: 'admin.products.edit', params: { id: row.id } }"
                class="name-link"
            >
                {{ value }}
            </router-link>
        </template>

        <!-- Custom cell for Price column with old price strikethrough -->
        <template #cell-price="{ row }">
            <div class="price-container">
                <span class="current-price">{{ formatPrice(row.price) }}</span>
                <span v-if="row.old_price" class="old-price">{{ formatPrice(row.old_price) }}</span>
            </div>
        </template>

        <!-- Custom cell for Stock column with colored text -->
        <template #cell-stock="{ value }">
            <span :class="value ? 'stock-in' : 'stock-out'">
                {{ value ? 'In Stock' : 'Out of Stock' }}
            </span>
        </template>

        <!-- Custom cell for Status column with colored text -->
        <template #cell-status="{ value }">
            <span :class="value ? 'status-active' : 'status-inactive'">
                {{ value ? 'Active' : 'Inactive' }}
            </span>
        </template>

        <!-- Custom cell for Updated column with relative time -->
        <template #cell-updated_at="{ value }">
            {{ formatRelativeTime(value) }}
        </template>
    </DataTable>
</template>

<script>
import { ref, onMounted } from 'vue';
import DataTable from '@/Admin/view/components/DataTable.vue';

export default {
    name: 'ProductPage',
    components: {
        DataTable
    },
    setup() {
        const products = ref([]);
        
        const columns = [
            { key: 'id', label: 'ID', sortable: true, width: '50px' },
            { key: 'thumbnail', label: 'Thumbnail', sortable: false, width: '80px' },
            { key: 'name', label: 'Name', sortable: true },
            { key: 'price', label: 'Price', sortable: true, width: '100px' },
            { key: 'stock', label: 'Stock', sortable: true, width: '85px' },
            { key: 'status', label: 'Status', sortable: true, width: '75px' },
            { key: 'updated_at', label: 'Updated', sortable: true, width: '100px' }
        ];

        const loadProducts = () => {
            // Mock data - replace with actual API call
            products.value = [
                { 
                    id: 44, 
                    name: 'LG gram Laptop - 13.3" Full HD Display, Intel 8th Gen Core i5, 8GB RAM, 256GB SSD', 
                    thumbnail: 'https://m.media-amazon.com/images/I/71VvXGBHEeL._AC_SX466_.jpg',
                    price: 2135.54,
                    old_price: 2426.75,
                    stock: true,
                    status: true,
                    updated_at: '2025-10-26T10:00:00'
                },
                { 
                    id: 100, 
                    name: 'Europe size Summer Short Sleeve Solid Polo Shirt', 
                    thumbnail: 'https://ae01.alicdn.com/kf/H0e3bb15e91f140f7b31dea975bd11444z.jpg',
                    price: 8.35,
                    old_price: null,
                    stock: true,
                    status: true,
                    updated_at: '2025-10-25T15:30:00'
                },
                { 
                    id: 105, 
                    name: 'WILLIAMPOLO Fashion Men Leather Belts Solid Buckle', 
                    thumbnail: 'https://ae01.alicdn.com/kf/HTB1qY9QaZfrK1RjSspbq6A4pFXa0.jpg',
                    price: 19.00,
                    old_price: 21.35,
                    stock: true,
                    status: true,
                    updated_at: '2025-10-21T08:45:00'
                }
            ];
        };

        const handleDelete = (selectedIds) => {
            if (confirm(`Are you sure you want to delete ${selectedIds.length} product(s)?`)) {
                products.value = products.value.filter(
                    p => !selectedIds.includes(p.id)
                );
            }
        };

        const formatPrice = (price) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(price);
        };

        const formatRelativeTime = (date) => {
            const d = new Date(date);
            const now = new Date();
            const diffMs = now - d;
            const diffDays = Math.floor(diffMs / 86400000);

            if (diffDays === 0) return 'Today';
            if (diffDays === 1) return '1 day ago';
            if (diffDays < 30) return `${diffDays} days ago`;
            
            const diffMonths = Math.floor(diffDays / 30);
            if (diffMonths === 1) return '1 month ago';
            if (diffMonths < 12) return `${diffMonths} months ago`;
            
            const diffYears = Math.floor(diffDays / 365);
            if (diffYears === 1) return '1 year ago';
            return `${diffYears} years ago`;
        };

        onMounted(() => {
            loadProducts();
        });

        return {
            products,
            columns,
            handleDelete,
            formatPrice,
            formatRelativeTime
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

.thumbnail-container {
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    background: #fff;
    padding: 3px;
}

.product-thumbnail {
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

.price-container {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.current-price {
    font-weight: 600;
    color: #111827;
    font-size: 13px;
}

.old-price {
    font-size: 11px;
    color: #9ca3af;
    text-decoration: line-through;
}

.stock-in {
    color: #3b82f6;
    font-size: 12px;
}

.stock-out {
    color: #ef4444;
    font-size: 12px;
}

.status-active {
    color: #10b981;
    font-size: 12px;
}

.status-inactive {
    color: #6b7280;
    font-size: 12px;
}

/* Override DataTable defaults */
:deep(.data-table th:not(.th-checkbox)),
:deep(.data-table td:not(:first-child)) {
    min-width: unset !important;
}

/* Consistent cell spacing */
:deep(.data-table th) {
    padding: 12px 16px !important;
}

:deep(.data-table td) {
    padding: 16px 16px !important;
}

/* Column specific widths */
:deep(.th-id) {
    width: 60px !important;
}

:deep(.th-thumbnail) {
    width: 90px !important;
}

:deep(.th-name) {
    width: auto !important;
    min-width: 30px !important;
}

:deep(.th-price) {
    width: 120px !important;
}

:deep(.th-stock) {
    width: 100px !important;
}

:deep(.th-status) {
    width: 90px !important;
}

:deep(.th-updated_at) {
    width: 110px !important;
}
</style>

