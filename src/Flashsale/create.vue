<template>
    <div class="flashsale-create-wrapper">
        <div class="accordion-content clearfix">
            <!-- Sidebar -->
            <div class="col-lg-3 col-md-4">
                <div class="accordion-box">
                    <div class="panel-group" id="FlashSaleTabs">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h4 class="panel-title">
                                    <a>Flash Sale Information</a>
                                </h4>
                            </div>

                            <div id="flash_sale_information" class="panel-collapse collapse in">
                                <div class="panel-body">
                                    <ul class="accordion-tab nav nav-tabs">
                                        <li :class="{ active: activeTab === 'general' }">
                                            <a href="#general" @click.prevent="activeTab = 'general'">General</a>
                                        </li>
                                        <li :class="{ active: activeTab === 'products' }">
                                            <a href="#products" @click.prevent="activeTab = 'products'">Products</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Content -->
            <div class="col-lg-9 col-md-8">
                <div class="accordion-box-content">
                    <div class="tab-content clearfix">
                        <!-- General Tab -->
                        <div v-show="activeTab === 'general'" class="tab-pane" id="general" :style="{ display: activeTab === 'general' ? 'block' : 'none' }">
                            <h4 class="tab-content-title">General Information</h4>

                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label for="name">
                                            Flash Sale Name<span class="m-l-5 text-red">*</span>
                                        </label>
                                        <input
                                            v-model="formData.name"
                                            type="text"
                                            class="form-control"
                                            id="name"
                                            placeholder="Enter flash sale name"
                                        >
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="start_time">
                                            Start Time<span class="m-l-5 text-red">*</span>
                                        </label>
                                        <input
                                            v-model="formData.startTime"
                                            type="datetime-local"
                                            class="form-control"
                                            id="start_time"
                                        >
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="end_time">
                                            End Time<span class="m-l-5 text-red">*</span>
                                        </label>
                                        <input
                                            v-model="formData.endTime"
                                            type="datetime-local"
                                            class="form-control"
                                            id="end_time"
                                        >
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label class="checkbox-inline">
                                            <input
                                                v-model="formData.isActive"
                                                type="checkbox"
                                            >
                                            Is Active
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Products Tab -->
                        <div v-show="activeTab === 'products'" class="tab-pane" id="products" :style="{ display: activeTab === 'products' ? 'block' : 'none' }">
                            <h4 class="tab-content-title">Products</h4>

                            <!-- Search Section -->
                            <div class="search-section">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="search_variant">Search Product Variant</label>
                                            <input
                                                v-model="searchKeyword"
                                                type="text"
                                                class="form-control"
                                                id="search_variant"
                                                placeholder="Type to search by product name, variant name, or SKU..."
                                                @input="onSearchInput"
                                            >
                                            <small v-if="searchKeyword && searchKeyword.length > 0 && searchKeyword.length < 2" class="text-muted">
                                                Please enter at least 2 characters to search
                                            </small>
                                        </div>
                                    </div>
                                </div>

                                <!-- Loading State -->
                                <div v-if="searchLoading" class="search-loading">
                                    <i class="fa fa-spinner fa-spin"></i> Searching...
                                </div>

                                <!-- No Results Message -->
                                <div v-if="searchKeyword.length >= 2 && !searchLoading && availableVariants.length === 0" class="no-results">
                                    <i class="fa fa-search"></i> No variants found. Try different keywords.
                                </div>

                                <!-- Available Variants List -->
                                <div v-if="availableVariants.length > 0" class="available-variants-list">
                                    <div class="variants-grid">
                                        <div
                                            v-for="variant in availableVariants"
                                            :key="variant.id"
                                            class="variant-card"
                                            @click="selectVariant(variant)"
                                        >
                                            <img
                                                v-if="variant.thumbnail"
                                                :src="variant.thumbnail"
                                                :alt="variant.name"
                                                class="variant-thumbnail"
                                            >
                                            <div class="variant-info">
                                                <div class="variant-name">{{ variant.name }}</div>
                                                <div class="variant-sku">SKU: {{ variant.sku }}</div>
                                                <div class="variant-price">Price: {{ formatPrice(variant.price) }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Selected Variant Form -->
                                <div v-if="selectedVariant" class="selected-variant-form">
                                    <h5>Add Product to Flash Sale</h5>
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <label for="selected_variant">Selected Variant</label>
                                                <input
                                                    :value="selectedVariant.name"
                                                    type="text"
                                                    class="form-control"
                                                    id="selected_variant"
                                                    readonly
                                                >
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="flash_price">
                                                    Flash Price<span class="m-l-5 text-red">*</span>
                                                </label>
                                                <input
                                                    v-model.number="newItem.flashPrice"
                                                    type="number"
                                                    class="form-control"
                                                    id="flash_price"
                                                    min="0"
                                                    step="0.01"
                                                    placeholder="Enter flash sale price"
                                                >
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="flash_qty">
                                                    Flash Quantity<span class="m-l-5 text-red">*</span>
                                                </label>
                                                <input
                                                    v-model.number="newItem.flashQty"
                                                    type="number"
                                                    class="form-control"
                                                    id="flash_qty"
                                                    min="1"
                                                    placeholder="Enter quantity"
                                                >
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12">
                                            <button
                                                type="button"
                                                class="btn btn-primary"
                                                @click="addItemToList"
                                                :disabled="!newItem.flashPrice || !newItem.flashQty"
                                            >
                                                Add to List
                                            </button>
                                            <button
                                                type="button"
                                                class="btn btn-default m-l-10"
                                                @click="cancelSelection"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Products List -->
                            <div class="products-list">
                                <h5>Products in Flash Sale</h5>
                                <div v-if="items.length === 0" class="no-products">
                                    No products added yet.
                                </div>
                                <div v-else class="panel-wrap flash-sale">
                                    <div v-for="(item, index) in items" :key="index" class="panel">
                                        <div class="panel-header clearfix">
                                            <span class="drag-handle pull-left">
                                                <i class="fa fa-bars"></i>
                                            </span>
                                            {{ item.variantName || item.name }}
                                            <button
                                                type="button"
                                                class="delete-product-panel btn pull-right"
                                                @click="removeItem(index)"
                                            >
                                                <i class="fa fa-times"></i>
                                            </button>
                                        </div>

                                        <div class="panel-body">
                                            <div class="row">
                                                <div class="col-sm-4">
                                                    <strong>Product:</strong> {{ item.productName }}
                                                </div>
                                                <div class="col-sm-4">
                                                    <strong>Flash Price:</strong> {{ formatPrice(item.flashPrice) }}
                                                </div>
                                                <div class="col-sm-4">
                                                    <strong>Quantity:</strong> {{ item.flashQty }}
                                                </div>
                                            </div>
                                            <div v-if="item.id" class="row m-t-10">
                                                <div class="col-sm-4">
                                                    <strong>Sold:</strong> {{ item.soldQty || 0 }}
                                                </div>
                                                <div class="col-sm-4">
                                                    <strong>Remaining:</strong> {{ item.remainingQty || item.flashQty }}
                                                </div>
                                                <div class="col-sm-4">
                                                    <strong>Discount:</strong> {{ item.discountPercent || 0 }}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Save Button -->
                        <div class="form-group">
                            <div class="col-md-10">
                                <button
                                    type="submit"
                                    class="btn btn-primary"
                                    @click="handleSave"
                                    :disabled="loading"
                                >
                                    {{ loading ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}
                                </button>
                                <button
                                    type="button"
                                    class="btn btn-default m-l-10"
                                    @click="goBack"
                                >
                                    Cancel
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
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
    getFlashSale,
    createFlashSale,
    updateFlashSale,
    addProductToFlashSale,
    removeProductFromFlashSale,
    getAvailableVariants
} from '@/api/flashsaleApi.js';

export default {
    name: 'FlashSaleCreate',
    setup() {
        const router = useRouter();
        const route = useRoute();
        const activeTab = ref('general');
        const loading = ref(false);
        const flashSaleId = ref(null);
        const isEditMode = computed(() => !!flashSaleId.value);

        const formData = ref({
            name: '',
            startTime: '',
            endTime: '',
            isActive: true
        });

        const items = ref([]);
        const searchKeyword = ref('');
        const searchLoading = ref(false);
        const availableVariants = ref([]);
        const selectedVariant = ref(null);
        const newItem = ref({
            flashPrice: null,
            flashQty: null
        });
        let searchTimeout = null;

        // Format datetime for input
        const formatDateTimeForInput = (dateString) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        };

        // Format price for display
        const formatPrice = (price) => {
            if (!price) return '0';
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
        };

        // Load flash sale data for editing
        const loadFlashSale = async (id) => {
            try {
                const response = await getFlashSale(id);
                if (response && response.code === 200 && response.result) {
                    const data = response.result;

                    formData.value = {
                        name: data.name || '',
                        startTime: formatDateTimeForInput(data.startTime),
                        endTime: formatDateTimeForInput(data.endTime),
                        isActive: data.isActive !== undefined ? data.isActive : true
                    };

                    // Load items
                    if (data.items && data.items.length > 0) {
                        items.value = data.items;
                    }
                }
            } catch (error) {
                console.error('Error loading flash sale:', error);
                alert('Error loading flash sale. Please try again.');
            }
        };

        // Search variants with debounce
        const searchVariants = async () => {
            if (!searchKeyword.value || searchKeyword.value.length < 2) {
                availableVariants.value = [];
                searchLoading.value = false;
                return;
            }

            searchLoading.value = true;
            try {
                const response = await getAvailableVariants(searchKeyword.value);
                if (response && response.code === 200) {
                    availableVariants.value = response.result || [];
                }
            } catch (error) {
                console.error('Error searching variants:', error);
                alert('Error searching variants. Please try again.');
            } finally {
                searchLoading.value = false;
            }
        };

        // Handle search input with debounce
        const onSearchInput = () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }

            if (!searchKeyword.value || searchKeyword.value.length < 2) {
                availableVariants.value = [];
                searchLoading.value = false;
                return;
            }

            searchLoading.value = true;
            searchTimeout = setTimeout(() => {
                searchVariants();
            }, 500);
        };

        // Select variant
        const selectVariant = (variant) => {
            selectedVariant.value = variant;
            const discountedPrice = variant.price * 0.8;
            const roundedPrice = Math.round(discountedPrice / 1000) * 1000;

            newItem.value = {
                flashPrice: roundedPrice > 0 ? roundedPrice : Math.round(discountedPrice),
                flashQty: 10
            };
            availableVariants.value = [];
            searchKeyword.value = '';
        };

        // Add item to list
        const addItemToList = () => {
            if (!selectedVariant.value || !newItem.value.flashPrice || !newItem.value.flashQty) {
                alert('Please fill in all fields');
                return;
            }

            items.value.push({
                variantId: selectedVariant.value.id,
                variantName: selectedVariant.value.name,
                productName: selectedVariant.value.productName || selectedVariant.value.name,
                variantSku: selectedVariant.value.sku,
                thumbnail: selectedVariant.value.thumbnail,
                flashPrice: newItem.value.flashPrice,
                flashQty: newItem.value.flashQty,
                originalPrice: selectedVariant.value.price
            });

            cancelSelection();
        };

        // Cancel selection
        const cancelSelection = () => {
            selectedVariant.value = null;
            newItem.value = {
                flashPrice: null,
                flashQty: null
            };
        };

        // Remove item
        const removeItem = async (index) => {
            const item = items.value[index];

            if (item.id && flashSaleId.value) {
                if (!confirm('Are you sure you want to remove this product from the flash sale?')) {
                    return;
                }

                try {
                    await removeProductFromFlashSale(item.id);
                    items.value.splice(index, 1);
                    alert('Product removed successfully!');
                } catch (error) {
                    console.error('Error removing product:', error);
                    alert('Error removing product. Please try again.');
                }
            } else {
                items.value.splice(index, 1);
            }
        };

        // Validate form
        const validateForm = () => {
            if (!formData.value.name) {
                alert('Please enter flash sale name');
                activeTab.value = 'general';
                return false;
            }

            if (!formData.value.startTime) {
                alert('Please select start time');
                activeTab.value = 'general';
                return false;
            }

            if (!formData.value.endTime) {
                alert('Please select end time');
                activeTab.value = 'general';
                return false;
            }

            const startTime = new Date(formData.value.startTime);
            const endTime = new Date(formData.value.endTime);

            if (endTime <= startTime) {
                alert('End time must be after start time');
                activeTab.value = 'general';
                return false;
            }

            return true;
        };

        // Handle save
        const handleSave = async () => {
            if (!validateForm()) {
                return;
            }

            loading.value = true;

            try {
                const flashSaleData = {
                    name: formData.value.name,
                    startTime: formData.value.startTime,
                    endTime: formData.value.endTime,
                    isActive: formData.value.isActive
                };

                let savedFlashSaleId = flashSaleId.value;

                if (isEditMode.value) {
                    await updateFlashSale(flashSaleId.value, flashSaleData);
                } else {
                    const response = await createFlashSale(flashSaleData);
                    if (response && response.code === 200 && response.result) {
                        savedFlashSaleId = response.result.id;
                    }
                }

                // Add new items
                const newItems = items.value.filter(item => !item.id);
                for (const item of newItems) {
                    const itemData = {
                        variantId: item.variantId,
                        flashPrice: item.flashPrice,
                        flashQty: item.flashQty
                    };
                    await addProductToFlashSale(savedFlashSaleId, itemData);
                }

                alert(`Flash Sale ${isEditMode.value ? 'updated' : 'created'} successfully!`);
                router.push({ name: 'admin.flashsales.index' });
            } catch (error) {
                console.error('Error saving flash sale:', error);
                const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
                alert(`Failed to save flash sale: ${errorMessage}`);
            } finally {
                loading.value = false;
            }
        };

        // Go back
        const goBack = () => {
            router.push({ name: 'admin.flashsales.index' });
        };

        onMounted(async () => {
            const id = route.params.id;
            if (id) {
                flashSaleId.value = id;
                await loadFlashSale(id);
            }
        });

        return {
            activeTab,
            loading,
            isEditMode,
            formData,
            items,
            searchKeyword,
            searchLoading,
            availableVariants,
            selectedVariant,
            newItem,
            formatPrice,
            onSearchInput,
            selectVariant,
            addItemToList,
            cancelSelection,
            removeItem,
            handleSave,
            goBack
        };
    }
};
</script>

