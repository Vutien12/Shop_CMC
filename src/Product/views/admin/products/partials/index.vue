<template>
    <DataTable
        title="Products"
        :breadcrumbs="[{ label: 'Products' }]"
        :data="products"
        :columns="columns"
        :create-route="{ name: 'admin.products.create' }"
        create-button-text="Create Product"
        :loading="isLoading"
        :row-clickable="true"
        :pagination="paginationData"
        :server-side="true"
        @delete="handleDelete"
        @row-click="handleRowClick"
        @page-change="handlePageChange"
        @per-page-change="handlePerPageChange"
        @sort="handleSort"
        @search="handleSearch"
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

        <!-- Custom cell for Name column -->
        <template #cell-name="{ value }">
            <span class="name-text">{{ value }}</span>
        </template>

        <!-- Custom cell for Price column - hiển thị khoảng giá nếu có nhiều variants -->
        <template #cell-price="{ row }">
            <div class="price-container">
                <span v-if="row.price === row.maxPrice || !row.maxPrice" class="current-price">
                    {{ formatPrice(row.price) }}
                </span>
                <span v-else class="price-range">
                    {{ formatPrice(row.price) }} - {{ formatPrice(row.maxPrice) }}
                </span>
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
import { useRouter } from 'vue-router';
import { useNotification } from '@/Admin/composables/useNotification.js';
import { useLoading } from '@/Admin/composables/useLoading.js';
import DataTable from '@/Admin/view/components/DataTable.vue';
import { searchProducts, deleteProduct } from '@/api/productApi';

