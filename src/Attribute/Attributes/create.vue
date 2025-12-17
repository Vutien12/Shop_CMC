<template>
  <div class="attribute-create-page">
    <PageBreadcrumb
      :title="isEditMode ? 'Edit Attribute' : 'Create Attribute'"
      :breadcrumbs="[
        { label: 'Attributes', to: { name: 'admin.attributes.index' } },
        { label: isEditMode ? 'Edit' : 'Create Attribute' },
      ]"
    />
    <form @submit.prevent="handleSubmit" class="form-horizontal">
      <div class="accordion-content clearfix">
        <!-- Left Sidebar -->
        <div class="col-lg-3 col-md-4">
          <div class="accordion-box">
            <div class="panel-group" id="AttributeTabs">
              <div class="panel panel-default">
                <div class="panel-heading">
                  <h4 class="panel-title">
                    <a>Attribute information</a>
                  </h4>
                </div>

                <div id="attribute_information" class="panel-collapse collapse in">
                  <div class="panel-body">
                    <ul class="accordion-tab nav nav-tabs">
                      <li :class="{ active: activeTab === 'general' }">
                        <a href="#general" @click.prevent="activeTab = 'general'">General</a>
                      </li>
                      <li :class="{ active: activeTab === 'values' }">
                        <a href="#values" @click.prevent="activeTab = 'values'">Values</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

                <!-- Right Content -->
                <div class="col-lg-9 col-md-8">
                    <div class="accordion-box-content">
                        <div class="tab-content clearfix">
                            <!-- General Tab -->
                            <div class="tab-pane fade" :class="{ 'in active': activeTab === 'general' }" id="general">
                                <h4 class="tab-content-title">General</h4>
                                
                                <div class="form-group-wrapper">
                                    <label for="attribute_set_id" class="form-label">
                                        Attribute set
                                        <span class="text-red">*</span>
                                    </label>
                                    <div class="form-input-wrapper">
                                        <select
                                            v-model="form.attribute_set_id"
                                            name="attribute_set_id"
                                            class="form-control"
                                            id="attribute_set_id"
                                        >
                                            <option value="">Please select</option>
                                            <option 
                                                v-for="set in attributeSets" 
                                                :key="set.id" 
                                                :value="String(set.id)"
                                            >
                                                {{ set.name }}
                                            </option>
                                        </select>
                                    </div>
                                </div>

                <div class="form-group-wrapper">
                  <label for="name" class="form-label">
                    Name
                    <span class="text-red">*</span>
                  </label>
                  <div class="form-input-wrapper">
                    <input
                      v-model="form.name"
                      name="name"
                      class="form-control"
                      id="name"
                      type="text"
                      placeholder="Enter attribute name"
                    />
                  </div>
                </div>

                <div class="form-group-wrapper">
                  <label for="categories" class="form-label">Categories</label>
                  <div class="form-input-wrapper">
                    <div class="field-with-error-tooltip">
                      <!-- Input to trigger dropdown with selected tags inside -->
                      <div class="category-input-wrapper" @click="toggleCategoryDropdown">
                        <div class="category-input-content">
                          <!-- Selected categories as tags inside input -->
                          <div v-if="form.categories.length > 0" class="selected-tags-inline">
                            <span v-for="catId in form.categories" :key="catId" class="tag-inline">
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
                                        </div>
                                    </div>
                                </div>

                <div class="form-group-wrapper">
                  <label for="is_filterable" class="form-label">Filterable</label>
                  <div class="form-input-wrapper">
                    <div class="checkbox">
                      <input
                        type="checkbox"
                        v-model="form.is_filterable"
                        name="is_filterable"
                        id="is_filterable"
                        value="1"
                      />
                      <label for="is_filterable">Use this attribute for filtering products</label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Values Tab -->
              <div
                class="tab-pane fade"
                :class="{ 'in active': activeTab === 'values' }"
                id="values"
              >
                <h4 class="tab-content-title">Values</h4>

                <div id="attribute-values-wrapper">
                  <div class="table-responsive">
                    <table class="table table-bordered">
                      <thead>
                        <tr>
                          <th width="50"></th>
                          <th>Value</th>
                          <th width="100"></th>
                        </tr>
                      </thead>

                      <tbody id="attribute-values">
                        <tr v-for="(value, index) in form.values" :key="index">
                          <td class="text-center">
                            <span class="drag-handle">
                              <i class="fa">&#xf142;</i>
                              <i class="fa">&#xf142;</i>
                            </span>
                          </td>

                          <td>
                            <div class="form-group" style="margin-bottom: 0">
                              <input
                                v-model="value.value"
                                type="text"
                                class="form-control"
                                placeholder="Enter value"
                              />
                            </div>
                          </td>

                          <td class="text-center">
                            <button
                              type="button"
                              class="btn btn-default delete-row"
                              @click="removeValue(index)"
                              title="Delete value"
                            >
                              <i class="fa fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <button type="button" class="btn btn-default" @click="addNewValue">
                    Add new value
                  </button>
                </div>
              </div>

              <div class="form-group">
                <div class="col-md-10 col-md-offset-2">
                  <button type="submit" class="btn btn-primary" :disabled="loading">
                    {{ loading ? 'Saving...' : 'Save' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useNotification } from '@/Admin/composables/useNotification.js'
import PageBreadcrumb from '@/Admin/view/components/PageBreadcrumb.vue'
import {
  getAttribute,
  createAttribute,
  updateAttribute,
  getAttributeSets,
} from '@/api/attributeApi.js'

export default {
  name: 'AttributeCreate',
  components: {
    PageBreadcrumb,
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const notification = useNotification()
    const loading = ref(false)
    const activeTab = ref('general')
    const isCategoryDropdownOpen = ref(false)

    // Data from API
    const attributeSets = ref([])
    const categories = ref([])

        const form = reactive({
            attribute_set_id: '',
            name: '',
            categories: [],
            is_filterable: false,
            values: [
                { value: '' }
            ]
        });


        const isEditMode = computed(() => !!route.params.id);

        // Load attribute sets and categories from API
        const loadInitialData = async () => {
            try {
                const [attributeSetsRes, categoriesRes] = await Promise.all([
                    getAttributeSets(),
                    getCategories()
                ]);

                if (attributeSetsRes.code === 200) {
                    const items = attributeSetsRes.result?.content ?? attributeSetsRes.result ?? [];
                    attributeSets.value = items;
                }

                if (categoriesRes.code === 200) {
                    const items = categoriesRes.result?.content ?? categoriesRes.result ?? [];
                    categories.value = items;
                }
            } catch (error) {
                console.error('Failed to load initial data:', error);
                notification.error('Lỗi!', 'Không thể tải dữ liệu ban đầu');
            }
        };

        // Category methods
        const getCategoryTree = () => {
            // Build flattened tree with level info for indentation
            const tree = [];
            const buildTree = (cats, level = 0) => {
                cats.forEach(category => {
                    tree.push({
                        id: category.id,
                        name: category.name,
                        parentId: category.parentId,
                        level: level
                    });

                    // Find children
                    const children = categories.value.filter(c => c.parentId === category.id);
                    if (children.length > 0) {
                        buildTree(children, level + 1);
                    }
                });
            };

            // Start with root categories (parentId = null)
            const rootCategories = categories.value.filter(c => c.parentId === null);
            buildTree(rootCategories);

            return tree;
        };

        const getIndent = (level) => {
            // Create indentation using pipe symbols like FleetCart: ¦–– ¦–– Category
            if (level === 0) return '';
            return '¦–– '.repeat(level);
        };

        const getCategoryName = (categoryId) => {
            const categoryTree = getCategoryTree();
            const found = categoryTree.find(c => c.id === categoryId);
            return found ? found.name : '';
        };

    const removeCategory = (categoryId) => {
      const index = form.categories.indexOf(categoryId)
      if (index > -1) {
        form.categories.splice(index, 1)
      }
    }

    const handleCategoriesChange = (event) => {
      const selectedOptions = Array.from(event.target.selectedOptions, (option) => {
        const val = option.value
        return isNaN(val) ? val : parseInt(val)
      })
      form.categories = selectedOptions
    }

    const toggleCategoryDropdown = (event) => {
      event.stopPropagation()
      isCategoryDropdownOpen.value = !isCategoryDropdownOpen.value
    }

    const handleClickOutside = (event) => {
      const container = document.querySelector('.field-with-error-tooltip')
      if (container && !container.contains(event.target)) {
        isCategoryDropdownOpen.value = false
      }
    }

    const addNewValue = () => {
      form.values.push({ value: '' })
    }

    const removeValue = (index) => {
      if (form.values.length > 1) {
        form.values.splice(index, 1)
      }
    }

        const loadAttribute = async () => {
            if (!isEditMode.value) return;

            loading.value = true;
            try {
                const response = await getAttribute(route.params.id);
                const data = response.result || response;
                
                console.log('Loaded attribute data:', data);
                
                // Convert to appropriate types to match select/multi-select values
                // Backend returns attributeSet as object, extract id
                if (data.attributeSet && data.attributeSet.id) {
                    form.attribute_set_id = String(data.attributeSet.id);
                } else if (data.attributeSetId) {
                    form.attribute_set_id = String(data.attributeSetId);
                } else {
                    form.attribute_set_id = '';
                }
                
                form.name = data.name || '';
                
                // Backend returns categories as array of objects, extract ids
                if (data.categories && Array.isArray(data.categories)) {
                    form.categories = data.categories.map(cat => 
                        typeof cat === 'object' ? cat.id : (typeof cat === 'number' ? cat : parseInt(cat))
                    );
                } else if (data.categoryIds && Array.isArray(data.categoryIds)) {
                    form.categories = data.categoryIds.map(id => 
                        typeof id === 'number' ? id : parseInt(id)
                    );
                } else {
                    form.categories = [];
                }
                
                form.is_filterable = data.filterable || false;
                
                // Map attribute values
                if (data.attributeValues && data.attributeValues.length > 0) {
                    form.values = data.attributeValues.map(v => ({ 
                        value: v.value || '' 
                    }));
                } else {
                    form.values = [{ value: '' }];
                }
                
                console.log('Form after loading:', {
                    attribute_set_id: form.attribute_set_id,
                    categories: form.categories,
                    values: form.values.length
                });
            } catch (error) {
                console.error('Failed to load attribute:', error);
                notification.error('Lỗi!', 'Không thể tải attribute');
                router.push({ name: 'admin.attributes.index' });
            } finally {
                loading.value = false;
            }
        };

    const handleSubmit = async () => {
      // Validation
      if (!form.attribute_set_id) {
        notification.error('Validation error', 'Please select attribute set')
        activeTab.value = 'general'
        return
      }

      if (!form.name || form.name.trim() === '') {
        notification.error('Validation error', 'Please enter attribute name')
        activeTab.value = 'general'
        return
      }

            loading.value = true;
            try {
                // Map frontend form to backend DTO format
                const data = {
                    name: form.name,
                    attributeSetId: parseInt(form.attribute_set_id),
                    categoryIds: form.categories.map(id => parseInt(id)),
                    filterable: form.is_filterable,
                    isGlobal: false,
                    attributeValues: form.values
                        .filter(v => v.value.trim() !== '')
                        .map(v => ({ value: v.value }))
                };

        if (isEditMode.value) {
          await updateAttribute(route.params.id, data)
          notification.success('Success', 'Attribute updated successfully')
        } else {
          await createAttribute(data)
          notification.success('Success', 'Attribute created successfully')
        }

        router.push({ name: 'admin.attributes.index' })
      } catch (error) {
        console.error('Error saving attribute:', error)
        notification.error(
          'Error',
          'Failed to save attribute: ' + (error.response?.data?.message || error.message),
        )
      } finally {
        loading.value = false
      }
    }

        onMounted(async () => {
            await loadInitialData();
            await loadAttribute();
            // Close dropdown when clicking outside
            document.addEventListener('click', handleClickOutside);
        });

        // Clean up event listener
        const onBeforeUnmount = () => {
            document.removeEventListener('click', handleClickOutside);
        };

        return {
            form,
            loading,
            activeTab,
            isEditMode,
            isCategoryDropdownOpen,
            attributeSets,
            categories,
            addNewValue,
            removeValue,
            handleSubmit,
            getCategoryTree,
            getIndent,
            getCategoryName,
            removeCategory,
            handleCategoriesChange,
            toggleCategoryDropdown
        };
    }
  }
</script>

<style scoped>
.attribute-create-page {
  padding: 20px;
}

.accordion-content {
  display: flex;
  gap: 20px;
  margin: 0 -15px;
}

.col-lg-3,
.col-lg-9,
.col-md-4,
.col-md-8 {
  padding: 0 15px;
}

.accordion-box {
  background: transparent;
  border: none;
  margin-top: 40px;
}

.panel-default {
  border: none;
  box-shadow: none;
}

.panel-heading {
  background: transparent;
  border-bottom: none;
  padding: 15px 20px;
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.panel-title a {
  color: #333;
  text-decoration: none;
}

.panel-body {
  padding: 0;
}

.accordion-tab {
  list-style: none;
  margin: 0;
  padding: 0;
  border: none;
  display: block;
}

.accordion-tab li {
  border-bottom: 1px solid #f0f0f0;
  display: block;
  width: 100%;
}

.accordion-tab li:last-child {
  border-bottom: none;
}

.accordion-tab li a {
  display: block;
  padding: 12px 20px;
  color: #666;
  text-decoration: none;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.accordion-tab li:first-child a {
  border-top-left-radius: 4px;
}

.accordion-tab li:last-child a {
  border-bottom-left-radius: 4px;
}

.accordion-tab li a:hover {
  background: #f9f9f9;
  color: #333;
}

.accordion-tab li.active a {
  background: #fff;
  color: #0071a1;
  border-left-color: #0071a1;
  font-weight: 500;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.accordion-box-content {
  background: transparent;
  border: none;
  padding: 20px;
}

.tab-content-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -15px;
}

.col-md-8 {
  width: 66.67%;
  padding: 0 15px;
}

.form-group-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 20px;
}

.form-label {
  min-width: 120px;
  font-weight: 500;
  color: #374151;
  font-size: 13px;
  white-space: nowrap;
  flex-shrink: 0;
}

.form-input-wrapper {
  flex: 1;
  max-width: 500px;
}

.form-horizontal .form-group {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  margin-left: 2px;
  margin-right: 2px;
}

.control-label {
  padding-top: 7px;
  font-weight: 500;
  color: #333;
}

.col-md-3 {
  width: 25%;
  padding: 0 15px;
}

.col-md-9 {
  width: 75%;
  padding: 0 15px;
}

.col-md-10 {
  width: 83.33%;
  padding: 0 15px;
}

.col-md-offset-2 {
  margin-left: 16.67%;
}

.text-left {
  text-align: left;
}

.text-red {
  color: #dc2626;
}

.m-l-5 {
  margin-left: 5px;
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

select.form-control[multiple] {
  height: auto;
  min-height: 120px;
}

.checkbox {
  margin-top: 7px;
}

.checkbox input[type='checkbox'] {
  margin-right: 8px;
}

.checkbox label {
  font-weight: normal;
  color: #666;
}

/* Table Styles */
.table-responsive {
  margin-bottom: 20px;
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
}

.table tbody td {
  padding: 12px 16px;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
}

.text-center {
  text-align: center;
}

.drag-handle {
  cursor: move;
  color: #363535;
  display: inline-block;
}

.drag-handle i {
  display: inline-block;
  margin: 0 0.5px;
  line-height: 1;
}

.delete-row {
  padding: 6px 12px;
}

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

.btn-primary {
  color: white;
  background: #2b6cb0;
}

.btn-primary:hover:not(:disabled) {
  background: #2c5282;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

/* Category Input Wrapper */
.category-input-wrapper {
  display: flex;
  align-items: center;
  min-height: 38px;
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  margin-bottom: 8px;
}

.category-input-wrapper:hover {
  border-color: #4299e1;
}

.category-input-wrapper:focus-within {
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
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
  background: #2b6cb0;
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
  font-size: 13px;
}

.field-with-error-tooltip {
  position: relative;
  display: inline-block;
  width: 100%;
  overflow: visible !important;
}

.categories-select {
  border-radius: 6px;
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

.clearfix::after {
  content: '';
  display: table;
  clear: both;
}

@media (max-width: 992px) {
  .accordion-content {
    flex-direction: column;
  }

  .col-lg-3,
  .col-lg-9 {
    width: 100%;
  }
}
</style>
