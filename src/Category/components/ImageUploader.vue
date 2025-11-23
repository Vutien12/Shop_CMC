<template>
    <div class="single-image-wrapper">
        <h4>{{ title }}</h4>
        <button
            type="button"
            class="image-picker btn btn-default"
            @click="openFileManager"
        >
            <i class="fa fa-folder-open m-r-5"></i>Browse
        </button>
        <div class="clearfix"></div>
        <div class="single-image image-holder-wrapper clearfix">
            <div
                class="image-holder"
                :class="{ placeholder: !modelValue }"
            >
                <i v-if="!modelValue" class="fa fa-picture-o"></i>
                <template v-else>
                    <img :src="modelValue" :alt="title">
                    <button
                        type="button"
                        class="btn-remove-image"
                        @click="removeImage"
                    >
                        <i class="fa fa-times"></i>
                    </button>
                </template>
            </div>
        </div>
    </div>

    <!-- File Manager Modal -->
    <SelectImage
        :isOpen="isFileManagerOpen"
        @close="closeFileManager"
        @select="handleImageSelect"
    />
</template>

<script>
import { ref } from 'vue';
import SelectImage from '../../Media/SelectImage.vue';

export default {
    name: 'ImageUploader',
    components: {
        SelectImage
    },
    props: {
        title: {
            type: String,
            required: true
        },
        modelValue: {
            type: String,
            default: null
        }
    },
    emits: ['update:modelValue', 'update:fileId'],
    setup(props, { emit }) {
        const isFileManagerOpen = ref(false);

        const openFileManager = () => {
            isFileManagerOpen.value = true;
        };

        const closeFileManager = () => {
            isFileManagerOpen.value = false;
        };

        const handleImageSelect = (media) => {
            emit('update:modelValue', media.path);
            emit('update:fileId', media.id);
        };

        const removeImage = () => {
            emit('update:modelValue', null);
            emit('update:fileId', null);
        };

        return {
            isFileManagerOpen,
            openFileManager,
            closeFileManager,
            handleImageSelect,
            removeImage
        };
    }
};
</script>

<style scoped>
.single-image-wrapper {
    margin-bottom: 30px;
}

.single-image-wrapper h4 {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 600;
}

.image-picker {
    margin-bottom: 15px;
}

.clearfix::after {
    content: "";
    display: table;
    clear: both;
}

.image-holder-wrapper {
    margin-top: 10px;
}

.image-holder {
    width: 200px;
    height: 200px;
    border: 2px dashed #d2d6de;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    border-radius: 3px;
}

.image-holder.placeholder {
    background-color: #f9f9f9;
}

.image-holder i {
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
    background: rgba(255, 0, 0, 0.8);
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;
    font-size: 12px;
    transition: background 0.2s;
}

.btn-remove-image:hover {
    background: rgba(255, 0, 0, 1);
}
</style>
