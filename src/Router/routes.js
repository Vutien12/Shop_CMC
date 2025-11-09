import { createWebHistory, createRouter } from "vue-router";
import Home from "../User/screens/Home/Home.vue";
import Header1 from "../User/components/Header/Header1.vue";
import Footer from "../User/components/Footer/Footer.vue";
import product from "../User/screens/Product/Product.vue";
import ProductDetail from "../User/screens/ProductDetail/ProductDetail.vue";
import Blog from "../User/screens/Blog/Blog.vue";
import Login from "../User/screens/Login/Login.vue";
import SignUp from "../User/screens/SignUp/SignUp.vue";
import Forgotpass from "../User/screens/ForgotPassword/Forgotpass.vue";
import Account from "../User/screens/Account/Account.vue";
import Wishlist from "../User/components/Wishlist/Wishlist.vue";
import CartPage from "../User/screens/Cart/CartPage.vue";
import Address from "../User/screens/Address/Address.vue";
import Profile from "../User/screens/Profile/Profile.vue";
import NewAddress from "../User/components/NewAddress/NewAddress.vue";
import Checkout from "../User/screens/Checkout/Checkout.vue";
import MyOrder from "../User/components/MyOrder/MyOrder.vue";
import Review from "../User/screens/Review/Review.vue";
import Header from "../User/components/Header1/Header.vue";
import OAuth2Callback from '@/Callback/OAuth2Callback.vue'


const routes = [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/home',
      redirect: '/'
    },
    {
        name: 'Header1',
        component: Header1,
        path: '/header1',
    },
    {
        name: 'AppFooter',
        component: Footer,
        path: '/footer',
    },
    {
        name: 'product',
        component: product,
        path: '/product',
    },
    {
        name: 'ProductDetail',
        component: ProductDetail,
        path: '/productdetail',
    },
    {
        name: 'Blog',
        component: Blog,
        path: '/blog',
    },
    {
        name: 'Login',
        component: Login,
        path: '/login',
    },
    {
        name: 'SignUp',
        component: SignUp,
        path: '/signup',
    },
    {
        name: 'Forgotpass',
        component: Forgotpass,
        path: '/forgotpass',
    },
    {
      path: "/oauth2/callback",
      name: "OAuth2Callback",
      component: OAuth2Callback
    },
    {
        name: 'Account',
        component: Account,
        path: '/account',
        meta: { requiresAuth: true },
    },
    {
        name: 'Wishlist',
        component: Wishlist,
        path: '/wishlist',
      meta: { requiresAuth: true },
    },
    {
        name: 'CartPage',
        component: CartPage,
        path: '/cart',
        meta: { requiresAuth: true },
    },
    {
        name: 'Address',
        component: Address,
        path: '/addresses',
        meta: { requiresAuth: true },
    },
    {
        name: 'Profile',
        component: Profile,
        path: '/profile',
        meta: { requiresAuth: true },
    },
    {
        name: 'NewAddress',
        component: NewAddress,
        path: '/new-address',
        meta: { requiresAuth: true },
    },
    {
        name: 'EditAddress',
        component: NewAddress,
        path: '/edit-address/:id',
        meta: { requiresAuth: true },
    },
    {
        name: 'Checkout',
        component: Checkout,
        path: '/checkout',
        meta: { requiresAuth: true },
    },
    {
        name: 'MyOrder',
        component: MyOrder,
        path: '/orders',
        meta: { requiresAuth: true },
    },
    {
        name: 'Review',
        component: Review,
        path: '/review',
        meta: { requiresAuth: true },
    },
    {
        name: 'Header',
        component: Header,
        path: '/header',
    },
    { path: "/:pathMatch(.*)*", redirect: "/" },
];
const router = createRouter ({
    history:createWebHistory(),
    routes
});


// Navigation guard
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('isLoggedIn');

  // Yêu cầu login
  if (to.meta.requiresAuth && !isLoggedIn) {
    return next('/login');
  }

  next();
});
export default router;
