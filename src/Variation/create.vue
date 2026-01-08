<template>
  <div class="variation-create-page">
    <PageBreadcrumb
      :title="isEditMode ? 'Edit Variation' : 'Create Variation'"
      :breadcrumbs="[
        { label: 'Variations', route: { name: 'admin.variations.index' } },
        { label: isEditMode ? 'Edit' : 'Create' }
      ]"
    />

    <div class="box">
      <div class="box-body">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading variation...</p>
        </div>

        <form v-else class="form" @submit.prevent="saveForm">
          <!-- General -->
          <div class="row has-variation-type">
            <div class="col-lg-2 col-sm-2">
              <h5>General</h5>
            </div>
            <div class="col-lg-7 col-sm-10">
              <div class="row">
                <div class="col-sm-6">
                  <div class="form-group">
                    <label for="name">Name <span class="text-red">*</span></label>
                    <input
                      type="text"
                      id="name"
                      v-model="form.name"
                      class="form-control"
                      required
                    />
                  </div>
                </div>

                <div class="col-sm-6">
                  <div class="form-group">
                    <label for="type">Type <span class="text-red">*</span></label>
                    <select
                      id="type"
                      v-model="form.type"
                      class="form-control custom-select-black"
                      required
                    >
                      <option value="">Please Select</option>
                      <option value="text">Text</option>
                      <option value="color">Color</option>
                      <option value="image">Image</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Values -->
          <div class="row">
            <div class="col-lg-2 col-sm-2">
              <h5>Values</h5>
            </div>
            <div class="col-lg-7 col-sm-10">
              <div class="variation-values clearfix">
                <div class="table-responsive">
                  <table
                    class="options table table-bordered"
                    :class="`type-${form.type}`"
                  >
                    <thead>
                      <tr>
                        <th style="width: 50px;"></th>
                        <th style="width: 75%;">Label <span class="text-red">*</span></th>
                        <th v-if="form.type === 'color'" style="width: 25%;">Color <span class="text-red">*</span></th>
                        <th v-if="form.type === 'image'" style="width: 25%;">Image <span class="text-red">*</span></th>
                        <th style="width: 80px;"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(option, index) in form.values"
                        :key="option.isExisting ? option.id : option.__uid"
                        class="option-row"
                      >
                        <td class="text-center">
                          <span class="drag-handle"><i class="fa"></i><i class="fa"></i></span>
                        </td>

                        <td>
                          <input
                            type="text"
                            v-model="option.label"
                            class="form-control"
                            style="min-width: 100px; width: 100%;"
                            required
                          />
                        </td>

                        <td v-if="form.type === 'color'">
                          <div style="display: flex; align-items: center; border: 1px solid #ddd; border-radius: 4px; overflow: hidden; padding: 0px; min-width: 150px;">
                            <input
                              type="text"
                              v-model="option.color"
                              class="form-control"
                              placeholder="#000000"
                              style="flex: 1; min-width: 80px; border: none; outline: none; border-radius: 0; padding: 6px 8px; font-size: 14px;"
                            />
                            <button
                              type="button"
                              :style="getColorButtonStyle(option.color)"
                              @click="openColorPicker(index)"
                              :title="'Pick color: ' + (option.color || 'Select a color')"
                            ></button>
                            <input
                              type="color"
                              v-model="option.color"
                              :ref="el => colorInputs[index] = el"
                              style="opacity: 0; position: absolute; pointer-events: none; width: 0; height: 0;"
                            />
                          </div>
                        </td>

                        <td v-if="form.type === 'image'">
                          <div class="image-picker-cell">
                            <button
                              type="button"
                              class="btn btn-sm btn-default image-picker-btn"
                              @click="openImagePicker(index)"
                            >
                              <i class="fa fa-folder-open"></i> Browse
                            </button>
                            <div v-if="option.imagePreview" class="image-preview-small">
                              <img :src="option.imagePreview" alt="Preview">
                              <button
                                type="button"
                                class="btn-remove-image-small"
                                @click="removeImage(index)"
                                title="Remove image"
                              >
                                <i class="fa fa-times"></i>
                              </button>
                            </div>
                          </div>
                        </td>

                        <td class="text-center">
                          <button
                            type="button"
                            class="btn btn-default"
                            @click="removeRow(index)"
                          >
                            <i class="fa fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <button type="button" class="btn btn-default" @click="addRow">
                  Add Row
                </button>
              </div>
            </div>
          </div>

          <!-- Save -->
          <div class="row">
            <div class="col-lg-7 col-lg-offset-2 col-md-12 text-right">
              <button type="submit" class="btn btn-primary" :disabled="formSubmitting">
                <span v-if="!formSubmitting">Save</span>
                <span v-else>Saving...</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- File Manager Modal -->
    <SelectImage
      :isOpen="isFileManagerOpen"
      @close="closeFileManager"
      @select="handleImageSelect"
    />
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useNotification } from '@/Admin/composables/useNotification.js';
import { createVariation, getVariationById, updateVariation, attachFileToVariationValue } from '@/api/variationApi';
import { deleteEntityFile } from '@/api';
import SelectImage from '@/Media/SelectImage.vue';
import PageBreadcrumb from '@/Admin/view/components/PageBreadcrumb.vue';

