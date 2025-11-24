<template>
    <div class="content-wrapper">
        <div class="page-header">
            <div>
                <h2 class="main-content-title tx-24 mg-b-5">
                    {{ isEditMode ? 'Edit Blog Post' : 'Create Blog Post' }}
                </h2>
            </div>
        </div>

        <form @submit.prevent="handleSubmit">
            <div class="row">
                <!-- Left Column -->
                <div class="col-lg-8">
                    <!-- General Section -->
                    <div class="box">
                        <div class="box-header">
                            <h5>General</h5>
                        </div>
                        <div class="box-body">
                            <div class="form-group row">
                                <label for="title" class="col-sm-12 control-label text-left">
                                    Title <span class="text-red">*</span>
                                </label>
                                <div class="col-sm-12">
                                    <input
                                        type="text"
                                        id="title"
                                        class="form-control"
                                        v-model="form.title"
                                        @input="generateSlug"
                                    />
                                    <span v-if="errors.has('title')" class="help-block text-red">
                                        {{ errors.get('title') }}
                                    </span>
                                </div>
                            </div>

                            <div class="form-group row">
                                <label for="description" class="col-sm-12 control-label text-left">
                                    Description <span class="text-red">*</span>
                                </label>
                                <div class="col-sm-12">
                                    <TinyMCEEditor
                                        v-model="form.description"
                                        :height="350"
                                        @change="() => errors.clear('description')"
                                    />
                                    <span v-if="errors.has('description')" class="help-block text-red">
                                        {{ errors.get('description') }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column -->
                <div class="col-lg-4">
                    <!-- Featured Image Section -->
                    <div class="box">
                        <div class="box-header">
                            <h5>Featured Image</h5>
                        </div>
                        <div class="box-body">
                            <div class="featured-image-uploader">
                                <div v-if="form.featured_image_preview" class="image-preview">
                                    <img :src="form.featured_image_preview" alt="Featured Image" />
                                    <button type="button" class="btn btn-sm btn-danger remove-image" @click="removeFeaturedImage">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path d="M6.00098 17.9995L17.9999 6.00053" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M17.9999 17.9995L6.00098 6.00055" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </button>
                                </div>
                                <div v-else class="image-placeholder" @click="triggerFileInput">
                                    <img src="@/Admin/assets/images/placeholder_image.png" alt="Upload" class="placeholder-image" />
                                </div>
                                <input
                                    type="file"
                                    ref="featuredImageInput"
                                    style="display: none;"
                                    accept="image/*"
                                    @change="handleFeaturedImageChange"
                                />
                            </div>
                            <span v-if="errors.has('featured_image')" class="help-block text-red">
                                {{ errors.get('featured_image') }}
                            </span>
                        </div>
                    </div>

                    <!-- Publish Section -->
                    <div class="box">
                        <div class="box-header">
                            <h5>Publish</h5>
                        </div>
                        <div class="box-body">
                            <div class="form-group">
                                <label for="publish_status">Publish Status <span class="text-red">*</span></label>
                                <select
                                    id="publish_status"
                                    class="form-control"
                                    v-model="form.publish_status"
                                >
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                    <option value="scheduled">Scheduled</option>
                                    <option value="pending">Pending Review</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
            <div class="page-form-footer" style="">
                <button type="button" class="btn btn-default save-btn" @click="save" style="width: 60px">
                    Save
                </button>
                <button type="button" class="btn btn-primary save-exit-btn" @click="saveAndExit" style="width: 100px">
                    Save &amp; Exit
                </button>
            </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TinyMCEEditor from '@/Admin/components/TinyMCEEditor.vue';

class Errors {
    constructor() {
        this.errors = {};
    }

    has(field) {
        return Object.prototype.hasOwnProperty.call(this.errors, field);
    }

    get(field) {
        if (this.errors[field]) {
            return this.errors[field][0];
        }
        return null;
    }

    set(errors) {
        this.errors = errors;
    }

    clear(field) {
        if (field) {
            delete this.errors[field];
        } else {
            this.errors = {};
        }
    }
}

export default {
    name: 'BlogCreate',
    components: {
        TinyMCEEditor
    },
    setup() {
        const route = useRoute();
        const router = useRouter();
        const loading = ref(false);
        const featuredImageInput = ref(null);
        
        const isEditMode = computed(() => !!route.params.id);
        
        const form = reactive({
            title: '',
            description: '',
            featured_image: null,
            featured_image_preview: null,
            publish_status: 'published',
            user_id: 1 // TODO: Get from auth
        });

        const blog = ref({});
        const errors = reactive(new Errors());

        const generateSlug = () => {
            // Slug generation can be added if needed
        };

        const triggerFileInput = () => {
            featuredImageInput.value.click();
        };

        const handleFeaturedImageChange = (event) => {
            const file = event.target.files[0];
            if (!file) return;

            // Check file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                errors.set({ featured_image: ['File size must be less than 5MB'] });
                return;
            }

            errors.clear('featured_image');
            form.featured_image = file;

            const reader = new FileReader();
            reader.onload = (e) => {
                form.featured_image_preview = e.target.result;
            };
            reader.readAsDataURL(file);
        };

        const removeFeaturedImage = () => {
            form.featured_image = null;
            form.featured_image_preview = null;
            if (featuredImageInput.value) {
                featuredImageInput.value.value = '';
            }
        };

        const formatDate = (dateString) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        const loadBlog = async () => {
            if (!isEditMode.value) return;

            loading.value = true;
            try {
                // TODO: Replace with actual API call
                blog.value = {
                    id: route.params.id,
                    title: 'Sample Blog Title',
                    description: '<p>Sample blog description</p>',
                    featured_image: 'https://via.placeholder.com/800x600',
                    publish_status: 'published'
                };

                // Populate form
                Object.keys(form).forEach(key => {
                    if (key === 'featured_image_preview' && blog.value.featured_image) {
                        form.featured_image_preview = blog.value.featured_image;
                    } else if (blog.value[key] !== undefined) {
                        form[key] = blog.value[key];
                    }
                });
            } catch (error) {
                console.error('Error loading blog:', error);
            } finally {
                loading.value = false;
            }
        };

        const save = async () => {
            loading.value = true;
            errors.clear();

            try {
                console.log('Save clicked - Form data:', form);
                await new Promise(resolve => setTimeout(resolve, 1000));
                // Stay on the page after save
                alert('Blog saved successfully!');
            } catch (error) {
                if (error.response && error.response.data.errors) {
                    errors.set(error.response.data.errors);
                }
                console.error('Error saving blog:', error);
            } finally {
                loading.value = false;
            }
        };

        const saveAndExit = async () => {
            loading.value = true;
            errors.clear();

            try {
                console.log('Save & Exit clicked - Form data:', form);
                await new Promise(resolve => setTimeout(resolve, 1000));
                router.push({ name: 'admin.blogs.index' });
            } catch (error) {
                if (error.response && error.response.data.errors) {
                    errors.set(error.response.data.errors);
                }
                console.error('Error saving blog:', error);
            } finally {
                loading.value = false;
            }
        };

        const handleSubmit = async () => {
            // Default form submit action
            await saveAndExit();
        };

        onMounted(() => {
            loadBlog();
        });

        return {
            form,
            blog,
            errors,
            loading,
            isEditMode,
            featuredImageInput,
            generateSlug,
            triggerFileInput,
            handleFeaturedImageChange,
            removeFeaturedImage,
            formatDate,
            handleSubmit,
            save,
            saveAndExit
        };
    }
};
</script>

