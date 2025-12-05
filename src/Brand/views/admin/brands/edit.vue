<template>
    <section class="content">
        <form @submit.prevent="update" class="form-horizontal" id="brand-edit-form">
            <div class="accordion-content clearfix">
                <!-- Left Sidebar -->
                <div class="col-lg-3 col-md-4">
                    <div class="accordion-box">
                        <div class="panel-group" id="BrandTabs">
                            <div class="panel panel-default">
                                <div class="panel-heading">
                                    <h4 class="panel-title">
                                        <a>Brand Information</a>
                                    </h4>
                                </div>

                                <div id="brand_information" class="panel-collapse collapse in">
                                    <div class="panel-body">
                                        <ul class="accordion-tab nav nav-tabs">
                                            <li :class="{ active: activeTab === 'general' }">
                                                <a href="#general" @click.prevent="activeTab = 'general'">General</a>
                                            </li>
                                            <li :class="{ active: activeTab === 'images' }">
                                                <a href="#images" @click.prevent="activeTab = 'images'">Images</a>
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
                                <div class="row">
                                    <div class="col-md-8">
                                        <div class="form-group" :class="{ 'has-error': errors.name }">
                                            <label for="name" class="col-md-3 control-label text-left">
                                                Name<span class="m-l-5 text-red">*</span>
                                            </label>
                                            <div class="col-md-9">
                                                <input
                                                    name="name"
                                                    class="form-control"
                                                    id="name"
                                                    v-model="form.name"
                                                    type="text"
                                                    @input="clearError('name')"
                                                >
                                                <span v-if="errors.name" class="help-block text-red">{{ errors.name }}</span>
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label for="is_active" class="col-md-3 control-label text-left">Status</label>
                                            <div class="col-md-9">
                                                <div class="checkbox">
                                                    <input
                                                        type="checkbox"
                                                        name="is_active"
                                                        id="is_active"
                                                        v-model="form.is_active"
                                                        value="1"
                                                    >
                                                    <label for="is_active">Enable the brand</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Images Tab -->
                            <div class="tab-pane fade" :class="{ 'in active': activeTab === 'images' }" id="images">
                                <h4 class="tab-content-title">Images</h4>

                                <!-- Logo Upload -->
                                <div class="single-image-wrapper">
                                    <h4>Logo</h4>

                                    <button type="button" class="image-picker btn btn-default" @click="openFileManager()">
                                        <i class="fa fa-folder-open m-r-5"></i>Browse
                                    </button>

                                    <div class="clearfix"></div>

                                    <div class="single-image image-holder-wrapper clearfix">
                                        <div v-if="logoPreview" class="image-holder">
                                            <img :src="logoPreview" alt="Logo preview">
                                            <button type="button" class="btn-remove-image" @click="removeLogo">
                                                <i class="fa fa-times"></i>
                                            </button>
                                        </div>
                                        <div v-else class="image-holder placeholder">
                                            <i class="fa fa-picture-o"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Form Footer -->
                            <div class="form-group">
                                <div class="col-md-10 col-md-offset-2">
                                    <button type="submit" class="btn btn-primary" :disabled="loading">
                                        {{ loading ? 'Updating...' : 'Update' }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </section>

    <!-- File Manager Modal -->
    <SelectImage
        :isOpen="isFileManagerOpen"
        @close="closeFileManager"
        @select="handleImageSelect"
    />
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import SelectImage from '../../../../Media/SelectImage.vue';
import { getBrandById, updateBrand, attachFileToBrand, getBrandFiles, deleteEntityFile } from '@/api/brandApi';

const router = useRouter();
const route = useRoute();
const activeTab = ref('general');
const loading = ref(false);
const logoPreview = ref(null);
const isFileManagerOpen = ref(false);
const selectedLogoFileId = ref(null);
const existingLogoEntityFileId = ref(null);
const shouldRemoveLogo = ref(false);

const form = reactive({
    name: '',
    is_active: false,
    logo: null
});

const errors = reactive({
    name: ''
});

const clearError = (field) => {
    errors[field] = '';
};

const openFileManager = () => {
    isFileManagerOpen.value = true;
};

const closeFileManager = () => {
    isFileManagerOpen.value = false;
};

const handleImageSelect = (media) => {
    console.log('BrandEdit: Logo selected', {
        mediaId: media.id,
        mediaPath: media.path,
        mediaFilename: media.filename
    });

    form.logo = media.path;
    logoPreview.value = media.path;
    selectedLogoFileId.value = media.id;
    shouldRemoveLogo.value = false; // Reset removal flag
};

const removeLogo = () => {
    // Mark for removal on save
    shouldRemoveLogo.value = true;
    form.logo = null;
    logoPreview.value = null;
    selectedLogoFileId.value = null;
};


const loadBrand = async () => {
    const brandId = route.params.id;

    try {
        loading.value = true;

        // Load brand data
        const response = await getBrandById(brandId);

        if (response.code === 200 && response.result) {
            const brand = response.result;

            // Load into form
            form.name = brand.name;
            form.is_active = brand.isActive;

            // Reset removal flag
            shouldRemoveLogo.value = false;

            // Reset selected file ID (only set when user selects NEW image)
            selectedLogoFileId.value = null;

            // Load logo if exists in brand
            if (brand.fileLogo) {
                logoPreview.value = brand.fileLogo; // fileLogo is already a string URL
                form.logo = brand.fileLogo;
            }

            // Load entity files (logo)
            try {
                const logoFiles = await getBrandFiles(brandId, 'BRAND', 'LOGO');
                if (logoFiles.code === 200 && logoFiles.result?.length > 0) {
                    const logoFile = logoFiles.result[0];
                    existingLogoEntityFileId.value = logoFile.id;
                    logoPreview.value = logoFile.path || logoPreview.value;
                    // Don't set selectedLogoFileId - only for NEW selections
                }
            } catch (error) {
                console.error('Failed to load entity files:', error);
            }
        }
    } catch (error) {
        console.error('Failed to load brand:', error);
        alert('Failed to load brand data. Please try again.');
    } finally {
        loading.value = false;
    }
};

const update = async () => {
    // Reset errors
    errors.name = '';

    // Validation
    if (!form.name.trim()) {
        errors.name = 'The name field is required.';
        activeTab.value = 'general';
        return;
    }

    loading.value = true;

    try {
        const brandId = route.params.id;

        // Debug: Log all state before update
        console.log('BrandEdit: Update starting with state:', {
            brandId,
            selectedLogoFileId: selectedLogoFileId.value,
            existingLogoEntityFileId: existingLogoEntityFileId.value,
            shouldRemoveLogo: shouldRemoveLogo.value
        });

        // Update brand data
        const brandData = {
            name: form.name,
            isActive: form.is_active,
            fileLogo: null
        };

        await updateBrand(brandId, brandData);

        // Handle LOGO changes
        if (shouldRemoveLogo.value && existingLogoEntityFileId.value) {
            // User wants to remove logo
            try {
                await deleteEntityFile(existingLogoEntityFileId.value);
                console.log('Logo removed successfully');
            } catch (error) {
                console.error('Failed to delete logo:', error);
                // Continue even if delete fails (might already be deleted)
            }
        } else if (selectedLogoFileId.value) {
            // User selected a new logo
            // Delete old logo entity file if exists
            if (existingLogoEntityFileId.value) {
                try {
                    await deleteEntityFile(existingLogoEntityFileId.value);
                    console.log('Old logo deleted');
                } catch (error) {
                    console.error('Failed to delete old logo:', error);
                    // Continue even if delete fails
                }
            }

            // Attach new logo
            const logoData = {
                fileId: selectedLogoFileId.value,
                entityId: brandId,
                entityType: 'BRAND',
                zone: 'LOGO'
            };
            console.log('BrandEdit: Attaching logo with data:', logoData);
            await attachFileToBrand(logoData);
            console.log('New logo attached');
        }


        alert('Brand updated successfully!');

        // Navigate to brands list
        router.push({ name: 'admin.brands.index' });
    } catch (error) {
        console.error('Error updating brand:', error);
        alert('Error updating brand. Please try again.');
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadBrand();
});
</script>

<style scoped>
/* Accordion Layout */
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
}

