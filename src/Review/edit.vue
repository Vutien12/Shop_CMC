<template>
    <div class="review-edit-wrapper">
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
                        <div class="row">
                            <div class="col-md-12">
                                <!-- Rating Field -->
                                <div class="form-group">
                                    <label for="rating" class="col-md-3 control-label text-left">
                                        Rating
                                        <span class="m-l-5 text-red">*</span>
                                    </label>
                                    <div class="col-md-9">
                                        <select 
                                            v-model.number="form.rating" 
                                            name="rating" 
                                            class="form-control custom-select-black" 
                                            id="rating"
                                            disabled
                                        >
                                            <option :value="1">1</option>
                                            <option :value="2">2</option>
                                            <option :value="3">3</option>
                                            <option :value="4">4</option>
                                            <option :value="5">5</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Reviewer Name Field -->
                                <div class="form-group">
                                    <label for="reviewer_name" class="col-md-3 control-label text-left">
                                        Reviewer Name
                                        <span class="m-l-5 text-red">*</span>
                                    </label>
                                    <div class="col-md-9">
                                        <input 
                                            v-model="form.reviewer_name" 
                                            name="reviewer_name" 
                                            class="form-control" 
                                            id="reviewer_name" 
                                            type="text"
                                            disabled
                                        />
                                    </div>
                                </div>

                                <!-- Comment Field -->
                                <div class="form-group">
                                    <label for="comment" class="col-md-3 control-label text-left">
                                        Comment
                                        <span class="m-l-5 text-red">*</span>
                                    </label>
                                    <div class="col-md-9">
                                        <textarea 
                                            v-model="form.comment" 
                                            name="comment" 
                                            class="form-control" 
                                            id="comment" 
                                            rows="4" 
                                            cols="10"
                                            disabled
                                        ></textarea>
                                    </div>
                                </div>

                                <!-- Status Field -->
                                <div class="form-group">
                                    <label for="is_hidden" class="col-md-3 control-label text-left">
                                        Status
                                    </label>
                                    <div class="col-md-9">
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
import { getReview, updateReview } from '../api/reviewApi';

export default {
    name: 'ReviewEdit',
    setup() {
        const route = useRoute();
        const router = useRouter();
        const loading = ref(false);
        const reviewId = ref(null);
        
        const form = ref({
            rating: 5,
            reviewer_name: '',
            comment: '',
            is_hidden: false,
            productId: null,
            userId: null,
            orderId: null,
            title: ''
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
                        
                        // Map API data to form - keep all fields for update
                        form.value = {
                            rating: parseInt(data.rating) || 5,
                            reviewer_name: data.userFullName || '',
                            comment: data.comment || '',
                            is_hidden: data.isHidden || false,
                            productId: data.productId,
                            userId: data.userId,
                            orderId: data.orderId,
                            title: data.title || ''
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
            loading.value = true;

            try {
                // Ensure rating has a valid value
                const ratingValue = form.value.rating ? Number(form.value.rating) : 5;
                
                // Only update isHidden status, keep other fields unchanged
                const updateData = {
                    productId: Number(form.value.productId),
                    userId: Number(form.value.userId),
                    orderId: Number(form.value.orderId),
                    title: form.value.title || '',
                    comment: form.value.comment || '',
                    rating: ratingValue,
                    isHidden: Boolean(form.value.is_hidden)
                };

                console.log('Form value rating:', form.value.rating);
                console.log('Rating value to send:', ratingValue);
                console.log('Full update data:', updateData);
                
                const response = await updateReview(reviewId.value, updateData);
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
</style>
