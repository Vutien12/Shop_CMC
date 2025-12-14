<template>
    <section class="content">
        <PageBreadcrumb
            title="Categories"
            :breadcrumbs="[
                { label: 'Categories' }
            ]"
        />
        <div class="category-tree-wrap">
            <div class="col">
                <div class="box box-default">
                    <div class="box-body clearfix">
                        <div class="button-group" style="width:130px">
                            <button class="btn btn-default btn-sm btn-block" @click="addRootCategory">
                                Add Root Category
                            </button>
                            <button class="btn btn-default btn-sm btn-block" :disabled="!selectedNode" @click="addSubcategory">
                                Add Subcategory
                            </button>
                        </div>
                        <div class="m-b-10">
                            <a href="#" @click.prevent="collapseAll">Collapse All</a> |
                            <a href="#" @click.prevent="expandAll">Expand All</a>
                        </div>
                        <div ref="categoryTree"></div>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="box box-default">
                    <div class="box-body clearfix">
                        <div class="tab-wrapper">
                            <ul class="nav nav-tabs">
                                <li :class="{ active: activeTab === 'general' }">
                                    <a href="#" @click.prevent="activeTab = 'general'">General</a>
                                </li>
                                <li :class="{ active: activeTab === 'image' }">
                                    <a href="#" @click.prevent="activeTab = 'image'">Image</a>
                                </li>
                            </ul>
                            <form @submit.prevent="handleSubmit">
                                <div class="tab-content">
                                    <!-- General Tab -->
                                    <div v-show="activeTab === 'general'">
                                        <div class="form-group row">
                                            <label class="col-md-3 control-label">Name <span class="text-red">*</span></label>
                                            <div class="col-md-9">
                                                <input type="text" class="form-control" v-model="form.name">
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <label class="col-md-3 control-label">Status</label>
                                            <div class="col-md-9">
                                                <div class="checkbox-wrapper">
                                                    <input type="checkbox" id="is_active" v-model="form.is_active">
                                                    <label for="is_active">Enable the category</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Image Tab -->
                                    <div v-show="activeTab === 'image'">
                                        <div class="form-group row">
                                            <label class="col-md-3 control-label">Thumbnail</label>
                                            <div class="col-md-9">
                                                <ImageUploader
                                                    title="Category Thumbnail"
                                                    v-model="form.thumbnail"
                                                    @update:fileId="selectedThumbnailFileId = $event"
                                                    @remove="handleRemoveThumbnail"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Submit Buttons -->
                                    <div class="form-group row">
                                        <label class="col-md-3 control-label"></label>
                                        <div class="col-md-9">
                                            <button type="submit" class="btn btn-primary" :disabled="saving">
                                                {{ saving ? 'Saving...' : 'Save' }}
                                            </button>
                                            <button v-if="!isNewCategory" type="button" class="btn btn-link" @click="handleDelete">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import $ from 'jquery';
import 'jstree';
import 'jstree/dist/themes/default/style.min.css';
import { useNotification } from '@/Admin/composables/useNotification.js';
import PageBreadcrumb from '@/Admin/view/components/PageBreadcrumb.vue';
import ImageUploader from '@/Category/components/ImageUploader.vue';
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory, attachFileToCategory } from '@/api/categoryApi';
import { deleteEntityFile } from '@/api';

