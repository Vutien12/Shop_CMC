<template>
  <section class="content-header clearfix">
    <h3>{{ isEditMode ? 'Edit' : 'Create' }} Variation</h3>

    <ol class="breadcrumb">
      <li>
        <a href="#" class="breadcrumb-home-icon" @click.prevent="$router.push({ name: 'admin.dashboard' })">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 18V15" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M10.07 2.81997L3.13999 8.36997C2.35999 8.98997 1.85999 10.3 2.02999 11.28L3.35999 19.24C3.59999 20.66 4.95999 21.81 6.39999 21.81H17.6C19.03 21.81 20.4 20.65 20.64 19.24L21.97 11.28C22.13 10.3 21.63 8.98997 20.86 8.36997L13.93 2.82997C12.86 1.96997 11.13 1.96997 10.07 2.81997Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </a>
      </li>

      <li><a href="#" @click.prevent="$router.push({ name: 'admin.variations.index' })">Variations</a></li>
      <li class="active">{{ isEditMode ? 'Edit' : 'Create' }} Variation</li>
    </ol>
  </section>

  <section class="content">
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
                        :key="option.id"
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
  </section>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { createVariation, getVariationById, updateVariation, attachFileToVariationValue } from '@/api/variationApi';
import SelectImage from '@/Media/SelectImage.vue';

const router = useRouter();
const route = useRoute();
const formSubmitting = ref(false);
const loading = ref(false);

// File manager state
const isFileManagerOpen = ref(false);
const currentImageIndex = ref(null); // Track which value row is selecting image

// Kiểm tra có phải edit mode không
const isEditMode = computed(() => !!route.params.id);

const form = reactive({
  name: "",
  type: "",
  values: [
    {
      id: Date.now(),
      label: "",
      color: "", // Ban đầu để rỗng để hiển thị checkerboard
      image: null,
      imagePreview: null, // URL for preview
      imageFileId: null, // File ID for API attachment
    },
  ],
});

const colorInputs = ref([]);

// Hàm tạo style cho button màu
const getColorButtonStyle = (color) => {
  const isValidHex = color && /^#[0-9A-Fa-f]{6}$/.test(color); // Kiểm tra mã màu hex hợp lệ
  return {
    backgroundImage: isValidHex
      ? 'none'
      : 'repeating-linear-gradient(45deg, #aaa 25%, transparent 25%, transparent 75%, #aaa 75%, #aaa), repeating-linear-gradient(45deg, #aaa 25%, #fff 25%, #fff 75%, #aaa 75%, #aaa)',
    backgroundColor: isValidHex ? color : 'transparent', // Chỉ áp dụng màu nếu hex hợp lệ
    backgroundSize: isValidHex ? 'auto' : '8px 8px, 8px 8px', // Chỉ cần khi có checkerboard
    backgroundPosition: isValidHex ? 'auto' : '0 0, 4px 4px', // Chỉ cần khi có checkerboard
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

// Mở color picker khi click button màu
const openColorPicker = (index) => {
  if (colorInputs.value[index]) {
    colorInputs.value[index].click();
  }
};

// Thêm dòng mới
const addRow = () => {
  form.values.push({
    id: Date.now() + Math.random(),
    label: "",
    color: "", // Ban đầu để rỗng để hiển thị checkerboard
    image: null,
    imagePreview: null,
    imageFileId: null,
  });
};

// Xóa dòng
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
    form.values[index].image = media.path; // Store path as value
  }
  closeFileManager();
};

const removeImage = (index) => {
  form.values[index].imagePreview = null;
  form.values[index].imageFileId = null;
  form.values[index].image = null;
};

// Load variation data nếu đang edit
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

      // Populate form với data từ API
      form.name = data.name;
      form.type = data.type.toLowerCase();

      // Map variationValues
      form.values = data.variationValues.map((v, index) => {
        const value = {
          id: v.id || Date.now() + index,
          label: v.label,
          color: (data.type.toLowerCase() === 'color') ? v.value : '',
          image: null,
          imagePreview: null,
          imageFileId: null,
        };

        // If type is image, set preview
        if (data.type.toLowerCase() === 'image' && v.value) {
          value.image = v.value;
          value.imagePreview = v.value;
        }

        return value;
      });
    } else {
      alert('Failed to load variation');
      await router.push({ name: 'admin.variations.index' });
    }
  } catch (error) {
    console.error('Error loading variation:', error);
    alert('Error loading variation. Redirecting to list...');
    await router.push({ name: 'admin.variations.index' });
  } finally {
    loading.value = false;
  }
};

// Lưu form - gọi API thực tế
const saveForm = async () => {
  // Validate form
  if (!form.name.trim()) {
    alert('Please enter variation name');
    return;
  }

  if (!form.type) {
    alert('Please select variation type');
    return;
  }

  if (form.values.length === 0 || !form.values.some(v => v.label.trim())) {
    alert('Please add at least one value with a label');
    return;
  }

  formSubmitting.value = true;

  try {
    // Chuẩn bị dữ liệu theo format API
    const variationType = form.type.charAt(0).toUpperCase() + form.type.slice(1); // Text, Color, Image

    // Xử lý variationValues dựa trên type
    const variationValues = form.values
      .filter(v => v.label.trim()) // Chỉ lấy values có label
      .map(v => {
        console.log('Processing value:', v); // Debug log

        // Nếu type là Color, value là mã màu
        if (form.type === 'color') {
          return {
            label: v.label,
            value: v.color || '#000000' // value là mã màu hex
          };
        }

        // Nếu type là Text hoặc Image, value là slug từ label
        return {
          label: v.label,
          value: v.label.toLowerCase().replace(/\s+/g, '_')
        };
      });

    const variationData = {
      name: form.name,
      type: variationType,
      isGlobal: true,
      variationValues: variationValues
    };

    console.log('Creating variation:', variationData);

    // Gọi API create hoặc update tùy theo mode
    const response = isEditMode.value
      ? await updateVariation(route.params.id, variationData)
      : await createVariation(variationData);

    if (response.code === 200) {
      // Nếu type là Image, attach images cho variation values
      if (form.type === 'image' && response.result?.variationValues) {
        const variationValues = response.result.variationValues;

        // Attach images for each value that has imageFileId
        const attachPromises = form.values
          .filter(v => v.imageFileId && v.label.trim())
          .map((v) => {
            // Find corresponding variation value ID from response
            const matchingValue = variationValues.find(vv => vv.label === v.label);
            if (matchingValue && matchingValue.id) {
              return attachFileToVariationValue({
                fileId: v.imageFileId,
                entityId: matchingValue.id,
                entityType: 'VARIATION_VALUE',
                zone: 'VARIATION'
              });
            }
            return Promise.resolve();
          });

        // Wait for all attachments to complete
        await Promise.all(attachPromises);
      }

      alert(`Variation ${isEditMode.value ? 'updated' : 'created'} successfully!`);
      await router.push({ name: 'admin.variations.index' });
    } else {
      alert(`Failed to ${isEditMode.value ? 'update' : 'create'} variation: ` + (response.message || 'Unknown error'));
    }
  } catch (error) {
    console.error(`Error ${isEditMode.value ? 'updating' : 'creating'} variation:`, error);
    alert(`Error ${isEditMode.value ? 'updating' : 'creating'} variation. Please try again.`);
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
