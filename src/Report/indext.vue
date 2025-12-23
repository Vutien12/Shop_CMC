<template>
    <div class="report-page">
        <PageBreadcrumb
            title="Reports"
            :breadcrumbs="[
                { label: 'Reports' }
            ]"
        />

        <div class="report-wrapper">
            <div class="row">
                <!-- Report Results - Left Column -->
                <div class="col-lg-9 col-md-8">
                    <div class="report-result box box-shadow">
                        <div class="box-header">
                            <h5>{{ currentReportTitle }}</h5>
                        </div>

                        <div class="box-body">
                            <div v-if="loading" class="text-center" style="padding: 40px;">
                                <i class="fa fa-spinner fa-spin fa-2x"></i>
                                <p style="margin-top: 10px;">Đang tải dữ liệu...</p>
                            </div>

                            <div v-else class="table-responsive">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th v-for="column in currentColumns" :key="column.key">
                                                {{ column.label }}
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr v-if="reportData.length === 0">
                                            <td :colspan="currentColumns.length" class="text-center text-muted">
                                                No data available. Please select filters and click "Filter" button.
                                            </td>
                                        </tr>
                                        <tr v-for="(row, index) in reportData" :key="index">
                                            <td v-for="column in currentColumns" :key="column.key">
                                                {{ formatValue(row[column.key], column.key) }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <!-- Pagination -->
                                <div v-if="pagination.totalPages > 1" class="pagination-wrapper">
                                    <div class="pagination-info">
                                        Showing {{ reportData.length }} of {{ pagination.totalElements }} results
                                    </div>
                                    <div class="pagination-controls">
                                        <button
                                            class="btn btn-default btn-sm"
                                            @click="goToPreviousPage"
                                            :disabled="pagination.currentPage === 1"
                                        >
                                            <i class="fa fa-chevron-left"></i> Previous
                                        </button>
                                        <span class="page-info">Page {{ pagination.currentPage }} of {{ pagination.totalPages }}</span>
                                        <button
                                            class="btn btn-default btn-sm"
                                            @click="goToNextPage"
                                            :disabled="pagination.currentPage >= pagination.totalPages"
                                        >
                                            Next <i class="fa fa-chevron-right"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Filter Sidebar - Right Column -->
                <div class="col-lg-3 col-md-4">
                    <div class="filter-report box box-shadow">
                        <div class="box-header">
                            <h5>Filter</h5>
                        </div>

                        <div class="box-body">
                            <form @submit.prevent="handleFilter">
                                <!-- Report Type -->
                                <div class="form-group">
                                    <label for="report-type">Report Type</label>
                                    <select
                                        v-model="filters.type"
                                        id="report-type"
                                        class="form-control"
                                        @change="onReportTypeChange"
                                    >
                                        <option value="COUPON">Coupon Report</option>
                                        <option value="PRODUCTS_PURCHASE">Product Purchase Report</option>
                                        <option value="PRODUCTS_STOCK">Product Stock Report</option>
                                        <option value="BRANDED_PRODUCTS">Branded Products Report</option>
                                        <option value="CATEGORIZED_PRODUCTS">Categorized Products Report</option>
                                        <option value="SALES">Sales Report</option>
                                    </select>
                                </div>

                                <!-- Start Date -->
                                <div class="form-group">
                                    <label for="from">Start Date</label>
                                    <input
                                        v-model="filters.from"
                                        type="date"
                                        class="form-control"
                                        id="from"
                                    />
                                </div>

                                <!-- End Date -->
                                <div class="form-group">
                                    <label for="to">End Date</label>
                                    <input
                                        v-model="filters.to"
                                        type="date"
                                        class="form-control"
                                        id="to"
                                    />
                                </div>

                                <!-- Order Status -->
                                <div class="form-group" v-if="showOrderStatus">
                                    <label for="status">Order Status</label>
                                    <select v-model="filters.status" id="status" class="form-control">
                                        <option value="">Please Select</option>
                                        <option value="CANCELED">Canceled</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="ON_HOLD">On Hold</option>
                                        <option value="PENDING">Pending</option>
                                        <option value="PENDING_PAYMENT">Pending Payment</option>
                                        <option value="PROCESSING">Processing</option>
                                        <option value="REFUNDED">Refunded</option>
                                    </select>
                                </div>

                                <!-- Group By -->
                                <div class="form-group" v-if="showGroupBy">
                                    <label for="group">Group By</label>
                                    <select v-model="filters.group" id="group" class="form-control">
                                        <option value="">Please Select</option>
                                        <option value="DAYS">Days</option>
                                        <option value="WEEKS">Weeks</option>
                                        <option value="MONTHS">Months</option>
                                        <option value="YEARS">Years</option>
                                    </select>
                                </div>

                                <!-- Coupon Code (only for coupon report) -->
                                <div class="form-group" v-if="filters.type === 'COUPON'">
                                    <label for="coupon-code">Coupon Code</label>
                                    <input
                                        v-model="filters.couponCode"
                                        type="text"
                                        class="form-control"
                                        id="coupon-code"
                                    />
                                </div>

                                <!-- Filter Button -->
                                <button type="submit" class="btn btn-primary btn-filter">
                                    <i class="fa fa-filter"></i> Filter
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed } from 'vue';
import PageBreadcrumb from '@/Admin/view/components/PageBreadcrumb.vue';
import { getReports } from '@/api/reportApi.js';
import { useNotification } from '@/Admin/composables/useNotification.js';
import { useLoading } from '@/Admin/composables/useLoading.js';

