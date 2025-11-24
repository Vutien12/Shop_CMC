<template>
    <DataTable
        title="Blogs"
        :data="blogs"
        :columns="columns"
        :create-route="{ name: 'admin.blogs.create' }"
        create-button-text="Create Blog"
        @delete="handleDelete"
    >
        <!-- Custom cell for Featured Image column -->
        <template #cell-featured_image="{ value }">
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

        <!-- Custom cell for Title column with link -->
        <template #cell-title="{ row, value }">
            <router-link 
                :to="{ name: 'admin.blogs.edit', params: { id: row.id } }"
                class="title-link"
            >
                {{ value }}
            </router-link>
        </template>

        <!-- Custom cell for Publish Status column with badge -->
        <template #cell-publish_status="{ value }">
            <span :class="['status-badge', `status-${value.toLowerCase()}`]">
                {{ value }}
            </span>
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
    name: 'BlogIndex',
    components: {
        DataTable
    },
    setup() {
        const blogs = ref([]);
        
        const columns = [
            { key: 'id', label: 'ID', sortable: true, width: '60px' },
            { key: 'featured_image', label: 'Featured Image', sortable: false, width: '120px' },
            { key: 'title', label: 'Title', sortable: true },
            { key: 'user', label: 'User', sortable: true, width: '150px' },
            { key: 'publish_status', label: 'Publish Status', sortable: true, width: '140px' },
            { key: 'created_at', label: 'Created', sortable: true, width: '150px' }
        ];

        const loadBlogs = () => {
            // Mock data - replace with actual API call
            blogs.value = [
                { 
                    id: 1, 
                    featured_image: 'https://via.placeholder.com/80x60',
                    title: 'Getting Started with Vue.js',
                    user: 'Admin User',
                    publish_status: 'Published',
                    created_at: '2024-11-20T08:00:00'
                },
                { 
                    id: 2, 
                    featured_image: 'https://via.placeholder.com/80x60',
                    title: 'Advanced JavaScript Techniques',
                    user: 'John Doe',
                    publish_status: 'Draft',
                    created_at: '2024-11-18T14:30:00'
                },
                { 
                    id: 3, 
                    featured_image: null,
                    title: 'CSS Grid Layout Guide',
                    user: 'Jane Smith',
                    publish_status: 'Published',
                    created_at: '2024-11-15T10:00:00'
                },
                { 
                    id: 4, 
                    featured_image: 'https://via.placeholder.com/80x60',
                    title: 'Web Performance Optimization',
                    user: 'Admin User',
                    publish_status: 'Scheduled',
                    created_at: '2024-11-10T16:45:00'
                }
            ];
        };

        const handleDelete = (selectedIds) => {
            if (confirm(`Are you sure you want to delete ${selectedIds.length} blog(s)?`)) {
                blogs.value = blogs.value.filter(
                    blog => !selectedIds.includes(blog.id)
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
            loadBlogs();
        });

        return {
            blogs,
            columns,
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

.title-link {
    color: #2563eb;
    text-decoration: none;
    font-weight: 500;
}

.title-link:hover {
    text-decoration: underline;
    color: #1e40af;
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
