<template>
  <section class="content-header clearfix">
    <h3>Order #{{ order.id || '...' }}</h3>

    <ol class="breadcrumb">
      <li>
        <a href="#" class="breadcrumb-home-icon" @click.prevent="$router.push({ name: 'admin.dashboard' })">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 18V15" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M10.07 2.81997L3.13999 8.36997C2.35999 8.98997 1.85999 10.3 2.02999 11.28L3.35999 19.24C3.59999 20.66 4.95999 21.81 6.39999 21.81H17.6C19.03 21.81 20.4 20.65 20.64 19.24L21.97 11.28C22.13 10.3 21.63 8.98997 20.86 8.36997L13.93 2.82997C12.86 1.96997 11.13 1.96997 10.07 2.81997Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </a>
      </li>
      <li><a href="#" @click.prevent="$router.push({ name: 'admin.orders.index' })">Orders</a></li>
      <li class="active">Order #{{ order.id || '...' }}</li>
    </ol>
  </section>

  <section class="content" v-if="isLoading">
    <div class="loading-container">
      <div class="spinner"></div>
      <p>Loading order details...</p>
    </div>
  </section>

  <section class="content" v-else>
    <div class="order-wrapper box">
      <!-- Order Information -->
      <div class="order-information-wrapper">
        <div class="order-information-buttons">
          <a href="#" @click.prevent="printOrder" class="btn btn-default" data-toggle="tooltip" title="Print">
            <i class="fa fa-print" aria-hidden="true"></i>
          </a>

          <button @click="sendEmail" class="btn btn-default" data-toggle="tooltip" title="Send Email" :disabled="isSaving">
            <i class="fa fa-envelope-o" aria-hidden="true"></i>
          </button>
        </div>

        <h4 class="section-title">
          <i class="fa fa-info-circle section-icon"></i>
          Order & Account Information
        </h4>

        <div class="row">
          <div class="col-md-6">
            <div class="order clearfix">
              <h5><i class="fa fa-file-text-o"></i> Order Information</h5>

              <div class="table-responsive">
                <table class="table">
                  <tbody>
                    <tr>
                      <td>Order ID</td>
                      <td>{{ order.id }}</td>
                    </tr>
                    <tr>
                      <td>Order Date</td>
                      <td>{{ order.date }}</td>
                    </tr>
                    <tr>
                      <td>Order Status</td>
                      <td>
                        <div class="row">
                          <div class="col-lg-9 col-md-10 col-sm-10">
                            <select
                              id="order-status"
                              class="form-control custom-select-black"
                              v-model="order.status"
                              :disabled="isSaving"
                            >
                              <option value="PENDING">Pending</option>
                              <option value="PENDING_PAYMENT">Pending Payment</option>
                              <option value="PAID">Paid</option>
                              <option value="PROCESSING">Processing</option>
                              <option value="SHIPPED">Shipped</option>
                              <option value="DELIVERED">Delivered</option>
                              <option value="CANCELLED">Cancelled</option>
                              <option value="REFUNDED">Refunded</option>
                            </select>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Shipping Method</td>
                      <td>{{ order.shippingMethod }}</td>
                    </tr>
                    <tr>
                      <td>Payment Method</td>
                      <td>{{ order.paymentMethod }}</td>
                    </tr>
                    <tr>
                      <td>Currency</td>
                      <td>{{ order.currency }}</td>
                    </tr>
                    <tr>
                      <td>Currency Rate</td>
                      <td>{{ order.currencyRate === 1 ? '1' : order.currencyRate }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="account-information">
              <h5><i class="fa fa-user"></i> Account Information</h5>

              <div class="table-responsive">
                <table class="table">
                  <tbody>
                    <tr>
                      <td>Customer Name</td>
                      <td>{{ order.customer.name }}</td>
                    </tr>
                    <tr>
                      <td>Customer Email</td>
                      <td>{{ order.customer.email }}</td>
                    </tr>
                    <tr>
                      <td>Customer Phone</td>
                      <td>{{ order.customer.phone }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Transactions Information -->
      <div class="transactions-wrapper" v-if="order.transactions && order.transactions.length > 0">
        <h4 class="section-title">
          <i class="fa fa-credit-card section-icon"></i>
          Payment Transactions
        </h4>

        <div class="row">
          <div class="col-md-12">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Payment Method</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="transaction in order.transactions" :key="transaction.id">
                    <td><code>{{ transaction.transactionId }}</code></td>
                    <td>{{ formatPaymentMethod(transaction.paymentMethod) }}</td>
                    <td>{{ formatDate(transaction.createdAt) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Address Information -->
      <div class="address-information-wrapper">
        <h4 class="section-title">
          <i class="fa fa-map-marker section-icon"></i>
          Address Information
        </h4>

        <div class="row">
          <div class="col-md-6">
            <div class="billing-address">
              <h5><i class="fa fa-money"></i> Billing Address</h5>
              <div class="address-content">
                {{ order.billingAddress.name }}<br>
                {{ order.billingAddress.address1 }}<br>
                <template v-if="order.billingAddress.address2">
                  {{ order.billingAddress.address2 }}<br>
                </template>
                {{ order.billingAddress.city }}, {{ order.billingAddress.state }} {{ order.billingAddress.zip }}<br>
                {{ order.billingAddress.country }}
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="shipping-address">
              <h5><i class="fa fa-truck"></i> Shipping Address</h5>
              <div class="address-content">
                {{ order.shippingAddress.name }}<br>
                {{ order.shippingAddress.address1 }}<br>
                <template v-if="order.shippingAddress.address2">
                  {{ order.shippingAddress.address2 }}<br>
                </template>
                {{ order.shippingAddress.city }}, {{ order.shippingAddress.state }} {{ order.shippingAddress.zip }}<br>
                {{ order.shippingAddress.country }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Items Ordered -->
      <div class="items-ordered-wrapper">
        <h4 class="section-title">
          <i class="fa fa-list section-icon"></i>
          Items Ordered
        </h4>

        <div class="row">
          <div class="col-md-12">
            <div class="items-ordered">
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Unit Price</th>
                      <th>Quantity</th>
                      <th>Line Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-for="item in order.items" :key="item.id">
                      <td>
                        <a href="#" @click.prevent="goToProduct(item.productId)">
                          {{ item.name }}
                        </a>
                        <div v-if="item.variations" class="item-options">
                          <small>{{ item.variations }}</small>
                        </div>
                        <div v-if="item.options" class="item-options">
                          <small v-for="(option, index) in item.options" :key="index">
                            {{ option.name }}: {{ option.value }}
                          </small>
                        </div>
                      </td>
                      <td><small class="text-muted">{{ item.sku || 'N/A' }}</small></td>
                      <td>{{ formatPrice(item.unitPrice) }}</td>
                      <td>{{ item.quantity }}</td>
                      <td>{{ formatPrice(item.lineTotal) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Totals -->
      <div class="order-totals-wrapper">
        <div class="order-totals-container">
          <div class="order-totals">
            <div class="table-responsive">
              <table class="table">
                <tbody>
                  <tr>
                    <td>Subtotal</td>
                    <td class="text-right">{{ formatPrice(order.subtotal) }}</td>
                  </tr>
                  <tr>
                    <td>{{ order.shippingMethod }}</td>
                    <td class="text-right">{{ formatPrice(order.shippingCost) }}</td>
                  </tr>
                  <tr v-if="order.discount > 0">
                    <td>Discount</td>
                    <td class="text-right">-{{ formatPrice(order.discount) }}</td>
                  </tr>
                  <tr v-if="order.tax > 0">
                    <td>Tax</td>
                    <td class="text-right">{{ formatPrice(order.tax) }}</td>
                  </tr>
                  <tr>
                    <td><strong>Total</strong></td>
                    <td class="text-right"><strong>{{ formatPrice(order.total) }}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Footer with Save Buttons -->
      <div class="page-form-footer">
        <button type="button" class="btn btn-default save-btn" @click="save" :disabled="isSaving">
          <i class="fa fa-floppy-o" aria-hidden="true"></i> Save
        </button>
        <button type="button" class="btn btn-primary save-exit-btn" @click="saveAndExit" :disabled="isSaving">
          <i class="fa fa-floppy-o" aria-hidden="true"></i> Save &amp; Exit
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getOrderById, updateOrderStatus, sendOrderEmail } from '@/api/orderApi.js';

const router = useRouter();
const route = useRoute();
const isLoading = ref(true);
const isSaving = ref(false);

// Order data
const order = reactive({
  id: '',
  date: '',
  status: '',
  shippingMethod: '',
  paymentMethod: '',
  currency: 'USD',
  currencyRate: '1.0000',
  trackingReference: '',
  customer: {
    name: '',
    email: '',
    phone: ''
  },
  billingAddress: {
    name: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  },
  shippingAddress: {
    name: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  },
  items: [],
  transactions: [],
  subtotal: 0,
  shippingCost: 0,
  discount: 0,
  tax: 0,
  total: 0
});

// Load order data
const loadOrderData = async () => {
  try {
    isLoading.value = true;
    const orderId = route.params.id;
    const response = await getOrderById(orderId);
    const data = response.data.result;

    // Map API data to order object
    order.id = data.id;
    order.date = formatDate(data.createdAt);
    order.status = data.status || 'PENDING';
    order.shippingMethod = data.shippingMethod || 'N/A';
    order.paymentMethod = formatPaymentMethod(data.paymentMethod);
    order.currency = data.currency || 'VND';
    order.currencyRate = data.currencyRate || 1;
    order.trackingReference = data.trackingReference || '';

    // Customer info - combine first and last name
    const customerName = [data.customerFirstName, data.customerLastName]
      .filter(Boolean)
      .join(' ') || 'N/A';
    order.customer.name = customerName;
    order.customer.email = data.customerEmail || 'N/A';
    order.customer.phone = data.customerPhone || 'N/A';
    order.customer.group = 'Registered';

    // Billing address - map flat fields to address object
    const billingName = [data.billingFirstName, data.billingLastName]
      .filter(Boolean)
      .join(' ') || customerName;
    order.billingAddress = {
      name: billingName,
      address1: data.billingAddress1 || '',
      address2: data.billingAddress2 || '',
      city: data.billingCity || '',
      state: data.billingState || '',
      zip: data.billingZip || '',
      country: data.billingCountry || ''
    };

    // Shipping address - map flat fields to address object
    const shippingName = [data.shippingFirstName, data.shippingLastName]
      .filter(Boolean)
      .join(' ') || customerName;
    order.shippingAddress = {
      name: shippingName,
      address1: data.shippingAddress1 || '',
      address2: data.shippingAddress2 || '',
      city: data.shippingCity || '',
      state: data.shippingState || '',
      zip: data.shippingZip || '',
      country: data.shippingCountry || ''
    };

    // Order items - map orderProducts array
    order.items = (data.orderProducts || []).map(item => {
      // Format variations if they exist
      const variations = (item.variations || []).map(v =>
        v.variationValues?.[0]?.label || v.value || ''
      ).filter(Boolean).join(' - ');

      // Format options if they exist
      const options = (item.options || []).map(opt => ({
        name: opt.name || opt.optionName,
        value: opt.value || opt.optionValue || ''
      }));

      return {
        id: item.id,
        productId: item.productId,
        variantId: item.productVariantId,
        name: item.productName || item.product, // Use productName, not variantName
        sku: item.sku || '',
        unitPrice: parseFloat(item.unitPrice) || 0,
        quantity: item.qty || 1,
        lineTotal: parseFloat(item.lineTotal) || 0,
        variations: variations,
        options: options.length > 0 ? options : null
      };
    });

    // Totals
    order.subtotal = parseFloat(data.subTotal) || 0;
    order.shippingCost = parseFloat(data.shippingCost) || 0;
    order.discount = parseFloat(data.discount) || 0;
    order.tax = parseFloat(data.tax) || 0;
    order.total = parseFloat(data.total) || 0;

    // Transactions
    order.transactions = (data.transactions || []).map(txn => ({
      id: txn.id,
      transactionId: txn.transactionId,
      paymentMethod: txn.paymentMethod,
      createdAt: txn.createdAt
    }));

  } catch (error) {
    console.error('Failed to load order:', error);
    alert('Failed to load order details. Please try again.');
    router.push({ name: 'admin.orders.index' });
  } finally {
    isLoading.value = false;
  }
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format payment method
const formatPaymentMethod = (method) => {
  if (!method) return 'N/A';
  // Convert DEBIT_CARD to Debit Card, etc.
  return method
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};


// Format price
const formatPrice = (price) => {
  const amount = parseFloat(price);
  if (order.currency === 'VND') {
    return `${amount.toLocaleString('vi-VN')}₫`;
  } else if (order.currency === 'USD') {
    return `$${amount.toFixed(2)}`;
  }
  return `${order.currency} ${amount.toFixed(2)}`;
};


// Save order changes
const save = async () => {
  try {
    isSaving.value = true;
    await updateOrderStatus(order.id, order.status);
    alert('Order updated successfully!');
    await loadOrderData(); // Reload to get latest data
  } catch (error) {
    console.error('Failed to save order:', error);
    alert('Failed to save order. Please try again.');
  } finally {
    isSaving.value = false;
  }
};

// Save and exit
const saveAndExit = async () => {
  try {
    isSaving.value = true;
    await updateOrderStatus(order.id, order.status);
    alert('Order updated successfully!');
    router.push({ name: 'admin.orders.index' });
  } catch (error) {
    console.error('Failed to save order:', error);
    alert('Failed to save order. Please try again.');
    isSaving.value = false;
  }
};

// Print order
const printOrder = () => {
  window.print();
};

// Send email
const sendEmail = async () => {
  try {
    isSaving.value = true;
    await sendOrderEmail(order.id);
    alert('Email sent to customer successfully!');
  } catch (error) {
    console.error('Failed to send email:', error);
    alert('Failed to send email. Please try again.');
  } finally {
    isSaving.value = false;
  }
};

// Go to product
const goToProduct = (productId) => {
  router.push({ name: 'admin.products.edit', params: { id: productId } });
};

// Load data on mount
onMounted(async () => {
  await loadOrderData();
});
</script>

<style scoped>
.content {
  background: #f5f5f5;
  min-height: calc(100vh - 200px);
  padding: 20px 20px 0 20px;
}


.content-header {
  padding: 15px 20px;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 20px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.content-header h3 {
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: 500;
  color: #333;
}

.breadcrumb {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  background: transparent;
  font-size: 14px;
}

.breadcrumb li {
  display: inline-block;
}

.breadcrumb li + li:before {
  content: "/";
  padding: 0 8px;
  color: #ccc;
}

.breadcrumb li a {
  color: #337ab7;
  text-decoration: none;
}

.breadcrumb li a:hover {
  color: #23527c;
  text-decoration: underline;
}

.breadcrumb li.active {
  color: #777;
}

.breadcrumb-home-icon {
  display: inline-flex;
  align-items: center;
}

.breadcrumb-home-icon svg {
  width: 20px;
  height: 20px;
}

.order-wrapper {
  background: #fff;
  padding: 20px;
  padding-bottom: 0;
  margin-bottom: 20px;
  overflow: visible;
}


.section-title {
  font-size: 17px;
  font-weight: 600;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #e8e8e8;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-icon {
  color: #0071dc;
  font-size: 18px;
}

.order-information-wrapper,
.transactions-wrapper,
.address-information-wrapper,
.items-ordered-wrapper {
  margin-bottom: 20px;
  background: #fff;
  padding: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.order-information-wrapper {
  margin-top: 0;
}

.order-totals-wrapper {
  margin-bottom: 0;
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
}

.order-information-buttons {
  float: right;
  margin-bottom: 15px;
  display: flex;
  gap: 8px;
}

.order-information-buttons .btn {
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.order-information-buttons .btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.order h5,
.account-information h5,
.billing-address h5,
.shipping-address h5 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #555;
  display: flex;
  align-items: center;
  gap: 6px;
}

.order h5 i,
.account-information h5 i,
.billing-address h5 i,
.shipping-address h5 i {
  color: #0071dc;
  font-size: 15px;
}

.table {
  margin-bottom: 0;
}

.table td {
  padding: 12px 10px;
  border-top: 1px solid #f0f0f0;
  vertical-align: middle;
}

.table td:first-child {
  font-weight: 500;
  color: #555;
  width: 180px;
}

.table td:last-child {
  color: #333;
}

.table tbody tr:first-child td {
  border-top: none;
}

.form-group {
  margin-bottom: 15px;
}

.form-control {
  display: block;
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  line-height: 1.5;
  color: #555;
  background-color: #fff;
  border: 1px solid #d2d6de;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-control:focus {
  border-color: #0071dc;
  outline: 0;
}

.custom-select-black {
  background-color: #fff;
  border: 1px solid #d2d6de;
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 4px;
}

.custom-select-black:focus {
  border-color: #0071dc;
  outline: 0;
}

label {
  display: inline-block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 4px;
  user-select: none;
}

.btn-primary {
  color: #fff;
  background-color: #0071dc;
  border-color: #0071dc;
}

.btn-primary:hover {
  background-color: #005bb5;
  border-color: #005bb5;
}

.btn-default {
  color: #333;
  background-color: #fff;
  border-color: #ccc;
}

.btn-default:hover {
  background-color: #f4f4f4;
  border-color: #adadad;
}

.billing-address,
.shipping-address {
  margin-bottom: 20px;
}

.billing-address h5,
.shipping-address h5 {
  margin-bottom: 15px;
}

.address-content {
  line-height: 1.8;
  color: #555;
  padding: 12px 15px;
  background: #fafafa;
  border-radius: 4px;
  border-left: 3px solid #0071dc;
  margin-top: 10px;
}

.table-responsive {
  width: 100%;
  overflow-x: visible;
}

.items-ordered .table th,
.transactions-wrapper .table th {
  background-color: #f9f9f9;
  font-weight: 600;
  padding: 12px 10px;
  border-bottom: 2px solid #e8e8e8;
  color: #333;
}

.transactions-wrapper .table tbody tr {
  border-bottom: 1px solid #f4f4f4;
}

.transactions-wrapper .table tbody tr:last-child {
  border-bottom: none;
}

.transactions-wrapper .table td {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.transactions-wrapper .table td:first-child {
  max-width: 400px;
  width: 50%;
}

.transactions-wrapper .table td:nth-child(2) {
  width: 25%;
}

.transactions-wrapper .table td:last-child {
  width: 25%;
}

.transactions-wrapper .table th:first-child {
  width: 50%;
}

.transactions-wrapper .table th:nth-child(2) {
  width: 25%;
}

.transactions-wrapper .table th:last-child {
  width: 25%;
}

.transactions-wrapper code {
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 12px;
  color: #333;
  font-family: 'Courier New', Courier, monospace;
  word-break: break-all;
  display: inline-block;
  max-width: 100%;
  overflow-wrap: break-word;
}

.item-options {
  margin-top: 5px;
}

.item-options small {
  display: block;
  color: #999;
  margin-top: 3px;
}

.items-ordered .table a {
  color: #0071dc;
  text-decoration: none;
  font-weight: 500;
}

.items-ordered .table a:hover {
  color: #005bb5;
  text-decoration: underline;
}

.items-ordered .table .text-muted {
  color: #999;
  font-size: 12px;
}


.order-totals-container {
  display: flex;
  justify-content: flex-end;
  padding: 20px 0;
}

.order-totals {
  width: 450px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.order-totals .table {
  margin-bottom: 0;
}

.order-totals .table td {
  padding: 14px 24px;
  border-top: 1px solid #f0f0f0;
  vertical-align: middle;
}

.order-totals .table tbody tr:first-child td {
  border-top: none;
}

.order-totals .table td:first-child {
  width: 60%;
  color: #555;
  font-weight: 500;
}

.order-totals .table td:last-child {
  width: 40%;
  color: #333;
  font-weight: 500;
}

.order-totals .table tr:last-child {
  background-color: #f8f9fa;
  border-top: 2px solid #d1d5db;
}

.order-totals .table tr:last-child td {
  font-size: 18px;
  padding: 18px 24px;
  color: #0071dc;
  font-weight: 600;
}

.order-totals .table tr:last-child td:first-child {
  color: #333;
}

.mt-3 {
  margin-top: 1rem;
}

.pull-left {
  float: left;
}

.pull-right {
  float: right;
}

.clearfix::after {
  content: "";
  display: table;
  clear: both;
}

.row {
  margin-left: -15px;
  margin-right: -15px;
  display: flex;
  flex-wrap: wrap;
}

.col-md-6 {
  width: 50%;
  padding-left: 15px;
  padding-right: 15px;
  box-sizing: border-box;
}

.col-md-12 {
  width: 100%;
  padding-left: 15px;
  padding-right: 15px;
  box-sizing: border-box;
}

.col-lg-5 {
  width: 41.66667%;
  padding-left: 15px;
  padding-right: 15px;
  box-sizing: border-box;
}

.col-md-8 {
  width: 66.66667%;
  padding-left: 15px;
  padding-right: 15px;
  box-sizing: border-box;
}

.col-lg-9 {
  width: 75%;
  padding-left: 15px;
  padding-right: 15px;
  box-sizing: border-box;
}

.col-md-10 {
  width: 83.33333%;
  padding-left: 15px;
  padding-right: 15px;
  box-sizing: border-box;
}

.col-sm-10 {
  width: 83.33333%;
  padding-left: 15px;
  padding-right: 15px;
  box-sizing: border-box;
}

/* Utility Classes */
.text-right {
  text-align: right;
}

.text-left {
  text-align: left;
}

.text-center {
  text-align: center;
}

@media (max-width: 991px) {
  .col-md-6,
  .col-md-8,
  .col-md-10,
  .col-md-12 {
    width: 100%;
  }

  .order-totals-container {
    justify-content: center;
  }

  .order-totals {
    width: 100%;
    max-width: 500px;
  }
}

@media (max-width: 1199px) {
  .col-lg-5,
  .col-lg-9 {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .page-form-footer {
    flex-direction: column-reverse;
    gap: 10px;
  }

  .page-form-footer .btn {
    width: 100%;
    min-width: auto;
  }

  .order-totals {
    width: 100%;
  }
}

@media print {
  .order-information-buttons,
  .breadcrumb,
  .page-form-footer {
    display: none;
  }
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container p {
  color: #666;
  font-size: 16px;
  margin: 0;
}

/* Page Form Footer */
.page-form-footer {
  margin: 20px -20px 0 -20px;
  padding: 20px;
  background: #f5f5f5;
  text-align: right;
  border-top: 1px solid #e8e8e8;
}

.page-form-footer .btn {
  margin-left: 10px;
}

.page-form-footer .btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