export default {
    name: 'ReportIndex',
    components: {
        PageBreadcrumb
    },
    setup() {
        const notification = useNotification();
        const { isLoading: loading, withLoading } = useLoading();

        const filters = ref({
            type: 'COUPON',
            from: '',
            to: '',
            status: '',
            group: 'DAYS',
            couponCode: '',
            productName: '',
            sku: '',
            brand: '',
            category: '',
            quantityAbove: null,
            quantityBelow: null,
            stockAvailability: ''
        });

        const reportData = ref([]);
        const pagination = ref({
            currentPage: 1,
            pageSize: 10,
            totalPages: 0,
            totalElements: 0
        });

        // Report type configurations - matching backend DTOs
        const reportConfigs = {
            COUPON: {
                title: 'Coupon Report',
                columns: [
                    { key: 'period', label: 'Period' },
                    { key: 'couponCode', label: 'Coupon Code' },
                    { key: 'orders', label: 'Orders' },
                    { key: 'totalDiscount', label: 'Total Discount' },
                    { key: 'totalOrder', label: 'Total Order' }
                ]
            },
            PRODUCTS_PURCHASE: {
                title: 'Product Purchase Report',
                columns: [
                    { key: 'period', label: 'Period' },
                    { key: 'productName', label: 'Product' },
                    { key: 'sku', label: 'SKU' },
                    { key: 'qty', label: 'Quantity' },
                    { key: 'total', label: 'Total' }
                ]
            },
            PRODUCTS_STOCK: {
                title: 'Product Stock Report',
                columns: [
                    { key: 'productName', label: 'Product' },
                    { key: 'qty', label: 'Quantity' },
                    { key: 'stockAvailability', label: 'Status' }
                ]
            },
            BRANDED_PRODUCTS: {
                title: 'Branded Products Report',
                columns: [
                    { key: 'brandName', label: 'Brand' },
                    { key: 'productsCount', label: 'Products Count' }
                ]
            },
            CATEGORIZED_PRODUCTS: {
                title: 'Categorized Products Report',
                columns: [
                    { key: 'categoryName', label: 'Category' },
                    { key: 'productsCount', label: 'Products Count' }
                ]
            },
            SALES: {
                title: 'Sales Report',
                columns: [
                    { key: 'period', label: 'Period' },
                    { key: 'orders', label: 'Orders' },
                    { key: 'products', label: 'Products' },
                    { key: 'subtotal', label: 'Subtotal' },
                    { key: 'shipping', label: 'Shipping' },
                    { key: 'discountTotal', label: 'Discount' }
                ]
            }
        };

        const currentReportTitle = computed(() => {
            return reportConfigs[filters.value.type]?.title || 'Report';
        });

        const currentColumns = computed(() => {
            return reportConfigs[filters.value.type]?.columns || [];
        });

        const showOrderStatus = computed(() => {
            return ['SALES', 'COUPON'].includes(filters.value.type);
        });

        const showGroupBy = computed(() => {
            return ['SALES', 'PRODUCTS_PURCHASE', 'COUPON'].includes(filters.value.type);
        });

        const onReportTypeChange = () => {
            // Clear data when changing report type
            reportData.value = [];
        };

        const fetchReportData = async () => {
            await withLoading(async () => {
                try {
                    // Build API params
                    const params = {
                        reportType: filters.value.type,
                        page: pagination.value.currentPage - 1,
                        size: pagination.value.pageSize
                    };

                // Add date filters
                if (filters.value.from) {
                    params.fromCreatedAt = new Date(filters.value.from).toISOString();
                }
                if (filters.value.to) {
                    params.toCreatedAt = new Date(filters.value.to).toISOString();
                }

                // Add conditional filters based on report type
                if (filters.value.type === 'COUPON' && filters.value.couponCode) {
                    params.couponCode = filters.value.couponCode;
                }

                if (['PRODUCTS_PURCHASE', 'PRODUCTS_STOCK'].includes(filters.value.type)) {
                    if (filters.value.productName) params.productName = filters.value.productName;
                    if (filters.value.sku) params.sku = filters.value.sku;
                }

                if (filters.value.type === 'PRODUCTS_STOCK') {
                    if (filters.value.quantityAbove) params.quantityAbove = filters.value.quantityAbove;
                    if (filters.value.quantityBelow) params.quantityBelow = filters.value.quantityBelow;
                    if (filters.value.stockAvailability) params.stockAvailability = filters.value.stockAvailability;
                }

                if (filters.value.type === 'BRANDED_PRODUCTS' && filters.value.brand) {
                    params.brand = filters.value.brand;
                }

                if (filters.value.type === 'CATEGORIZED_PRODUCTS' && filters.value.category) {
                    params.category = filters.value.category;
                }

                // Add order status
                if (filters.value.status) {
                    params.status = filters.value.status.toUpperCase();
                }

                // Add group by
                if (filters.value.group) {
                    params.groupBy = filters.value.group.toUpperCase();
                }

                console.log('Fetching report with params:', params);

                const response = await getReports(params);
                console.log('Report response:', response);

                if (response && response.data) {
                    const apiResponse = response.data;

                    if (apiResponse.code === 200 && apiResponse.result) {
                        reportData.value = apiResponse.result.content || [];
                        pagination.value.totalPages = apiResponse.result.totalPages || 0;
                        pagination.value.totalElements = apiResponse.result.totalElements || 0;

                        // Don't show notification for empty data, just display the empty state
                    } else {
                        notification.error('Lỗi!', 'Không thể tải dữ liệu báo cáo');
                        reportData.value = [];
                    }
                } else {
                    notification.error('Lỗi!', 'Phản hồi không hợp lệ từ server');
                    reportData.value = [];
                }
                } catch (error) {
                console.error('Error fetching report:', error);
                notification.error('Lỗi!', 'Không thể tải báo cáo: ' + (error.message || 'Lỗi không xác định'));
                reportData.value = [];
            }
            });
        };

        const handleFilter = () => {
            pagination.value.currentPage = 1;
            fetchReportData();
        };

        const goToNextPage = () => {
            if (pagination.value.currentPage < pagination.value.totalPages) {
                pagination.value.currentPage++;
                fetchReportData();
            }
        };

        const goToPreviousPage = () => {
            if (pagination.value.currentPage > 1) {
                pagination.value.currentPage--;
                fetchReportData();
            }
        };

        const clearFilters = () => {
            filters.value = {
                type: 'COUPON',
                from: '',
                to: '',
                status: '',
                group: 'DAYS',
                couponCode: '',
                productName: '',
                sku: '',
                brand: '',
                category: '',
                quantityAbove: null,
                quantityBelow: null,
                stockAvailability: ''
            };
            reportData.value = [];
        };

        const formatValue = (value, key) => {
            // Format currency values
            if (['total', 'totalDiscount', 'totalOrder', 'subtotal', 'shipping', 'discountTotal'].includes(key)) {
                if (value === null || value === undefined) return '-';
                return new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                }).format(value);
            }

            // Format numbers
            if (['orders', 'qty', 'productsCount', 'products'].includes(key)) {
                return value || 0;
            }

            return value || '-';
        };

        return {
            loading,
            filters,
            reportData,
            pagination,
            currentReportTitle,
            currentColumns,
            showOrderStatus,
            showGroupBy,
            onReportTypeChange,
            handleFilter,
            goToNextPage,
            goToPreviousPage,
            clearFilters,
            formatValue
        };
    }
};
</script>

