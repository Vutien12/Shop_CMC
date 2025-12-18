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
                <div v-if="form.attributes && form.attributes.length > 0" class="table-responsive">
                    <table class="options table table-bordered">
                        <thead class="hidden-xs">
                            <tr>
                                <th></th>
                                <th>{{ trans('product::products.attributes.attribute') }}</th>
                                <th>{{ trans('product::products.attributes.values') }}</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="(attribute, index) in form.attributes" :key="index">
                                <td class="text-center">
                                    <span class="drag-handle">
                                        <i class="fa fa-ellipsis-v" style="color: #000000;"></i>
                                        <i class="fa fa-ellipsis-v" style="color: #000000; margin-left: 1px;"></i>
                                    </span>
                                </td>

                                <td>
                                    <div class="form-group">
                                        <label :for="`attribute-${index}-id`" class="visible-xs">
                                            {{ trans('product::products.attributes.attribute') }}
                                        </label>

                                        <select
                                            :name="`attributes[${index}].attributeId`"
                                            :id="`attribute-${index}-id`"
                                            class="form-control attribute-select"
                                            v-model.number="attribute.attributeId"
                                            @change="onAttributeChange(index)"
                                        >
                                            <option value="">{{ trans('admin::admin.form.please_select') }}</option>

                                            <optgroup
                                                v-for="attributeSet in attributeSets"
                                                :key="attributeSet.id"
                                                :label="attributeSet.name"
                                            >
                                                <option
                                                    v-for="attr in attributeSet.attributes"
                                                    :key="attr.id"
                                                    :value="attr.id"
                                                    :disabled="isAttributeUsedInOtherRows(attr.id, index)"
                                                >
                                                    {{ attr.name }}
                                                </option>
                                            </optgroup>
                                        </select>

                                        <span
                                            class="help-block text-red"
                                            v-if="errors.has(`attributes[${index}].attributeId`)"
                                            v-text="errors.get(`attributes[${index}].attributeId`)"
                                        >
                                        </span>
                                    </div>
                                </td>

                                <td>
                                    <div class="form-group">
                                        <label :for="`attribute-${index}-values`" class="visible-xs">
                                            {{ trans('product::products.attributes.values') }}
                                        </label>

                                        <div class="attribute-values-selector" @mouseenter="activeDropdownIndex = index" @mouseleave="activeDropdownIndex = null">
                                            <!-- Display selected values as tags -->
                                            <div class="selected-values-display" @mouseenter="activeDropdownIndex = index">
                                                <div v-if="attribute.attributeValues && attribute.attributeValues.length > 0" class="values-tags">
                                                    <span
                                                        v-for="selectedValue in attribute.attributeValues"
                                                        :key="selectedValue.id"
                                                        class="value-tag"
                                                    >
                                                        {{ selectedValue.value }}
                                                        <button
                                                            type="button"
                                                            class="remove-tag-btn"
                                                            @click.stop="removeValueFromAttribute(index, selectedValue.id)"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                </div>
                                                <span v-else class="placeholder-text">
                                                    {{ trans('admin::admin.form.please_select') }}
                                                </span>
                                                <i class="fa fa-caret-down dropdown-icon"></i>
                                            </div>

                                            <!-- Dropdown with checkboxes -->
                                            <div
                                                v-if="activeDropdownIndex === index"
                                                class="values-dropdown"
                                                @mouseenter="activeDropdownIndex = index"
                                            >
                                                <div
                                                    v-if="!attribute.attributeId"
                                                    class="no-values-message"
                                                >
                                                    Please select an attribute first
                                                </div>
                                                <div
                                                    v-else-if="getAttributeValuesById(attribute.attributeId).length === 0"
                                                    class="no-values-message"
                                                >
                                                    No values available
                                                </div>
                                                <label
                                                    v-else
                                                    v-for="value in getAttributeValuesById(attribute.attributeId)"
                                                    :key="value.id"
                                                    class="checkbox-label"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        :checked="isValueSelectedInAttribute(index, value.id)"
                                                        @change="toggleValueInAttribute(index, value)"
                                                    />
                                                    <span class="checkbox-text">{{ value.value }}</span>
                                                </label>
                                            </div>
                                        </div>

                                        <span
                                            class="help-block text-red"
                                            v-if="errors.has(`attributes[${index}].attributeValues`)"
                                            v-text="errors.get(`attributes[${index}].attributeValues`)"
                                        >
                                        </span>
                                    </div>
                                </td>

                                <td class="text-center">
                                    <button
                                        type="button"
                                        class="btn btn-default delete-row"
                                        @click="removeAttribute(index)"
                                    >
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
import { getAttribute } from '@/api';

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
            attributeValuesCache: {},
        };
    },
    watch: {
        attributeSets: {
            handler(newVal) {
                if (newVal && newVal.length > 0) {
                    console.log('AttributeSets loaded, preloading values...');
                    this.preloadAllAttributeValues();
                }
            },
            immediate: true
        }
    },
    mounted() {
        // Initialize form.attributes if not exists
        if (!this.form.attributes) {
            this.$set(this.form, 'attributes', []);
        }
        document.addEventListener('click', this.handleClickOutside);

        // Preload all attribute values from attributeSets
        this.preloadAllAttributeValues();
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

        getAttributeName(attributeId) {
            if (!this.attributeSets) return '';

            for (const attributeSet of this.attributeSets) {
                const attr = attributeSet.attributes.find(a => a.id === attributeId);
                if (attr) return attr.name;
            }
            return '';
        },

        async preloadAllAttributeValues() {
            if (!this.attributeSets || this.attributeSets.length === 0) {
                console.log('No attribute sets available to preload');
                return;
            }

            console.log('Preloading attribute values for all attributes...');
            const attributeIds = [];

            // Collect all attribute IDs from attribute sets
            this.attributeSets.forEach(attributeSet => {
                if (attributeSet.attributes) {
                    attributeSet.attributes.forEach(attr => {
                        if (attr.id && !this.attributeValuesCache[attr.id]) {
                            attributeIds.push(attr.id);
                        }
                    });
                }
            });

            console.log(`Found ${attributeIds.length} attributes to preload`);

            // Load all attribute values in parallel
            const promises = attributeIds.map(id => this.loadAttributeValues(id));
            await Promise.all(promises);

            console.log('Finished preloading attribute values');
        },

        async loadAttributeValues(attributeId) {
            try {
                console.log(`Calling API: /attributes/${attributeId}`);
                const response = await getAttribute(attributeId);
                console.log('API Response:', response);

                if (response && response.result) {

                    const values = response.result.attributeValues ||
                                   response.result.values ||
                                   response.result.attribute_values ||
                                   [];

                    console.log(`Found ${values.length} values for attribute ${attributeId}:`, values);

                    if (values.length > 0) {
                        this.attributeValuesCache[attributeId] = values;
                    } else {
                        console.warn(`No values found in response for attribute ${attributeId}`);
                    }
                } else {
                    console.error('Invalid response structure:', response);
                }
            } catch (error) {
                console.error(`Error loading attribute values for attribute ${attributeId}:`, error);
            }
        },

        getAttributeValuesById(attributeId) {
            if (!attributeId) {
                console.log('getAttributeValuesById: No attributeId provided');
                return [];
            }

            // Check cache first (this is populated by API calls)
            if (this.attributeValuesCache[attributeId]) {
                console.log(`getAttributeValuesById: Using cached values for attribute ${attributeId}`, this.attributeValuesCache[attributeId]);
                return this.attributeValuesCache[attributeId];
            }

            // Fallback: Check if values are in attributeSets (unlikely based on API response)
            if (this.attributeSets) {
                for (const attributeSet of this.attributeSets) {
                    const attr = attributeSet.attributes.find(a => a.id === attributeId);
                    if (attr) {
                        const values = attr.attributeValues || attr.values || [];
                        if (values.length > 0) {
                            console.log(`getAttributeValuesById: Found values in attributeSet for attribute ${attributeId}`, values);
                            this.attributeValuesCache[attributeId] = values;
                            return values;
                        }
                    }
                }
            }

            console.log(`getAttributeValuesById: No values found for attribute ${attributeId}`);
            return [];
        },

        isAttributeUsedInOtherRows(attributeId, currentIndex) {
            if (!this.form.attributes) return false;
            return this.form.attributes.some((attr, idx) =>
                idx !== currentIndex && attr.attributeId === attributeId
            );
        },

        async onAttributeChange(index) {
            const attribute = this.form.attributes[index];
            if (!attribute || !attribute.attributeId) return;

            // Update attribute name
            attribute.attributeName = this.getAttributeName(attribute.attributeId);

            // Clear selected values when attribute changes
            this.$set(attribute, 'attributeValues', []);

            // Always load values from API
            console.log(`Loading values for attribute ${attribute.attributeId}...`);
            await this.loadAttributeValues(attribute.attributeId);
        },

        handleClickOutside(event) {
            const wrapper = this.$el.querySelector('#product-attributes-wrapper');
            if (wrapper && !wrapper.contains(event.target)) {
                this.activeDropdownIndex = null;
            }
        },

        isValueSelectedInAttribute(attributeIndex, valueId) {
            const attribute = this.form.attributes[attributeIndex];
            if (!attribute || !attribute.attributeValues) return false;
            return attribute.attributeValues.some(v => v.id === valueId);
        },

        toggleValueInAttribute(attributeIndex, value) {
            const attribute = this.form.attributes[attributeIndex];
            if (!attribute) return;

            if (!attribute.attributeValues) {
                this.$set(attribute, 'attributeValues', []);
            }

            const existingIndex = attribute.attributeValues.findIndex(v => v.id === value.id);

            if (existingIndex > -1) {
                attribute.attributeValues.splice(existingIndex, 1);
            } else {
                attribute.attributeValues.push({
                    id: value.id,
                    value: value.value
                });
            }
        },

        removeValueFromAttribute(attributeIndex, valueId) {
            const attribute = this.form.attributes[attributeIndex];
            if (!attribute || !attribute.attributeValues) return;

            const index = attribute.attributeValues.findIndex(v => v.id === valueId);
            if (index > -1) {
                attribute.attributeValues.splice(index, 1);
            }
        },

        addAttribute() {
            if (!this.form.attributes) {
                this.$set(this.form, 'attributes', []);
            }

            this.form.attributes.push({
                attributeId: '',
                attributeName: '',
                filterable: true,
                attributeValues: []
            });
        },

        removeAttribute(index) {
            this.form.attributes.splice(index, 1);
            this.errors.clear(`attributes[${index}].attributeId`);
            this.errors.clear(`attributes[${index}].attributeValues`);
        }
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

.box-header h5 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
}

