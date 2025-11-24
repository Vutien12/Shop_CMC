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
import ErrorNotification from '../components/ErrorNotification.vue';
import products from '@/Product/lang/en/products.json';
import admin from '@/Admin/lang/en/admin.json';
import {
    getProductById,
    updateProduct,
    getBrands,
    getCategories,
    getGlobalVariations,
    getGlobalOptions
} from '@/api';

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
                // Load product data từ API
                const response = await getProductById(this.productId);
                const productData = response.result;

                this.product = productData;

                // Get category IDs from category names
                // Since API returns category names array, we need to map them to IDs
                if (productData.categories && productData.categories.length > 0) {
                    // We'll match later after categories are loaded
                    this.productCategoryNames = productData.categories;
                }

                // Map product data vào form
                this.form = {
                    ...this.form,
                    name: productData.name || '',
                    slug: productData.slug || '',
                    description: productData.description || '',
                    short_description: productData.shortDescription || '',
                    brand_id: productData.brandId || '',
                    brand: productData.brand || '',
                    categories: [], // Will be filled after loading categories
                    is_active: productData.isActive ? 1 : 0,
                    sku: productData.sku || '',
                    manage_stock: productData.manageStock ? 1 : 0,
                    qty: productData.qty || 0,
                    in_stock: productData.inStock ? 1 : 0,
                    price: productData.minPrice || '',
                    special_price: productData.maxPrice || '',
                    variations: this.mapVariationsFromAPI(productData.variations || []),
                    variants: this.mapVariantsFromAPI(productData.variants || []),
                    options: this.mapOptionsFromAPI(productData.options || []),
                    media: productData.gallery || [],
                    meta: productData.meta || {},
                };

                // Set hasAnyVariant based on variants
                this.hasAnyVariant = this.form.variants && this.form.variants.length > 0;

                // Set default variant if exists
                if (this.hasAnyVariant) {
                    const defaultVariant = this.form.variants.find(v => v.is_default);
                    if (defaultVariant) {
                        this.defaultVariantUid = defaultVariant.uid;
                    } else if (this.form.variants.length > 0) {
                        this.defaultVariantUid = this.form.variants[0].uid;
                        this.form.variants[0].is_default = true;
                    }
                }

                console.log('Product loaded:', this.product);
            } catch (error) {
                console.error('Error loading product:', error);
                alert('Error loading product: ' + (error.message || 'Unknown error'));
            }
        },

        mapVariationsFromAPI(apiVariations) {
            // Map variations từ API response sang form format
            return apiVariations.map(variation => ({
                id: variation.id,
                name: variation.name,
                type: variation.type,
                isGlobal: variation.isGlobal,
                values: (variation.variationValues || []).map(value => ({
                    id: value.id,
                    label: value.label,
                    value: value.value,
                    uid: value.id || `${variation.id}-${value.value}`
                }))
            }));
        },

        mapVariantsFromAPI(apiVariants) {
            // Map variants từ API response sang form format
            return apiVariants.map((variant, index) => ({
                uid: variant.id || `variant-${index}`,
                sku: variant.sku || '',
                price: variant.price || 0,
                special_price: variant.sellingPrice || '',
                manage_stock: variant.manageStock ? 1 : 0,
                qty: variant.qty || 0,
                in_stock: variant.inStock ? 1 : 0,
                is_active: variant.isActive ? 1 : 0,
                is_default: variant.isDefault || false,
                media: variant.media || []
            }));
        },

        mapOptionsFromAPI(apiOptions) {
            // Map option type từ API format sang UI format
            const mapOptionTypeFromAPI = (apiType) => {
                const typeMap = {
                    'SELECT': 'dropdown',
                    'TEXT': 'field',
                    'TEXTAREA': 'textarea',
                    'CHECKBOX': 'checkbox',
                    'RADIO': 'radio',
                    'MULTIPLE_SELECT': 'multiple_select',
                    'DATE': 'date',
                    'DATETIME': 'datetime',
                    'TIME': 'time'
                };
                return typeMap[apiType?.toUpperCase()] || apiType?.toLowerCase() || 'field';
            };

            // Map options từ API response sang form format
            return apiOptions.map(option => ({
                uid: this.generateUid(),
                id: option.id,
                name: option.name,
                type: mapOptionTypeFromAPI(option.type), // Map từ API format (SELECT) sang UI format (dropdown)
                is_required: option.isRequired,
                isGlobal: option.isGlobal,
                is_open: false,
                values: (option.optionValues || []).map(value => ({
                    uid: this.generateUid(),
                    id: value.id,
                    label: value.label,
                    price: value.price || 0,
                    price_type: (value.priceType || 'FIXED').toLowerCase() // Map từ FIXED sang fixed
                }))
            }));
        },

        async loadInitialData() {
            try {
                // Load brands, categories, global variations và global options từ API
                const [brandsRes, categoriesRes, variationsRes, optionsRes] = await Promise.all([
                    getBrands(),
                    getCategories(),
                    getGlobalVariations(),
                    getGlobalOptions()
                ]);

                this.brands = brandsRes.result || [];

                // Get all categories - filtering will be done in GeneralSection component
                const allCategories = categoriesRes.result || [];
                this.rootCategories = allCategories;

                this.globalVariations = variationsRes.result || [];
                this.globalOptions = optionsRes.result || [];

                // Map category names to IDs if product is loaded
                if (this.productCategoryNames.length > 0) {
                    this.form.categories = allCategories
                        .filter(cat => this.productCategoryNames.includes(cat.name))
                        .map(cat => cat.id);
                }

                console.log('Loaded initial data for edit');
            } catch (error) {
                console.error('Error loading initial data:', error);
            }
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
                // Ensure variants are generated (especially for simple products without variations)
                if (this.form.variants.length === 0) {
                    this.generateVariants();
                }

                // Transform form data sang format API backend yêu cầu
                const productData = this.transformFormData();

                console.log('Updating product:', productData);

                // Gọi API update sản phẩm
                const response = await updateProduct(this.productId, productData);

                console.log('Product updated successfully:', response);

                this.successMessage = 'Product updated successfully!';
                this.showSuccessAlert = true;

                // Handle success
                if (this.redirectAfterSave === '1') {
                    // Redirect to products list
                    setTimeout(() => {
                        this.$router.push({ name: 'admin.products.index' });
                    }, 1500);
                } else {
                    // Stay on edit page và reload product data
                    await this.loadProduct();

                    // Hide alert after 3 seconds
                    setTimeout(() => {
                        this.showSuccessAlert = false;
                    }, 3000);
                }
            } catch (error) {
                console.error('Error updating product:', error);

                // Handle validation errors từ API response
                if (error.response && error.response.data) {
                    const errorData = error.response.data;

                    // API có thể trả về errors ở 3 nơi khác nhau:
                    // 1. errors object (traditional Laravel validation)
                    // 2. result object (nested validation errors)
                    // 3. message string (general error)

                    let validationErrors = {};

                    // Case 1: errors object trực tiếp
                    if (errorData.errors && typeof errorData.errors === 'object') {
                        validationErrors = errorData.errors;
                    }
                    // Case 2: result object chứa validation errors
                    else if (errorData.result && typeof errorData.result === 'object') {
                        validationErrors = errorData.result;
                    }

                    // Map errors vào errors object để hiển thị trên form
                    if (Object.keys(validationErrors).length > 0) {
                        this.errors.errors = {};

                        // Map camelCase API field names sang snake_case form field names
                        const fieldNameMap = {
                            'brandId': 'brand_id',
                            'categoryIds': 'categories',
                            'shortDescription': 'short_description',
                            'manageStock': 'manage_stock',
                            'inStock': 'in_stock',
                            'isActive': 'is_active',
                            'specialPrice': 'special_price',
                            'specialPriceType': 'special_price_type',
                            'specialPriceStart': 'special_price_start',
                            'specialPriceEnd': 'special_price_end',
                        };

                        Object.keys(validationErrors).forEach(key => {
                            const errorMsg = validationErrors[key];
                            // Convert camelCase API field name to snake_case form field name
                            const formFieldName = fieldNameMap[key] || key;
                            this.errors.errors[formFieldName] = Array.isArray(errorMsg) ? errorMsg : [errorMsg];
                        });
                        console.log('Validation errors mapped:', this.errors.errors);
                    } else if (errorData.message) {
                        // Nếu không có validation errors, hiển thị message chung
                        alert('Error: ' + errorData.message);
                    }
                } else {
                    alert('Error updating product: ' + error.message);
                }
            }
        },

        transformFormData() {
            // Transform form data từ format Vue sang format API backend
            // Giống như trong create.vue
            return {
                name: this.form.name || '',
                slug: this.form.slug || '',
                thumbnail: this.form.media && this.form.media.length > 0 ? this.form.media[0].path : null,
                brandId: this.form.brand_id ? parseInt(this.form.brand_id) : null,
                description: this.form.description || '',
                shortDescription: this.form.short_description || '',
                sku: this.form.sku || '',
                manageStock: this.form.manage_stock === 1,
                qty: this.form.qty ? parseInt(this.form.qty) : 0,
                inStock: this.form.in_stock === 1,
                isActive: this.form.is_active === 1,
                categoryIds: this.form.categories || [],

                // Transform variations
                variations: this.transformVariations(),

                // Transform variants
                variants: this.transformVariants(),

                // Transform options
                options: this.transformOptions(),

                // Meta data
                meta: this.form.meta || {},

                // Price info (nếu không có variants)
                price: this.form.price ? parseFloat(this.form.price) : null,
                sellingPrice: this.form.special_price ? parseFloat(this.form.special_price) : null,
            };
        },

        transformVariations() {
            // Transform variations từ format Vue sang format API
            return this.form.variations.map(variation => {
                const variationType = variation.type?.toLowerCase();

                const transformed = {
                    name: variation.name,
                    type: variation.type?.toUpperCase() || 'TEXT', // API expect uppercase: COLOR, TEXT, IMAGE
                    isGlobal: variation.isGlobal || false,
                    variationValues: (variation.values || []).map(value => {
                        const valueData = {
                            label: value.label
                        };

                        // Map value dựa theo type
                        if (variationType === 'color') {
                            valueData.value = value.color || value.value || '#000000';
                        } else if (variationType === 'image') {
                            valueData.value = value.image?.path || value.value || '';
                        } else {
                            valueData.value = value.value || value.label || '';
                        }

                        return valueData;
                    })
                };

                // Nếu có id (từ global hoặc existing), thêm vào
                if (variation.id) {
                    transformed.id = variation.id;
                }

                return transformed;
            });
        },

        transformVariants() {
            // Transform variants từ format Vue sang format API
            return this.form.variants.map(variant => ({
                sku: variant.sku || '',
                price: variant.price ? parseFloat(variant.price) : 0,
                sellingPrice: variant.special_price ? parseFloat(variant.special_price) : null,
                manageStock: variant.manage_stock === 1,
                qty: variant.qty ? parseInt(variant.qty) : 0,
                inStock: variant.in_stock === 1,
                isActive: variant.is_active === 1,
                isDefault: variant.is_default || false,
                media: variant.media || []
            }));
        },

        transformOptions() {
            // Map option type từ UI format sang API format
            const mapOptionTypeToAPI = (uiType) => {
                const typeMap = {
                    'dropdown': 'SELECT',
                    'field': 'TEXT',
                    'textarea': 'TEXTAREA',
                    'checkbox': 'CHECKBOX',
                    'radio': 'RADIO',
                    'multiple_select': 'MULTIPLE_SELECT',
                    'date': 'DATE',
                    'datetime': 'DATETIME',
                    'time': 'TIME'
                };
                return typeMap[uiType?.toLowerCase()] || 'TEXT';
            };

            // Transform options từ format Vue sang format API
            return this.form.options.map(option => {
                const transformed = {
                    name: option.name,
                    type: mapOptionTypeToAPI(option.type), // Map từ UI format (dropdown) sang API format (SELECT)
                    isRequired: option.is_required || false,
                    isGlobal: option.isGlobal || false,
                    optionValues: (option.values || []).map(value => ({
                        label: value.label,
                        price: value.price ? parseFloat(value.price) : 0,
                        priceType: (value.price_type || 'fixed').toUpperCase() // API expect uppercase: FIXED, PERCENT
                    }))
                };

                // Nếu có id (từ global hoặc existing), thêm vào
                if (option.id) {
                    transformed.id = option.id;
                }

                return transformed;
            });
        },

        generateVariants() {
            // Generate product variants from variations
            const variations = this.form.variations.filter(v => v.name && v.type && v.values.length > 0);

            if (variations.length === 0) {
                // Nếu không có variations, tạo 1 variant mặc định (simple product)
                const defaultUid = this.generateUid();
                this.form.variants = [{
                    uid: defaultUid,
                    name: this.form.name || 'Default',
                    price: this.form.price || 0,
                    special_price: this.form.special_price || '',
                    special_price_type: 'fixed',
                    special_price_start: '',
                    special_price_end: '',
                    sku: this.form.sku || '',
                    manage_stock: this.form.manage_stock || 0,
                    qty: this.form.qty || 0,
                    in_stock: this.form.in_stock !== undefined ? this.form.in_stock : 1,
                    is_active: this.form.is_active !== undefined ? this.form.is_active : 1,
                    is_default: true,
                    is_selected: true,
                    is_open: false,
                    media: [],
                    position: 0,
                }];
                this.hasAnyVariant = false; // Simple product không có variant trong UI
                this.defaultVariantUid = defaultUid;
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

        generateUid() {
            // Generate unique ID for form elements
            return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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