<style scoped>
.report-page {
    padding: 20px;
}

.report-wrapper {
    margin-top: 20px;
}

.report-wrapper .row {
    margin-left: -10px;
    margin-right: -10px;
}

.report-wrapper .row > [class*='col-'] {
    padding-left: 10px;
    padding-right: 10px;
}

/* Box Styling */
.box {
    background: white;
    border-radius: 8px;
    margin-bottom: 20px;
    border: 1px solid #e2e8f0;
}

.box-shadow {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.box-header {
    padding: 16px 20px;
    border-bottom: 2px solid #f0f4f8;
    background: linear-gradient(to bottom, #fafbfc, #ffffff);
    border-radius: 8px 8px 0 0;
}

.box-header h5 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #2d3748;
}

.filter-report .box-header h5 {
    padding-left: 10px;
    padding-top: 10px;
}

.box-body {
    padding: 20px;
}

/* Filter Report Specific Styling */
.filter-report {
    position: sticky;
    top: 20px;
}

.filter-report .box-body {
    padding: 24px;
}

.filter-report form {
    display: flex;
    flex-direction: column;
}

/* Table Styling */
.table-responsive {
    overflow-x: auto;
}

.table {
    width: 100%;
    margin-bottom: 0;
}

.table thead th {
    background: #f8f9fa;
    border-bottom: 2px solid #dee2e6;
    padding: 12px 16px;
    font-weight: 600;
    color: #495057;
    font-size: 13px;
    letter-spacing: 0.5px;
}

.table tbody td {
    padding: 12px 16px;
    border-bottom: 1px solid #e9ecef;
    color: #495057;
    font-size: 14px;
}

.table tbody tr:hover {
    background: #f8f9fa;
}

.table tbody tr:last-child td {
    border-bottom: none;
}

.text-center {
    text-align: center;
}

.text-muted {
    color: #6c757d;
    font-style: italic;
}

/* Form Styling */
.form-group {
    margin-bottom: 18px;
}

.form-group:last-of-type {
    margin-bottom: 18px;
}

.form-group label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 6px;
}

