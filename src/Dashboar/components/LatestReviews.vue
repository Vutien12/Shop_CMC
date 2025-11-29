<template>
    <div class="dashboard-panel">
        <div class="grid-header">
            <h5>Latest Reviews</h5>
        </div>

        <div class="clearfix"></div>

        <div class="table-responsive anchor-table latest-reviews">
            <table class="table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Customer</th>
                        <th>Rating</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="reviews.length === 0">
                        <td class="empty" colspan="3">
                            <div class="empty-inner">
                                <div class="empty-icon">💬</div>
                                <div>
                                    <div class="empty-title">No reviews yet</div>
                                    <div class="empty-sub">Customers haven't reviewed any product yet.</div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-for="(review, index) in reviews" :key="review.id || index">
                        <td>{{ review.productName ?? review.product ?? '—' }}</td>
                        <td>{{ review.userFullName ?? review.customer ?? '—' }}</td>
                        <td>
                            <div class="rating">
                                <span
                                    v-for="star in 5"
                                    :key="star"
                                    class="star"
                                    :class="{ active: star <= (Number(review.rating) || 0) }"
                                >
                                    ★
                                </span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
defineProps({
    reviews: {
        type: Array,
        default: () => []
    }
});
</script>

<style scoped>
.dashboard-panel {
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
}

.grid-header {
    margin-bottom: 20px;
    border-bottom: 1px solid #e8e8e8;
    padding-bottom: 15px;
}

.grid-header h5 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
}

.table-responsive {
    overflow-x: auto;
}

.table {
    width: 100%;
    margin-bottom: 0;
}

.table thead th {
    background: #f8f9fa;
    color: #333;
    font-weight: 600;
    font-size: 14px;
    padding: 12px 15px;
    border-bottom: 2px solid #e8e8e8;
}

.table tbody td {
    padding: 12px 15px;
    border-bottom: 1px solid #e8e8e8;
    vertical-align: middle;
}

.table tbody tr:hover {
    background: #f8f9fa;
}

.rating {
    display: flex;
    gap: 2px;
}

.star {
    color: #ddd;
    font-size: 18px;
}

.star.active {
    color: #ffc107;
}

.empty {
    text-align: center;
    color: #888;
    padding: 30px !important;
}

.empty-inner {
    display:flex;
    align-items:center;
    gap:12px;
    justify-content:center;
    padding:18px;
}

.empty-icon {
    font-size:28px;
}

.empty-title {
    font-weight:700;
    margin-bottom:4px
}

.empty-sub {
    color:#666
}
</style>
