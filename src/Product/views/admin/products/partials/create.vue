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
                        @open-file-manager="openFileManager"
                        @remove-media="removeGalleryImage"
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
import LeftColumn from '../layout/left_column.vue';
import RightColumn from '../layout/right_column.vue';
import SelectImage from '@/Media/SelectImage.vue';
import products from '@/Product/lang/en/products.json';
import admin from '@/Admin/lang/en/admin.json';
import {
    createProduct,
    getBrands,
    getCategories,
    getGlobalVariations,
    getGlobalOptions
} from '@/api';

export default {
    name: 'ProductCreate',
    components: {
        LeftColumn,
        RightColumn,
        SelectImage,
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
            isFileManagerOpen: false,
            currentImageTarget: null, // 'thumbnail' or 'gallery'
        };
    },
    mounted() {
        this.loadInitialData();
    },
    watch: {
        'form.price'(newPrice) {
            // Auto-update variant price khi user thay đổi giá (chỉ cho simple product - không có variations)
            if (this.form.variations.length === 0 && this.form.variants.length > 0) {
                this.form.variants.forEach(variant => {
                    variant.price = parseFloat(newPrice) || 0;
                });
            }
        },
        'form.special_price'(newSpecialPrice) {
            // Auto-update variant special price
            if (this.form.variations.length === 0 && this.form.variants.length > 0) {
                this.form.variants.forEach(variant => {
                    variant.special_price = newSpecialPrice ? parseFloat(newSpecialPrice) : '';
                });
            }
        }
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
                this.rootCategories = categoriesRes.result || [];

                this.globalVariations = variationsRes.result || [];
                this.globalOptions = optionsRes.result || [];

                console.log('Loaded initial data:', {
                    brands: this.brands.length,
                    categories: this.rootCategories.length,
                    variations: this.globalVariations.length,
                    options: this.globalOptions.length
                });

                // Generate default variant for simple product (no variations)
                this.generateVariants();
            } catch (error) {
                console.error('Error loading initial data:', error);
                // Có thể show notification lỗi cho user
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

                console.log('Submitting product data:', productData);

                // Gọi API tạo sản phẩm
                const response = await createProduct(productData);

                console.log('Product created successfully:', response);

                // Handle success
                if (this.redirectAfterSave === '1') {
                    // Redirect to products list
                    this.$router.push({ name: 'admin.products.index' });
                } else {
                    // Redirect to edit page của product vừa tạo
                    const productId = response.result?.id;
                    if (productId) {
                        this.$router.push({ name: 'admin.products.edit', params: { id: productId } });
                    }
                }
            } catch (error) {
                console.error('Error creating product:', error);

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
                        alert('Error: ' + errorData.message);
                    }
                } else {
                    alert('Error creating product: ' + error.message);
                }
            }
        },

        transformFormData() {
            // Calculate selling price
            const calculateSellingPrice = (price, specialPrice, specialPriceType) => {
                const basePrice = parseFloat(price) || 0;
                const discount = parseFloat(specialPrice) || 0;

                if (!discount || discount === 0) {
                    // Không có giảm giá → sellingPrice = price
                    return basePrice;
                }

                if (specialPriceType === 'percent') {
                    // Giảm theo phần trăm
                    return basePrice - (basePrice * discount / 100);
                } else {
                    // Giảm cố định (fixed)
                    return basePrice - discount;
                }
            };

            const price = this.form.price ? parseFloat(this.form.price) : null;
            const sellingPrice = calculateSellingPrice(
                this.form.price,
                this.form.special_price,
                this.form.special_price_type
            );

            // Transform form data từ format Vue sang format API backend
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
                price: price,
                sellingPrice: sellingPrice,
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

                // Nếu có id (từ global), thêm vào
                if (variation.id) {
                    transformed.id = variation.id;
                }

                return transformed;
            });
        },

        transformVariants() {
            // Calculate selling price for variant
            const calculateSellingPrice = (price, specialPrice, specialPriceType) => {
                const basePrice = parseFloat(price) || 0;
                const discount = parseFloat(specialPrice) || 0;

                if (!discount || discount === 0) {
                    // Không có giảm giá → sellingPrice = price
                    return basePrice;
                }

                if (specialPriceType === 'percent') {
                    // Giảm theo phần trăm
                    return basePrice - (basePrice * discount / 100);
                } else {
                    // Giảm cố định (fixed)
                    return basePrice - discount;
                }
            };

            // Transform variants từ format Vue sang format API
            return this.form.variants.map(variant => {
                const price = parseFloat(variant.price) || 0;
                const sellingPrice = calculateSellingPrice(
                    variant.price,
                    variant.special_price,
                    variant.special_price_type || 'fixed'
                );

                return {
                    sku: variant.sku || '',
                    price: price,
                    sellingPrice: sellingPrice,
                    manageStock: variant.manage_stock === 1,
                    qty: variant.qty ? parseInt(variant.qty) : 0,
                    inStock: variant.in_stock === 1,
                    isActive: variant.is_active === 1,
                    isDefault: variant.is_default || false,
                    media: variant.media || []
                };
            });
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

                // Nếu có id (từ global), thêm vào
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
                    price: parseFloat(this.form.price) || 0,
                    special_price: this.form.special_price ? parseFloat(this.form.special_price) : '',
                    special_price_type: 'fixed',
                    special_price_start: '',
                    special_price_end: '',
                    sku: this.form.sku || '',
                    manage_stock: this.form.manage_stock || 0,
                    qty: parseInt(this.form.qty) || 0,
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
                    price: parseFloat(this.form.price) || 0,
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

        // File Manager Methods
        openFileManager(target = 'thumbnail') {
            this.currentImageTarget = target;
            this.isFileManagerOpen = true;
        },

        closeFileManager() {
            this.isFileManagerOpen = false;
            this.currentImageTarget = null;
        },

        handleImageSelect(media) {
            if (this.currentImageTarget === 'thumbnail') {
                // Set thumbnail
                this.form.thumbnail = media.path;
            } else if (this.currentImageTarget === 'gallery') {
                // Add to gallery
                if (!this.form.media) {
                    this.form.media = [];
                }
                this.form.media.push({
                    id: media.id,
                    path: media.path,
                    filename: media.filename
                });
            }
            this.closeFileManager();
        },

        removeThumbnail() {
            this.form.thumbnail = null;
        },

        removeGalleryImage(index) {
            this.form.media.splice(index, 1);
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
