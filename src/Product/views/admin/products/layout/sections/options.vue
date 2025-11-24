z<template>
    <div v-if="section === 'options'">
        <div class="box-header">
            <h5>{{ trans('product::products.group.options') }}</h5>

            <div class="d-flex">
                <span
                    class="toggle-accordion"
                    :class="{ 'collapsed': isCollapsedOptionsAccordion }"
                    data-toggle="tooltip"
                    data-placement="top"
                    :data-original-title="
                        isCollapsedOptionsAccordion ?
                        trans('product::products.section.expand_all') :
                        trans('product::products.section.collapse_all')
                    "
                    @click="toggleAccordions({
                        selector: '.options-group .panel-heading',
                        state: isCollapsedOptionsAccordion,
                        data: form.options
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

    <div class="box-body clearfix">
        <div class="accordion-box-content">
            <draggable
                animation="150"
                class="options-group"
                force-fallback="true"
                handle=".drag-handle"
                :list="form.options"
            >
                <div
                    v-for="(option, index) in form.options"
                    :id="`option-${option.uid}`"
                    class="content-accordion panel-group options-group-wrapper"
                    :class="`option-${option.uid}`"
                    :key="index"
                >
                    <div class="panel panel-default option">
                        <div class="panel-heading" @click.stop="toggleAccordion($event, option)">
                            <h4 class="panel-title">
                                <button
                                    type="button"
                                    class="btn-accordion"
                                    :aria-expanded="option.is_open"
                                    data-toggle="collapse"
                                    data-transition="false"
                                    :class="{
                                        'collapsed': !option.is_open,
                                        'has-error': hasAnyError({
                                            name: 'options',
                                            uid: option.uid
                                        })
                                    }"
                                >
                                    <div class="option-header-content">
                                        <span class="drag-handle">
                                            <i class="fa">&#xf142;</i>
                                            <i class="fa">&#xf142;</i>
                                        </span>
                                        <span class="option-name">{{ option.name || trans('product::products.options.new_option') }}</span>
                                    </div>

                                    <button
                                        type="button"
                                        class="btn-delete-option"
                                        @click.stop="deleteOption(index)"
                                        title="Delete option"
                                    >
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </button>
                            </h4>
                        </div>

                        <div class="panel-collapse" :class="{ 'collapse': !option.is_open }">
                            <div class="panel-body">
                                <div class="new-option">
                                    <div class="row">
                                        <div class="col-sm-5">
                                            <div class="form-group">
                                                <label :for="`options-${option.uid}-name`">
                                                    {{ trans('product::products.form.options.name') }}
                                                    <span v-if="option.name || option.type" class="text-red">*</span>
                                                </label>

                                                <input
                                                    type="text"
                                                    :name="`options.${option.uid}.name`"
                                                    class="form-control option-name-field"
                                                    :id="`options-${option.uid}-name`"
                                                    v-model="option.name"
                                                    placeholder="Option name"
                                                >

                                                <span
                                                    class="help-block text-red"
                                                    v-if="errors.has(`options.${option.uid}.name`)"
                                                    v-text="errors.get(`options.${option.uid}.name`)"
                                                >
                                                </span>
                                            </div>
                                        </div>

                                        <div class="col-sm-4">
                                            <div class="form-group">
                                                <label :for="`options-${option.uid}-type`">
                                                    {{ trans('product::products.form.options.type') }}
                                                    <span v-if="option.name || option.type" class="text-red">*</span>
                                                </label>

                                                <select
                                                    :name="`options.${option.uid}.type`"
                                                    :id="`options-${option.uid}-type`"
                                                    class="form-control custom-select-black"
                                                    @change="changeOptionType(index, option.uid)"
                                                    v-model="option.type"
                                                >
                                                    <option value="">Please Select</option>
                                                    <option value="field">Field</option>
                                                    <option value="textarea">Textarea</option>
                                                    <option value="dropdown">Dropdown</option>
                                                    <option value="checkbox">Checkbox</option>
                                                    <option value="radio">Radio</option>
                                                    <option value="multiple_select">Multiple Select</option>
                                                    <option value="date">Date</option>
                                                    <option value="datetime">Date & Time</option>
                                                    <option value="time">Time</option>
                                                </select>

                                                <span
                                                    class="help-block text-red"
                                                    v-if="errors.has(`options.${option.uid}.type`)"
                                                    v-text="errors.get(`options.${option.uid}.type`)"
                                                >
                                                </span>
                                            </div>
                                        </div>

                                        <div class="col-sm-3">
                                            <div class="form-group">
                                                <label>&nbsp;</label>
                                                <div class="checkbox" style="margin-top: 5px;">
                                                    <input
                                                        type="checkbox"
                                                        :name="`options.${option.uid}.is_required`"
                                                        :id="`options-${option.uid}-is-required`"
                                                        v-model="option.is_required"
                                                    >
                                                    <label :for="`options-${option.uid}-is-required`" style="margin-left: 5px; margin-bottom: 0;">
                                                        {{ trans('product::products.form.options.is_required') }}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <template v-if="isOptionTypeText(option)">
                                    <div class="option-values">
                                        <div class="table-responsive option-text">
                                            <table class="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>{{ trans('product::products.form.options.price') }}</th>
                                                        <th>{{ trans('product::products.form.options.price_type') }}</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    <tr v-for="(value, valueIndex) in option.values" :key="valueIndex">
                                                        <td>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                :name="`options.${option.uid}.values.${value.uid}.price`"
                                                                class="form-control"
                                                                v-model="value.price"
                                                            >
                                                        </td>
                                                        <td>
                                                            <select
                                                                :name="`options.${option.uid}.values.${value.uid}.price_type`"
                                                                class="form-control custom-select-black"
                                                                v-model="value.price_type"
                                                            >
                                                                <option value="fixed">Fixed</option>
                                                                <option value="percent">Percent</option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </template>

                                <template v-else-if="isOptionTypeSelect(option)">
                                    <div class="option-values">
                                        <div class="option-select">
                                            <div class="table-responsive option-text">
                                                <table class="options table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th></th>
                                                            <th>{{ trans('product::products.form.options.label') }} <span class="text-red">*</span></th>
                                                            <th>{{ trans('product::products.form.options.price') }}</th>
                                                            <th>{{ trans('product::products.form.options.price_type') }}</th>
                                                            <th></th>
                                                        </tr>
                                                    </thead>

                                                    <component
                                                        :is="'tbody'"
                                                        v-if="isOptionTypeSelect(option)"
                                                    >
                                                        <tr class="option-row" v-for="(value, valueIndex) in option.values" :key="valueIndex">
                                                            <td class="text-center">
                                                                <span class="drag-handle">
                                                                    <i class="fa">&#xf142;</i>
                                                                    <i class="fa">&#xf142;</i>
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    :name="`options.${option.uid}.values.${value.uid}.label`"
                                                                    class="form-control"
                                                                    v-model="value.label"
                                                                    @keyup.enter="addOptionRowOnPressEnter($event, index, valueIndex)"
                                                                >
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    :name="`options.${option.uid}.values.${value.uid}.price`"
                                                                    class="form-control"
                                                                    v-model="value.price"
                                                                >
                                                            </td>
                                                            <td>
                                                                <select
                                                                    :name="`options.${option.uid}.values.${value.uid}.price_type`"
                                                                    class="form-control custom-select-black"
                                                                    v-model="value.price_type"
                                                                >
                                                                    <option value="fixed">Fixed</option>
                                                                    <option value="percent">Percent</option>
                                                                </select>
                                                            </td>
                                                            <td class="text-center">
                                                                <button
                                                                    type="button"
                                                                    tabindex="-1"
                                                                    class="btn btn-default delete-row"
                                                                    @click="deleteOptionRow(index, option.uid, valueIndex, value.uid)"
                                                                >
                                                                    <i class="fa fa-trash"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    </component>
                                                </table>
                                            </div>

                                            <button
                                                type="button"
                                                class="btn btn-default"
                                                @click="addOptionRow(index, option.uid)"
                                            >
                                                {{ trans('product::products.options.add_row') }}
                                            </button>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </draggable>

            <div class="accordion-box-footer">
                <button type="button" class="btn btn-default" @click="addOption">
                    {{ trans('product::products.options.add_option') }}
                </button>

                <div v-if="hasAccess" class="insert-template">
                    <select
                        class="form-control custom-select-black"
                        v-model="globalOptionId"
                        style="width: 150px; margin-right: 20px;"
                    >
                        <option value="">{{ trans('product::products.form.options.select_template') }}</option>

                        <option
                            v-for="globalOption in globalOptions"
                            :key="globalOption.id"
                            :value="globalOption.id"
                        >
                            {{ globalOption.name }}
                        </option>
                    </select>

                    <button
                        type="button"
                        class="btn btn-default"
                        :class="{ 'btn-loading': addingGlobalOption }"
                        :disabled="isAddGlobalOptionDisabled"
                        @click="addGlobalOption"
                    >
                        {{ trans('product::products.options.insert') }}
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
    name: 'OptionsSection',
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
        defaultCurrencySymbol: {
            type: String,
            default: '$',
        },
        globalOptions: {
            type: Array,
            default: () => [],
        },
        hasAccess: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            isCollapsedOptionsAccordion: false,
            globalOptionId: '',
            addingGlobalOption: false,
        };
    },
    computed: {
        isAddGlobalOptionDisabled() {
            return !this.globalOptionId || this.addingGlobalOption;
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

        toggleAccordions({ state, data }) {
            this.isCollapsedOptionsAccordion = !state;

            if (data && Array.isArray(data)) {
                data.forEach(item => {
                    item.is_open = this.isCollapsedOptionsAccordion;
                });
            }
        },

        toggleAccordion(event, option) {
            option.is_open = !option.is_open;
        },

        hasAnyError({ name, uid }) {
            const prefix = `${name}.${uid}`;
            return this.errors.any(prefix);
        },

        isOptionTypeText(option) {
            return ['field', 'textarea'].includes(option.type);
        },

        isOptionTypeSelect(option) {
            return ['dropdown', 'checkbox', 'radio', 'multiple_select'].includes(option.type);
        },

        changeOptionType(index, uid) {
            const option = this.form.options[index];

            // Clear existing values
            option.values = [];

            if (this.isOptionTypeText(option)) {
                option.values.push({
                    uid: this.generateUid(),
                    price: 0,
                    price_type: 'fixed',
                });
            }

            if (this.isOptionTypeSelect(option)) {
                this.addOptionRow(index, uid);
            }
        },

        deleteOption(index) {
            this.form.options.splice(index, 1);
        },

        addOption() {
            const uid = this.generateUid();
            this.form.options.push({
                uid: uid,
                name: '',
                type: '',
                is_required: false,
                values: [],
                is_open: true,
                position: this.form.options.length,
            });
        },

        addOptionRow(index) {
            const option = this.form.options[index];
            option.values.push({
                uid: this.generateUid(),
                label: '',
                price: 0,
                price_type: 'fixed',
                position: option.values.length,
            });
        },

        deleteOptionRow(index, optionUid, valueIndex) {
            const option = this.form.options[index];
            option.values.splice(valueIndex, 1);
        },

        mapOptionTypeFromAPI(apiType) {
            // Map từ API format (SELECT, TEXT, etc) sang UI format (dropdown, field, etc)
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
            return typeMap[apiType?.toUpperCase()] || apiType?.toLowerCase() || 'field';
        },

        addOptionRowOnPressEnter(event, index, valueIndex) {
            const option = this.form.options[index];

            if (valueIndex === option.values.length - 1) {
                this.addOptionRow(index, option.uid);

                this.$nextTick(() => {
                    const newValueUid = option.values[option.values.length - 1].uid;
                    const selector = `input[name="options.${option.uid}.values.${newValueUid}.label"]`;
                    const element = document.querySelector(selector);
                    if (element) {
                        element.focus();
                    }
                });
            }
        },

        async addGlobalOption() {
            if (!this.globalOptionId) return;

            this.addingGlobalOption = true;

            const selectedGlobalOption = this.globalOptions.find(opt => opt.id === this.globalOptionId);

            if (selectedGlobalOption) {
                const uid = this.generateUid();

                // Map option values từ API format (label, price, priceType) sang UI format (label, price, price_type)
                const optionValues = (selectedGlobalOption.optionValues || selectedGlobalOption.values || []).map((v, i) => ({
                    uid: this.generateUid(),
                    id: v.id,
                    label: v.label || '',
                    price: v.price || 0,
                    price_type: (v.priceType || v.price_type || 'FIXED').toLowerCase(), // Map priceType -> price_type
                    position: i,
                }));

                this.form.options.push({
                    uid: uid,
                    id: selectedGlobalOption.id,
                    name: selectedGlobalOption.name,
                    type: this.mapOptionTypeFromAPI(selectedGlobalOption.type), // Map từ API format (SELECT) sang UI format (dropdown)
                    is_required: selectedGlobalOption.isRequired || selectedGlobalOption.is_required || false,
                    isGlobal: true,
                    values: optionValues,
                    is_open: true,
                    position: this.form.options.length,
                });
            }

            this.globalOptionId = '';
            this.addingGlobalOption = false;
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

.btn-accordion {
    background: none;
    border: none;
    width: 100%;
    padding: 10px 15px;
    text-align: left;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0;
    font-weight: 500;
    color: #333;
    transition: background-color 0.2s ease;
    justify-content: space-between;
}

.btn-accordion:hover {
    background-color: #f5f5f5;
}

.btn-accordion.collapsed {
    opacity: 0.7;
}

.btn-accordion.has-error {
    border-left: 3px solid #dc3545;
    padding-left: 12px;
}

.option-header-content {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
}

.drag-handle {
    cursor: grab;
    color: #999;
    font-size: 12px;
    flex-shrink: 0;
}

.drag-handle:active {
    cursor: grabbing;
}

.option-name {
    font-weight: 500;
    color: #333;
}

.btn-delete-option {
    background: none;
    border: none;
    color: #dc3545;
    cursor: pointer;
    padding: 5px 8px;
    font-size: 14px;
    transition: color 0.2s ease;
    flex-shrink: 0;
    margin-left: 15px;
}

.btn-delete-option:hover {
    color: #c82333;
}
</style>
