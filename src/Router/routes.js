// Router/router.js
import { createWebHistory, createRouter } from "vue-router";
import Home from "../User/screens/Home/Home.vue";
import Header1 from "../User/components/Header/Header1.vue";
import Footer from "../User/components/Footer/Footer.vue";
import Product from "../User/screens/Product/Product.vue";
import ProductDetail from "../User/screens/ProductDetail/ProductDetail.vue";
import Blog from "../User/screens/Blog/Blog.vue";
import Login from "../User/screens/Login/Login.vue";
import SignUp from "../User/screens/SignUp/SignUp.vue";
import Forgotpass from "../User/screens/ForgotPassword/Forgotpass.vue";
import ResetPassword from "../User/screens/ForgotPassword/ResetPassword.vue";
import UserAccount from "../User/screens/Account/UserAccount.vue";
import Wishlist from "../User/components/Wishlist/Wishlist.vue";
import CartPage from "../User/screens/Cart/CartPage.vue";
import Address from "../User/screens/Address/Address.vue";
import Profile from "../User/screens/Profile/Profile.vue";
import NewAddress from "../User/components/NewAddress/NewAddress.vue";
import Checkout from "../User/screens/Checkout/Checkout.vue";
import OrderComplete from "../User/screens/OrderComplete/OrderComplete.vue";
import PaymentCancel from "@/User/screens/PaymentCancel/PaymentCancel.vue";
import MyOrder from "../User/components/MyOrder/MyOrder.vue";
import MyCases from "../User/components/MyCases/MyCases.vue";
import CaseDetail from "../User/components/CaseDetail/CaseDetail.vue";
import Review from "../User/screens/Review/Review.vue";
import Header from "../User/components/Header1/Header.vue";
import OAuth2 from '@/OAuth2/OAuth2.vue';
import Blogdetail from "../User/screens/BlogDetail/Blogdetail.vue";
import Orderdetail from "../User/components/Orderdetail/Orderdetail.vue";

