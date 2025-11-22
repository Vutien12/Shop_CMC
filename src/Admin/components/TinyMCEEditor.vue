<template>
    <div class="tinymce-wrapper">
        <Editor
            :api-key="apiKey"
            :init="editorConfig"
            v-model="content"
            @input="handleInput"
        />
    </div>
</template>

<script>
import { ref, watch } from 'vue';
import Editor from '@tinymce/tinymce-vue';

export default {
    name: 'TinyMCEEditor',
    components: {
        Editor
    },
    props: {
        modelValue: {
            type: String,
            default: ''
        },
        height: {
            type: Number,
            default: 350
        }
    },
    emits: ['update:modelValue', 'change'],
    setup(props, { emit }) {
        const content = ref(props.modelValue);
        const apiKey = 'cfy8qxfif7xhurpo8wuiw0jygns85n4xv0sov5nbzu4n82d0';
        
        const editorConfig = {
            height: props.height,
            menubar: false,
            branding: false,
            statusbar: true,
            toolbar_mode: 'sliding',
            content_style: 'body { color: #333333; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 14px; }',
            plugins: [
                'lists', 'link', 'table', 'image', 'media', 'paste', 
                'autosave', 'autolink', 'quickbars', 'wordcount', 
                'code', 'fullscreen'
            ],
            toolbar: 'styleselect | bold italic underline strikethrough blockquote | bullist numlist | alignleft aligncenter alignright alignjustify | outdent indent | forecolor removeformat | table | link | code fullscreen',
            quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
            paste_data_images: true,
            automatic_uploads: false,
            relative_urls: false,
            remove_script_host: false,
            convert_urls: true,
        };
        
        watch(() => props.modelValue, (newValue) => {
            if (newValue !== content.value) {
                content.value = newValue;
            }
        });
        
        const handleInput = () => {
            emit('update:modelValue', content.value);
            emit('change', content.value);
        };
        
        return {
            content,
            apiKey,
            editorConfig,
            handleInput
        };
    }
};
</script>

<style scoped>
.tinymce-wrapper {
    width: 100%;
}
</style>
