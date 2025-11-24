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

                <div class="drag-handle">
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
                                    data-toggle="collapse"
                                    data-transition="false"
                                    :class="{
                                        'collapsed': !variation.is_open,
                                        'has-error': hasAnyError({
                                            name: 'variations',
                                            uid: variation.uid
                                        })
                                    }"
                                >
                                    <span class="drag-handle">
                                        <i class="fa">&#xf142;</i>
                                        <i class="fa">&#xf142;</i>
                                    </span>

                                    <span>{{ variation.name || trans('product::products.variations.new_variation') }}</span>

                                    <span
                                        class="delete-option"
                                        @click.stop="deleteVariation(index, variation.uid)"
                                    >
                                        <i class="fa fa-trash"></i>
                                    </span>
                                </div>
                            </h4>
                        </div>

                        <div class="panel-collapse" :class="{ 'collapse': !variation.is_open }">
                            <div class="panel-body">
                                <div class="new-option">
                                    <div class="row">
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
                                                    <th></th>
                                                    <th>
                                                        {{ trans('product::products.form.variations.label') }}
                                                        <span class="text-red">*</span>
                                                    </th>
                                                    <th v-if="variation.type === 'color'">
                                                        {{ trans('product::products.form.variations.color') }}
                                                        <span class="text-red">*</span>
                                                    </th>
                                                    <th></th>
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
                                                    <td class="text-center">
                                                        <span class="drag-handle">
                                                            <i class="fa">&#xf142;</i>
                                                            <i class="fa">&#xf142;</i>
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            :name="`variations.${variation.uid}.values.${value.uid}.label`"
                                                            :id="`variations-${variation.uid}-values-${value.uid}-label`"
                                                            class="form-control"
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
                                                    <td v-if="variation.type === 'color'">
                                                        <div>
                                                            <input
                                                                type="text"
                                                                :name="`variations.${variation.uid}.values.${value.uid}.color`"
                                                                :id="`variations-${variation.uid}-values-${value.uid}-color`"
                                                                class="form-control color-picker"
                                                                v-model="value.color"
                                                            >
                                                        </div>

                                                        <span
                                                            class="help-block text-red"
                                                            v-if="errors.has(`variations.${variation.uid}.values.${value.uid}.color`)"
                                                            v-text="errors.get(`variations.${variation.uid}.values.${value.uid}.color`)"
                                                        >
                                                        </span>
                                                    </td>
                                                    <td v-else-if="variation.type === 'image'">
                                                        <div class="d-flex">
                                                            <div
                                                                class="image-holder"
                                                                @click="chooseVariationImage(index, variation.uid, valueIndex, value.uid)"
                                                            >
                                                                <template v-if="value.image.id">
                                                                    <img :src="value.image.path" alt="variation image">
                                                                </template>

                                                                <img v-else :src="placeholderImage" class="placeholder-image" alt="Placeholder image">
                                                            </div>
                                                        </div>

                                                        <span
                                                            class="help-block text-red"
                                                            v-if="errors.has(`variations.${variation.uid}.values.${value.uid}.image`)"
                                                            v-text="errors.get(`variations.${variation.uid}.values.${value.uid}.image`)"
                                                        >
                                                        </span>
                                                    </td>
                                                    <td class="text-center">
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
                newValue.color = '#000000';
            } else if (variation.type === 'image') {
                newValue.image = { id: null, path: '' };
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

        generateVariants() {
            this.$emit('generate-variants');
        },

        addGlobalVariation() {
            if (!this.globalVariationId) return;

            // Find the selected global variation from the prop
            const selectedVariation = this.globalVariations.find(
                v => v.id === this.globalVariationId
            );

            if (!selectedVariation) return;

            const uid = this.generateUid();
            const newVariation = {
                uid: uid,
                name: selectedVariation.name,
                type: selectedVariation.type,
                values: selectedVariation.values.map((value, index) => {
                    const valueUid = this.generateUid();
                    const newValue = {
                        uid: valueUid,
                        label: value.label,
                        position: index,
                    };

                    if (selectedVariation.type === 'color') {
                        newValue.color = value.color || '#000000';
                    } else if (selectedVariation.type === 'image') {
                        newValue.image = value.image || { id: null, path: '' };
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

.delete-option {
    margin-left: auto;
    margin-right: 10px !important;
}
</style>
