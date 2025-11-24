<template>
    <div v-if="section === 'additional'">
        <div class="box-header">
            <h5>{{ trans('product::products.group.additional') }}</h5>

            <div class="drag-handle">
                <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
                <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
            </div>
        </div>

        <div class="box-body">
            <div class="form-group row">
                <label for="short-description" class="col-sm-12 control-label text-left">
                    {{ trans('product::attributes.short_description') }}
                </label>

                <div class="col-sm-12">
                    <textarea 
                        v-model="form.short_description"
                        name="short_description" 
                        rows="6" 
                        cols="10" 
                        id="short-description" 
                        class="form-control"
                    ></textarea>

                    <span 
                        v-if="errors.has('short_description')" 
                        class="help-block text-red"
                        v-text="errors.get('short_description')"
                    ></span>
                </div>
            </div>

            <div class="form-group row">
                <label for="new-from" class="col-sm-12 control-label text-left">
                    {{ trans('product::attributes.new_from') }}
                </label>

                <div class="col-sm-12">
                    <div class="input-group">
                        <span class="input-group-addon">
                            <i class="fa fa-calendar" aria-hidden="true"></i>
                        </span>

                        <flat-pickr
                            v-model="form.new_from"
                            name="new_from"
                            id="new-from"
                            class="form-control"
                            :config="flatPickrConfig"
                        ></flat-pickr>

                        <span
                            v-if="form.new_from"
                            class="input-group-addon cursor-pointer"
                            @click="removeDatePickerValue('new_from')"
                        >
                            <i class="fa fa-times" aria-hidden="true"></i>
                        </span>
                    </div>

                    <span 
                        v-if="errors.has('new_from')" 
                        class="help-block text-red" 
                        v-text="errors.get('new_from')"
                    ></span>
                </div>
            </div>

            <div class="form-group row">
                <label for="new-to" class="col-sm-12 control-label text-left">
                    {{ trans('product::attributes.new_to') }}
                </label>

                <div class="col-sm-12">
                    <div class="input-group">
                        <span class="input-group-addon">
                            <i class="fa fa-calendar" aria-hidden="true"></i>
                        </span>

                        <flat-pickr
                            v-model="form.new_to"
                            name="new_to"
                            id="new-to"
                            class="form-control"
                            :config="flatPickrConfig"
                        ></flat-pickr>

                        <span
                            v-if="form.new_to"
                            class="input-group-addon cursor-pointer"
                            @click="removeDatePickerValue('new_to')"
                        >
                            <i class="fa fa-times" aria-hidden="true"></i>
                        </span>
                    </div>

                    <span 
                        v-if="errors.has('new_to')" 
                        class="help-block text-red" 
                        v-text="errors.get('new_to')"
                    ></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import FlatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import products from '@/Product/lang/en/products.json';
import attributes from '@/Product/lang/en/attributes.json';

export default {
    name: 'AdditionalSection',
    components: {
        FlatPickr,
    },
    props: {
        section: {
            type: String,
            required: true,
        },
        product: {
            type: Object,
            default: () => ({}),
        },
        form: {
            type: Object,
            required: true,
        },
        errors: {
            type: Object,
            required: true,
        },
        flatPickrConfig: {
            type: Object,
            default: () => ({}),
        },
    },
    methods: {
        trans(key) {
            // Gọi đúng file JSON: product::products.* -> products.json
            //                     product::attributes.* -> attributes.json
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
        removeDatePickerValue(field) {
            this.form[field] = '';
        },
    },
};
</script>