<style scoped>
.flashsale-create-wrapper {
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
    cursor: pointer;
}

.accordion-tab li.active a {
    color: #2563eb;
    background: #fff;
    border-color: #ddd;
    border-bottom-color: #fff;
    font-weight: 600;
}

.accordion-box-content {
    background: #fff;
    border: none;
    border-radius: 0;
    padding: 20px;
    flex: 1;
}


.tab-content-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 30px;
    padding-bottom: 15px;
    border-bottom: 1px solid #f3f4f6;
    color: #111827;
}

/* Search Section */
.search-section {
    background: #f9fafb;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 30px;
    border: 1px solid #e5e7eb;
}

.text-muted {
    color: #6b7280;
    font-size: 13px;
    display: block;
    margin-top: 5px;
}

.search-loading {
    text-align: center;
    padding: 30px;
    color: #3b82f6;
    font-size: 16px;
}

.search-loading i {
    margin-right: 8px;
}

.no-results {
    text-align: center;
    padding: 40px;
    color: #6b7280;
    font-size: 15px;
    background: #fff;
    border-radius: 8px;
    border: 1px dashed #d1d5db;
}

.no-results i {
    display: block;
    font-size: 32px;
    margin-bottom: 10px;
    color: #9ca3af;
}

.available-variants-list {
    margin-top: 20px;
    max-height: 400px;
    overflow-y: auto;
}

