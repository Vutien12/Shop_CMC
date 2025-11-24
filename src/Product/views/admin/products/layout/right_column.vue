<template>
    <div class="box" v-for="(section, index) in formRightSections" :data-id="section" :key="index">
        <PricingSection
            v-if="section === 'price'"
            :section="section"
            :form="form"
            :errors="errors"
            :hasAnyVariant="hasAnyVariant"
            :flatPickrConfig="flatPickrConfig"
        />

        <InventorySection
            v-if="section === 'inventory'"
            :section="section"
            :form="form"
            :errors="errors"
        />

        <AdditionalSection
            v-if="section === 'additional'"
            :section="section"
            :form="form"
            :errors="errors"
            :flatPickrConfig="flatPickrConfig"
        />

        <MediaSection
            v-if="section === 'media'"
            :section="section"
            :form="form"
            :errors="errors"
            :placeholderImage="placeholderImage"
            @open-file-manager="$emit('open-file-manager', $event)"
            @remove-media="$emit('remove-media', $event)"
        />
    </div>
</template>

<script>
import PricingSection from './sections/pricing.vue';
import InventorySection from './sections/inventory.vue';
import AdditionalSection from './sections/additional.vue';
import MediaSection from './sections/media.vue';

export default {
    name: 'RightColumn',
    components: {
        PricingSection,
        InventorySection,
        AdditionalSection,
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
