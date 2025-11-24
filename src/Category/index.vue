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
                                <li :class="{ active: activeTab === 'general' }">
                                    <a @click.prevent="activeTab = 'general'" href="#">General</a>
                                </li>
                                <li :class="{ active: activeTab === 'image' }">
                                    <a @click.prevent="activeTab = 'image'" href="#">Image</a>
                                </li>
                                <li :class="{ active: activeTab === 'seo', hide: isNewCategory }">
                                    <a @click.prevent="activeTab = 'seo'" href="#">SEO</a>
                                </li>
                            </ul>
                            <form @submit.prevent="handleSubmit">
                                <div class="tab-content">
                                    <div v-show="activeTab === 'general'">
                                        <div v-if="!isNewCategory" class="form-group row">
                                            <label class="col-md-2 control-label">ID</label>
                                            <div class="col-md-10">
                                                <input type="text" class="form-control" v-model="form.id" disabled>
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <label class="col-md-2 control-label">Name <span class="text-red">*</span></label>
                                            <div class="col-md-10">
                                                <input type="text" class="form-control" v-model="form.name">
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <label class="col-md-2 control-label">Status</label>
                                            <div class="col-md-10">
                                                <div class="checkbox-wrapper">
                                                    <input type="checkbox" id="is_active" v-model="form.is_active">
                                                    <label for="is_active">Enable the category</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-show="activeTab === 'image'">
                                        <ImageUploader
                                            title="Logo"
                                            v-model="form.logo"
                                            @update:fileId="form.logoFileId = $event"
                                        />
                                        <ImageUploader
                                            title="Banner"
                                            v-model="form.banner"
                                            @update:fileId="form.bannerFileId = $event"
                                        />
                                    </div>
                                    <div v-show="activeTab === 'seo'">
                                        <div v-if="!isNewCategory" class="form-group">
                                            <label>URL</label>
                                            <input type="text" class="form-control" v-model="form.slug">
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <button type="submit" class="btn btn-primary" :disabled="saving">
                                        {{ saving ? 'Saving...' : 'Save' }}
                                    </button>
                                    <button v-if="!isNewCategory" type="button" class="btn btn-link" @click="handleDelete">
                                        Delete
                                    </button>
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
import ImageUploader from './components/ImageUploader.vue';
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '@/api/categoryApi';
import { attachFileToBrand, getBrandFiles, deleteEntityFile } from '@/api/brandApi';

