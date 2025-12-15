<template>
    <div v-if="section === 'attributes'">
        <div class="box-header">
            <h5>{{ trans('product::products.group.attributes') }}</h5>

            <div class="drag-handle">
                <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
                <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
            </div>
        </div>

        <div class="box-body">
            <div id="product-attributes-wrapper">
                <div class="table-responsive">
                    <table class="options table table-bordered">
                        <thead class="hidden-xs">
                            <tr>
                                <th></th>
                                <th>{{ trans('product::products.attributes.attribute') }}</th>
                                <th>{{ trans('product::products.attributes.values') }}</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody
                            animation="150"
                            handle=".drag-handle"
                            is="draggable"
                            tag="tbody"
                            :list="form.attributes"
                        >
                            <tr v-for="(attribute, index) in form.attributes" :key="index">
                                <td class="text-center">
                                    <span class="drag-handle">
                                        <i class="fa">&#xf142;</i>
                                        <i class="fa">&#xf142;</i>
                                    </span>
                                </td>

                                <td>
                                    <div class="form-group row">
                                        <label :for="`attributes-${attribute.uid}-attribute-id`" class="visible-xs">
                                            {{ trans('product::products.attributes.attribute') }}
                                        </label>

                                        <select
                                            :name="`attributes.${attribute.uid}.attribute_id`"
                                            :id="`attributes-${attribute.uid}-attribute-id`"
                                            class="form-control attribute custom-select-black"
                                            @change="focusAttributeValueField(index)"
                                            v-model.number="attribute.attribute_id"
                                        >
                                            <option value="">{{ trans('admin::admin.form.please_select') }}</option>

                                            <optgroup v-for="attributeSet in attributeSets" :key="attributeSet.id" :label="attributeSet.name">
                                                <option 
                                                    v-for="attr in attributeSet.attributes" 
                                                    :key="attr.id" 
                                                    :value="attr.id"
                                                >
                                                    {{ attr.name }}
                                                </option>
                                            </optgroup>
                                        </select>

                                        <span
                                            class="help-block text-red"
                                            v-if="errors.has(`attributes.${attribute.uid}.attribute_id`)"
                                            v-text="errors.get(`attributes.${attribute.uid}.attribute_id`)"
                                        >
                                        </span>
                                    </div>
                                </td>

                                <td>
                                    <div class="form-group row">
                                        <label :for="`attributes-${attribute.uid}-values`" class="visible-xs">
                                            {{ trans('product::products.attributes.values') }}
                                        </label>

                                        <div class="field-with-error-tooltip">
                                            <!-- Input wrapper with selected tags -->
                                            <div class="value-input-wrapper" @click="toggleValueDropdown(index)">
                                                <div class="value-input-content">
                                                    <!-- Selected values as tags inside input -->
                                                    <div v-if="attribute.values && attribute.values.length > 0" class="selected-tags-inline">
                                                        <span
                                                            v-for="valueId in attribute.values"
                                                            :key="valueId"
                                                            class="tag-inline"
                                                        >
                                                            {{ getValueName(attribute.attribute_id, valueId) }}
                                                            <button
                                                                type="button"
                                                                @click.stop="removeValue(attribute, valueId)"
                                                                class="btn-remove-inline"
                                                            >
                                                                ✕
                                                            </button>
                                                        </span>
                                                    </div>
                                                    <span v-else class="placeholder-text">Click to select values...</span>
                                                </div>
                                            </div>

                                            <!-- Dropdown select -->
                                            <select
                                                v-show="activeDropdownIndex === index"
                                                :name="`attributes.${attribute.uid}.values`"
                                                :id="`attributes-${attribute.uid}-values`"
                                                multiple
                                                class="form-control values-select"
                                                @change="handleValuesChange($event, attribute)"
                                                size="8"
                                                ref="attributeValues"
                                            >
                                                <option
                                                    v-for="value in getAttributeValuesById(attribute.attribute_id)"
                                                    :key="value.id"
                                                    :value="value.id"
                                                    :selected="attribute.values && attribute.values.includes(value.id)"
                                                >
                                                    {{ value.value }}
                                                </option>
                                            </select>
                                        </div>

                                        <span
                                            class="help-block text-red"
                                            v-if="errors.has(`attributes.${attribute.uid}.values`)"
                                            v-text="errors.get(`attributes.${attribute.uid}.values`)"
                                        >
                                        </span>
                                    </div>
                                </td>

                                <td class="text-center">
                                    <button type="button" class="btn btn-default delete-row" @click="deleteAttribute(index, attribute.uid)">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <button type="button" class="btn btn-default" @click="addAttribute">
                    {{ trans('product::products.attributes.add_attribute') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import products from '@/Product/lang/en/products.json';
import attributes from '@/Product/lang/en/attributes.json';
import admin from '@/Admin/lang/en/admin.json';

export default {
    name: 'AttributesSection',
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
        attributeSets: {
            type: Array,
            default: () => [],
        },
        selectizeConfig: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            activeDropdownIndex: null,
        };
    },
    mounted() {
        document.addEventListener('click', this.handleClickOutside);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
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
        focusAttributeValueField(index) {
            const refs = this.$refs.attributeValues;
            if (refs && refs[index]) {
                this.$nextTick(() => {
                    refs[index].$el.focus();
                });
            }
        },
        clearValuesError(params) {
            if (this.errors.has(`${params.name}.${params.uid}.values`)) {
                this.errors.clear(`${params.name}.${params.uid}.values`);
            }
        },
        getAttributeValuesById(attributeId) {
            if (!attributeId || !this.attributeSets) {
                console.log('No attributeId or attributeSets:', { attributeId, attributeSets: this.attributeSets });
                return [];
            }
            
            for (const attributeSet of this.attributeSets) {
                const attr = attributeSet.attributes.find(a => a.id === attributeId);
                if (attr && attr.values) {
                    console.log('Found attribute values:', attr.values);
                    return attr.values;
                }
            }
            console.log('No values found for attributeId:', attributeId);
            return [];
        },
        deleteAttribute(index, uid) {
            this.form.attributes.splice(index, 1);
            this.errors.clear(`attributes.${uid}.attribute_id`);
            this.errors.clear(`attributes.${uid}.values`);
        },
        addAttribute() {
            console.log('Adding attribute, current attributeSets:', this.attributeSets);
            console.log('selectizeConfig:', this.selectizeConfig);
            this.form.attributes.push({
                uid: Date.now(),
                attribute_id: '',
                values: [],
            });
        },
        getValueName(attributeId, valueId) {
            const values = this.getAttributeValuesById(attributeId);
            const found = values.find(v => v.id === valueId);
            return found ? found.value : '';
        },
        removeValue(attribute, valueId) {
            const index = attribute.values.indexOf(valueId);
            if (index > -1) {
                attribute.values.splice(index, 1);
            }
        },
        handleValuesChange(event, attribute) {
            const selectedOptions = Array.from(event.target.selectedOptions, option => {
                const val = option.value;
                return isNaN(val) ? val : parseInt(val);
            });
            attribute.values = selectedOptions;
            this.clearValuesError({ name: 'attributes', uid: attribute.uid });
        },
        toggleValueDropdown(index) {
            event.stopPropagation();
            this.activeDropdownIndex = this.activeDropdownIndex === index ? null : index;
        },
        handleClickOutside(event) {
            const wrapper = this.$el.querySelector('#product-attributes-wrapper');
            if (wrapper && !wrapper.contains(event.target)) {
                this.activeDropdownIndex = null;
            }
        },
    },
};
</script>

