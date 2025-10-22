import { createWebHistory, createRouter } from "vue-router";
import Home from "./User/screens/Home.vue";
import detailproduct from "./User/components/detailproduct.vue";
import Header1 from "./User/components/Header/Header1.vue";
import Footer from "./User/components/Footer/Footer.vue";
import product from "./User/components/Product/Product.vue";
import ProductDetail from "./User/components/ProductDetail/ProductDetail.vue";
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


const routes = [
    {
        name: 'Home',
        component: Home,
        path: '/',
    },
    {
        name: 'detailproduct',
        component: detailproduct,
        path: '/detail/:id'
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
        name: 'Checkout',
        component: Checkout,
        path: '/checkout',
    },
];
const router = createRouter ({
    history:createWebHistory(),
    routes
});

export default router;
