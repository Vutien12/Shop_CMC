import { createApp } from 'vue'
import App from './App.vue'
import router from './routes'

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
  faFacebook
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
  faFacebook
)

const app = createApp(App)

app.component('FontAwesomeIcon', FontAwesomeIcon)
app.use(router)

app.mount('#app')