/* Content Box */
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

/* Form Styles */
.form-horizontal .form-group {
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
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
    color: #e74c3c;
}

.m-l-5 {
    margin-left: 5px;
}

.m-r-5 {
    margin-right: 5px;
}

.form-control {
    height: 38px;
    padding: 6px 12px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.form-control:focus {
    border-color: #0071a1;
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 113, 161, 0.1);
}

textarea.form-control {
    height: auto;
    resize: vertical;
}

.has-error .form-control {
    border-color: #e74c3c;
}

.help-block {
    display: block;
    margin-top: 5px;
    font-size: 13px;
}

/* Checkbox */
.checkbox {
    margin: 0;
}

.checkbox input[type="checkbox"] {
    margin-right: 8px;
}

.checkbox label {
    font-weight: normal;
    cursor: pointer;
}

/* Image Upload */
.single-image-wrapper {
    margin-bottom: 30px;
}

.single-image-wrapper h4 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 10px;
}

.image-picker {
    margin-bottom: 15px;
}

.image-holder-wrapper {
    margin-top: 15px;
}

.image-holder {
    position: relative;
    width: 200px;
    height: 200px;
    border: 2px dashed #ddd;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fafafa;
}

.image-holder.placeholder {
    cursor: pointer;
}

.image-holder.placeholder i {
    font-size: 48px;
    color: #ccc;
}

.image-holder img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.btn-remove-image {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 24px;
    height: 24px;
    background: #e74c3c;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
}

.btn-remove-image:hover {
    background: #c0392b;
}

.media-picker-divider {
    height: 1px;
    background: #e0e0e0;
    margin: 30px 0;
}

/* Buttons */
.btn {
    padding: 8px 16px;
    font-size: 14px;
    border-radius: 4px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-default {
    background: #fff;
    border-color: #ddd;
    color: #333;
}

.btn-default:hover {
    background: #f5f5f5;
}

.btn-primary {
    background: #0071a1;
    color: white;
    border-color: #0071a1;
}

.btn-primary:hover:not(:disabled) {
    background: #005a7f;
    border-color: #005a7f;
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Utility Classes */
.clearfix::after {
    content: "";
    display: table;
    clear: both;
}

/* Responsive */
@media (max-width: 991px) {
    .accordion-content {
        flex-direction: column;
    }
}
</style>