import Layout from "../Admin/view/layout.vue";
import ProductIndex from "../Product/views/admin/products/partials/index.vue";
import ProductCreate from "../Product/views/admin/products/partials/create.vue";
import VariationIndex from "../Variation/index.vue";
import VariationCreate from "../Variation/create.vue";
import OptionIndex from "../Option/indext.vue";
import OptionCreate from "../Option/create.vue";
import OrderIndex from "../Order/indext.vue";
import OrderDetail from "../Order/detail.vue";
import BrandIndex from "../Brand/views/admin/brands/index.vue";
import BrandCreate from "../Brand/views/admin/brands/create.vue";
import BrandEdit from "../Brand/views/admin/brands/edit.vue";
import CategoryIndex from "../Category/index.vue";
import MediaIndex from "../Media/indext.vue";
import Dashboard from "../Dashboar/index.vue";
import CouponCreate from "../Coupons/create.vue";
import CouponIndex from "../Coupons/indext.vue";
import BlogIndex from "../Blog/index.vue";
import BlogCreate from "../Blog/create.vue";
import Contact from "../User/screens/Contact/Contact.vue";
import UserIndex from "../Admin/view/form/user.vue";
import ReviewIndex from "../Review/indext.vue";
import ReviewEdit from "../Review/edit.vue";
import FlashSaleIndex from "../Flashsale/indext.vue";
import FlashSaleCreate from "../Flashsale/create.vue";
import RefundIndex from "@/Refund/indext.vue";
import RefundDetail from "@/Refund/detail.vue";
import ReportIndex from "../Report/indext.vue";
import AttributeIndex from "../Attribute/Attributes/index.vue";
import AttributeCreate from "../Attribute/Attributes/create.vue";
import AttributeSetIndex from "../Attribute/AttributesSets/indext.vue";
import AttributeSetCreate from "../Attribute/AttributesSets/create.vue";

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/home', redirect: '/' },
  { path: '/header1', name: 'Header1', component: Header1 },
  { path: '/footer', name: 'AppFooter', component: Footer },
  { path: '/product', name: 'Product', component: Product },
  { path: '/productdetail/:id', name: 'ProductDetail', component: ProductDetail },
  { path: '/blog', name: 'Blog', component: Blog },
  { path: '/blogdetail/:id', name: 'BlogDetail', component: Blogdetail },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/login', name: 'Login', component: Login },
  { path: '/signup', name: 'SignUp', component: SignUp },
  { path: '/forgotpass', name: 'Forgotpass', component: Forgotpass },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPassword },
  { path: "/oauth2/callback/:provider", name: "OAuth2Callback", component: OAuth2 },
  { path: '/header', name: 'Header', component: Header},

  // === PRIVATE ROUTES ===
  { path: '/account', name: 'Account', component: UserAccount, meta: { requiresAuth: true } },
  { path: '/wishlist', name: 'Wishlist', component: Wishlist, meta: { requiresAuth: true } },
  { path: '/cart', name: 'CartPage', component: CartPage, meta: { requiresAuth: true } },
  { path: '/addresses', name: 'Address', component: Address, meta: { requiresAuth: true } },
  { path: '/profile', name: 'Profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/new-address', name: 'NewAddress', component: NewAddress, meta: { requiresAuth: true } },
  { path: '/edit-address/:id', name: 'EditAddress', component: NewAddress, meta: { requiresAuth: true } },
  { path: '/checkout', name: 'Checkout', component: Checkout, meta: { requiresAuth: true } },
  { path: '/order-complete/:id', name: 'OrderComplete', component: OrderComplete, meta: { requiresAuth: true } },
  { path: '/payment-cancel', name: 'PaymentCancel', component: PaymentCancel, meta: { requiresAuth: true } },
  { path: '/orders', name: 'MyOrder', component: MyOrder, meta: { requiresAuth: true } },
  { path: '/my-cases', name: 'MyCases', component: MyCases, meta: { requiresAuth: true } },
  { path: '/case-detail/:id', name: 'CaseDetail', component: CaseDetail, meta: { requiresAuth: true } },
  { path: '/review', name: 'Review', component: Review, meta: { requiresAuth: true } },
  { path: '/orderdetail/:id', name: 'Orderdetail', component: Orderdetail, meta: { requiresAuth: true } },
  { path: "/:pathMatch(.*)*", redirect: "/" },

  // Admin Routes
  {
        path: '/admin',
        component: Layout,
        meta: { requiresAuth: true, requiresAdmin: true },
        children: [
            {
                name: 'admin.dashboard',
                component: Dashboard,
                path: '',
            },
            {
                name: 'admin.products.index',
                component: ProductIndex,
                path: 'products',
            },
            {
                name: 'admin.products.create',
                component: ProductCreate,
                path: 'products/create',
            },
            {
                name: 'admin.products.edit',
                component: ProductCreate,
                path: 'products/:id/edit',
            },
            {
                name: 'admin.variations.index',
                component: VariationIndex,
                path: 'variations',
            },
            {
                name: 'admin.variations.create',
                component: VariationCreate,
                path: 'variations/create',
            },
            {
                name: 'admin.variations.edit',
                component: VariationCreate,
                path: 'variations/:id/edit',
            },
            {
                name: 'admin.options.index',
                component: OptionIndex,
                path: 'options',
            },
            {
                name: 'admin.options.create',
                component: OptionCreate,
                path: 'options/create',
            },
            {
                name: 'admin.options.edit',
                component: OptionCreate,
                path: 'options/:id/edit',
            },
            {
                name: 'admin.orders.index',
                component: OrderIndex,
                path: 'orders',
            },
            {
                name: 'admin.orders.detail',
                component: OrderDetail,
                path: 'orders/:id',
            },
            {
                name: 'admin.brands.index',
                component: BrandIndex,
                path: 'brands',
            },
            {
                name: 'admin.brands.create',
                component: BrandCreate,
                path: 'brands/create',
            },
            {
                name: 'admin.brands.edit',
                component: BrandEdit,
                path: 'brands/:id/edit',
            },
            {
                name: 'admin.attributes.index',
                component: AttributeIndex,
                path: 'attributes',
            },
            {
                name: 'admin.attributes.create',
                component: AttributeCreate,
                path: 'attributes/create',
            },
            {
                name: 'admin.attributes.edit',
                component: AttributeCreate,
                path: 'attributes/:id/edit',
            },
            {
                name: 'admin.attribute-sets.index',
                component: AttributeSetIndex,
                path: 'attribute-sets',
            },
            {
                name: 'admin.attribute-sets.create',
                component: AttributeSetCreate,
                path: 'attribute-sets/create',
            },
            {
                name: 'admin.attribute-sets.edit',
                component: AttributeSetCreate,
                path: 'attribute-sets/:id/edit',
            },
            {
                name: 'admin.coupons.index',
                component: CouponIndex,
                path: 'coupons',
            },
            {
                name: 'admin.coupons.create',
                component: CouponCreate,
                path: 'coupons/create',
            },
            {
                name: 'admin.coupons.edit',
                component: CouponCreate,
                path: 'coupons/:id/edit',
            },
            {
                name: 'admin.categories.index',
                component: CategoryIndex,
                path: 'categories',
            },
            {
                name: 'admin.media.index',
                component: MediaIndex,
                path: 'media',
            },
            {
                name: 'admin.blogs.index',
                component: BlogIndex,
                path: 'blogs',
            },
            {
                name: 'admin.blogs.create',
                component: BlogCreate,
                path: 'blogs/create',
            },
            {
                name: 'admin.blogs.edit',
                component: BlogCreate,
                path: 'blogs/:id/edit',
            },
            {
                name: 'admin.users.index',
                component: UserIndex,
                path: 'users',
            },
            {
                name: 'admin.users.create',
                component: UserIndex,
                path: 'users/create',
            },
            {
                name: 'admin.users.edit',
                component: UserIndex,
                path: 'users/:id/edit',
            },
            {
                name: 'admin.reviews.index',
                component: ReviewIndex,
                path: 'reviews',
            },
            {
                name: 'admin.reviews.edit',
                component: ReviewEdit,
                path: 'reviews/:id/edit',
            },
            {
                name: 'admin.flashsales.index',
                component: FlashSaleIndex,
                path: 'flashsales',
            },
            {
                name: 'admin.flashsales.create',
                component: FlashSaleCreate,
                path: 'flashsales/create',
            },
            {
                name: 'admin.flashsales.edit',
                component: FlashSaleCreate,
                path: 'flashsales/:id/edit',
            },
            {
                name: 'admin.cancellations.index',
                component: RefundIndex,
                path: 'refund',
            },
            {
                name: 'admin.cancellations.detail',
                component: RefundDetail,
                path: 'refund/:id',
            },
            {
                name: 'admin.reports.index',
                component: ReportIndex,
                path: 'reports',
            },
        ]
    },
];
const router = createRouter ({
    history:createWebHistory(),
    routes
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('accessToken');

  // Check if route requires authentication
  if (to.meta.requiresAuth && !token) {
    return next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  }

  // Check if route requires admin access
  if (to.meta.requiresAdmin && !token) {
    return next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  }

  // If already logged in and trying to access login page, redirect to home
  if (to.name === 'Login' && token) {
    return next({ path: '/' });
  }

  next();
});

export default router;
