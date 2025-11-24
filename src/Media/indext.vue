<template>
    <section class="content">
        <div class="box m-b-0">
            <div class="box-body">
                <div
                    class="dropzone dz-clickable"
                    @click="$refs.fileInput.click()"
                    @drop.prevent="handleDrop"
                    @dragover.prevent
                >
                    <div class="dz-message needsclick">
                        Drop files here or click to upload
                    </div>
                    <input
                        ref="fileInput"
                        type="file"
                        multiple
                        accept="image/*"
                        @change="handleFileUpload"
                        style="display: none"
                    >
                </div>

                <div class="index-table" id="media-table">
                    <div class="table-responsive">
                        <div class="dt-container">
                            <!-- Header Actions -->
                            <div class="row dt-layout-row">
                                <div class="dt-layout-cell dt-layout-start col-sm-6">
                                    <div class="dt-length">
                                        <label>
                                            Show
                                            <select v-model="perPage" class="form-control input-sm" @change="loadFiles">
                                                <option value="10">10</option>
                                                <option value="20">20</option>
                                                <option value="40">40</option>
                                                <option value="60">60</option>
                                            </select>
                                            entries
                                        </label>
                                        <button
                                            type="button"
                                            class="btn btn-default btn-delete"
                                            :disabled="selectedItems.length === 0"
                                            @click="handleDelete"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16" fill="none">
                                                <path d="M12 3.6665L11.5868 10.3499C11.4813 12.0575 11.4285 12.9113 11.0005 13.5251C10.7889 13.8286 10.5164 14.0847 10.2005 14.2772C9.56141 14.6665 8.70599 14.6665 6.99516 14.6665C5.28208 14.6665 4.42554 14.6665 3.78604 14.2765C3.46987 14.0836 3.19733 13.827 2.98579 13.5231C2.55792 12.9082 2.5063 12.0532 2.40307 10.3433L2 3.6665" stroke="#141B34" stroke-width="1.5" stroke-linecap="round"></path>
                                                <path d="M5 7.82324H9" stroke="#141B34" stroke-width="1.5" stroke-linecap="round"></path>
                                                <path d="M6 10.436H8" stroke="#141B34" stroke-width="1.5" stroke-linecap="round"></path>
                                                <path d="M1 3.66659H13M9.70369 3.66659L9.24858 2.72774C8.94626 2.10409 8.7951 1.79227 8.53435 1.59779C8.47651 1.55465 8.41527 1.51628 8.35122 1.48305C8.06248 1.33325 7.71595 1.33325 7.02289 1.33325C6.31243 1.33325 5.95719 1.33325 5.66366 1.48933C5.59861 1.52392 5.53653 1.56385 5.47807 1.6087C5.2143 1.81105 5.06696 2.13429 4.77228 2.78076L4.36849 3.66659" stroke="#020010" stroke-width="1.5" stroke-linecap="round"></path>
                                            </svg>
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                                <div class="dt-layout-cell dt-layout-end col-sm-6">
                                    <div class="dt-search">
                                        <input
                                            type="search"
                                            v-model="searchQuery"
                                            @input="handleSearch"
                                            class="form-control input-sm search-input"
                                            placeholder="Search here..."
                                        >
                                    </div>
                                </div>
                            </div>

                            <!-- Table -->
                            <div class="row dt-layout-row dt-layout-table">
                                <div class="dt-layout-cell col-12">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th style="width: 60px;">
                                                    <div class="checkbox">
                                                        <input
                                                            type="checkbox"
                                                            id="select-all"
                                                            v-model="selectAll"
                                                            @change="toggleSelectAll"
                                                        >
                                                        <label for="select-all"></label>
                                                    </div>
                                                </th>
                                                <th style="width: 80px;" @click="sortBy('id')">ID <i class="fa fa-sort"></i></th>
                                                <th style="width: 120px;">Thumbnail</th>
                                                <th style="width: 300px; max-width: 300px;" @click="sortBy('filename')">Filename <i class="fa fa-sort"></i></th>
                                                <th style="width: 120px;" @click="sortBy('extension')">Extension <i class="fa fa-sort"></i></th>
                                                <th style="width: 120px;" @click="sortBy('size')">Size <i class="fa fa-sort"></i></th>
                                                <th style="width: 140px;" @click="sortBy('disk')">Disk <i class="fa fa-sort"></i></th>
                                                <th style="width: 160px;" @click="sortBy('createdAt')">Created <i class="fa fa-sort"></i></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="media in filteredMedia" :key="media.id">
                                                <td>
                                                    <div class="checkbox">
                                                        <input
                                                            type="checkbox"
                                                            :id="`media-${media.id}`"
                                                            :value="media"
                                                            v-model="selectedItems"
                                                        >
                                                        <label :for="`media-${media.id}`"></label>
                                                    </div>
                                                </td>
                                                <td>{{ media.id }}</td>
                                                <td>
                                                    <div class="thumbnail-holder">
                                                        <img :src="media.path" :alt="media.filename">
                                                    </div>
                                                </td>
                                                <td>{{ media.filename }}</td>
                                                <td>{{ media.extension }}</td>
                                                <td>{{ media.disk }}</td>
                                                <td>{{ media.size }}</td>
                                                <td>
                                                    <span :title="formatFullDate(media.createdAt)">
                                                        {{ formatRelativeDate(media.createdAt) }}
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- Pagination -->
                            <div class="row dt-layout-row">
                                <div class="dt-layout-cell dt-layout-start col-sm-6">
                                    <div class="dt-info">
                                        Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ totalElements }} entries
                                    </div>
                                </div>
                                <div class="dt-layout-cell dt-layout-end col-sm-6">
                                    <div class="dt-paging">
                                        <nav>
                                            <ul class="pagination">
                                                <li class="page-item" :class="{ disabled: currentPage === 0 }">
                                                    <a class="page-link" @click.prevent="currentPage = 0; loadFiles()">«</a>
                                                </li>
                                                <li class="page-item" :class="{ disabled: currentPage === 0 }">
                                                    <a class="page-link" @click.prevent="currentPage > 0 && (currentPage--, loadFiles())">‹</a>
                                                </li>
                                                <li
                                                    v-for="page in visiblePages"
                                                    :key="page"
                                                    class="page-item"
                                                    :class="{ active: currentPage === page }"
                                                >
                                                    <a class="page-link" @click.prevent="currentPage = page; loadFiles()">{{ page + 1 }}</a>
                                                </li>
                                                <li class="page-item" :class="{ disabled: currentPage >= totalPages - 1 }">
                                                    <a class="page-link" @click.prevent="currentPage < totalPages - 1 && (currentPage++, loadFiles())">›</a>
                                                </li>
                                                <li class="page-item" :class="{ disabled: currentPage >= totalPages - 1 }">
                                                    <a class="page-link" @click.prevent="currentPage = totalPages - 1; loadFiles()">»</a>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { uploadFile, searchFiles, deleteFiles } from '@/api/fileApi';
