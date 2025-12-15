<template>
    <div class="review-edit-wrapper">
        <PageBreadcrumb
            title="Edit Review"
            :breadcrumbs="[
                { label: 'Reviews', route: { name: 'admin.reviews.index' } },
                { label: 'Edit Review' }
            ]"
        />
        
        <div class="accordion-content clearfix">
            <div class="col-lg-3 col-md-4">
                <div class="accordion-box">
                <div class="panel-group" id="ReviewTabs">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h4 class="panel-title">
                                <a>Review Information</a>
                            </h4>
                        </div>

                        <div id="review_information" class="panel-collapse collapse in">
                            <div class="panel-body">
                                <ul class="accordion-tab nav nav-tabs">
                                    <li class="active">
                                        <a href="#review" data-toggle="tab">General</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-9 col-md-8">
            <div class="accordion-box-content">
                <div class="tab-content clearfix">
                    <div class="tab-pane fade in active" id="review">
                        <h4 class="tab-content-title">General</h4>
                        
                        <!-- Product Field -->
                        <div class="form-group-wrapper">
                            <label for="product" class="form-label">Product</label>
                            <div class="form-input-wrapper">
                                <input
                                    v-model="form.product"
                                    class="form-control"
                                    id="product"
                                    type="text"
                                    disabled
                                />
                            </div>
                        </div>

                        <!-- Variant Field -->
                        <div class="form-group-wrapper">
                            <label for="variant" class="form-label">Variant</label>
                            <div class="form-input-wrapper">
                                <input
                                    v-model="form.variant"
                                    class="form-control"
                                    id="variant"
                                    type="text"
                                    disabled
                                />
                            </div>
                        </div>

                        <!-- Reviewer Name Field -->
                        <div class="form-group-wrapper">
                            <label for="reviewer_name" class="form-label">Reviewer Name</label>
                            <div class="form-input-wrapper">
                                <input
                                    v-model="form.reviewer_name"
                                    class="form-control"
                                    id="reviewer_name"
                                    type="text"
                                    disabled
                                />
                            </div>
                        </div>

                        <!-- Rating Field -->
                        <div class="form-group-wrapper">
                            <label for="rating" class="form-label">Rating</label>
                            <div class="form-input-wrapper">
                                <div class="rating-stars">
                                    <span v-for="i in 5" :key="i" :class="i <= form.rating ? 'star-filled' : 'star-empty'">
                                        ★
                                    </span>
                                    <span class="rating-number">({{ form.rating }})</span>
                                </div>
                            </div>
                        </div>

                        <!-- Title Field -->
                        <div class="form-group-wrapper">
                            <label for="title" class="form-label">Title</label>
                            <div class="form-input-wrapper">
                                <input
                                    v-model="form.title"
                                    class="form-control"
                                    id="title"
                                    type="text"
                                    disabled
                                />
                            </div>
                        </div>

                        <!-- Comment Field -->
                        <div class="form-group-wrapper">
                            <label for="comment" class="form-label">Comment</label>
                            <div class="form-input-wrapper">
                                <textarea
                                    v-model="form.comment"
                                    class="form-control"
                                    id="comment"
                                    rows="4"
                                    cols="10"
                                    disabled
                                ></textarea>
                            </div>
                        </div>

                        <!-- Status Field -->
                        <div class="form-group-wrapper">
                            <label for="is_hidden" class="form-label">
                                Status
                                <span class="text-red">*</span>
                            </label>
                            <div class="form-input-wrapper">
                                <div class="checkbox">
                                    <input
                                        type="checkbox"
                                        v-model="form.is_hidden"
                                        name="is_hidden"
                                        id="is_hidden"
                                    />
                                    <label for="is_hidden">Hide this review</label>
                                </div>
                            </div>
                        </div>

                        <!-- Hidden Reason Field -->
                        <div class="form-group-wrapper" v-if="form.is_hidden">
                            <label for="hidden_reason" class="form-label">
                                Hidden Reason
                                <span class="text-red">*</span>
                            </label>
                            <div class="form-input-wrapper">
                                <textarea
                                    v-model="form.hidden_reason"
                                    class="form-control"
                                    id="hidden_reason"
                                    rows="3"
                                    cols="10"
                                    placeholder="Enter reason for hiding this review..."
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Save Button -->
                    <div class="form-group">
                        <div class="col-md-10 col-md-offset-2">
                            <button
                                type="submit"
                                class="btn btn-primary"
                                @click="handleSubmit"
                                :disabled="loading"
                            >
                                {{ loading ? 'Saving...' : 'Save' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getReview, updateReviewStatus } from '@/api/reviewApi.js';
import PageBreadcrumb from '@/Admin/view/components/PageBreadcrumb.vue';

export default {
    name: 'ReviewEdit',
    setup() {
        const route = useRoute();
        const router = useRouter();
        const loading = ref(false);
        const reviewId = ref(null);

        const form = ref({
            product: '',
            variant: '',
            reviewer_name: '',
            rating: 5,
            title: '',
            comment: '',
            is_hidden: false,
            hidden_reason: ''
        });

        // Load review data from API
        onMounted(async () => {
            const id = route.params.id;
            if (id) {
                reviewId.value = id;
                try {
                    console.log('Loading review with ID:', id);
                    const response = await getReview(id);
                    console.log('Review API response:', response);

                    if (response && response.code === 200 && response.result) {
                        const data = response.result;

                        // Map API data to form
                        form.value = {
                            product: data.productName || '',
                            variant: data.variantName || '',
                            reviewer_name: data.userFullName || '',
                            rating: parseInt(data.rating) || 5,
                            title: data.title || '',
                            comment: data.comment || '',
                            is_hidden: data.isHidden || false,
                            hidden_reason: data.hiddenReason || ''
                        };

                        console.log('Loaded review data:', form.value);
                    }
                } catch (error) {
                    console.error('Error loading review:', error);
                    alert('Failed to load review data');
                }
            }
        });

        const handleSubmit = async () => {
            // Validate: if hiding, reason is required
            if (form.value.is_hidden && !form.value.hidden_reason.trim()) {
                alert('Please provide a reason for hiding this review.');
                return;
            }

            loading.value = true;

            try {
                // Only send isHidden and hiddenReason
                const updateData = {
                    isHidden: Boolean(form.value.is_hidden),
                    hiddenReason: form.value.is_hidden ? form.value.hidden_reason.trim() : null
                };

                console.log('Update data:', updateData);

                const response = await updateReviewStatus(reviewId.value, updateData);
                console.log('Update response:', response);

                alert('Review status updated successfully!');
                router.push({ name: 'admin.reviews.index' });
            } catch (error) {
                console.error('Error updating review:', error);
                console.error('Error response:', error.response?.data);
                alert('Failed to update review. Please try again.');
            } finally {
                loading.value = false;
            }
        };

        return {
            form,
            loading,
            handleSubmit
        };
    }
};
</script>

<style scoped>
.review-edit-wrapper {
    padding: 15px 20px 20px 20px;
}

.accordion-content {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
}

.accordion-box {
    background: #fff;
    border: none;
    border-right: 1px solid #e5e7eb;
    border-radius: 0;
}

.panel-default {
    border: none;
}

.panel-heading {
    background: #f5f5f5;
    border-bottom: 1px solid #ddd;
    padding: 15px;
}

.panel-title {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
}

.panel-title a {
    color: #333;
    text-decoration: none;
}

.panel-body {
    padding: 15px;
}

.accordion-tab {
    list-style: none;
    padding: 0;
    margin: 0;
    border-bottom: 2px solid #ddd;
}

.accordion-tab li {
    display: inline-block;
}

.accordion-tab li a {
    display: block;
    padding: 10px 20px;
    color: #666;
    text-decoration: none;
    border: 1px solid transparent;
    border-bottom: none;
    margin-bottom: -2px;
}

.accordion-tab li.active a {
    color: #333;
    background: #fff;
    border-color: #ddd;
    border-bottom-color: #fff;
    font-weight: 600;
}
.active{
    width: 100%;
}
.accordion-box-content {
    background: #fff;
    border: none;
    border-radius: 0;
    padding: 20px;
}

.tab-content-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 30px;
    padding-bottom: 15px;
    border-bottom: 1px solid #f3f4f6;
    color: #111827;
}

