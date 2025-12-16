<template>
    <div class="product-create-page">
        <PageBreadcrumb
            :title="isEditMode ? `Edit ${trans('product::products.product')}` : `Create ${trans('product::products.product')}`"
            :breadcrumbs="[
                { label: 'Products', route: { name: 'admin.products.index' } },
                { label: isEditMode ? 'Edit Product' : 'Create Product' }
            ]"
        />

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
            :attributeSets="attributeSets"
            :selectizeConfig="selectizeConfig"
            :hasAnyVariant="hasAnyVariant"
            :hasAccess="hasAccess"
            :defaultVariantUid="defaultVariantUid"
            :defaultCurrencySymbol="defaultCurrencySymbol"
            :flatPickrConfig="flatPickrConfig"
            :placeholderImage="placeholderImage"
            @generate-variants="generateVariants"
            @choose-variation-image="chooseVariationImage"
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
            @remove-media="removeThumbnailHandler"
            @remove-gallery="removeGalleryHandler"
            @update-gallery="updateGalleryHandler"
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
import LeftColumn from '@/Product/views/admin/products/layout/left_column.vue';
import RightColumn from '@/Product/views/admin/products/layout/right_column.vue';
import SelectImage from '@/Media/SelectImage.vue';
import PageBreadcrumb from '@/Admin/view/components/PageBreadcrumb.vue';
import { useNotification } from '@/Admin/composables/useNotification.js';
import products from '@/Product/lang/en/products.json';
import admin from '@/Admin/lang/en/admin.json';

import {
  createProduct,
  updateProduct,
  getProductForEdit,
  getBrands,
  getCategories,
  getGlobalVariations,
  getGlobalOptions,
  attachFileToEntity,
  deleteEntityFile
} from '@/api';

