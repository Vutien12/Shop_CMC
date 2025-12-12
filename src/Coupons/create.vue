<template>
    <div class="coupon-create-page">
        <PageBreadcrumb 
            :title="isEditMode ? 'Edit Coupon' : 'Create Coupon'"
            :breadcrumbs="[
                { label: 'Coupons', route: { name: 'admin.coupons.index' } },
                { label: isEditMode ? 'Edit' : 'Create' }
            ]"
        />
        <div v-if="isLoading" class="loading-overlay">
            <div class="loading-spinner">Loading...</div>
        </div>
        
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
                                        <a>{{ isEditMode ? 'Edit Coupon' : 'Coupon Information' }}</a>
                                    </h4>
                                </div>

                                <div id="brand_information" class="panel-collapse collapse in">
                                    <div class="panel-body">
                                        <ul class="accordion-tab nav nav-tabs">
                                            <li :class="{ active: activeTab === 'general' }">
                                                <a href="#general" @click.prevent="activeTab = 'general'">General</a>
                                            </li>
                                            <li :class="{ active: activeTab === 'usage_restrictions' }">
                                                <a href="#usage_restrictions" @click.prevent="activeTab = 'usage_restrictions'">Usage Time</a>
                                            </li>
                                            <li :class="{ active: activeTab === 'usage_limits' }">
                                                <a href="#usage_limits" @click.prevent="activeTab = 'usage_limits'">Usage Limits</a>
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
                            <div v-show="activeTab === 'general'" class="tab-pane fade in" id="general">
                                <h4 class="tab-content-title">General</h4>
                                <div class="row">
                                    <div class="col-md-8">
                                        <div class="form-group" :class="{ 'has-error': errors.description }">
                                            <label for="description" class="col-md-3 control-label text-left">Description<span class="m-l-5 text-red">*</span></label>
                                            <div class="col-md-9">
                                                <textarea id="description" v-model.trim="form.description" name="description" class="form-control" rows="3"></textarea>
                                                <small v-if="errors.description" class="text-danger">{{ errors.description }}</small>
                                            </div>
                                        </div>

                                        <div class="form-group" :class="{ 'has-error': errors.discountValue }">
                                            <label for="discountType" class="col-md-3 control-label text-left">Discount Type<span class="m-l-5 text-red">*</span></label>
                                            <div class="col-md-9">
                                                <select id="discountType" v-model="form.discountType" name="discountType" class="form-control custom-select-black">
                                                    <option value="PERCENT">Percent</option>
                                                    <option value="FIXED">Fixed</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div class="form-group" :class="{ 'has-error': errors.discountValue }">
                                            <label for="discountValue" class="col-md-3 control-label text-left">Discount Value<span class="m-l-5 text-red">*</span></label>
                                            <div class="col-md-9">
                                                <input id="discountValue" v-model.number="form.discountValue" name="discountValue" class="form-control" min="0" type="number" />
                                                <small v-if="errors.discountValue" class="text-danger">{{ errors.discountValue }}</small>
                                                <small v-else class="text-muted">{{ form.discountType === 'PERCENT' ? 'Enter percentage (e.g., 10 for 10%)' : 'Enter fixed amount' }}</small>
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label for="maxDiscount" class="col-md-3 control-label text-left">Max Discount</label>
                                            <div class="col-md-9">
                                                <input id="maxDiscount" v-model.number="form.maxDiscount" name="maxDiscount" class="form-control" min="0" type="number" />
                                                <small class="text-muted">Maximum discount amount (leave empty for no limit)</small>
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label for="minOrderAmount" class="col-md-3 control-label text-left">Min Order Amount</label>
                                            <div class="col-md-9">
                                                <input id="minOrderAmount" v-model.number="form.minOrderAmount" name="minOrderAmount" class="form-control" min="0" type="number" />
                                                <small class="text-muted">Minimum order amount to use this coupon</small>
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label for="is_active" class="col-md-3 control-label text-left">Status</label>
                                            <div class="col-md-9">
                                                <div class="checkbox">
                                                    <input type="hidden" value="0" name="is_active" />
                                                    <input id="is_active" type="checkbox" v-model="form.isActive" />
                                                    <label for="is_active">Enable the coupon</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- USAGE RESTRICTIONS -->
                            <div v-show="activeTab === 'usage_restrictions'" class="tab-pane fade in" id="usage_restrictions">
                                <h4 class="tab-content-title">Usage Time</h4>
                                <div class="row">
                                    <div class="col-md-8">
                                        <div class="form-group">
                                            <label for="start_date" class="col-md-3 control-label text-left">Start Date</label>
                                            <div class="col-md-9">
                                                <input id="start_date" v-model="form.startDate" name="start_date" class="form-control" type="datetime-local" />
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label for="end_date" class="col-md-3 control-label text-left">End Date</label>
                                            <div class="col-md-9">
                                                <input id="end_date" v-model="form.endDate" name="end_date" class="form-control" type="datetime-local" />
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
                                            <label for="usageLimit" class="col-md-3 control-label text-left">Usage Limit</label>
                                            <div class="col-md-9">
                                                <input id="usageLimit" v-model.number="form.usageLimit" name="usageLimit" class="form-control" min="0" type="number" />
                                                <small class="text-muted">Total number of times this coupon can be used</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Form Footer -->
            <div class="page-form-footer">
                <div v-if="submitMessage" class="alert-message" :class="submitSuccess ? 'alert-success' : 'alert-error'">
                    {{ submitMessage }}
                </div>
                <button type="submit" class="btn btn-default save-btn" :disabled="isSubmitting">
                    <span v-if="isSubmitting">Saving...</span>
                    <span v-else>Save</span>
                </button>
                <button type="button" class="btn btn-primary save-exit-btn" @click="saveAndExit" :disabled="isSubmitting">
                    Save &amp; Exit
                </button>
            </div>
        </form>

        <!-- File Manager removed for this component -->
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useNotification } from '@/Admin/composables/useNotification.js'
import PageBreadcrumb from '@/Admin/view/components/PageBreadcrumb.vue'
import { createCoupon, getCouponById, updateCoupon } from '@/api/couponsApi'

