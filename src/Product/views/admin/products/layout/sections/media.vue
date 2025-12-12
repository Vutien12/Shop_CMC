<template>
    <div v-if="section === 'media'">
        <div class="box-header">
            <h5>{{ trans('product::products.group.media') }}</h5>

            <div class="drag-handle">
                <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
                <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
            </div>
        </div>

        <div class="box-body">
            <!-- Main Thumbnail Section -->
            <div class="media-section main-thumbnail-section">
                <div class="section-label">
                    <i class="fa fa-star"></i> Main Image (Thumbnail)
                </div>
                <div class="main-thumbnail-wrapper">
                    <div v-if="thumbnailImage" class="main-thumbnail-item">
                        <div class="image-holder">
                            <img :src="thumbnailImage.path" alt="Main thumbnail">
                            <div class="main-badge">Main</div>
                            <button type="button" class="btn remove-image" @click="removeThumbnail">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M6.00098 17.9995L17.9999 6.00053" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M17.9999 17.9995L6.00098 6.00055" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div v-else class="main-thumbnail-placeholder">
                        <button
                            type="button"
                            class="btn-add-main-thumbnail"
                            @click="openFileManagerForThumbnail"
                        >
                            <img :src="placeholderImage" alt="Add image" class="placeholder-icon">
                        </button>
                    </div>
                </div>
            </div>

            <!-- Gallery Section -->
            <div class="media-section gallery-section">
                <div class="section-label">
                    <i class="fa fa-images"></i> Gallery Images (Optional)
                </div>
                <draggable
                    animation="200"
                    class="product-media-grid"
                    force-fallback="true"
                    handle=".handle"
                    :list="form.gallery"
                    @end="onDragEnd"
                >
                    <div class="media-grid-item handle" v-for="(media, index) in galleryImages" :key="media.id || index">
                        <div class="image-holder">
                            <img :src="media.path" alt="Product gallery">
                            <button type="button" class="btn remove-image" @click="removeGalleryImage(index)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M6.00098 17.9995L17.9999 6.00053" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M17.9999 17.9995L6.00098 6.00055" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div class="media-grid-item media-picker">
                        <div class="image-holder">
                            <button
                                type="button"
                                class="btn-add-media"
                                @click="openFileManagerForGallery"
                            >
                                <img :src="placeholderImage" alt="Add more" class="placeholder-icon-small">
                            </button>
                        </div>
                    </div>
                </draggable>
            </div>
        </div>
    </div>
</template>

<script>
import { VueDraggableNext } from 'vue-draggable-next';
import products from '@/Product/lang/en/products.json';

export default {
    name: 'MediaSection',
    components: {
        draggable: VueDraggableNext,
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
        product: {
            type: Object,
            default: () => ({}),
        },
        baseUrl: {
            type: String,
            default: '/',
        },
    },
    data() {
        return {
            showMediaPicker: true,
            placeholderImage: new URL('@/Admin/assets/images/placeholder_image.png', import.meta.url).href,
        };
    },
    computed: {
        thumbnailImage() {
            // Use form.thumbnail directly (not from media array)
            return this.form.thumbnail || null;
        },
        galleryImages() {
            // Use form.gallery directly
            return this.form.gallery || [];
        }
    },
    methods: {
        trans(key) {
            const translationFiles = {
                'product::products': products,
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

        onDragEnd() {
            // Draggable modifies form.gallery directly, emit to sync
            this.$emit('update-gallery', [...this.form.gallery]);
        },

        removeThumbnail() {
            // Remove only the first image (thumbnail)
            this.$emit('remove-media', 0);
        },

        removeGalleryImage(galleryIndex) {
            console.log('[Remove Gallery] Click detected', { 
                index: galleryIndex, 
                gallery: this.form.gallery,
                length: this.form.gallery ? this.form.gallery.length : 0 
            });
            // Emit gallery index directly (0-based in gallery array)
            this.$emit('remove-gallery', galleryIndex);
            console.log('[Remove Gallery] Event emitted');
        },

        openFileManagerForThumbnail() {
            this.$emit('open-file-manager', 'thumbnail');
        },

        openFileManagerForGallery() {
            this.$emit('open-file-manager', 'gallery');
        },
    },
};
</script>

<style scoped>
/* Media Sections */
.media-section {
    margin-bottom: 25px;
}

.media-section:last-child {
    margin-bottom: 0;
}

.section-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    font-size: 14px;
    color: #333;
    margin-bottom: 12px;
}

.section-label i {
    color: #007bff;
}

/* Main Thumbnail Section */
.main-thumbnail-section {
    padding-bottom: 20px;
    border-bottom: 2px solid #e9ecef;
}

.main-thumbnail-wrapper {
    max-width: 300px;
}

.main-thumbnail-item {
    position: relative;
    aspect-ratio: 1;
    border: 3px solid #007bff;
    border-radius: 12px;
    overflow: hidden;
    background-color: #f9f9f9;
    transition: all 0.3s ease;
}

.main-thumbnail-item:hover {
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
}

.main-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    z-index: 2;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.main-thumbnail-placeholder {
    aspect-ratio: 1;
    border: 2px dashed #a6a7a9;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-add-main-thumbnail {
    background: white;
    border: none;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #007bff;
    border-radius: 8px;
}

.btn-add-main-thumbnail:hover {
    transform: scale(1.05);
    color: #0056b3;
}

.btn-add-main-thumbnail .placeholder-icon {
    width: 150px;
    height: 150px;
    object-fit: contain;
    opacity: 0.6;
}

.btn-add-main-thumbnail:hover .placeholder-icon {
    opacity: 0.8;
}

.btn-add-main-thumbnail span {
    font-size: 14px;
    font-weight: 600;
}

/* Gallery Section */
.gallery-section {
    padding-top: 20px;
}

.product-media-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
    padding: 10px 0;
}

.media-grid-item {
    position: relative;
    aspect-ratio: 1;
    border: 2px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    background-color: #f9f9f9;
    transition: all 0.3s ease;
    cursor: move;
}

.media-grid-item:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-color: #999;
}

.media-picker {
    cursor: default;
}

.image-holder {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.image-holder img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}

.btn.remove-image {
    position: absolute;
    top: 5px;
    right: 5px;
    background: rgba(255, 255, 255, 0.95);
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.3s ease;
    padding: 0;
    z-index: 10;
}

.main-thumbnail-item:hover .btn.remove-image,
.media-grid-item:hover .btn.remove-image {
    opacity: 1;
}

.btn.remove-image:hover {
    background: #fff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.btn-add-media {
    background: none;
    border: 2px dashed #ddd;
    width: 100%;
    height: 100%;
    min-height: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #999;
}

.btn-add-media:hover {
    border-color: #007bff;
    color: #007bff;
    background-color: rgba(0, 123, 255, 0.05);
}

.btn-add-media .placeholder-icon-small {
    width: 80px;
    height: 80px;
    object-fit: contain;
    opacity: 0.5;
}

.btn-add-media:hover .placeholder-icon-small {
    opacity: 0.7;
}

.btn-add-media span {
    font-size: 12px;
    font-weight: 500;
}

/* Drag indicator */
.handle {
    cursor: move;
}

.handle::before {
    content: '';
    position: absolute;
    top: 5px;
    left: 5px;
    width: 20px;
    height: 20px;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 3px;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
}

.handle:hover::before {
    opacity: 1;
}
</style>
