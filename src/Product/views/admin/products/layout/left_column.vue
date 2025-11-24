<template>
    <GeneralSection
        section="general"
        :form="form"
        :errors="errors"
        :categories="rootCategories"
        :brands="brands"
    />

    <div class="box" v-for="(section, sectionIndex) in formLeftSections" :data-id="section" :key="sectionIndex">
        <OptionsSection
            v-if="section === 'options'"
            :section="section"
            :form="form"
            :errors="errors"
            :globalOptions="globalOptions"
            :defaultCurrencySymbol="defaultCurrencySymbol"
            :hasAccess="hasAccess"
        />

        <VariationsSection
            v-if="section === 'variations'"
            :section="section"
            :form="form"
            :errors="errors"
            :globalVariations="globalVariations"
            :placeholderImage="placeholderImage"
            @generate-variants="$emit('generate-variants')"
            @choose-variation-image="$emit('choose-variation-image', $event)"
        />

        <VariantsSection
            v-if="section === 'variants'"
            :section="section"
            :form="form"
            :errors="errors"
            :hasAnyVariant="hasAnyVariant"
            :defaultVariantUid="defaultVariantUid"
            :defaultCurrencySymbol="defaultCurrencySymbol"
            :flatPickrConfig="flatPickrConfig"
            :placeholderImage="placeholderImage"
            @change-default-variant="$emit('change-default-variant', $event)"
            @change-variant-status="$emit('change-variant-status', $event)"
            @add-variant-media="$emit('add-variant-media', $event)"
        />
    </div>
</template>

<script>
import GeneralSection from './sections/general.vue';
import OptionsSection from './sections/options.vue';
import VariationsSection from './sections/variations.vue';
import VariantsSection from './sections/variants.vue';

export default {
    name: 'LeftColumn',
    components: {
        GeneralSection,
        OptionsSection,
        VariationsSection,
        VariantsSection,
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
