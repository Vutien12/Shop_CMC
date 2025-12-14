<template>
    <div class="blog-create-page">
        <PageBreadcrumb
            :title="isEditMode ? 'Edit Blog Post' : 'Create Blog Post'"
            :breadcrumbs="[
                { label: 'Blogs', route: { name: 'admin.blogs.index' } },
                { label: isEditMode ? 'Edit' : 'Create' }
            ]"
        />

        <form @submit.prevent="handleSubmit">
            <div class="row row-gap">
                <!-- Left Column - Made wider -->
                <div class="col-lg-9 col-md-8">
                    <!-- General Section -->
                    <div class="box box-shadow">
                        <div class="box-header">
                            <h5>General Information</h5>
                        </div>
                        <div class="box-body">
                            <div class="form-group">
                                <label for="title" class="form-label">
                                    Blog Title <span class="text-red">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    class="form-control form-control-lg"
                                    v-model="form.title"
                                    @input="generateSlug"
                                    placeholder="Enter your blog title..."
                                />
                                <span v-if="errors.has('title')" class="help-block text-red">
                                    {{ errors.get('title') }}
                                </span>
                            </div>

                            <div class="form-group">
                                <label for="content" class="form-label">
                                    Content <span class="text-red">*</span>
                                </label>
                                <div class="editor-wrapper">
                                    <TinyMCEEditor
                                        v-model="form.content"
                                        :height="500"
                                        @change="() => errors.clear('content')"
                                    />
                                </div>
                                <span v-if="errors.has('content')" class="help-block text-red">
                                    {{ errors.get('content') }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column - Made narrower -->
                <div class="col-lg-3 col-md-4">
                    <!-- Featured Image Section -->
                    <div class="box box-shadow sidebar-box">
                        <div class="box-header">
                            <h5>
                                <i class="fa fa-image"></i>
                                Featured Image
                            </h5>
                        </div>
                        <div class="box-body">
                            <div class="featured-image-uploader">
                                <div v-if="form.thumbnailPreview" class="image-preview">
                                    <img :src="form.thumbnailPreview" alt="Featured" />
                                    <button type="button" class="btn btn-sm btn-danger remove-image" @click="removeFeaturedImage" title="Remove image">
                                        <i class="fa fa-times"></i>
                                    </button>
                                </div>
                                <div v-else class="image-placeholder" @click="triggerFileInput">
                                    <div class="placeholder-content">
                                        <i class="fa fa-image fa-3x"></i>
                                        <p>Select from Media Library</p>
                                        <small>Click to browse images</small>
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    ref="featuredImageInput"
                                    style="display: none;"
                                    accept="image/*"
                                    @change="handleFeaturedImageChange"
                                />
                            </div>
                            <span v-if="errors.has('thumbnail')" class="help-block text-red">
                                {{ errors.get('thumbnail') }}
                            </span>
                            <p class="image-help-text">
                                <i class="fa fa-info-circle"></i>
                                Select an image from the media library to use as the blog thumbnail.
                            </p>
                        </div>
                    </div>

                    <!-- Publish Section -->
                    <div class="box box-shadow sidebar-box">
                        <div class="box-header">
                            <h5>
                                <i class="fa fa-send"></i>
                                Publish Settings
                            </h5>
                        </div>
                        <div class="box-body">
                            <div class="form-group mb-0">
                                <label for="isPublished" class="form-label">Status <span class="text-red">*</span></label>
                                <select
                                    id="isPublished"
                                    class="form-control"
                                    v-model="form.isPublished"
                                >
                                    <option :value="true">✓ Published</option>
                                    <option :value="false">📝 Draft</option>
                                </select>
                                <small class="form-text text-muted mt-2">
                                    {{ form.isPublished ? 'This blog will be visible to everyone' : 'This blog will be saved as draft' }}
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
        <div class="page-form-footer">
            <button type="button" class="btn btn-default save-btn" @click="save" :disabled="loading">
                {{ loading ? 'Saving...' : 'Save' }}
            </button>
            <button type="button" class="btn btn-primary save-exit-btn" @click="saveAndExit" :disabled="loading">
                Save &amp; Exit
            </button>
        </div>

        <!-- File Manager Modal -->
        <SelectImage
            :isOpen="isFileManagerOpen"
            @close="closeFileManager"
            @select="handleImageSelect"
        />
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PageBreadcrumb from '@/Admin/view/components/PageBreadcrumb.vue';
import TinyMCEEditor from '@/Admin/components/TinyMCEEditor.vue';
import SelectImage from '@/Media/SelectImage.vue';
import { createBlog, updateBlog, getBlogById } from '@/api/blogApi.js';
import { attachFileToEntity } from '@/api/fileApi.js';
import { deleteEntityFile } from '@/api';

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
        PageBreadcrumb,
        TinyMCEEditor,
        SelectImage
    },
    setup() {
        const route = useRoute();
        const router = useRouter();
        const loading = ref(false);
        const featuredImageInput = ref(null);
        const isFileManagerOpen = ref(false);
        const selectedThumbnailFileId = ref(null);
        const currentThumbnailId = ref(null); // Track current thumbnail entity file ID

        const isEditMode = computed(() => !!route.params.id);

        const form = reactive({
            title: '',
            content: '',
            thumbnail: '',
            thumbnailFile: null,
            thumbnailPreview: null,
            isPublished: true
        });

        const blog = ref({});
        const errors = reactive(new Errors());

        const generateSlug = () => {
            // Slug generation can be added if needed
        };

        const triggerFileInput = () => {
            isFileManagerOpen.value = true;
        };

        const handleFeaturedImageChange = (event) => {
            const file = event.target.files[0];
            if (!file) return;

            // Check file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                errors.set({ thumbnail: ['File size must be less than 5MB'] });
                return;
            }

            errors.clear('thumbnail');
            form.thumbnailFile = file;

            const reader = new FileReader();
            reader.onload = (e) => {
                form.thumbnailPreview = e.target.result;
            };
            reader.readAsDataURL(file);
        };

        const removeFeaturedImage = async () => {
            // Delete via API if thumbnail has id
            if (currentThumbnailId.value) {
                try {
                    console.log('[Blog] Deleting thumbnail entity file:', currentThumbnailId.value);
                    await deleteEntityFile(currentThumbnailId.value);
                    console.log('[Blog] Thumbnail deleted successfully');
                } catch (error) {
                    console.error('[Blog] Error deleting thumbnail:', error);
                    alert('Failed to delete thumbnail from server');
                    return;
                }
            }

            currentThumbnailId.value = null;
            form.thumbnailFile = null;
            form.thumbnailPreview = null;
            form.thumbnail = '';
            selectedThumbnailFileId.value = null;
            if (featuredImageInput.value) {
                featuredImageInput.value.value = '';
            }
        };

        // File Manager Functions
        const closeFileManager = () => {
            isFileManagerOpen.value = false;
        };

        const handleImageSelect = (media) => {
            form.thumbnail = media.path;
            form.thumbnailPreview = media.path;
            selectedThumbnailFileId.value = media.id;
            errors.clear('thumbnail');
            closeFileManager();
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
                const response = await getBlogById(route.params.id);
                blog.value = response.data.result;

                // Populate form
                form.title = blog.value.title || '';
                form.content = blog.value.content || '';

                // Handle thumbnail as object with id and url
                if (blog.value.thumbnail) {
                    currentThumbnailId.value = blog.value.thumbnail.id;
                    form.thumbnail = blog.value.thumbnail.url;
                    form.thumbnailPreview = blog.value.thumbnail.url;
                } else {
                    currentThumbnailId.value = null;
                    form.thumbnail = '';
                    form.thumbnailPreview = null;
                }

                form.isPublished = blog.value.isPublished ?? true;
                selectedThumbnailFileId.value = null; // Only set when user selects new image
            } catch (error) {
                console.error('Error loading blog:', error);
                alert('Error loading blog: ' + (error.response?.data?.message || error.message));
            } finally {
                loading.value = false;
            }
        };

        const save = async () => {
            loading.value = true;
            errors.clear();

            try {
                // Validate required fields
                if (!form.title) {
                    errors.set({ title: ['Title is required'] });
                    loading.value = false;
                    return;
                }
                if (!form.content) {
                    errors.set({ content: ['Content is required'] });
                    loading.value = false;
                    return;
                }

                // Prepare data for API
                const blogData = {
                    title: form.title,
                    content: form.content,
                    thumbnail: form.thumbnail,
                    isPublished: form.isPublished
                };

                let blogId;
                if (isEditMode.value) {
                    await updateBlog(route.params.id, blogData);
                    blogId = route.params.id;

                    // Attach thumbnail if selected
                    if (selectedThumbnailFileId.value) {
                        await attachFileToEntity({
                            fileId: selectedThumbnailFileId.value,
                            entityId: blogId,
                            entityType: 'BLOG',
                            zone: 'THUMBNAIL'
                        });
                    }

                    alert('Blog updated successfully!');
                } else {
                    const response = await createBlog(blogData);
                    blogId = response.data.result.id;

                    // Attach thumbnail if selected
                    if (selectedThumbnailFileId.value) {
                        await attachFileToEntity({
                            fileId: selectedThumbnailFileId.value,
                            entityId: blogId,
                            entityType: 'BLOG',
                            zone: 'THUMBNAIL'
                        });
                    }

                    alert('Blog created successfully!');
                    // Update to edit mode with new blog ID
                    router.replace({ name: 'admin.blogs.edit', params: { id: blogId } });
                }
            } catch (error) {
                if (error.response?.data?.errors) {
                    errors.set(error.response.data.errors);
                }
                console.error('Error saving blog:', error);
                alert('Error saving blog: ' + (error.response?.data?.message || error.message));
            } finally {
                loading.value = false;
            }
        };

        const saveAndExit = async () => {
            loading.value = true;
            errors.clear();

            try {
                // Validate required fields
                if (!form.title) {
                    errors.set({ title: ['Title is required'] });
                    loading.value = false;
                    return;
                }
                if (!form.content) {
                    errors.set({ content: ['Content is required'] });
                    loading.value = false;
                    return;
                }

                // Prepare data for API
                const blogData = {
                    title: form.title,
                    content: form.content,
                    thumbnail: form.thumbnail,
                    isPublished: form.isPublished
                };

                let blogId;
                if (isEditMode.value) {
                    await updateBlog(route.params.id, blogData);
                    blogId = route.params.id;
                } else {
                    const response = await createBlog(blogData);
                    blogId = response.data.result.id;
                }

                // Attach thumbnail if selected
                if (selectedThumbnailFileId.value) {
                    await attachFileToEntity({
                        fileId: selectedThumbnailFileId.value,
                        entityId: blogId,
                        entityType: 'BLOG',
                        zone: 'THUMBNAIL'
                    });
                }

                router.push({ name: 'admin.blogs.index' });
            } catch (error) {
                if (error.response?.data?.errors) {
                    errors.set(error.response.data.errors);
                }
                console.error('Error saving blog:', error);
                alert('Error saving blog: ' + (error.response?.data?.message || error.message));
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
            isFileManagerOpen,
            generateSlug,
            triggerFileInput,
            handleFeaturedImageChange,
            removeFeaturedImage,
            closeFileManager,
            handleImageSelect,
            formatDate,
            handleSubmit,
            save,
            saveAndExit
        };
    }
};
</script>