export default {
  name: 'ProductCreate',
  components: {
    LeftColumn,
    RightColumn,
    SelectImage,
    PageBreadcrumb
  },
  data() {
    return {
      isEditMode: false,
      productId: null,
      redirectAfterSave: '0',
      pendingDeleteFiles: [],
      pendingAttachFiles: [],
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
        variations: [],
        variants: [],
        attributes: [],
        options: [],
        thumbnail: null, // Separate thumbnail
        gallery: [], // Separate gallery array
        media: [], // For backward compatibility with media section component
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
      formLeftSections: ['attributes', 'options', 'variations', 'variants'],
      formRightSections: ['price', 'inventory', 'additional', 'media'],
      rootCategories: [],
      brands: [],
      globalOptions: [],
      globalVariations: [],
      attributeSets: [],
      selectizeConfig: {
        plugins: ['remove_button'],
        delimiter: ',',
        persist: false,
      },
      hasAnyVariant: false,
      hasAccess: true,
      defaultVariantUid: '',
      defaultCurrencySymbol: 'VNĐ',
      flatPickrConfig: {
        enableTime: true,
        dateFormat: 'Y-m-d H:i:S',
        time_24hr: true,
      },
      placeholderImage: '/assets/placeholder_image.png',
      isFileManagerOpen: false,
      currentImageTarget: null, // 'thumbnail' or 'gallery'
      isLoadingData: false,
    };
  },
  computed: {
    // Sync media array from thumbnail + gallery for compatibility with media section component
    mediaArray() {
      const result = [];
      if (this.form.thumbnail) {
        result.push(this.form.thumbnail);
      }
      if (this.form.gallery && this.form.gallery.length > 0) {
        result.push(...this.form.gallery);
      }
      return result;
    }
  },
  mounted() {
    // Check if we're in edit mode
    this.productId = this.$route.params.id;
    this.isEditMode = !!this.productId;

    this.loadInitialData();
  },
  watch: {
    // Sync form.media with thumbnail and gallery
    'form.thumbnail': {
      handler() {
        this.syncMediaArray();
      },
      deep: true
    },
    'form.gallery': {
      handler() {
        this.syncMediaArray();
      },
      deep: true
    },
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
    },
    'form.special_price_type'(newType) {
      // Auto-update variant special price type (convert 1/2 to fixed/percent)
      if (this.form.variations.length === 0 && this.form.variants.length > 0) {
        const typeString = newType === 2 ? 'percent' : 'fixed';
        this.form.variants.forEach(variant => {
          variant.special_price_type = typeString;
        });
      }
    },
    'form.special_price_start'(newStartDate) {
      // Auto-update variant special price start
      if (this.form.variations.length === 0 && this.form.variants.length > 0) {
        this.form.variants.forEach(variant => {
          variant.special_price_start = newStartDate || '';
        });
      }
    },
    'form.special_price_end'(newEndDate) {
      // Auto-update variant special price end
      if (this.form.variations.length === 0 && this.form.variants.length > 0) {
        this.form.variants.forEach(variant => {
          variant.special_price_end = newEndDate || '';
        });
      }
    },
    // Tự động sinh variants khi variation values thay đổi thủ công
    'form.variations': {
      handler() {
        if (this.isLoadingData) return; // Skip generate when loading data

        this.$nextTick(() => {
          this.generateVariants();
        });
      },
      deep: true,
      immediate: true
    },
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
      this.isLoadingData = true;
      try {
        // Load brands, categories, global variations, global options từ API
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
        this.attributeSets = []; // Giữ giao diện nhưng không gọi BE

        console.log('Loaded initial data:', {
          brands: this.brands.length,
          categories: this.rootCategories.length,
          variations: this.globalVariations.length,
          options: this.globalOptions.length,
          attributeSets: this.attributeSets.length
        });

        // If in edit mode, load product data
        if (this.isEditMode && this.productId) {
          await this.loadProductData();
        } else {
          // Generate default variant for simple product (no variations)
          this.generateVariants();
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
        // Có thể show notification lỗi cho user
      } finally {
        this.isLoadingData = false;
      }
    },

    async loadProductData() {
      try {
        const response = await getProductForEdit(this.productId);
        const product = response.result;

        console.log('Loaded product for editing:', product);

        // Find brand by name
        const brand = this.brands.find(b => b.name === product.brand);

        // Transform API response to form format
        this.form.name = product.name || '';
        this.form.slug = product.slug || '';
        this.form.description = product.description || '';
        this.form.short_description = product.shortDescription || '';
        this.form.brand_id = brand ? brand.id : '';
        this.form.sku = product.sku || '';
        this.form.manage_stock = product.manageStock ? 1 : 0;
        this.form.qty = product.qty || 0;
        this.form.in_stock = product.inStock ? 1 : 0;
        this.form.is_active = product.isActive ? 1 : 0;
        this.form.new_from = product.newFrom || '';
        this.form.new_to = product.newTo || '';

        // Map categories from names to IDs
        if (product.categories && product.categories.length > 0) {
          this.form.categories = product.categories
            .map(categoryName => {
              const category = this.findCategoryByName(categoryName, this.rootCategories);
              return category ? category.id : null;
            })
            .filter(id => id !== null);
        }

        // Set thumbnail and gallery separately
        if (product.thumbnail) {
          this.form.thumbnail = {
            id: product.thumbnail.id,
            path: product.thumbnail.url,
            filename: product.thumbnail.url.split('/').pop()
          };
        }

        if (product.gallery && product.gallery.length > 0) {
          this.form.gallery = product.gallery.map(galleryItem => ({
            id: galleryItem.id,
            path: galleryItem.url,     // URL ảnh
            filename: galleryItem.url.split('/').pop()
          }));
        }

        // Transform variations
        if (product.variations && product.variations.length > 0) {
          this.form.variations = product.variations.map(variation => ({
            id: variation.id,
            name: variation.name,
            type: variation.type?.toLowerCase() || 'text',
            isGlobal: variation.isGlobal || false,
            values: (variation.variationValues || []).map(value => {
              const valueObj = {
                id: value.id, // Preserve ID for update
                uid: this.generateUid(),
                label: value.label,
                value: value.value
              };

              // Set type-specific fields
              if (variation.type?.toLowerCase() === 'color') {
                valueObj.color = value.value;
              } else if (variation.type?.toLowerCase() === 'image') {
                valueObj.image = { path: value.value };
              }

              return valueObj;
            })
          }));
        }

        // Transform variants
        if (product.variants && product.variants.length > 0) {
          this.form.variants = product.variants.map(variant => {
            // Map specialPriceType from API format (FIXED/PERCENT) to UI format (fixed/percent)
            let specialPriceType = 'fixed';
            if (variant.specialPriceType) {
              specialPriceType = variant.specialPriceType.toLowerCase();
            }

            return {
              uid: this.generateUid(),
              id: variant.id,
              name: variant.name,
              price: variant.price || 0,
              special_price: variant.specialPrice || '',
              special_price_type: specialPriceType,
              special_price_start: variant.specialPriceStart || '',
              special_price_end: variant.specialPriceEnd || '',
              sku: variant.sku || '',
              manage_stock: variant.manageStock ? 1 : 0,
              qty: variant.qty || 0,
              in_stock: variant.inStock ? 1 : 0,
              is_active: variant.isActive ? 1 : 0,
              is_default: false,
              is_selected: true,
              is_open: false,
              media: [],
              position: 0,
            };
          });

          // Set price from first variant if exists
          if (this.form.variants[0]) {
            this.form.price = this.form.variants[0].price;
            this.form.special_price = this.form.variants[0].special_price;

            // Convert special_price_type from 'fixed'/'percent' to 1/2 for pricing section
            if (this.form.variants[0].special_price_type === 'percent') {
              this.form.special_price_type = 2;
            } else {
              this.form.special_price_type = 1;
            }

            this.form.special_price_start = this.form.variants[0].special_price_start;
            this.form.special_price_end = this.form.variants[0].special_price_end;
          }
        }

        // Transform options
        if (product.options && product.options.length > 0) {
          this.form.options = product.options.map(option => ({
            id: option.id,
            name: option.name,
            type: this.mapOptionTypeFromAPI(option.type),
            is_required: option.isRequired || false,
            isGlobal: option.isGlobal || false,
            values: (option.optionValues || []).map(value => ({
              id: value.id, // Preserve ID for update
              label: value.label,
              price: value.price || 0,
              price_type: value.priceType?.toLowerCase() || 'fixed'
            }))
          }));
        }

        this.hasAnyVariant = this.form.variations.length > 0;

            } catch (error) {
                console.error('Error loading product data:', error);
                const notification = useNotification();
                notification.error('Error!', 'Failed to load product data: ' + error.message);
            }
        },

    findCategoryByName(name, categories) {
      for (const category of categories) {
        if (category.name === name) {
          return category;
        }
        if (category.children && category.children.length > 0) {
          const found = this.findCategoryByName(name, category.children);
          if (found) return found;
        }
      }
      return null;
    },

    mapOptionTypeFromAPI(apiType) {
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
      return typeMap[apiType?.toUpperCase()] || 'field';
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
        // Debug: Check description content before submit
        console.log('Form description before submit:', {
          length: this.form.description?.length || 0,
          hasImages: this.form.description?.includes('<img') || false,
          content: this.form.description
        });

        // Ensure variants are generated
        if (this.form.variants.length === 0) {
          this.generateVariants();
        }

        // Transform form data
        const productData = this.transformFormData();

        console.log('Submitting product data:', productData);

        let response;
        if (this.isEditMode && this.productId) {
          // Update existing product
          response = await updateProduct(this.productId, productData);
          console.log('Product updated successfully:', response);
        } else {
          // Create new product - Backend will handle image attachments
          response = await createProduct(productData);
          console.log('Product created successfully:', response);
        }

        // Get the product ID
        const productId = this.productId || response.result?.id;

        // ONLY handle image operations in EDIT mode
        if (this.isEditMode && productId) {
          // Delete pending files
          if (this.pendingDeleteFiles.length > 0) {
            console.log('Deleting pending files:', this.pendingDeleteFiles);
            for (const fileId of this.pendingDeleteFiles) {
              try {
                await deleteEntityFile(fileId);
                console.log(`Entity file ${fileId} deleted successfully`);
              } catch (error) {
                console.error(`Error deleting entity file ${fileId}:`, error);
              }
            }
            this.pendingDeleteFiles = [];
          }

          // Attach NEW files (only files added during this edit session)
          if (this.pendingAttachFiles.length > 0) {
            console.log('Attaching new files:', this.pendingAttachFiles);
            for (const fileInfo of this.pendingAttachFiles) {
              try {
                await attachFileToEntity({
                  fileId: fileInfo.fileId,
                  entityId: productId,
                  entityType: 'PRODUCT',
                  zone: fileInfo.zone
                });
                console.log(`${fileInfo.zone} image ${fileInfo.fileId} attached successfully`);
              } catch (error) {
                console.error(`Error attaching image ${fileInfo.fileId}:`, error);
              }
            }
            this.pendingAttachFiles = [];
          }
        }
        // In CREATE mode: do NOT attach images manually - backend handles it

        // Handle success
        if (this.redirectAfterSave === '1') {
          this.$router.push({ name: 'admin.products.index' });
        } else {
          if (productId) {
            this.$router.push({ name: 'admin.products.edit', params: { id: productId } });
          }
        }
      } catch (error) {
        console.error('Error saving product:', error);

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
                        const notification = useNotification();
                        notification.error('Error!', errorData.message);
                    }
                } else {
                    const notification = useNotification();
                    notification.error('Error!', 'Failed to create product: ' + error.message);
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
        thumbnail: this.form.thumbnail ? this.form.thumbnail.path : null,
        brandId: this.form.brand_id ? parseInt(this.form.brand_id) : null,
        description: this.form.description || '',
        shortDescription: this.form.short_description || '',
        sku: this.form.sku || '',
        manageStock: this.form.manage_stock === 1,
        qty: this.form.qty ? parseInt(this.form.qty) : 0,
        isActive: this.form.is_active === 1,
        categoryIds: this.form.categories || [],

        // New From/To dates
        newFrom: this.formatDateTimeForAPI(this.form.new_from),
        newTo: this.formatDateTimeForAPI(this.form.new_to),

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

            // Nếu có id (từ variation value đã có sẵn), thêm vào để backend biết là update
            if (value.id) {
              valueData.id = value.id;
            }

            return valueData;
          })
        };

        // Nếu có id (từ global variation), thêm vào
        if (variation.id) {
          transformed.id = variation.id;
        }

        return transformed;
      });
    },

    transformVariants() {
      return this.form.variants.map(variant => {
        const isSingleVariant = this.form.variants.length === 1;

        const variantData = {
          sku: variant.sku || '',
          price: parseFloat(variant.price) || 0,
          specialPrice: variant.special_price ? parseFloat(variant.special_price) : null,
          specialPriceType: (variant.special_price_type || 'fixed').toUpperCase(),
          specialPriceStart: this.formatDateForAPI(variant.special_price_start),
          specialPriceEnd: this.formatDateForAPI(variant.special_price_end),
          isActive: variant.is_active === 1,
        };

        // Chỉ gửi inventory fields khi có nhiều hơn 1 variant
        if (!isSingleVariant) {
          variantData.manageStock = variant.manage_stock === 1;
          variantData.qty = variant.qty ? parseInt(variant.qty) : 0;
        }
        // Nếu là single variant → backend sẽ dùng giá trị từ product chính

        if (variant.id) {
          variantData.id = variant.id;
        }

        return variantData;
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
          optionValues: (option.values || []).map(value => {
            const valueData = {
              label: value.label,
              price: value.price ? parseFloat(value.price) : 0,
              priceType: (value.price_type || 'fixed').toUpperCase() // API expect uppercase: FIXED, PERCENT
            };

            // Nếu có id (từ option value đã có sẵn), thêm vào để backend biết là update
            // Nếu không có id, backend sẽ hiểu là tạo mới
            if (value.id) {
              valueData.id = value.id;
            }

            return valueData;
          })
        };

        // Nếu có id (từ global option), thêm vào
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
          is_default: false,
          is_selected: true,
          is_open: false,
          media: [],
          position: 0,
        }];
        this.hasAnyVariant = false; // Simple product không có variant trong UI
        return;
      }

      // Generate combinations of variation values
      const combinations = this.generateCombinations(variations);

      // Create or update variants
      const existingVariants = this.form.variants;
      this.form.variants = combinations.map(combo => {
    const uid = this.generateVariantUid(combo);
    // Sinh SKU duy nhất bằng tên sản phẩm, tên variation, tên value, index thực sự trong variation.values (theo uid)
    const skuBase = (this.form.name || 'SKU').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const skuParts = combo.map((c, idx) => {
        const variation = this.form.variations[idx];
        const varName = variation ? (variation.name || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase() : 'VAR';
        const valLabel = (c.label || c.value || 'X').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        // Tìm index thực sự của value trong variation.values bằng uid
        let realIndex = variation.values.findIndex(v => v.uid === c.uid);
        return varName + '-' + valLabel + '-' + realIndex;
    });
    const autoSku = skuBase + '-' + skuParts.join('-');
    const nameParts = combo.map(c => {
        const label = (c.label || '').trim();
        const value = (c.value || '').trim();
        if (label) return label;
        if (value) return value;
        return 'Không xác định';
    });
    const comboIds = combo.map(c => String(c.id));
    const existing = existingVariants.find(v => Array.isArray(v.valueIds) && v.valueIds.length === comboIds.length && v.valueIds.every((id, idx) => id === comboIds[idx]));
    const name = nameParts.join(' / ');
    return existing || {
        uid: uid,
        name: name,
        price: parseFloat(this.form.price) || 0,
        special_price: '',
        special_price_type: 'fixed',
        special_price_start: '',
        special_price_end: '',
        sku: autoSku,
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
    },

    generateCombinations(variations) {
      if (variations.length === 0) return [];
      // Lọc chỉ lấy value có label hoặc value thực sự
      const filteredVariations = variations.map(variation => ({
        ...variation,
        values: (variation.values || []).filter(v => {
          const label = (v.label || '').trim();
          const value = (v.value || '').trim();
          return label || value;
        })
      }));
      if (filteredVariations.some(v => v.values.length === 0)) return [];
      if (filteredVariations.length === 1) return filteredVariations[0].values.map(v => [v]);

      const result = [];
      const restCombinations = this.generateCombinations(filteredVariations.slice(1));

      filteredVariations[0].values.forEach(value => {
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

    formatDateTimeForAPI(dateString) {
      // Format date to LocalDateTime format for backend: yyyy-MM-ddTHH:mm:ss
      if (!dateString) return null;

      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;

      // Format: 2025-12-31T23:59:59
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    },

    formatDateForAPI(dateString) {
      // Format date to ISO 8601 format for backend: yyyy-MM-ddTHH:mm:ss
      if (!dateString) return null;

      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;

      // Format: 2025-12-31T23:59:59 (same as formatDateTimeForAPI)
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    },

    chooseVariationImage(data) {
      // Handle choosing image for variation value
      console.log('Choose variation image:', data);
    },


    changeVariantStatus(uid) {
      const variant = this.form.variants.find(v => v.uid === uid);
      if (variant) {
        // Toggle between 0 and 1 (not boolean)
        variant.is_active = variant.is_active === 1 ? 0 : 1;
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
      const newImage = {
        id: media.id,
        path: media.path,
        filename: media.filename
      };

      if (this.currentImageTarget === 'thumbnail') {
        this.form.thumbnail = newImage;

        // Track for attachment in edit mode only
        if (this.isEditMode) {
          this.pendingAttachFiles.push({
            fileId: media.id,
            zone: 'THUMBNAIL'
          });
        }
      } else if (this.currentImageTarget === 'gallery') {
        if (!this.form.gallery) {
          this.form.gallery = [];
        }
        this.form.gallery.push(newImage);

        // Track for attachment in edit mode only
        if (this.isEditMode) {
          this.pendingAttachFiles.push({
            fileId: media.id,
            zone: 'GALLERY'
          });
        }
      }

      this.syncMediaArray();
      this.closeFileManager();
    },

    async removeThumbnailHandler() {
      if (this.form.thumbnail && this.form.thumbnail.id) {
        if (this.isEditMode) {
          console.log('[Parent] Tracking thumbnail for deletion on save:', this.form.thumbnail.id);
          this.pendingDeleteFiles.push(this.form.thumbnail.id);

          // Remove from pending attach list if it was just added
          this.pendingAttachFiles = this.pendingAttachFiles.filter(
            f => f.fileId !== this.form.thumbnail.id
          );
        }
      }

      this.form.thumbnail = null;
      this.syncMediaArray();
    },

    async removeGalleryHandler(galleryIndex) {
      console.log('[Parent] removeGalleryHandler called', {
        index: galleryIndex,
        currentGallery: this.form.gallery,
        length: this.form.gallery ? this.form.gallery.length : 0
      });

      if (this.form.gallery && this.form.gallery.length > galleryIndex) {
        const galleryItem = this.form.gallery[galleryIndex];

        if (galleryItem.id) {
          if (this.isEditMode) {
            console.log('[Parent] Tracking gallery item for deletion on save:', galleryItem.id);
            this.pendingDeleteFiles.push(galleryItem.id);

            // Remove from pending attach list if it was just added
            this.pendingAttachFiles = this.pendingAttachFiles.filter(
              f => f.fileId !== galleryItem.id
            );
          }
        }

        const newGallery = [...this.form.gallery];
        newGallery.splice(galleryIndex, 1);
        this.form.gallery = newGallery;
      }

      this.syncMediaArray();
    },

    updateGalleryHandler(newGalleryArray) {
      // Update gallery from drag and drop
      this.form.gallery = newGalleryArray;
      this.syncMediaArray();
    },

    syncMediaArray() {
      // Sync form.media from thumbnail + gallery for component compatibility
      const result = [];
      if (this.form.thumbnail) {
        result.push(this.form.thumbnail);
      }
      if (this.form.gallery && this.form.gallery.length > 0) {
        result.push(...this.form.gallery);
      }
      this.form.media = result;
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
