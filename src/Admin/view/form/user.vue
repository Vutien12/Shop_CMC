<template>
    <DataTable
        title="Users"
        :data="users"
        :columns="columns"
        :row-clickable="true"
        @delete="handleDelete"
        @row-click="handleRowClick"
    >
        <!-- Custom cell for Name column -->
        <template #cell-name="{ value }">
            <span class="name-text">{{ value }}</span>
        </template>

        <!-- Custom cell for Role column with badge -->
        <template #cell-role="{ value }">
            <span :class="['role-badge', `role-${value?.toLowerCase()}`]">
                {{ value || 'N/A' }}
            </span>
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
import DataTable from '@/Admin/view/components/DataTable.vue';
import { getUsers, deleteUser, deleteManyUsers } from '@/api/userApi';

export default {
    name: 'UserPage',
    components: {
        DataTable
    },
    setup() {
        const router = useRouter();
        const users = ref([]);
        const loading = ref(false);

        const columns = [
            { key: 'id', label: 'ID', sortable: true, width: '80px' },
            { key: 'name', label: 'Name', sortable: true },
            { key: 'email', label: 'Email', sortable: true },
            { key: 'role', label: 'Role', sortable: true, width: '120px' },
            { key: 'updated_at', label: 'Updated', sortable: true, width: '150px' }
        ];

        const loadUsers = async () => {
            try {
                loading.value = true;
                console.log('Token:', localStorage.getItem('accessToken'));
                console.log('Loading users...');

                const response = await getUsers();
                console.log('Users response:', response);

                if (response.code === 200) {
                    // Map API response to component format
                    users.value = response.result.map(user => ({
                        id: user.id,
                        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A',
                        email: user.email,
                        role: user.role || 'USER',
                        updated_at: user.defaultAddress?.updatedAt || user.createdAt || null
                    }));
                    console.log('Mapped users:', users.value);
                }
            } catch (error) {
                console.error('Failed to load users:', error);
                console.error('Error response:', error.response);
                alert('Failed to load users. Please try again.');
            } finally {
                loading.value = false;
            }
        };

        const handleRowClick = (row) => {
            router.push({ name: 'admin.users.edit', params: { id: row.id } });
        };

        const handleDelete = async (selectedIds) => {
            if (confirm(`Are you sure you want to delete ${selectedIds.length} user(s)?`)) {
                try {
                    loading.value = true;

                    if (selectedIds.length === 1) {
                        await deleteUser(selectedIds[0]);
                    } else {
                        await deleteManyUsers(selectedIds);
                    }

                    // Reload users after deletion
                    await loadUsers();
                    alert('User(s) deleted successfully!');
                } catch (error) {
                    console.error('Failed to delete users:', error);
                    alert('Failed to delete users. Please try again.');
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
            loadUsers();
        });

        return {
            users,
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

.role-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    text-transform: capitalize;
}

.role-admin {
    background-color: #fee2e2;
    color: #991b1b;
}

.role-user {
    background-color: #dbeafe;
    color: #1e40af;
}

.role-moderator {
    background-color: #fef3c7;
    color: #92400e;
}

.role-guest {
    background-color: #f3f4f6;
    color: #374151;
}
</style>

