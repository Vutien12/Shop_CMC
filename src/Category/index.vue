<template>
    <section class="content">
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
                                <li class="active">
                                    <a href="#">General</a>
                                </li>
                            </ul>
                            <form @submit.prevent="handleSubmit">
                                <div class="tab-content">
                                    <div class="form-group row">
                                        <label class="col-md-3 control-label">Name <span class="text-red">*</span></label>
                                        <div class="col-md-9">
                                            <input type="text" class="form-control" v-model="form.name">
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-3 control-label">Searchable</label>
                                        <div class="col-md-9">
                                            <div class="checkbox-wrapper">
                                                <input type="checkbox" id="is_searchable" v-model="form.is_searchable">
                                                <label for="is_searchable">Show this category in search box category list</label>
                                            </div>
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
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '@/api/categoryApi';

export default {
    name: 'CategoryPage',
    setup() {
        const categoryTree = ref(null);
        const selectedNode = ref(null);
        const loading = ref(false);
        const saving = ref(false);
        const categories = ref([]);

        const form = ref({
            id: null,
            name: '',
            is_searchable: false,
            is_active: false
        });

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
                alert('Failed to load categories. Please try again.');
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
                            is_active: cat.isActive
                        };
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
                parentId: null
            };
            if (categoryTree.value) $(categoryTree.value).jstree('deselect_all');
        };

        const addSubcategory = () => {
            if (!selectedNode.value) return;
            form.value = {
                id: null,
                name: '',
                is_searchable: false,
                is_active: true,
                parentId: parseInt(selectedNode.value.id)
            };
        };

        const collapseAll = () => {
            if (categoryTree.value) $(categoryTree.value).jstree('close_all');
        };

        const expandAll = () => {
            if (categoryTree.value) $(categoryTree.value).jstree('open_all');
        };

        const handleSubmit = async () => {
            if (!form.value.name.trim()) {
                alert('Category name is required');
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

                    // Update tree node name
                    if (selectedNode.value) {
                        $(categoryTree.value).jstree('rename_node', selectedNode.value, form.value.name);
                    }

                    alert('Category updated successfully!');
                } else {
                    // Create new category
                    const response = await createCategory(categoryData);

                    if (response.code === 200 && response.result) {
                        alert('Category created successfully!');

                        // Reload categories to update tree
                        await loadCategories();
                    }
                }
            } catch (error) {
                console.error('Failed to save category:', error);
                alert('Failed to save category. Please try again.');
            } finally {
                saving.value = false;
            }
        };

        const handleDelete = async () => {
            if (!form.value.id) return;

            if (confirm('Are you sure you want to delete this category?')) {
                try {
                    saving.value = true;
                    await deleteCategory(form.value.id);

                    // Delete from tree
                    if (selectedNode.value && categoryTree.value) {
                        $(categoryTree.value).jstree('delete_node', selectedNode.value);
                    }

                    alert('Category deleted successfully!');
                    addRootCategory();
                } catch (error) {
                    console.error('Failed to delete category:', error);
                    alert('Failed to delete category. Please try again.');
                } finally {
                    saving.value = false;
                }
            }
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
            form,
            isNewCategory,
            loadCategories,
            addRootCategory,
            addSubcategory,
            collapseAll,
            expandAll,
            handleSubmit,
            handleDelete
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
