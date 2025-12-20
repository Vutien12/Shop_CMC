
<template>
    <DataTable
        title="Refund"
        :breadcrumbs="[{ label: 'Refund' }]"
        :data="cancellations"
        :columns="columns"
        :loading="isLoading"
        :row-clickable="true"
        @delete="handleDelete"
        @row-click="handleRowClick"
    >
        <!-- Filters next to search box -->
        <template #filters>
            <div class="filter-group">
                <select class="filter-select" v-model="filterType">
                    <option value="">Request Type</option>
                    <option value="CANCEL">Cancel</option>
                    <option value="REFUND">Refund</option>
                    <option value="EXCHANGE">Exchange</option>
                    <option value="REQUEST_INFO">Request Info</option>
                </select>
            </div>

            <div class="filter-group">
                <select class="filter-select" v-model="filterStatus">
                    <option value="">Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="REQUESTING_INFO">Requesting Info</option>
                    <option value="USER_RESPONDED">User Responded</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="RETURNING">Returning</option>
                    <option value="RETURNED">Returned</option>
                    <option value="REFUNDED">Refunded</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CLOSED">Closed</option>
                </select>
            </div>
        </template>

        <!-- Custom cell for Order ID -->
        <template #cell-orderId="{ value }">
            <span class="order-code">{{ value }}</span>
        </template>

        <!-- Custom cell for User Name -->
        <template #cell-userName="{ value }">
            <span class="user-name">{{ value }}</span>
        </template>

        <!-- Custom cell for User Email -->
        <template #cell-userEmail="{ value }">
            <span class="user-email">{{ value }}</span>
        </template>

        <!-- Custom cell for Type column -->
        <template #cell-type="{ value }">
            <span class="type-badge" :class="getTypeClass(value)">
                {{ getTypeLabel(value) }}
            </span>
        </template>

        <!-- Custom cell for Status column -->
        <template #cell-status="{ value }">
            <span class="status-badge" :class="getStatusClass(value)">
                {{ getStatusLabel(value) }}
            </span>
        </template>

        <!-- Custom cell for Refund Amount -->
        <template #cell-refundAmount="{ value }">
            <span class="refund-amount">{{ formatCurrency(value) }}</span>
        </template>

        <!-- Custom cell for Created column -->
        <template #cell-createdAt="{ value }">
            {{ formatDate(value) }}
        </template>
    </DataTable>


</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useLoading } from '@/Admin/composables/useLoading.js';
import DataTable from '@/Admin/view/components/DataTable.vue';
import {
    searchOrderCases,
    batchDeleteOrderCases
} from '@/api/orderCaseApi.js';

