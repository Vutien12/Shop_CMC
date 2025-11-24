<template>
    <section class="content">
        <form @submit.prevent="onSubmit" class="form-horizontal" id="coupon-create-form" novalidate>
            <input type="hidden" name="_token" :value="csrfToken" autocomplete="off" />
            <div class="accordion-content clearfix">
                <!-- Left Sidebar -->
                <div class="col-lg-3 col-md-4">
                    <div class="accordion-box">
                        <div class="panel-group" id="BrandTabs">
                            <div class="panel panel-default">
                                <div class="panel-heading">
                                    <h4 class="panel-title">
                                        <a>Brand Information</a>
                                    </h4>
                                </div>

                                <div id="brand_information" class="panel-collapse collapse in">
                                    <div class="panel-body">
                                        <ul class="accordion-tab nav nav-tabs">
                                            <li :class="{ active: activeTab === 'general' }">
                                                <a href="#general" @click.prevent="activeTab = 'general'">General</a>
                                            </li>
                                            <li :class="{ active: activeTab === 'images' }">
                                                <a href="#images" @click.prevent="activeTab = 'images'">Usage Restrictions</a>
                                            </li>
                                            <li :class="{ active: activeTab === 'seo' }">
                                                <a href="#seo" @click.prevent="activeTab = 'seo'">Usage Limits</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Content -->
                <div class="col-lg-9 col-md-8">
                    <div class="accordion-box-content">
                        <div class="tab-content clearfix">
                            <!-- GENERAL -->
                                <div v-show="activeTab === 'general'" class="tab-pane fade in active" id="general">
                                    <h4 class="tab-content-title">General</h4>
                                    <div class="row">
                                    <div class="col-md-8">
                                        <div class="form-group" :class="{ 'has-error': errors.name }">
                                            <label for="name" class="col-md-3 control-label text-left">Name<span class="m-l-5 text-red">*</span></label>
                                            <div class="col-md-9">
                                                <input id="name" v-model.trim="form.name" name="name" class="form-control" type="text" />
                                                <small v-if="errors.name" class="text-danger">{{ errors.name }}</small>
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label for="code" class="col-md-3 control-label text-left">Code<span class="m-l-5 text-red">*</span></label>
                                            <div class="col-md-9">
                                                <input id="code" v-model.trim="form.code" name="code" class="form-control" type="text" />
                                                <small v-if="errors.code" class="text-danger">{{ errors.code }}</small>
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label for="is_percent" class="col-md-3 control-label text-left">Discount Type</label>
                                            <div class="col-md-9">
                                                <select id="is_percent" v-model.number="form.is_percent" name="is_percent" class="form-control custom-select-black">
                                                    <option :value="0">Fixed</option>
                                                    <option :value="1">Percent</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label for="value" class="col-md-3 control-label text-left">Value</label>
                                            <div class="col-md-9">
                                                <input id="value" v-model.number="form.value" name="value" class="form-control" min="0" type="number" />
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label for="free_shipping" class="col-md-3 control-label text-left">Free Shipping</label>
                                            <div class="col-md-9">
                                                <div class="checkbox">
                                                    <input type="hidden" value="0" name="free_shipping" />
                                                    <input id="free_shipping" type="checkbox" v-model="form.free_shipping" />
                                                    <label for="free_shipping">Allow free shipping</label>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label for="start_date" class="col-md-3 control-label text-left">Start date</label>
                                            <div class="col-md-9">
                                                <input id="start_date" v-model="form.start_date" name="start_date" class="form-control" type="datetime-local" />
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label for="end_date" class="col-md-3 control-label text-left">End date</label>
                                            <div class="col-md-9">
                                                <input id="end_date" v-model="form.end_date" name="end_date" class="form-control" type="datetime-local" />
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label for="is_active" class="col-md-3 control-label text-left">Status</label>
                                            <div class="col-md-9">
                                                <div class="checkbox">
                                                    <input type="hidden" value="0" name="is_active" />
                                                    <input id="is_active" type="checkbox" v-model="form.is_active" />
                                                    <label for="is_active">Enable the coupon</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- USAGE RESTRICTIONS -->
                            <div v-show="activeTab === 'usage_restrictions'" class="tab-pane fade in" id="usage_restrictions">
                                <h4 class="tab-content-title">Usage Restrictions</h4>
                                <div class="row">
                                    <div class="col-md-8">
                                        <div class="form-group">
                                            <label for="minimum_spend" class="col-md-3 control-label text-left">Minimum Spend</label>
                                            <div class="col-md-9">
                                                <input id="minimum_spend" v-model.number="form.minimum_spend" name="minimum_spend" class="form-control" min="0" type="number" />
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label for="maximum_spend" class="col-md-3 control-label text-left">Maximum Spend</label>
                                            <div class="col-md-9">
                                                <input id="maximum_spend" v-model.number="form.maximum_spend" name="maximum_spend" class="form-control" min="0" type="number" />
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label class="col-md-3 control-label text-left">Products</label>
                                            <div class="col-md-9">
                                                <select multiple v-model="form.products" class="form-control" style="min-height:120px">
                                                    <option disabled value="">-- select products (placeholder) --</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label class="col-md-3 control-label text-left">Exclude Products</label>
                                            <div class="col-md-9">
                                                <select multiple v-model="form.exclude_products" class="form-control" style="min-height:120px"></select>
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label class="col-md-3 control-label text-left">Categories</label>
                                            <div class="col-md-9">
                                                <select multiple v-model="form.categories" class="form-control" style="min-height:120px"></select>
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label class="col-md-3 control-label text-left">Exclude Categories</label>
                                            <div class="col-md-9">
                                                <select multiple v-model="form.exclude_categories" class="form-control" style="min-height:120px"></select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- USAGE LIMITS -->
                            <div v-show="activeTab === 'usage_limits'" class="tab-pane fade in" id="usage_limits">
                                <h4 class="tab-content-title">Usage Limits</h4>
                                <div class="row">
                                    <div class="col-md-8">
                                        <div class="form-group">
                                            <label for="usage_limit_per_coupon" class="col-md-3 control-label text-left">Usage Limit Per Coupon</label>
                                            <div class="col-md-9">
                                                <input id="usage_limit_per_coupon" v-model.number="form.usage_limit_per_coupon" name="usage_limit_per_coupon" class="form-control" type="number" />
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label for="usage_limit_per_customer" class="col-md-3 control-label text-left">Usage Limit Per Customer</label>
                                            <div class="col-md-9">
                                                <input id="usage_limit_per_customer" v-model.number="form.usage_limit_per_customer" name="usage_limit_per_customer" class="form-control" type="number" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Form Footer -->
                            <div class="form-group">
                                <div class="col-md-10 col-md-offset-2">
                                    <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                                        <span v-if="isSubmitting">Saving...</span>
                                        <span v-else>Save</span>
                                    </button>
                                    <span v-if="submitMessage" :class="{'text-success': submitSuccess, 'text-danger': !submitSuccess}" style="margin-left:1rem">{{ submitMessage }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>

        <!-- File Manager removed for this component -->
    </section>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

// CSRF token (inject from server if available)
const csrfToken = ''

const router = useRouter()
const activeTab = ref('usage_limits')
const isSubmitting = ref(false)
const submitMessage = ref('')
const submitSuccess = ref(false)

const form = reactive({
    name: '',
    code: '',
    is_percent: 0,
    value: 0,
    free_shipping: false,
    start_date: '',
    end_date: '',
    is_active: false,
    minimum_spend: null,
    maximum_spend: null,
    products: [],
    exclude_products: [],
    categories: [],
    exclude_categories: [],
    usage_limit_per_coupon: null,
    usage_limit_per_customer: null,
})

const errors = reactive({ name: '', code: '' })

function validate() {
    errors.name = ''
    errors.code = ''
    let ok = true
    if (!form.name || form.name.trim() === '') {
        errors.name = 'Name is required.'
        ok = false
    }
    if (!form.code || form.code.trim() === '') {
        errors.code = 'Code is required.'
        ok = false
    }
    return ok
}

async function onSubmit() {
    submitMessage.value = ''
    submitSuccess.value = false
    if (!validate()) return

    isSubmitting.value = true
    try {
        const fd = new FormData()
        fd.append('_token', csrfToken)
        fd.append('name', form.name)
        fd.append('code', form.code)
        fd.append('is_percent', String(form.is_percent))
        fd.append('value', String(form.value || 0))
        fd.append('free_shipping', form.free_shipping ? '1' : '0')
        if (form.start_date) fd.append('start_date', form.start_date)
        if (form.end_date) fd.append('end_date', form.end_date)
        fd.append('is_active', form.is_active ? '1' : '0')
        if (form.minimum_spend !== null) fd.append('minimum_spend', String(form.minimum_spend))
        if (form.maximum_spend !== null) fd.append('maximum_spend', String(form.maximum_spend))
        form.products.forEach((p) => fd.append('products[]', p))
        form.exclude_products.forEach((p) => fd.append('exclude_products[]', p))
        form.categories.forEach((c) => fd.append('categories[]', c))
        form.exclude_categories.forEach((c) => fd.append('exclude_categories[]', c))
        if (form.usage_limit_per_coupon !== null) fd.append('usage_limit_per_coupon', String(form.usage_limit_per_coupon))
        if (form.usage_limit_per_customer !== null) fd.append('usage_limit_per_customer', String(form.usage_limit_per_customer))

        // POST to server (example action URL from your snippet)
        const actionUrl = 'https://asia.fleetcart.envaysoft.com/en/admin/coupons?tab=usage_limits'

        const res = await fetch(actionUrl, {
            method: 'POST',
            body: fd,
            credentials: 'include',
        })

        if (!res.ok) {
            const text = await res.text().catch(() => '')
            submitMessage.value = `Server error: ${res.status} ${res.statusText} ${text ? '- ' + text : ''}`
            submitSuccess.value = false
        } else {
            submitMessage.value = 'Coupon saved successfully.'
            submitSuccess.value = true
            // dispatch a global event so the index can reload immediately
            try {
                // build a new coupon object (mock) so index can insert it locally when API not used
                const newCoupon = {
                    id: Date.now(),
                    name: form.name,
                    code: form.code,
                    value: form.value || 0,
                    is_percent: form.is_percent ? 1 : 0,
                    is_active: form.is_active ? true : false,
                    created_at: new Date().toISOString(),
                }
                window.dispatchEvent(new CustomEvent('coupons:created', { detail: newCoupon }))
            } catch (e) {
                // ignore if window not available
            }
            // navigate back to coupons index and include a timestamp so index can refresh
            try {
                router.push({ name: 'admin.coupons.index', query: { refreshed: Date.now() } })
            } catch (e) {
                // ignore
            }
        }
    } catch (err) {
        submitMessage.value = 'Request failed: ' + (err && err.message ? err.message : String(err))
        submitSuccess.value = false
    } finally {
        isSubmitting.value = false
    }
}
</script>

<style scoped>
/* Accordion Layout */
.accordion-content {
    display: flex;
    gap: 20px;
    margin: 0 -15px;
}

.col-lg-3,
.col-lg-9,
.col-md-4,
.col-md-8 {
    padding: 0 15px;
}

.accordion-box {
    background: transparent;
    border: none;
}

.panel-default {
    border: none;
    box-shadow: none;
}

.panel-heading {
    background: transparent;
    border-bottom: none;
    padding: 15px 20px;
}

.panel-title {
    font-size: 14px;
    font-weight: 600;
    margin: 0;
}

.panel-title a {
    color: #333;
    text-decoration: none;
}

.panel-body {
    padding: 0;
}

.accordion-tab {
    list-style: none;
    margin: 0;
    padding: 0;
    border: none;
    display: block;
}

.accordion-tab li {
    border-bottom: 1px solid #f0f0f0;
    display: block;
    width: 100%;
}

.accordion-tab li:last-child {
    border-bottom: none;
}

.accordion-tab li a {
    display: block;
    padding: 12px 20px;
    color: #666;
    text-decoration: none;
    transition: all 0.2s;
    border-left: 3px solid transparent;
}

.accordion-tab li:first-child a {
    border-top-left-radius: 4px;
}

.accordion-tab li:last-child a {
    border-bottom-left-radius: 4px;
}

.accordion-tab li a:hover {
    background: #f9f9f9;
    color: #333;
}

.accordion-tab li.active a {
    background: #fff;
    color: #0071a1;
    border-left-color: #0071a1;
    font-weight: 500;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
}

/* Content Box */
.accordion-box-content {
    background: transparent;
    border: none;
    padding: 20px;
}

.tab-content-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 20px 0;
    padding-bottom: 10px;
    border-bottom: 2px solid #f0f0f0;
}