export default {
    name: 'ProductPage',
    components: {
        DataTable
    },
    setup() {
        const router = useRouter();
        const notification = useNotification();
        const { isLoading, withLoading } = useLoading();
        const products = ref([]);

        // Pagination state
        const currentPage = ref(0); // API uses 0-based indexing
        const pageSize = ref(20);
        const totalElements = ref(0);
        const totalPages = ref(0);
        const searchQuery = ref('');
        const sortBy = ref('updatedAt');
        const sortDirection = ref('desc');

        // Pagination data for DataTable
        const paginationData = ref({
            currentPage: 1, // DataTable uses 1-based indexing
            pageSize: 20,
            totalElements: 0,
            totalPages: 0
        });

        const columns = [
            { key: 'id', label: 'ID', sortable: true, width: '60px' },
            { key: 'thumbnail', label: 'Thumbnail', sortable: false, width: '80px' },
            { key: 'name', label: 'Name', sortable: true, width: '35%' },
            { key: 'price', label: 'Price', sortable: true, width: '200px' },
            { key: 'stock', label: 'Stock', sortable: true, width: '100px' },
            { key: 'status', label: 'Status', sortable: true, width: '90px' },
            { key: 'updated_at', label: 'Updated', sortable: true, width: '120px' }
        ];

        const loadProducts = async () => {
            await withLoading(async () => {
                try {
                    // Gọi API search products với các tham số phân trang
                    const params = {
                    page: currentPage.value,
                    size: pageSize.value,
                    sortBy: sortBy.value,
                    direction: sortDirection.value.toUpperCase()
                };

                // Thêm search query nếu có
                if (searchQuery.value) {
                    params.keyword = searchQuery.value;
                }

                const response = await searchProducts(params);

                console.log('API Response:', response);
                console.log('Response.result:', response.result);

                // searchProducts đã return response.data
                // API response: { code, message, result: { content: [...], pageable: {...}, totalElements, totalPages, ... } }
                const result = response.result || {};
                const productList = result.content || [];

                // Cập nhật pagination state từ API response
                totalElements.value = result.totalElements || 0;
                totalPages.value = result.totalPages || 0;

                // Cập nhật paginationData cho DataTable (1-based indexing)
                paginationData.value = {
                    currentPage: currentPage.value + 1,
                    pageSize: pageSize.value,
                    totalElements: totalElements.value,
                    totalPages: totalPages.value
                };

                console.log('Product list:', productList);
                console.log('Pagination:', paginationData.value);

                products.value = productList.map(product => ({
                    id: product.id,
                    name: product.name,
                    thumbnail: product.thumbnail?.url || (product.gallery && product.gallery.length > 0 ? product.gallery[0].url : null),
                    price: product.minPrice || 0,
                    maxPrice: product.maxPrice || 0, // Thêm maxPrice để hiển thị khoảng
                    old_price: null, // Không dùng old_price nữa
                    stock: product.inStock,
                    status: product.isActive,
                    updated_at: product.updatedAt
                }));

                console.log('Products loaded:', products.value.length, products.value);
            } catch (error) {
                console.error('Error loading products:', error);
                products.value = [];
                totalElements.value = 0;
                totalPages.value = 0;
                paginationData.value = {
                    currentPage: 1,
                    pageSize: pageSize.value,
                    totalElements: 0,
                    totalPages: 0
                };
            }
            });
        };

        const handleRowClick = (row) => {
            router.push({ name: 'admin.products.edit', params: { id: row.id } });
        };

        const handleDelete = async (selectedIds) => {
            const confirmed = await notification.confirm(
                'Confirm Delete',
                `Are you sure you want to delete ${selectedIds.length} product(s)?`
            );

            if (!confirmed) {
                return;
            }

            try {
                // Xóa từng sản phẩm qua API
                await Promise.all(
                    selectedIds.map(id => deleteProduct(id))
                );

                console.log('Deleted products:', selectedIds);

                // Reload danh sách products
                await loadProducts();

                notification.success('Success!', 'Products deleted successfully');
            } catch (error) {
                console.error('Error deleting products:', error);
                notification.error('Error!', 'Failed to delete products: ' + (error.message || 'Unknown error'));
            }
        };

        const formatPrice = (price) => {
            // Format theo VNĐ với dấu phân cách nghìn và ký hiệu đ
            return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
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

        const handlePageChange = async (page) => {
            currentPage.value = page - 1; // Convert to 0-based indexing for API
            await loadProducts();
        };

        const handlePerPageChange = async (perPage) => {
            pageSize.value = perPage;
            currentPage.value = 0; // Reset to first page
            await loadProducts();
        };

        const handleSort = async ({ column, direction }) => {
            sortBy.value = column;
            sortDirection.value = direction;
            currentPage.value = 0; // Reset to first page
            await loadProducts();
        };

        const handleSearch = async (query) => {
            searchQuery.value = query;
            currentPage.value = 0; // Reset to first page
            await loadProducts();
        };

        onMounted(() => {
            loadProducts();
        });

        return {
            products,
            columns,
            paginationData,
            isLoading,
            handleRowClick,
            handleDelete,
            handlePageChange,
            handlePerPageChange,
            handleSort,
            handleSearch,
            formatPrice,
            formatRelativeTime
        };
    }
};
</script>

<style scoped>
.name-text {
    font-weight: 500;
    color: #111827;
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
    white-space: nowrap;
}

.price-range {
    font-weight: 600;
    color: #111827;
    font-size: 13px;
    white-space: nowrap;
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
:deep(.data-table) {
    table-layout: auto !important; /* Cho phép columns tự điều chỉnh theo width */
}

:deep(.data-table td) {
    max-width: none !important; /* Bỏ max-width: 0 của DataTable */
    white-space: normal !important; /* Cho phép wrap nếu cần */
}

/* Override cho price column để text không wrap */
:deep(.data-table td:nth-child(5)) {
    white-space: nowrap !important;
}

/* Consistent cell spacing */
:deep(.data-table th) {
    padding: 12px 16px !important;
}

:deep(.data-table td) {
    padding: 16px 16px !important;
}

/* Column specific widths - Force exact widths */
/* Thứ tự: checkbox(1), ID(2), Thumbnail(3), Name(4), Price(5), Stock(6), Status(7), Updated(8) */

:deep(.th-id),
:deep(.data-table tbody td:nth-child(2)) {
    width: 60px !important;
    min-width: 60px !important;
    max-width: 60px !important;
}

:deep(.th-thumbnail),
:deep(.data-table tbody td:nth-child(3)) {
    width: 80px !important;
    min-width: 80px !important;
    max-width: 80px !important;
}

:deep(.th-name),
:deep(.data-table tbody td:nth-child(4)) {
    width: 35% !important;
    min-width: 250px !important;
}

:deep(.th-price),
:deep(.data-table tbody td:nth-child(5)) {
    width: 220px !important;
    min-width: 220px !important;
    max-width: 220px !important;
}

:deep(.th-stock),
:deep(.data-table tbody td:nth-child(6)) {
    width: 100px !important;
    min-width: 100px !important;
    max-width: 100px !important;
}

:deep(.th-status),
:deep(.data-table tbody td:nth-child(7)) {
    width: 90px !important;
    min-width: 90px !important;
    max-width: 90px !important;
}

:deep(.th-updated_at),
:deep(.data-table tbody td:nth-child(8)) {
    width: 120px !important;
    min-width: 120px !important;
    max-width: 120px !important;
}
</style>