.box-body {
    padding: 20px;
}

.drag-handle {
    cursor: move;
    display: inline-block;
}

.drag-handle i {
    display: inline-block;
    margin: 0 0.5px;
}

/* Table Styles */
.table-responsive {
    overflow-x: visible;
}

.options.table {
    width: 100%;
    table-layout: fixed;
}

.options.table th {
    background-color: #f5f5f5;
    font-weight: 600;
    padding: 10px;
}

.options.table th:nth-child(1) {
    width: 50px;
}

.options.table th:nth-child(2) {
    width: 25%;
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

.form-group {
    margin-bottom: 0;
}

.visible-xs {
    display: none;
}

@media (max-width: 767px) {
    .visible-xs {
        display: block;
    }
}

/* Attribute Values Selector */
.attribute-values-selector {
    position: relative;
}

.selected-values-display {
    min-height: 38px;
    padding: 6px 30px 6px 12px;
    border: 1px solid #d2d6de;
    border-radius: 3px;
    background: white;
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
}

.selected-values-display:hover {
    border-color: #3c8dbc;
}

.dropdown-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
    pointer-events: none;
}

.placeholder-text {
    color: #999;
    font-size: 14px;
}

/* Values Tags */
.values-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    width: 100%;
}

.value-tag {
    display: inline-flex;
    align-items: center;
    background-color: #3c8dbc;
    color: white;
    padding: 4px 8px;
    border-radius: 3px;
    font-size: 13px;
    gap: 6px;
}

