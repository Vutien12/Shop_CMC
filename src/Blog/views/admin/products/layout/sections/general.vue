<template>
    <div class="box" v-if="section === 'general'">
        <div class="box-header">
            <h5>{{ trans('product::products.group.general') }}</h5>
        </div>

        <div class="box-body">
            <div class="form-group row">
                <label for="name" class="col-sm-12 control-label text-left">
                    {{ trans('product::attributes.name') }}
                    <span class="text-red">*</span>
                </label>

                <div class="col-sm-12">
                    <input
                        type="text"
                        name="name"
                        id="name"
                        class="form-control"
                        v-model="form.name"
                    >
                    <span 
                        v-if="errors.has('name')" 
                        class="help-block text-red"
                        v-text="errors.get('name')"
                    ></span>
                </div>
            </div>

            <div class="form-group row">
                <label for="description" class="col-sm-12 control-label text-left">
                    {{ trans('product::attributes.description') }}
                </label>

                <div class="col-sm-12">
                    <TinyMCEEditor
                        v-model="form.description"
                        :height="350"
                        @change="handleDescriptionChange"
                    />
                    <span 
                        v-if="errors.has('description')" 
                        class="help-block text-red"
                        v-text="errors.get('description')"
                    ></span>
                </div>
            </div>

            <div class="form-group row">
                <label for="brand-id" class="col-sm-12 control-label text-left">
                    {{ trans('product::attributes.brand_id') }}
                    <span class="text-red">*</span>
                </label>
                <div class="col-sm-6">
                    <select 
                        name="brand_id" 
                        id="brand-id" 
                        class="form-control custom-select-black"
                        v-model="form.brand_id"
                    >
                        <option value="">{{ trans('admin::admin.form.please_select') }}</option>
                        <option 
                            v-for="brand in brands" 
                            :key="brand.id" 
                            :value="brand.id"
                        >
                            {{ brand.name }}
                        </option>
                    </select>
                    <span 
                        v-if="errors.has('brand_id')" 
                        class="help-block text-red"
                        v-text="errors.get('brand_id')"
                    ></span>
                </div>
            </div>

            <div class="form-group row">
                <label for="categories" class="col-sm-12 control-label text-left">
                    {{ trans('product::attributes.categories') }}
                    <span class="text-red">*</span>
                </label>

                <div class="col-sm-6">
                    <select 
                        name="category_id" 
                        id="category-id" 
                        class="form-control custom-select-black"
                        v-model="form.category_id"
                    >
                        <option value="">{{ trans('admin::admin.form.please_select') }}</option>
                        <option 
                            v-for="category in rootCategories" 
                            :key="category.id" 
                            :value="category.id"
                        >
                            {{ category.name }}
                        </option>
                    </select>
                    <span 
                        v-if="errors.has('category_id')" 
                        class="help-block text-red"
                        v-text="errors.get('category_id')"
                    ></span>
                </div>
            </div>

            <div class="form-group row">
                <label for="is-active" class="col-sm-12 control-label text-left">
                    {{ trans('product::attributes.is_active') }}
                    <span class="text-red">*</span>
                </label>

                <div class="col-sm-9">
                    <div class="switch">
                        <input 
                            type="checkbox" 
                            name="is_active" 
                            id="is-active" 
                            v-model="form.is_active"
                        >

                        <label for="is-active">
                            {{ trans('product::products.form.enable_the_product') }}
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TinyMCEEditor from '@/Admin/components/TinyMCEEditor.vue';
import products from '@/Product/lang/en/products.json';
import attributes from '@/Product/lang/en/attributes.json';
import admin from '@/Admin/lang/en/admin.json';

export default {
    name: 'GeneralSection',
    components: {
        TinyMCEEditor
    },
    props: {
        section: {
            type: String,
            required: true,
        },
        form: {
            type: Object,
            required: true,
        },
        errors: {
            type: Object,
            required: true,
        },
        product: {
            type: Object,
            default: () => ({}),
        },
        brands: {
            type: Array,
            default: () => [],
        },
        categories: {
            type: Array,
            default: () => [],
        },
    },
    computed: {
        rootCategories() {
            return this.categories.filter(cat => cat.parent_id === null);
        },
    },
    methods: {
        trans(key) {
            const translationFiles = {
                'product::products': products,
                'product::attributes': attributes,
                'admin::admin': admin,
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

            return typeof result === 'string' ? result : key;
        },
        handleDescriptionChange(value) {
            // Clear description error when user types
            if (this.errors.has('description')) {
                this.errors.clear('description');
            }
        }
    },
};
</script>
