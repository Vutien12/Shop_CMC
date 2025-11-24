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
                                <input 
                                    v-if="product.thumbnail" 
                                    type="hidden" 
                                    name="thumbnail" 
                                    :value="product.thumbnail"
                                >

                                <img
                                    :src="placeholderImage"
                                    class="placeholder-image"
                                    alt="Placeholder"
                                    id="placeholder-image"
                                    style="cursor: pointer;"
                                    @click="triggerFileInput"
                                >
                                <input 
                                    type="file" 
                                    name="thumbnail" 
                                    id="thumbnail" 
                                    class="form-control" 
                                    style="display: none;"
                                    @change="handleFileChange"
                                    ref="fileInput"
                                    accept="image/*"
                                >
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
            this.form.media.splice(index, 1);
            this.showMediaPicker = true;
            
            // Clear file input
            if (this.$refs.fileInput) {
                this.$refs.fileInput.value = '';
            }
        },

        triggerFileInput() {
            this.$refs.fileInput.click();
        },

        handleFileChange(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();

            reader.onload = (e) => {
                const imagePath = e.target.result;

                // Thêm ảnh mới vào đầu danh sách
                this.form.media.unshift({
                    path: imagePath,
                    file: file,
                    isNew: true,
                });

                this.showMediaPicker = false;
            };

            reader.readAsDataURL(file);
        },
    },
};
</script>
