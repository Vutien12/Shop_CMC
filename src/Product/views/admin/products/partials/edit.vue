<template>
    <div class="product-edit-page">
        <div class="page-header">
            <h1>{{ trans('admin::resource.edit', { resource: trans('product::products.product') }) }}</h1>
            <p v-if="product" class="subtitle">{{ product.name }}</p>
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                        <router-link :to="{ name: 'admin.products.index' }">
                            {{ trans('product::products.products') }}
                        </router-link>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                        {{ trans('admin::resource.edit', { resource: trans('product::products.product') }) }}
                    </li>
                </ol>
            </nav>
        </div>

        <div v-if="showSuccessAlert" class="alert alert-success alert-exit-flash fade in alert-dismissible clearfix">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM11.25 8C11.25 7.59 11.59 7.25 12 7.25C12.41 7.25 12.75 7.59 12.75 8V13C12.75 13.41 12.41 13.75 12 13.75C11.59 13.75 11.25 13.41 11.25 13V8ZM12.92 16.38C12.87 16.51 12.8 16.61 12.71 16.71C12.61 16.8 12.5 16.87 12.38 16.92C12.26 16.97 12.13 17 12 17C11.87 17 11.74 16.97 11.62 16.92C11.5 16.87 11.39 16.8 11.29 16.71C11.2 16.61 11.13 16.51 11.08 16.38C11.03 16.26 11 16.13 11 16C11 15.87 11.03 15.74 11.08 15.62C11.13 15.5 11.2 15.39 11.29 15.29C11.39 15.2 11.5 15.13 11.62 15.08C11.86 14.98 12.14 14.98 12.38 15.08C12.5 15.13 12.61 15.2 12.71 15.29C12.8 15.39 12.87 15.5 12.92 15.62C12.97 15.74 13 15.87 13 16C13 16.13 12.97 16.26 12.92 16.38Z" fill="#555555"/>
            </svg>

            <button type="button" class="close" @click="showSuccessAlert = false">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5.00082 14.9995L14.9999 5.00041" stroke="#555555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14.9999 14.9996L5.00082 5.00049" stroke="#555555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>

            <span class="alert-text">{{ successMessage }}</span>
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
                        :globalVariations="globalVariations"
                        :hasAnyVariant="hasAnyVariant"
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
    name: 'ProductEdit',
    components: {
        LeftColumn,
        RightColumn,
    },
    data() {
        return {
            productId: null,
            product: null,
            redirectAfterSave: '0',
            showSuccessAlert: false,
            successMessage: '',
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
            formLeftSections: ['variations', 'variants'],
            formRightSections: ['price', 'inventory', 'additional', 'media'],
            rootCategories: [],
            brands: [],
            globalVariations: [],
            hasAnyVariant: false,
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
        this.productId = this.$route.params.id;
        this.loadProduct();
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

        async loadProduct() {
            try {
                // Load product data from API
                // const response = await axios.get(`/admin/products/${this.productId}`);
                // this.product = response.data.product;
                // this.form = { ...this.form, ...response.data.product };
                
                // For now, initialize with default data
                this.product = { name: 'Product Name' };
                
                // Set hasAnyVariant based on variants
                this.hasAnyVariant = this.form.variants && this.form.variants.length > 0;
                
                // Set default variant if exists
                if (this.hasAnyVariant) {
                    const defaultVariant = this.form.variants.find(v => v.is_default);
                    if (defaultVariant) {
                        this.defaultVariantUid = defaultVariant.uid;
                    }
                }
            } catch (error) {
                console.error('Error loading product:', error);
            }
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
                // const response = await axios.put(`/admin/products/${this.productId}`, this.form);
                
                console.log('Form submitted:', this.form);
                console.log('Redirect after save:', this.redirectAfterSave);
                
                this.successMessage = 'Product updated successfully!';
                this.showSuccessAlert = true;
                
                // Handle success
                if (this.redirectAfterSave === '1') {
                    // Redirect to products list
                    setTimeout(() => {
                        this.$router.push({ name: 'admin.products.index' });
                    }, 1500);
                } else {
                    // Stay on edit page
                    // Reload product data
                    await this.loadProduct();
                    
                    // Hide alert after 3 seconds
                    setTimeout(() => {
                        this.showSuccessAlert = false;
                    }, 3000);
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

