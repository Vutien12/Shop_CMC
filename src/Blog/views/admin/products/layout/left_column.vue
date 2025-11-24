<template>
    <GeneralSection
        section="general"
        :form="form"
        :errors="errors"
    />
</template>

<script>
import GeneralSection from './sections/general.vue';


export default {
    name: 'LeftColumn',
    components: {
        GeneralSection,
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
        formLeftSections: {
            type: Array,
            default: () => [],
        },
        rootCategories: {
            type: Array,
            default: () => [],
        },
        brands: {
            type: Array,
            default: () => [],
        },
        globalOptions: {
            type: Array,
            default: () => [],
        },
        globalVariations: {
            type: Array,
            default: () => [],
        },
        hasAnyVariant: {
            type: Boolean,
            default: false,
        },
        hasAccess: {
            type: Boolean,
            default: false,
        },
        defaultVariantUid: {
            type: String,
            default: '',
        },
        defaultCurrencySymbol: {
            type: String,
            default: 'VNĐ',
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
