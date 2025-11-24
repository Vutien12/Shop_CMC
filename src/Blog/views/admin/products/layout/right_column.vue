<template>
    <div class="box" v-for="(section, index) in formRightSections" :data-id="section" :key="index">
        <MediaSection
            v-if="section === 'media'"
            :section="section"
            :form="form"
            :errors="errors"
            :placeholderImage="placeholderImage"
        />
    </div>
</template>

<script>
import MediaSection from './sections/media.vue';

export default {
    name: 'RightColumn',
    components: {
        MediaSection,
    },
    props: {
        form: {
            type: Object,
            required: true,
        },
        errors: {
            type: Object,
            required: true,
        },
        formRightSections: {
            type: Array,
            default: () => [],
        },
        hasAnyVariant: {
            type: Boolean,
            default: false,
        },
        flatPickrConfig: {
            type: Object,
            default: () => ({}),
        },
        placeholderImage: {
            type: String,
            default: '/assets/placeholder_image.png',
        },
    },
};
</script>