.row {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -15px;
}

.col-md-8 {
    width: 66.67%;
    padding: 0 15px;
}

/* Form Styles */
.form-horizontal .form-group {
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
}

.control-label {
    padding-top: 7px;
    font-weight: 500;
    color: #333;
}

.col-md-3 {
    width: 25%;
    padding: 0 15px;
}

.col-md-9 {
    width: 75%;
    padding: 0 15px;
}

.col-md-10 {
    width: 83.33%;
    padding: 0 15px;
}

.col-md-offset-2 {
    margin-left: 16.67%;
}

.text-left {
    text-align: left;
}

.text-red {
    color: #e74c3c;
}

.m-l-5 {
    margin-left: 5px;
}

.m-r-5 {
    margin-right: 5px;
}

.form-control {
    height: 38px;
    padding: 6px 12px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.form-control:focus {
    border-color: #0071a1;
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 113, 161, 0.1);
}

textarea.form-control {
    height: auto;
    resize: vertical;
}

.has-error .form-control {
    border-color: #e74c3c;
}

.help-block {
    display: block;
    margin-top: 5px;
    font-size: 13px;
}

/* Checkbox */
.checkbox {
    margin: 0;
}

.checkbox input[type="checkbox"] {
    margin-right: 8px;
}

.checkbox label {
    font-weight: normal;
    cursor: pointer;
}

