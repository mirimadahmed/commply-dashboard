import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

import store from './state/store'
import i18n from './i18n'
import router from './router/index'
import Vuelidate from 'vuelidate'

import BootstrapVue from 'bootstrap-vue'
import vco from "v-click-outside"
Vue.use(VueRouter)

import { initFirebaseBackend } from './authUtils'
import { configureFakeBackend } from './helpers/fake-backend';

const firebaseConfig = {
  apiKey: process.env.VUE_APP_APIKEY,
  authDomain: process.env.VUE_APP_AUTHDOMAIN,
  databaseURL: process.env.VUE_APP_VUE_APP_DATABASEURL,
  projectId: process.env.VUE_APP_PROJECTId,
  storageBucket: process.env.VUE_APP_STORAGEBUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGINGSENDERID,
  appId: process.env.VUE_APP_APPId,
  measurementId: process.env.VUE_APP_MEASUREMENTID
};

if (process.env.VUE_APP_DEFAULT_AUTH === "firebase") {
  initFirebaseBackend(firebaseConfig);
} else {
  configureFakeBackend();
}

import "@/design/index.scss";

Vue.use(BootstrapVue)
Vue.use(Vuelidate)
Vue.use(vco)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  fallbackLocale: 'en',
  render: h => h(App)
}).$mount('#app')
