<template>
    <div v-if="section === 'seo'">
        <div class="box-header">
            <h5>{{ trans('product::products.group.seo') }}</h5>

            <div class="drag-handle">
                <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
                <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
            </div>
        </div>

        <div class="box-body">
            <div class="form-group row">
                <label for="slug" class="col-sm-12 control-label text-left">
                    {{ trans('product::attributes.slug') }}
                    <span v-if="isEditMode" class="text-red">*</span>
                </label>

                <div class="col-sm-12">
                    <input 
                        type="text" 
                        name="slug" 
                        id="slug" 
                        class="form-control" 
                        v-model="form.slug"
                        @change="setProductSlug($event.target.value)"
                    >

                    <span 
                        v-if="errors.has('slug')" 
                        class="help-block text-red"
                        v-text="errors.get('slug')"
                    ></span>
                </div>
            </div>

            <div class="form-group row">
                <label for="meta-title" class="col-sm-12 control-label text-left">
                    {{ trans('meta::attributes.meta_title') }}
                </label>

                <div class="col-sm-12">
                    <input 
                        type="text" 
                        name="meta.meta_title" 
                        id="meta-title" 
                        class="form-control" 
                        v-model="form.meta.meta_title"
                    >

                    <span 
                        v-if="errors.has('meta.meta_title')" 
                        class="help-block text-red"
                        v-text="errors.get('meta.meta_title')"
                    ></span>
                </div>
            </div>

            <div class="form-group row">
                <label for="meta-description" class="col-sm-12 control-label text-left">
                    {{ trans('meta::attributes.meta_description') }}
                </label>

                <div class="col-sm-12">
                    <textarea 
                        name="meta.meta_description" 
                        rows="6" 
                        cols="10" 
                        id="meta-description" 
                        class="form-control" 
                        v-model="form.meta.meta_description"
                    ></textarea>

                    <span 
                        v-if="errors.has('meta.meta_description')" 
                        class="help-block text-red"
                        v-text="errors.get('meta.meta_description')"
                    ></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import products from '@/Product/lang/en/products.json';
import attributes from '@/Product/lang/en/attributes.json';

export default {
    name: 'SeoSection',
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
        isEditMode: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        trans(key) {
            const translationFiles = {
                'product::products': products,
                'product::attributes': attributes,
                'meta::attributes': attributes, // Assuming meta attributes are in the same file
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

        setProductSlug(value) {
            // Emit event to parent component to handle slug setting
            this.$emit('set-product-slug', value);
        },
    },
};
</script>
