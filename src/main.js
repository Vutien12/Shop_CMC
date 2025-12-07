import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'
import router from '@/Router/routes.js'
import ToastContainer from '@/User/components/Toast/ToastContainer.vue';
import autoAnimate from '@formkit/auto-animate';

// Line Awesome Icons
import 'line-awesome/dist/line-awesome/css/line-awesome.min.css'

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faArrowLeft,
  faCartShopping,
  faGlobe,
  faChevronDown,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faUser,
  faPhone
} from '@fortawesome/free-solid-svg-icons'
import {
  faGoogle,
  faFacebook,
  faGithub
} from '@fortawesome/free-brands-svg-icons'

// Add icons to library
library.add(
  faArrowLeft,
  faCartShopping,
  faGlobe,
  faChevronDown,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faUser,
  faPhone,
  faGoogle,
  faFacebook,
  faGithub
)

const app = createApp(App)
const pinia = createPinia();

app.component('FontAwesomeIcon', FontAwesomeIcon)
app.use(pinia);
app.use(router)
app.component('ToastContainer', ToastContainer);
app.directive('auto-animate', {
  mounted(el) {
    autoAnimate(el);
  }
});
app.mount('#app')
