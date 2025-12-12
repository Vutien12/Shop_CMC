<template>
    <DataTable
        title="Blogs"
        :breadcrumbs="[
            { label: 'Blogs' }
        ]"
        :data="blogs"
        :columns="columns"
        :create-route="{ name: 'admin.blogs.create' }"
        create-button-text="Create Blog"
        :row-clickable="true"
        @delete="handleDelete"
        @row-click="handleRowClick"
    >
        <!-- Custom cell for Featured Image column -->
        <template #cell-thumbnail="{ value }">
            <div class="featured-image-cell">
                <img
                    v-if="value"
                    :src="value"
                    alt="Featured"
                    class="featured-thumbnail"
                />
                <span v-else class="no-image">No Image</span>
            </div>
        </template>

        <!-- Custom cell for Title column -->
        <template #cell-title="{ value }">
            <span class="title-text">{{ value }}</span>
        </template>

        <!-- Custom cell for Publish Status column with badge -->
        <template #cell-isPublished="{ value }">
            <span :class="['status-badge', value ? 'status-published' : 'status-draft']">
                {{ value ? 'Published' : 'Draft' }}
            </span>
        </template>

        <!-- Custom cell for Created column with formatted date -->
        <template #cell-createdAt="{ value }">
            {{ formatDate(value) }}
        </template>
    </DataTable>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DataTable from '@/Admin/view/components/DataTable.vue';
import { searchBlogs, deleteManyBlogs } from '@/api/blogApi.js';

export default {
    name: 'BlogIndex',
    components: {
        DataTable
    },
    setup() {
        const router = useRouter();
        const blogs = ref([]);
        const loading = ref(false);

        const columns = [
            { key: 'id', label: 'ID', sortable: true, width: '60px' },
            { key: 'thumbnail', label: 'Featured Image', sortable: false, width: '120px' },
            { key: 'title', label: 'Title', sortable: true },
            { key: 'author', label: 'Author', sortable: true, width: '150px' },
            { key: 'isPublished', label: 'Status', sortable: true, width: '140px' },
            { key: 'createdAt', label: 'Created', sortable: true, width: '150px' }
        ];

        const loadBlogs = async () => {
            loading.value = true;
            try {
                const response = await searchBlogs({
                    page: 0,
                    size: 100,
                    sortBy: 'createdAt',
                    direction: 'DESC'
                });

                // Map API response to table format
                const result = response.data.result;
                blogs.value = (result.content || result).map(blog => ({
                    id: blog.id,
                    thumbnail: blog.thumbnail,
                    title: blog.title,
                    author: blog.authorName || 'Unknown',
                    isPublished: blog.isPublished,
                    createdAt: blog.createdAt
                }));
            } catch (error) {
                console.error('Error loading blogs:', error);
                alert('Error loading blogs: ' + (error.response?.data?.message || error.message));
            } finally {
                loading.value = false;
            }
        };

        const handleRowClick = (row) => {
            router.push({ name: 'admin.blogs.edit', params: { id: row.id } });
        };

        const handleDelete = async (selectedIds) => {
            if (!confirm(`Are you sure you want to delete ${selectedIds.length} blog(s)?`)) {
                return;
            }

            loading.value = true;
            try {
                await deleteManyBlogs(selectedIds);
                alert('Blogs deleted successfully!');
                // Reload the list
                await loadBlogs();
            } catch (error) {
                console.error('Error deleting blogs:', error);
                alert('Error deleting blogs: ' + (error.response?.data?.message || error.message));
            } finally {
                loading.value = false;
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
            loadBlogs();
        });

        return {
            blogs,
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
.featured-image-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60px;
}

.featured-thumbnail {
    width: 80px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid #e5e7eb;
}

.no-image {
    display: inline-block;
    padding: 8px 12px;
    background: #f3f4f6;
    color: #9ca3af;
    border-radius: 4px;
    font-size: 12px;
}

.title-text {
    font-weight: 500;
    color: #111827;
}

.status-badge {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 500;
    display: inline-block;
    white-space: nowrap;
    text-align: center;
    min-width: fit-content;
}

.status-published {
    background: #d1fae5;
    color: #065f46;
}

.status-draft {
    background: #fee2e2;
    color: #991b1b;
}

.status-scheduled {
    background: #dbeafe;
    color: #1e40af;
}

.status-pending {
    background: #fed7aa;
    color: #c2410c;
}
</style>
