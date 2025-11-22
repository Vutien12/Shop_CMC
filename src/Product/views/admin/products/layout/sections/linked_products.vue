<template>
    <div v-if="section === 'linked_products'">
        <div class="box-header">
            <h5>{{ trans('product::products.group.linked_products') }}</h5>

            <div class="drag-handle">
                <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
                <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
            </div>
        </div>

        <div class="box-body">
            <div class="form-group row">
                <label for="up-sells" class="col-sm-12 control-label text-left">
                    {{ trans('product::attributes.up_sells') }}
                </label>

                <div class="col-sm-12">
                    <selectize
                        name="up_sells"
                        id="up-sells"
                        :settings="searchableSelectizeConfig"
                        v-model="form.up_sells"
                        multiple
                    >
                        <option 
                            v-for="product in upSellProducts" 
                            :key="product.id" 
                            :value="product.id"
                        >
                            {{ product.name }}
                        </option>
                    </selectize>
                </div>
            </div>

            <div class="form-group row">
                <label for="cross-sells" class="col-sm-12 control-label text-left">
                    {{ trans('product::attributes.cross_sells') }}
                </label>

                <div class="col-sm-12">
                    <selectize
                        name="cross_sells"
                        id="cross-sells"
                        :settings="searchableSelectizeConfig"
                        v-model="form.cross_sells"
                        multiple
                    >
                        <option 
                            v-for="product in crossSellProducts" 
                            :key="product.id" 
                            :value="product.id"
                        >
                            {{ product.name }}
                        </option>
                    </selectize>
                </div>
            </div>

            <div class="form-group row">
                <label for="related-products" class="col-sm-12 control-label text-left">
                    {{ trans('product::attributes.related_products') }}
                </label>

                <div class="col-sm-12">
                    <selectize
                        name="related_products"
                        id="related-products"
                        :settings="searchableSelectizeConfig"
                        v-model="form.related_products"
                        multiple
                    >
                        <option 
                            v-for="product in relatedProducts" 
                            :key="product.id" 
                            :value="product.id"
                        >
                            {{ product.name }}
                        </option>
                    </selectize>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import products from '@/Product/lang/en/products.json';
import attributes from '@/Product/lang/en/attributes.json';

export default {
    name: 'LinkedProductsSection',
    props: {
        section: {
            type: String,
            required: true,
        },
        form: {
            type: Object,
            required: true,
        },
        searchableSelectizeConfig: {
            type: Object,
            default: () => ({}),
        },
        upSellProducts: {
            type: Array,
            default: () => [],
        },
        crossSellProducts: {
            type: Array,
            default: () => [],
        },
        relatedProducts: {
            type: Array,
            default: () => [],
        },
    },
    methods: {
        trans(key) {
            const translationFiles = {
                'product::products': products,
                'product::attributes': attributes,
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
    },
};
</script>
