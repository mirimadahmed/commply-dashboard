import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

import store from './state/store'
import i18n from './i18n'
import router from './router/index'
import Vuelidate from 'vuelidate'
import VueApexCharts from 'vue-apexcharts'

import BootstrapVue from 'bootstrap-vue'
import vco from "v-click-outside"
Vue.use(VueRouter)

import { configureFakeBackend } from './helpers/fake-backend';

configureFakeBackend();

import "@/design/index.scss";

Vue.use(BootstrapVue)
Vue.use(Vuelidate)
Vue.use(vco)
Vue.component('apexchart', VueApexCharts)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  fallbackLocale: 'en',
  render: h => h(App)
}).$mount('#app')
