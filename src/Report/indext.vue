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
                            <div class="table-responsive">
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
                                                {{ row[column.key] }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
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
                                        <option value="coupons_report">Coupon Report</option>
                                        <option value="customers_order_report">Customer Order Report</option>
                                        <option value="products_purchase_report">Product Purchase Report</option>
                                        <option value="products_stock_report">Product Stock Report</option>
                                        <option value="products_view_report">Product View Report</option>
                                        <option value="branded_products_report">Branded Products Report</option>
                                        <option value="categorized_products_report">Categorized Products Report</option>
                                        <option value="sales_report">Sales Report</option>
                                        <option value="search_report">Search Report</option>
                                        <option value="shipping_report">Shipping Report</option>
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
                                        <option value="canceled">Canceled</option>
                                        <option value="completed">Completed</option>
                                        <option value="on_hold">On Hold</option>
                                        <option value="pending">Pending</option>
                                        <option value="pending_payment">Pending Payment</option>
                                        <option value="processing">Processing</option>
                                        <option value="refunded">Refunded</option>
                                    </select>
                                </div>

                                <!-- Group By -->
                                <div class="form-group" v-if="showGroupBy">
                                    <label for="group">Group By</label>
                                    <select v-model="filters.group" id="group" class="form-control">
                                        <option value="">Please Select</option>
                                        <option value="days">Days</option>
                                        <option value="weeks">Weeks</option>
                                        <option value="months">Months</option>
                                        <option value="years">Years</option>
                                    </select>
                                </div>

                                <!-- Coupon Code (only for coupon report) -->
                                <div class="form-group" v-if="filters.type === 'coupons_report'">
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

export default {
    name: 'ReportIndex',
    components: {
        PageBreadcrumb
    },
    setup() {
        const filters = ref({
            type: 'coupons_report',
            from: '',
            to: '',
            status: '',
            group: '',
            couponCode: ''
        });

        const reportData = ref([
            {
                date: 'November 3, 2025 - November 3, 2025',
                name: 'Anniversary Occasion',
                code: 'HAPPY2020',
                orders: '1',
                total: '$20.00'
            },
            {
                date: 'May 16, 2020 - August 26, 2025',
                name: 'Percentage Discount',
                code: '10%',
                orders: '7',
                total: '$936.31'
            }
        ]);

        // Report type configurations
        const reportConfigs = {
            coupons_report: {
                title: 'Coupon Report',
                columns: [
                    { key: 'date', label: 'Date' },
                    { key: 'name', label: 'Coupon Name' },
                    { key: 'code', label: 'Coupon Code' },
                    { key: 'orders', label: 'Orders' },
                    { key: 'total', label: 'Total' }
                ]
            },
            customers_order_report: {
                title: 'Customer Order Report',
                columns: [
                    { key: 'customer', label: 'Customer' },
                    { key: 'email', label: 'Email' },
                    { key: 'orders', label: 'Orders' },
                    { key: 'total', label: 'Total' }
                ]
            },
            products_purchase_report: {
                title: 'Product Purchase Report',
                columns: [
                    { key: 'product', label: 'Product' },
                    { key: 'sku', label: 'SKU' },
                    { key: 'quantity', label: 'Quantity' },
                    { key: 'total', label: 'Total' }
                ]
            },
            products_stock_report: {
                title: 'Product Stock Report',
                columns: [
                    { key: 'product', label: 'Product' },
                    { key: 'sku', label: 'SKU' },
                    { key: 'stock', label: 'Stock' },
                    { key: 'status', label: 'Status' }
                ]
            },
            products_view_report: {
                title: 'Product View Report',
                columns: [
                    { key: 'product', label: 'Product' },
                    { key: 'views', label: 'Views' },
                    { key: 'date', label: 'Date' }
                ]
            },
            branded_products_report: {
                title: 'Branded Products Report',
                columns: [
                    { key: 'brand', label: 'Brand' },
                    { key: 'products', label: 'Products' },
                    { key: 'quantity', label: 'Quantity' },
                    { key: 'total', label: 'Total' }
                ]
            },
            categorized_products_report: {
                title: 'Categorized Products Report',
                columns: [
                    { key: 'category', label: 'Category' },
                    { key: 'products', label: 'Products' },
                    { key: 'quantity', label: 'Quantity' },
                    { key: 'total', label: 'Total' }
                ]
            },
            sales_report: {
                title: 'Sales Report',
                columns: [
                    { key: 'date', label: 'Date' },
                    { key: 'orders', label: 'Orders' },
                    { key: 'subtotal', label: 'Subtotal' },
                    { key: 'discount', label: 'Discount' },
                    { key: 'tax', label: 'Tax' },
                    { key: 'total', label: 'Total' }
                ]
            },
            search_report: {
                title: 'Search Report',
                columns: [
                    { key: 'keyword', label: 'Keyword' },
                    { key: 'results', label: 'Results' },
                    { key: 'searches', label: 'Searches' }
                ]
            },
            shipping_report: {
                title: 'Shipping Report',
                columns: [
                    { key: 'method', label: 'Shipping Method' },
                    { key: 'orders', label: 'Orders' },
                    { key: 'total', label: 'Total' }
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
            return ['customers_order_report', 'sales_report', 'coupons_report'].includes(filters.value.type);
        });

        const showGroupBy = computed(() => {
            return ['sales_report', 'products_purchase_report'].includes(filters.value.type);
        });

        const onReportTypeChange = () => {
            // Clear data when changing report type
            reportData.value = [];
        };

        const handleFilter = () => {
            // In a real application, this would call an API
            console.log('Filtering with:', filters.value);
            
            // For demo purposes, keep the sample data for coupon report
            if (filters.value.type === 'coupons_report') {
                reportData.value = [
                    {
                        date: 'November 3, 2025 - November 3, 2025',
                        name: 'Anniversary Occasion',
                        code: 'HAPPY2020',
                        orders: '1',
                        total: '$20.00'
                    },
                    {
                        date: 'May 16, 2020 - August 26, 2025',
                        name: 'Percentage Discount',
                        code: '10%',
                        orders: '7',
                        total: '$936.31'
                    }
                ];
            } else {
                reportData.value = [];
            }
        };

        const clearFilters = () => {
            filters.value = {
                type: 'coupons_report',
                from: '',
                to: '',
                status: '',
                group: '',
                couponCode: ''
            };
            reportData.value = [];
        };

        return {
            filters,
            reportData,
            currentReportTitle,
            currentColumns,
            showOrderStatus,
            showGroupBy,
            onReportTypeChange,
            handleFilter,
            clearFilters
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
