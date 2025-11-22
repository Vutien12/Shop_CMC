<template>
    <div class="single-image-wrapper">
        <h4>{{ title }}</h4>
        <button 
            type="button" 
            class="image-picker btn btn-default" 
            @click="$refs.fileInput.click()"
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
                <img v-else :src="modelValue" :alt="title">
            </div>
        </div>
        <input 
            ref="fileInput"
            type="file" 
            @change="handleFileChange" 
            accept="image/*" 
            style="display: none"
        >
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    name: 'ImageUploader',
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
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const fileInput = ref(null);

        const handleFileChange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    emit('update:modelValue', e.target.result);
                };
                reader.readAsDataURL(file);
            }
        };

        return {
            fileInput,
            handleFileChange
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
</style>