.remove-tag-btn {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0;
    margin: 0;
    font-size: 16px;
    line-height: 1;
    font-weight: bold;
}

.remove-tag-btn:hover {
    color: #ffcccc;
}

/* Values Dropdown */
.values-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 1000;
    background: white;
    border: 1px solid #d2d6de;
    border-radius: 3px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.no-values-message {
    padding: 12px;
    color: #999;
    text-align: center;
    font-style: italic;
}

.checkbox-label {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    cursor: pointer;
    margin: 0;
    transition: background-color 0.2s;
}

.checkbox-label:hover {
    background-color: #f0f8ff;
}

.checkbox-label input[type="checkbox"] {
    margin-right: 8px;
    cursor: pointer;
}

.checkbox-text {
    font-size: 14px;
    user-select: none;
}

.checkbox-label input[type="checkbox"]:checked + .checkbox-text {
    font-weight: 600;
    color: #3c8dbc;
}

/* Buttons */
.btn {
    padding: 6px 12px;
    font-size: 14px;
}

.delete-row {
    background-color: transparent;
    border: none;
    color: #dd4b39;
}

.delete-row:hover {
    color: #c23321;
}

/* Form Control */
.form-control {
    width: 100%;
    padding: 6px 12px;
    font-size: 14px;
    border: 1px solid #d2d6de;
    border-radius: 3px;
}

.form-control:focus {
    border-color: #3c8dbc;
    outline: none;
}

.attribute-select {
    max-width: 100%;
}

/* Error Messages */
.help-block {
    display: block;
    margin-top: 5px;
    font-size: 12px;
}

.text-red {
    color: #dd4b39;
}

/* Disabled Options */
select option:disabled {
    color: #999;
    font-style: italic;
}

/* Responsive */
@media (max-width: 768px) {
    .options.table th:nth-child(2),
    .options.table th:nth-child(3) {
        width: auto;
    }
}
</style>