.variants-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
}

.variant-card {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 15px;
    cursor: pointer;
    transition: all 0.2s;
    background: #fff;
}

.variant-card:hover {
    border-color: #3b82f6;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

.variant-thumbnail {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 4px;
    margin-bottom: 10px;
}

.variant-info {
    font-size: 14px;
}

.variant-name {
    font-weight: 600;
    margin-bottom: 5px;
    color: #111827;
}

.variant-sku,
.variant-price {
    color: #6b7280;
    font-size: 13px;
}

.selected-variant-form {
    margin-top: 30px;
    padding-top: 30px;
    border-top: 1px solid #e5e7eb;
}

.selected-variant-form h5 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #111827;
}

/* Products List */
.products-list {
    margin-top: 30px;
}

.products-list h5 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #111827;
}

.no-products {
    text-align: center;
    padding: 40px;
    color: #6b7280;
    font-size: 14px;
    background: #f9fafb;
    border-radius: 8px;
    border: 1px dashed #d1d5db;
}

/* Panel Styles */
.panel-wrap {
    margin-bottom: 20px;
}

.panel {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    margin-bottom: 15px;
    background: #fff;
}

.panel-header {
    background: #f9fafb;
    padding: 12px 15px;
    border-bottom: 1px solid #e5e7eb;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 10px;
}