export default {
    name: 'CancellationsReturnsPage',
    components: {
        DataTable
    },
    setup() {
        const router = useRouter();
        const { isLoading, withLoading } = useLoading();
        const cancellations = ref([]);
        const filterType = ref('');
        const filterStatus = ref('');
        const searchQuery = ref('');
        const currentPage = ref(0);
        const pageSize = ref(10);
        const totalElements = ref(0);

        const columns = [
            { key: 'id', label: 'ID', sortable: true, width: '80px' },
            { key: 'orderId', label: 'Order ID', sortable: true, width: '100px' },
            { key: 'userName', label: 'User', sortable: true, width: '150px' },
            { key: 'userEmail', label: 'Email', sortable: true, width: '200px' },
            { key: 'type', label: 'Type', sortable: true, width: '150px' },
            { key: 'status', label: 'Status', sortable: true, width: '140px' },
            { key: 'refundAmount', label: 'Refund Amount', sortable: true, width: '140px' },
            { key: 'createdAt', label: 'Created', sortable: true, width: '150px' }
        ];

        const loadCancellations = async () => {
            await withLoading(async () => {
                try {
                    // Always use searchOrderCases for consistency
                    const searchParams = {
                        page: currentPage.value,
                        size: pageSize.value,
                        sort: 'createdAt,desc'
                    };

                    if (filterType.value) searchParams.type = filterType.value;
                    if (filterStatus.value) searchParams.status = filterStatus.value;
                    if (searchQuery.value) searchParams.search = searchQuery.value;

                    const response = await searchOrderCases(searchParams);
                    console.log('Search order cases response:', response);

                    // Support both code 200 and 1000
                    if (response.code === 1000 || response.code === 200) {
                        // Handle paginated response
                        if (response.result.content) {
                            cancellations.value = response.result.content;
                            totalElements.value = response.result.totalElements || 0;
                        } else if (Array.isArray(response.result)) {
                            // Handle array response
                            cancellations.value = response.result;
                            totalElements.value = response.result.length;
                        } else {
                            cancellations.value = [];
                            totalElements.value = 0;
                        }
                        console.log('Loaded cases:', cancellations.value);
                    }
                } catch (error) {
                    console.error('Error loading order cases:', error);
                    alert('Failed to load order cases. Please try again.');
                }
            });
        };

        // Watch for filter changes
        watch([filterType, filterStatus, searchQuery], () => {
            currentPage.value = 0;
            loadCancellations();
        });

        const handleRowClick = (row) => {
            // Navigate to detail page instead of showing modal
            router.push(`/admin/refund/${row.id}`);
        };

        const handleDelete = async (selectedIds) => {
            if (!confirm(`Are you sure you want to delete ${selectedIds.length} item(s)?`)) {
                return;
            }

            try {
                await batchDeleteOrderCases(selectedIds);
                await loadCancellations();
                alert('Item(s) deleted successfully!');
            } catch (error) {
                console.error('Error deleting items:', error);
                alert('Error deleting item(s). Please try again.');
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

        const formatCurrency = (amount) => {
            if (!amount || amount === 0) return '-';
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(amount);
        };

        const getTypeLabel = (type) => {
            const labels = {
                'CANCEL': 'Cancel',
                'REFUND': 'Refund',
                'EXCHANGE': 'Exchange',
                'REQUEST_INFO': 'Request Info'
            };
            return labels[type] || type;
        };

        const getTypeClass = (type) => {
            const classes = {
                'CANCEL': 'type-cancel',
                'REFUND': 'type-refund',
                'EXCHANGE': 'type-exchange',
                'REQUEST_INFO': 'type-info'
            };
            return classes[type] || '';
        };

        const getStatusLabel = (status) => {
            const labels = {
                'PENDING': 'Pending',
                'REQUESTING_INFO': 'Requesting Info',
                'USER_RESPONDED': 'User Responded',
                'APPROVED': 'Approved',
                'REJECTED': 'Rejected',
                'RETURNING': 'Returning',
                'RETURNED': 'Returned',
                'REFUNDED': 'Refunded',
                'COMPLETED': 'Completed',
                'CLOSED': 'Closed'
            };
            return labels[status] || status;
        };

        const getStatusClass = (status) => {
            const classes = {
                'PENDING': 'status-pending',
                'REQUESTING_INFO': 'status-info',
                'USER_RESPONDED': 'status-responded',
                'APPROVED': 'status-approved',
                'REJECTED': 'status-rejected',
                'RETURNING': 'status-returning',
                'RETURNED': 'status-returned',
                'REFUNDED': 'status-refunded',
                'COMPLETED': 'status-completed',
                'CLOSED': 'status-closed'
            };
            return classes[status] || '';
        };

        onMounted(() => {
            loadCancellations();
        });

        return {
            cancellations,
            columns,
            filterType,
            filterStatus,
            searchQuery,
            isLoading,
            handleRowClick,
            handleDelete,
            formatDate,
            formatCurrency,
            getTypeLabel,
            getTypeClass,
            getStatusLabel,
            getStatusClass
        };
    }
};
</script>

<style scoped>
.filter-group {
    margin-right: 10px;
}

.filter-select {
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    color: #374151;
    background-color: #fff;
    min-width: 200px;
    cursor: pointer;
    transition: all 0.2s;
}

.filter-select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.order-code {
    color: #111827;
}

.user-name {
    color: #374151;
}

.user-email {
    color: #6b7280;
    font-size: 13px;
}

.refund-amount {
    color: #059669;
    font-weight: 600;
}

.type-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
}

.type-cancel {
    background-color: #fee2e2;
    color: #991b1b;
}

.type-return {
    background-color: #dbeafe;
    color: #1e40af;
}

.type-refund {
    background-color: #d1fae5;
    color: #065f46;
}

.type-exchange {
    background-color: #fef3c7;
    color: #92400e;
}

.type-complaint {
    background-color: #fce7f3;
    color: #9f1239;
}

.type-info {
    background-color: #e0e7ff;
    color: #3730a3;
}

.status-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
}

