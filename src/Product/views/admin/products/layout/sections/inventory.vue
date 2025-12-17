<template>
  <div v-if="section === 'inventory'">
    <div class="box-header">
      <h5>{{ trans('product::products.group.inventory') }}</h5>

      <div class="drag-handle">
        <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
        <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
      </div>
    </div>

    <div class="box-body">
      <div v-if="hasAnyVariant">
        <div class="alert alert-info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM11.25 8C11.25 7.59 11.59 7.25 12 7.25C12.41 7.25 12.75 7.59 12.75 8V13C12.75 13.41 12.41 13.75 12 13.75C11.59 13.75 11.25 13.41 11.25 13V8ZM12.92 16.38C12.87 16.51 12.8 16.61 12.71 16.71C12.61 16.8 12.5 16.87 12.38 16.92C12.26 16.97 12.13 17 12 17C11.87 17 11.74 16.97 11.62 16.92C11.5 16.87 11.39 16.8 11.29 16.71C11.2 16.61 11.13 16.51 11.08 16.38C11.03 16.26 11 16.13 11 16C11 15.87 11.03 15.74 11.08 15.62C11.13 15.5 11.2 15.39 11.29 15.29C11.39 15.2 11.5 15.13 11.62 15.08C11.86 14.98 12.14 14.98 12.38 15.08C12.5 15.13 12.61 15.2 12.71 15.29C12.8 15.39 12.87 15.5 12.92 15.62C12.97 15.74 13 15.87 13 16C13 16.13 12.97 16.26 12.92 16.38Z"
              fill="#555555"
            />
          </svg>

          <span>
            {{ trans('product::products.variants.has_product_variant') }}
          </span>
        </div>

        <!-- Per-variant inventory controls -->
        <div class="variant-inventory-list" style="margin-top: 15px;">
          <div
            class="form-group row"
            v-for="(variant, idx) in form.variants"
            :key="variant.uid || variant.id || idx"
            style="border-bottom: 1px solid #eee; padding: 10px 0;"
          >
            <label class="col-sm-12 control-label text-left" :for="`variant-manage-${idx}`">
              {{ variant.name }}
            </label>

            <div class="col-sm-6" style="margin-top:8px;">
              <label :for="`variant-manage-${idx}`" class="control-label">{{ trans('product::products.form.variants.manage_stock') }}</label>
              <select
                :id="`variant-manage-${idx}`"
                class="form-control custom-select-black"
                v-model.number="variant.manage_stock"
                @change="$emit('')"
              >
                <option :value="0">{{ trans('product::products.form.variants.manage_stock_states.0') }}</option>
                <option :value="1">{{ trans('product::products.form.variants.manage_stock_states.1') }}</option>
              </select>
            </div>

            <div class="col-sm-6" style="margin-top:8px;">
              <label :for="`variant-qty-${idx}`" class="control-label">
                {{ trans('product::products.form.variants.qty') }}
              </label>
              <input
                :id="`variant-qty-${idx}`"
                type="number"
                step="1"
                class="form-control"
                v-model.number="variant.qty"
                :disabled="variant.manage_stock != 1"
                @wheel="$event.target.blur()"
              />
            </div>
          </div>
        </div>

        <!-- End per-variant inventory -->
      </div>

      <template v-else>
        <div class="form-group row">
          <label for="sku" class="col-sm-12 control-label text-left">
            {{ trans('product::attributes.sku') }}
          </label>

          <div class="col-sm-12">
            <div style="display: flex; gap: 10px;">
              <input
                type="text"
                name="sku"
                id="sku"
                class="form-control"
                v-model="form.sku"
                style="flex: 1;"
              />
              <button
                type="button"
                class="btn btn-default"
                @click="generateRandomSku"
                title="Generate random SKU"
                style="white-space: nowrap;"
              >
                <i class="fa fa-refresh"></i> Generate
              </button>
            </div>
            <span
              v-if="errors.has('sku')"
              class="help-block text-red"
              v-text="errors.get('sku')"
            ></span>
          </div>
        </div>

        <div class="form-group row">
          <label for="manage_stock" class="col-sm-12 control-label text-left">
            {{ trans('product::attributes.manage_stock') }}
          </label>
          <div class="col-sm-12">
            <select
              name="manage_stock"
              id="manage-stock"
              class="form-control custom-select-black"
              :value="form.manage_stock"
              @change="hasAnyVariant ? null : (form.manage_stock = Number($event.target.value))"
              :disabled="hasAnyVariant"
              :style="
                hasAnyVariant
                  ? 'pointer-events: none; opacity: 0.6; cursor: not-allowed; background-color: #f5f5f5;'
                  : ''
              "
            >
              <option :value="0">
                {{ trans('product::products.form.manage_stock_states.0') }}
              </option>
              <option :value="1">
                {{ trans('product::products.form.manage_stock_states.1') }}
              </option>
            </select>
            <span v-if="hasAnyVariant" class="help-block text-muted" style="margin-top: 5px">
              <i class="fa fa-info-circle"></i> Stock is managed per variant when variations are
              used.
            </span>
            <span v-else class="help-block text-red"></span>
          </div>
        </div>

        <!-- Hide Qty and Stock Availability in Inventory section when there are variants -->
        <div
          class="form-group row"
          id="qty-group"
          v-if="form.manage_stock == 1 && !hasAnyVariant && form.variants.length <= 1"
        >
          <label for="qty" class="col-sm-12 control-label text-left">
            {{ trans('product::attributes.qty') }}
            <span class="text-red">*</span>
          </label>
          <div class="col-sm-12">
            <input
              type="number"
              name="qty"
              step="1"
              id="qty"
              class="form-control"
              :value="form.qty"
              @input="form.qty = Number($event.target.value)"
              @wheel="$event.target.blur()"
              :disabled="hasAnyVariant || form.variants.length > 1"
              :style="
                hasAnyVariant || form.variants.length > 1
                  ? 'pointer-events: none; opacity: 0.6; cursor: not-allowed; background-color: #f5f5f5;'
                  : ''
              "
            />
            <span
              v-if="errors.has('qty')"
              class="help-block text-red"
              v-text="errors.get('qty')"
            ></span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import products from '@/Product/lang/en/products.json'
import attributes from '@/Product/lang/en/attributes.json'

export default {
  name: 'InventorySection',
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
    hasAnyVariant: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    trans(key) {
      const translationFiles = {
        'product::products': products,
        'product::attributes': attributes,
      }

      const [namespace, remainder] = key.split('::')
      if (!remainder) return key

      const parts = remainder.split('.')
      const file = parts.shift()
      const rest = parts

      const fileKey = `${namespace}::${file}`
      const translationData = translationFiles[fileKey]

      if (!translationData) return key

      let result = translationData
      for (const k of rest) {
        if (result && Object.prototype.hasOwnProperty.call(result, k)) {
          result = result[k]
        } else {
          return key
        }
      }

      return typeof result === 'string' ? result : key
    },

    generateRandomSku() {
      // Generate random SKU: SKU-YYYYMMDD-XXXXX
      const date = new Date()
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const random = Math.random().toString(36).substring(2, 7).toUpperCase()

      this.form.sku = `SKU-${year}${month}${day}-${random}`
    },
  },
}
</script>
