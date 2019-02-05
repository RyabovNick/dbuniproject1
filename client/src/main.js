import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import moment from 'moment'

Vue.config.productionTip = false
Vue.prototype.$http = axios

Vue.filter('formatDate', value => {
    if (value) {
        return moment(String(value)).format('YYYY-MM-DD')
    }
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
