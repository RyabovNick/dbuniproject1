import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import axios from 'axios'
import router from './router'

import App from './App.vue'

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.use(Vuetify)

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