const router = useRouter()
const route = useRoute()
const notification = useNotification()
const activeTab = ref('general')
const isSubmitting = ref(false)
const submitMessage = ref('')
const submitSuccess = ref(false)
const shouldExit = ref(false)
const isLoading = ref(false)
const isEditMode = ref(false)
const couponId = ref(null)

const form = reactive({
    description: '',
    discountType: 'PERCENT',
    discountValue: 0,
    maxDiscount: null,
    minOrderAmount: null,
    startDate: '',
    endDate: '',
    usageLimit: null,
    isActive: false,
})

const errors = reactive({ 
    description: '',
    discountValue: ''
})

// Load coupon data if editing
const loadCoupon = async () => {
    if (!couponId.value) return
    
    isLoading.value = true
    try {
        const response = await getCouponById(couponId.value)
        console.log('Loaded coupon:', response)
        
        // Handle different response structures
        const data = response.result || response.data || response
        
        // Populate form with coupon data
        form.description = data.description || ''
        form.discountType = data.discountType || 'PERCENT'
        form.discountValue = data.discountValue || 0
        form.maxDiscount = data.maxDiscount || null
        form.minOrderAmount = data.minOrderAmount || null
        form.usageLimit = data.usageLimit || null
        form.isActive = data.isActive || false
        
        // Format dates for datetime-local input
        if (data.startDate) {
            const startDate = new Date(data.startDate)
            form.startDate = startDate.toISOString().slice(0, 16)
        }
        
        if (data.endDate) {
            const endDate = new Date(data.endDate)
            form.endDate = endDate.toISOString().slice(0, 16)
        }
        
    } catch (error) {
        console.error('Failed to load coupon:', error)
        notification.error('Lỗi!', 'Không thể tải dữ liệu mã giảm giá')
    } finally {
        isLoading.value = false
    }
}

// Check if in edit mode on mount
onMounted(() => {
    if (route.params.id) {
        isEditMode.value = true
        couponId.value = route.params.id
        loadCoupon()
    }
})

function validate() {
    errors.description = ''
    errors.discountValue = ''
    let ok = true
    
    if (!form.description || form.description.trim() === '') {
        errors.description = 'Description is required.'
        ok = false
    }
    
    if (!form.discountValue || form.discountValue <= 0) {
        errors.discountValue = 'Discount value must be greater than 0'
        ok = false
    }
    
    return ok
}

function saveAndExit() {
    shouldExit.value = true
    onSubmit()
}

