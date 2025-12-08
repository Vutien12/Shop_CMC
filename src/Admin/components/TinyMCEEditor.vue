<template>
    <div class="tinymce-wrapper">
        <Editor
            :api-key="apiKey"
            :init="editorConfig"
            v-model="content"
            @input="handleInput"
        />
        
        <!-- File Manager Modal -->
        <SelectImage
            v-if="isFileManagerOpen"
            :isOpen="isFileManagerOpen"
            @close="closeFileManager"
            @select="handleImageSelect"
        />
    </div>
</template>

<script>
import { ref, watch } from 'vue';
import Editor from '@tinymce/tinymce-vue';
import SelectImage from '@/Media/SelectImage.vue';

export default {
    name: 'TinyMCEEditor',
    components: {
        Editor,
        SelectImage
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
        const isFileManagerOpen = ref(false);
        let editorInstance = null;
        
        const editorConfig = {
            height: props.height,
            menubar: false,
            branding: false,
            statusbar: true,
            toolbar_mode: 'sliding',
            content_style: 'body { color: #333333; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 14px; }',
            plugins: [
                'lists', 'link', 'table', 'media', 'paste', 
                'autosave', 'autolink', 'quickbars', 'wordcount', 
                'code', 'fullscreen'
            ],
            toolbar: 'styleselect | bold italic underline strikethrough blockquote | bullist numlist | alignleft aligncenter alignright alignjustify | outdent indent | forecolor removeformat | table | link | customImageButton | code fullscreen',
            
            // Custom quickbars
            quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
            quickbars_insert_toolbar: 'customQuickImage quicktable',
            
            // Disable tất cả image upload features
            paste_data_images: false,
            automatic_uploads: false,
            images_upload_handler: () => {
                return Promise.reject('Upload disabled');
            },
            images_reuse_filename: false,
            
            // URL settings
            relative_urls: false,
            remove_script_host: false,
            convert_urls: true,
            
            // Setup editor instance and custom buttons
            setup: (editor) => {
                editorInstance = editor;
                
                // Custom image button cho toolbar
                editor.ui.registry.addButton('customImageButton', {
                    icon: 'image',
                    tooltip: 'Insert image from File Manager',
                    onAction: () => {
                        openFileManager();
                    }
                });
                
                // Custom quickimage button (thay thế nút mặc định)
                editor.ui.registry.addButton('customQuickImage', {
                    icon: 'image',
                    tooltip: 'Insert image',
                    onAction: () => {
                        openFileManager();
                    }
                });
                
                // Override mceImage command
                editor.addCommand('mceImage', () => {
                    openFileManager();
                    return false;
                });
                
                // Block mọi dialog liên quan đến image
                editor.on('ExecCommand', (e) => {
                    if (e.command === 'mceImage') {
                        e.preventDefault();
                        openFileManager();
                    }
                });
            }
        };
        
        const openFileManager = () => {
            isFileManagerOpen.value = true;
        };
        
        const closeFileManager = () => {
            isFileManagerOpen.value = false;
        };
        
        const handleImageSelect = (media) => {
            if (editorInstance && media) {
                // Insert image with URL instead of base64
                const imageUrl = media.path || media.url;
                const imageHtml = `<img src="${imageUrl}" alt="${media.filename || 'Image'}" />`;
                
                editorInstance.insertContent(imageHtml);
                
                console.log('Image inserted into editor:', {
                    url: imageUrl,
                    filename: media.filename
                });
            }
            closeFileManager();
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
            handleInput,
            isFileManagerOpen,
            openFileManager,
            closeFileManager,
            handleImageSelect
        };
    }
};
</script>

<style scoped>
.tinymce-wrapper {
    width: 100%;
    position: relative;
}
</style>
