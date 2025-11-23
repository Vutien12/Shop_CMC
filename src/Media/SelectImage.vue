<template>
    <!-- Modal Overlay -->
    <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container">
            <div class="modal-header">
                <h3>File Manager</h3>
                <button type="button" class="btn-close" @click="closeModal">
                    <i class="fa fa-times"></i>
                </button>
            </div>

            <div class="modal-body">
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
                                                <th style="width: 3%;">
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
                                                <th style="width: 5%;">ID</th>
                                                <th style="width: 10%;">Thumbnail</th>
                                                <th>Filename</th>
                                                <th>Created</th>
                                                <th style="width: 10%;"></th>
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
                                                <td>{{ formatRelativeDate(media.createdAt) }}</td>
                                                <td class="text-center">
                                                    <button
                                                        class="btn btn-primary btn-sm btn-insert"
                                                        @click="insertImage(media)"
                                                    >
                                                        Insert
                                                    </button>
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
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { searchFiles } from '@/api/fileApi';
import { DEFAULT_PAGE_SIZE } from '@/Config/search';

export default {
    name: 'SelectImage',
    props: {
        isOpen: {
            type: Boolean,
            default: false
        }
    },
    emits: ['close', 'select'],
    setup(props, { emit }) {
        const selectedItems = ref([]);
        const selectAll = ref(false);
        const searchQuery = ref('');
        const perPage = ref(DEFAULT_PAGE_SIZE.files);
        const currentPage = ref(0);
        const mediaFiles = ref([]);
        const totalElements = ref(0);
        const loading = ref(false);

        // Load files from API
        const loadFiles = async () => {
            try {
                loading.value = true;
                const response = await searchFiles({
                    page: currentPage.value,
                    size: perPage.value,
                    sort: 'createdAt,desc',
                    search: searchQuery.value
                });

                if (response.code === 200 && response.result) {
                    mediaFiles.value = response.result.content;
                    totalElements.value = response.result.totalElements;
                }
            } catch (error) {
                console.error('Failed to load files:', error);
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

        const handleDelete = async () => {
            if (!selectedItems.value.length) return;

            if (confirm(`Delete ${selectedItems.value.length} selected item(s)?`)) {
                try {
                    const { deleteFiles } = await import('@/api/fileApi');
                    const selectedIds = selectedItems.value.map(item => item.id);
                    await deleteFiles(selectedIds);

                    selectedItems.value = [];
                    selectAll.value = false;

                    // Reload files
                    await loadFiles();
                } catch (error) {
                    console.error('Failed to delete files:', error);
                }
            }
        };

        const insertImage = (media) => {
            // Log for debugging
            console.log('SelectImage: Inserting media:', {
                id: media.id,
                filename: media.filename,
                path: media.path,
                fileId: media.fileId || media.id
            });

            // Emit selected image to parent component
            emit('select', media);
            closeModal();
        };

        const closeModal = () => {
            emit('close');
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
            toggleSelectAll,
            handleDelete,
            insertImage,
            closeModal,
            loadFiles,
            handleSearch,
            formatRelativeDate
        };
    }
};
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 20px;
}

.modal-container {
    background: #fff;
    border-radius: 5px;
    width: 100%;
    max-width: 1200px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 30px;
    border-bottom: 1px solid #ddd;
}

.modal-header h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #333;
}

.btn-close {
    background: transparent;
    border: none;
    font-size: 24px;
    color: #999;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
}

.btn-close:hover {
    color: #333;
}

.modal-body {
    overflow-y: auto;
    padding: 20px 30px;
    flex: 1;
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
}

/* Remove horizontal scroll */
.table-responsive {
    overflow-x: visible !important;
}

.data-table {
    table-layout: fixed;
    width: 100%;
}

/* Optimized column widths */
.table th:nth-child(1),
.table td:nth-child(1) {
    width: 40px;
    padding: 10px 6px !important;
    text-align: center;
}

.table th:nth-child(2),
.table td:nth-child(2) {
    width: 60px;
    padding: 10px 8px !important;
    text-align: center;
}

.table th:nth-child(3),
.table td:nth-child(3) {
    width: 90px;
    padding: 10px 8px !important;
    text-align: center;
}

.table th:nth-child(4),
.table td:nth-child(4) {
    width: auto;
    padding: 10px 12px !important;
}

.table th:nth-child(5),
.table td:nth-child(5) {
    width: 120px;
    padding: 10px 8px !important;
    text-align: center;
}

.table th:nth-child(6),
.table td:nth-child(6) {
    width: 100px;
    padding: 10px 8px !important;
    text-align: center;
}

.table td {
    vertical-align: middle !important;
}

.thumbnail-holder {
    width: 50px;
    height: 50px;
    margin: 0 auto;
}

/* Insert button */
.btn-insert {
    background: #0087F7;
    color: #fff;
    border: none;
    padding: 5px 15px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 13px;
}

.btn-insert:hover {
    background: #0056b3;
}

.text-center {
    text-align: center;
}
</style>