export default {
    name: 'CategoryPage',
    components: {
        PageBreadcrumb,
        ImageUploader
    },
    setup() {
        const notification = useNotification();
        const categoryTree = ref(null);
        const selectedNode = ref(null);
        const loading = ref(false);
        const saving = ref(false);
        const categories = ref([]);
        const activeTab = ref('general');

        const form = ref({
            id: null,
            name: '',
            is_searchable: false,
            is_active: false,
            thumbnail: ''
        });

        const selectedThumbnailFileId = ref(null);
        const currentThumbnailId = ref(null); // Track current thumbnail entity file ID

        const isNewCategory = computed(() => !form.value.id);

        // Convert flat category list to tree structure
        const buildTree = (categories) => {
            const map = {};
            const roots = [];

            // Create map of all categories
            categories.forEach(cat => {
                map[cat.id] = {
                    id: String(cat.id),
                    text: cat.name,
                    state: { opened: true },
                    children: [],
                    data: cat
                };
            });

            // Build tree structure
            categories.forEach(cat => {
                if (cat.parentId === null) {
                    roots.push(map[cat.id]);
                } else if (map[cat.parentId]) {
                    map[cat.parentId].children.push(map[cat.id]);
                }
            });

            return roots;
        };

        const loadCategories = async () => {
            try {
                loading.value = true;
                const response = await getCategories();

                if (response.code === 200) {
                    categories.value = response.result;
                    const treeData = buildTree(response.result);

                    // Destroy and reinitialize tree
                    if (categoryTree.value) {
                        $(categoryTree.value).jstree('destroy');
                    }
                    initializeTree(treeData);
                }
            } catch (error) {
                console.error('Failed to load categories:', error);
                notification.error('Lỗi!', 'Không thể tải danh sách danh mục');
            } finally {
                loading.value = false;
            }
        };

        const initializeTree = (treeData) => {
            if (!categoryTree.value) return;
            $(categoryTree.value).jstree({
                core: { data: treeData, check_callback: true }
            }).on('select_node.jstree', async (e, data) => {
                selectedNode.value = data.node;
                const categoryId = parseInt(data.node.id);

                // Load full category data
                try {
                    const response = await getCategoryById(categoryId);
                    if (response.code === 200) {
                        const cat = response.result;
                        form.value = {
                            id: cat.id,
                            name: cat.name,
                            is_searchable: cat.isSearchable || false,
                            is_active: cat.isActive,
                            thumbnail: cat.thumbnail?.url || '',
                            parentId: cat.parentId || null
                        };
                        currentThumbnailId.value = cat.thumbnail?.id || null;
                        selectedThumbnailFileId.value = null;
                        activeTab.value = 'general';
                    }
                } catch (error) {
                    console.error('Failed to load category:', error);
                }
            });
        };

        const addRootCategory = () => {
            selectedNode.value = null;
            form.value = {
                id: null,
                name: '',
                is_searchable: false,
                is_active: true,
                parentId: null,
                thumbnail: ''
            };
            selectedThumbnailFileId.value = null;
            activeTab.value = 'general';
            if (categoryTree.value) $(categoryTree.value).jstree('deselect_all');
        };

        const addSubcategory = () => {
            if (!selectedNode.value) return;
            form.value = {
                id: null,
                name: '',
                is_searchable: false,
                is_active: true,
                parentId: parseInt(selectedNode.value.id),
                thumbnail: ''
            };
            selectedThumbnailFileId.value = null;
            activeTab.value = 'general';
        };

        const collapseAll = () => {
            if (categoryTree.value) $(categoryTree.value).jstree('close_all');
        };

        const expandAll = () => {
            if (categoryTree.value) $(categoryTree.value).jstree('open_all');
        };

        const handleSubmit = async () => {
            if (!form.value.name.trim()) {
                notification.warning('Cảnh báo!', 'Tên danh mục không được để trống');
                return;
            }

            saving.value = true;

            try {
                const categoryData = {
                    parentId: form.value.parentId || null,
                    name: form.value.name,
                    isSearchable: form.value.is_searchable,
                    isActive: form.value.is_active
                };

                if (form.value.id) {
                    // Update existing category
                    await updateCategory(form.value.id, categoryData);

                    // Attach thumbnail if a new one was selected
                    if (selectedThumbnailFileId.value) {
                        await attachFileToCategory({
                            fileId: selectedThumbnailFileId.value,
                            entityId: form.value.id,
                            entityType: 'category',
                            zone: 'category'
                        });
                        selectedThumbnailFileId.value = null;
                    }

                    // Update tree node name
                    if (selectedNode.value) {
                        $(categoryTree.value).jstree('rename_node', selectedNode.value, form.value.name);
                    }

                    notification.success('Thành công!', 'Đã cập nhật danh mục thành công');
                } else {
                    // Create new category
                    const response = await createCategory(categoryData);

                    if (response.code === 200 && response.result) {
                        const categoryId = response.result.id;

                        // Attach thumbnail if selected
                        if (selectedThumbnailFileId.value) {
                            await attachFileToCategory({
                                fileId: selectedThumbnailFileId.value,
                                entityId: categoryId,
                                entityType: 'CATEGORY',
                                zone: 'CATEGORY'
                            });
                        }

                        notification.success('Thành công!', 'Đã tạo danh mục thành công');

                        // Reload categories to update tree
                        await loadCategories();
                    }
                }
            } catch (error) {
                console.error('Failed to save category:', error);
                notification.error('Lỗi!', 'Không thể lưu danh mục');
            } finally {
                saving.value = false;
            }
        };

        const handleDelete = async () => {
            if (!form.value.id) return;

            const confirmed = await notification.confirm(
                'Xác nhận xóa',
                'Bạn có chắc chắn muốn xóa danh mục này?'
            );

            if (confirmed) {
                try {
                    saving.value = true;
                    await deleteCategory(form.value.id);

                    // Delete from tree
                    if (selectedNode.value && categoryTree.value) {
                        $(categoryTree.value).jstree('delete_node', selectedNode.value);
                    }

                    notification.success('Thành công!', 'Đã xóa danh mục thành công');
                    addRootCategory();
                } catch (error) {
                    console.error('Failed to delete category:', error);
                    notification.error('Lỗi!', 'Không thể xóa danh mục');
                } finally {
                    saving.value = false;
                }
            }
        };

        const handleRemoveThumbnail = async () => {
            // Delete via API if thumbnail has entity file ID
            if (currentThumbnailId.value) {
                try {
                    console.log('[Category] Deleting thumbnail entity file:', currentThumbnailId.value);
                    await deleteEntityFile(currentThumbnailId.value);
                    console.log('[Category] Thumbnail deleted successfully');
                    notification.success('Success!', 'Thumbnail removed successfully');
                } catch (error) {
                    console.error('[Category] Error deleting thumbnail:', error);
                    notification.error('Error!', 'Failed to delete thumbnail from server');
                    return;
                }
            }

            currentThumbnailId.value = null;
            form.value.thumbnail = null;
            selectedThumbnailFileId.value = null;
        };

        onMounted(() => {
            loadCategories();
        });

        onBeforeUnmount(() => {
            if (categoryTree.value) $(categoryTree.value).jstree('destroy');
        });

        return {
            categoryTree,
            selectedNode,
            loading,
            saving,
            activeTab,
            form,
            selectedThumbnailFileId,
            isNewCategory,
            loadCategories,
            addRootCategory,
            addSubcategory,
            collapseAll,
            expandAll,
            handleSubmit,
            handleDelete,
            handleRemoveThumbnail
        };
    }
};
</script>

