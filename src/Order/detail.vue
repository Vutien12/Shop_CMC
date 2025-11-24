<template>
  <section class="content-header clearfix">
    <h3>Order #{{ order.id }}</h3>

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
      <li class="active">Order #{{ order.id }}</li>
    </ol>
  </section>

  <section class="content">
    <div class="order-wrapper box">
      <!-- Order Tracking -->
      <div class="order-tracking-wrapper">
        <h4 class="section-title">Order Tracking</h4>

        <form @submit.prevent="saveTracking">
          <div class="row">
            <div class="col-lg-5 col-md-8">
              <label for="tracking_reference">Tracking Reference</label>

              <div class="form-group">
                <input 
                  type="text" 
                  name="tracking_reference" 
                  id="tracking_reference" 
                  class="form-control" 
                  v-model="order.trackingReference"
                  placeholder="Tracking reference such as Tracking Code, Tracking URL, Tracking ID, etc."
                >
              </div>

              <div class="text-left mt-3">
                <button type="submit" class="btn btn-primary">
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Order Information -->
      <div class="order-information-wrapper">
        <div class="order-information-buttons">
          <a href="#" @click.prevent="printOrder" class="btn btn-default" data-toggle="tooltip" title="Print">
            <i class="fa fa-print" aria-hidden="true"></i>
          </a>

          <button @click="sendEmail" class="btn btn-default" data-toggle="tooltip" title="Send Email">
            <i class="fa fa-envelope-o" aria-hidden="true"></i>
          </button>
        </div>

        <h4 class="section-title">Order & Account Information</h4>

        <div class="row">
          <div class="col-md-6">
            <div class="order clearfix">
              <h5>Order Information</h5>

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
                              @change="updateStatus"
                            >
                              <option value="canceled">Canceled</option>
                              <option value="completed">Completed</option>
                              <option value="on_hold">On Hold</option>
                              <option value="pending">Pending</option>
                              <option value="pending_payment">Pending Payment</option>
                              <option value="processing">Processing</option>
                              <option value="refunded">Refunded</option>
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
                      <td>{{ order.currencyRate }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="account-information">
              <h5>Account Information</h5>

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
                    <tr>
                      <td>Customer Group</td>
                      <td>{{ order.customer.group }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Address Information -->
      <div class="address-information-wrapper">
        <h4 class="section-title">Address Information</h4>

        <div class="row">
          <div class="col-md-6">
            <div class="billing-address">
              <h5>Billing Address</h5>
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
              <h5>Shipping Address</h5>
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
        <h4 class="section-title">Items Ordered</h4>

        <div class="row">
          <div class="col-md-12">
            <div class="items-ordered">
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Product</th>
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
                        <div v-if="item.options" class="item-options">
                          <small v-for="(option, index) in item.options" :key="index">
                            {{ option.name }}: {{ option.value }}
                          </small>
                        </div>
                      </td>
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
    </div>
  </section>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// Mock data - Replace with real API call
const order = reactive({
  id: '2356',
  date: 'Nov 24, 2025',
  status: 'pending_payment',
  shippingMethod: 'Free Shipping',
  paymentMethod: 'Iyzico',
  currency: 'USD',
  currencyRate: '1.0000',
  trackingReference: '',
  customer: {
    name: 'Demo Admin',
    email: 'admin@email.com',
    phone: '12345678',
    group: 'Registered'
  },
  billingAddress: {
    name: 'Demo Admin',
    address1: 'Banasree',
    address2: '',
    city: 'Dhaka',
    state: 'Dhaka',
    zip: '1219',
    country: 'Bangladesh'
  },
  shippingAddress: {
    name: 'Demo Admin',
    address1: 'Banasree',
    address2: '',
    city: 'Dhaka',
    state: 'Dhaka',
    zip: '1219',
    country: 'Bangladesh'
  },
  items: [
    {
      id: 1,
      productId: 101,
      name: 'Men Embroidery Polo Giraffe Shirt',
      unitPrice: 8.66,
      quantity: 1,
      lineTotal: 8.66,
      options: null
    }
  ],
  subtotal: 8.66,
  shippingCost: 0.00,
  discount: 0.00,
  tax: 0.00,
  total: 8.66
});

// Format price
const formatPrice = (price) => {
  return `$${parseFloat(price).toFixed(2)}`;
};

// Save tracking
const saveTracking = () => {
  alert('Tracking reference saved!');
  // TODO: Call API to save tracking
};

// Update status
const updateStatus = () => {
  alert(`Order status updated to: ${order.status}`);
  // TODO: Call API to update status
};

// Print order
const printOrder = () => {
  window.print();
};

// Send email
const sendEmail = () => {
  alert('Email sent to customer!');
  // TODO: Call API to send email
};

// Go to product
const goToProduct = (productId) => {
  router.push({ name: 'admin.products.edit', params: { id: productId } });
};
</script>

<style scoped>
.content-header {
  padding: 15px;
  border-bottom: 1px solid #f4f4f4;
  margin-bottom: 20px;
}

.content-header h3 {
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: 400;
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
  margin-bottom: 20px;
  overflow-x: visible;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f4f4f4;
}

.order-tracking-wrapper,
.order-information-wrapper,
.address-information-wrapper,
.items-ordered-wrapper,
.order-totals-wrapper {
  margin-bottom: 30px;
}

.order-information-buttons {
  float: right;
  margin-bottom: 10px;
}

.order-information-buttons .btn {
  margin-left: 5px;
}

.order h5,
.account-information h5,
.billing-address h5,
.shipping-address h5 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
}

.table {
  margin-bottom: 0;
}

.table td {
  padding: 10px;
  border-top: 1px solid #f4f4f4;
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
  line-height: 1.42857143;
  color: #555;
  background-color: #fff;
  border: 1px solid #d2d6de;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-control:focus {
  border-color: #3c8dbc;
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

label {
  display: inline-block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.btn {
  display: inline-block;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.42857143;
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
  background-color: #3c8dbc;
  border-color: #357ca5;
}

.btn-primary:hover {
  background-color: #357ca5;
  border-color: #2e6c96;
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
  color: #666;
  padding: 10px 0;
}

.table-responsive {
  width: 100%;
  overflow-x: visible;
}

.items-ordered .table th {
  background-color: #f9f9f9;
  font-weight: 600;
  padding: 12px 10px;
  border-bottom: 2px solid #f4f4f4;
}

.item-options {
  margin-top: 5px;
}

.item-options small {
  display: block;
  color: #999;
}

.order-totals-wrapper {
  margin-bottom: 30px;
}

.order-totals-container {
  display: flex;
  justify-content: flex-end;
}

.order-totals {
  width: 350px;
  margin-right: 15px;
}

.order-totals .table {
  border: 1px solid #f4f4f4;
}

.order-totals .table td {
  padding: 12px 15px;
}

.order-totals .table tr:last-child {
  background-color: #f9f9f9;
}

.order-totals .table tr:last-child td {
  font-size: 16px;
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

@media (max-width: 991px) {
  .col-md-6,
  .col-md-8,
  .col-md-10,
  .col-md-12 {
    width: 100%;
  }
}

@media (max-width: 1199px) {
  .col-lg-5,
  .col-lg-9 {
    width: 100%;
  }
}

@media print {
  .order-information-buttons,
  .breadcrumb,
  .order-tracking-wrapper {
    display: none;
  }
}
</style>
