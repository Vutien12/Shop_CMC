<template>
    <div v-if="section === 'variations'">
        <div class="box-header">
            <h5>{{ trans('product::products.group.variations') }}</h5>

            <div class="d-flex">
                <span
                    class="toggle-accordion"
                    :class="{ 'collapsed': isCollapsedVariationsAccordion }"
                    data-toggle="tooltip"
                    data-placement="top"
                    :data-original-title="
                        isCollapsedVariationsAccordion ?
                        trans('product::products.section.expand_all') :
                        trans('product::products.section.collapse_all')
                    "
                    @click="toggleAccordions({
                        selector: '.variations-group .panel-heading',
                        state: isCollapsedVariationsAccordion,
                        data: form.variations
                    })"
                >
                    <i class="fa fa-angle-double-up" aria-hidden="true"></i>
                </span>

                <div class="drag-handle" style="margin-left:10px;">
                    <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
                    <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
                </div>
            </div>
        </div>
    </div>
    <div class="box-body">
        <div class="accordion-box-content">
            <draggable
                animation="150"
                class="variations-group"
                force-fallback="true"
                handle=".drag-handle"
                @change="reorderVariations"
                :list="form.variations"
            >
                <div
                    v-for="(variation, index) in form.variations"
                    :id="`variation-${variation.uid}`"
                    class="content-accordion panel-group options-group-wrapper"
                    :class="`variation-${variation.uid}`"
                    :key="index"
                >
                    <div class="panel panel-default">
                        <div class="panel-heading" @click.stop="toggleAccordion($event, variation)">
                            <h4 class="panel-title">
                                <div
                                    :aria-expanded="variation.is_open"
                                    :class="{
                                        'collapsed': !variation.is_open,
                                        'has-error': hasAnyError({
                                            name: 'variations',
                                            uid: variation.uid
                                        })
                                    }"
                                >
                                    <span class="drag-handle" >
                                        <i class="fa">&#xf142;</i>
                                        <i class="fa">&#xf142;</i>
                                    </span>

                                    <span class="variation-name" style="margin-left:5px;color:#7b7778;">{{ variation.name || trans('product::products.variations.new_variation') }}</span>
                                </div>

                                <span
                                    class="delete-option"
                                    @click.stop="deleteVariation(index, variation.uid)"
                                >
                                    <i class="fa fa-trash"></i>
                                </span>
                            </h4>
                        </div>

                        <div class="panel-collapse" :class="{ 'collapse': !variation.is_open }">
                            <div class="panel-body">
                                <div class="new-option">
                                    <div class="row variation-form-row">
                                        <div class="col-sm-6">
                                            <div class="form-group row">
                                                <label :for="`variations-${variation.uid}-name`">
                                                    {{ trans('product::products.form.variations.name') }}
                                                    <span v-if="variation.name || variation.type" class="text-red">*</span>
                                                </label>

                                                <input
                                                    type="text"
                                                    :name="`variations.${variation.uid}.name`"
                                                    :id="`variations-${variation.uid}-name`"
                                                    class="form-control"
                                                    v-model="variation.name"
                                                >

                                                <span
                                                    class="help-block text-red"
                                                    v-if="errors.has(`variations.${variation.uid}.name`)"
                                                    v-text="errors.get(`variations.${variation.uid}.name`)"
                                                >
                                                </span>
                                            </div>
                                        </div>

                                        <div class="col-sm-3">
                                            <div class="form-group row">
                                                <label :for="`variations-${variation.uid}-type`">
                                                    {{ trans('product::products.form.variations.type') }}
                                                    <span v-if="variation.name || variation.type" class="text-red">*</span>
                                                </label>

                                                <select
                                                    :name="`variations.${variation.uid}.type`"
                                                    :id="`variations-${variation.uid}-type`"
                                                    class="form-control custom-select-black"
                                                    @change="changeVariationType($event.target.value, index, variation.uid)"
                                                    v-model="variation.type"
                                                >
                                                    <option value="">
                                                        {{ trans('product::products.form.variations.variation_types.please_select') }}
                                                    </option>

                                                    <option value="text">
                                                        {{ trans('product::products.form.variations.variation_types.text') }}
                                                    </option>

                                                    <option value="color">
                                                        {{ trans('product::products.form.variations.variation_types.color') }}
                                                    </option>

                                                    <option value="image">
                                                        {{ trans('product::products.form.variations.variation_types.image') }}
                                                    </option>
                                                </select>

                                                <span
                                                    class="help-block text-red"
                                                    v-if="errors.has(`variations.${variation.uid}.type`)"
                                                    v-text="errors.get(`variations.${variation.uid}.type`)"
                                                >
                                                </span>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div class="variation-values" v-if="variation.type !== ''">
                                    <div class="table-responsive">
                                        <table
                                            class="options table table-bordered table-striped"
                                            :class="variation.type !== '' ? `type-${variation.type}` : ''"
                                        >
                                            <thead>
                                                <tr>
                                                    <th style="width: 50px;"></th>
                                                    <th style="width: 75%;">
                                                        {{ trans('product::products.form.variations.label') }}
                                                        <span class="text-red">*</span>
                                                    </th>
                                                    <th v-if="variation.type === 'color'" style="width: 25%;">
                                                        {{ trans('product::products.form.variations.color') }}
                                                        <span class="text-red">*</span>
                                                    </th>
                                                    <th v-if="variation.type === 'image'" style="width: 25%;">
                                                        {{ trans('product::products.form.variations.image') }}
                                                        <span class="text-red">*</span>
                                                    </th>
                                                    <th style="width: 80px;"></th>
                                                </tr>
                                            </thead>

                                            <tbody
                                                animation="150"
                                                handle=".drag-handle"
                                                is="draggable"
                                                tag="tbody"
                                                @change="reorderVariationValues"
                                                :list="variation.values"
                                            >
                                                <tr class="option-row" v-for="(value, valueIndex) in variation.values" :key="valueIndex">
                                                    <td class="text-center" style="width: 50px;">
                                                        <span class="drag-handle">
                                                            <i class="fa">&#xf142;</i>
                                                            <i class="fa">&#xf142;</i>
                                                        </span>
                                                    </td>
                                                    <td style="width: 75%;">
                                                        <input
                                                            type="text"
                                                            :name="`variations.${variation.uid}.values.${value.uid}.label`"
                                                            :id="`variations-${variation.uid}-values-${value.uid}-label`"
                                                            class="form-control"
                                                            style="min-width: 100px; width: 100%;"
                                                            @input="generateVariants"
                                                            @keyup.enter="addVariationRowOnPressEnter($event, index, valueIndex)"
                                                            v-model="value.label"
                                                        >

                                                        <span
                                                            class="help-block text-red"
                                                            v-if="errors.has(`variations.${variation.uid}.values.${value.uid}.label`)"
                                                            v-text="errors.get(`variations.${variation.uid}.values.${value.uid}.label`)"
                                                        >
                                                        </span>
                                                    </td>
                                                    <td v-if="variation.type === 'color'" style="width: 25%;">
                                                        <div style="display: flex; align-items: center; border: 1px solid #ddd; border-radius: 4px; overflow: hidden; padding: 0px; min-width: 150px;">
                                                            <input
                                                                type="text"
                                                                :name="`variations.${variation.uid}.values.${value.uid}.color`"
                                                                :id="`variations-${variation.uid}-values-${value.uid}-color`"
                                                                v-model="value.color"
                                                                class="form-control"
                                                                placeholder="#000000"
                                                                style="flex: 1; min-width: 80px; border: none; outline: none; border-radius: 0; padding: 6px 8px; font-size: 14px;"
                                                            >
                                                            <label
                                                                :for="`variations-${variation.uid}-values-${value.uid}-color-picker`"
                                                                :style="getColorButtonStyle(value.color)"
                                                                :title="'Pick color: ' + (value.color || 'Select a color')"
                                                            ></label>
                                                            <input
                                                                type="color"
                                                                :id="`variations-${variation.uid}-values-${value.uid}-color-picker`"
                                                                v-model="value.color"
                                                                style="opacity: 0; position: absolute; pointer-events: none; width: 0; height: 0;"
                                                            >
                                                        </div>

                                                        <span
                                                            class="help-block text-red"
                                                            v-if="errors.has(`variations.${variation.uid}.values.${value.uid}.color`)"
                                                            v-text="errors.get(`variations.${variation.uid}.values.${value.uid}.color`)"
                                                        >
                                                        </span>
                                                    </td>
                                                    <td v-if="variation.type === 'image'">
                                                        <div class="image-picker-cell">
                                                            <button
                                                                type="button"
                                                                class="btn btn-sm btn-default image-picker-btn"
                                                                @click="chooseVariationImage(index, variation.uid, valueIndex, value.uid)"
                                                            >
                                                                <i class="fa fa-folder-open"></i> Browse
                                                            </button>
                                                            <div v-if="value.image && value.image.path" class="image-preview-small">
                                                                <img :src="value.image.path" alt="Preview">
                                                                <button
                                                                    type="button"
                                                                    class="btn-remove-image-small"
                                                                    @click.stop="removeVariationImage(index, variation.uid, valueIndex, value.uid)"
                                                                    title="Remove image"
                                                                >
                                                                    <i class="fa fa-times"></i>
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <span
                                                            class="help-block text-red"
                                                            v-if="errors.has(`variations.${variation.uid}.values.${value.uid}.image`)"
                                                            v-text="errors.get(`variations.${variation.uid}.values.${value.uid}.image`)"
                                                        >
                                                        </span>
                                                    </td>
                                                    <td class="text-center" style="width: 80px;">
                                                        <button
                                                            type="button"
                                                            tabindex="-1"
                                                            class="btn btn-default delete-row"
                                                            @click="deleteVariationRow(index, variation.uid, valueIndex, value.uid)"
                                                        >
                                                            <i class="fa fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <button
                                        type="button"
                                        class="btn btn-default"
                                        @click="addVariationRow(index, variation.uid)"
                                    >
                                        {{ trans('product::products.variations.add_row') }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </draggable>

            <div class="accordion-box-footer">
                <button type="button" class="btn btn-default" @click="addVariation">
                    {{ trans('product::products.variations.add_variation') }}
                </button>
                <div class="insert-template">
                    <select
                        class="form-control custom-select-black"
                        v-model="globalVariationId"
                        style="width: 150px; margin-right: 20px;"
                    >
                        <option value="">
                            {{ trans('product::products.form.variations.select_template') }}
                        </option>

                        <option
                            v-for="variation in globalVariations"
                            :key="variation.id"
                            :value="variation.id"
                        >
                            {{ variation.name }}
                        </option>
                    </select>

                    <button
                        type="button"
                        class="btn btn-default"
                        :class="{ 'btn-loading': addingGlobalVariation }"
                        :disabled="isAddGlobalVariationDisabled"
                        @click="addGlobalVariation"
                    >
                        {{ trans('product::products.variations.insert') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { VueDraggableNext } from 'vue-draggable-next';
import products from '@/Product/lang/en/products.json';

export default {
    name: 'VariationsSection',
    components: {
        draggable: VueDraggableNext,
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
        globalVariations: {
            type: Array,
            default: () => [],
        },
        placeholderImage: {
            type: String,
            default: '/assets/placeholder_image.png',
        },
    },
    data() {
        return {
            isCollapsedVariationsAccordion: false,
            globalVariationId: '',
            addingGlobalVariation: false,
        };
    },
    computed: {
        isAddGlobalVariationDisabled() {
            return !this.globalVariationId || this.addingGlobalVariation;
        },
    },
    methods: {
        trans(key) {
            const translationFiles = {
                'product::products': products,
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

        toggleAccordions({ selector, state, data }) {
            this.isCollapsedVariationsAccordion = !state;

            if (data && Array.isArray(data)) {
                data.forEach(item => {
                    item.is_open = this.isCollapsedVariationsAccordion;
                });
            }
        },

        toggleAccordion(event, variation) {
            variation.is_open = !variation.is_open;
        },

        hasAnyError({ name, uid }) {
            const prefix = `${name}.${uid}`;
            return this.errors.any(prefix);
        },

        reorderVariations() {
            this.form.variations.forEach((variation, index) => {
                variation.position = index;
            });
        },

        reorderVariationValues() {
            this.form.variations.forEach(variation => {
                variation.values.forEach((value, index) => {
                    value.position = index;
                });
            });
        },

        addVariation() {
            const uid = this.generateUid();
            this.form.variations.push({
                uid: uid,
                name: '',
                type: '',
                values: [],
                is_open: true,
                position: this.form.variations.length,
            });
        },

        deleteVariation(index, uid) {
            this.form.variations.splice(index, 1);
            this.generateVariants();
        },

        changeVariationType(type, index, uid) {
            const variation = this.form.variations[index];

            // Clear existing values when changing type
            variation.values = [];

            // Add initial row for new type
            this.addVariationRow(index, uid);
        },

        addVariationRow(index, uid) {
            const valueUid = this.generateUid();
            const variation = this.form.variations[index];

            const newValue = {
                uid: valueUid,
                label: '',
                position: variation.values.length,
            };

            if (variation.type === 'color') {
                newValue.color = ''; // Để rỗng để hiển thị checkerboard
            } else if (variation.type === 'image') {
                newValue.image = { id: null, path: '' };
            } else {
                newValue.value = '';
            }

            variation.values.push(newValue);
        },

        addVariationRowOnPressEnter(event, index, valueIndex) {
            const variation = this.form.variations[index];

            // Check if this is the last row
            if (valueIndex === variation.values.length - 1) {
                this.addVariationRow(index, variation.uid);

                // Focus on the new row's label input
                this.$nextTick(() => {
                    const newValueUid = variation.values[variation.values.length - 1].uid;
                    const selector = `#variations-${variation.uid}-values-${newValueUid}-label`;
                    const element = document.querySelector(selector);
                    if (element) {
                        element.focus();
                    }
                });
            }
        },

        deleteVariationRow(variationIndex, variationUid, valueIndex, valueUid) {
            const variation = this.form.variations[variationIndex];
            variation.values.splice(valueIndex, 1);
            this.generateVariants();
        },

        chooseVariationImage(variationIndex, variationUid, valueIndex, valueUid) {
            this.$emit('choose-variation-image', { variationIndex, variationUid, valueIndex, valueUid });
        },

        removeVariationImage(variationIndex, variationUid, valueIndex, valueUid) {
            const variation = this.form.variations[variationIndex];
            const value = variation.values[valueIndex];
            
            // Xóa image
            value.image = { id: null, path: '' };
        },

        generateVariants() {
            this.$emit('generate-variants');
        },

        addGlobalVariation() {
            if (!this.globalVariationId) return;

            // Find the selected global variation from the prop
            const selectedVariation = this.globalVariations.find(
                v => v.id === parseInt(this.globalVariationId)
            );

            if (!selectedVariation) return;

            const uid = this.generateUid();

            // API trả về variationValues, không phải values
            const variationValues = selectedVariation.variationValues || selectedVariation.values || [];

            const newVariation = {
                uid: uid,
                id: selectedVariation.id, // Lưu id để backend biết đây là global variation
                name: selectedVariation.name,
                type: selectedVariation.type?.toLowerCase() || '', // API có thể trả về "Text", "Color", cần lowercase
                isGlobal: true, // Đánh dấu đây là global variation
                originalVariation: JSON.parse(JSON.stringify(selectedVariation)), // Lưu bản gốc để so sánh sau
                values: variationValues.map((value, index) => {
                    const valueUid = this.generateUid();
                    const newValue = {
                        uid: valueUid,
                        id: value.id, // Lưu id của variation value để backend biết là existing
                        label: value.label,
                        position: index,
                    };

                    // Map theo type của variation
                    const variationType = selectedVariation.type?.toLowerCase();
                    if (variationType === 'color') {
                        newValue.color = value.value || value.color || ''; // Để rỗng để hiển thị checkerboard
                    } else if (variationType === 'image') {
                        // Đảm bảo luôn có object image với cấu trúc đúng
                        if (value.image && typeof value.image === 'object') {
                            newValue.image = { 
                                id: value.image.id || null, 
                                path: value.image.path || '' 
                            };
                        } else {
                            newValue.image = { 
                                id: null, 
                                path: value.value || value.image || '' 
                            };
                        }
                    } else {
                        // For text or other types, store value
                        newValue.value = value.value || '';
                    }

                    return newValue;
                }),
                is_open: true,
                position: this.form.variations.length,
            };

            this.form.variations.push(newVariation);
            this.globalVariationId = '';
            this.generateVariants();
        },

        generateUid() {
            return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        },

        getColorButtonStyle(color) {
            const isValidHex = color && /^#[0-9A-Fa-f]{6}$/.test(color);
            return {
                backgroundImage: isValidHex
                    ? 'none'
                    : 'repeating-linear-gradient(45deg, #aaa 25%, transparent 25%, transparent 75%, #aaa 75%, #aaa), repeating-linear-gradient(45deg, #aaa 25%, #fff 25%, #fff 75%, #aaa 75%, #aaa)',
                backgroundColor: isValidHex ? color : 'transparent',
                backgroundSize: isValidHex ? 'auto' : '8px 8px, 8px 8px',
                backgroundPosition: isValidHex ? 'auto' : '0 0, 4px 4px',
                width: '28px',
                height: '28px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                flexShrink: 0,
                marginLeft: '6px',
                marginRight: '4px',
                display: 'block'
            };
        },
    },
};
</script>

<style scoped>
.accordion-box-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.insert-template {
    display: flex;
    align-items: center;
    gap: 10px;
}

.drag-handle{
    margin-left:10px;
    color :#7b7778;
}

.panel-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
}

.panel-title > div {
    display: flex;
    align-items: center;
    flex: 1;
    min-height: 40px;
}

.variation-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 15px;
}

.delete-option {
    padding: 6px 12px;
    cursor: pointer;
    color: #dc3545;
    transition: all 0.3s ease;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-right: 10px;
}

.delete-option:hover {
    color: #bd2130;
    transform: scale(1.05);
}

.delete-option i {
    font-size: 14px;
}

/* Fix text-center alignment in table */
.variation-values table td.text-center {
    text-align: center !important;
    vertical-align: middle;
}

/* Fix drag handle in table */
.variation-values table td.text-center .drag-handle {
    display: inline-block;
    margin-left: 0 !important;
    cursor: move;
}

.variation-values table td.text-center .drag-handle i {
    display: inline-block;
    margin: 0 0.5px;
}

/* Image picker styles */
.image-picker-cell {
    display: flex;
    align-items: center;
    gap: 10px;
}

.image-picker-btn {
    white-space: nowrap;
    padding: 6px 12px;
}

.image-picker-btn i {
    margin-right: 4px;
}

.image-preview-small {
    position: relative;
    width: 60px;
    height: 60px;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
    flex-shrink: 0;
}

.image-preview-small img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.btn-remove-image-small {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 20px;
    height: 20px;
    padding: 0;
    background: rgba(220, 53, 69, 0.9);
    border: none;
    border-radius: 3px;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    transition: background 0.2s;
}

.btn-remove-image-small:hover {
    background: rgba(189, 33, 48, 1);
}

.btn-remove-image-small i {
    margin: 0;
}

/* Fix spacing between Name and Type columns */
.variation-form-row {
    margin-left: 0;
    margin-right: 0;
}

.variation-form-row > .col-sm-6 {
    padding-left: 15px;
    padding-right: 20px;
}

.variation-form-row > .col-sm-3 {
    padding-left: 50px;
    padding-right: 15px;
}

/* Responsive cho iPad và tablet (≤1024px) */
@media (max-width: 1024px) {
    .variation-form-row > .col-sm-3 {
        padding-left: 20px;
        padding-right: 15px;
    }

    .accordion-box-footer {
        flex-wrap: wrap;
        gap: 15px;
    }

    .insert-template {
        flex-wrap: wrap;
    }

    .insert-template select {
        width: 180px !important;
    }
}

/* Responsive cho iPad dọc và tablet nhỏ (≤768px) */
@media (max-width: 768px) {
    .box-header {
        padding: 12px 15px !important;
    }

    .box-header h5 {
        font-size: 16px !important;
    }

    .panel-title > div {
        min-height: 35px;
    }

    .variation-name {
        font-size: 14px;
        margin-right: 10px;
    }

    .drag-handle {
        margin-left: 6px !important;
    }

    .delete-option {
        padding: 4px 8px;
        margin-right: 6px;
    }

    .variation-form-row > .col-sm-6 {
        padding-left: 10px !important;
        padding-right: 10px !important;
    }

    .variation-form-row > .col-sm-3 {
        padding-left: 10px !important;
        padding-right: 10px !important;
    }

    .variation-values table {
        font-size: 14px;
    }

    .variation-values table th,
    .variation-values table td {
        padding: 8px 6px;
    }

    .variation-values table td.text-center {
        width: 40px !important;
    }

    .variation-values table th:first-child,
    .variation-values table td:first-child {
        width: 40px !important;
    }

    .variation-values table th:last-child,
    .variation-values table td:last-child {
        width: 60px !important;
    }

    .variation-values .btn-default.delete-row {
        padding: 6px 10px;
        font-size: 13px;
    }

    .variation-values > .btn-default {
        width: auto;
        padding: 8px 20px;
    }

    .accordion-box-footer {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
    }

    .accordion-box-footer .btn {
        width: 100%;
    }

    .insert-template {
        width: 100%;
        flex-direction: row;
        justify-content: space-between;
    }

    .insert-template select {
        flex: 1;
        max-width: 200px;
        margin-right: 10px !important;
    }

    .insert-template .btn {
        flex-shrink: 0;
        width: auto;
        min-width: 100px;
    }
}

/* Responsive cho điện thoại (≤576px) */
@media (max-width: 576px) {
    .box-header {
        padding: 10px 12px !important;
    }

    .box-header h5 {
        font-size: 15px !important;
    }

    .box-header .d-flex {
        gap: 8px;
    }

    .toggle-accordion,
    .box-header .drag-handle {
        font-size: 13px;
    }

    .panel-heading {
        padding: 10px 12px !important;
    }

    .panel-body {
        padding: 12px !important;
    }

    .panel-title > div {
        min-height: 32px;
    }

    .variation-name {
        font-size: 13px;
        margin-right: 8px;
        margin-left: 3px !important;
    }

    .drag-handle {
        margin-left: 4px !important;
        font-size: 12px;
    }

    .delete-option {
        padding: 3px 6px;
        margin-right: 4px;
    }

    .delete-option i {
        font-size: 13px;
    }

    .form-group label {
        font-size: 13px;
        margin-bottom: 6px;
    }

    .form-control {
        font-size: 14px;
        padding: 6px 10px;
    }

    .variation-form-row > .col-sm-6 {
        padding-left: 8px !important;
        padding-right: 8px !important;
    }

    .variation-form-row > .col-sm-3 {
        padding-left: 8px !important;
        padding-right: 8px !important;
    }

    .variation-values {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }

    .variation-values .table-responsive {
        margin-bottom: 12px;
    }

    .variation-values table {
        font-size: 13px;
        min-width: 500px;
    }

    .variation-values table th,
    .variation-values table td {
        padding: 6px 4px;
    }

    .variation-values table td input[type="text"] {
        min-width: 80px !important;
        font-size: 13px;
        padding: 5px 8px;
    }

    .variation-values table td.text-center {
        width: 35px !important;
    }

    .variation-values table th:first-child,
    .variation-values table td:first-child {
        width: 35px !important;
    }

    .variation-values table th:last-child,
    .variation-values table td:last-child {
        width: 50px !important;
    }

    .variation-values .btn-default.delete-row {
        padding: 5px 8px;
        font-size: 12px;
    }

    .variation-values > .btn-default {
        width: auto;
        margin-top: 8px;
        padding: 6px 16px;
    }

    .help-block {
        font-size: 12px;
    }

    .insert-template {
        flex-wrap: wrap;
    }

    .insert-template select {
        flex: 1;
        min-width: 150px;
        max-width: none;
    }

    .insert-template .btn {
        flex: 1;
        min-width: 100px;
    }
}

/* Responsive cho điện thoại nhỏ (≤480px) */
@media (max-width: 480px) {
    .box-header {
        padding: 8px 10px !important;
    }

    .box-header h5 {
        font-size: 14px !important;
    }

    .panel-heading {
        padding: 8px 10px !important;
    }

    .panel-body {
        padding: 10px !important;
    }

    .variation-name {
        font-size: 12px;
    }

    .drag-handle {
        font-size: 11px;
    }

    .form-group label {
        font-size: 12px;
    }

    .form-control {
        font-size: 13px;
        padding: 5px 8px;
    }

    .variation-values table {
        font-size: 12px;
    }

    .variation-values table td input[type="text"] {
        font-size: 12px;
        padding: 4px 6px;
    }

    .variation-form-row > .col-sm-6 {
        padding-left: 6px !important;
        padding-right: 6px !important;
    }

    .variation-form-row > .col-sm-3 {
        padding-left: 6px !important;
        padding-right: 6px !important;
    }

    .insert-template select {
        min-width: 120px;
    }

    .insert-template .btn {
        min-width: 80px;
        padding: 6px 10px;
        font-size: 13px;
    }
}
</style>

<style>
/* Remove ::after arrow - unscoped to override global CSS */
.accordion-box-content .panel-heading[data-toggle="collapse"]::after {
    display: none !important;
    content: none !important;
}
</style>