<style scoped>
.content { padding: 20px; }
.category-tree-wrap { display: flex; gap: 20px; }
.col { flex: 1; }
.box { background: #fff; border: 1px solid #ddd; padding: 15px; border-radius: 3px; }
.button-group { margin-bottom: 15px; }
.btn { padding: 6px 12px; cursor: pointer; background: #f5f5f5; border: none; border-radius: 3px; font-size: 14px; }
.btn-sm { padding: 4px 10px; font-size: 12px; }
.btn-block { display: block; width: 100%; margin-bottom: 8px; }
.btn:hover:not(:disabled) { background: #e8e8e8; }
.btn:disabled { cursor: not-allowed; opacity: 0.6; }
.btn-primary { background: #3c8dbc; color: #fff; border-color: #367fa9; }
.btn-primary:hover { background: #367fa9; }
.btn-link { background: none; border: none; color: #337ab7; }
.btn-link:hover { text-decoration: underline; }
.form-group { margin-bottom: 15px; }
.form-group.row { display: flex; align-items: flex-start; }
.col-md-3 { width: 120px; min-width: 120px; padding-right: 15px; padding-top: 7px; }
.col-md-9 { flex: 1; }
.control-label { font-weight: 600; text-align: left; padding-top: 0; font-size: 13px; }
.checkbox-wrapper { display: flex; align-items: center; gap: 8px; }
.checkbox-wrapper input[type="checkbox"] { margin: 0; width: 16px; height: 16px; }
.checkbox-wrapper label { margin: 0; cursor: pointer; }
.form-control { width: 100%; padding: 6px 12px; border: 1px solid #ccc; border-radius: 3px; }
.nav-tabs { list-style: none; padding: 0; border-bottom: 1px solid #ddd; margin-bottom: 0; }
.nav-tabs li { display: inline-block; margin-bottom: -1px; }
.nav-tabs li a { padding: 10px 15px; display: block; cursor: pointer; border: 1px solid transparent; border-radius: 3px 3px 0 0; }
.nav-tabs li.active a { background: #fff; border: 1px solid #ddd; border-bottom: none; }
.tab-content { padding: 15px; }
.text-red { color: #dd4b39; }
.hide { display: none; }
.m-b-10 { margin-bottom: 10px; }
.m-b-10 a { color: #337ab7; text-decoration: none; }
.m-b-10 a:hover { text-decoration: underline; }
</style>
