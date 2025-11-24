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
            <div class="row">
                <div class="col-md-12">
                    <draggable
                        animation="200"
                        class="product-media-grid"
                        force-fallback="true"
                        handle=".handle"
                        :move="preventLastSlideDrag"
                        :list="form.media"
                    >
                        <div class="media-grid-item handle" v-for="(media, index) in form.media" :key="index">
                            <div class="image-holder">
                                <img :src="media.path" alt="product media">

                                <button type="button" class="btn remove-image" @click="removeMedia(index)">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M6.00098 17.9995L17.9999 6.00053" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M17.9999 17.9995L6.00098 6.00055" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div class="media-grid-item media-picker" id="media-picker" v-show="showMediaPicker">
                            <div class="image-holder">
                                <button
                                    type="button"
                                    class="btn-add-media"
                                    @click="openFileManager"
                                >
                                    <i class="fa fa-plus"></i>
                                    <span>Add Image</span>
                                </button>
                            </div>
                        </div>
                    </draggable>
                </div>
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
            placeholderImage: `${this.baseUrl}build/assets/placeholder_image.png`,
        };
    },
    mounted() {
        // Nếu có thumbnail cũ, thêm vào đầu media list
        if (this.product.thumbnail) {
            this.form.media.unshift({
                path: this.product.thumbnail,
                isOld: true,
            });
            this.showMediaPicker = false;
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

        preventLastSlideDrag() {
            // Prevent dragging the media picker
            return true;
        },

        removeMedia(index) {
            this.$emit('remove-media', index);
        },

        openFileManager() {
            this.$emit('open-file-manager', 'gallery');
        },
    },
};
</script>

<style scoped>
/* Media Grid Layout */
.product-media-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
    padding: 10px 0;
}

.media-grid-item {
    position: relative;
    aspect-ratio: 1;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    background-color: #f9f9f9;
    transition: all 0.3s ease;
}

.media-grid-item:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.3s ease;
    padding: 0;
}

.media-grid-item:hover .btn.remove-image {
    opacity: 1;
}

.btn.remove-image:hover {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.btn-add-media {
    background: none;
    border: 2px dashed #ddd;
    width: 100%;
    height: 100%;
    min-height: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #999;
}

.btn-add-media:hover {
    border-color: #007bff;
    color: #007bff;
    background-color: #f8f9fa;
}

.btn-add-media i {
    font-size: 24px;
}

.btn-add-media span {
    font-size: 14px;
}
</style>
