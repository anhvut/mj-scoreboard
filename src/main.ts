import Vue, {createApp} from 'vue'
import VueMaterialAdapter from 'vue-material-adapter'
import App from './App.vue'
import i18n from "./i18n"
import store  from './store'

const app = createApp(App)
app.use(i18n)
app.use(VueMaterialAdapter)
app.use(store)
app.mount('#app')
