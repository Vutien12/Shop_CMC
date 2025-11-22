<template>
    <div class="product-create-page">
        <div class="page-header">
            <h1>{{ trans('admin::resource.create', { resource: trans('product::products.product') }) }}</h1>
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                        <router-link :to="{ name: 'admin.products.index' }">
                            {{ trans('product::products.products') }}
                        </router-link>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                        {{ trans('admin::resource.create', { resource: trans('product::products.product') }) }}
                    </li>
                </ol>
            </nav>
        </div>

        <form class="product-form" @submit.prevent="handleSubmit">
            <input type="hidden" name="redirect_after_save" v-model="redirectAfterSave">
            
            <div class="row">
                <div class="product-form-left-column col-lg-8 col-md-12">
                    <LeftColumn
                        :form="form"
                        :errors="errors"
                        :formLeftSections="formLeftSections"
                        :rootCategories="rootCategories"
                        :brands="brands"
                        :globalOptions="globalOptions"
                        :globalVariations="globalVariations"
                        :hasAnyVariant="hasAnyVariant"
                        :hasAccess="hasAccess"
                        :defaultVariantUid="defaultVariantUid"
                        :defaultCurrencySymbol="defaultCurrencySymbol"
                        :flatPickrConfig="flatPickrConfig"
                        :placeholderImage="placeholderImage"
                        @generate-variants="generateVariants"
                        @choose-variation-image="chooseVariationImage"
                        @change-default-variant="changeDefaultVariant"
                        @change-variant-status="changeVariantStatus"
                        @add-variant-media="addVariantMedia"
                    />
                </div>

                <div class="product-form-right-column col-lg-4 col-md-12">
                    <RightColumn
                        :form="form"
                        :errors="errors"
                        :formRightSections="formRightSections"
                        :hasAnyVariant="hasAnyVariant"
                        :flatPickrConfig="flatPickrConfig"
                        :placeholderImage="placeholderImage"
                    />
                </div>
            </div>

            <div class="page-form-footer">
                <button type="button" class="btn btn-default save-btn" @click="save">
                    Save
                </button>
                <button type="button" class="btn btn-primary save-exit-btn" @click="saveAndExit">
                    Save &amp; Exit
                </button>
            </div>
        </form>
    </div>
</template>

<script>
import LeftColumn from '../layout/left_column.vue';
import RightColumn from '../layout/right_column.vue';
import products from '@/Product/lang/en/products.json';
import admin from '@/Admin/lang/en/admin.json';

