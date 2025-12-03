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
                                        <li :class="{ active: activeTab === 'products' }">
                                            <a href="#products" @click.prevent="activeTab = 'products'">Products</a>
                                        </li>
                                        <li :class="{ active: activeTab === 'settings' }">
                                            <a href="#settings" @click.prevent="activeTab = 'settings'">Settings</a>
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
                        <!-- Products Tab -->
                        <div v-show="activeTab === 'products'" class="tab-pane fade in active" id="products">
                            <h4 class="tab-content-title">Products</h4>
                            
                            <div class="panel-wrap flash-sale" id="products-wrapper">
                                <div v-for="(product, index) in products" :key="index" class="panel">
                                    <div class="panel-header clearfix">
                                        <span class="drag-handle pull-left">
                                            <i class="fa fa-bars"></i>
                                        </span>
                                        Flash Sale Product
                                        <button type="button" class="delete-product-panel btn pull-right" @click="removeProduct(index)">
                                            <i class="fa fa-times"></i>
                                        </button>
                                    </div>

                                    <div class="panel-body">
                                        <div class="row">
                                            <div class="col-sm-12">
                                                <div class="form-group">
                                                    <label :for="`products-${index}-product`">
                                                        Product<span class="m-l-5 text-red">*</span>
                                                    </label>
                                                    <input 
                                                        v-model="product.name" 
                                                        type="text" 
                                                        class="form-control" 
                                                        :id="`products-${index}-product`"
                                                        placeholder="Enter product name"
                                                    >
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-sm-6 col-xs-12">
                                                <div class="form-group">
                                                    <label :for="`products-${index}-end-date`">
                                                        End Date<span class="m-l-5 text-red">*</span>
                                                    </label>
                                                    <input 
                                                        v-model="product.end_date" 
                                                        type="datetime-local" 
                                                        class="form-control" 
                                                        :id="`products-${index}-end-date`"
                                                    >
                                                </div>
                                            </div>

                                            <div class="col-sm-3 col-xs-6">
                                                <div class="form-group">
                                                    <label :for="`products-${index}-price`">
                                                        Price<span class="m-l-5 text-red">*</span>
                                                    </label>
                                                    <input 
                                                        v-model.number="product.price" 
                                                        type="number" 
                                                        class="form-control" 
                                                        :id="`products-${index}-price`"
                                                        min="0"
                                                    >
                                                </div>
                                            </div>

                                            <div class="col-sm-3 col-xs-6">
                                                <div class="form-group">
                                                    <label :for="`products-${index}-qty`">
                                                        Quantity<span class="m-l-5 text-red">*</span>
                                                    </label>
                                                    <input 
                                                        v-model.number="product.qty" 
                                                        type="number" 
                                                        class="form-control" 
                                                        :id="`products-${index}-qty`"
                                                    >
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group">
                                <button type="button" class="add-product btn btn-default m-l-15" @click="addProduct">
                                    Add Product
                                </button>
                            </div>
                        </div>

                        <!-- Settings Tab -->
                        <div v-show="activeTab === 'settings'" class="tab-pane fade in" id="settings">
                            <h4 class="tab-content-title">Settings</h4>
                            <div class="row">
                                <div class="col-md-8">
                                    <div class="form-group">
                                        <label for="campaign_name" class="col-md-3 control-label text-left">
                                            Campaign Name<span class="m-l-5 text-red">*</span>
                                        </label>
                                        <div class="col-md-9">
                                            <input 
                                                v-model="campaignName" 
                                                type="text" 
                                                class="form-control" 
                                                id="campaign_name"
                                                placeholder="Enter campaign name"
                                            >
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Save Button -->
                        <div class="form-group">
                            <div class="col-md-10">
                                <button type="submit" class="btn btn-primary" @click="handleSave" :disabled="loading">
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
import { useRouter, useRoute } from 'vue-router';
import { getFlashSale, updateFlashSale } from '../api/flashsaleApi';