.status-pending {
    background-color: #fef3c7;
    color: #92400e;
}

.status-info {
    background-color: #e0e7ff;
    color: #3730a3;
}

.status-responded {
    background-color: #dbeafe;
    color: #1e40af;
}

.status-approved {
    background-color: #d1fae5;
    color: #065f46;
}

.status-rejected {
    background-color: #fee2e2;
    color: #991b1b;
}

.status-returning {
    background-color: #fef3c7;
    color: #92400e;
}

.status-returned {
    background-color: #dbeafe;
    color: #1e40af;
}

.status-refunded {
    background-color: #d1fae5;
    color: #065f46;
}

.status-completed {
    background-color: #d1fae5;
    color: #065f46;
}

.status-closed {
    background-color: #f3f4f6;
    color: #6b7280;
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-dialog {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    max-width: 700px;
    width: 90%;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #e5e7eb;
    flex-shrink: 0;
}

.modal-header h5 {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
    margin: 0;
}

.btn-close {
    background: none;
    border: none;
    font-size: 24px;
    line-height: 1;
    color: #6b7280;
    cursor: pointer;
    padding: 0;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
}

.btn-close:hover {
    color: #111827;
}

.modal-body {
    padding: 0;
    overflow-y: auto;
    flex: 1;
}

.modal-body::-webkit-scrollbar {
    width: 8px;
}

.modal-body::-webkit-scrollbar-track {
    background: transparent;
}

.modal-body::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
}

.info-section {
    padding: 24px;
    border-bottom: 1px solid #f3f4f6;
}

.info-section:last-child {
    border-bottom: none;
}

.info-section h6 {
    font-size: 13px;
    font-weight: 600;
    color: #111827;
    margin: 0 0 20px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 20px;
}

.info-grid:last-child {
    margin-bottom: 0;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.info-item label {
    font-size: 11px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 2px;
}

.info-value {
    font-size: 14px;
    color: #111827;
    font-weight: 500;
    padding: 8px 12px;
    background: #f9fafb;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
    min-height: 38px;
    display: flex;
    align-items: center;
}

.info-item > .type-badge,
.info-item > .status-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 38px;
    padding: 8px 16px;
    width: 100%;
}

.info-text {
    font-size: 14px;
    color: #374151;
    line-height: 1.6;
    background: #f9fafb;
    padding: 12px;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
    min-height: 80px;
}

.form-input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    color: #111827;
    font-family: inherit;
    transition: border-color 0.2s;
}

.form-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input::placeholder {
    color: #9ca3af;
}

.form-input:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
    opacity: 0.6;
}

.form-textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    color: #111827;
    line-height: 1.6;
    resize: vertical;
    font-family: inherit;
    transition: border-color 0.2s;
    min-height: 80px;
}

.form-textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea::placeholder {
    color: #9ca3af;
}

.form-textarea:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
    opacity: 0.6;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #374151;
    cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
}

.checkbox-label input[type="checkbox"]:disabled {
    cursor: not-allowed;
    opacity: 0.6;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 24px;
    border-top: 1px solid #e5e7eb;
    flex-shrink: 0;
}

.modal-footer .btn {
    padding: 10px 20px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
}

.modal-footer .btn-secondary {
    background-color: #f3f4f6;
    color: #374151;
}

.modal-footer .btn-secondary:hover:not(:disabled) {
    background-color: #e5e7eb;
}

