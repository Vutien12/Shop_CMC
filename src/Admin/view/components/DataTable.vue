<template>
    <div class="data-table-page">
        <!-- Header -->
        <PageBreadcrumb
            :title="title"
            :breadcrumbs="breadcrumbs"
            :home-route="homeRoute"
        />

        <!-- Action Bar -->
        <div class="action-bar" v-if="createRoute">
            <!-- Use programmatic navigation as a reliable fallback for router-link -->
            <a href="#" class="btn-create" @click.prevent="goToCreate">
                {{ createButtonText }}
            </a>
        </div>

        <!-- Content Box -->
        <div class="content-box">
            <!-- Header Actions Slot (for filters, etc.) -->
            <div v-if="$slots['header-actions']" class="header-actions-container">
                <slot name="header-actions"></slot>
            </div>

            <!-- Table Controls -->
            <div class="table-controls">
                <div class="controls-left">
                    <span class="show-label">Show</span>
                    <select v-model="localPerPage" @change="handlePerPageChange" class="per-page-select">
                        <option :value="10">10</option>
                        <option :value="20">20</option>
                        <option :value="50">50</option>
                        <option :value="100">100</option>
                    </select>
                    <span class="entries-label">entries</span>

                    <button
                        v-if="showDeleteButton"
                        class="btn-delete"
                        :disabled="localSelectedIds.length === 0"
                        @click="handleDelete"
                    >
                        <i class="fa fa-trash"></i> Delete
                    </button>
                </div>

                <div class="controls-right">
                    <!-- Custom filters slot -->
                    <div v-if="$slots['filters']" class="filters-slot">
                        <slot name="filters"></slot>
                    </div>

                    <div class="search-box">
                        <i class="fa fa-search search-icon"></i>
                        <input
                            type="text"
                            v-model="localSearchQuery"
                            @input="handleSearch"
                            placeholder="Search here..."
                            class="search-input"
                        >
                    </div>
                </div>
            </div>

            <!-- Table -->
            <div class="table-wrapper" style="position: relative;">
                <!-- Loading Overlay -->
                <LoadingDots v-if="loading" :isLoading="true" message="Loading data..." />
                <table class="data-table">
                    <thead>
                        <tr>
                            <th class="th-checkbox" v-if="selectable" @click.stop>
                                <input
                                    type="checkbox"
                                    id="select-all"
                                    :checked="allSelected"
                                    @change="toggleSelectAll"
                                    class="checkbox-input"
                                >
                            </th>
                            <th
                                v-for="column in columns"
                                :key="column.key"
                                :class="[`th-${column.key}`, { sortable: column.sortable }]"
                                :style="column.width ? `width: ${column.width}` : ''"
                                @click="column.sortable ? handleSort(column.key) : null"
                            >
                                <div class="th-content">
                                    <span>{{ column.label }}</span>
                                    <i
                                        v-if="column.sortable"
                                        class="fa"
                                        :class="getSortIcon(column.key)"
                                    ></i>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in paginatedData"
                            :key="row[rowKey]"
                            :class="['table-row', { 'clickable-row': rowClickable }]"
                            @click="handleRowClick(row)"
                        >
                            <td v-if="selectable" @click.stop>
                                <input
                                    type="checkbox"
                                    :value="row[rowKey]"
                                    v-model="localSelectedIds"
                                    class="checkbox-input"
                                >
                            </td>
                            <td
                                v-for="column in columns"
                                :key="column.key"
                            >
                                <slot
                                    :name="`cell-${column.key}`"
                                    :row="row"
                                    :value="row[column.key]"
                                >
                                    {{ formatCellValue(row, column) }}
                                </slot>
                            </td>
                        </tr>
                        <tr v-if="paginatedData.length === 0">
                            <td :colspan="columns.length + (selectable ? 1 : 0)" class="no-data">
                                {{ noDataText }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="table-footer">
                <div class="footer-left">
                    <span class="showing-info">
                        Showing {{ showingStart }} to {{ showingEnd }} of {{ filteredTotal }} entries
                    </span>
                </div>
                <div class="footer-right">
                    <div class="pagination">
                        <button
                            class="page-btn"
                            :disabled="currentPage === 1"
                            @click="changePage(1)"
                        >
                            <i class="fa fa-angle-double-left"></i>
                        </button>
                        <button
                            class="page-btn"
                            :disabled="currentPage === 1"
                            @click="changePage(currentPage - 1)"
                        >
                            <i class="fa fa-angle-left"></i>
                        </button>

                        <button
                            v-for="page in visiblePages"
                            :key="page"
                            class="page-btn"
                            :class="{ active: page === currentPage }"
                            @click="changePage(page)"
                        >
                            {{ page }}
                        </button>

                        <button
                            class="page-btn"
                            :disabled="currentPage === totalPages"
                            @click="changePage(currentPage + 1)"
                        >
                            <i class="fa fa-angle-right"></i>
                        </button>
                        <button
                            class="page-btn"
                            :disabled="currentPage === totalPages"
                            @click="changePage(totalPages)"
                        >
                            <i class="fa fa-angle-double-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import PageBreadcrumb from './PageBreadcrumb.vue';
import LoadingDots from '@/Admin/components/LoadingDots.vue';

export default {
    name: 'DataTable',
    components: {
        PageBreadcrumb,
        LoadingDots
    },
    props: {
        title: {
            type: String,
            required: true
        },
        breadcrumbs: {
            type: Array,
            default: () => []
            // Format: [{ label: 'Products', route: { name: 'admin.products.index' } }]
        },
        homeRoute: {
            type: [String, Object],
            default: () => ({ name: 'admin.dashboard' })
        },
        data: {
            type: Array,
            required: true
        },
        columns: {
            type: Array,
            required: true
            // Format: [{ key: 'id', label: 'ID', sortable: true, width: '80px', format: (val) => val }]
        },
        rowKey: {
            type: String,
            default: 'id'
        },
        selectable: {
            type: Boolean,
            default: true
        },
        showDeleteButton: {
            type: Boolean,
            default: true
        },
        createRoute: {
            type: [Object, String],
            default: null
        },
        createButtonText: {
            type: String,
            default: 'Create New'
        },
        noDataText: {
            type: String,
            default: 'No data available in table'
        },
        rowClickable: {
            type: Boolean,
            default: false
        },
        defaultSortBy: {
            type: String,
            default: 'id'
        },
        defaultSortDirection: {
            type: String,
            default: 'asc'
        },
        perPage: {
            type: Number,
            default: 20
        },
        serverSide: {
            type: Boolean,
            default: false
        },
        pagination: {
            type: Object,
            default: null
            // Format: { currentPage: 1, pageSize: 20, totalElements: 100, totalPages: 5 }
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    emits: ['delete', 'sort', 'search', 'page-change', 'per-page-change', 'row-click'],
    setup(props, { emit }) {
        const localSelectedIds = ref([]);
        const localSearchQuery = ref('');
        const localSortBy = ref(props.defaultSortBy);
        const localSortDirection = ref(props.defaultSortDirection);
        const localCurrentPage = ref(1);
        const localPerPage = ref(props.perPage);

        const filteredData = computed(() => {
            // In server-side mode, don't filter or sort locally
            if (props.serverSide) {
                return props.data;
            }

            let result = [...props.data];

            // Search filter
            if (localSearchQuery.value) {
                const query = localSearchQuery.value.toLowerCase();
                result = result.filter(row => {
                    return props.columns.some(col => {
                        const value = row[col.key];
                        return value && value.toString().toLowerCase().includes(query);
                    });
                });
            }

            // Sort
            result.sort((a, b) => {
                let aVal = a[localSortBy.value];
                let bVal = b[localSortBy.value];

                // Handle dates
                if (aVal instanceof Date || typeof aVal === 'string' && aVal.match(/^\d{4}-\d{2}-\d{2}/)) {
                    aVal = new Date(aVal);
                    bVal = new Date(bVal);
                }

                if (localSortDirection.value === 'asc') {
                    return aVal > bVal ? 1 : -1;
                } else {
                    return aVal < bVal ? 1 : -1;
                }
            });

            return result;
        });

        const paginatedData = computed(() => {
            // In server-side mode, data is already paginated from the server
            if (props.serverSide) {
                return props.data;
            }

            const start = (localCurrentPage.value - 1) * localPerPage.value;
            const end = start + localPerPage.value;
            return filteredData.value.slice(start, end);
        });

        const totalPages = computed(() => {
            // Use server-side pagination data if available
            if (props.serverSide && props.pagination) {
                return props.pagination.totalPages || 0;
            }
            return Math.ceil(filteredData.value.length / localPerPage.value);
        });

        const filteredTotal = computed(() => {
            // Use server-side pagination data if available
            if (props.serverSide && props.pagination) {
                return props.pagination.totalElements || 0;
            }
            return filteredData.value.length;
        });

        const showingStart = computed(() => {
            if (filteredData.value.length === 0) return 0;
            // Use server-side pagination data if available
            if (props.serverSide && props.pagination) {
                return (props.pagination.currentPage - 1) * props.pagination.pageSize + 1;
            }
            return (localCurrentPage.value - 1) * localPerPage.value + 1;
        });

        const showingEnd = computed(() => {
            // Use server-side pagination data if available
            if (props.serverSide && props.pagination) {
                const end = props.pagination.currentPage * props.pagination.pageSize;
                return Math.min(end, props.pagination.totalElements);
            }
            const end = localCurrentPage.value * localPerPage.value;
            return Math.min(end, filteredData.value.length);
        });

        const currentPage = computed(() => {
            return props.serverSide && props.pagination
                ? props.pagination.currentPage
                : localCurrentPage.value;
        });

        const visiblePages = computed(() => {
            const pages = [];
            const total = totalPages.value;
            const current = props.serverSide && props.pagination
                ? props.pagination.currentPage
                : localCurrentPage.value;

            if (total <= 5) {
                for (let i = 1; i <= total; i++) {
                    pages.push(i);
                }
            } else {
                if (current <= 3) {
                    pages.push(1, 2, 3, 4);
                } else if (current >= total - 2) {
                    pages.push(total - 3, total - 2, total - 1, total);
                } else {
                    pages.push(current - 1, current, current + 1);
                }
            }

            return pages;
        });

        const allSelected = computed(() => {
            return localSelectedIds.value.length === paginatedData.value.length &&
                paginatedData.value.length > 0;
        });

        const toggleSelectAll = (event) => {
            if (event.target.checked) {
                localSelectedIds.value = paginatedData.value.map(row => row[props.rowKey]);
            } else {
                localSelectedIds.value = [];
            }
        };

        const handleSort = (column) => {
            if (localSortBy.value === column) {
                localSortDirection.value = localSortDirection.value === 'asc' ? 'desc' : 'asc';
            } else {
                localSortBy.value = column;
                localSortDirection.value = 'asc';
            }
            emit('sort', { column, direction: localSortDirection.value });
        };

        const getSortIcon = (column) => {
            if (localSortBy.value !== column) {
                return 'fa-sort';
            }
            return localSortDirection.value === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
        };

        const handleSearch = () => {
            if (!props.serverSide) {
                localCurrentPage.value = 1;
            }
            emit('search', localSearchQuery.value);
        };

        const handlePerPageChange = () => {
            localCurrentPage.value = 1;
            if (props.serverSide) {
                emit('per-page-change', localPerPage.value);
            }
        };

        const changePage = (page) => {
            if (page >= 1 && page <= totalPages.value) {
                localCurrentPage.value = page;
                emit('page-change', page);
            }
        };

        const handleDelete = () => {
            if (localSelectedIds.value.length === 0) return;
            emit('delete', localSelectedIds.value);
        };

        const handleRowClick = (row) => {
            if (props.rowClickable) {
                emit('row-click', row);
            }
        };

        const formatCellValue = (row, column) => {
            const value = row[column.key];
            if (column.format && typeof column.format === 'function') {
                return column.format(value, row);
            }
            return value;
        };

        // programmatic navigation for the create button
        const router = useRouter();
        const goToCreate = () => {
            try {
                if (!props.createRoute) return;
                router.push(props.createRoute);
            } catch (e) {
                // ignore navigation errors
            }
        };

        // Watch for external changes to selected items
        watch(() => props.data, () => {
            // Clear selected items that no longer exist
            localSelectedIds.value = localSelectedIds.value.filter(id =>
                props.data.some(row => row[props.rowKey] === id)
            );
        });

        return {
            localSelectedIds,
            localSearchQuery,
            localSortBy,
            localSortDirection,
            localCurrentPage,
            localPerPage,
            paginatedData,
            totalPages,
            filteredTotal,
            showingStart,
            showingEnd,
            visiblePages,
            currentPage,
            allSelected,
            toggleSelectAll,
            handleSort,
            getSortIcon,
            handleSearch,
            handlePerPageChange,
            changePage,
            handleDelete,
            handleRowClick,
            formatCellValue,
            goToCreate
        };
    }
};
</script>

<style scoped>
.data-table-page {
    margin:20px;
    padding:0 5px;
    min-height: 100vh;
}

/* Header */
.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.page-title {
    font-size: 24px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
}

.breadcrumb-nav {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #6b7280;
}

.breadcrumb-home {
    color: #6b7280;
    text-decoration: none;
}

.breadcrumb-home:hover {
    color: #1a1a1a;
}

.breadcrumb-separator {
    color: #d1d5db;
}

.breadcrumb-current {
    color: #1a1a1a;
}

/* Action Bar */
.action-bar {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
}

.btn-create {
    background: #2563eb;
    color: white;
    padding: 10px 20px;
    border-radius: 6px;
    border: none;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    transition: background 0.2s;
}

.btn-create:hover {
    background: #1d4ed8;
}

/* Content Box */
.content-box {
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

/* Header Actions Container */
.header-actions-container {
    padding: 20px 24px;
    border-bottom: 1px solid #e5e7eb;
}

/* Table Controls */
.table-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
}

.controls-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.show-label,
.entries-label {
    font-size: 14px;
    color: #6b7280;
}

.per-page-select {
    padding: 6px 32px 6px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    background: white;
}

.btn-delete {
    padding: 8px 16px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    background: white;
    color: #6b7280;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s;
}

.btn-delete:not(:disabled):hover {
    background: #fee;
    color: #dc2626;
    border-color: #fca5a5;
}

.btn-delete:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.controls-right {
    display: flex;
    align-items: center;
    gap: 10px;
}

.filters-slot {
    display: flex;
    align-items: center;
    gap: 10px;
}

.search-box {
    position: relative;
}

.search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    pointer-events: none;
}

.search-input {
    padding: 8px 12px 8px 36px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    width: 250px;
}

.search-input:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* Table */
.table-wrapper {
    overflow-x: visible;
    padding:20px;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
}

.data-table thead {
    background: #f9fafb;
    border-top: 1px solid #e5e7eb;
    border-bottom: 1px solid #e5e7eb;
}

.data-table th {
    padding: 12px 12px;
    text-align: left;
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    letter-spacing: 0.05em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.th-checkbox {
    width: 40px;
}

.data-table th:not(.th-checkbox),
.data-table td:not(:first-child) {
    width: auto;
}

.sortable {
    cursor: pointer;
    user-select: none;
}

.th-content {
    display: flex;
    align-items: center;
    gap: 8px;
}

.th-content i {
    font-size: 12px;
    color: #9ca3af;
}

.data-table tbody tr {
    border-bottom: 1px solid #e5e7eb;
    transition: background 0.2s;
}

.data-table tbody tr:hover {
    background: #f9fafb;
}

.data-table tbody tr.clickable-row {
    cursor: pointer;
}

.data-table tbody tr.clickable-row:hover {
    background: #f3f4f6;
}

.data-table td {
    padding: 16px 12px;
    font-size: 14px;
    color: #374151;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 0;
}

.checkbox-input {
    width: 16px;
    height: 16px;
    cursor: pointer;
}

.no-data {
    text-align: center;
    color: #9ca3af;
    padding: 48px 24px;
}

/* Table Footer */
.table-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
}

.showing-info {
    font-size: 14px;
    color: #6b7280;
}

.pagination {
    display: flex;
    gap: 4px;
}

.page-btn {
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    background: white;
    color: #374151;
    font-size: 14px;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s;
    min-width: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.page-btn:hover:not(:disabled):not(.active) {
    background: #f9fafb;
    border-color: #9ca3af;
}

.page-btn.active {
    background: #2563eb;
    color: white;
    border-color: #2563eb;
}

.page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Responsive for search box */
@media (max-width: 768px) {
    .table-controls {
        flex-direction: column;
        gap: 12px;
    }

    .controls-left,
    .controls-right {
        width: 100%;
    }

    .search-box {
        width: 100%;
    }

    .search-input {
        width: 100%;
    }

    /* Responsive for table content */
    .table-wrapper {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }

    .data-table {
        min-width: 600px;
    }

    .data-table th {
        padding: 10px 8px;
        font-size: 12px;
        white-space: nowrap;
    }

    .data-table td {
        padding: 12px 8px;
        font-size: 13px;
    }

    .data-table th:not(.th-checkbox),
    .data-table td:not(:first-child) {
        min-width: 120px;
    }
}

@media (max-width: 480px) {
    .table-controls {
        padding: 12px;
    }

    .controls-left {
        flex-wrap: wrap;
        gap: 8px;
    }

    .search-input {
        padding: 6px 10px 6px 32px;
        font-size: 13px;
    }

    /* Smaller table content for mobile */
    .data-table {
        min-width: 500px;
    }

    .data-table th {
        padding: 8px 6px;
        font-size: 11px;
    }

    .data-table td {
        padding: 10px 6px;
        font-size: 12px;
    }

    .data-table th:not(.th-checkbox),
    .data-table td:not(:first-child) {
        min-width: 100px;
    }

    .checkbox-input {
        width: 14px;
        height: 14px;
    }
}
</style>
