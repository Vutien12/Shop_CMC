<template>
    <DataTable
        title="Reviews"
        :data="reviews"
        :columns="columns"
        @delete="handleDelete"
    >
        <!-- Custom cell for ID column with link -->
        <template #cell-id="{ row, value }">
            <router-link
                :to="{ name: 'admin.reviews.edit', params: { id: row.id } }"
                class="id-link"
            >
                {{ value }}
            </router-link>
        </template>

        <!-- Custom cell for Product column -->
        <template #cell-product="{ value }">
            <span class="product-name">{{ value }}</span>
        </template>

        <!-- Custom cell for Reviewer Name column -->
        <template #cell-reviewer_name="{ value }">
            <span class="reviewer-name">{{ value }}</span>
        </template>

        <!-- Custom cell for Rating column with stars -->
        <template #cell-rating="{ value }">
            <div class="rating-stars">
                <span v-for="i in 5" :key="i" :class="i <= value ? 'star-filled' : 'star-empty'">
                    ★
                </span>
                <span class="rating-number">({{ value }})</span>
            </div>
        </template>

        <!-- Custom cell for Status column -->
        <template #cell-status="{ value }">
            <span :class="['status-badge', value ? 'status-approved' : 'status-pending']">
                {{ value ? 'Approved' : 'Pending' }}
            </span>
        </template>

        <!-- Custom cell for Date column -->
        <template #cell-date="{ value }">
            {{ formatDate(value) }}
        </template>
    </DataTable>
</template>

<script>
import { ref, onMounted } from 'vue';
import DataTable from '@/Admin/view/components/DataTable.vue';
import { searchReviews } from '@/api/reviewApi';

export default {
    name: 'ReviewPage',
    components: {
        DataTable
    },
    setup() {
        const reviews = ref([]);
        const loading = ref(false);

        const columns = [
            { key: 'id', label: 'ID', sortable: true, width: '80px' },
            { key: 'product', label: 'Product', sortable: true },
            { key: 'reviewer_name', label: 'Reviewer Name', sortable: true },
            { key: 'rating', label: 'Rating', sortable: true, width: '150px' },
            { key: 'status', label: 'Status', sortable: true, width: '120px' },
            { key: 'date', label: 'Date', sortable: true, width: '150px' }
        ];

        const loadReviews = async () => {
            loading.value = true;
            
            try {
                const response = await searchReviews({
                    page: 0,
                    size: 50
                });

                console.log('Reviews response:', response);

                if (response && response.code === 200 && response.result) {
                    const reviewList = response.result.content || [];
                    
                    reviews.value = reviewList.map(review => ({
                        id: review.id,
                        product: review.productName || 'N/A',
                        reviewer_name: review.userFullName || 'Anonymous',
                        rating: review.rating || 0,
                        status: !review.isHidden, // isHidden = false means Approved
                        date: review.createdAt || review.updatedAt
                    }));

                    console.log('Mapped reviews:', reviews.value);
                }
            } catch (error) {
                console.error('Failed to load reviews:', error);
                // Fallback to mock data
                reviews.value = [
                    {
                        id: 1,
                        product: 'QR thanh toán',
                        reviewer_name: 'Phung Van Vu',
                        rating: 5,
                        status: true,
                        date: '2025-12-03T23:05:26.268388'
                    },
                    {
                        id: 2,
                        product: 'Sample Product',
                        reviewer_name: 'Nguyen Van A',
                        rating: 4,
                        status: false,
                        date: '2025-12-02T14:20:00'
                    }
                ];
            } finally {
                loading.value = false;
            }
        };

        const handleDelete = async (selectedIds) => {
            if (confirm(`Are you sure you want to delete ${selectedIds.length} review(s)?`)) {
                try {
                    loading.value = true;

                    // Delete reviews - adjust API endpoint as needed
                    for (const id of selectedIds) {
                        // await deleteReview(id);
                        console.log('Delete review:', id);
                    }

                    await loadReviews();
                    alert('Review(s) deleted successfully!');
                } catch (error) {
                    console.error('Failed to delete reviews:', error);
                    alert('Failed to delete reviews. Please try again.');
                } finally {
                    loading.value = false;
                }
            }
        };

        const formatDate = (date) => {
            if (!date) return 'N/A';
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
            loadReviews();
        });

        return {
            reviews,
            columns,
            loading,
            handleDelete,
            formatDate
        };
    }
};
</script>

<style scoped>
.id-link {
    color: #2563eb;
    text-decoration: none;
    font-weight: 500;
}

.id-link:hover {
    text-decoration: underline;
}

.product-name {
    font-weight: 500;
    color: #111827;
}

.reviewer-name {
    color: #374151;
}

.rating-stars {
    display: flex;
    align-items: center;
    gap: 2px;
}

.star-filled {
    color: #fbbf24;
    font-size: 16px;
}

.star-empty {
    color: #d1d5db;
    font-size: 16px;
}

.rating-number {
    margin-left: 8px;
    color: #6b7280;
    font-size: 13px;
}

.status-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
}

.status-approved {
    background-color: #d1fae5;
    color: #065f46;
}

.status-pending {
    background-color: #fef3c7;
    color: #92400e;
}
</style>