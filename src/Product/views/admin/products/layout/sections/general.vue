<template>
    <div class="box" v-if="section === 'general'">
        <div class="box-header">
            <h5>{{ trans('product::products.group.general') }}</h5>
        </div>

        <div class="box-body">
            <!-- Name Field -->
            <div class="form-group row" :class="{'has-error': errors.has('name')}">
                <label for="name" class="col-sm-3 control-label text-left">
                    {{ trans('product::attributes.name') }}
                    <span class="text-red">*</span>
                </label>

                <div class="col-sm-9">
                    <div class="field-with-error-tooltip">
                        <input
                            type="text"
                            name="name"
                            id="name"
                            class="form-control"
                            v-model="form.name"
                            placeholder="Enter product name"
                        >
                        <div v-if="errors.has('name')" class="error-tooltip">
                            {{ errors.get('name') }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Description Field - Full Width -->
            <div class="form-group row" :class="{'has-error': errors.has('description')}">
                <label for="description" class="col-sm-12 control-label text-left">
                    {{ trans('product::attributes.description') }}
                </label>

                <div class="col-sm-12">
                    <div class="field-with-error-tooltip">
                        <TinyMCEEditor
                            v-model="form.description"
                            :height="400"
                            @change="handleDescriptionChange"
                        />
                        <div v-if="errors.has('description')" class="error-tooltip">
                            {{ errors.get('description') }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Brand Field -->
            <div class="form-group row" :class="{'has-error': errors.has('brand_id')}">
                <label for="brand-id" class="col-sm-2 control-label text-left">
                    {{ trans('product::attributes.brand_id') }}
                    <span class="text-red">*</span>
                </label>
                <div class="col-sm-4">
                    <div class="field-with-error-tooltip">
                        <select
                            name="brand_id"
                            id="brand-id"
                            class="form-control custom-select-black"
                            v-model="form.brand_id"
                        >
                            <option value="">{{ trans('admin::admin.form.please_select') }}</option>
                            <option
                                v-for="brand in brands"
                                :key="brand.id"
                                :value="brand.id"
                            >
                                {{ brand.name }}
                            </option>
                        </select>
                        <div v-if="errors.has('brand_id')" class="error-tooltip">
                            {{ errors.get('brand_id') }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Categories & Status Row -->
            <div class="form-group row">
                <!-- Categories Field - Left Side -->
                <div class="col-sm-6" :class="{'has-error': errors.has('categories')}">
                    <label for="categories" class="control-label text-left">
                        {{ trans('product::attributes.categories') }}
                        <span class="text-red">*</span>
                    </label>

                    <div class="field-with-error-tooltip">
                        <!-- Input to trigger dropdown with selected tags inside -->
                        <div class="category-input-wrapper" @click="toggleCategoryDropdown">
                            <div class="category-input-content">
                                <!-- Selected categories as tags inside input -->
                                <div v-if="form.categories.length > 0" class="selected-tags-inline">
                                    <span
                                        v-for="catId in form.categories"
                                        :key="catId"
                                        class="tag-inline"
                                    >
                                        {{ getCategoryName(catId) }}
                                        <button
                                            type="button"
                                            @click.stop="removeCategory(catId)"
                                            class="btn-remove-inline"
                                        >
                                            ✕
                                        </button>
                                    </span>
                                </div>
                                <span v-else class="placeholder-text">Click to select categories...</span>
                            </div>
                        </div>

                        <!-- Simple Multi-select dropdown -->
                        <select
                            v-show="isCategoryDropdownOpen"
                            multiple
                            name="categories"
                            id="categories"
                            class="form-control categories-select"
                            @change="handleCategoriesChange"
                            size="8"
                            style="width: 100%;"
                        >
                            <option
                                v-for="category in getCategoryTree()"
                                :key="category.id"
                                :value="category.id"
                                :selected="form.categories.includes(category.id)"
                            >
                                {{ getIndent(category.level) }} {{ category.name }}
                            </option>
                        </select>
                        <div v-if="errors.has('categories')" class="error-tooltip">
                            {{ errors.get('categories') }}
                        </div>
                    </div>
                </div>

                <!-- Status Field - Right Side -->
                <div class="col-sm-6" :class="{'has-error': errors.has('is_active')}">
                    <label for="is-active" class="control-label text-left">
                        {{ trans('product::attributes.is_active') }}
                        <span class="text-red">*</span>
                    </label>

                    <div class="switch" style="padding-top: 5px;">
                        <input
                            type="checkbox"
                            name="is_active"
                            id="is-active"
                            :checked="form.is_active === 1"
                            @change="(e) => form.is_active = e.target.checked ? 1 : 0"
                        >

                        <label for="is-active">
                            {{ trans('product::products.form.enable_the_product') }}
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TinyMCEEditor from '@/Admin/components/TinyMCEEditor.vue';
import products from '@/Product/lang/en/products.json';
import attributes from '@/Product/lang/en/attributes.json';
import admin from '@/Admin/lang/en/admin.json';

export default {
    name: 'GeneralSection',
    components: {
        TinyMCEEditor
    },
    props: {
        section: {
            type: String,
            required: true,
        },
        form: {
            type: Object,
            required: true,
        },
        errors: {
            type: Object,
            required: true,
        },
        product: {
            type: Object,
            default: () => ({}),
        },
        brands: {
            type: Array,
            default: () => [],
        },
        categories: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            isCategoryDropdownOpen: false,
        };
    },
    mounted() {
        // Close dropdown when clicking outside
        document.addEventListener('click', this.handleClickOutside);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    },
    watch: {
        'form.categories': {
            handler(newVal) {
                // Ensure categories is always an array
                if (!Array.isArray(newVal)) {
                    this.$emit('update:form', {
                        ...this.form,
                        categories: Array.isArray(newVal) ? newVal : []
                    });
                }
            },
            deep: true
        }
    },
    computed: {
        rootCategories() {
            // Filter categories - show all categories that have parentId (not null)
            // Since the structure is: Electronics (parentId=null) -> Smartphones, Laptops, etc (parentId=1)
            // We want to show the child categories for selection
            return this.categories.filter(cat => cat.parentId !== null);
        },
    },
    methods: {
        trans(key) {
            const translationFiles = {
                'product::products': products,
                'product::attributes': attributes,
                'admin::admin': admin,
            };

            const [namespace, remainder] = key.split('::');
            if (!remainder) return key;

            const parts = remainder.split('.');
            const file = parts.shift();
            const rest = parts;

            const fileKey = `${namespace}::${file}`;
            const translationData = translationFiles[fileKey];

            if (!translationData) return key;

            let result = translationData;
            for (const k of rest) {
                if (result && Object.prototype.hasOwnProperty.call(result, k)) {
                    result = result[k];
                } else {
                    return key;
                }
            }

            return typeof result === 'string' ? result : key;
        },
        handleDescriptionChange(value) {
            // Update form description
            this.form.description = value;
            
            // Debug log
            console.log('Description changed in general.vue:', {
                length: value?.length || 0,
                hasImages: value?.includes('<img') || false,
                value: value
            });
            
            // Clear description error when user types
            if (this.errors.has('description')) {
                this.errors.clear('description');
            }
        },
        getCategoryTree() {
            // Build flattened tree with level info for indentation
            const tree = [];
            const buildTree = (categories, level = 0) => {
                categories.forEach(category => {
                    tree.push({
                        id: category.id,
                        name: category.name,
                        parentId: category.parentId,
                        level: level
                    });

                    // Find children
                    const children = this.categories.filter(c => c.parentId === category.id);
                    if (children.length > 0) {
                        buildTree(children, level + 1);
                    }
                });
            };

            // Start with root categories (parentId = null)
            const rootCategories = this.categories.filter(c => c.parentId === null);
            buildTree(rootCategories);

            return tree;
        },
        getIndent(level) {
            // Create indentation using pipe symbols like FleetCart: ¦–– ¦–– Category
            if (level === 0) return '';
            return '¦–– '.repeat(level);
        },
        getCategoryName(categoryId) {
            // Get category name by ID
            const categoryTree = this.getCategoryTree();
            const found = categoryTree.find(c => c.id === categoryId);
            return found ? found.name : '';
        },
        removeCategory(categoryId) {
            // Remove category from selected list
            const index = this.form.categories.indexOf(categoryId);
            if (index > -1) {
                this.form.categories.splice(index, 1);
            }
        },
        handleCategoriesChange(event) {
            // Handle multiple select change
            const selectedOptions = Array.from(event.target.selectedOptions, option => {
                // Convert to number if it's numeric
                const val = option.value;
                return isNaN(val) ? val : parseInt(val);
            });
            this.form.categories = selectedOptions;
        },
        toggleCategoryDropdown(event) {
            event.stopPropagation();
            this.isCategoryDropdownOpen = !this.isCategoryDropdownOpen;
        },
        getCategoryDisplayValue() {
            const count = this.form.categories.length;
            if (count === 0) return '';
            if (count === 1) return this.getCategoryName(this.form.categories[0]);
            return `${count} categories selected`;
        },
        handleClickOutside(event) {
            const container = this.$el.querySelector('.field-with-error-tooltip');
            if (container && !container.contains(event.target)) {
                this.isCategoryDropdownOpen = false;
            }
        }
    },
};
</script>

<style scoped>
/* Styling cho form-group khi có error */
.form-group.has-error {
    margin-bottom: 15px;
}

.form-group.has-error .form-control,
.form-group.has-error .custom-select-black {
    border-color: #dc3545 !important;
    background-color: #fff5f5;
}

.form-group.has-error .form-control:focus,
.form-group.has-error .custom-select-black:focus {
    border-color: #dc3545 !important;
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.text-red {
    color: #dc3545;
}

.form-control,
.custom-select-black {
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-control:hover:not(.has-error),
.custom-select-black:hover:not(.has-error) {
    border-color: #ced4da;
}

/* Error Tooltip Styling */
.field-with-error-tooltip {
    position: relative;
    display: inline-block;
    width: 100%;
    overflow: visible !important;
}

.error-tooltip {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 0;
    background-color: #dc3545;
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    white-space: normal;
    max-width: 250px;
    z-index: 9999;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* Mũi tên tooltip */
.error-tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 10px;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid #dc3545;
}

/* Hiển thị tooltip khi hover vào wrapper hoặc input bên trong */
.field-with-error-tooltip:hover > .error-tooltip {
    opacity: 1;
    pointer-events: auto;
}

/* Select/Dropdown improvements */
#categories {
    border-top: 1px solid #ddd;
    margin-top: 10px;
}

/* Selected Categories Tags */
.selected-categories-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 8px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-bottom: none;
    border-radius: 4px 4px 0 0;
    min-height: 40px;
    align-items: center;
}

.category-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background-color: #007bff;
    color: white;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 13px;
    animation: slideIn 0.2s ease-in-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: scale(0.8);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.btn-remove-tag {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0;
    font-size: 14px;
    font-weight: bold;
    transition: opacity 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
}

.btn-remove-tag:hover {
    opacity: 0.8;
    text-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
}

/* Category Input Wrapper */
.category-input-wrapper {
    display: flex;
    align-items: center;
    min-height: 38px;
    padding: 6px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    margin-bottom: 8px;
}

.category-input-wrapper:hover {
    border-color: #80bdff;
}

.category-input-wrapper:focus-within {
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.category-input-content {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
    min-height: 24px;
}

.selected-tags-inline {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.tag-inline {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #007bff;
    color: white;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 13px;
    white-space: nowrap;
}

.btn-remove-inline {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0;
    font-size: 12px;
    font-weight: bold;
    width: 14px;
    height: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s;
}

.btn-remove-inline:hover {
    opacity: 0.8;
}

.placeholder-text {
    color: #999;
    font-size: 14px;
}

.dropdown-icon {
    margin-left: 8px;
    color: #666;
    font-size: 12px;
    flex-shrink: 0;
}

/* Category Input */
.category-input {
    margin-bottom: 8px;
}

.category-input:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.categories-select {
    border-radius: 4px;
    margin-top: 8px;
    animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
