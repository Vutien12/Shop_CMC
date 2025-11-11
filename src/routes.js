import { createWebHistory, createRouter } from "vue-router";
import Home from "./User/screens/Home/Home.vue";
import Header1 from "./User/components/Header/Header1.vue";
import Footer from "./User/components/Footer/Footer.vue";
import product from "./User/screens/Product/Product.vue";
import ProductDetail from "./User/screens/ProductDetail/ProductDetail.vue";
import Blog from "./User/screens/Blog/Blog.vue";
import Login from "./User/screens/Login/Login.vue";
import SignUp from "./User/screens/SignUp/SignUp.vue";
import Forgotpass from "./User/screens/ForgotPassword/Forgotpass.vue";
import Account from "./User/screens/Account/Account.vue";
import Wishlist from "./User/components/Wishlist/Wishlist.vue";
import CartPage from "./User/screens/Cart/CartPage.vue";
import Address from "./User/screens/Address/Address.vue";
import Profile from "./User/screens/Profile/Profile.vue";
import NewAddress from "./User/components/NewAddress/NewAddress.vue";
import Checkout from "./User/screens/Checkout/Checkout.vue";
import MyOrder from "./User/components/MyOrder/MyOrder.vue";
import Review from "./User/screens/Review/Review.vue";
import Header from "./User/components/Header1/Header.vue";
import Mobile from "./User/components/Mobile/Mobile.vue";


const routes = [
    {
        name: 'Home',
        component: Home,
        path: '/',
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
        name: 'Account',
        component: Account,
        path: '/account',
    },
    {
        name: 'Wishlist',
        component: Wishlist,
        path: '/wishlist',
    },
    {
        name: 'CartPage',
        component: CartPage,
        path: '/cart',
    },
    {
        name: 'Address',
        component: Address,
        path: '/addresses',
    },
    {
        name: 'Profile',
        component: Profile,
        path: '/profile',
    },
    {
        name: 'NewAddress',
        component: NewAddress,
        path: '/new-address',
    },
    {
        name: 'EditAddress',
        component: NewAddress,
        path: '/edit-address/:id',
    },
    {
        name: 'Checkout',
        component: Checkout,
        path: '/checkout',
    },
    {
        name: 'MyOrder',
        component: MyOrder,
        path: '/orders',
    },
    {
        name: 'Review',
        component: Review,
        path: '/review',
    },
    {
        name: 'Header',
        component: Header,
        path: '/header',
    },
    {
        name: 'Mobile',
        component: Mobile,
        path: '/mobile',
    },
];
const router = createRouter ({
    history:createWebHistory(),
    routes
});

export default router;