/* Form group wrapper for horizontal layout */
.form-group-wrapper {
    display: flex;
    align-items: flex-start;
    margin-bottom: 20px;
    gap: 20px;
}

.form-label {
    min-width: 120px;
    font-weight: 500;
    color: #374151;
    font-size: 13px;
    white-space: nowrap;
    flex-shrink: 0;
    padding-top: 7px;
}

.form-input-wrapper {
    flex: 1;
    max-width: 500px;
}

.form-group {
    margin-bottom: 15px;
    display: flex !important;
    flex-direction: row !important;
    flex-wrap: nowrap !important;
    align-items: flex-start !important;
    gap: 15px !important;
}

.form-group > .col-md-3 {
    width: 150px !important;
    min-width: 150px !important;
    max-width: 150px !important;
    padding: 0 !important;
    margin: 0 !important;
    display: block !important;
    flex-shrink: 0 !important;
    flex-grow: 0 !important;
    float: none !important;
}

.form-group > .col-md-9 {
    flex: 1 1 auto !important;
    max-width: 600px !important;
    width: auto !important;
    padding: 0 !important;
    margin: 0 !important;
    display: block !important;
    float: none !important;
}

.control-label {
    padding-top: 7px;
    padding-bottom: 0;
    font-weight: 500;
    color: #374151;
    font-size: 14px;
    display: block;
    text-align: left;
    margin: 0;
}