const router = useRouter();
const route = useRoute();
const notification = useNotification();
const formSubmitting = ref(false);
const loading = ref(false);

// File manager state
const isFileManagerOpen = ref(false);
const currentImageIndex = ref(null); // Track which value row is selecting image

// Check if it's edit mode
const isEditMode = computed(() => !!route.params.id);

const nextUid = ref(1);
const form = reactive({
  name: "",
  type: "",
  values: [
    {
      __uid: nextUid.value++,
      id: null,
      isExisting: false,
      label: "",
      color: "", // Initially empty to display checkerboard
      image: null,
      imagePreview: null, // URL for preview
      imageFileId: null, // File ID for API attachment
      hasNewImage: false, // Flag to track newly selected image
    },
  ],
});

const colorInputs = ref([]);

// Function to create style for color button
const getColorButtonStyle = (color) => {
  const isValidHex = color && /^#[0-9A-Fa-f]{6}$/.test(color); // Check valid hex color code
  return {
    backgroundImage: isValidHex
      ? 'none'
      : 'repeating-linear-gradient(45deg, #aaa 25%, transparent 25%, transparent 75%, #aaa 75%, #aaa), repeating-linear-gradient(45deg, #aaa 25%, #fff 25%, #fff 75%, #aaa 75%, #aaa)',
    backgroundColor: isValidHex ? color : 'transparent', // Apply color only if valid hex
    backgroundSize: isValidHex ? 'auto' : '8px 8px, 8px 8px', // Only needed for checkerboard
    backgroundPosition: isValidHex ? 'auto' : '0 0, 4px 4px', // Only needed for checkerboard
    width: '28px',
    height: '28px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    flexShrink: 0,
    marginLeft: '6px',
    marginRight: '4px'
  };
};

// Open color picker when clicking color button
const openColorPicker = (index) => {
  if (colorInputs.value[index]) {
    colorInputs.value[index].click();
  }
};

// Add new row
const addRow = () => {
  form.values.push({
    __uid: nextUid.value++,
    id: null,
    isExisting: false,
    label: "",
    color: "", // Initially empty to display checkerboard
    image: null,
    imagePreview: null,
    imageFileId: null,
    hasNewImage: false,
  });
};

// Remove row
const removeRow = (index) => {
  if (form.values.length > 1) {
    form.values.splice(index, 1);
  } else {
    alert('At least one value is required');
  }
};

// File Manager Functions
const openImagePicker = (index) => {
  currentImageIndex.value = index;
  isFileManagerOpen.value = true;
};

const closeFileManager = () => {
  isFileManagerOpen.value = false;
  currentImageIndex.value = null;
};

const handleImageSelect = (media) => {
  if (currentImageIndex.value !== null) {
    const index = currentImageIndex.value;
    form.values[index].imagePreview = media.path;
    form.values[index].imageFileId = media.id;
    form.values[index].image = media.path;
    form.values[index].hasNewImage = true;
  }
  closeFileManager();
};