.drag-handle {
    color: #9ca3af;
    cursor: move;
}

.delete-product-panel {
    background: transparent;
    border: none;
    color: #ef4444;
    cursor: pointer;
    padding: 4px 8px;
    font-size: 16px;
}

.delete-product-panel:hover {
    color: #dc2626;
}

.panel-body {
    padding: 20px;
}

/* Form Styles */
.form-group {
    margin-bottom: 20px;
}

.control-label {
    padding-top: 7px;
    font-weight: 500;
    color: #374151;
    font-size: 14px;
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

.m-l-10 {
    margin-left: 10px;
}

.m-l-15 {
    margin-left: 15px;
}

.m-t-10 {
    margin-top: 10px;
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

.form-control[readonly] {
    background-color: #f3f4f6;
}

.checkbox-inline {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
}

.checkbox-inline input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
}

/* Buttons */
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

.btn-default {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
}

.btn-default:hover {
    background: #e5e7eb;
}

/* Responsive Grid */
.col-lg-3, .col-lg-9, .col-md-4, .col-md-6, .col-md-8, .col-md-10, .col-md-12, .col-sm-4, .col-sm-6, .col-sm-12 {
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
}

.col-md-6 {
    width: 50%;
}

.col-md-8 {
    width: 66.666667%;
}

.col-md-10 {
    width: 83.333333%;
}

.col-md-12 {
    width: 100%;
}

.col-sm-12 {
    width: 100%;
}

.col-sm-6 {
    width: 50%;
}

.col-sm-4 {
    width: 33.333333%;
}

@media (min-width: 992px) {
    .col-lg-3 {
        width: 25%;
    }
    .col-lg-9 {
        width: 75%;
    }
}

.row {
    margin-left: -15px;
    margin-right: -15px;
}

.row::after {
    content: "";
    display: table;
    clear: both;
}

.clearfix::after {
    content: "";
    display: table;
    clear: both;
}

.pull-left {
    float: left;
}

.pull-right {
    float: right;
}
</style>