.form-control {
    width: 100%;
    padding: 9px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 13px;
    transition: all 0.2s ease;
    background: #ffffff;
    line-height: 1.5;
}

.form-control:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

select.form-control {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
    background-position: right 10px center;
    background-repeat: no-repeat;
    background-size: 1.2em 1.2em;
    padding-right: 2.2rem;
}

/* Button Styling */
.btn {
    padding: 9px 16px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

.btn-block {
    width: 100%;
    display: flex;
}

.btn-primary {
    color: white;
    background: #8b93a2;
}

.btn-primary:hover {
    background: #687e96;
}

.btn-default {
    background: #ffffff;
    color: #333;
    border: 1px solid #ddd;
}

.btn-default:hover {
    background: #f8f9fa;
    border-color: #adb5bd;
}

.btn-filter {
    width: auto;
    min-width: 80px;
    align-self: flex-start;
}

.mt-2 {
    margin-top: 8px;
}

/* Pagination */
.pagination-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #e9ecef;
}

.pagination-info {
    color: #6c757d;
    font-size: 13px;
}

.pagination-controls {
    display: flex;
    align-items: center;
    gap: 12px;
}

.pagination-controls .btn-sm {
    padding: 6px 12px;
    font-size: 12px;
}

.pagination-controls .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.page-info {
    color: #495057;
    font-size: 13px;
    font-weight: 500;
}

/* Responsive */
@media (max-width: 992px) {
    .col-lg-9,
    .col-lg-3 {
        flex: 0 0 100%;
        max-width: 100%;
    }

    .filter-report {
        margin-top: 20px;
    }
}

@media (max-width: 768px) {
    .report-page {
        padding: 15px;
    }

    .box-header {
        padding: 15px 20px;
    }

    .box-body {
        padding: 20px;
    }

    .table thead th,
    .table tbody td {
        padding: 10px 12px;
        font-size: 13px;
    }
}
</style>