const removeImage = async (index) => {
  const valueItem = form.values[index];

  // Delete via API if image has entity file ID
  if (valueItem.currentImageEntityId) {
    try {
      console.log('[Variation] Deleting image entity file:', valueItem.currentImageEntityId);
      await deleteEntityFile(valueItem.currentImageEntityId);
      console.log('[Variation] Image deleted successfully');
      notification.success('Success!', 'Image removed successfully');
    } catch (error) {
      console.error('[Variation] Error deleting image:', error);
      notification.error('Error!', 'Failed to delete image from server');
      return;
    }
  }

  const wasExistingValue = isEditMode.value && valueItem.id && typeof valueItem.id === 'number';
  const hadPreviousImage = valueItem.imagePreview !== null;

  valueItem.imagePreview = null;
  valueItem.imageFileId = null;
  valueItem.image = null;
  valueItem.currentImageEntityId = null;

  if (wasExistingValue && hadPreviousImage) {
    valueItem.hasNewImage = true;
  } else {
    valueItem.hasNewImage = false;
  }
};

// Load variation data if in edit mode
const loadVariation = async () => {
  if (!isEditMode.value) {
    loading.value = false;
    return;
  }

  loading.value = true;
  try {
    const variationId = route.params.id;
    console.log('Loading variation:', variationId);

    const response = await getVariationById(variationId);

    if (response.code === 200 && response.result) {
      const data = response.result;

      form.name = data.name;
      form.type = data.type.toLowerCase();

      // Map variationValues
      form.values = data.variationValues.map((v) => {
        const value = {
          __uid: v.id || nextUid.value++,
          id: v.id,
          isExisting: !!v.id,
          label: v.label,
          color: (data.type.toLowerCase() === 'color') ? v.value : '',
          image: null,
          imagePreview: null,
          imageFileId: null,
          currentImageEntityId: null, // Track entity file ID for deletion
          hasNewImage: false,
        };

        // If type is image, handle new object structure with id and url
        if (data.type.toLowerCase() === 'image' && v.image) {
          value.currentImageEntityId = v.image.id;
          value.image = v.image.url;
          value.imagePreview = v.image.url;
        }

        return value;
      });
    } else {
      notification.error('Error!', 'Failed to load variation data');
      await router.push({ name: 'admin.variations.index' });
    }
  } catch (error) {
    console.error('Error loading variation:', error);
    notification.error('Error!', 'Failed to load variation');
    await router.push({ name: 'admin.variations.index' });
  } finally {
    loading.value = false;
  }
};