async function onSubmit() {
    submitMessage.value = ''
    submitSuccess.value = false
    
    if (!validate()) {
        return
    }

    isSubmitting.value = true
    
    try {
        // Prepare data for API
        const couponData = {
            description: form.description,
            discountType: form.discountType,
            discountValue: Number(form.discountValue),
            isActive: form.isActive
        }

        // Only add optional fields if they have values
        if (form.maxDiscount && form.maxDiscount > 0) {
            couponData.maxDiscount = Number(form.maxDiscount)
        }
        
        if (form.minOrderAmount && form.minOrderAmount > 0) {
            couponData.minOrderAmount = Number(form.minOrderAmount)
        }
        
        if (form.startDate && form.startDate.trim() !== '') {
            couponData.startDate = form.startDate
        }
        
        if (form.endDate && form.endDate.trim() !== '') {
            couponData.endDate = form.endDate
        }
        
        if (form.usageLimit && form.usageLimit > 0) {
            couponData.usageLimit = Number(form.usageLimit)
        }

        console.log('Sending coupon data:', couponData)

        // Call API (create or update)
        let response
        if (isEditMode.value) {
            response = await updateCoupon(couponId.value, couponData)
            notification.success('Thành công!', 'Đã cập nhật mã giảm giá thành công')
        } else {
            response = await createCoupon(couponData)
            notification.success('Thành công!', 'Đã tạo mã giảm giá thành công')
        }
        
        console.log('API Response:', response)
        
        // Dispatch event for list to reload (only on create)
        if (!isEditMode.value) {
            try {
                const newCoupon = {
                    id: response.id || Date.now(),
                    description: form.description,
                    code: response.code || '',
                    discountType: form.discountType,
                    discountValue: form.discountValue,
                    isActive: form.isActive,
                    createdAt: response.createdAt || new Date().toISOString(),
                }
                window.dispatchEvent(new CustomEvent('coupons:created', { detail: newCoupon }))
            } catch (e) {
                console.error('Error dispatching event:', e)
            }
        }
        
        // Navigate if shouldExit is true
        if (shouldExit.value) {
            setTimeout(() => {
                router.push({ name: 'admin.coupons.index', query: { refreshed: Date.now() } })
            }, 500)
        } else if (isEditMode.value) {
            // In edit mode, stay on page after save
            setTimeout(() => {
                submitMessage.value = ''
            }, 3000)
        } else {
            // Reset form for new entry
            Object.assign(form, {
                description: '',
                discountType: 'PERCENT',
                discountValue: 0,
                maxDiscount: null,
                minOrderAmount: null,
                startDate: '',
                endDate: '',
                usageLimit: null,
                isActive: false,
            })
            activeTab.value = 'general'
        }
        
    } catch (error) {
        console.error('Error saving coupon:', error)
        console.error('Error response:', error.response?.data)
        
        // Show detailed error message with notification
        if (error.response?.status === 400) {
            const errorData = error.response.data
            if (errorData.errors) {
                const errorMessages = Object.values(errorData.errors).flat().join(', ')
                notification.error('Dữ liệu không hợp lệ!', errorMessages)
            } else {
                notification.error('Dữ liệu không hợp lệ!', errorData.message || 'Vui lòng kiểm tra lại thông tin')
            }
        } else if (error.response?.status === 409) {
            notification.error('Trùng lặp!', 'Mã giảm giá đã tồn tại')
        } else if (error.response?.status === 500) {
            notification.error('Lỗi máy chủ!', 'Vui lòng thử lại sau')
        } else {
            notification.error('Lỗi!', isEditMode.value ? 'Không thể cập nhật mã giảm giá' : 'Không thể tạo mã giảm giá')
        }
    } finally {
        isSubmitting.value = false
    }
}
</script>

<style scoped>
.coupon-create-page {
    padding: 20px;
}

/* Loading Overlay */
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.loading-spinner {
    font-size: 18px;
    color: #0071a1;
    font-weight: 600;
}

/* Content Section */
.content {
    padding-bottom: 80px;
}

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

.tab-pane {
    display: none;
}

.tab-pane[style*="display: block"],
.tab-pane:not([style*="display: none"]) {
    display: block !important;
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

/* Page Form Footer */
.page-form-footer {
    position: fixed;
    bottom: 0;
    left: 250px;
    right: 0;
    background: #fff;
    border-top: 1px solid #e9ecef;
    padding: 15px 30px;
    text-align: right;
    z-index: 100;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
}

.alert-message {
    padding: 8px 15px;
    border-radius: 4px;
    font-size: 14px;
    margin-right: auto;
}

.alert-success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.alert-error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

@media (max-width: 991px) {
    .page-form-footer {
        left: 0;
    }
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
    
    .page-form-footer {
        left: 0;
        padding: 10px 15px;
    }
    
    .col-md-3,
    .col-md-8,
    .col-md-9 {
        width: 100%;
        margin-left: 0;
    }
    
    .form-horizontal .form-group {
        flex-direction: column;
    }
    
    .control-label {
        text-align: left !important;
        margin-bottom: 5px;
    }
}

@media (max-width: 768px) {
    .content {
        padding-bottom: 100px;
    }
    
    .accordion-content {
        margin: 0;
        gap: 15px;
    }
    
    .col-lg-3,
    .col-lg-9,
    .col-md-4 {
        width: 100%;
        padding: 0;
    }
    
    .tab-content-title {
        font-size: 16px;
    }
    
    .page-form-footer {
        padding: 8px 10px;
    }
    
    .page-form-footer .btn {
        padding: 6px 12px;
        font-size: 13px;
        margin-left: 5px;
    }
}

@media (max-width: 575px) {
    .accordion-tab li a {
        padding: 10px 15px;
        font-size: 13px;
    }
    
    .form-control {
        height: 36px;
        font-size: 13px;
    }
    
    textarea.form-control {
        font-size: 13px;
    }
    
    .page-form-footer .btn {
        padding: 5px 10px;
        font-size: 12px;
    }
}
</style>