export default {
    name: 'ProductCreate',
    components: {
        LeftColumn,
        RightColumn,
    },
    data() {
        return {
            redirectAfterSave: '0',
            form: {
                name: '',
                slug: '',
                description: '',
                short_description: '',
                brand_id: '',
                categories: [],
                is_active: 1,
                new_from: '',
                new_to: '',
                price: '',
                special_price: '',
                special_price_type: 1,
                special_price_start: '',
                special_price_end: '',
                sku: '',
                manage_stock: 0,
                qty: '',
                in_stock: 1,
                variations: [],
                variants: [],
                attributes: [],
                options: [],
                media: [],
                meta: {
                    meta_title: '',
                    meta_description: '',
                },
            },
            errors: {
                errors: {},
                has(key) {
                    return Object.prototype.hasOwnProperty.call(this.errors, key);
                },
                get(key) {
                    return this.errors[key] ? this.errors[key][0] : '';
                },
                any(prefix) {
                    return Object.keys(this.errors).some(key => key.startsWith(prefix));
                },
            },
            formLeftSections: ['options', 'variations', 'variants'],
            formRightSections: ['price', 'inventory', 'additional', 'media'],
            rootCategories: [],
            brands: [],
            globalOptions: [],
            globalVariations: [],
            hasAnyVariant: false,
            hasAccess: true,
            defaultVariantUid: '',
            defaultCurrencySymbol: 'VNĐ',
            flatPickrConfig: {
                enableTime: false,
                dateFormat: 'Y-m-d',
            },
            placeholderImage: '/assets/placeholder_image.png',
        };
    },
    mounted() {
        this.loadInitialData();
    },
    methods: {
        trans(key, params = {}) {
            const translationFiles = {
                'product::products': products,
                'admin::resource': admin.resource || {},
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

            let translation = typeof result === 'string' ? result : key;

            // Replace parameters
            Object.keys(params).forEach(param => {
                translation = translation.replace(`:${param}`, params[param]);
            });

            return translation;
        },

        async loadInitialData() {
            // Load categories, brands, and global variations
            // This would typically be an API call
            // For now, initialize with empty arrays
        },

        save() {
            this.redirectAfterSave = '0';
            this.handleSubmit();
        },

        saveAndExit() {
            this.redirectAfterSave = '1';
            this.handleSubmit();
        },

        async handleSubmit() {
            try {
                // Submit form data to API
                // const response = await axios.post('/admin/products', this.form);
                
                console.log('Form submitted:', this.form);
                console.log('Redirect after save:', this.redirectAfterSave);
                
                // Handle success
                if (this.redirectAfterSave === '1') {
                    // Redirect to products list
                    this.$router.push({ name: 'admin.products.index' });
                } else {
                    // Stay on page or redirect to edit
                    // this.$router.push({ name: 'admin.products.edit', params: { id: response.data.id } });
                }
            } catch (error) {
                // Handle validation errors
                if (error.response && error.response.data.errors) {
                    this.errors.errors = error.response.data.errors;
                }
            }
        },

        generateVariants() {
            // Generate product variants from variations
            const variations = this.form.variations.filter(v => v.name && v.type && v.values.length > 0);
            
            if (variations.length === 0) {
                this.form.variants = [];
                this.hasAnyVariant = false;
                return;
            }

            // Generate combinations of variation values
            const combinations = this.generateCombinations(variations);
            
            // Create or update variants
            const existingVariants = this.form.variants;
            this.form.variants = combinations.map(combo => {
                const uid = this.generateVariantUid(combo);
                const existing = existingVariants.find(v => v.uid === uid);
                
                return existing || {
                    uid: uid,
                    name: combo.map(c => c.label).join(' / '),
                    price: this.form.price || 0,
                    special_price: '',
                    special_price_type: 'fixed',
                    special_price_start: '',
                    special_price_end: '',
                    sku: '',
                    manage_stock: 0,
                    qty: '',
                    in_stock: 1,
                    is_active: 1,
                    is_default: false,
                    is_selected: true,
                    is_open: false,
                    media: [],
                    position: 0,
                };
            });

            this.hasAnyVariant = this.form.variants.length > 0;
            
            // Set first variant as default if none selected
            if (this.hasAnyVariant && !this.defaultVariantUid) {
                this.defaultVariantUid = this.form.variants[0].uid;
                this.form.variants[0].is_default = true;
            }
        },

        generateCombinations(variations) {
            if (variations.length === 0) return [];
            if (variations.length === 1) return variations[0].values.map(v => [v]);
            
            const result = [];
            const restCombinations = this.generateCombinations(variations.slice(1));
            
            variations[0].values.forEach(value => {
                restCombinations.forEach(combo => {
                    result.push([value, ...combo]);
                });
            });
            
            return result;
        },

        generateVariantUid(combination) {
            return combination.map(c => c.uid).join('-');
        },

        chooseVariationImage(data) {
            // Handle choosing image for variation value
            console.log('Choose variation image:', data);
        },

        changeDefaultVariant(uid) {
            this.form.variants.forEach(variant => {
                variant.is_default = variant.uid === uid;
            });
            this.defaultVariantUid = uid;
        },

        changeVariantStatus(uid) {
            const variant = this.form.variants.find(v => v.uid === uid);
            if (variant) {
                variant.is_active = !variant.is_active;
            }
        },

        addVariantMedia(variantIndex) {
            // Handle adding media to variant
            console.log('Add variant media:', variantIndex);
        },
    },
};
</script>

<style scoped>
.product-create-page {
    padding: 20px;
}

.page-header {
    margin-bottom: 20px;
}

.page-form-footer {
    margin-top: 20px;
    padding: 20px;
    background: #f5f5f5;
    text-align: right;
    left:250px;
    right:0;
}

.page-form-footer .btn {
    margin-left: 10px;;
}
</style>
