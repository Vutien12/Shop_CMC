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
import Review from "../User/screens/Review/Review.vue";
import Header from "../User/components/Header1/Header.vue";
import OAuth2 from '@/OAuth2/OAuth2.vue';
import Blogdetail from "../User/screens/BlogDetail/Blogdetail.vue";
import Orderdetail from "../User/components/Orderdetail/Orderdetail.vue";


const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/home', redirect: '/' },
  { path: '/header1', name: 'Header1', component: Header1 },
  { path: '/footer', name: 'AppFooter', component: Footer },
  { path: '/product', name: 'Product', component: Product },
  { path: '/productdetail/:id', name: 'ProductDetail', component: ProductDetail },
  { path: '/blog', name: 'Blog', component: Blog },
  { path: '/blogdetail/:id', name: 'BlogDetail', component: Blogdetail },
  { path: '/login', name: 'Login', component: Login },
  { path: '/signup', name: 'SignUp', component: SignUp },
  { path: '/forgotpass', name: 'Forgotpass', component: Forgotpass },
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
  { path: '/review', name: 'Review', component: Review, meta: { requiresAuth: true } },
  { path: '/orderdetail/:id', name: 'Orderdetail', component: Orderdetail, meta: { requiresAuth: true } },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];
const router = createRouter ({
    history:createWebHistory(),
    routes
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('accessToken');
  if (to.meta.requiresAuth && !token) {
    return next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  }
  if (to.name === 'Login' && token) {
    return next({ path: '/' });
  }
  next();
});

export default router;