export default {
    name: 'FlashSaleCreate',
    setup() {
        const router = useRouter();
        const route = useRoute();
        const activeTab = ref('products');
        const loading = ref(false);
        const campaignName = ref('');
        const flashSaleId = ref(null);
        const products = ref([
            {
                name: '',
                end_date: '',
                price: 0,
                qty: 0
            }
        ]);

        // Load flash sale data for editing
        onMounted(async () => {
            const id = route.params.id;
            console.log('Route params ID:', id);
            
            if (id) {
                flashSaleId.value = id;
                
                // Mock data for testing if API is not ready
                const mockFlashSales = {
                    1: {
                        name: 'Summer Sale 2024',
                        products: [
                            { name: 'Product A', end_date: '2024-08-31T23:59', price: 199000, qty: 50 },
                            { name: 'Product B', end_date: '2024-08-31T23:59', price: 299000, qty: 30 }
                        ]
                    },
                    2: {
                        name: 'Black Friday Sale',
                        products: [
                            { name: 'Product C', end_date: '2024-11-30T23:59', price: 499000, qty: 100 }
                        ]
                    },
                    3: {
                        name: 'Christmas Sale',
                        products: [
                            { name: 'Product D', end_date: '2024-12-25T23:59', price: 399000, qty: 75 }
                        ]
                    }
                };
                
                try {
                    console.log('Fetching flash sale with ID:', id);
                    const response = await getFlashSale(id);
                    console.log('API Response:', response);
                    
                    if (response && response.code === 200 && response.result) {
                        const data = response.result;
                        console.log('Flash sale data from API:', data);
                        
                        campaignName.value = data.name || data.campaignName || '';
                        
                        // Map products from API response
                        if (data.products && data.products.length > 0) {
                            products.value = data.products.map(p => ({
                                name: p.productName || p.name || '',
                                end_date: p.endDate || p.end_date || '',
                                price: p.price || 0,
                                qty: p.quantity || p.qty || 0
                            }));
                        }
                        
                        console.log('Loaded campaign name:', campaignName.value);
                        console.log('Loaded products:', products.value);
                    }
                } catch (error) {
                    console.error('Error loading flash sale from API:', error);
                    console.log('Loading mock data instead...');
                    
                    // Use mock data as fallback
                    const mockData = mockFlashSales[id];
                    if (mockData) {
                        campaignName.value = mockData.name;
                        products.value = mockData.products;
                        console.log('Loaded mock data:', mockData);
                    } else {
                        alert('Flash sale not found');
                    }
                }
            }
        });

        const addProduct = () => {
            products.value.push({
                name: '',
                end_date: '',
                price: 0,
                qty: 0
            });
        };

        const removeProduct = (index) => {
            if (products.value.length > 1) {
                products.value.splice(index, 1);
            } else {
                alert('At least one product is required');
            }
        };

        const handleSave = async () => {
            // Validate
            if (!campaignName.value) {
                alert('Please enter campaign name');
                activeTab.value = 'settings';
                return;
            }

            const invalidProduct = products.value.find(p => !p.name || !p.end_date || !p.price || !p.qty);
            if (invalidProduct) {
                alert('Please fill in all product fields');
                activeTab.value = 'products';
                return;
            }

            loading.value = true;

            try {
                const flashSaleData = {
                    name: campaignName.value,
                    products: products.value.map(p => ({
                        productName: p.name,
                        endDate: p.end_date,
                        price: p.price,
                        quantity: p.qty
                    }))
                };

                await updateFlashSale(flashSaleId.value, flashSaleData);
                alert('Flash Sale updated successfully!');
                router.push({ name: 'admin.flashsales.index' });
            } catch (error) {
                console.error('Error updating flash sale:', error);
                alert('Failed to update flash sale. Please try again.');
            } finally {
                loading.value = false;
            }
        };

        return {
            activeTab,
            loading,
            campaignName,
            products,
            addProduct,
            removeProduct,
            handleSave
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
    color: #333;
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
}

.tab-content-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 30px;
    padding-bottom: 15px;
    border-bottom: 1px solid #f3f4f6;
    color: #111827;
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

.m-l-15 {
    margin-left: 15px;
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
.col-lg-3, .col-lg-9, .col-md-4, .col-md-8, .col-md-9, .col-md-10, .col-sm-3, .col-sm-6, .col-sm-12, .col-xs-6, .col-xs-12 {
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
}

.col-md-4 {
    width: 33.333333%;
}

.col-md-8 {
    width: 66.666667%;
}

.col-md-9 {
    width: 75%;
}

.col-md-10 {
    width: 83.333333%;
}

.col-sm-12 {
    width: 100%;
}

.col-sm-6 {
    width: 50%;
}

.col-sm-3 {
    width: 25%;
}

@media (min-width: 992px) {
    .col-lg-3 {
        width: 25%;
    }
    .col-lg-9 {
        width: 75%;
    }
}

@media (max-width: 767px) {
    .col-xs-12 {
        width: 100%;
    }
    .col-xs-6 {
        width: 50%;
    }
}

.row {
    margin-left: -15px;
    margin-right: -15px;
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