<style scoped>
.box-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    border-bottom: 1px solid #f4f4f4;
    background-color: #fafafa;
}
.box-body {
    padding: 20px;
}

.table-responsive {
    overflow-x: visible !important;
}

.drag-handle {
    cursor: move;
    display: inline-block;
}

.drag-handle i {
    display: inline-block;
    margin: 0 0.5px;
}

.options.table {
    table-layout: fixed;
    width: 100%;
}

.options.table th {
    background-color: #f5f5f5;
    font-weight: normal;
    padding: 10px;
}

.options.table th:nth-child(1) {
    width: 50px;
}

.options.table th:nth-child(2) {
    width: 18%;
}

.options.table th:nth-child(3) {
    width: auto;
}

.options.table th:nth-child(4) {
    width: 60px;
}

.options.table td {
    padding: 10px;
    vertical-align: middle;
}

.options.table td:nth-child(1) {
    width: 50px;
    text-align: center;
}

.options.table td:nth-child(2) {
    width: 18%;
    padding-left: 10px;
}

.options.table td:nth-child(3) {
    width: auto;
    position: relative;
    padding-left: 10px;
}

.options.table td:nth-child(4) {
    width: 60px;
    text-align: center;
}

.form-group.row {
    margin-bottom: 0;
    width: 100%;
    max-width: 100%;
}

.form-control {
    width: 100%;
    padding: 4px 8px;
    font-size: 13px;
    height: 32px;
    margin-left: 15px;
}

.btn {
    padding: 6px 12px;
    font-size: 14px;
}

.delete-row {
    color: #d9534f;
}

.delete-row:hover {
    color: #fff;
    background-color: #d9534f;
}

.text-red {
    color: #dd4b39;
}

/* Category-style dropdown styling */
.field-with-error-tooltip {
    position: relative;
}

.value-input-wrapper {
    border: 1px solid #ccc;
    border-radius: 4px;
    min-height: 32px;
    padding: 4px 8px;
    cursor: pointer;
    background-color: #fff;
    margin-left: 15px;
    transition: border-color 0.2s;
}

.value-input-wrapper:hover {
    border-color: #66afe9;
}

.value-input-content {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    align-items: center;
    min-height: 24px;
}

.selected-tags-inline {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}

.tag-inline {
    display: inline-flex;
    align-items: center;
    background-color: #3c8dbc;
    color: #fff;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 12px;
    white-space: nowrap;
}

.btn-remove-inline {
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
    font-size: 14px;
    margin-left: 4px;
    padding: 0;
    line-height: 1;
    font-weight: bold;
}

.btn-remove-inline:hover {
    color: #ffcccc;
}

.placeholder-text {
    color: #999;
    font-size: 13px;
}

.values-select {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 1000;
    margin-top: 2px;
    margin-left: 15px;
    width: calc(100% - 15px) !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    max-height: 250px;
}

.values-select option:checked {
    background-color: #f0f0f0 !important;
    color: #333 !important;
}

.values-select option {
    padding: 8px 12px;
}
</style>