<style scoped>
.content-wrapper {
    padding: 20px;
}

.box {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

.box-header {
    padding: 15px 20px;
    border-bottom: 1px solid #e5e7eb;
}

.box-header h5 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
}

.box-body {
    padding: 20px;
}

.featured-image-uploader {
    width: 100%;
}

.image-preview {
    position: relative;
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e5e7eb;
}

.image-preview img {
    width: 100%;
    height: auto;
    display: block;
}

.remove-image {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 8px;
    border-radius: 4px;
}

.image-placeholder {
    border: 2px dashed #e5e7eb;
    border-radius: 8px;
    padding: 0;
    cursor: pointer;
    transition: all 0.3s;
    background: #fafafa;
    width: 150px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.image-placeholder:hover {
    border-color: #d1d5db;
    background: #f5f5f5;
}

.placeholder-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 10px;
}

.placeholder-content {
    position: relative;
    display: inline-block;
}

.placeholder-content svg {
    display: block;
}

.placeholder-content .plus-icon {
    position: absolute;
    top: -8px;
    right: -8px;
    background: white;
    border-radius: 50%;
    padding: 2px;
}

.publish-info {
    margin: 15px 0;
    padding: 15px;
    background: #f9fafb;
    border-radius: 6px;
}

.info-item {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    font-size: 14px;
    color: #6b7280;
}

.info-item:last-child {
    margin-bottom: 0;
}

.info-item i {
    color: #9ca3af;
}

.form-actions {
    margin-top: 20px;
}

.form-actions .btn-block {
    width: 100%;
}

.help-block {
    display: block;
    margin-top: 5px;
    font-size: 13px;
}

.text-red {
    color: #dc2626;
}

.page-form-footer {
    position: fixed;
    bottom: 0;
    left: 250px;
    right: 0;
    background: #f5f5f5;
    padding: 15px 30px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    z-index: 1000;
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
}

.page-form-footer .btn {
    min-width: 120px;
}

/* Add padding to content wrapper to prevent footer overlap */
.content-wrapper {
    padding-bottom: 80px;
}

/* Responsive - adjust for mobile/tablet */
@media (max-width: 768px) {
    .page-form-footer {
        left: 0;
        padding: 15px;
    }
}
</style>