export default {
    name: 'CategoryPage',
    components: {
        ImageUploader
    },
    setup() {
        const categoryTree = ref(null);
        const selectedNode = ref(null);
        const activeTab = ref('general');
        const loading = ref(false);
        const saving = ref(false);
        const categories = ref([]);

        const form = ref({
            id: null,
            name: '',
            is_active: false,
            logo: null,
            banner: null,
            logoFileId: null,
            bannerFileId: null,
            existingLogoEntityFileId: null,
            existingBannerEntityFileId: null,
            slug: ''
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
                            is_active: cat.isActive,
                            logo: null,
                            banner: null,
                            logoFileId: null,
                            bannerFileId: null,
                            existingLogoEntityFileId: null,
                            existingBannerEntityFileId: null,
                            slug: cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                        };

                        // Load entity files (logo and banner)
                        try {
                            const logoFiles = await getBrandFiles(categoryId, 'category', 'logo');
                            if (logoFiles.code === 200 && logoFiles.result?.length > 0) {
                                const logoFile = logoFiles.result[0];
                                form.value.existingLogoEntityFileId = logoFile.id;
                                form.value.logo = logoFile.path;
                            }

                            const bannerFiles = await getBrandFiles(categoryId, 'category', 'banner');
                            if (bannerFiles.code === 200 && bannerFiles.result?.length > 0) {
                                const bannerFile = bannerFiles.result[0];
                                form.value.existingBannerEntityFileId = bannerFile.id;
                                form.value.banner = bannerFile.path;
                            }
                        } catch (error) {
                            console.error('Failed to load entity files:', error);
                        }
                    }
                } catch (error) {
                    console.error('Failed to load category:', error);
                }

                activeTab.value = 'general';
            });
        };

        const addRootCategory = () => {
            selectedNode.value = null;
            form.value = {
                id: null,
                name: '',
                is_active: true,
                logo: null,
                banner: null,
                logoFileId: null,
                bannerFileId: null,
                existingLogoEntityFileId: null,
                existingBannerEntityFileId: null,
                parentId: null,
                slug: ''
            };
            activeTab.value = 'general';
            if (categoryTree.value) $(categoryTree.value).jstree('deselect_all');
        };

        const addSubcategory = () => {
            if (!selectedNode.value) return;
            form.value = {
                id: null,
                name: '',
                is_active: true,
                logo: null,
                banner: null,
                logoFileId: null,
                bannerFileId: null,
                existingLogoEntityFileId: null,
                existingBannerEntityFileId: null,
                parentId: parseInt(selectedNode.value.id),
                slug: ''
            };
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
                alert('Category name is required');
                return;
            }

            saving.value = true;

            try {
                const categoryData = {
                    parentId: form.value.parentId || null,
                    name: form.value.name,
                    isActive: form.value.is_active
                };

                if (form.value.id) {
                    // Update existing category
                    await updateCategory(form.value.id, categoryData);

                    // Handle logo changes
                    if (form.value.logoFileId) {
                        // Delete old logo if exists
                        if (form.value.existingLogoEntityFileId) {
                            try {
                                await deleteEntityFile(form.value.existingLogoEntityFileId);
                            } catch (error) {
                                console.error('Failed to delete old logo:', error);
                            }
                        }

                        // Attach new logo
                        await attachFileToBrand({
                            fileId: form.value.logoFileId,
                            entityId: form.value.id,
                            entityType: 'category',
                            zone: 'logo'
                        });
                    } else if (!form.value.logo && form.value.existingLogoEntityFileId) {
                        // Logo was removed
                        try {
                            await deleteEntityFile(form.value.existingLogoEntityFileId);
                        } catch (error) {
                            console.error('Failed to delete logo:', error);
                        }
                    }

                    // Handle banner changes
                    if (form.value.bannerFileId) {
                        // Delete old banner if exists
                        if (form.value.existingBannerEntityFileId) {
                            try {
                                await deleteEntityFile(form.value.existingBannerEntityFileId);
                            } catch (error) {
                                console.error('Failed to delete old banner:', error);
                            }
                        }

                        // Attach new banner
                        await attachFileToBrand({
                            fileId: form.value.bannerFileId,
                            entityId: form.value.id,
                            entityType: 'category',
                            zone: 'banner'
                        });
                    } else if (!form.value.banner && form.value.existingBannerEntityFileId) {
                        // Banner was removed
                        try {
                            await deleteEntityFile(form.value.existingBannerEntityFileId);
                        } catch (error) {
                            console.error('Failed to delete banner:', error);
                        }
                    }

                    // Update tree node name
                    if (selectedNode.value) {
                        $(categoryTree.value).jstree('rename_node', selectedNode.value, form.value.name);
                    }

                    alert('Category updated successfully!');
                } else {
                    // Create new category
                    const response = await createCategory(categoryData);

                    if (response.code === 200 && response.result) {
                        const categoryId = response.result.id;

                        // Attach logo if selected
                        if (form.value.logoFileId) {
                            await attachFileToBrand({
                                fileId: form.value.logoFileId,
                                entityId: categoryId,
                                entityType: 'category',
                                zone: 'logo'
                            });
                        }

                        // Attach banner if selected
                        if (form.value.bannerFileId) {
                            await attachFileToBrand({
                                fileId: form.value.bannerFileId,
                                entityId: categoryId,
                                entityType: 'category',
                                zone: 'banner'
                            });
                        }

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
            activeTab,
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
.form-group.row { display: flex; align-items: center; }
.col-md-2 { width: 16.66%; padding-right: 15px; }
.col-md-10 { width: 83.34%; }
.control-label { font-weight: 600; text-align: left; padding-top: 0; }
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