<style scoped>
.blog-create-page {
    padding: 20px;
}

.content-wrapper {
    padding: 25px;
    background: #f8f9fa;
    min-height: 100vh;
}

.main-content-title {
    font-size: 28px;
    font-weight: 700;
    color: #1a202c;
    margin: 0 0 25px;
}

.row-gap {
    gap: 20px;
}

/* Box Styling */
.box {
    background: white;
    border-radius: 12px;
    margin-bottom: 20px;
    transition: all 0.3s ease;
    border: 1px solid #e2e8f0;
}

.box-shadow {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.box:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.box-header {
    padding: 18px 24px;
    border-bottom: 2px solid #f0f4f8;
    background: linear-gradient(to bottom, #fafbfc, #ffffff);
    border-radius: 12px 12px 0 0;
}

.box-header h5 {
    margin: 0;
    font-size: 17px;
    font-weight: 600;
    color: #2d3748;
    display: flex;
    align-items: center;
    gap: 10px;
}

.box-header i {
    color: #4299e1;
    font-size: 18px;
}

.box-body {
    padding: 24px;
}

.sidebar-box .box-body {
    padding: 20px;
}

/* Form Styling */
.form-group {
    margin-bottom: 24px;
}

.form-group:last-child {
    margin-bottom: 0;
}

.form-label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
}

.form-control {
    width: 100%;
    padding: 11px 15px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.2s ease;
    background: #ffffff;
}

.form-control:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.form-control-lg {
    padding: 13px 17px;
    font-size: 16px;
    font-weight: 500;
}

.form-control::placeholder {
    color: #a0aec0;
}

select.form-control {
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
    background-position: right 12px center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
    appearance: none;
    height: auto;
    min-height: 42px;
    line-height: 1.5;
}

select.form-control option {
    padding: 8px;
    line-height: 1.5;
}

.form-text {
    font-size: 13px;
    line-height: 1.5;
    display: block;
}

.text-muted {
    color: #718096;
}

.mt-2 {
    margin-top: 8px;
}

.mb-0 {
    margin-bottom: 0 !important;
}

/* Editor Wrapper */
.editor-wrapper {
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    overflow: hidden;
    transition: border-color 0.2s ease;
    background: white;
}

.editor-wrapper:focus-within {
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

/* Featured Image Uploader */
.featured-image-uploader {
    width: 100%;
}

.image-preview {
    position: relative;
    width: 100%;
    border-radius: 10px;
    overflow: hidden;
    border: 2px solid #e2e8f0;
    background: #f7fafc;
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
    padding: 8px 12px;
    border-radius: 8px;
    background: rgba(239, 68, 68, 0.95);
    border: none;
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
}

.remove-image:hover {
    background: #dc2626;
    transform: scale(1.05);
}

.image-placeholder {
    border: 2px dashed #cbd5e0;
    border-radius: 8px;
    padding: 30px 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: #f9fafb;
    text-align: center;
    min-height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.image-placeholder:hover {
    border-color: #4299e1;
    background: #eff6ff;
}

.placeholder-content {
    color: #718096;
    width: 100%;
}

.placeholder-content i {
    color: #9ca3af;
    margin-bottom: 12px;
    display: block;
}

.placeholder-content p {
    margin: 8px 0 4px;
    font-size: 14px;
    font-weight: 500;
    color: #4b5563;
}

.placeholder-content small {
    color: #9ca3af;
    font-size: 12px;
    display: block;
}

/* Help Text */
.help-block {
    display: block;
    margin-top: 6px;
    font-size: 13px;
    line-height: 1.4;
}

.text-red {
    color: #e53e3e;
    font-weight: 500;
}

.image-help-text {
    margin-top: 12px;
    margin-bottom: 0;
    font-size: 13px;
    color: #718096;
    line-height: 1.5;
}

.image-help-text i {
    color: #4299e1;
    margin-right: 4px;
}

/* Footer */
.page-form-footer {
    margin-top: 20px;
    padding: 20px;
    background: #f5f5f5;
    text-align: right;
    left: 250px;
    right: 0;
}

.page-form-footer .btn {
    margin-left: 10px;
    padding: 8px 20px;
    font-size: 14px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
}

.page-form-footer .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.page-form-footer .btn-default {
    background: #ffffff;
    color: #333;
    border: 1px solid #ddd;
}

.page-form-footer .btn-default:hover:not(:disabled) {
    background: #f8f9fa;
    border-color: #adb5bd;
}

.page-form-footer .btn-primary {
    background: #007bff;
    color: white;
}

.page-form-footer .btn-primary:hover:not(:disabled) {
    background: #0056b3;
}

/* Responsive */
@media (max-width: 768px) {
    .content-wrapper {
        padding: 15px;
        padding-bottom: 80px;
    }

    .page-form-footer {
        left: 0;
        padding: 15px;
    }

    .main-content-title {
        font-size: 22px;
    }
}

@media (max-width: 992px) {
    .col-lg-9,
    .col-lg-3 {
        flex: 0 0 100%;
        max-width: 100%;
    }
}
</style>