.modal-footer .btn-success {
    background-color: #059669;
    color: #fff;
}

.modal-footer .btn-success:hover:not(:disabled) {
    background-color: #047857;
}

.modal-footer .btn-danger {
    background-color: #dc2626;
    color: #fff;
}

.modal-footer .btn-danger:hover:not(:disabled) {
    background-color: #b91c1c;
}

.modal-footer .btn-info {
    background-color: #0ea5e9;
    color: #fff;
}

.modal-footer .btn-info:hover:not(:disabled) {
    background-color: #0284c7;
}

.modal-footer .btn-primary {
    background-color: #3b82f6;
    color: #fff;
}

.modal-footer .btn-primary:hover:not(:disabled) {
    background-color: #2563eb;
}

.modal-footer .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Responsive Styles */
@media (max-width: 1024px) {
    .modal-dialog {
        max-width: 85%;
        max-height: 90vh;
    }

    .info-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
    }
}

@media (max-width: 768px) {
    .modal-dialog {
        max-width: 95%;
        width: 95%;
        max-height: 95vh;
    }

    .modal-header {
        padding: 16px 20px;
    }

    .modal-header h5 {
        font-size: 16px;
    }

    .modal-body {
        padding: 0;
    }

    .info-section {
        padding: 20px;
    }

    .info-section h6 {
        font-size: 12px;
        margin-bottom: 16px;
    }

    .info-grid {
        grid-template-columns: 1fr;
        gap: 16px;
        margin-bottom: 16px;
    }

    .info-item {
        gap: 6px;
    }

    .info-item label {
        font-size: 10px;
    }

    .info-value,
    .info-item > .type-badge,
    .info-item > .status-badge {
        min-height: 36px;
        padding: 6px 10px;
        font-size: 13px;
    }

    .info-text {
        font-size: 13px;
        padding: 10px;
        min-height: 70px;
    }

    .form-textarea {
        font-size: 13px;
        padding: 10px;
        min-height: 70px;
    }

    .modal-footer {
        padding: 12px 20px;
        gap: 8px;
        flex-wrap: wrap;
    }

    .modal-footer .btn {
        padding: 8px 16px;
        font-size: 13px;
        flex: 1;
        min-width: 80px;
    }

    .filter-select {
        min-width: 150px;
        font-size: 13px;
        padding: 6px 10px;
    }
}

@media (max-width: 480px) {
    .modal-dialog {
        max-width: 100%;
        width: 100%;
        max-height: 100vh;
        border-radius: 0;
    }

    .modal-header {
        padding: 12px 16px;
    }

    .modal-header h5 {
        font-size: 15px;
    }

    .btn-close {
        font-size: 20px;
        width: 24px;
        height: 24px;
    }

    .info-section {
        padding: 16px;
    }

    .info-section h6 {
        font-size: 11px;
        margin-bottom: 12px;
    }

    .info-grid {
        gap: 12px;
        margin-bottom: 12px;
    }

    .info-value,
    .info-item > .type-badge,
    .info-item > .status-badge {
        min-height: 34px;
        padding: 6px 8px;
        font-size: 12px;
    }

    .info-text {
        font-size: 12px;
        padding: 8px;
        min-height: 60px;
    }

    .form-textarea {
        font-size: 12px;
        padding: 8px;
        min-height: 60px;
    }

    .checkbox-label {
        font-size: 13px;
    }

    .checkbox-label input[type="checkbox"] {
        width: 14px;
        height: 14px;
    }

    .modal-footer {
        padding: 10px 16px;
        gap: 6px;
    }

    .modal-footer .btn {
        padding: 8px 12px;
        font-size: 12px;
    }

    .filter-group {
        margin-right: 6px;
        margin-bottom: 8px;
    }

    .filter-select {
        min-width: 120px;
        font-size: 12px;
        padding: 6px 8px;
    }
}

/* Landscape orientation for tablets */
@media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
    .modal-dialog {
        max-width: 80%;
        max-height: 90vh;
    }

    .info-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}
</style>

