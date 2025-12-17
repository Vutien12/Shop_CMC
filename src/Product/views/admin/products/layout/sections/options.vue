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
            <div class="panel-heading">
              <h4 class="panel-title">
                <div
                  class="btn-accordion"
                  role="button"
                  tabindex="0"
                  :aria-expanded="option.is_open"
                  @click.stop="toggleAccordion($event, option)"
                  @keydown.enter.stop="toggleAccordion($event, option)"
                  @keydown.space.stop="toggleAccordion($event, option)"
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
                </div>
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

/* Button Add row vừa đủ */
.option-select > .btn-default {
  width: auto;
  padding: 8px 20px;
}

/* Responsive cho iPad và tablet (≤1024px) */
@media (max-width: 1024px) {
  .accordion-box-footer {
    flex-wrap: wrap;
    gap: 15px;
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

  .btn-accordion {
    padding: 8px 12px;
  }

  .option-header-content {
    gap: 8px;
  }

  .option-name {
    font-size: 14px;
  }

  .btn-delete-option {
    padding: 4px 6px;
    margin-left: 10px;
    font-size: 13px;
  }

  .new-option .row > .col-sm-5,
  .new-option .row > .col-sm-4,
  .new-option .row > .col-sm-3 {
    padding-left: 10px !important;
    padding-right: 10px !important;
  }

  .option-values table {
    font-size: 14px;
  }

  .option-values table th,
  .option-values table td {
    padding: 8px 6px;
  }

  .option-values .btn.delete-row {
    padding: 6px 10px;
    font-size: 13px;
  }

  .option-select > .btn-default {
    padding: 8px 18px;
  }

  .accordion-box-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .accordion-box-footer > .btn {
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

  .panel-heading {
    padding: 0 !important;
  }

  .panel-body {
    padding: 12px !important;
  }

  .btn-accordion {
    padding: 8px 10px;
    font-size: 14px;
  }

  .option-header-content {
    gap: 6px;
  }

  .drag-handle {
    font-size: 12px;
  }

  .option-name {
    font-size: 13px;
  }

  .btn-delete-option {
    padding: 3px 5px;
    margin-left: 8px;
    font-size: 12px;
  }

  .form-group label {
    font-size: 13px;
    margin-bottom: 6px;
  }

  .form-control {
    font-size: 14px;
    padding: 6px 10px;
  }

  .new-option .row > .col-sm-5,
  .new-option .row > .col-sm-4,
  .new-option .row > .col-sm-3 {
    padding-left: 8px !important;
    padding-right: 8px !important;
  }

  .option-values {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .option-values table {
    font-size: 13px;
    min-width: 600px;
  }

  .option-values table th,
  .option-values table td {
    padding: 6px 4px;
  }

  .option-values table td input[type="text"],
  .option-values table td input[type="number"] {
    font-size: 13px;
    padding: 5px 8px;
    min-width: 80px;
  }

  .option-values table td.text-center {
    width: 40px !important;
  }

  .option-values .btn.delete-row {
    padding: 5px 8px;
    font-size: 12px;
  }

  .option-select > .btn-default {
    width: auto;
    padding: 6px 16px;
    font-size: 14px;
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

  .panel-body {
    padding: 10px !important;
  }

  .btn-accordion {
    padding: 6px 8px;
    font-size: 13px;
  }

  .option-name {
    font-size: 12px;
  }

  .drag-handle {
    font-size: 11px;
  }

  .btn-delete-option {
    padding: 2px 4px;
    margin-left: 6px;
    font-size: 11px;
  }

  .form-group label {
    font-size: 12px;
  }

  .form-control {
    font-size: 13px;
    padding: 5px 8px;
  }

  .new-option .row > .col-sm-5,
  .new-option .row > .col-sm-4,
  .new-option .row > .col-sm-3 {
    padding-left: 6px !important;
    padding-right: 6px !important;
  }

  .option-values table {
    font-size: 12px;
  }

  .option-values table td input[type="text"],
  .option-values table td input[type="number"] {
    font-size: 12px;
    padding: 4px 6px;
  }

  .option-select > .btn-default {
    padding: 5px 14px;
    font-size: 13px;
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
