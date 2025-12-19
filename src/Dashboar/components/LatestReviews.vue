<template>
    <div class="dashboard-panel">
        <div class="panel-header">
            <h5 class="panel-title">Latest Reviews</h5>
            <span class="panel-subtitle">Recent customer feedback</span>
        </div>

        <div class="reviews-list">
            <div v-if="reviews.length === 0" class="empty-state">
                <div class="empty-icon">💬</div>
                <div class="empty-title">No reviews yet</div>
                <div class="empty-text">Customer reviews will appear here</div>
            </div>

            <div v-else class="reviews-table">
                <div
                    v-for="(review, index) in reviews"
                    :key="review.id || index"
                    class="review-row"
                >
                    <div class="review-user">
                        <div class="user-avatar">
                            {{ getInitials(review.userFullName) }}
                        </div>
                        <div class="user-info">
                            <div class="user-name">{{ review.userFullName || '—' }}</div>
                            <div class="review-date">{{ formatDate(review.createdAt) }}</div>
                        </div>
                    </div>

                    <div class="review-content">
                        <div class="review-product" :title="review.productName">
                            {{ review.productName || '—' }}
                        </div>
                        <div class="review-rating">
                            <div class="stars">
                                <span
                                    v-for="star in 5"
                                    :key="star"
                                    class="star"
                                    :class="{ active: star <= (Number(review.rating) || 0) }"
                                >
                                    ★
                                </span>
                            </div>
                            <span class="rating-text">{{ review.rating || 0 }}/5</span>
                        </div>
                    </div>
                </div>
            </div>
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

const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
</script>

<style scoped>
.dashboard-panel {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
}

.panel-header {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #e5e7eb;
}

.panel-title {
    margin: 0 0 4px 0;
    font-size: 18px;
    font-weight: 600;
    color: #111827;
}

.panel-subtitle {
    font-size: 13px;
    color: #6b7280;
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: 40px 20px;
}

.empty-icon {
    font-size: 48px;
    margin-bottom: 12px;
}

.empty-title {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 4px;
}

.empty-text {
    font-size: 14px;
    color: #6b7280;
}

/* Reviews Table */
.reviews-table {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.review-row {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    background: #f9fafb;
    border-radius: 8px;
    border: 1px solid #f3f4f6;
}

.review-row:hover {
    background: #f3f4f6;
}

/* User Section */
.review-user {
    display: flex;
    align-items: center;
    gap: 12px;
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #0068e1;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    flex-shrink: 0;
}

.user-info {
    flex: 1;
    min-width: 0;
}

.user-name {
    font-size: 14px;
    font-weight: 600;
    color: #111827;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.review-date {
    font-size: 12px;
    color: #6b7280;
}

/* Content Section */
.review-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.review-product {
    font-size: 13px;
    color: #374151;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: 1.4;
}

.review-rating {
    display: flex;
    align-items: center;
    gap: 8px;
}

.stars {
    display: flex;
    gap: 2px;
}

.star {
    color: #e5e7eb;
    font-size: 16px;
    line-height: 1;
}

.star.active {
    color: #fbbf24;
}

.rating-text {
    font-size: 13px;
    font-weight: 600;
    color: #6b7280;
}

/* Responsive */
@media (max-width: 768px) {
    .review-row {
        padding: 12px;
    }

    .user-avatar {
        width: 36px;
        height: 36px;
        font-size: 13px;
    }

    .user-name {
        font-size: 13px;
    }

    .review-product {
        font-size: 12px;
    }

    .star {
        font-size: 14px;
    }
}
</style>