import { DEFAULT_PAGE_SIZE } from '@/Config/search';

export default {
    name: 'MediaIndex',
    setup() {
        const fileInput = ref(null);
        const selectedItems = ref([]);
        const selectAll = ref(false);
        const searchQuery = ref('');
        const perPage = ref(DEFAULT_PAGE_SIZE.files);
        const currentPage = ref(0);
        const mediaFiles = ref([]);
        const totalElements = ref(0);
        const loading = ref(false);
        const sortField = ref('createdAt');
        const sortOrder = ref('desc');

        // Sort by field
        const sortBy = (field) => {
            if (sortField.value === field) {
                sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
            } else {
                sortField.value = field;
                sortOrder.value = 'asc';
            }
            currentPage.value = 0;
            loadFiles();
        };

        // Load files from API
        const loadFiles = async () => {
            try {
                loading.value = true;
                const response = await searchFiles({
                    page: currentPage.value,
                    size: perPage.value,
                    sort: `${sortField.value},${sortOrder.value}`,
                    search: searchQuery.value
                });

                if (response.code === 200 && response.result) {
                    mediaFiles.value = response.result.content;
                    totalElements.value = response.result.totalElements;
                }
            } catch (error) {
                console.error('Failed to load files:', error);
                alert('Failed to load files. Please try again.');
            } finally {
                loading.value = false;
            }
        };

        const filteredMedia = computed(() => {
            return mediaFiles.value;
        });

        const totalPages = computed(() => {
            return Math.ceil(totalElements.value / perPage.value);
        });

        const startIndex = computed(() => {
            return currentPage.value * perPage.value;
        });

        const endIndex = computed(() => {
            const end = startIndex.value + perPage.value;
            return Math.min(end, totalElements.value);
        });

        const visiblePages = computed(() => {
            const pages = [];
            const maxVisible = 5;
            let start = Math.max(0, currentPage.value - 2);
            let end = Math.min(totalPages.value - 1, start + maxVisible - 1);

            if (end - start < maxVisible - 1) {
                start = Math.max(0, end - maxVisible + 1);
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            return pages;
        });

        const toggleSelectAll = () => {
            if (selectAll.value) {
                selectedItems.value = [...filteredMedia.value];
            } else {
                selectedItems.value = [];
            }
        };

        const handleFileUpload = async (event) => {
            const files = Array.from(event.target.files);
            await uploadFilesToServer(files);
        };

        const handleDrop = async (event) => {
            const files = Array.from(event.dataTransfer.files);
            await uploadFilesToServer(files);
        };

        const uploadFilesToServer = async (files) => {
            const userId = localStorage.getItem('userId') || 1;

            for (const file of files) {
                try {
                    const fileRequest = {
                        userId: parseInt(userId),
                        filename: file.name.split('.')[0],
                        disk: 'cloudinary',
                        extension: file.name.split('.').pop(),
                        mime: file.type,
                        size: `${(file.size / 1024).toFixed(3)} KB`
                    };

                    await uploadFile(file, fileRequest);
                } catch (error) {
                    console.error(`Failed to upload ${file.name}:`, error);
                    alert(`Failed to upload ${file.name}. Please try again.`);
                }
            }

            // Reload files after upload
            await loadFiles();
            // Clear file input
            if (fileInput.value) {
                fileInput.value.value = '';
            }
        };

        const handleDelete = async () => {
            if (!selectedItems.value.length) return;

            if (confirm(`Delete ${selectedItems.value.length} selected item(s)?`)) {
                try {
                    const selectedIds = selectedItems.value.map(item => item.id);
                    await deleteFiles(selectedIds);

                    selectedItems.value = [];
                    selectAll.value = false;

                    // Reload files
                    await loadFiles();
                } catch (error) {
                    console.error('Failed to delete files:', error);
                    alert('Failed to delete files. Please try again.');
                }
            }
        };

        const formatRelativeDate = (dateString) => {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const diffMonths = Math.floor(diffDays / 30);
            const diffYears = Math.floor(diffDays / 365);

            if (diffYears > 0) {
                return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
            } else if (diffMonths > 0) {
                return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
            } else if (diffDays > 0) {
                return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
            } else {
                return 'Today';
            }
        };

        const formatFullDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        // Watch for search query changes
        const searchTimeout = ref(null);
        const handleSearch = () => {
            if (searchTimeout.value) {
                clearTimeout(searchTimeout.value);
            }
            searchTimeout.value = setTimeout(() => {
                currentPage.value = 0;
                loadFiles();
            }, 300);
        };

        // Load files on mount
        onMounted(() => {
            loadFiles();
        });

        return {
            fileInput,
            mediaFiles,
            selectedItems,
            selectAll,
            searchQuery,
            perPage,
            currentPage,
            filteredMedia,
            totalPages,
            startIndex,
            endIndex,
            visiblePages,
            loading,
            totalElements,
            sortBy,
            toggleSelectAll,
            handleFileUpload,
            handleDrop,
            handleDelete,
            loadFiles,
            formatRelativeDate,
            formatFullDate,
            handleSearch
        };
    }
};
</script>

<style scoped>
.content {
    padding: 20px;
    width: 100%;
    max-width: 100%;
}

.box {
    background: #fff;
    border: 1px solid #d2d6de;
    border-radius: 3px;
    width: 100%;
    max-width: 100%;
}

.m-b-0 {
    margin-bottom: 0;
}

.box-body {
    padding: 15px;
}

.dropzone {
    border: 2px dashed #b8bbbe;
    border-radius: 5px;
    background: #f8f9fa;
    padding: 100px;
    text-align: center;
    cursor: pointer;
    margin-bottom: 20px;
    transition: all 0.3s;
}

.dropzone:hover {
    background: #e9ecef;
    border-color: #0056b3;
}

.dz-message {
    font-size: 16px;
    color: #6c757d;
    margin: 0;
}

.btn-delete {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border: 1px solid #ccc;
    background: #fff;
    border-radius: 3px;
    cursor: pointer;
    font-size: 14px;
}

.btn-delete:hover:not(:disabled) {
    background: #f5f5f5;
}

.btn-delete:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Delete button spacing */
.btn-delete {
    margin-left: 10px;
}

/* Search input styling */
.dt-search {
    text-align: right;
}

.search-input {
    width: 200px;
    padding-left: 30px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23999' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: 8px center;
    background-size: 16px 16px;
}

.thumbnail-holder {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #ddd;
    border-radius: 3px;
    overflow: hidden;
    background: #f9f9f9;
}

.thumbnail-holder img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.index-table {
    margin-top: 20px;
    width: 100%;
}

/* Remove horizontal scroll */
.table-responsive {
    overflow-x: visible !important;
    width: 100%;
}

.dt-container {
    width: 100%;
    max-width: 100%;
}

.dt-layout-row {
    width: 100%;
    max-width: 100%;
    margin: 0;
}

/* Override Bootstrap column padding */
.dt-layout-cell,
.col-12,
.col-sm-6 {
    padding-left: 0 !important;
    padding-right: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
}

.data-table {
    table-layout: fixed;
    width: 100%;
}

.table {
    width: 100% !important;
    margin: 0;
}

.table thead th {
    background-color: #f5f5f5;
    color: #6c757d;
    font-weight: 500;
    font-size: 13px;
    border-bottom: 2px solid #ddd;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.2s;
}

.table thead th i {
    color: #adb5bd;
    font-size: 11px;
    margin-left: 4px;
}

.table thead th:hover {
    background-color: #e9ecef;
}

.table thead th:first-child {
    cursor: default;
}

.table thead th:first-child:hover {
    background-color: #f5f5f5;
}

/* Optimized column widths */
.table th:nth-child(1),
.table td:nth-child(1) {
    width: 60px;
    padding: 10px 8px !important;
    text-align: center;
}

.table th:nth-child(2),
.table td:nth-child(2) {
    width: 80px;
    padding: 10px 10px !important;
    text-align: center;
}

.table th:nth-child(3),
.table td:nth-child(3) {
    width: 120px;
    padding: 10px 10px !important;
    text-align: center;
}

.table th:nth-child(4),
.table td:nth-child(4) {
    width: 300px;
    max-width: 300px;
    padding: 10px 15px !important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.table th:nth-child(5),
.table td:nth-child(5) {
    width: 120px;
    padding: 10px 10px !important;
    text-align: center;
}

.table th:nth-child(6),
.table td:nth-child(6) {
    width: 120px;
    padding: 10px 10px !important;
    text-align: center;
}

.table th:nth-child(7),
.table td:nth-child(7) {
    width: 140px;
    padding: 10px 10px !important;
    text-align: center;
}

.table th:nth-child(8),
.table td:nth-child(8) {
    width: 160px;
    padding: 10px 10px !important;
    text-align: center;
}

.table td {
    vertical-align: middle !important;
}

.thumbnail-holder {
    width: 70px;
    height: 70px;
    margin: 0 auto;
}
</style>