.text-left {
    text-align: left;
}

.text-red {
    color: #d9534f;
}

.m-l-5 {
    margin-left: 5px;
}

.form-control {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    color: #111827;
    transition: all 0.2s;
}

.form-control:focus {
    border-color: #3b82f6;
    outline: 0;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-control:disabled {
    background-color: #f3f4f6;
    color: #111827;
    cursor: not-allowed;
    opacity: 1;
}

.custom-select-black {
    background: #fff;
    color: #333;
}

.checkbox {
    padding-top: 0;
    display: flex;
    align-items: center;
}

.checkbox input[type="checkbox"] {
    margin-right: 8px;
}

.checkbox label {
    font-weight: normal;
    cursor: pointer;
}

.btn {
    padding: 10px 24px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
}

.btn-primary {
    background: #2563eb;
    color: #fff;
}

.btn-primary:hover {
    background: #1d4ed8;
}

.btn-primary:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.col-md-offset-2 {
    margin-left: 165px;
}

/* Responsive Grid */
.col-lg-3, .col-lg-9, .col-md-4, .col-md-8, .col-md-10, .col-md-12 {
    position: relative;
    min-height: 1px;
}

.col-md-4 {
    width: 33.333333%;
    padding: 15px;
}

.col-md-8 {
    width: 66.666667%;
}

.col-md-10 {
    width: 83.333333%;
}

.col-md-12 {
    width: 100%;
    padding: 0;
}

@media (min-width: 992px) {
    .col-lg-3 {
        width: 25%;
    }
    .col-lg-9 {
        width: 75%;
    }
}

.clearfix::after {
    content: "";
    display: table;
    clear: both;
}

.rating-stars {
    display: flex;
    align-items: center;
    gap: 2px;
    padding-top: 0;
}

.star-filled {
    color: #fbbf24;
    font-size: 18px;
}

.star-empty {
    color: #d1d5db;
    font-size: 18px;
}

.rating-number {
    margin-left: 8px;
    color: #6b7280;
    font-size: 14px;
}
</style>