// Save form - call actual API
const saveForm = async () => {
  // Validate form
  if (!form.name.trim()) {
    notification.warning('Warning!', 'Please enter the variant name.');
    return;
  }

  if (!form.type) {
    notification.warning('Warning!', 'Please select the variant type.');
    return;
  }

  if (form.values.length === 0 || !form.values.some(v => v.label.trim())) {
    notification.warning('Warning!', 'Please add at least one labeled value.');
    return;
  }

  formSubmitting.value = true;

  try {
    // Prepare data according to API format
    const variationType = form.type.charAt(0).toUpperCase() + form.type.slice(1); // Text, Color, Image

    // Process variationValues based on type
    const variationValues = form.values
      .filter(v => v.label.trim()) // Only get values with label
      .map(v => {
        console.log('Processing value:', v); // Debug log

        const valueObj = {};

        // If editing and value has ID (existing value), include ID
        if (isEditMode.value && Number.isInteger(v.id)) {
          valueObj.id = v.id;
        }

        valueObj.label = v.label;

        // Process value field based on type and mode
        if (form.type === 'color') {
          // Type Color: value is color code
          valueObj.value = v.color || '#000000';
        } else if (form.type === 'image') {
          // Like Product: send back image URL if unchanged, null if deleted, placeholder if new
          if (v.hasNewImage) {
            // Has changes
            if (v.imageFileId) {
              // New image selected → send placeholder (will be updated by entity-files)
              valueObj.value = v.label.toLowerCase().replace(/\s+/g, '_');
            } else {
              // Image deleted → send null or empty string
              valueObj.value = null;
            }
          } else {
            // No changes → send back current image URL (like Product)
            valueObj.value = v.image || v.imagePreview || v.label.toLowerCase().replace(/\s+/g, '_');
          }
        } else {
          // Text type
          valueObj.value = v.label.toLowerCase().replace(/\s+/g, '_');
        }
        return valueObj;
      });

    const variationData = {
      name: form.name,
      type: variationType,
      isGlobal: true,
      variationValues: variationValues
    };

    console.log('Creating variation:', variationData);

    // Call create or update API depending on mode
    const response = isEditMode.value
      ? await updateVariation(route.params.id, variationData)
      : await createVariation(variationData);

    if (response.code === 200) {
      // If type is Image, attach images for variation values
      if (form.type === 'image' && response.result?.variationValues) {
        const variationValues = response.result.variationValues;

        // ONLY attach images for values with NEW images (hasNewImage = true AND has imageFileId)
        const attachPromises = form.values
          .filter(v => v.hasNewImage && v.imageFileId && v.label.trim())
          .map((v) => {
            // If editing and has old ID, use old ID
            // If no old ID (new value), find by label
            let targetId;

            if (isEditMode.value && v.id && typeof v.id === 'number') {
              targetId = v.id;
            } else {
              const matchingValue = variationValues.find(vv => vv.label === v.label);
              targetId = matchingValue?.id;
            }

            if (targetId) {
              console.log(`Attaching NEW file ${v.imageFileId} to variation value ${targetId}`);
              return attachFileToVariationValue({
                fileId: v.imageFileId,
                entityId: targetId,
                entityType: 'VARIATION_VALUE',
                zone: 'VARIATION'
              });
            }
            return Promise.resolve();
          });

        // Wait for all attachments to complete
        if (attachPromises.length > 0) {
          await Promise.all(attachPromises);
          console.log(`Attached ${attachPromises.length} new image(s)`);
        }
      }

      notification.success('Success!', `Variation ${isEditMode.value ? 'updated' : 'created'} successfully`);
      await router.push({ name: 'admin.variations.index' });
    } else {
      notification.error('Error!', `Failed to ${isEditMode.value ? 'update' : 'create'} variation: ` + (response.message || 'Unknown error'));
    }
  } catch (error) {
    console.error(`Error ${isEditMode.value ? 'updating' : 'creating'} variation:`, error);
    notification.error('Error!', `Failed to ${isEditMode.value ? 'update' : 'create'} variation`);
  } finally {
    formSubmitting.value = false;
  }
};

// Load data khi component mount
onMounted(() => {
  loadVariation();
});
</script>

<style scoped>
.variation-create-page {
  padding: 20px;
}

.text-red {
  color: red;
}
.drag-handle {
  cursor: move;
}
.table th,
.table td {
  vertical-align: middle;
}
.btn-default {
  background-color: #f5f5f5;
  border: 1px solid #ccc;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0071a1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Breadcrumb styles */
.content-header {
  padding: 15px 15px;
  border-bottom: 1px solid #f4f4f4;
  margin-bottom: 20px;
}

.content-header h3 {
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: 400;
}

.breadcrumb {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  background: transparent;
  font-size: 14px;
}

.breadcrumb li {
  display: inline-block;
}

.breadcrumb li + li:before {
  content: "/";
  padding: 0 8px;
  color: #ccc;
}

.breadcrumb li a {
  color: #337ab7;
  text-decoration: none;
}

.breadcrumb li a:hover {
  color: #23527c;
  text-decoration: underline;
}

.breadcrumb li.active {
  color: #777;
}

.breadcrumb-home-icon {
  display: inline-flex;
  align-items: center;
}

.breadcrumb-home-icon svg {
  width: 20px;
  height: 20px;
}

/* Image picker styles */
.image-picker-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.image-picker-btn {
  white-space: nowrap;
}

.image-preview-small {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.image-preview-small img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-remove-image-small {
  position: absolute;
  top: 2px;
  right: 2px;
  background: rgba(255, 0, 0, 0.8);
  color: white;
  border: none;
  border-radius: 3px;
  width: 20px;
  height: 20px;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.btn-remove-image-small:hover {
  background: rgba(255, 0, 0, 1);
}

.btn-remove-image-small i {
  margin: 0;
}
</style>