/* Image Upload */
.single-image-wrapper {
    margin-bottom: 30px;
}

.single-image-wrapper h4 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 10px;
}

.image-picker {
    margin-bottom: 15px;
}

.image-holder-wrapper {
    margin-top: 15px;
}

.image-holder {
    position: relative;
    width: 200px;
    height: 200px;
    border: 2px dashed #ddd;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fafafa;
}

.image-holder.placeholder {
    cursor: pointer;
}

.image-holder.placeholder i {
    font-size: 48px;
    color: #ccc;
}

.image-holder img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.btn-remove-image {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 24px;
    height: 24px;
    background: #e74c3c;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
}

.btn-remove-image:hover {
    background: #c0392b;
}

.media-picker-divider {
    height: 1px;
    background: #e0e0e0;
    margin: 30px 0;
}

/* Buttons */
.btn {
    padding: 8px 16px;
    font-size: 14px;
    border-radius: 4px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-default {
    background: #fff;
    border-color: #ddd;
    color: #333;
}

.btn-default:hover {
    background: #f5f5f5;
}

.btn-primary {
    background: #0071a1;
    color: white;
    border-color: #0071a1;
}

.btn-primary:hover:not(:disabled) {
    background: #005a7f;
    border-color: #005a7f;
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Utility Classes */
.clearfix::after {
    content: "";
    display: table;
    clear: both;
}

/* Responsive */
@media (max-width: 991px) {
    .accordion-content {
        flex-direction: column;
    }
}
</style>
